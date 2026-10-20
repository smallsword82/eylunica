import { test, expect } from "@playwright/test";
import { fresh } from "../../src/storage";
import { awardCard } from "../../src/storage/cards";

test("ilk giriş yalnız isim ister; varsayılan Eylül, yeni isimle seviye tespitine geçilir", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", request => { if (request.url().includes("supabase.co")) requests.push(request.url()); });
  await page.goto("/");
  await expect(page.getByLabel("Adın", { exact: true })).toHaveValue("Eylül");
  await expect(page.locator("main input")).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Kayıt ol|Giriş yap/ })).toHaveCount(0);
  await page.getByLabel("Adın", { exact: true }).fill("İpek Eylül");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await expect(page.getByText("Soru 1 / 12", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!).learnerName)).toBe("İpek Eylül");
  expect(requests).toEqual([]);
});

test("isim değişikliği eski hesap verisini, yıldızları, kartları ve bölümleri silmez; çevrimdışı açılır", async ({ page, context }) => {
  const previous = awardCard({ ...fresh(), stars: 18, calibrationDone: true, mathSections: { divide: 2 } }, "math:add:1", "Toplama Ormanı");
  const token = "saved-account-not-used-in-local-mode";
  await page.addInitScript(({ progress, token }) => {
    if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(progress));
    localStorage.setItem("sb-shtryogkcorfhoeslnco-auth-token", token);
  }, { progress: previous, token });
  await page.goto("/");
  await page.getByLabel("Adın", { exact: true }).fill("Ada");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!))).toEqual({ ...previous, learnerName: "Ada" });
  expect(await page.evaluate(() => localStorage.getItem("sb-shtryogkcorfhoeslnco-auth-token"))).toBe(token);
  await page.getByRole("button", { name: "Yıldız tablosu", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Ada · 18 yıldız" })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByLabel("Adın", { exact: true })).toHaveValue("Ada");
  await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await expect(page.getByLabel("18 yıldız", { exact: true })).toBeVisible();
});
