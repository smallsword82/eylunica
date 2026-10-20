import { test, expect } from "@playwright/test";

test("doğru ve yanlış cevap aynı kısa Ajda Manifest sesini çalar", async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).answerClips = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      (window as any).answerClips.push(this);
      return original.call(this);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  for (const value of ["14", "15"]) {
    await page.getByRole("button", { name: value, exact: true }).click();
    await expect.poll(() => page.evaluate(() => {
      const audio = (window as any).answerClips.at(-1) as HTMLAudioElement;
      return audio && audio.src.includes("/ajda-manifest.mp3") && !audio.paused && audio.currentTime > 0;
    })).toBe(true);
    const duration = await page.evaluate(() => (window as any).answerClips.at(-1).duration as number);
    expect(duration).toBeGreaterThan(2.6);
    expect(duration).toBeLessThan(2.8);
  }
  await expect(page.getByRole("status")).toContainText("Harika");
  await page.getByRole("button", { name: "Mola ver" }).click();
  expect(await page.evaluate(() => (window as any).answerClips.at(-1).paused)).toBe(true);
  await expect(page.locator("iframe, video")).toHaveCount(0);
});
