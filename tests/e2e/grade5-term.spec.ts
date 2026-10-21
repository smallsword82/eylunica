import { test, expect } from './local-test';

test('ilk dönem varsayılandır, planı belirsiz örnekler korunur ve yazılı kapsamı aktarılır', async ({page}) => {
 await page.goto('/');
 await page.getByRole('button', {name:'eylunica’ya devam et →'}).click();
 await page.getByRole('button', {name:/5. Sınıf Derslerim/}).click();
 await expect(page.getByLabel('Çalışma dönemi')).toHaveValue('first');
 await page.getByRole('button', {name:/^Matematik /}).click();
 await expect(page.getByRole('button', {name:/Örnek sayı çalışmaları/})).toHaveCount(0);
 await page.getByRole('button', {name:'Yazılı testleri', exact:true}).click();
 await expect(page.getByLabel('Çalışma dönemi')).toHaveValue('first');
 await page.getByRole('button', {name:'Yazılıyı başlat', exact:true}).click();
 await expect(page.getByText('Çalışma kapsamı: 1. dönem', {exact:true})).toBeVisible();
 await expect(page.getByText('Soru kaynağı ve kontrolü', {exact:true})).toHaveCount(0);
 const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('eylunica-grade5-exams-v1')!).drafts);
 expect(Object.values(draft).map((value:any) => value.term)).toEqual(['first']);
 await page.getByRole('button', {name:'← Derse dön'}).click();
 await page.getByLabel('Çalışma dönemi').selectOption('unknown');
 await expect(page.getByRole('button', {name:/Örnek sayı çalışmaları/})).toBeVisible();
});
