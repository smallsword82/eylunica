import { it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { fresh, KEY } from "./storage";
async function enter() {
  await userEvent.click(await screen.findByRole("button", { name: "RİTMA’ya devam et →" }));
}
it("karakter seçer ve yeniden açılışta korur", async () => {
  const user = userEvent.setup();
  const view = render(<App />);
  await enter();
  await screen.findByText("Bugün nerede buluşalım?");
  await user.click(screen.getByRole("button", { name: "Arkadaşını seç →" }));
  await user.click(
    screen.getByRole("button", { name: /Beren Birlikte paylaş/ }),
  );
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(KEY)!).character).toBe("Beren"),
  );
  view.unmount();
  render(<App />);
  await enter();
  await screen.findByText("Beren yanında.");
});
it("yanlış cevapta ipucu, tekrar deneme ve tek soru kaydı çalışır", async () => {
  const user = userEvent.setup();
  render(<App />);
  await enter();
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
  await enter();
  await screen.findByText("Bugün nerede buluşalım?");
  await user.click(screen.getByRole("button", { name: /Zihin Atölyesi/ }));
  await user.click(screen.getByRole("button", { name: "15" }));
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(KEY)!).stars).toBe(1),
  );
  await user.click(screen.getByRole("button", { name: /Sıradaki keşif/ }));
  expect(screen.getByText(/Zihin Atölyesi · 2\/5/)).toBeVisible();
});

it("yalnızca bir karaktere özel ad verir ve cihazda korur", async () => {
  const user = userEvent.setup();
  const view = render(<App />);
  await enter();
  await screen.findByText("Bugün nerede buluşalım?");
  await user.click(screen.getByRole("button", { name: "Arkadaşını seç →" }));
  await user.type(screen.getByLabelText("Karaktere vereceğin ad"), "Deniz");
  await user.click(screen.getByRole("button", { name: "Bu adı seçtiğim karaktere ver" }));
  await waitFor(() => expect(JSON.parse(localStorage.getItem(KEY)!).customCharacter).toEqual({ character: "Mina", name: "Deniz" }));
  await user.click(screen.getByRole("button", { name: /Beren Birlikte paylaş/ }));
  await user.type(screen.getByLabelText("Karaktere vereceğin ad"), "Ada");
  await user.click(screen.getByRole("button", { name: "Bu adı seçtiğim karaktere ver" }));
  expect(screen.getByRole("button", { name: /Mina Merakla keşfet/ })).toBeVisible();
  expect(screen.getByRole("button", { name: /Ada Birlikte paylaş/ })).toBeVisible();
  view.unmount();
  render(<App />);
  await enter();
  await screen.findByText("Ada yanında.");
  await user.click(screen.getByRole("button", { name: "Arkadaşını seç →" }));
  await user.click(screen.getByRole("button", { name: "Özel adı kaldır" }));
  expect(screen.getByRole("button", { name: /Beren Birlikte paylaş/ })).toBeVisible();
});

it("RİTMA girişinde karakter değiştirirken bütün mevcut ilerlemeyi korur", async () => {
  const saved = fresh();
  saved.stars = 18;
  saved.skills.add.attempts = 7;
  saved.rewards = ["lights", "confetti"];
  saved.calibrationDone = true;
  saved.customCharacter = { character: "Mina", name: "Deniz" };
  localStorage.setItem(KEY, JSON.stringify(saved));
  const view = render(<App />);
  expect(await screen.findByRole("heading", { name: "Her macera bir arkadaşla başlar." })).toBeVisible();
  expect(screen.queryByText("Bugün nerede buluşalım?")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Deniz Merakla keşfet/ })).toHaveAttribute("aria-pressed", "true");
  await userEvent.click(screen.getByRole("button", { name: /Eylül Adım adım ilerle/ }));
  await waitFor(() => expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({ ...saved, character: "Eylül" }));
  await enter();
  expect(screen.getByText("Bugün nerede buluşalım?")).toBeVisible();
  view.unmount();
  render(<App />);
  expect(await screen.findByRole("button", { name: /Eylül Adım adım ilerle/ })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("status")).toHaveTextContent("18 yıldızın");
});
