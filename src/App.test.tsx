import { it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { KEY } from "./storage";
it("karakter seçer ve yeniden açılışta korur", async () => {
  const user = userEvent.setup();
  const view = render(<App />);
  await screen.findByText("Bugün nerede buluşalım?");
  await user.click(screen.getByRole("button", { name: "Arkadaşını seç →" }));
  await user.click(
    screen.getByRole("button", { name: /Arya Birlikte paylaş/ }),
  );
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(KEY)!).character).toBe("Arya"),
  );
  view.unmount();
  render(<App />);
  await screen.findByText("Arya yanında.");
});
it("yanlış cevapta ipucu, tekrar deneme ve tek soru kaydı çalışır", async () => {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByText("Bugün nerede buluşalım?");
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
  await screen.findByText("Bugün nerede buluşalım?");
  await user.click(screen.getByRole("button", { name: /Zihin Atölyesi/ }));
  await user.click(screen.getByRole("button", { name: "15" }));
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(KEY)!).stars).toBe(1),
  );
  await user.click(screen.getByRole("button", { name: /Sıradaki keşif/ }));
  expect(screen.getByText(/Zihin Atölyesi · 2\/5/)).toBeVisible();
});
