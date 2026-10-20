import { test as base } from "@playwright/test";
export { expect, type Page } from "@playwright/test";
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => sessionStorage.setItem("eylunica-local-session", "yes"));
    await use(page);
  },
});
