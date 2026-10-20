import { test, expect, openMathWorld, openSoundSettings } from "./local-test";

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
    const continueButton = page.getByRole("button", { name: "eylunica’ya devam et →" });
    await expect(continueButton).toBeInViewport({ ratio: 1 });
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(continueButton).toBeInViewport({ ratio: 1 });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(continueButton).toBeInViewport({ ratio: 1 });
    const lastCard = await page.locator(".character-card").last().boundingBox();
    const actionBar = await page.locator(".character-selection-actions").boundingBox();
    expect(lastCard!.y + lastCard!.height).toBeLessThanOrEqual(actionBar!.y);
    await page.evaluate(() => window.scrollTo(0, 0));
    if (width <= 600) {
      await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" })).toBeHidden();
      await openSoundSettings(page);
      expect((await page.locator(".manifest-audio-bar").boundingBox())!.height).toBeLessThan(210);
      await openSoundSettings(page);
      await page.getByText("Müzik ayarları", { exact: true }).click();
      await openSoundSettings(page);
      await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" })).toBeVisible();
      await fits("music-settings");
      await openSoundSettings(page);
      await page.getByText("Müzik ayarları", { exact: true }).click();
    }
    await fits("welcome");
    await page.screenshot({ path: testInfo.outputPath("phone-viewport.png") });
    await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
    await fits("home");
    await openMathWorld(page, /Zihin Atölyesi/);
    await fits("lesson");
    await page.getByRole("button", { name: "Yıldız tablosu", exact: true }).click();
    await expect(page.getByRole("heading", { name: "eylunica Yıldız Tablosu" })).toBeVisible();
    await fits("league");
    await page.getByRole("button", { name: "Ebeveyn köşesi →" }).click();
    await fits("parent");
    if (width === 390) {
      await page.getByRole("button", { name: "eylunica ana sayfa" }).click();
      await page.setViewportSize({ width: 844, height: 390 });
      await openSoundSettings(page);
      await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" })).toBeVisible();
      await fits("landscape");
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(page.getByRole("combobox", { name: "Kısa şarkı seç" })).toBeHidden();
      await fits("portrait-again");
    }
  });
}
