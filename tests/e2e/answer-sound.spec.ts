import { test, expect } from "./local-test";

test("sorularda sözsüz efekt, yalnız bölüm bitiminde Ajda Manifest çalar", async ({ page }) => {
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
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  for (const value of ["14", "15"]) {
    await page.getByRole("button", { name: value, exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as any).answerClips.filter((clip: HTMLAudioElement) => /answer-(tick|retry)\.wav$/.test(clip.src)).at(-1)?.src)).toContain(value === "14" ? "answer-retry.wav" : "answer-tick.wav");
    await expect.poll(() => page.evaluate(() => (window as any).answerClips.filter((clip: HTMLAudioElement) => /answer-(tick|retry)\.wav$/.test(clip.src)).at(-1)?.duration)).toBeLessThan(0.2);
  }
  await expect(page.getByRole("status")).toContainText("Harika");
  await page.getByRole("button", { name: "Sıradaki keşif →" }).click();
  for (const [index, value] of [15, 12, 14, 17].entries()) {
    await page.getByRole("button", { name: String(value), exact: true }).click();
    expect(await page.evaluate(() => (window as any).answerClips.filter((audio: HTMLAudioElement) => audio.src.includes("ajda-manifest")).length)).toBe(0);
    await page.getByRole("button", { name: index === 3 ? "Sahnedeki ışıklarını gör →" : "Sıradaki keşif →" }).click();
  }
  await expect(page.getByRole("heading", { name: "Her keşif bir adım." })).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as any).answerClips.filter((audio: HTMLAudioElement) => audio.src.includes("ajda-manifest")).length)).toBe(1);
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  expect(await page.evaluate(() => (window as any).answerClips.at(-1).paused)).toBe(false);
  await page.getByRole("button", { name: "Mola ver" }).click();
  expect(await page.evaluate(() => (window as any).answerClips.at(-1).paused)).toBe(true);
  await expect(page.locator("iframe, video")).toHaveCount(0);
});
