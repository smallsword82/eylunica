import { test, expect } from "@playwright/test";

for (const needsSupport of [false, true]) test(`yeni öğrenci uyarlanan seviye tespitini bitirir; ${needsSupport ? "destek" : "ileri"} düzeyi korunur`, async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("eylunica-local-session", "yes"));
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await expect(page.getByRole("heading", { name: "Bugün nerede buluşalım?" })).toBeVisible();
  await expect(page.locator(".equation")).toHaveCount(0);
  await page.getByRole("button", { name: /^Matematik Akademisi/ }).click();
  for (let index = 0; index < 12; index++) {
    await expect(page.getByText(`Soru ${index + 1} / 12`, { exact: true })).toBeVisible();
    const equation = await page.locator(".equation").innerText();
    const [first, second] = equation.match(/\d+/g)!.map(Number);
    const result = [first + second, first - second, first * second, first / second][index % 4];
    if (needsSupport) {
      for (const choice of await page.locator(".answer-options button").all()) if (Number(await choice.innerText()) !== result) { await choice.click(); break; }
      await expect(page.getByRole("status")).toContainText("Henüz olmadı");
    }
    await page.locator(".answer-options").getByRole("button", { name: String(result), exact: true }).click();
    await page.getByRole("button", { name: index === 11 ? "Sahnedeki ışıklarını gör →" : "Sıradaki keşif →" }).click();
  }
  await expect(page.getByRole("region", { name: "Başlangıç seviyelerin" })).toContainText("Seviye tespitin tamamlandı");
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!));
  expect(saved.calibrationDone).toBe(true);
  for (const skill of Object.values(saved.skills) as { level: number }[]) expect(skill.level).toBe(needsSupport ? 1 : 5);
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await expect(page.getByRole("region", { name: "Bölüm durumun" })).toContainText(`Zorluk: ${needsSupport ? 1 : 5} / 5`);
  await page.reload();
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await expect(page.getByRole("heading", { name: "Bugün nerede buluşalım?" })).toBeVisible();
});
