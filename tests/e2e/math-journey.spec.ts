import {test,expect,type Page} from './local-test';
import {mathJourneyQuestions} from '../../src/grade5/math-journey-bank';
import AxeBuilder from '@axe-core/playwright';
async function enter(page:Page){await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Matematik /}).click();}
async function answer(page:Page,correct=true){const id=await page.locator('.journey-scene').getAttribute('data-question-id');const q=mathJourneyQuestions.find(q=>q.id===id)!;expect(q).toBeTruthy();const value=correct?q.answer:q.choices?q.choices.find(c=>c!==q.answer)!:q.answer==='0'?'1':'0';if(q.choices)await page.getByRole('button',{name:value,exact:true}).click();else for(const digit of value.replace('.',','))await page.locator('.journey-keypad').getByRole('button',{name:digit,exact:true}).click();await page.getByRole('button',{name:/Yanıtımı (kaydet|kontrol et)/}).click();return q;}
async function fits(page:Page,rootSelector='.math-journey-shell'){const bad=await page.locator(rootSelector).evaluate(root=>Array.from(root.querySelectorAll('button,input,select,output')).filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden').filter(el=>{const r=el.getBoundingClientRect();const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);const disabled=el instanceof HTMLButtonElement&&el.disabled;return r.top<-.5||r.left<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5||!disabled&&!!hit&&!el.contains(hit);}).map(el=>({text:el.textContent?.slice(0,50),rect:el.getBoundingClientRect().toJSON()})));expect(bad).toEqual([]);}
test('telefon, tablet, masaüstü ve yatay ekranda tek sahne; kapı yalnız tamamlanınca görünür',async({page})=>{
 test.setTimeout(120000);
 await enter(page);
 for(const size of [{width:320,height:568},{width:390,height:844},{width:768,height:1024},{width:1366,height:768},{width:844,height:390},{width:2560,height:1440}]){
  await page.setViewportSize(size);await fits(page);
  await page.locator('[data-topic-id="topic-a0155915387c7658"]').click();
  await expect(page.locator('.journey-action-slot .journey-portal')).toHaveCount(0);
  await page.getByRole('button',{name:'Modeli kendin değiştir',exact:true}).click();await page.getByRole('button',{name:'90°',exact:true}).click();
  await expect(page.locator('.journey-action-slot .journey-portal')).toBeVisible();await fits(page);
  await page.locator('.journey-action-slot .journey-portal').click();
  await expect(page.locator('.journey-action-slot .journey-portal')).toHaveCount(0);
  await page.getByRole('button',{name:'✦ Bu adımı anladım',exact:true}).click();await fits(page);
  await page.getByRole('button',{name:'Konu testi · 20',exact:true}).click();
  await expect(page.locator('input[type=text]')).toHaveCount(0);await fits(page);
  await answer(page);await fits(page);
  await page.getByRole('button',{name:'← Harita',exact:true}).click();
  await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await fits(page);await page.getByRole('button',{name:'Yazılıyı başlat',exact:true}).click();await fits(page);await page.getByRole('button',{name:'Boş bırak',exact:true}).click();await page.getByRole('button',{name:'← Harita',exact:true}).click();await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await fits(page);await page.getByRole('button',{name:'← Harita',exact:true}).click();
 }
});
test('yazılı notu, yanlış ve boş sayıları; görselli çözümler, kayıt ve tekrar etmeyen yeni sorular',async({page})=>{
 test.setTimeout(120000);await enter(page);await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await page.getByRole('button',{name:'Yazılıyı başlat',exact:true}).click();const ids:string[]=[];
 for(let i=0;i<20;i++){ids.push((await page.locator('.journey-scene').getAttribute('data-question-id'))!);if(i>=18)await page.getByRole('button',{name:'Boş bırak',exact:true}).click();else await answer(page,i<12);await expect(page.getByText('Yanıtın kaydedildi.',{exact:true})).toHaveCount(0);if(i<19)await expect(page.locator('.journey-scene')).not.toHaveAttribute('data-question-id',ids.at(-1)!);}
 await expect(page.getByRole('heading',{name:'Yazılı notun',exact:true})).toBeVisible();await expect(page.getByText('60/100',{exact:true})).toBeVisible();await expect(page.getByText('12 doğru · 6 yanlış · 2 boş',{exact:true})).toBeVisible();await fits(page);
 await page.getByRole('button',{name:'Görselli çözümleri incele →',exact:true}).click();await expect(page.locator('.figure-solution')).toBeVisible();await fits(page);
 await page.getByRole('button',{name:'← Harita',exact:true}).click();await page.getByRole('button',{name:'Yazılı testleri',exact:true}).click();await page.getByRole('button',{name:'Yazılıyı başlat',exact:true}).click();expect(ids).not.toContain(await page.locator('.journey-scene').getAttribute('data-question-id'));
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('eylunica-grade5-exams-v1')!));expect(saved.history.at(-1).questionIds).toEqual(ids);
});
test('ipucu ve çözüm görseli, ses tercihleri, klavyesiz alıştırma ve çevrimdışı harita',async({page,context})=>{
 test.setTimeout(90000);await enter(page);await page.locator('[data-topic-id="topic-4add1fe377559e12"]').click();await page.getByRole('button',{name:'Alıştırma · 8',exact:true}).click();await page.getByRole('button',{name:'İpucu',exact:true}).click();await expect(page.locator('.figure-hint')).toBeVisible();await answer(page);await expect(page.locator('.figure-solution')).toBeVisible();
 expect((await new AxeBuilder({page}).include('.math-journey-shell').withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
 expect(await page.locator('input:not([type=range]):not([type=checkbox])').count()).toBe(0);await page.getByRole('button',{name:'← Harita',exact:true}).click();await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Matematik /}).click();await expect(page.getByRole('region',{name:'Matematik oyun haritası'})).toBeVisible();
});

