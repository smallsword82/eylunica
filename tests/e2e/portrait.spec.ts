import { test, expect } from "@playwright/test";

for (const width of [320, 360, 390, 430, 768]) {
  test(`${width}px dikey ekranda temel sayfalar yatay taşmaz`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.route("https://shtryogkcorfhoeslnco.supabase.co/**", route => route.fulfill({ json: [] }));
    async function fits(screen: string) {
      const measurements = await page.evaluate(() => ({
        width: innerWidth,
        content: document.documentElement.scrollWidth,
        outside: [...document.querySelectorAll("button, input, select, main, section")].filter(element => {
          const bounds = element.getBoundingClientRect();
          return bounds.width > 0 && (bounds.left < -1 || bounds.right > innerWidth + 1);
        }).map(element => `${element.tagName}.${element.className}`),
      }));
      expect(measurements, screen).toMatchObject({ content: measurements.width, outside: [] });
      await page.screenshot({ path: testInfo.outputPath(`${screen}.png`), fullPage: true });
    }
    await page.goto("/");
    expect((await page.locator(".topbar").boundingBox())!.height).toBeLessThan(150);
    if (width <= 600) {
      await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" })).toBeHidden();
      expect((await page.locator(".manifest-audio-bar").boundingBox())!.height).toBeLessThan(210);
      await page.getByText("Müzik ayarları", { exact: true }).click();
      await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" })).toBeVisible();
      await fits("music-settings");
      await page.getByText("Müzik ayarları", { exact: true }).click();
    }
    await fits("welcome");
    await page.screenshot({ path: testInfo.outputPath("phone-viewport.png") });
    await page.getByRole("button", { name: "RİTMA’ya devam et →" }).click();
    await fits("home");
    await page.getByRole("button", { name: /Zihin Atölyesi/ }).click();
    await fits("lesson");
    await page.getByRole("button", { name: "Yıldız ligi · Giriş" }).click();
    await expect(page.getByRole("heading", { name: "RİTMA Yıldız Ligi" })).toBeVisible();
    await fits("league");
    await page.getByRole("button", { name: "Ebeveyn köşesi →" }).click();
    await fits("parent");
    if (width === 390) {
      await page.getByRole("button", { name: "RİTMA ana sayfa" }).click();
      await page.setViewportSize({ width: 844, height: 390 });
      await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" })).toBeVisible();
      await fits("landscape");
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" })).toBeHidden();
      await fits("portrait-again");
    }
  });
}
