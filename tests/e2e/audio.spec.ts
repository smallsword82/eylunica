import { test, expect } from "@playwright/test";
test("ses tercihi çevrimdışı korunur, efekt üretilir ve karakter adları günceldir", async ({ page, context }) => {
  await page.goto("/");
  const sound = page.getByRole("button", { name: "Ses efektleri" });
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await page.evaluate(() => {
    const original = AudioContext.prototype.createOscillator;
    (window as unknown as { soundCount: number }).soundCount = 0;
    AudioContext.prototype.createOscillator = function() {
      (window as unknown as { soundCount: number }).soundCount++;
      return original.call(this);
    };
  });
  await sound.click();
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.evaluate(() => (window as unknown as { soundCount: number }).soundCount)).toBeGreaterThan(0);
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { soundCount: number }).soundCount)).toBeGreaterThan(2);
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await page.getByRole("button", { name: "Arkadaşını seç →" }).click();
  for (const name of ["Eylül", "Alara", "Beren", "Mina", "Öykü", "Defne"])
    await expect(page.getByRole("button", { name: new RegExp(`${name} `) }).first()).toBeVisible();
  await page.getByRole("button", { name: /Öykü Kısa yolları keşfet/ }).click();
  await page.getByLabel("Karaktere vereceğin ad").fill("Deniz");
  await page.getByRole("button", { name: "Bu adı seçtiğim karaktere ver" }).click();
  await expect(page.getByRole("button", { name: /Deniz Kısa yolları keşfet/ })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Deniz yanında.")).toBeVisible();
  await sound.click();
  await page.reload();
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByLabel("1 yıldız", { exact: true })).toBeVisible();
});
