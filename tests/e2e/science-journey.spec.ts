import {test,expect,type Page} from './local-test';
import {sciencePlans,scienceInstructions,scienceLessonById} from '../../src/grade5/science-plans';
import {scienceQuestionById} from '../../src/grade5/science-question-bank';
import {narrationManifest} from '../../src/audio/narration-manifest';
import {scoreExam} from '../../src/grade5/exams';
import AxeBuilder from '@axe-core/playwright';
import {enterScience,openScienceTopic,finishScienceCoach} from './science-helpers';
async function fits(page:Page){
 const outside=await page.locator('.science-top,.science-tabs,.science-stage,.science-stage>h2,.science-portal,.science-choices button,.science-touch-controls button,.science-answer-actions,.science-film-controls,.science-caption').evaluateAll(nodes=>nodes.filter(n=>{const r=n.getBoundingClientRect();return r.width&&r.height&&(r.left<-.5||r.top<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5);}).map(n=>({class:n.className,text:n.textContent,rect:n.getBoundingClientRect().toJSON()})));
 expect(outside).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
}
async function answer(page:Page,correct=true,blank=false){const id=await page.locator('.science-stage').getAttribute('data-question-id'),q=scienceQuestionById.get(id!)!;expect(q).toBeTruthy();if(blank)await page.getByRole('button',{name:'Boş bırak',exact:true}).click();else{const selected=correct?q.answer:q.choices!.find(c=>c!==q.answer)!;await page.getByRole('group',{name:'Yanıt seçenekleri'}).getByRole('button',{name:selected,exact:true}).click();await page.getByRole('button',{name:/^Yanıtımı (kontrol et|kaydet)$/}).click();}return q;}

test('all nine topics have distinct coached touch tasks, matching teaching models and viewport-sized continuation',async({page})=>{
 test.setTimeout(160000);await enterScience(page);await page.getByRole('button',{name:'Hareketi durdur',exact:true}).click();
 for(const plan of sciencePlans){
  await openScienceTopic(page,plan.id);await expect(page.locator('.science-coach')).toHaveAttribute('data-kind',plan.kind);await expect(page.locator('.science-portal')).toHaveCount(0);
  for(const size of [{width:320,height:568},{width:390,height:844},{width:768,height:1024},{width:1366,height:768},{width:844,height:390}]){await page.setViewportSize(size);await fits(page);}
  await finishScienceCoach(page,plan.kind);await fits(page);await page.locator('.science-portal').click();
  const l=scienceLessonById.get(plan.id)!;
  for(let i=0;i<l.sections.flatMap(s=>s.body).length;i++){
   await expect(page.locator('.science-phase-explain')).toBeVisible();for(let n=0;n<3;n++)await page.getByRole('button',{name:'Sonraki görüntü →',exact:true}).click();await fits(page);await page.locator('.science-portal').click();
  }
  for(let i=0;i<l.workedExample.steps.length;i++){await expect(page.locator('.science-phase-example')).toBeVisible();for(let n=0;n<3;n++)await page.getByRole('button',{name:'Sonraki görüntü →',exact:true}).click();await fits(page);await page.locator('.science-portal').click();}
  await expect(page.locator('.science-phase-practice')).toBeVisible();await expect(page.locator('.science-journey input')).toHaveCount(0);await fits(page);
  await page.getByRole('button',{name:'← Harita',exact:true}).click();
 }
 await page.setViewportSize({width:390,height:844});await openScienceTopic(page,sciencePlans[4].id);expect((await new AxeBuilder({page}).include('.science-journey').withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
});

test('practice and test never share questions; twenty answers advance directly and earn a recorded grade',async({page})=>{
 test.setTimeout(90000);await enterScience(page);const before=await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'));await openScienceTopic(page,sciencePlans[4].id);await page.getByRole('button',{name:'Alıştırma · 8',exact:true}).click();
 const ids:string[]=[];for(let i=0;i<8;i++){const q=await answer(page);ids.push(q.id);await expect(page.locator('.science-answer-feedback')).toContainText(q.explanation);await page.locator('.science-portal').click();}
 await expect(page.getByText('100/100',{exact:true})).toBeVisible();await page.getByRole('button',{name:'20 soruluk konu testine başla',exact:true}).click();
 for(let i=0;i<20;i++){await expect(page.locator('.science-question-count')).toContainText(`${i+1}/20`);await expect(page.getByRole('button',{name:'İpucu',exact:true})).toHaveCount(0);const q=await answer(page);expect(ids).not.toContain(q.id);ids.push(q.id);}
 await expect(page.getByText('100/100',{exact:true})).toBeVisible();await expect(page.getByText('20 doğru · 0 yanlış · 0 boş')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('ritma-progress-v1'))).toBe(before);const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('eylunica-science-journey-v1')!));expect(state.used).toHaveLength(28);expect(state.topics[sciencePlans[4].id]).toMatchObject({practice:true,test:true,bestScore:100});
 await page.getByRole('button',{name:'Görselli çözümleri incele'}).click();await expect(page.locator('.science-solution-answer')).toBeVisible();await fits(page);await page.getByRole('button',{name:'← Harita',exact:true}).click();await openScienceTopic(page,sciencePlans[4].id);await page.getByRole('button',{name:'Konu testi · 20',exact:true}).click();await expect(page.getByText('100/100',{exact:true})).toBeVisible();await expect(page.getByRole('group',{name:'Yanıt seçenekleri'})).toHaveCount(0);
});

