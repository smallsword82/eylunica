import { test, expect } from "./local-test";

test("tüm soru alanlarında sözlü şarkı engellenir; sözsüz fon çevrimdışı ve sessiz modla uyumludur", async ({ page, context }) => {
  await page.addInitScript(() => {
    (window as any).studyClips = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() { (window as any).studyClips.push(this); return original.call(this); };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await context.setOffline(true);
  for (const name of [/Zihin Atölyesi/, /^Okuduğunu Anlama Akademisi/, /^Dikkat ve Odaklanma Akademisi/, /Büyük Konser Görevi/, /eylunica Hız Arenası/]) {
    await page.getByRole("button", { name }).click();
    await expect(page.getByText("Sözsüz odak müziği", { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as any).studyClips.some((audio: HTMLAudioElement) => !audio.paused && audio.loop && audio.currentTime > .05))).toBe(true);
    expect(await page.evaluate(() => (window as any).studyClips.filter((audio: HTMLAudioElement) => audio.src.includes("/manifest/audio/") && audio.src.endsWith(".mp3") && !audio.paused).length)).toBe(0);
    if (!await page.getByRole("button", { name: "12 saniye dinle", exact: true }).isVisible()) await page.getByText("Müzik ayarları", { exact: true }).click();
    await expect(page.getByRole("button", { name: "12 saniye dinle", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "eylunica ana sayfa" }).click();
  }
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("effects");
  expect(await page.evaluate(() => (window as any).studyClips.filter((audio: HTMLAudioElement) => audio.loop && !audio.paused).length)).toBe(0);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("silent");
  expect(await page.evaluate(() => (window as any).studyClips.filter((audio: HTMLAudioElement) => !audio.paused).length)).toBe(0);
  const info = await page.evaluate(async () => {
    const context = new AudioContext();
    try {
      const response = await fetch("./audio/study-ambient.wav");
      const audio = await context.decodeAudioData(await response.arrayBuffer());
      const samples = audio.getChannelData(0);
      return { duration: audio.duration, peak: samples.reduce((peak, value) => Math.max(peak, Math.abs(value)), 0) };
    } finally { await context.close(); }
  });
  expect(info.duration).toBe(24);
  expect(info.peak).toBeGreaterThan(.1);
});
