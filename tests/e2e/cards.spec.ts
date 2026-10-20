import { test, expect } from "./local-test";

test("bölüm kartları sırayla kazanılır, koleksiyon ve bölüm numarası yeniden açılışta korunur", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: /Toplama Ormanı/ }).click();
  for (const character of ["Mina", "Lidya"]) {
    for (let index = 0; index < 5; index++) {
      const [first, second] = (await page.locator(".equation").innerText()).match(/\d+/g)!.map(Number);
      await page.locator(".answer-options").getByRole("button", { name: String(first + second), exact: true }).click();
      await page.getByRole("button", { name: index === 4 ? "Sahnedeki ışıklarını gör →" : "Sıradaki keşif →" }).click();
    }
    await expect(page.getByRole("region", { name: "Bölüm ödülün" })).toContainText(`${character} kartı kazandın`);
    if (character === "Mina") await page.getByRole("button", { name: "Devam et", exact: true }).click();
  }
  await page.screenshot({ path: testInfo.outputPath("earned-card.png"), fullPage: true });
  await page.getByRole("button", { name: "Kart koleksiyonum", exact: true }).click();
  await expect(page.getByText("2 / 6 farklı eğitmen kartı · 2 toplam kart", { exact: true })).toBeVisible();
  await expect(page.locator(".collectible-card.collected")).toHaveCount(2);
  await page.screenshot({ path: testInfo.outputPath("card-collection.png"), fullPage: true });
  await page.reload();
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: "Kart koleksiyonum", exact: true }).click();
  await expect(page.locator(".collectible-card.collected")).toHaveCount(2);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});
