import {test,expect,type Page} from './local-test';
import {finishMathCoach} from './math-coach-helpers';
import {mathFilms} from '../../src/grade5/math-films';
import {mathJourneyQuestions} from '../../src/grade5/math-journey-bank';
import {mathInstructions,practiceHintSpeech,practiceSolutionSpeech} from '../../src/grade5/math-narration';
import {narrationManifest} from '../../src/audio/narration-manifest';
async function tracked(page:Page){await page.addInitScript(()=>{const Native=window.Audio;(window as any).__lessonAudio=[];const Audio=function(src?:string){const audio=new Native(src);(window as any).__lessonAudio.push(audio);return audio;};Audio.prototype=Native.prototype;(window as any).Audio=Audio;});}
async function playing(page:Page,text:string){const asset=narrationManifest[text];expect(asset,text).toBeTruthy();await expect.poll(()=>page.evaluate(file=>(window as any).__lessonAudio.some((a:HTMLAudioElement)=>a.src.endsWith(file)&&!a.paused&&a.currentTime>.05),asset.file),{timeout:8000}).toBe(true);}
async function enter(page:Page){await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Matematik /}).click();}
test('every non-angle topic starts its own recorded explanation, rather than sharing angle narration',async({page})=>{
 test.setTimeout(100000);await tracked(page);await enter(page);await page.getByLabel('Çalışma dönemi').selectOption('all');let spoken=0;
 for(let region=0;region<5;region++){
  const ids=await page.locator('[data-topic-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-topic-id')!));
  for(const id of ids){if(id==='topic-a0155915387c7658')continue;await page.locator(`[data-topic-id="${id}"]`).click();await playing(page,mathFilms[id].explain[0].captions[0]);spoken++;await page.getByRole('button',{name:'← Harita',exact:true}).click();}
  if(region<4)await page.getByRole('button',{name:'Sonraki duraklar →',exact:true}).click();
 }
 expect(spoken).toBe(19);
});
test('explanation, full text, example, exercise question, hint and solution actually play; tests and written exams explain the controls',async({page,context})=>{
 test.setTimeout(100000);await tracked(page);await enter(page);const id='topic-c89c9fdbb63ce0ad';await page.locator(`[data-topic-id="${id}"]`).click();await finishMathCoach(page,id);await page.locator('.journey-portal').click();
 await playing(page,mathFilms[id].explain[1].captions[0]);await page.getByRole('button',{name:'Tam açıklamayı oku',exact:true}).click();const paragraph=await page.locator('.journey-reading').innerText();await playing(page,paragraph);await page.getByRole('button',{name:'Animasyona dön',exact:true}).click();
 for(let i=1;i<mathFilms[id].explain.length;i++){for(let shot=0;shot<3;shot++)await page.getByRole('button',{name:'Sonraki animasyon karesi',exact:true}).click();await page.locator('.journey-portal').click();}
 await playing(page,mathFilms[id].example[0].captions[0]);await page.getByRole('button',{name:'Alıştırma · 8',exact:true}).click();await playing(page,mathInstructions.practice);
 const qid=await page.locator('.journey-scene').getAttribute('data-question-id'),q=mathJourneyQuestions.find(q=>q.id===qid)!;
 // Speed only the introductory clip, then exercise the real queued question Audio.
 await page.evaluate(file=>{const a=(window as any).__lessonAudio.findLast((a:HTMLAudioElement)=>a.src.endsWith(file)&&!a.paused);a.currentTime=Math.max(0,a.duration-.1);},narrationManifest[mathInstructions.practice].file);await playing(page,q.prompt);
 await page.getByRole('button',{name:'İpucu',exact:true}).click();await playing(page,practiceHintSpeech(q));
 if(q.choices)await page.getByRole('button',{name:q.answer,exact:true}).click();else for(const digit of q.answer.replace('.',','))await page.locator('.journey-keypad').getByRole('button',{name:digit,exact:true}).click();await page.getByRole('button',{name:'Yanıtımı kontrol et',exact:true}).click();await playing(page,practiceSolutionSpeech(q));
 // Cached audio remains usable without any speech API or device TTS.
 await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.getByRole('button',{name:'Yönergeyi tekrar dinle',exact:true}).click();await playing(page,practiceSolutionSpeech(q));await context.setOffline(false);
 await page.getByRole('button',{name:'Konu testi · 20',exact:true}).click();await playing(page,mathInstructions.test);await page.getByRole('button',{name:'← Harita',exact:true}).click();await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await playing(page,mathInstructions.written);await page.getByRole('button',{name:'Yazılıyı başlat',exact:true}).click();await playing(page,mathInstructions.writtenStart);
});
