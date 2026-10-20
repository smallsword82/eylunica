import { test, expect, type Page } from "@playwright/test";
import { fresh, completeArena, recordArena } from "../../src/storage";
import { freshArena, makeDeck, observation, specs } from "../../src/arena-engine";
import { dateKey, freshDay, freshWellbeing } from "../../src/time-engine";
const key = "ritma-progress-v1";
const spec = specs("multiply", 1)[0];
const startTime = new Date(2026, 9, 20, 12);
function prepared() {
  let p = fresh(); p.stars = 7; p.rewards = ["lights"];
  // Use ten distinct facts twice for a reliable preparation fixture.
  p.arena = freshArena();
  const deck = makeDeck(spec);
  for (let i = 0; i < 20; i++) p = recordArena(p, spec, observation(deck[i % 10], true, false, 5000, true, "practice", `p${i}`));
  for (let round = 0; round < 3; round++) {
    const answers = makeDeck(spec).map((q, i) => observation(q, true, false, round < 2 ? 5000 : 3500, true, "arena", `s${round}:${i}`));
    for (const o of answers) p = recordArena(p, spec, o);
    p = completeArena(p, spec, `s${round}`, answers, startTime.getTime()).progress;
  }
  return p;
}
async function clock(page: Page) {
  await page.clock.install({ time: startTime });
  await page.clock.pauseAt(new Date(startTime.getTime() + 1000));
}
async function open(page: Page) {
  await page.getByRole("button", { name: /RİTMA Hız Arenası/ }).click();
  await page.getByRole("combobox", { name: "İşlem", exact: true }).selectOption("multiply");
}
async function value(page: Page) {
  const nums = (await page.locator(".arena-equation").innerText()).match(/\d+/g)!.map(Number);
  return nums[0] * nums[1];
}
async function solve(page: Page, wrong = false, hint = false) {
  await page.clock.fastForward(1000);
  const correct = await value(page);
  if (hint) await page.getByRole("button", { name: "Bir ipucu al", exact: true }).click();
  if (wrong) {
    const choices = page.getByRole("group", { name: "Arena yanıtları" }).getByRole("button");
    for (const choice of await choices.all()) if (Number(await choice.innerText()) !== correct) { await choice.click(); break; }
    await expect(page.getByRole("status")).toContainText("Henüz olmadı");
  }
  await page.getByRole("button", { name: String(correct), exact: true }).click();
}
async function complete(page: Page) {
  for (let i = 0; i < 10; i++) {
    await solve(page);
    await page.getByRole("button", { name: i === 9 ? "Turu bitir" : "Sonraki arena sorusu", exact: true }).click();
  }
}

test("isteğe bağlı hazırlık: ilk cevap ve ipucu korunur, %90 doğruluk olmadan yarış açılmaz", async ({ page }) => {
  await clock(page); await page.goto("/"); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click(); await open(page);
  await expect(page.getByRole("button", { name: "İsteğe bağlı tura katıl" })).toHaveCount(0);
  await page.getByRole("button", { name: "Doğruluk hazırlığı yap" }).click();
  for (let i = 0; i < 10; i++) {
    await solve(page, i === 0, i === 2);
    await page.getByRole("button", { name: i === 9 ? "Turu bitir" : "Sonraki arena sorusu", exact: true }).click();
  }
  await expect(page.getByText("İlk yanıtlarda 9 / 10 doğru.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Arena menüsüne dön" }).click();
  await expect(page.getByRole("button", { name: "İsteğe bağlı tura katıl" })).toHaveCount(0);
  await page.getByRole("button", { name: "Doğruluk hazırlığı yap" }).click();
  await complete(page);
  await page.getByRole("button", { name: "Arena menüsüne dön" }).click();
  await expect(page.getByRole("button", { name: "İsteğe bağlı tura katıl" })).toBeVisible();
  const p = await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key);
  const lane: any = Object.values(p.arena.lanes)[0];
  expect(lane.recent).toHaveLength(20);
  expect(lane.recent.filter((a: any) => a.correct && !a.hint)).toHaveLength(18);
  expect(lane.pending).toHaveLength(0);
  expect(p.stars).toBe(0);
  await page.getByRole("button", { name: "Normal matematiğe devam et" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/kaç eder/);
  const nums = (await page.getByRole("heading", { level: 1 }).innerText()).match(/\d+/g)!.map(Number);
  await page.clock.fastForward(1200);
  await page.getByRole("button", { name: String(nums[0] * nums[1]), exact: true }).click();
  const first = await page.evaluate(k => JSON.parse(localStorage.getItem(k)!).history[0], key);
  expect(first).toMatchObject({ level: 1, skill: "Eş grupları keşfet", correct: true, timingValid: true });
  expect(first.elapsedMs).toBeGreaterThanOrEqual(1200);
});

