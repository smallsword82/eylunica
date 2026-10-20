import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const api = "https://shtryogkcorfhoeslnco.supabase.co";
test("misafir tabloyu görür; kullanıcı adıyla kayıt açık izin gerektirir", async ({ page }) => {
  await page.route(`${api}/rest/v1/rpc/league_board`, route => route.fulfill({ json: [{ rank: 1, nickname: "ritim_kedisi", stars: 8 }] }));
  await page.goto("/?league=welcome");
  await expect(page.getByRole("heading", { name: "RİTMA Yıldız Ligi" })).toBeVisible();
  await expect(page.getByRole("table")).toContainText("ritim_kedisi");
  await expect(page.locator('input[type="email"], input[type="tel"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Yeni hesap oluştur" }).click();
  const signup = page.getByRole("button", { name: "Hesabımı oluştur →" });
  await expect(signup).toBeDisabled();
  await page.getByLabel("Kullanıcı adı", { exact: true }).fill("ritim_kedisi");
  await page.getByLabel("Şifre", { exact: true }).fill("only-for-local-test-391!");
  await page.getByRole("checkbox", { name: /Hesabı yetişkin\/veli/ }).check();
  await expect(signup).toBeEnabled();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.route(`${api}/auth/v1/signup`, route => {
    const body = route.request().postDataJSON();
    expect(body.email).toBe("ritim_kedisi@accounts.eylunica.netlify.app");
    expect(body.data.league_consent).toBe(true);
    return route.fulfill({ status: 422, json: { msg: "User already registered", code: "user_already_exists" } });
  });
  await signup.click();
  await expect(page.getByRole("alert")).toContainText("Bu kullanıcı adı alınmış");
  await page.getByRole("button", { name: "Hesabım var, giriş yap" }).click();
  await page.getByLabel("Şifre", { exact: true }).fill("not-a-real-password");
  await page.route(`${api}/auth/v1/token**`, route => {
    expect(route.request().postDataJSON().email).toBe("ritim_kedisi@accounts.eylunica.netlify.app");
    return route.fulfill({ status: 400, json: { error: "invalid_grant", error_description: "Invalid login credentials" } });
  });
  await page.getByRole("button", { name: "Giriş yap →" }).click();
  await expect(page.getByRole("alert")).toContainText("Kullanıcı adı veya şifre doğru değil");
});

test("oturum, takma ad, doğrulanmış yıldız, gizlenme ve yerel ilerleme birbirinden ayrıdır", async ({ page }, testInfo) => {
  const expires = Math.floor(Date.now() / 1000) + 3600;
  const user = { id: "10000000-0000-0000-0000-000000000001", aud: "authenticated", role: "authenticated", email: "private@example.test", app_metadata: { provider: "google" }, user_metadata: { full_name: "Gizli Gerçek Ad" }, created_at: new Date().toISOString() };
  const payload = Buffer.from(JSON.stringify({ sub: user.id, exp: expires })).toString("base64url");
  await page.addInitScript(({ user, payload, expires }) => {
    localStorage.setItem("sb-shtryogkcorfhoeslnco-auth-token", JSON.stringify({ access_token: `eyJhbGciOiJIUzI1NiJ9.${payload}.test-signature`, token_type: "bearer", expires_in: 3600, expires_at: expires, refresh_token: "test-refresh", user }));
    localStorage.setItem("league-progress-proof", "korunacak");
  }, { user, payload, expires });
  let player: { nickname: string; stars: number; visible: boolean; dailyStars: number } | null = null;
  let submissions = 0;
  await page.route(`${api}/**`, async route => {
    const path = new URL(route.request().url()).pathname;
    const body = route.request().postDataJSON();
    if (path.endsWith("league_board")) return route.fulfill({ json: player?.visible && player.stars ? [{ rank: 1, nickname: player.nickname, stars: player.stars }] : [] });
    if (path.endsWith("league_me")) return route.fulfill({ json: player });
    if (path.endsWith("league_join")) {
      expect(body).toEqual({ p_nickname: "ritim_kedisi" });
      player = { nickname: body.p_nickname, stars: 0, dailyStars: 0, visible: true };
      return route.fulfill({ json: player });
    }
    if (path.endsWith("league_question")) return route.fulfill({ json: { id: "30000000-0000-0000-0000-000000000003", prompt: "2 + 4 = ?" } });
    if (path.endsWith("league_answer")) {
      expect(body.p_answer).toBe(6); submissions++;
      player = { ...player!, stars: 1, dailyStars: 1 };
      return route.fulfill({ json: { correct: true, answer: 6, player } });
    }
    if (path.endsWith("league_visibility")) { player = { ...player!, visible: body.p_visible }; return route.fulfill({ json: player }); }
    return route.fulfill({ json: {} });
  });
  await page.goto("/?league=welcome");
  await page.getByLabel("Lig takma adı", { exact: true }).fill("ritim_kedisi");
  await page.getByRole("checkbox", { name: /Bu takma ad ve lig yıldızlarının/ }).check();
  await page.getByRole("button", { name: "Takma adımla lige katıl →" }).click();
  await expect(page.getByText("✦ 0 lig yıldızı")).toBeVisible();
  await page.getByRole("button", { name: "Lig sorusuna başla →" }).click();
  await page.getByLabel("Lig yanıtın").fill("6");
  await page.getByRole("button", { name: "Yanıtımı kontrol et" }).dblclick();
  await expect(page.getByText("✦ 1 lig yıldızı")).toBeVisible();
  expect(submissions).toBe(1);
  await expect(page.getByRole("table")).toContainText("ritim_kedisi");
  await expect(page.locator("body")).not.toContainText("private@example.test");
  await expect(page.locator("body")).not.toContainText("Gizli Gerçek Ad");
  await page.getByRole("checkbox", { name: "Takma adım puan tablosunda görünsün" }).uncheck();
  await expect(page.getByText("Henüz lig yıldızı yok. İlk keşif senin olabilir!")).toBeVisible();
  await expect(page.getByText("✦ 1 lig yıldızı")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("league-progress-proof"))).toBe("korunacak");
  await expect(page.getByRole("button", { name: "Hesabımı sil", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Hesabımı sil", exact: true }).click();
  await expect(page.getByRole("region", { name: "Hesap silme onayı" })).toBeVisible();
  await page.getByRole("button", { name: "Vazgeç", exact: true }).click();
  await expect(page.getByRole("region", { name: "Hesap silme onayı" })).toHaveCount(0);
  await page.getByRole("checkbox", { name: "Takma adım puan tablosunda görünsün" }).check();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("star-league.png"), fullPage: true });
});

test("ağ hatası puan uydurmaz, öğrenmeye dönüşü engellemez", async ({ page }) => {
  await page.route(`${api}/**`, route => route.abort("internetdisconnected"));
  await page.goto("/?league=welcome");
  await expect(page.getByRole("alert")).toContainText("İnternet");
  await page.getByRole("button", { name: "← Öğrenme haritasına dön" }).click();
  await expect(page.getByRole("button", { name: /Zihin Atölyesi/ })).toBeVisible();
});
