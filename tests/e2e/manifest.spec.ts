import { test, expect, openSoundSettings } from "./local-test";

test("Eylül başrolde; gerçek eğitmen fotoğrafları ve kısa müzikler videosuz, çevrimdışı çalışır", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Eylül, sahne senin." })).toBeVisible();
  await expect(page.getByLabel("Öğrenci adı")).toHaveCount(0);
  for (const name of ["Mina", "Lidya", "Hilal", "Esin", "Zeynep", "Sueda"])
    await expect(page.getByRole("img", { name: `${name}, Manifest eğitmeni`, exact: true }).first()).toBeVisible();
  expect(await page.locator(".character-card img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await expect(page.locator("video, iframe")).toHaveCount(0);
  await page.getByRole("button", { name: /Sueda Sahneyi birleştir/ }).click();
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await expect(page.getByRole("heading", { name: "Bugün nerede buluşalım?" })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await openSoundSettings(page);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("music");
  await openSoundSettings(page);
  await page.getByText("Müzik ayarları", { exact: true }).click();
  await page.getByRole("combobox", { name: "Kısa şarkı seç" }).selectOption("ariyo");
  await page.evaluate(() => {
    (window as any).manifestPlayed = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      (window as any).manifestPlayed.push(this);
      return original.call(this);
    };
  });
  await page.getByRole("button", { name: "12 saniye dinle" }).click();
  await expect.poll(() => page.evaluate(() => {
    const audio = (window as any).manifestPlayed.at(-1) as HTMLAudioElement;
    return audio && !audio.paused && audio.duration > 0;
  })).toBe(true);
  const clip = await page.evaluate(() => {
    const audio = (window as any).manifestPlayed.at(-1) as HTMLAudioElement;
    return { src: audio.src, duration: audio.duration, volume: audio.volume, loop: audio.loop };
  });
  expect(clip.src).toContain("/manifest/audio/ariyo.mp3");
  expect(clip.duration).toBeLessThan(12.1);
  expect(clip.volume).toBe(0.35);
  expect(clip.loop).toBe(false);
  await openSoundSettings(page);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("silent");
  expect(await page.evaluate(() => (window as any).manifestPlayed.at(-1).paused)).toBe(true);
  await page.getByRole("button", { name: "Manifest müzik odası →" }).click();
  await page.getByLabel("Ritim sorusunun yanıtı").fill("8");
  await page.getByRole("button", { name: "Birlikte kontrol edelim →" }).click();
  await expect(page.getByRole("status")).toContainText("Harika, Eylül!");
  await expect(page.locator("video, iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await page.screenshot({ path: "test-results/manifest-home-mobile.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
