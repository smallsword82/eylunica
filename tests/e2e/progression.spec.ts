import { test, expect, openMathWorld } from "./local-test";
import { fresh } from "../../src/storage";
import { stories } from "../../src/reading-engine";
test("matematik kolay başlar, beş doğruyla zorlaşır; yeniden giriş aynı soruyu sormaz", async ({ page }) => {
  const seen = new Set<string>();
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await openMathWorld(page, /Toplama Ormanı/);
  for (let index = 0; index < 5; index++) {
    const operands = (await page.locator(".equation").innerText()).match(/\d+/g)!.map(Number);
    const key = operands.sort((first, second) => first - second).join(":");
    expect(seen.has(key)).toBe(false); seen.add(key);
    expect(operands[0] + operands[1]).toBeLessThanOrEqual(10);
    await page.getByRole("button", { name: String(operands[0] + operands[1]), exact: true }).click();
    await page.getByRole("button", { name: index === 4 ? "Sahnedeki ışıklarını gör →" : "Sıradaki keşif →" }).click();
  }
  await expect(page.getByRole("region", { name: "Tamamlanan bölüm" })).toContainText("Zorluk yükseldi");
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await expect(page.getByRole("region", { name: "Bölüm durumun" })).toContainText("Bölüm 2");
  const operands = (await page.locator(".equation").innerText()).match(/\d+/g)!.map(Number);
  expect(operands[0] + operands[1]).toBeGreaterThan(10);
  await expect(page.getByRole("region", { name: "Bölüm durumun" })).toContainText("Zorluk: 2 / 5");
  expect(seen.has(operands.sort((first, second) => first - second).join(":"))).toBe(false);
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await openMathWorld(page, /Zihin Atölyesi/);
  const first = await page.locator(".equation").innerText();
  const numbers = first.match(/\d+/g)!.map(Number);
  await page.getByRole("button", { name: String(numbers[0] + numbers[1]), exact: true }).click();
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await openMathWorld(page, /Zihin Atölyesi/);
  expect(await page.locator(".equation").innerText()).not.toBe(first);
});
test("yarım okuma oturumu yeni sorudan sürer; tamamlanan kütüphane başa sarmaz", async ({ page }) => {
  const progress = fresh();
  const question = stories[0].questions[0];
  progress.academies.reading.seen[question.id] = 1;
  await page.addInitScript(value => { if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(value)); }, progress);
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ }).click();
  await page.getByRole("button", { name: /Sıradaki yeni hikâye/ }).click();
  await expect(page.getByRole("heading", { name: stories[0].questions[1].prompt, exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: question.prompt, exact: true })).toHaveCount(0);
  const allSeen = Object.fromEntries(stories.flatMap(story => story.questions.map(question => [question.id, 1])));
  await page.evaluate(value => {
    const progress = JSON.parse(localStorage.getItem("ritma-progress-v1")!);
    progress.academies.reading.seen = value;
    localStorage.setItem("ritma-progress-v1", JSON.stringify(progress));
  }, allSeen);
  await page.reload();
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ }).click();
  await page.getByRole("button", { name: /Sıradaki yeni hikâye/ }).click();
  await expect(page.getByRole("heading", { name: "Tüm hikâyeleri keşfettin!" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Yanıtımı kontrol et →" })).toHaveCount(0);
});

test("yarım konserin matematik adımı doğru akademiye kaydedilir", async ({ page }) => {
  const progress = fresh();
  progress.academies.concert.seen = { "concert2-1-0-read": 1, "concert2-1-0-focus": 1 };
  await page.addInitScript(value => localStorage.setItem("ritma-progress-v1", JSON.stringify(value)), progress);
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: "Büyük Konser Görevi →" }).click();
  await page.getByRole("button", { name: "Konser hazırlığına başla →" }).click();
  await expect(page.getByRole("heading", { name: "Konser notu" })).toBeVisible();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await page.getByRole("button", { name: "Yanıtımı kontrol et →" }).click();
  await page.getByRole("button", { name: "Görevi tamamla →" }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!));
  expect(saved.skills.add.attempts).toBe(1);
  expect(saved.academies.reading.attempts).toBe(0);
  expect(saved.academies.attention.attempts).toBe(0);
  expect(saved.academies.concert.attempts).toBe(1);
  expect(saved.stars).toBe(1);
});
