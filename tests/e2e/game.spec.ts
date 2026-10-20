import { test, expect } from "@playwright/test";
test("telefon: görev, kayıt, yeniden açılış ve çevrimdışı oyun", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.getByText("Bugün nerede buluşalım?")).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await page.getByRole("button", { name: "14", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Henüz olmadı");
  await expect(page.getByText("Onluğa tamamla")).toBeVisible();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Harika");
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await page.getByRole("button", { name: "Arkadaşını seç →" }).click();
  await page.getByRole("button", { name: /Arya Birlikte paylaş/ }).click();
  await page.getByRole("button", { name: "Maceraya dön →" }).click();
  await page.screenshot({
    path: "test-results/mobile-home.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("Arya yanında.")).toBeVisible();
  await page.getByRole("button", { name: /Toplama Ormanı/ }).click();
  await page.getByRole("button", { name: "Kendim yazayım" }).click();
  const equation = await page.getByRole("heading", { level: 1 }).innerText();
  const numbers = equation.match(/\d+/g)!.map(Number);
  await page
    .getByLabel("Yanıtın", { exact: true })
    .fill(String(numbers[0] + numbers[1]));
  await page.getByRole("button", { name: "Kontrol edelim →" }).click();
  await expect(page.getByRole("status")).toContainText("Harika");
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("ritma-progress-v1")!).stars,
      ),
    )
    .toBe(1);
  await page.reload();
  await expect(page.getByLabel("1 yıldız", { exact: true })).toBeVisible();
});
test("masaüstü: dört işlem, gelişim görünümü ve sıfırlama onayı", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  for (const title of [
    "Toplama Ormanı",
    "Çıkarma Vadisi",
    "Çarpma Şehri",
    "Bölme Adası",
  ]) {
    await page.getByRole("button", { name: new RegExp(title) }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("button", { name: "← Haritaya dön" }).click();
  }
  await page.screenshot({
    path: "test-results/desktop-home.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Ebeveyn köşesi →" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page
    .getByRole("button", { name: "Bu cihazdaki ilerlemeyi sıfırla" })
    .click();
  await expect(
    page.getByRole("button", { name: "Evet, sıfırla" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Vazgeç" }).click();
});

test("erişilebilirlik: ana ekran ve görev WCAG A/AA kontrolleri", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.goto("/");
  await expect(page.getByText("Bugün nerede buluşalım?")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("beş soruluk görev tamamlanır, yıldız ve sahne dekoru kalıcıdır", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  for (const [i, value] of [15, 15, 12, 14, 17].entries()) {
    await page
      .getByRole("button", { name: String(value), exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("Harika");
    await page
      .getByRole("button", {
        name: i === 4 ? "Sahnedeki ışıklarını gör →" : "Sıradaki keşif →",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Her keşif bir adım." }),
  ).toBeVisible();
  await expect(
    page.getByText("✦ Sahnenin renkli ışıkları açıldı!"),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("5 yıldız", { exact: true })).toBeVisible();
  await expect(page.locator(".stage")).toHaveClass(/lit/);
});
