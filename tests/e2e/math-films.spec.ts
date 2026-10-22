import {finishAngleCoach} from './angle-coach-helpers';
import {test,expect,type Page} from './local-test';
import {mathFilms} from '../../src/grade5/math-films';
import {mathJourneyQuestions} from '../../src/grade5/math-journey-bank';
async function enter(page:Page){await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Matematik /}).click();await page.getByLabel('Çalışma dönemi').selectOption('all');}
async function fits(page:Page){const bad=await page.locator('.journey-scene').evaluate(root=>Array.from(root.querySelectorAll('button,output,svg')).filter(e=>e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);const covered=e instanceof HTMLButtonElement&&!e.disabled&&!!hit&&!e.contains(hit);return covered||r.left<-.5||r.top<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5;}).map(e=>({text:e.textContent?.slice(0,25),rect:e.getBoundingClientRect().toJSON()})));expect(bad).toEqual([]);}
test('twenty topics use their own filmed explanations and actual worked examples on touch screens',async({page})=>{
 test.setTimeout(180000);await enter(page);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));let count=0;
 for(let group=0;group<5;group++){
  const ids=await page.locator('[data-topic-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-topic-id')!));
  for(const id of ids){count++;await page.locator(`[data-topic-id="${id}"]`).click();await page.getByRole('button',{name:'Hareketi durdur',exact:true}).click();
   for(const size of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(size);await fits(page);}
   if(id==='topic-a0155915387c7658')await finishAngleCoach(page);else for(let f=0;f<3;f++)await page.getByRole('button',{name:'Sonraki animasyon karesi',exact:true}).click();await expect(page.locator('.journey-portal')).toBeVisible();await page.locator('.journey-portal').click();
   for(const [kind,scenes] of [['explain',id==='topic-a0155915387c7658'?mathFilms[id].explain:mathFilms[id].explain.slice(1)],['example',mathFilms[id].example]] as const){for(let i=0;i<scenes.length;i++){
    await expect(page.locator('.math-film')).toHaveAttribute('data-scene',scenes[i].id);await expect(page.locator('.math-film-caption')).toHaveText(scenes[i].captions[0]);
    for(const size of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(size);await fits(page);}
    for(let f=0;f<3;f++)await page.getByRole('button',{name:'Sonraki animasyon karesi',exact:true}).click();await expect(page.locator('.math-film-caption')).toHaveText(scenes[i].captions[3]);
    await page.locator('.journey-portal').click();
   }}
   // Each actual question family gets its own data, while answers stay hidden.
   for(let family=0;family<4;family++){
    const questionId=await page.locator('.journey-scene').getAttribute('data-question-id');const q=mathJourneyQuestions.find(q=>q.id===questionId)!;
    if(q.figure.diagram)await expect(page.locator('[data-diagram]')).toHaveAttribute('data-diagram',q.figure.diagram.kind);await page.getByRole('button',{name:'İpucu',exact:true}).click();
    for(const size of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(size);await fits(page);}
    if(q.choices)await page.getByRole('button',{name:q.answer,exact:true}).click();else for(const digit of q.answer.replace('.',','))await page.locator('.journey-keypad').getByRole('button',{name:digit,exact:true}).click();await page.getByRole('button',{name:'Yanıtımı kontrol et',exact:true}).click();await fits(page);await page.locator('.journey-portal').click();
   }
   await page.getByRole('button',{name:'Hareketi aç',exact:true}).click();await page.getByRole('button',{name:'← Harita',exact:true}).click();
  }
  if(group<4)await page.getByRole('button',{name:'Sonraki duraklar →',exact:true}).click();
 }
 expect(count).toBe(20);expect(errors).toEqual([]);
});
