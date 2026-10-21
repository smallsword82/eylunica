import { test as base } from "@playwright/test";
import type { Page } from "@playwright/test";
import { fresh } from "../../src/storage";
export { expect, type Page } from "@playwright/test";
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => sessionStorage.setItem("eylunica-local-session", "yes"));
    await page.addInitScript(value => {
      document.addEventListener("readystatechange", () => {
        if (!localStorage.getItem("ritma-progress-v1")) localStorage.setItem("ritma-progress-v1", JSON.stringify(value));
        const progress = JSON.parse(localStorage.getItem("ritma-progress-v1")!);
        progress.calibrationDone = true;
        if (progress.academies) {
          progress.academies.reading.placementDone = true;
          progress.academies.attention.placementDone = true;
          localStorage.setItem("ritma-progress-v1", JSON.stringify(progress));
        }
      }, { once: true });
    }, fresh());
    await use(page);
  },
});
export async function openMathWorld(page: Page, name: RegExp) {
  const world = page.getByRole("button", { name });
  if (!await world.isVisible()) await page.getByRole("button", { name: /^Matematik Akademisi/ }).click();
  await world.click();
}
export async function openSoundSettings(page: Page) {
  if (!await page.getByRole("combobox", { name: "Ses modu" }).isVisible()) await page.getByRole("button", { name: "Ses ve müzik ayarları", exact: true }).click();
}
export async function selectGradeCourse(page: Page, name: RegExp) {
 await page.locator('.discovery-books').waitFor({state:'visible'});
 for(let i=0;i<5;i++){
  const target=page.locator('.discovery-books').getByRole('button',{name});
  if(await target.isVisible()){await target.click();return;}
  const next=page.getByRole('button',{name:'Sonraki kitaplar →',exact:true});
  if(!await next.isEnabled())break;
  await next.click();
 }
 throw Error(`Kitaplıkta ders bulunamadı: ${name}`);
}
