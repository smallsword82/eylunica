import { test, expect, openMathWorld } from "./local-test";

test("bölüm kartları sırayla kazanılır, koleksiyon ve bölüm numarası yeniden açılışta korunur", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await openMathWorld(page, /Toplama Ormanı/);
  for (const character of ["Mina", "Lidya"]) {
    for (let index = 0; index < 5; index++) {
      const [first, second] = (await page.locator(".equation").innerText()).match(/\d+/g)!.map(Number);
      await page.locator(".answer-options").getByRole("button", { name: String(first + second), exact: true }).click();
      await page.getByRole("button", { name: index === 4 ? "Sahnedeki ışıklarını gör →" : "Sıradaki keşif →" }).click();
    }
    const opener = page.getByRole("button", { name: "Kart paketini aç" });
    await expect(opener).toBeFocused();
    await expect(opener).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: testInfo.outputPath(`pack-${character}.png`) });
    const savedCards = await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!).cards);
    if (character === "Lidya") await page.emulateMedia({ reducedMotion: "reduce" });
    await opener.press("Enter");
    if (character === "Mina") await expect(page.locator(".pack-reward")).toHaveClass(/pack-opening/);
    await expect(page.getByRole("region", { name: "Bölüm ödülün" })).toContainText(`${character} kartı kazandın`);
    await expect(page.locator(".pack-revealed-card")).toBeFocused();
    const photo = await page.locator(".pack-revealed-card img").boundingBox();
    expect(photo!.height).toBeGreaterThan(200);
    expect(photo!.width).toBeGreaterThan(180);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!).cards)).toEqual(savedCards);
    await page.screenshot({ path: testInfo.outputPath(`revealed-${character}.png`) });
    if (character === "Mina") await page.getByRole("button", { name: "Devam et", exact: true }).click();
  }
  await page.screenshot({ path: testInfo.outputPath("earned-card.png"), fullPage: true });
  await page.getByRole("button", { name: "Kart koleksiyonum", exact: true }).click();
  await expect(page.getByText("2 / 24 farklı kart · 2 toplam kart", { exact: true })).toBeVisible();
  await expect(page.locator(".collectible-card.collected")).toHaveCount(2);
  await page.screenshot({ path: testInfo.outputPath("card-collection.png"), fullPage: true });
  await page.reload();
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: "Kart koleksiyonum", exact: true }).click();
  await expect(page.locator(".collectible-card.collected")).toHaveCount(2);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("eski kartlar 24 görsele dönüşür; tüm fotoğraflar çevrimdışı yüklenir", async ({ page, context }, testInfo) => {
  const { fresh } = await import("../../src/storage");
  const { characters } = await import("../../src/game");
  const { collectibleCards } = await import("../../src/game/cards");
  const saved = fresh();
  saved.cards = { counts: Object.fromEntries(characters.map(character => [character.name, 4])), grants: ["legacy"], last: { character: "Sueda", source: "Eski bölüm" } };
  saved.stars = 45;
  await page.addInitScript(progress => {
    if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(progress));
  }, saved);
  await page.goto("/");
  await page.getByRole("button", { name: "Kart koleksiyonum", exact: true }).click();
  await expect(page.getByText("24 / 24 farklı kart · 24 toplam kart", { exact: true })).toBeVisible();
  await expect(page.locator(".collectible-card.collected")).toHaveCount(24);
  await expect(page.getByLabel("45 yıldız", { exact: true })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: "Kart koleksiyonum", exact: true }).click();
  await page.evaluate(async cards => {
    await Promise.all(cards.map(async card => {
      const photo = new Image();
      photo.src = card.image;
      await photo.decode();
      if (!photo.naturalWidth) throw new Error(card.id);
    }));
  }, collectibleCards);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 320, height: 640 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("collection-phone.png") });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: testInfo.outputPath("complete-collection.png"), fullPage: true });
  await expect(page.getByText("24 / 24 farklı kart · 24 toplam kart", { exact: true })).toBeVisible();
});
