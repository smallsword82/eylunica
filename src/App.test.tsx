import { it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { fresh, KEY } from "./storage";
beforeEach(() => { localStorage.setItem(KEY, JSON.stringify({ ...fresh(), calibrationDone: true })); });
async function enter() {
  await userEvent.click(await screen.findByRole("button", { name: "eylunica’ya devam et →" }));
}
it("yalnız isimle giriş yapılır; isim değiştirmek mevcut yıldızları korur", async () => {
  const previous = { ...fresh(), stars: 12 };
  localStorage.setItem(KEY, JSON.stringify(previous));
  render(<App />);
  const input = await screen.findByLabelText("Adın");
  expect(input).toHaveValue("Eylül");
  await userEvent.clear(input);
  await userEvent.type(input, "Ada");
  await enter();
  await waitFor(() => expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({ ...previous, learnerName: "Ada" }));
  expect(screen.queryByLabelText(/Şifre/)).not.toBeInTheDocument();
});
it("karakter seçer ve yeniden açılışta korur", async () => {
  const user = userEvent.setup();
  const view = render(<App />);
  await enter();
  await screen.findByText("Bugün nerede buluşalım?");
  await user.click(screen.getByRole("button", { name: "Arkadaşını seç →" }));
  await user.click(
    screen.getByRole("button", { name: /Esin Birlikte paylaş/ }),
  );
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(KEY)!).character).toBe("Esin"),
  );
  view.unmount();
  render(<App />);
  await enter();
  await screen.findByText("Esin yanında.");
});
it("yanlış cevapta ipucu, tekrar deneme ve tek soru kaydı çalışır", async () => {
  const user = userEvent.setup();
  render(<App />);
  await enter();
  await screen.findByText("Bugün nerede buluşalım?");
  await user.click(screen.getByRole("button", { name: /^Akademiler/ }));
  await user.click(screen.getByRole("button", { name: /^Matematik Akademisi/ }));
  await user.click(screen.getByRole("button", { name: /Düzey 1Başla/ }));
  await user.click(screen.getByRole("button", { name: /Zihin Atölyesi/ }));
  await user.click(screen.getByRole("button", { name: "14" }));
  expect(screen.getByRole("status")).toHaveTextContent("Henüz olmadı");
  expect(screen.getByText("Onluğa tamamla")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "15" }));
  expect(screen.getByRole("status")).toHaveTextContent("Harika");
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(KEY)!).skills.add.attempts).toBe(1),
  );
  expect(JSON.parse(localStorage.getItem(KEY)!).stars).toBe(0);
});
it("doğru yanıtta yıldız verir ve aynı soruda tekrar ödüllendirmez", async () => {
  const user = userEvent.setup();
  render(<App />);
  await enter();
  await screen.findByText("Bugün nerede buluşalım?");
  await user.click(screen.getByRole("button", { name: /^Akademiler/ }));
  await user.click(screen.getByRole("button", { name: /^Matematik Akademisi/ }));
  await user.click(screen.getByRole("button", { name: /Düzey 1Başla/ }));
  await user.click(screen.getByRole("button", { name: /Zihin Atölyesi/ }));
  await user.click(screen.getByRole("button", { name: "15" }));
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(KEY)!).stars).toBe(1),
  );
  await user.click(screen.getByRole("button", { name: /Sıradaki keşif/ }));
  expect(screen.getByText(/Zihin Atölyesi · 2\/5/)).toBeVisible();
});

it("ayrı öğrenci adı seçilmez; eğitmen değişimi eski adı korur", async () => {
  const view = render(<App />);
  await screen.findByRole("heading", { name: "Eylül, sahne senin." });
  expect(screen.queryByLabelText("Öğrenci adı")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /Esin Birlikte paylaş/ }));
  await waitFor(() => expect(JSON.parse(localStorage.getItem(KEY)!)).toMatchObject({ learnerName: "Eylül", character: "Esin" }));
  expect(screen.getByRole("button", { name: /Mina Merakla keşfet/ })).toBeVisible();
  view.unmount();
  render(<App />);
  expect(await screen.findByRole("heading", { name: "Eylül, sahne senin." })).toBeVisible();
});

it("eğitmen seçimi bütün mevcut ilerlemeyi korur", async () => {
  const saved = fresh();
  saved.stars = 18;
  saved.skills.add.attempts = 7;
  saved.rewards = ["lights", "confetti"];
  saved.calibrationDone = true;
  localStorage.setItem(KEY, JSON.stringify(saved));
  const view = render(<App />);
  expect(await screen.findByRole("heading", { name: "Eylül, sahne senin." })).toBeVisible();
  expect(screen.queryByText("Bugün nerede buluşalım?")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /Lidya Adım adım ilerle/ }));
  await waitFor(() => expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({ ...saved, character: "Lidya" }));
  await enter();
  view.unmount();
  render(<App />);
  expect(await screen.findByRole("button", { name: /Lidya Adım adım ilerle/ })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("status")).toHaveTextContent("18 yıldızın");
});

it("eski özel öğrenci adı ve ilerleme kaybolmaz", async () => {
  const previous = { ...fresh(), character: "Beren", customCharacter: { character: "Beren", name: "Ada" } };
  delete previous.learnerName;
  localStorage.setItem(KEY, JSON.stringify(previous));
  render(<App />);
  expect(await screen.findByRole("heading", { name: "Ada, sahne senin." })).toBeVisible();
  expect(screen.getByRole("button", { name: /Esin Birlikte paylaş/ })).toHaveAttribute("aria-pressed", "true");
});