test('ders kitaplığı da sayfa kaydırmadan yedi kitabı dokunmatik sayfalarla sunar',async({page})=>{
 test.setTimeout(90000);await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();
 for(const size of [{width:320,height:568},{width:768,height:1024},{width:844,height:390},{width:1366,height:768}]){
  await page.setViewportSize(size);await fits(page,'.discovery');await expect(page.locator('.discovery-book:visible')).toHaveCount(7);await expect(page.locator('.discovery-pages')).toHaveCount(0);

 }
});

test('Tonguç kapakları onaysız açılır; video bitince veya kimliği değişince ders ekranına dönülür',async({page})=>{
 test.setTimeout(90000);const external:string[]=[];
 page.on('request',r=>{if(/youtube-nocookie|googleapis.com\/youtube/.test(r.url()))external.push(r.url());});
 // The browser contract is tested locally; this does not claim a real streamed-video review.
 await page.route('https://i.ytimg.com/**',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#8054aa"/></svg>'}));
 await page.route('https://www.youtube.com/iframe_api',route=>route.fulfill({contentType:'application/javascript',body:`
 window.YT={Player:class {
  constructor(host,options){this.id=options.videoId;this.frame=document.createElement('iframe');this.frame.src='https://www.youtube-nocookie.com/embed/'+this.id+'?rel=0';this.frame.title='Onaylı matematik videosu';host.replaceWith(this.frame);this.state=e=>{if(e.detail.id)this.id=e.detail.id;options.events.onStateChange({target:this,data:e.detail.state});};window.addEventListener('lesson-test-state',this.state);setTimeout(()=>options.events.onReady({target:this}),0);}
  getIframe(){return this.frame;}getVideoUrl(){return 'https://www.youtube.com/watch?v='+this.id;}destroy(){window.removeEventListener('lesson-test-state',this.state);this.frame.remove();}
 }};window.onYouTubeIframeAPIReady();
 `}));
 await page.route('https://www.youtube-nocookie.com/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="tr"><title>Yerel oynatıcı testi</title><body>Oynatıcı çerçevesi</body></html>'}));
 await enter(page);await page.locator('[data-topic-id="topic-4add1fe377559e12"]').click();await page.getByRole('button',{name:'Video',exact:true}).click();
 await expect(page.locator('.journey-video-choice')).toHaveCount(2);await expect(page.locator('.journey-video-choice').first()).toBeEnabled();expect(external).toEqual([]);await expect(page.locator('.journey-video iframe')).toHaveCount(0);
 await expect(page.getByRole('checkbox',{name:/Ebeveynimle birlikte/})).toHaveCount(0);
 for(const size of [{width:320,height:568},{width:390,height:844},{width:768,height:1024},{width:1366,height:768},{width:844,height:390}]){
  await page.setViewportSize(size);await fits(page);const cover=page.locator('.journey-video-thumbnail img').first();await expect(cover).toHaveAttribute('src','https://i.ytimg.com/vi/12eff2QXilg/mqdefault.jpg');await expect(cover).toBeVisible();expect(await cover.evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);await page.locator('.journey-video-choice').first().click();
  const frame=page.getByTitle('Onaylı matematik videosu');await expect(frame).toHaveAttribute('src','https://www.youtube-nocookie.com/embed/12eff2QXilg?rel=0');await expect(frame).toBeVisible();await fits(page);
  const rect=await frame.boundingBox();expect(rect!.width).toBeGreaterThanOrEqual(200);expect(rect!.height).toBeGreaterThanOrEqual(200);expect(rect!.y+rect!.height).toBeLessThanOrEqual(size.height+.5);
  await page.getByRole('button',{name:'← Diğer videolar',exact:true}).click();await expect(frame).toHaveCount(0);
 }
 expect(external.some(url=>url.includes('googleapis.com/youtube'))).toBe(false);
 await page.locator('.journey-video-choice').first().click();await expect(page.getByTitle('Onaylı matematik videosu')).toBeVisible();
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('lesson-test-state',{detail:{state:0}})));
 await expect(page.locator('.math-film:not(.math-film-question)')).toHaveCount(1);await expect(page.locator('.journey-video iframe')).toHaveCount(0);
 await page.getByRole('button',{name:'Video',exact:true}).click();await page.locator('.journey-video-choice').first().click();await expect(page.getByTitle('Onaylı matematik videosu')).toBeVisible();
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('lesson-test-state',{detail:{state:1,id:'not-selected'}})));
 await expect(page.locator('.math-film:not(.math-film-question)')).toHaveCount(1);await expect(page.locator('.journey-video iframe')).toHaveCount(0);
 await page.getByRole('button',{name:'← Harita',exact:true}).click();await page.getByRole('button',{name:'Sonraki duraklar →',exact:true}).click();await page.locator('[data-topic-id="topic-05bf7580a6ccbb59"]').click();await page.getByRole('button',{name:'Video',exact:true}).click();await expect(page.locator('.journey-video-choice')).toHaveCount(3);
 for(const size of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(size);await fits(page);for(const img of await page.locator('.journey-video-thumbnail img').all())await expect(img).toBeVisible();}
});

test('YouTube kontrol API yüklenmezse denetimsiz oynatıcı açılmaz; derse dönüş çalışır',async({page})=>{
 await page.route('https://www.youtube.com/iframe_api',route=>route.abort());
 await enter(page);await page.locator('[data-topic-id="topic-4add1fe377559e12"]').click();await page.getByRole('button',{name:'Video',exact:true}).click();await page.locator('.journey-video-choice').first().click();
 await expect(page.getByText('Video şu anda açılamadı.',{exact:true})).toBeVisible();await expect(page.locator('.journey-video iframe')).toHaveCount(0);
 await page.getByRole('button',{name:'Görselli anlatıma dön',exact:true}).click();await expect(page.locator('.math-film:not(.math-film-question)')).toHaveCount(1);
});
