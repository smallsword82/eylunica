import { test, expect, enterAcademies } from './local-test';
import { fresh } from '../../src/storage';
import { stories } from '../../src/reading-engine';

test('replaying reading level one preserves the level-three lock after reload; exhausted levels explain what to do', async ({page}) => {
  const progress = fresh();
  progress.academyUnlocked = { math:1, reading:2, attention:1 };
  progress.stars = 19;
  const story = stories.find(s => s.level === 1)!;
  progress.academies.reading.seen = Object.fromEntries(story.questions.slice(0,-1).map(q => [q.id,1]));
  await page.addInitScript(p => { if(!sessionStorage.getItem('review-seeded')) {localStorage.setItem('ritma-progress-v1', JSON.stringify(p));sessionStorage.setItem('review-seeded','yes');} }, progress);
  await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
  await enterAcademies(page);await page.getByRole('button',{name:/^Okuduğunu Anlama Akademisi/}).click();
  await page.getByRole('button',{name:/Kısa metinler/}).click();
  const q=story.questions.at(-1)!;
  await page.getByRole('button',{name:q.choices[q.answer],exact:true}).click();
  await page.getByRole('button',{name:new RegExp(`^Kanıt cümlesi ${q.evidence![0]+1}:`)}).click();
  await page.getByRole('button',{name:'Yanıtımı kontrol et →'}).click();
  await page.getByRole('button',{name:'Görevi tamamla →',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Birlikte yeni yollar keşfettik!'})).toBeVisible();
  const saved = await page.evaluate(()=>JSON.parse(localStorage.getItem('ritma-progress-v1')!));
  expect(saved.academyUnlocked.reading).toBe(2);expect(saved.stars).toBe(20);
  await page.reload();await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
  await enterAcademies(page);await page.getByRole('button',{name:/^Okuduğunu Anlama Akademisi/}).click();
  await expect(page.getByRole('button',{name:/Derin okuma/})).toBeDisabled();
  const allLevelOne = stories.filter(s=>s.level===1).flatMap(s=>s.questions.map(q=>[q.id,1]));
  await page.evaluate(entries=>{const p=JSON.parse(localStorage.getItem('ritma-progress-v1')!);p.academies.reading.seen=Object.fromEntries(entries);localStorage.setItem('ritma-progress-v1',JSON.stringify(p));},allLevelOne);
  await page.reload();await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
  await enterAcademies(page);await page.getByRole('button',{name:/^Okuduğunu Anlama Akademisi/}).click();
  await page.getByRole('button',{name:/Kısa metinler/}).click();
  await expect(page.getByRole('heading',{name:'Bu düzeydeki hikâyeleri keşfettin!'})).toBeVisible();
  await page.getByRole('button',{name:'Okuma düzeylerine dön →'}).click();
  await expect(page.getByRole('button',{name:/Paragraf keşfi/})).toBeEnabled();
});

test('moon appearance has the correct illuminated area from crescent through gibbous and back', async ({page}) => {
  await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
  await page.getByRole('button',{name:/^5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Fen Bilimleri /}).click();
  await page.getByRole('button',{name:/Gökyüzündeki Komşumuz: Ay/}).click();await page.getByRole('button',{name:'Konu kaynakları ve ayrıntılar'}).click();
  const model=page.getByRole('region',{name:'Ay evreleri keşif modeli'});
  const slider=model.getByRole('slider');
  for(const day of [0,4,7.5,11,15,18.5,22,26,29.5]){
    await slider.fill(String(day));
    const fraction=await model.locator('svg').nth(1).evaluate(async svg=>{
      const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));await img.decode();
      const canvas=document.createElement('canvas');canvas.width=canvas.height=176;const ctx=canvas.getContext('2d')!;ctx.drawImage(img,0,0,176,176);
      const {data}=ctx.getImageData(0,0,176,176);let total=0,bright=0;
      for(let y=0;y<176;y++)for(let x=0;x<176;x++)if((x-88)**2+(y-88)**2<74**2){total++;if(data[(y*176+x)*4]>180)bright++;}
      return bright/total;
    });
    expect(Math.abs(fraction-(1-Math.cos(2*Math.PI*day/29.5))/2),`day ${day}`).toBeLessThan(.035);
  }
  await slider.fill('11');await expect(model.getByText('Büyüyen şişkin ay',{exact:true})).toBeVisible();
  await slider.fill('22');await expect(model.getByText('Son dördün',{exact:true})).toBeVisible();
});
