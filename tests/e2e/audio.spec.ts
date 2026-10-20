import { test, expect } from "@playwright/test";
test("ses tercihi çevrimdışı korunur, efekt üretilir ve karakter adları günceldir", async ({ page, context }) => {
  await page.goto("/");
  const sound = page.getByRole("combobox", { name: "Ses modu" });
  await expect(sound).toHaveValue("silent");
  await page.evaluate(() => {
    const original = AudioContext.prototype.createOscillator;
    (window as unknown as { soundCount: number }).soundCount = 0;
    AudioContext.prototype.createOscillator = function() {
      (window as unknown as { soundCount: number }).soundCount++;
      return original.call(this);
    };
  });
  await sound.selectOption("effects");
  await expect(sound).toHaveValue("effects");
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
  await expect(sound).toHaveValue("effects");
  await expect(page.getByText("Deniz yanında.")).toBeVisible();
  await sound.selectOption("silent");
  await page.reload();
  await expect(sound).toHaveValue("silent");
  await expect(page.getByLabel("1 yıldız", { exact: true })).toBeVisible();
});

test("Müzik ve Efektler ders ekranlarında müzik başlatmaz; Sessiz modu konuşmayı da kapatır", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("combobox", { name: "Ses modu" })).toHaveValue("silent");
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await expect(page.getByRole("button", { name: "Yönergeyi dinle" })).toBeDisabled();
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("music");
  await page.evaluate(() => {
    (window as any).idleSynthCalls = 0;
    const original = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function () { (window as any).idleSynthCalls++; return original.call(this); };
  });
  await page.getByRole("button", { name: "Yönergeyi dinle" }).waitFor({ state: "visible" });
  expect(await page.getByRole("button", { name: "Yönergeyi dinle" }).isEnabled()).toBe(true);
  await page.getByRole("button", { name: "Matematik Sahnesi ana sayfa" }).click();
  await page.getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ }).click();
  await page.getByRole("button", { name: /Kısa metinler/ }).click();
  await page.getByRole("button", { name: "Matematik Sahnesi ana sayfa" }).click();
  await page.getByRole("button", { name: /^Dikkat ve Odaklanma Akademisi/ }).click();
  await page.getByRole("button", { name: /Farklı olanı bul/ }).click();
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
  expect(await page.evaluate(() => (window as any).idleSynthCalls)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("silent");
  await expect(page.getByRole("button", { name: "Yönergeyi dinle" })).toBeDisabled();
});
