import {selectGradeCourse} from './local-test';
import {test,expect} from './local-test';
import {mathJourneyQuestions} from '../../src/grade5/math-journey-bank';
async function openMath(page:any){await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Matematik /}).click();await page.locator('[data-topic-id="topic-4add1fe377559e12"]').click();await page.getByRole('button',{name:'Alıştırma · 8',exact:true}).click();}
async function solve(page:any){const id=await page.locator('.journey-scene').getAttribute('data-question-id');const q=mathJourneyQuestions.find(q=>q.id===id)!;if(q.choices)await page.getByRole('button',{name:q.answer,exact:true}).click();else for(const digit of q.answer)await page.locator('.journey-keypad').getByRole('button',{name:digit,exact:true}).click();await page.getByRole('button',{name:'Yanıtımı kontrol et',exact:true}).click();return q;}
test('dokunmatik alıştırma yanıtı ve eski oyun verisi korunur; sonraki oturumda soru tekrarlanmaz',async({page,context})=>{
 test.setTimeout(60000);await openMath(page);const before=await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'));const q=await solve(page);await expect(page.locator('.figure-solution')).toBeVisible();await page.getByRole('button',{name:'← Harita',exact:true}).click();await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Matematik /}).click();await page.locator('[data-topic-id="topic-4add1fe377559e12"]').click();await page.getByRole('button',{name:'Alıştırma · 8',exact:true}).click();expect(await page.locator('.journey-scene').getAttribute('data-question-id')).not.toBe(q.id);expect(await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'))).toBe(before);const answers=await page.evaluate(()=>JSON.parse(localStorage.getItem('eylunica-grade5-v1')!).attempts);expect(answers.some((a:any)=>a.questionId===q.id&&a.correct)).toBe(true);
});
test('sekiz alıştırma ve yirmi soruluk konu testi farklı setlerdir',async({page})=>{
 test.setTimeout(60000);await openMath(page);const seen:string[]=[];for(let i=0;i<8;i++){const q=await solve(page);expect(seen).not.toContain(q.id);seen.push(q.id);await page.locator('.journey-action-slot .journey-portal').click();}await expect(page.getByText('100/100',{exact:true})).toBeVisible();await page.getByRole('button',{name:'20 soruluk konu testine başla',exact:true}).click();expect(seen).not.toContain(await page.locator('.journey-scene').getAttribute('data-question-id'));await expect(page.locator('.journey-question-counter')).toContainText('1/20');await expect(page.getByRole('button',{name:'İpucu',exact:true})).toHaveCount(0);
});

test('resmî fen konusu, plan haftaları ve öğrenme çıktıları açılır', async ({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();
 await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();
 await selectGradeCourse(page,/^Fen Bilimleri /);
  await page.getByLabel('Çalışma dönemi').selectOption('all');
 await page.getByRole('button',{name:/Gökyüzündeki Komşumuz: Güneş/}).click();
 await expect(page.getByRole('heading',{name:'Gökyüzündeki Komşumuz: Güneş',exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Resmî program kaynağı',exact:true})).toHaveAttribute('href',/fen-bilimleri.*zip/);
 await page.locator('summary').filter({hasText:'öğrenme çıktıları'}).click();
 await expect(page.getByText(/FB.5.1.1/).first()).toBeVisible();
 await page.getByRole('button',{name:'Video',exact:true}).click();
 await expect(page.getByText('Bu konu için incelenip onaylanmış video henüz yok.')).toBeVisible();
 await expect(page.locator('iframe')).toHaveCount(0);
});
