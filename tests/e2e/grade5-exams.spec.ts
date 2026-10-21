import { test, expect, type Page } from './local-test';

async function openGradeFive(page: Page) {
 await page.goto('/');
 await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
 await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();
}

test('yazılı cevapları çevrimdışı korunur; anahtar bitişte açılır ve yanlışlar öğrenme kaydına geçer', async ({page,context}) => {
 const external: string[]=[];
 page.on('request',r=>{if(/googleapis|youtube/.test(r.url()))external.push(r.url());});
 await openGradeFive(page);
 const previousGame=await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'));
 await page.getByRole('button',{name:/^Matematik /}).click();
  await page.getByRole('button',{name:/Matematik konuları ve yazılı testleri/}).click();
  await page.getByLabel('Çalışma dönemi').selectOption('all');
 await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();
 const scope=page.getByRole('group',{name:'Yazılı kapsamı',exact:true});
 for(const checkbox of await scope.getByRole('checkbox').all())if(await checkbox.isEnabled())await checkbox.uncheck();
 await scope.getByRole('checkbox',{name:/Örnek sayı çalışmaları/}).check();
 await page.getByRole('button',{name:'Yazılıyı başlat',exact:true}).click();
 await expect(page.locator('fieldset.exam-question')).toHaveCount(6);
 await expect(page.getByText('Cevap anahtarı ve çözümler',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'İpucu',exact:true})).toHaveCount(0);
 const first=page.locator('fieldset.exam-question').filter({hasText:'3 482'});
 await first.getByRole('radio',{name:'400',exact:true}).check();
 await expect(page.getByText('1/6 soru yanıtlandı.',{exact:false})).toBeVisible();
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await context.setOffline(true);
 await page.reload();
 await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
 await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();
 await page.getByRole('button',{name:/^Matematik /}).click();
  await page.getByRole('button',{name:/Matematik konuları ve yazılı testleri/}).click();
  await page.getByLabel('Çalışma dönemi').selectOption('all');
 await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();
 await page.getByRole('button',{name:'Yarım kalan yazılıya devam et',exact:true}).click();
 await expect(page.locator('fieldset.exam-question').filter({hasText:'3 482'}).getByRole('radio',{name:'400',exact:true})).toBeChecked();
 await page.getByRole('button',{name:'Yazılıyı bitir',exact:true}).click();
 await expect(page.getByRole('alert').filter({hasText:'5 soru boş'})).toBeVisible();
 await page.getByRole('button',{name:'Boşlarla bitir',exact:true}).click();
 await expect(page.getByText('17/100 · 1 doğru · 0 yanlış · 5 boş',{exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Cevap anahtarı ve çözümler',exact:true})).toBeVisible();
 const saved=await page.evaluate(()=>({learning:JSON.parse(localStorage.getItem('eylunica-grade5-v1')!),exams:JSON.parse(localStorage.getItem('eylunica-grade5-exams-v1')!),game:localStorage.getItem('ritma-progress-v1')}));
 expect(saved.game).toBe(previousGame);
 expect(saved.learning.attempts).toHaveLength(6);
 expect(saved.learning.attempts.filter((a:{correct:boolean})=>!a.correct)).toHaveLength(5);
 expect(saved.exams.history).toHaveLength(1);
 expect(saved.exams.drafts['course-1']).toBeUndefined();
 expect(external).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('resmî konuya eklenen anlatım, adımlı çözüm ve alıştırma çevrimdışı açılır', async ({page,context}) => {
 await openGradeFive(page);
 await page.getByRole('button',{name:/^Fen Bilimleri /}).click();
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
  await page.getByRole('button',{name:new RegExp('^'+escape(course)+' ')}).click();
  if(course==='Matematik') await page.getByRole('button',{name:/Matematik konuları ve yazılı testleri/}).click();
  await page.getByLabel('Çalışma dönemi').selectOption('all');
  await expect(page.getByRole('button',{name:'Yazılı testleri',exact:true})).toBeEnabled();
  await page.getByLabel('Konu ara').fill(title);
  await page.getByRole('button',{name:new RegExp(escape(title))}).first().click();
  expect(await page.locator('.lesson-reading > section').count()).toBeGreaterThanOrEqual(2);
  await page.getByRole('button',{name:'Örnek çözüm',exact:true}).click();
  await expect(page.locator('.lesson-reading ol li').first()).toBeVisible();
  await page.getByRole('button',{name:'Alıştırmalar',exact:true}).click();
  await expect(page.getByRole('region',{name:'Soru çalışması'}).getByRole('heading')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 });
}