test("kişisel rekor, sınırlı ödül, ebeveyn grafikleri, Manifest sesleri ve çevrimdışı kayıt", async ({ page, context }) => {
  await clock(page);
  await page.addInitScript(p => { if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(p)); }, prepared());
  await page.goto("/"); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  // Seed only once; subsequent offline reload must use the actual saved result.
  await page.evaluate(() => localStorage.setItem("arena-seed-used", "yes"));
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("music");
  await page.evaluate(() => {
    const original = HTMLMediaElement.prototype.play;
    (window as any).arenaVoices = 0;
    HTMLMediaElement.prototype.play = function () { (window as any).arenaVoices++; return original.call(this); };
  });
  await open(page);
  await page.getByRole("button", { name: "İsteğe bağlı tura katıl" }).click();
  for (let i = 0; i < 10; i++) {
    await solve(page);
    if (i === 9) await page.evaluate(() => { (window as any).arenaVoices = 0; });
    await page.getByRole("button", { name: i === 9 ? "Turu bitir" : "Sonraki arena sorusu", exact: true }).click();
  }
  await expect(page.getByText(/^Yeni kişisel rekor!/)).toBeVisible();
  await expect(page.getByLabel("10 yıldız", { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as any).arenaVoices)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Öğrenme haritasına dön" }).click();
  await expect(page.locator(".stage")).toHaveClass(/arena-lit/);
  await page.getByRole("button", { name: "Ebeveyn köşesi →" }).click();
  await page.getByRole("combobox", { name: "Grafik işlemi" }).selectOption("multiply");
  await expect(page.locator(".arena-chart")).toHaveCount(2);
  await expect(page.getByRole("table", { name: "Arena gelişim grafiğinin sayısal değerleri" })).toContainText("Yeni kişisel rekor");
  await page.clock.resume();
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await context.setOffline(true);
  await page.reload(); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
  await expect(page.getByLabel("10 yıldız", { exact: true })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Ses modu" })).toHaveValue("music");
});

test("mola ve günlük sınır Arena’da işler; kesintili yanıt rekor sayılmaz", async ({ page }) => {
  await clock(page);
  await page.addInitScript(p => { if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(p)); }, prepared());
  await page.goto("/"); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click(); await open(page);
  await page.getByRole("button", { name: "İsteğe bağlı tura katıl" }).click();
  await page.clock.fastForward(1000);
  await page.getByRole("button", { name: "Mola ver", exact: true }).click();
  await page.clock.fastForward(60_000);
  await page.getByRole("button", { name: "Hazırım, devam et" }).click();
  await complete(page);
  await expect(page.getByText("Bu grup rekor koşullarını karşılamadı.", { exact: false })).toBeVisible();
  await expect(page.getByLabel("7 yıldız", { exact: true })).toBeVisible();
  const rows = await page.evaluate(k => Object.values(JSON.parse(localStorage.getItem(k)!).arena.lanes).flatMap((l: any) => l.recent), key);
  expect(rows.some((r: any) => !r.timingValid && r.elapsedMs < 5000)).toBe(true);
  const settings = freshWellbeing(); settings.settings.dailyLimitMinutes = 1;
  settings.days[dateKey(startTime.getTime())] = { ...freshDay(), math: 59_000 };
  await page.evaluate(s => localStorage.setItem("ritma-wellbeing-v1", JSON.stringify(s)), settings);
  await page.reload(); await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click(); await open(page);
  await page.getByRole("button", { name: "İsteğe bağlı tura katıl" }).click();
  await page.clock.fastForward(2000);
  await solve(page);
  await page.getByRole("button", { name: "Sonraki arena sorusu" }).click();
  await expect(page.getByRole("dialog")).toContainText("Bugünkü oyun süresi tamamlandı");
});
