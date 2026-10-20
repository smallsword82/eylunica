import { test, expect } from "@playwright/test";
import { fresh, type Progress } from "../../src/storage";
import { placementTask } from "../../src/lesson-engine/placement";

for (const academy of ["reading", "attention"] as const) for (const support of [false, true]) {
  test(`${academy}: ilk giriş değerlendirmesi ${support ? "destek" : "ileri"} düzeyi seçer, kayıt ve yeni ders korunur`, async ({ page }) => {
    const previous = fresh();
    previous.calibrationDone = true;
    previous.stars = 12;
    await page.addInitScript(value => {
      sessionStorage.setItem("eylunica-local-session", "yes");
      Math.random = () => .5;
      if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(value));
    }, previous);
    await page.goto("/");
    await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
    const entry = academy === "reading" ? /^Okuduğunu Anlama Akademisi/ : /^Dikkat ve Odaklanma Akademisi/;
    await page.getByRole("button", { name: entry }).click();
    await expect(page.getByRole("region", { name: "Seviye tespiti" })).toBeVisible();
    for (let index = 0; index < 6; index++) {
      const saved: Progress = await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!));
      const task = placementTask(academy, index, saved.academies[academy].level, saved.academies[academy], () => .5)!;
      await expect(page.locator(".activity-prompt")).toHaveAttribute("aria-label", task.prompt);
      const choices = page.getByRole("group", { name: "Yanıt seçenekleri" }).getByRole("button");
      if (task.memory) await page.getByRole("button", { name: "Hazırım, kartları kapat" }).click();
      if (task.evidence) await page.getByRole("button", { name: new RegExp(`^Kanıt cümlesi ${task.evidence[0] + 1}:`) }).click();
      if (support && !task.sequence) {
        await choices.nth((task.answer + 1) % task.choices.length).click();
        await page.getByRole("button", { name: "Yanıtımı kontrol et →" }).click();
        await expect(page.getByRole("status")).toContainText("Henüz olmadı");
      } else if (support) await page.getByRole("button", { name: /Bir ipucu al/ }).click();
      if (task.sequence) for (const position of task.sequence) await choices.nth(position).click();
      else await choices.nth(task.answer).click();
      await page.getByRole("button", { name: "Yanıtımı kontrol et →" }).click();
      await page.getByRole("button", { name: index === 5 ? "Görevi tamamla →" : "Sonraki keşif →" }).click();
    }
    await expect(page.getByRole("heading", { name: "Seviye tespitin tamamlandı!" })).toBeVisible();
    await page.getByRole("button", { name: "Kart paketini aç" }).click();
    await expect(page.getByRole("region", { name: "Bölüm ödülün" })).toContainText("Mina kartı kazandın");
    const saved: Progress = await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!));
    expect(saved.academies[academy].placementDone).toBe(true);
    expect(saved.academies[academy].level).toBe(support ? 1 : 3);
    expect(saved.academies[academy].attempts).toBe(6);
    expect(saved.skills).toEqual(previous.skills);
    expect(saved.stars).toBeGreaterThanOrEqual(12);
    await page.getByRole("button", { name: "Devam et", exact: true }).click();
    await expect(page.locator(".activity-panel")).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
    await page.getByRole("button", { name: entry }).click();
    await expect(page.getByRole("region", { name: "Seviye tespiti" })).toHaveCount(0);
    if (academy === "reading") await expect(page.getByRole("button", { name: new RegExp(`Sıradaki yeni hikâye · Düzey ${support ? 1 : 3}`) })).toBeVisible();
  });
}
