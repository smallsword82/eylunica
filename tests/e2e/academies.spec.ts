import { test, expect, type Page } from "@playwright/test";
import { stories } from "../../src/reading-engine";
const key = "ritma-progress-v1";
const readingButton = (page: Page) =>
  page.getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ });
const attentionButton = (page: Page) =>
  page.getByRole("button", { name: /^Dikkat ve Odaklanma Akademisi/ });
async function check(page: Page) {
  await page.getByRole("button", { name: "Yanıtımı kontrol et →" }).click();
}
async function back(page: Page) {
  await page.getByRole("button", { name: "← Akademilere dön" }).click();
}

test("okuma: eski kayıt korunur, altı beceri tamamlanır ve çevrimdışı geri gelir", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    const k = "ritma-progress-v1";
    if (localStorage.getItem(k)) return;
    const s = {
      level: 2,
      correct: 1,
      attempts: 2,
      hints: 1,
      streak: 0,
      recent: [false, true],
      lastPlayed: 10,
    };
    localStorage.setItem(
      k,
      JSON.stringify({
        version: 1,
        character: "Elya",
        stars: 10,
        rewards: ["lights"],
        calibrationDone: true,
        history: [],
        skills: { add: s, subtract: s, multiply: s, divide: s },
      }),
    );
  });
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await readingButton(page).click();
  await page.getByRole("button", { name: /Kısa metinler/ }).click();
  for (const [i, q] of stories[0].questions.entries()) {
    await page
      .getByRole("button", { name: q.choices[q.answer], exact: true })
      .click();
    await page
      .getByRole("button", {
        name: new RegExp(`^Kanıt cümlesi ${q.evidence![0] + 1}:`),
      })
      .click();
    await check(page);
    await expect(
      page.getByText("Harika! Yanıtını dikkatle düşündün."),
    ).toBeVisible();
    if (i === 0)
      await page.screenshot({
        path: "test-results/reading-mobile.png",
        fullPage: true,
      });
    await page
      .getByRole("button", {
        name: i === 5 ? "Görevi tamamla →" : "Sonraki keşif →",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Birlikte yeni yollar keşfettik!" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        (k) => JSON.parse(localStorage.getItem(k)!).academies.reading.correct,
        key,
      ),
    )
    .toBe(6);
  await page.reload();
  await expect(page.getByText("Defne yanında.")).toBeVisible();
  await expect(page.getByLabel("16 yıldız", { exact: true })).toBeVisible();
  const p = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    key,
  );
  expect(p.version).toBe(2);
  expect(p.skills.add.attempts).toBe(2);
  expect(p.academies.reading.level).toBe(2);
  expect(p.academies.attention.attempts).toBe(0);
  expect(Object.keys(p.academies.reading.bySkill)).toHaveLength(6);
  await readingButton(page).click();
  await expect(
    page.getByRole("button", { name: /DÜZEY 2 · SANA ÖNERİLEN/ }),
  ).toBeVisible();
});

test("dikkat: altı görev türü çevrimdışı oynanır, ekran küçükken taşmaz", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  const kinds = [
    "Farklı olanı bul",
    "Örüntüyü tamamla",
    "Şekil eşleştir",
    "Görsel hafıza",
    "Sıralı yönergeler",
    "Ayrıntıyı yakala",
  ];
  for (const name of kinds) {
    await attentionButton(page).click();
    await page.getByRole("button", { name: new RegExp(name) }).click();
    const choices = page.getByRole("group", { name: "Yanıt seçenekleri" });
    if (name === "Farklı olanı bul") {
      const labels = await choices.getByRole("button").allTextContents();
      const odd = labels.findIndex(
        (s) => labels.filter((x) => x === s).length === 1,
      );
      await choices.getByRole("button").nth(odd).click();
    }
    if (name === "Örüntüyü tamamla") {
      const v = await page.locator(".shape-strip span").allTextContents();
      const period = v[0] === v[1] ? 3 : v[0] === v[2] ? 2 : 3;
      await choices
        .getByRole("button", { name: v[v.length % period], exact: true })
        .click();
    }
    if (name === "Şekil eşleştir") {
      const target = await page.locator(".shape-strip span").innerText();
      await choices.getByRole("button", { name: target, exact: true }).click();
    }
    if (name === "Görsel hafıza") {
      const sequence = await page
        .locator(".shape-strip span")
        .allTextContents();
      await page
        .getByRole("button", { name: "Hazırım, kartları kapat" })
        .click();
      await choices
        .getByRole("button", { name: sequence.join(" → "), exact: true })
        .click();
    }
    if (name === "Sıralı yönergeler") {
      const prompt = await page.locator(".activity-prompt").innerText();
      for (const label of prompt
        .replace("Sırayla seç: ", "")
        .replace(/\.$/, "")
        .split(" → "))
        await choices.getByRole("button", { name: label, exact: true }).click();
    }
    if (name === "Ayrıntıyı yakala")
      await choices
        .getByRole("button", { name: "Mavi kurdeleler", exact: true })
        .click();
    await check(page);
    await expect(
      page.getByText("Harika! Yanıtını dikkatle düşündün."),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await back(page);
  }
  await expect
    .poll(() =>
      page.evaluate(
        (k) => JSON.parse(localStorage.getItem(k)!).academies.attention.correct,
        key,
      ),
    )
    .toBe(6);
  await page.reload();
  await expect(page.getByLabel("6 yıldız", { exact: true })).toBeVisible();
});

test("konser: metin kanıtı, işaret sırası ve matematik aynı görevde; çift yıldız yok", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Büyük Konser Görevi →" }).click();
  await page
    .getByRole("button", { name: "Konser hazırlığına başla →" })
    .click();
  await page
    .getByRole("button", { name: "Okurlar rahatsız olmasın diye", exact: true })
    .click();
  await page.getByRole("button", { name: /^Kanıt cümlesi 1:/ }).click();
  await check(page);
  await page.getByRole("button", { name: "Sonraki keşif →" }).click();
  for (const label of ["✦ Yıldız", "● Daire", "▲ Üçgen"])
    await page.getByRole("button", { name: label, exact: true }).click();
  await check(page);
  await page.getByRole("button", { name: "Sonraki keşif →" }).click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await check(page);
  await page.getByRole("button", { name: "Görevi tamamla →" }).click();
  const p = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    key,
  );
  expect(p.stars).toBe(3);
  expect(p.academies.reading.correct).toBe(1);
  expect(p.academies.attention.correct).toBe(1);
  expect(p.academies.concert.correct).toBe(3);
  expect(p.skills.add.correct).toBe(1);
});

test("yeni akademiler: tablet düzeni ve erişilebilirlik kontrolleri", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  await readingButton(page).click();
  for (const title of ["Paragraf keşfi", "Derin okuma"]) {
    await page.getByRole("button", { name: new RegExp(title) }).click();
    await expect(
      page.getByRole("heading", {
        name: "Önce metni oku; sonra yanıtını destekleyen bir cümle seç.",
      }),
    ).toBeVisible();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await back(page);
    await readingButton(page).click();
  }
  await back(page);
  await attentionButton(page).click();
  await page.getByRole("button", { name: /Görsel hafıza/ }).click();
  await page.screenshot({
    path: "test-results/attention-tablet.png",
    fullPage: true,
  });
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Hazırım, kartları kapat" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
