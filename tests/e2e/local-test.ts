import { test as base } from "@playwright/test";
import { fresh } from "../../src/storage";
export { expect, type Page } from "@playwright/test";
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => sessionStorage.setItem("eylunica-local-session", "yes"));
    await page.addInitScript(value => {
      document.addEventListener("readystatechange", () => {
        if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(value));
      }, { once: true });
    }, fresh());
    await use(page);
  },
});
