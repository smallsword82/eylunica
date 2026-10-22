import {enterAcademies} from "./local-test";
import { test, expect, openMathWorld, type Page, openSoundSettings } from "./local-test";
import { stories } from "../../src/reading-engine";
import { narrationManifest } from "../../src/audio/narration-manifest";

async function observeAudio(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    (window as unknown as { narrator: HTMLMediaElement[] }).narrator = [];
    HTMLMediaElement.prototype.play = function () {
      if (this.src.includes("/narration/")) (window as unknown as { narrator: HTMLMediaElement[] }).narrator.push(this);
      return original.call(this);
    };
  });
}
const isPlaying = (page: Page) => page.evaluate(() => {
  const audio = (window as unknown as { narrator: HTMLMediaElement[] }).narrator.at(-1);
  return !!audio && !audio.paused && audio.currentTime > 0.08;
});

test("gömülü Türkçe hikâyeler çevrimdışı çalar; dinleme oturumu destek sayılır ve durdurulur", async ({ page, context }) => {
  test.setTimeout(90000);
  await observeAudio(page);
  await page.goto("/"); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await openSoundSettings(page);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("effects");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await context.setOffline(true);
  await page.reload(); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  // Decode every bundled recording while offline, including the longest stories.
  const durations = await page.evaluate(async entries => {
    const durations:number[]=[];let next=0;
    // The catalog now contains thousands of clips. Release each media decoder
    // and bound concurrency instead of exceeding Chromium's player limit.
    await Promise.all(Array.from({length:8},async()=>{while(next<entries.length){const index=next++,entry=entries[index];durations[index]=await new Promise<number>((resolve,reject)=>{
      const audio=new Audio(`./narration/${entry.file}`);audio.preload='metadata';
      const release=()=>{audio.onloadedmetadata=null;audio.onerror=null;audio.removeAttribute('src');audio.load();};
      audio.onloadedmetadata=()=>{const duration=audio.duration;release();resolve(duration);};
      audio.onerror=()=>{release();reject(new Error(entry.file));};audio.load();
    });}}));return durations;
  }, Object.values(narrationManifest));
  Object.values(narrationManifest).forEach((entry, i) => expect(Math.abs(durations[i] - entry.duration)).toBeLessThan(0.2));
  await enterAcademies(page);await page.getByRole("button", { name: /^Okuduğunu Anlama Akademisi/ }).click();
  await page.getByRole("button", { name: /Kısa metinler/ }).click();
  await page.getByRole("button", { name: "Hikâyeyi dinle", exact: true }).click();
  await expect.poll(() => isPlaying(page)).toBe(true);
  await expect(page.getByRole("button", { name: "Dinlemeyi durdur", exact: true })).toBeVisible();
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Tüm konuşmayı durdur" }).click();
  await expect.poll(() => isPlaying(page)).toBe(false);
  for (const q of stories[0].questions.slice(0, 2)) {
    await page.getByRole("button", { name: q.choices[q.answer], exact: true }).click();
    await page.getByRole("button", { name: new RegExp(`^Kanıt cümlesi ${q.evidence![0] + 1}:`) }).click();
    await page.getByRole("button", { name: "Yanıtımı kontrol et →" }).click();
    await page.getByRole("button", { name: "Sonraki keşif →" }).click();
  }
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("ritma-progress-v1")!));
  expect(state.stars).toBe(2);
  expect(state.academies.reading.hints).toBe(2);
  expect(state.academies.reading.independent).toBe(0);
  await page.getByRole("button", { name: "Hikâyeyi dinle", exact: true }).click();
  await expect.poll(() => isPlaying(page)).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect.poll(() => isPlaying(page)).toBe(false);
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.getByRole("button", { name: "Hikâyeyi dinle", exact: true }).click();
  await expect.poll(() => isPlaying(page)).toBe(true);
  await page.getByRole("button", { name: "Mola ver", exact: true }).click();
  await expect.poll(() => isPlaying(page)).toBe(false);
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("otomatik konuşma tercihi kalıcıdır; görev sesi ve ekran geçişi çevrimdışı çalışır", async ({ page, context }) => {
  await observeAudio(page);
  await page.goto("/"); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await openSoundSettings(page);
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("effects");
  await page.getByRole("button", { name: "Ebeveyn köşesi →" }).click();
  const setting = page.getByRole("checkbox", { name: "Otomatik konuşmalı geri bildirim" });
  await expect(setting).not.toBeChecked();
  await setting.check();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("ritma-narration-v1"))).toBe("on");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await context.setOffline(true);
  await page.reload(); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await page.getByRole("button", { name: "Ebeveyn köşesi →" }).click();
  await expect(setting).toBeChecked();
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await openMathWorld(page, /Zihin Atölyesi/);
  await page.getByRole("button", { name: "Yönergeyi dinle" }).click();
  await expect.poll(() => isPlaying(page)).toBe(true);
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect(page.locator("#math-feedback")).toContainText("Harika");
  await expect.poll(() => isPlaying(page)).toBe(true);
  expect(await page.evaluate(() => {
    const all = (window as unknown as { narrator: HTMLMediaElement[] }).narrator;
    return all.filter(a => !a.paused).length;
  })).toBe(1);
  await page.getByRole("button", { name: "← Haritaya dön" }).click();
  await expect.poll(() => isPlaying(page)).toBe(false);
  await page.getByRole("button", { name: "Ebeveyn köşesi →" }).click();
  await setting.uncheck();
  await page.reload(); await page.getByRole("button", { name: "eylunica’ya devam et →" }).click();
  await openMathWorld(page, /Zihin Atölyesi/);
  await page.getByRole("button", { name: "15", exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { narrator: HTMLMediaElement[] }).narrator.length)).toBe(0);
});