test('written exam resumes offline at the next unanswered question, keeps blanks and grades without a saved-answer interstitial',async({page,context})=>{
 test.setTimeout(120000);await enterScience(page);await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await page.getByLabel('Soru sayısı').selectOption('10');await page.getByRole('button',{name:'Yazılıyı başlat',exact:true}).click();await answer(page);
 await expect(page.locator('.science-question-count')).toContainText('2/10');for(const size of [{width:320,height:568},{width:390,height:844},{width:844,height:390}]){await page.setViewportSize(size);await fits(page);}await page.setViewportSize({width:390,height:844});const id=await page.locator('.science-stage').getAttribute('data-question-id');
 await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await enterScience(page);await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await page.getByRole('button',{name:'Yarım kalan yazılıya devam et',exact:true}).click();
 await expect(page.locator('.science-stage')).toHaveAttribute('data-question-id',id!);
 await answer(page,true,true);await expect(page.locator('.science-question-count')).toContainText('3/10');await answer(page,false);
 for(let i=3;i<10;i++)await answer(page);
 await expect(page.getByText('80/100',{exact:true})).toBeVisible();await expect(page.getByText('8 doğru · 1 yanlış · 1 boş')).toBeVisible();
 const store=await page.evaluate(()=>JSON.parse(localStorage.getItem('eylunica-grade5-exams-v1')!));expect(store.drafts['course-2']).toBeUndefined();expect(scoreExam(store.history.at(-1))).toMatchObject({score:80,correct:8,wrong:1,blank:1});
 const image=await page.evaluate(async()=>{const i=new Image();i.src='/discovery/science-worlds.png';await i.decode();return i.naturalWidth;});expect(image).toBeGreaterThan(1000);
 await page.getByRole('button',{name:'Görselli çözümleri incele'}).click();await fits(page);
});

