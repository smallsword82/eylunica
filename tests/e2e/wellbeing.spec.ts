import { test, expect, openMathWorld, type Page } from "./local-test";
const minute = 60_000,
  key = "ritma-wellbeing-v1";
async function installClock(page: Page, time: Date) {
  await page.clock.install({ time });
  await page.clock.pauseAt(new Date(time.getTime() + 1000));
}
async function total(page: Page) {
  return page.evaluate(
    (k) =>
      Object.values(
        JSON.parse(localStorage.getItem(k) || '{"days":{}}').days,
      ).reduce(
        (sum: number, d: any) =>
          sum + d.math + d.reading + d.attention + d.other,
        0,
      ),
    key,
  );
}
async function math(page: Page) {
  await openMathWorld(page, /Zihin Atölyesi/);
}
async function answer(page: Page, value: number) {
  await page.getByRole("button", { name: String(value), exact: true }).click();
  await page.getByRole("button", { name: /Sıradaki keşif/ }).click();
}
async function settings(page: Page) {
  await page.getByRole("button", { name: "Ebeveyn köşesi →" }).click();
}
async function main(page: Page) {
  await page
    .getByRole("button", { name: "← Haritaya dön", exact: true })
    .click();
}

test("serbest kullanım: 15 dakika geçişte bilgi, 25/45 dakikada mola; pause puan silmez", async ({
  page,
}) => {
  await installClock(page, new Date(2026, 9, 20, 12));
  await page.goto("/"); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await math(page);
  await page.clock.fastForward(15 * minute);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await answer(page, 15);
  await expect(
    page.getByRole("heading", { name: "Günlük öğrenme hedefin tamamlandı" }),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Devam et" }),
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Mola ver", exact: true })
    .click();
  const before = await total(page);
  await page.clock.fastForward(30 * minute);
  expect(await total(page)).toBe(before);
  await expect(
    page.getByRole("heading", { name: "Mola zamanı" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hazırım, devam et" }).click();
  await expect(page.getByLabel("1 yıldız", { exact: true })).toBeVisible();
  await page.clock.fastForward(10 * minute);
  await answer(page, 15);
  await expect(
    page.getByRole("heading", { name: "Kısa bir mola?" }),
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Devam et" })
    .click();
  await page.clock.fastForward(19 * minute);
  await answer(page, 12);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.clock.fastForward(minute);
  await answer(page, 14);
  await expect(
    page.getByRole("heading", { name: "Kısa bir mola?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Devam et" }),
  ).toBeVisible();
});

test("ebeveyn sınırı açık soruyu bitirtir, yenisini durdurur; ayarlar çevrimdışı korunur", async ({
  page,
  context,
}) => {
  await installClock(page, new Date(2026, 9, 20, 12));
  await page.goto("/"); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await context.setOffline(true);
  await settings(page);
  await page
    .getByRole("radio", { name: "Günlük süre sınırı", exact: true })
    .check();
  await page.getByLabel("Günlük sınır (dakika)", { exact: true }).fill("1");
  await page
    .getByRole("checkbox", { name: "Mola hatırlatmaları açık" })
    .uncheck();
  await page.getByRole("button", { name: "Süre ayarlarını kaydet" }).click();
  await main(page);
  await math(page);
  await page.clock.fastForward(2 * minute);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await answer(page, 15);
  await expect(
    page.getByRole("heading", { name: "Bugünkü oyun süresi tamamlandı" }),
  ).toBeVisible();
  await page.reload(); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await math(page);
  await expect(
    page.getByRole("heading", { name: "Bugünkü oyun süresi tamamlandı" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ebeveyn ayarlarını aç" }).click();
  await expect(
    page.getByLabel("Günlük sınır (dakika)", { exact: true }),
  ).toHaveValue("1");
  await expect(
    page.getByRole("checkbox", { name: "Mola hatırlatmaları açık" }),
  ).not.toBeChecked();
  // The same daily rule applies to all three academies and combined concerts.
  for (const kind of ["reading", "attention", "concert"]) {
    await main(page);
    if (kind === "reading") {
      await page
        .getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ })
        .click();
      await page.getByRole("button", { name: /Kısa metinler/ }).click();
    } else if (kind === "attention") {
      await page
        .getByRole("button", { name: /^Dikkat ve Odaklanma Akademisi/ })
        .click();
      await page.getByRole("button", { name: /Farklı olanı bul/ }).click();
    } else {
      await page.getByRole("button", { name: "Büyük Konser Görevi →" }).click();
      await page
        .getByRole("button", { name: "Konser hazırlığına başla →" })
        .click();
    }
    await expect(
      page.getByRole("heading", { name: "Bugünkü oyun süresi tamamlandı" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Ebeveyn ayarlarını aç" }).click();
  }
  await page
    .getByRole("radio", { name: "Serbest kullanım (varsayılan)" })
    .check();
  await page.getByRole("button", { name: "Süre ayarlarını kaydet" }).click();
  await main(page);
  await math(page);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByLabel("1 yıldız", { exact: true })).toBeVisible();
});

test("ön plan, bölümler ve ebeveyn raporu; arka plan sinyali ve ebeveyn süresi dışlanır", async ({
  page,
}) => {
  await installClock(page, new Date(2026, 9, 20, 12));
  await page.goto("/"); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await math(page);
  await page.clock.fastForward(5 * minute);
  const before = await total(page);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await page.clock.fastForward(30 * minute);
  expect(await total(page)).toBe(before);
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page
    .getByRole("button", { name: "eylunica ana sayfa" })
    .click();
  await page
    .getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ })
    .click();
  await page.getByRole("button", { name: /Kısa metinler/ }).click();
  await page.clock.fastForward(6 * minute);
  await page
    .getByRole("button", { name: "eylunica ana sayfa" })
    .click();
  await page
    .getByRole("button", { name: /^Dikkat ve Odaklanma Akademisi/ })
    .click();
  await page.getByRole("button", { name: /Farklı olanı bul/ }).click();
  await page.clock.fastForward(3 * minute);
  await settings(page);
  const counted = await total(page);
  await page.clock.fastForward(30 * minute);
  expect(await total(page)).toBe(counted);
  const values = await page.evaluate(
    (k) => Object.values(JSON.parse(localStorage.getItem(k)!).days)[0] as any,
    key,
  );
  expect(Math.abs(values.math - 5 * minute)).toBeLessThan(1000);
  expect(Math.abs(values.reading - 6 * minute)).toBeLessThan(1000);
  expect(Math.abs(values.attention - 3 * minute)).toBeLessThan(1000);
  await expect(
    page.getByRole("heading", { name: "Bu cihazdaki etkin kullanım" }),
  ).toBeVisible();
  await expect(page.getByText("Son 7 takvim günü (bugün dahil)")).toBeVisible();
  await page.clock.resume();
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("sınır ekranı erişilebilir, yeni yerel gün sayacı sıfırlar ve görev yeniden açılır", async ({
  page,
}) => {
  await installClock(page, new Date(2026, 9, 20, 23, 58));
  await page.goto("/"); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await settings(page);
  await page
    .getByRole("radio", { name: "Günlük süre sınırı", exact: true })
    .check();
  await page.getByLabel("Günlük sınır (dakika)", { exact: true }).fill("1");
  await page.getByRole("button", { name: "Süre ayarlarını kaydet" }).click();
  await main(page);
  await math(page);
  await page.clock.fastForward(minute);
  await answer(page, 15);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.clock.resume();
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.clock.pauseAt(
    new Date((await page.evaluate(() => Date.now())) + 250),
  );
  await page.clock.fastForward(minute);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: /Sıradaki keşif/ }).click();
  await expect(page.getByText(/Zihin Atölyesi · 2\/5/)).toBeVisible();
  await expect(page.getByLabel("1 yıldız", { exact: true })).toBeVisible();
});
