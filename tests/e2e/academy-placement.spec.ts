import { enterAcademies } from './local-test';
import { test, expect } from '@playwright/test';
import { fresh } from '../../src/storage';

for (const academy of ['reading','attention'] as const) for (const legacy of [false,true]) {
  test(`${academy}: sequential illustrated levels preserve ${legacy ? 'existing assessment' : 'new learner'} progress without forcing assessment`, async ({page}) => {
    const previous=fresh();previous.stars=12;previous.calibrationDone=true;
    if(legacy){previous.academies[academy].placementDone=true;previous.academies[academy].level=3;}
    await page.addInitScript(p=>{sessionStorage.setItem('eylunica-local-session','yes');if(!localStorage.getItem('ritma-progress-v1'))localStorage.setItem('ritma-progress-v1',JSON.stringify(p));},previous);
    const entry=academy==='reading'?/^Okuduğunu Anlama Akademisi/:/^Dikkat ve Odaklanma Akademisi/;
    async function open(){await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await enterAcademies(page);await page.getByRole('button',{name:entry}).click();}
    await open();
    await expect(page.getByRole('region',{name:'Seviye tespiti'})).toHaveCount(0);
    await expect(page.locator('.academy-level-card .academy-cover-art')).toHaveCount(3);
    await expect(page.locator('.academy-level-card').nth(1)).toBeDisabled();
    await page.locator('.academy-level-card').first().click();
    if(academy==='attention')await page.getByRole('button',{name:/Farklı olanı bul/}).click();
    await expect(page.locator('.activity-panel')).toBeVisible();
    const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ritma-progress-v1')!));
    expect(saved.stars).toBe(12);expect(saved.skills).toEqual(previous.skills);expect(saved.academies).toEqual(previous.academies);
    await page.reload();await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await enterAcademies(page);await page.getByRole('button',{name:entry}).click();
    await expect(page.locator('.academy-level-card').nth(1)).toBeDisabled();
  });
}
