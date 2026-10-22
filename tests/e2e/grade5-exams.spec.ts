import {selectGradeCourse} from './local-test';
import { test, expect, type Page } from './local-test';

async function openGradeFive(page: Page) {
 await page.goto('/');
 await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
 await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();
}

test('matematik yazılısı çevrimdışı aynı yanıtla sürer ve sonunda not verir',async({page,context})=>{
 test.setTimeout(90000);await openGradeFive(page);const before=await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'));await page.getByRole('button',{name:/^Matematik /}).click();await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await page.getByLabel('Soru sayısı').selectOption('10');await page.getByRole('button',{name:'Yazılıyı başlat',exact:true}).click();
 const {mathJourneyQuestions}=await import('../../src/grade5/math-journey-bank');const id=await page.locator('.journey-scene').getAttribute('data-question-id');const q=mathJourneyQuestions.find(q=>q.id===id)!;if(q.choices)await page.getByRole('button',{name:q.answer,exact:true}).click();else for(const digit of q.answer)await page.locator('.journey-keypad').getByRole('button',{name:digit,exact:true}).click();await page.getByRole('button',{name:'Yanıtımı kaydet',exact:true}).click();await expect(page.locator('.journey-question-counter')).toContainText('2/10');await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Matematik /}).click();await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await page.getByRole('button',{name:'Yarım kalan yazılıya devam et',exact:true}).click();
 for(let i=0;i<9;i++){await page.getByRole('button',{name:'Boş bırak',exact:true}).click();}await expect(page.getByText('10/100',{exact:true})).toBeVisible();await expect(page.getByText('1 doğru · 0 yanlış · 9 boş',{exact:true})).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'))).toBe(before);
});

test('resmî konuya eklenen anlatım, adımlı çözüm ve alıştırma çevrimdışı açılır', async ({page,context}) => {
 await openGradeFive(page);
 await selectGradeCourse(page,/^Fen Bilimleri /);
  await page.getByLabel('Çalışma dönemi').selectOption('all');
 await page.getByLabel('Konu ara').fill('Gökyüzündeki Komşumuz: Güneş');
 await page.getByRole('button',{name:/Gökyüzündeki Komşumuz: Güneş/}).click();
 expect(await page.locator('.lesson-reading > section').count()).toBeGreaterThanOrEqual(2);
 await expect(page.getByText('Bu konu için bağımsız ders anlatımı henüz hazırlanmadı.',{exact:false})).toHaveCount(0);
 await page.getByRole('button',{name:'Örnek çözüm',exact:true}).click();
 await expect(page.locator('.lesson-reading ol li').first()).toBeVisible();
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await context.setOffline(true);
 await page.getByRole('button',{name:'Alıştırmalar',exact:true}).click();
 await expect(page.getByRole('region',{name:'Soru çalışması'}).getByRole('heading')).toBeVisible();
 await page.getByRole('button',{name:'İpucu',exact:true}).click();
 await expect(page.getByRole('region',{name:'Soru çalışması'}).getByText('Zorluk',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

for (const [course, title] of [
 ['Matematik', 'Açı Ölçme'],
 ['Türkçe', 'Strateji, yöntem ve teknik'],
 ['Fen Bilimleri', 'Gökyüzündeki Komşumuz: Güneş'],
 ['Sosyal Bilgiler', 'Gruplar ve Roller'],
 ['İngilizce', 'People, places and rules at school'],
 ['Almanca', 'Sich vorstellen'],
 ['Din Kültürü ve Ahlak Bilgisi', 'Evrendeki Mükemmel Düzen'],
]) {
 test(`${course}: anlatım, örnek ve alıştırma açılır`, async ({page}) => {
  await openGradeFive(page);
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await selectGradeCourse(page,new RegExp('^'+escape(course)+' '));
  await page.getByLabel('Çalışma dönemi').selectOption('all');
  await expect(page.getByRole('button',{name:'Yazılı testleri',exact:true})).toBeEnabled();
  if(course==='Matematik'){await page.locator('[data-topic-id="topic-a0155915387c7658"]').click();await page.getByRole('button',{name:'Modeli kendin değiştir',exact:true}).click();await page.getByRole('button',{name:'90°',exact:true}).click();await page.locator('.journey-action-slot .journey-portal').click();while(await page.locator('.phase-explain').count()){for(let frame=0;frame<3;frame++)await page.getByRole('button',{name:'Sonraki animasyon karesi',exact:true}).click();await page.locator('.journey-action-slot .journey-portal').click();}while(await page.locator('.phase-example').count()){for(let frame=0;frame<3;frame++)await page.getByRole('button',{name:'Sonraki animasyon karesi',exact:true}).click();await page.locator('.journey-action-slot .journey-portal').click();}await expect(page.locator('.phase-practice')).toBeVisible();return;}
  if(course==='Sosyal Bilgiler'){await page.locator('[data-topic-id="topic-f31f5d0c12bc3e58"]').click();await expect(page.getByRole('region',{name:'Sosyal bilgiler görselli anlatım'})).toBeVisible();for(let i=0;i<3;i++)await page.getByRole('button',{name:'Sonraki adım →',exact:true}).click();await page.getByRole('button',{name:'✦ Örnek çözüm',exact:true}).click();await expect(page.getByRole('heading',{name:/Deniz evde/})).toBeVisible();await page.getByRole('button',{name:'Alıştırmalar',exact:true}).click();await expect(page.getByRole('region',{name:'Soru çalışması'})).toBeVisible();return;}
  await page.getByLabel('Konu ara').fill(title);
  await page.getByRole('button',{name:new RegExp(escape(title))}).first().click();
  if(course==='Matematik') await expect(page.getByRole('region',{name:'Görselli açı anlatımı'})).toBeVisible();
  else expect(await page.locator('.lesson-reading > section').count()).toBeGreaterThanOrEqual(2);
  await page.getByRole('button',{name:'Örnek çözüm',exact:true}).click();
  await expect(page.locator('.lesson-reading ol li').first()).toBeVisible();
  await page.getByRole('button',{name:'Alıştırmalar',exact:true}).click();
  await expect(page.getByRole('region',{name:'Soru çalışması'}).getByRole('heading')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 });
}