test('every discovery and teaching paragraph plays its own bundled Turkish voice; silent preferences stop it',async({page})=>{
 test.setTimeout(100000);
 await page.addInitScript(()=>{const Native=window.Audio;(window as any).__scienceAudio=[];const Audio=function(src?:string){const a=new Native(src);(window as any).__scienceAudio.push(a);return a;};Audio.prototype=Native.prototype;(window as any).Audio=Audio;});
 await enterScience(page);
 for(const plan of sciencePlans){await openScienceTopic(page,plan.id);await expect.poll(()=>page.evaluate(file=>(window as any).__scienceAudio.some((a:HTMLAudioElement)=>a.src.endsWith(file)&&!a.paused&&a.currentTime>.05),narrationManifest[plan.task].file),{timeout:8000}).toBe(true);await page.getByRole('button',{name:'← Harita',exact:true}).click();}
 await openScienceTopic(page,sciencePlans[4].id);await page.getByRole('button',{name:'Hareketi durdur',exact:true}).click();await finishScienceCoach(page,'force');await page.locator('.science-portal').click();const paragraph=scienceLessonById.get(sciencePlans[4].id)!.sections[0].body[0];await expect.poll(()=>page.evaluate(file=>(window as any).__scienceAudio.some((a:HTMLAudioElement)=>a.src.endsWith(file)&&!a.paused&&a.currentTime>.05),narrationManifest[paragraph].file)).toBe(true);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await expect.poll(()=>page.evaluate(()=>(window as any).__scienceAudio.every((a:HTMLAudioElement)=>a.paused))).toBe(true);await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await page.getByRole('button',{name:'← Harita',exact:true}).click();await page.getByRole('button',{name:'← Dersler',exact:true}).click();await page.getByRole('button',{name:'Sessiz',exact:true}).click();await page.getByRole('button',{name:/^Fen Bilimleri /}).click();await openScienceTopic(page,sciencePlans[0].id);await expect(page.locator('.science-coach-note button')).toBeDisabled();await expect.poll(()=>page.evaluate(()=>(window as any).__scienceAudio.every((a:HTMLAudioElement)=>a.paused))).toBe(true);
});

test('friction carts visibly move different distances from the same speed and freeze while the window is hidden',async({page})=>{
 await enterScience(page);await openScienceTopic(page,sciencePlans.find(p=>p.kind==='friction')!.id);
 const scene=page.locator('.science-coach .science-scene');
 const positions=()=>scene.locator('g[transform^="translate"]').evaluateAll(groups=>groups.map(g=>Number(g.getAttribute('transform')!.match(/translate\(([\d.]+)/)![1])));
 await page.getByRole('button',{name:'▶ İki arabayı birlikte bırak',exact:true}).click();
 await expect.poll(async()=>Number(await scene.getAttribute('data-frame'))).toBeGreaterThan(.7);
 const moving=await positions();expect(moving).toHaveLength(2);expect(moving[0]).toBeGreaterThan(moving[1]);expect(moving[1]).toBeGreaterThan(75);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));const frozen=await scene.getAttribute('data-frame');await page.waitForTimeout(250);expect(await scene.getAttribute('data-frame')).toBe(frozen);
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await expect.poll(async()=>Number(await scene.getAttribute('data-frame'))).toBe(3);
 const stopped=await positions();expect(stopped[0]).toBeCloseTo(365,0);expect(stopped[1]).toBeCloseTo(157.86,0);
});

test('a low grade stays unchanged while the saved correction path completes the topic without a repeated test',async({page})=>{
 await enterScience(page);await openScienceTopic(page,sciencePlans[1].id);await page.getByRole('button',{name:'Konu testi · 20',exact:true}).click();
 for(let i=0;i<20;i++)await answer(page,false);
 await expect(page.getByText('0/100',{exact:true})).toBeVisible();await expect(page.getByText('Görselli çözümleri sırayla inceleyince durağın tamamlanacak. Aldığın not değişmeyecek.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'← Harita',exact:true}).click();await openScienceTopic(page,sciencePlans[1].id);await page.getByRole('button',{name:'Konu testi · 20',exact:true}).click();await expect(page.getByText('0/100',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Görselli çözümleri incele',exact:true}).click();for(let i=0;i<20;i++)await page.locator('.science-portal').click();
 await expect(page.getByText('0/100',{exact:true})).toBeVisible();const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('eylunica-science-journey-v1')!));expect(state.topics[sciencePlans[1].id]).toMatchObject({test:true,bestScore:0});expect(state.used).toHaveLength(20);
 const attempts=await page.evaluate(()=>JSON.parse(localStorage.getItem('eylunica-grade5-v1')!).attempts);expect(attempts).toHaveLength(20);
});
