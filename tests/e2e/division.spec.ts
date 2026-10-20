import { test, expect, openMathWorld } from "./local-test";
import { fresh } from "../../src/storage";

for (const level of [1, 3, 5]) for (const keyboard of [false, true]) {
  test(`Bölme Adası düzey ${level}, ${keyboard ? "yazarak" : "seçenekle"}: 1/5'ten 5/5'e ve sonuca ilerler`, async ({ page, context }, testInfo) => {
    const progress = fresh();
    progress.skills.divide.level = level;
    await page.addInitScript(value => { if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(value)); }, progress);
    await page.goto("/");
    await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    await openMathWorld(page, /Bölme Adası/);
    if (keyboard) await page.getByRole("button", { name: "Kendim yazayım" }).click();
    for (let index = 0; index < 5; index++) {
      await expect(page.getByRole("progressbar", { name: "Görev ilerlemesi" })).toHaveAttribute("aria-valuenow", String(index + 1));
      await expect(page.getByText(`Soru ${index + 1} / 5`, { exact: true })).toBeVisible();
      const operands = (await page.locator(".equation").innerText()).match(/\d+/g)!.map(Number);
      const correct = operands[0] / operands[1];
      expect(Number.isInteger(correct)).toBe(true);
      if (index === 0) {
        if (keyboard) {
          await page.getByLabel("Yanıtın", { exact: true }).fill(String(correct + 1));
          await page.getByRole("button", { name: "Kontrol edelim →" }).click();
        } else {
          const choices = page.locator(".answer-options button");
          for (const choice of await choices.all()) if (Number(await choice.innerText()) !== correct) { await choice.click(); break; }
        }
        await expect(page.getByRole("status")).toContainText("Henüz olmadı");
        await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
      }
      if (keyboard) {
        await page.getByLabel("Yanıtın", { exact: true }).fill(String(correct));
        await page.getByRole("button", { name: "Kontrol edelim →" }).click();
      } else await page.locator(".answer-options").getByRole("button", { name: String(correct), exact: true }).click();
      await expect(page.getByRole("status")).toContainText("Harika");
      const next = page.getByRole("button", { name: index === 4 ? "Sahnedeki ışıklarını gör →" : "Sıradaki keşif →" });
      await expect(next).toBeFocused();
      const bounds = (await next.boundingBox())!;
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(page.viewportSize()!.height);
      if (index === 0 && level === 1 && !keyboard) {
        await page.screenshot({ path: testInfo.outputPath("division-first-answer.png"), fullPage: true });
        await page.locator(".question-panel").screenshot({ path: testInfo.outputPath("division-continue.png") });
      }
      await next.click();
    }
    await expect(page.getByRole("heading", { name: "Her keşif bir adım." })).toBeVisible();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!));
    expect(saved.skills.divide.attempts).toBe(5);
    expect(saved.stars).toBe(4);
    expect(saved.mathSections.divide).toBe(1);
    await expect(page.getByRole("region", { name: "Tamamlanan bölüm" })).toContainText("Bölüm 1 tamamlandı");
    await page.getByRole("button", { name: "Devam et", exact: true }).click();
    await expect(page.getByRole("region", { name: "Bölüm durumun" })).toContainText("Bölüm 2");
    await page.reload();
    await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
    await openMathWorld(page, /Bölme Adası/);
    await expect(page.getByRole("region", { name: "Bölüm durumun" })).toContainText("Bölüm 2");
  });
}
