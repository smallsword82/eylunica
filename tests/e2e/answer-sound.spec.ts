import { test, expect, openMathWorld } from "./local-test";

test("girişte bir Manifest sözü, sorularda sözsüz ses, bölüm bitiminde rastgele müzik çalar", async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).answerClips = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      (window as any).answerClips.push(this);
      return original.call(this);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await expect.poll(() => page.evaluate(() => (window as any).answerClips.filter((audio: HTMLAudioElement) => audio.src.includes("ajda-manifest")).length)).toBe(1);
  await openMathWorld(page, /Zihin Atölyesi/);
  for (const value of ["14", "15"]) {
    await page.getByRole("button", { name: value, exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as any).answerClips.filter((clip: HTMLAudioElement) => /answer-(tick|retry)\.wav$/.test(clip.src)).at(-1)?.src)).toContain(value === "14" ? "answer-retry.wav" : "answer-tick.wav");
    await expect.poll(() => page.evaluate(() => (window as any).answerClips.filter((clip: HTMLAudioElement) => /answer-(tick|retry)\.wav$/.test(clip.src)).at(-1)?.duration)).toBeLessThan(0.2);
  }
  await expect(page.getByRole("status")).toContainText("Harika");
  await page.getByRole("button", { name: "Sıradaki keşif →" }).click();
  for (const [index, value] of [15, 12, 14, 17].entries()) {
    await page.getByRole("button", { name: String(value), exact: true }).click();
    expect(await page.evaluate(() => (window as any).answerClips.filter((audio: HTMLAudioElement) => audio.src.includes("ajda-manifest")).length)).toBe(1);
    await page.getByRole("button", { name: index === 3 ? "Sahnedeki ışıklarını gör →" : "Sıradaki keşif →" }).click();
  }
  await expect(page.getByRole("heading", { name: "Her keşif bir adım." })).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as any).answerClips.filter((audio: HTMLAudioElement) => audio.src.includes("ajda-manifest")).length)).toBe(1);
  const celebration = await page.evaluateHandle(() => (window as any).answerClips.filter((audio: HTMLAudioElement) => audio.src.includes("/manifest/audio/") && audio.src.endsWith(".mp3") && !audio.src.includes("ajda-manifest")).at(-1));
  expect(await celebration.evaluate(audio => !!audio && !audio.paused)).toBe(true);
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  expect(await celebration.evaluate(audio => audio.paused)).toBe(true);
  expect(await page.evaluate(() => (window as any).answerClips.filter((audio: HTMLAudioElement) => audio.src.endsWith(".mp3") && !audio.paused).length)).toBe(0);
  await page.getByRole("button", { name: "Mola ver" }).click();
  expect(await page.evaluate(() => (window as any).answerClips.at(-1).paused)).toBe(true);
  await expect(page.locator("iframe, video")).toHaveCount(0);
});
