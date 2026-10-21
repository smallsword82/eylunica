import { test, expect } from './local-test';
test('5. sınıf çevrimdışı çalışma, yanlış tekrarı ve eski kaydın korunması', async ({page,context}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
  const before=await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'));
  await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();
  await page.getByRole('button',{name:/^Matematik /}).click();
  await page.getByRole('button',{name:/Matematik konuları ve yazılı testleri/}).click();
  await page.getByLabel('Çalışma dönemi').selectOption('all');
  await page.getByRole('button',{name:/Örnek sayı çalışmaları/}).click();
  await expect(page.getByRole('heading',{name:'Basamak değeri',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Video',exact:true}).click();
  await expect(page.getByText('Bu konu için incelenip onaylanmış video henüz yok.')).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button',{name:'Alıştırmalar',exact:true}).click();
  await page.getByRole('button',{name:'40',exact:true}).click();
  await page.getByRole('button',{name:'Yanıtı kontrol et'}).click();
  await expect(page.getByText(/Birlikte bakalım/)).toBeVisible();
  await page.getByRole('button',{name:'Yanlışları tekrar et'}).click();
  await page.getByRole('button',{name:'400',exact:true}).click();
  await page.getByRole('button',{name:'Yanıtı kontrol et'}).click();
  await page.getByRole('button',{name:'Sonraki soru'}).click();
  await expect(page.getByText('Tekrar bekleyen yanlış yanıt kalmadı.')).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'))).toBe(before);
  await page.evaluate(()=>navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
  await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();
  await page.getByRole('button',{name:/^Matematik /}).click();
  await page.getByRole('button',{name:/Matematik konuları ve yazılı testleri/}).click();
  await page.getByLabel('Çalışma dönemi').selectOption('all');
  await page.getByRole('button',{name:/Örnek sayı çalışmaları/}).click();
  await expect(page.getByText(/2 yanıt · doğruluk %50/)).toBeVisible();
  await page.getByRole('button',{name:'Konu anlatımı',exact:true}).click();
  await expect(page.getByText(/Bir rakamın değeri bulunduğu basamağa bağlıdır/)).toBeVisible();
});

test('konu testi altı soru türünü çalıştırır ve oturum içinde soru tekrarlamaz', async ({ page }) => {
  const questions = [
    { id: 'pv1', prompt: /3 482/, kind: 'choice', answer: '400' },
    { id: 'pv2', prompt: /5 216/, kind: 'boolean', answer: 'Doğru' },
    { id: 'pv3', prompt: /7 305/, kind: 'fill', answer: '300' },
    { id: 'pv4', prompt: /Basamakları küçük/, kind: 'ordering', answer: 'birler,onlar,yüzler,binler' },
    { id: 'pv5', prompt: /Eşleştir:/, kind: 'matching', answer: 'A=6000,B=600' },
    { id: 'pv6', prompt: /Tablodaki sayıda/, kind: 'visual', answer: '10' },
  ];
  await page.goto('/');
  await page.getByRole('button', { name: 'eylunica’ya devam et →' }).click();
  await page.getByRole('button', { name: /5. Sınıf Derslerim/ }).click();
  await page.getByRole('button', { name: /^Matematik / }).click();
  await page.getByRole('button',{name:/Matematik konuları ve yazılı testleri/}).click();
  await page.getByLabel('Çalışma dönemi').selectOption('all');
  await page.getByRole('button', { name: /Örnek sayı çalışmaları/ }).click();
  await page.getByRole('button', { name: 'Konu testi', exact: true }).click();
  await expect(page.getByRole('button', { name: 'İpucu', exact: true })).toHaveCount(0);
  const seen: string[] = [];
  for (let index = 0; index < 6; index++) {
    const heading = await page.getByRole('region', { name: 'Soru çalışması' }).getByRole('heading').innerText();
    const q = questions.find(q => q.prompt.test(heading))!;
    expect(q).toBeTruthy();
    expect(seen).not.toContain(q.id);
    seen.push(q.id);
    if (q.kind === 'choice' || q.kind === 'boolean' || q.kind === 'visual') {
      if (q.kind === 'visual') await expect(page.getByRole('img', { name: /Basamak tablosu/ })).toBeVisible();
      await page.getByRole('button', { name: q.answer, exact: true }).click();
    } else await page.getByLabel('Yanıtın').fill(q.answer);
    await page.getByRole('button', { name: 'Yanıtı kontrol et' }).click();
    await expect(page.getByText(/^Doğru!/)).toBeVisible();
    await page.getByRole('button', { name: 'Sonraki soru' }).click();
  }
  await expect(page.getByText('Bu oturumdaki örnek sorular tamamlandı. Soru havuzu henüz 50 soruya ulaşmadı.')).toBeVisible();
  expect(new Set(seen).size).toBe(6);
});

test('resmî fen konusu, plan haftaları ve öğrenme çıktıları açılır', async ({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
 await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();
 await page.getByRole('button',{name:/^Fen Bilimleri /}).click();
  await page.getByLabel('Çalışma dönemi').selectOption('all');
 await page.getByLabel('Konu ara').fill('Gökyüzündeki Komşumuz: Güneş');
 await page.getByRole('button',{name:/Gökyüzündeki Komşumuz: Güneş/}).click();
 await expect(page.getByRole('heading',{name:'Gökyüzündeki Komşumuz: Güneş',exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Resmî program kaynağı',exact:true})).toHaveAttribute('href',/fen-bilimleri.*zip/);
 await page.locator('summary').filter({hasText:'öğrenme çıktıları'}).click();
 await expect(page.getByText(/FB.5.1.1/).first()).toBeVisible();
 await page.getByRole('button',{name:'Video',exact:true}).click();
 await expect(page.getByText('Bu konu için incelenip onaylanmış video henüz yok.')).toBeVisible();
 await expect(page.locator('iframe')).toHaveCount(0);
});
