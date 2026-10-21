import {test,expect} from './local-test';
import {mathJourneyQuestions} from '../../src/grade5/math-journey-bank';

test('açı alıştırmasında sorulan açı, başlangıç ve çözüm açık; dört soru türü küçük ekrana sığar',async({page})=>{
 test.setTimeout(120000);await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Matematik /}).click();await page.locator('[data-topic-id="topic-a0155915387c7658"]').click();
 for(const size of [{width:320,height:568},{width:390,height:844},{width:768,height:1024},{width:844,height:390}]){
  await page.setViewportSize(size);await page.getByRole('button',{name:'Alıştırma · 8',exact:true}).click();
  const families=new Set<number>();
  for(let i=0;i<4;i++){
   const id=await page.locator('.journey-scene').getAttribute('data-question-id');const question=mathJourneyQuestions.find(q=>q.id===id)!;expect(question).toBeTruthy();families.add(question.taskFamily);
   await expect(page.locator('.journey-angle-figure')).toBeVisible();await expect(page.locator('.journey-angle-figure')).toContainText('O');await expect(page.locator('.journey-angle-figure')).toContainText('A');await expect(page.locator('.journey-angle-figure')).toContainText('B');
   await page.getByRole('button',{name:'İpucu',exact:true}).click();await expect(page.locator('.journey-hint')).toContainText(question.hints[0]);
   await expect.poll(async()=>page.locator('.math-journey-shell').evaluate(root=>Array.from(root.querySelectorAll('button,svg')).filter(el=>el.getClientRects().length).filter(el=>{const r=el.getBoundingClientRect();return r.top<-.5||r.bottom>innerHeight+.5||r.right>innerWidth+.5;}).map(el=>({text:el.textContent?.slice(0,30),rect:el.getBoundingClientRect().toJSON()})))).toEqual([]);
   if(size.width===390&&i===0)await page.screenshot({path:'/tmp/eylunica-angle-practice.png'});
   await page.getByRole('button',{name:question.answer,exact:true}).click();await page.getByRole('button',{name:'Yanıtımı kontrol et',exact:true}).click();await expect(page.getByRole('status').filter({hasText:'Keşfettin!'})).toContainText(question.explanation);
   await page.locator('.journey-action-slot .journey-portal').click();
  }
  expect(families.size).toBe(4);
 }
});
