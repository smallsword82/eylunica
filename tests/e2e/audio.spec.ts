import { test, expect } from "@playwright/test";

test("kısa cevap efekti önceden hazırdır ve hemen başlar", async ({ page }) => {
  await page.addInitScript(() => {
    const OriginalAudio = window.Audio;
    const state = { answer: null as HTMLAudioElement | null, clicked: 0, requested: 0, started: 0 };
    (window as any).answerTiming = state;
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this.src.endsWith("/answer-tick.wav")) state.requested = performance.now();
      return originalPlay.call(this);
    };
    window.Audio = class extends OriginalAudio {
      constructor(source?: string) {
        super(source);
        if (source?.endsWith("/answer-tick.wav")) {
          state.answer = this;
          this.addEventListener("playing", () => { state.started = performance.now(); });
        }
      }
    };
    document.addEventListener("click", event => {
      if ((event.target as HTMLElement).closest("button")?.textContent === "15") state.clicked = performance.now();
    }, true);
  });
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => (window as any).answerTiming.answer?.readyState)).toBe(4);
  await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as any).answerTiming.started)).toBeGreaterThan(0);
  const delay = await page.evaluate(() => {
    const timing = (window as any).answerTiming;
    return timing.started - timing.clicked;
  });
  const requestDelay = await page.evaluate(() => {
    const timing = (window as any).answerTiming;
    return timing.requested - timing.clicked;
  });
  expect(requestDelay).toBeLessThan(100);
  expect(delay).toBeLessThan(750);
  console.info(`Cevap sesi: play çağrısı ${requestDelay.toFixed(1)} ms, tarayıcı başlangıcı ${delay.toFixed(1)} ms`);
  await page.getByRole("button", { name: "Sıradaki keşif →" }).click();
  expect(await page.evaluate(() => (window as any).answerTiming.answer.duration)).toBeLessThan(0.2);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("silent");
  expect(await page.evaluate(() => (window as any).answerTiming.answer.paused)).toBe(true);
});
test("ses tercihi çevrimdışı korunur, efekt üretilir ve karakter adları günceldir", async ({ page, context }) => {
  await page.goto("/"); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  const sound = page.getByRole("combobox", { name: "Ses modu" });
  await expect(sound).toHaveValue("music");
  await sound.selectOption("silent");
  await page.evaluate(() => {
    const original = HTMLMediaElement.prototype.play;
    (window as unknown as { soundCount: number }).soundCount = 0;
    HTMLMediaElement.prototype.play = function() {
      (window as unknown as { soundCount: number }).soundCount++;
      return original.call(this);
    };
  });
  await sound.selectOption("effects");
  await expect(sound).toHaveValue("effects");
  await expect.poll(() => page.evaluate(() => (window as unknown as { soundCount: number }).soundCount)).toBeGreaterThan(0);
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { soundCount: number }).soundCount)).toBeGreaterThan(1);
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await page.getByRole("button", { name: "Arkadaşını seç →" }).click();
  for (const name of ["Lidya", "Hilal", "Esin", "Mina", "Zeynep", "Sueda"])
    await expect(page.getByRole("button", { name: new RegExp(`${name} `) }).first()).toBeVisible();
  await page.getByRole("button", { name: /Zeynep Kısa yolları keşfet/ }).click();
  await page.getByLabel("Öğrenci adı").fill("Deniz");
  await page.getByRole("button", { name: "Adımı kaydet" }).click();
  await expect(page.getByRole("button", { name: /Zeynep Kısa yolları keşfet/ })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await context.setOffline(true);
  await page.reload(); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await expect(sound).toHaveValue("effects");
  await expect(page.getByRole("heading", { name: "Sahne senin, Deniz!" })).toBeVisible();
  await sound.selectOption("silent");
  await page.reload(); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await expect(sound).toHaveValue("silent");
  await expect(page.getByLabel("1 yıldız", { exact: true })).toBeVisible();
});

test("müzik kesiti ekran geçişinde yeniden başlamaz; Sessiz modu konuşmayı da kapatır", async ({ page }) => {
  await page.goto("/"); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await expect(page.getByRole("combobox", { name: "Ses modu" })).toHaveValue("music");
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("silent");
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await expect(page.getByRole("button", { name: "Yönergeyi dinle" })).toBeDisabled();
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("music");
  await page.evaluate(() => {
    (window as any).idleSynthCalls = 0;
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { (window as any).idleSynthCalls++; return original.call(this); };
  });
  await page.getByRole("button", { name: "Yönergeyi dinle" }).waitFor({ state: "visible" });
  expect(await page.getByRole("button", { name: "Yönergeyi dinle" }).isEnabled()).toBe(true);
  await page.getByRole("button", { name: "RİTMA ana sayfa" }).click();
  await page.getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ }).click();
  await page.getByRole("button", { name: /Kısa metinler/ }).click();
  await page.getByRole("button", { name: "RİTMA ana sayfa" }).click();
  await page.getByRole("button", { name: /^Dikkat ve Odaklanma Akademisi/ }).click();
  await page.getByRole("button", { name: /Farklı olanı bul/ }).click();
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
  expect(await page.evaluate(() => (window as any).idleSynthCalls)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("silent");
  await expect(page.getByRole("button", { name: "Yönergeyi dinle" })).toBeDisabled();
});
