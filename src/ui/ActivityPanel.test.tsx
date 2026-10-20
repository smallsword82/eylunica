import { enableEffects } from "../audio";
import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActivityPanel } from "./ActivityPanel";
import { stories } from "../reading-engine";
import { generateAttention } from "../attention-engine";
it("doğru seçenek tek başına yetmez; kanıt ve yanıt kontrol edilir, tekrar puan yazılmaz", async () => {
  const user = userEvent.setup(),
    record = vi.fn(),
    next = vi.fn(),
    q = stories[0].questions[0];
  render(<ActivityPanel task={q} onRecord={record} onNext={next} />);
  expect(
    screen.getByRole("button", { name: "Yanıtımı kontrol et →" }),
  ).toBeDisabled();
  await user.click(screen.getByRole("button", { name: q.choices[q.answer] }));
  await user.click(screen.getByRole("button", { name: /Kanıt cümlesi 1:/ }));
  await user.click(
    screen.getByRole("button", { name: "Yanıtımı kontrol et →" }),
  );
  expect(record).toHaveBeenCalledWith(
    expect.objectContaining({ correct: false, hint: true }),
  );
  expect(screen.getByText(q.explanation)).toBeVisible();
  await user.click(screen.getByRole("button", { name: /Kanıt cümlesi 4:/ }));
  await user.click(
    screen.getByRole("button", { name: "Yanıtımı kontrol et →" }),
  );
  expect(record).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: "Sonraki keşif →" }));
  expect(next).toHaveBeenCalledOnce();
});
it("hafıza kartları kendiliğinden kapanmaz, yeniden bakma ipucu sayılır", async () => {
  const user = userEvent.setup(),
    record = vi.fn(),
    q = generateAttention("memory", 1, () => 0);
  render(<ActivityPanel task={q} onRecord={record} onNext={() => {}} />);
  expect(
    screen.queryByRole("button", { name: q.choices[q.answer] }),
  ).toBeNull();
  await user.click(
    screen.getByRole("button", { name: "Hazırım, kartları kapat" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Kartlara yeniden bak (ipucu)" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Hazırım, kartları kapat" }),
  );
  await user.click(screen.getByRole("button", { name: q.choices[q.answer] }));
  await user.click(
    screen.getByRole("button", { name: "Yanıtımı kontrol et →" }),
  );
  expect(record).toHaveBeenCalledWith(
    expect.objectContaining({ correct: true, hint: true }),
  );
});
it("sıralı yönerge eksik adımda kabul edilmez; sıfırlayıp doğru sırayla çözülebilir", async () => {
  const user = userEvent.setup(),
    record = vi.fn(),
    q = generateAttention("instructions", 1, () => 0);
  render(<ActivityPanel task={q} onRecord={record} onNext={() => {}} />);
  await user.click(screen.getByRole("button", { name: q.choices[1] }));
  expect(
    screen.getByRole("button", { name: "Yanıtımı kontrol et →" }),
  ).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Sırayı yeniden seç" }));
  for (const i of q.sequence!)
    await user.click(screen.getByRole("button", { name: q.choices[i] }));
  await user.click(
    screen.getByRole("button", { name: "Yanıtımı kontrol et →" }),
  );
  expect(record).toHaveBeenCalledWith(
    expect.objectContaining({ correct: true, hint: false }),
  );
});

it("hikâyeyi dinleme isteği öğrenme kaydında destek sayılır", async () => {
  enableEffects(true);
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  try {
    const user = userEvent.setup(), record = vi.fn(), listen = vi.fn();
    const q = stories[0].questions[0];
    const view = render(<ActivityPanel task={q} onRecord={record} onNext={vi.fn()} onListen={listen} />);
    await user.click(screen.getByRole("button", { name: "Hikâyeyi dinle" }));
    expect(play).toHaveBeenCalledOnce();
    expect(listen).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: q.choices[q.answer] }));
    await user.click(screen.getByRole("button", { name: new RegExp(`Kanıt cümlesi ${q.evidence![0] + 1}:`) }));
    await user.click(screen.getByRole("button", { name: "Yanıtımı kontrol et →" }));
    expect(record).toHaveBeenCalledWith(expect.objectContaining({ correct: true, hint: true }));
    view.unmount();
    expect(pause).toHaveBeenCalled();
  } finally { enableEffects(false); play.mockRestore(); pause.mockRestore(); }
});
