import { test, expect } from "@playwright/test";
import { manifestTracks } from "../../src/audio/manifest-catalog";

test("varsayılan müzik açık, tek tıkla dinleme ve tüm katalog çevrimdışı sesli; rastgele sıra ilerler", async ({ page, context }) => {
  test.setTimeout(45000);
  await page.addInitScript(() => {
    (window as any).clips = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() { (window as any).clips.push(this); return original.call(this); };
  });
  await page.goto("/");
  await expect(page.getByRole("combobox", { name: "Ses modu" })).toHaveValue("music");
  await expect(page.getByRole("button", { name: "12 saniye dinle" })).toBeEnabled();
  await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" }).locator("option")).toHaveCount(manifestTracks.length);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("silent");
  await page.getByRole("button", { name: "12 saniye dinle" }).click();
  await expect(page.getByRole("combobox", { name: "Ses modu" })).toHaveValue("music");
  await expect.poll(() => page.evaluate(() => {
    const audio = (window as any).clips.at(-1) as HTMLAudioElement;
    return audio && !audio.paused && audio.currentTime > 0;
  })).toBe(true);
  await page.getByRole("button", { name: "Sesi durdur" }).click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByLabel("Öğrenci adı")).toHaveValue("Eylül");
  const decoded = await page.evaluate(async tracks => {
    const audioContext = new AudioContext();
    const results = [];
    try {
      for (const track of tracks) {
        const response = await fetch(`./manifest/audio/${track.id}.mp3`);
        if (!response.ok) throw new Error(track.title);
        const buffer = await audioContext.decodeAudioData(await response.arrayBuffer());
        const samples = buffer.getChannelData(0);
        let sum = 0;
        for (const sample of samples) sum += sample * sample;
        results.push({ id: track.id, duration: buffer.duration, rms: Math.sqrt(sum / samples.length) });
      }
    } finally { await audioContext.close(); }
    return results;
  }, manifestTracks);
  expect(decoded).toHaveLength(27);
  for (const track of decoded) {
    expect(track.duration).toBeGreaterThan(11.9);
    expect(track.duration).toBeLessThan(12.1);
    expect(track.rms).toBeGreaterThan(0.01);
  }
  await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await expect(page.getByRole("button", { name: "Rastgele çal" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Rastgele çal" }).click();
  const first = await page.evaluate(() => (window as any).clips.at(-1).src as string);
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  expect(await page.evaluate(() => (window as any).clips.at(-1).src as string)).toBe(first);
  expect(await page.evaluate(() => (window as any).clips.at(-1).paused)).toBe(false);
  await expect.poll(() => page.evaluate(() => (window as any).clips.at(-1).src as string), { timeout: 18000 }).not.toBe(first);
  await page.getByRole("button", { name: "Sesi durdur" }).click();
  expect(await page.evaluate(() => (window as any).clips.at(-1).paused)).toBe(true);
  await expect(page.locator("iframe,video")).toHaveCount(0);
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await page.screenshot({ path: "test-results/manifest-shuffle-mobile.png", fullPage: true });
});
