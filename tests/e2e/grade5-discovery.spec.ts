import {test,expect} from './local-test';
import AxeBuilder from '@axe-core/playwright';
test('bütün matematik konu modelleri telefon ve yatay ekranda görünür; haritada dört durakla ilerlenir',async({page})=>{
 test.setTimeout(120000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/5. Sınıf Derslerim/}).click();await expect(page.locator('.discovery-books button')).toHaveCount(7);await page.getByRole('button',{name:/^Matematik /}).click();await page.getByLabel('Çalışma dönemi').selectOption('all');
 const seen=new Set<string>();
 for(let group=0;group<5;group++){
  const ids=await page.locator('[data-topic-id]').evaluateAll(nodes=>nodes.map(el=>el.getAttribute('data-topic-id')!));
  for(const id of ids){seen.add(id);await page.locator(`[data-topic-id="${id}"]`).click();await expect(page.locator('.math-film')).toHaveCount(1);await page.getByRole('button',{name:'Modeli kendin değiştir',exact:true}).click();await expect(page.locator('.math-visual,.angle-lesson')).toHaveCount(1);
   for(const size of [{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(size);const bad=await page.locator('.journey-model').evaluate(root=>Array.from(root.querySelectorAll('button,input,svg')).filter(el=>el.getClientRects().length).filter(el=>{const r=el.getBoundingClientRect();return r.bottom>innerHeight+.5||r.top<0||r.right>innerWidth+.5;}).map(el=>({text:el.textContent?.slice(0,30),rect:el.getBoundingClientRect().toJSON()})));expect(bad,id).toEqual([]);}
   await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'← Harita',exact:true}).click();
  }
  if(group<4)await page.getByRole('button',{name:'Sonraki duraklar →',exact:true}).click();
 }
 expect(seen.size).toBe(20);expect(errors).toEqual([]);
 expect((await new AxeBuilder({page}).include('.math-journey-shell').withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
});
