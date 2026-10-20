import { test, expect } from "@playwright/test";

test("RİTMA karakter seçimi, kayıt koruma ve erişilebilir giriş", async ({ page }) => {
  const { fresh } = await import("../../src/storage");
  const saved = fresh();
  saved.stars = 23;
  saved.rewards = ["lights", "confetti"];
  saved.skills.multiply.level = 3;
  saved.skills.multiply.attempts = 12;
  await page.addInitScript(progress => {
    if (!localStorage.getItem("ritma-progress-v1"))
      localStorage.setItem("ritma-progress-v1", JSON.stringify(progress));
  }, saved);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Her macera bir arkadaşla başlar." })).toBeVisible();
  await expect(page.getByRole("button", { name: /Mina Merakla keşfet/ })).toHaveAttribute("aria-pressed", "true");
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/ritma-welcome-mobile.png", fullPage: true });
  await page.getByRole("button", { name: /Eylül Adım adım ilerle/ }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!))).toEqual({ ...saved, character: "Eylül" });
  await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await expect(page.getByText("Bugün nerede buluşalım?")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: /Eylül Adım adım ilerle/ })).toHaveAttribute("aria-pressed", "true");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "test-results/ritma-welcome-desktop.png", fullPage: true });
});
