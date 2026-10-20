import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { stories } from "../../src/reading-engine";
import { fresh } from "../../src/storage";
const api = "https://shtryogkcorfhoeslnco.supabase.co";
function session() {
  const expires = Math.floor(Date.now() / 1000) + 3600;
  const user = { id: "10000000-0000-0000-0000-000000000001", aud: "authenticated", role: "authenticated", email: "ritim_kedisi@accounts.eylunica.netlify.app", app_metadata: { provider: "email" }, user_metadata: {}, created_at: new Date().toISOString() };
  const payload = Buffer.from(JSON.stringify({ sub: user.id, exp: expires })).toString("base64url");
  return { access_token: `eyJhbGciOiJIUzI1NiJ9.${payload}.test-signature`, token_type: "bearer", expires_in: 3600, expires_at: expires, refresh_token: "test-refresh", user };
}
async function signedIn(page: Page) {
  await page.addInitScript(value => localStorage.setItem("sb-shtryogkcorfhoeslnco-auth-token", JSON.stringify(value)), session());
}
test("ilk açılışta iki alanlı kayıt; izin ve hata geri bildirimi; ayrı ad seçimi yok", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "eylunica’ya hoş geldin" })).toBeVisible();
  await expect(page.locator("main input:not([type=checkbox])")).toHaveCount(2);
  await expect(page.getByLabel("Öğrenci adı")).toHaveCount(0);
  await expect(page.locator('input[type=email],input[type=tel]')).toHaveCount(0);
  const signup = page.getByRole("button", { name: "Kayıt ol ve başla →" });
  await expect(signup).toBeDisabled();
  await page.getByLabel("Kullanıcı adı", { exact: true }).fill("Ritim_Kedisi");
  await page.getByLabel("Şifre", { exact: true }).fill("only-for-local-test-391!");
  await page.getByRole("checkbox", { name: /Veliyim/ }).check();
  await page.route(`${api}/auth/v1/signup`, route => {
    expect(route.request().postDataJSON().email).toBe("ritim_kedisi@accounts.eylunica.netlify.app");
    return route.fulfill({ status: 422, json: { msg: "User already registered", code: "user_already_exists" } });
  });
  await signup.click();
  await expect(page.getByRole("alert")).toContainText("Bu kullanıcı adı alınmış");
  await page.getByRole("button", { name: "Hesabım var, giriş yap" }).click();
  await page.getByLabel("Şifre", { exact: true }).fill("not-a-real-password");
  await page.route(`${api}/auth/v1/token**`, route => route.fulfill({ json: session() }));
  await page.getByRole("button", { name: "Giriş yap →" }).click();
  await expect(page.getByRole("heading", { name: "ritim_kedisi, sahne senin." })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("RİTMA");
  await expect(page).toHaveTitle("eylunica");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("account-welcome.png"), fullPage: true });
});

test("kayıt ekranı 320px dikeyde taşmaz ve çevrimdışı eski ilerleme korunur", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 844 });
  const previous = { ...fresh(), stars: 17, learnerName: "Eski Ad" };
  await page.addInitScript(value => { if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(value)); }, previous);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "eylunica’ya hoş geldin" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("signup-320.png"), fullPage: true });
  await page.getByRole("button", { name: "Şimdilik bu cihazda çevrimdışı devam et" }).click();
  await expect(page.getByRole("heading", { name: "Eski Ad, sahne senin." })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!))).toEqual(previous);
});

test("normal matematik ve okumadan puan; kanıt eksikse kayıt yok; ayrı lig görevi yok", async ({ page }, testInfo) => {
  await signedIn(page);
  const previous = { ...fresh(), stars: 10, learnerName: "Eski Ad" };
  await page.addInitScript(value => localStorage.setItem("ritma-progress-v1", JSON.stringify(value)), previous);
  let stars = 0, submitted = 0, started = 0, visible = true;
  const tickets = new Map<string, string>();
  await page.route(`${api}/rest/v1/rpc/**`, async route => {
    const name = new URL(route.request().url()).pathname.split("/").at(-1);
    const body = route.request().postDataJSON();
    const player = () => ({ nickname: "ritim_kedisi", stars, dailyStars: stars, visible });
    if (name === "league_me") return route.fulfill({ json: player() });
    if (name === "league_board") return route.fulfill({ json: stars && visible ? [{ rank: 1, nickname: "ritim_kedisi", stars }] : [] });
    if (name === "league_visibility") { visible = body.p_visible; return route.fulfill({ json: player() }); }
    if (name === "lesson_start") {
      const id = `30000000-0000-0000-0000-${String(++started).padStart(12, "0")}`;
      tickets.set(id, body.p_key);
      return route.fulfill({ json: { id } });
    }
    if (name === "lesson_answer") {
      expect(tickets.has(body.p_id)).toBe(true);
      submitted++;
      if (tickets.get(body.p_id) === "math") expect(body.p_answer).toEqual({ answer: 15 });
      else expect(body.p_answer).toEqual({ answer: stories[0].questions[0].answer, evidence: stories[0].questions[0].evidence![0] });
      stars++;
      return route.fulfill({ json: player() });
    }
    throw new Error(`Beklenmeyen RPC: ${name}`);
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ritim_kedisi, sahne senin." })).toBeVisible();
  expect(submitted).toBe(0);
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect.poll(() => submitted).toBe(1);
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await page.getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ }).click();
  await page.getByRole("button", { name: /DÜZEY 1/ }).click();
  const question = stories[0].questions[0];
  await page.getByRole("button", { name: question.choices[question.answer], exact: true }).click();
  await page.getByRole("button", { name: "Yanıtımı kontrol et →" }).click();
  await expect(page.getByRole("status")).toContainText("Şimdi metinde");
  await expect(page.getByRole("button", { name: /Kanıt cümlesi 1:/ })).toBeFocused();
  expect(submitted).toBe(1);
  await page.getByRole("button", { name: new RegExp(`Kanıt cümlesi ${question.evidence![0] + 1}:`) }).click();
  await page.getByRole("button", { name: "Yanıtımı kontrol et →" }).click();
  await expect.poll(() => submitted).toBe(2);
  await page.getByRole("button", { name: "Yıldız tablosu · ritim_kedisi" }).click();
  await expect(page.getByRole("table")).toContainText("ritim_kedisi");
  await expect(page.getByText("✦ 2 yıldız", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Lig sorusuna başla →" })).toHaveCount(0);
  await page.getByRole("checkbox", { name: "Takma adım puan tablosunda görünsün" }).uncheck();
  await expect(page.getByText("Henüz yıldız yok. İlk keşif senin olabilir!")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!).learnerName)).toBe("Eski Ad");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("lesson-leaderboard.png"), fullPage: true });
});

test("ağ hatasında yerel öğrenme engellenmez ve çevrimiçi puan uydurulmaz", async ({ page }) => {
  await signedIn(page);
  await page.route(`${api}/rest/v1/rpc/**`, route => route.abort("internetdisconnected"));
  await page.goto("/");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect(page.getByText("Harika! Sahneye bir adım daha yaklaştın.")).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!).stars)).toBe(1);
  await expect(page.getByText(/Çevrimiçi yıldız bağlantısı kurulamadı/)).toBeVisible();
});
