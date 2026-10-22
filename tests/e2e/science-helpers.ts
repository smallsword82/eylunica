import {expect,type Page} from './local-test';
import {sciencePlans} from '../../src/grade5/science-plans';
export async function enterScience(page:Page){await page.goto('/');await page.getByRole('button',{name:'eylunica’ya devam et →'}).click();await page.getByRole('button',{name:/^5. Sınıf Derslerim/}).click();await page.getByRole('button',{name:/^Fen Bilimleri /}).click();}
export async function openScienceTopic(page:Page,id:string){
 while(await page.getByRole('button',{name:'← Önceki duraklar',exact:true}).isEnabled())await page.getByRole('button',{name:'← Önceki duraklar',exact:true}).click();
 for(let i=0;i<10;i++){const target=page.locator(`[data-topic-id="${id}"]`);if(await target.isVisible()){await target.click();return;}await page.getByRole('button',{name:'Sonraki duraklar →',exact:true}).click();}throw Error('Topic missing '+id);
}
export async function finishScienceCoach(page:Page,kind:string){
 const coach=page.locator('.science-coach');
 const click=(name:string)=>coach.locator('.science-touch-controls').getByRole('button',{name,exact:true}).click();
 if(kind==='safety')await click('🥽 Gözlüğü tak');
 if(kind==='sun')await click('☀ Dönmeyi göster');
 if(kind==='moon'){await click('Ay’ı ilerlet →');await click('Ay’ı ilerlet →');}
 if(kind==='orbits'){await click('Dünya’yı dolandır');await click('Ay’ı dolandır');}
 if(kind==='force')for(let i=0;i<3;i++)await click('+ Bir ağırlık ekle');
 if(kind==='mass')await click('Valizi Ay’a götür →');
 if(kind==='friction')await click('▶ İki arabayı birlikte bırak');
 if(kind==='cell')for(const name of ['Hücre zarı','Sitoplazma','Çekirdek'])await click(name);
 if(kind==='body')await click('Kolu bük →');
 await coach.getByRole('group',{name:'Keşif sonucunu seç'}).getByRole('button',{name:sciencePlans.find(p=>p.kind===kind)!.answer,exact:true}).click();
 await expect(page.locator('.science-portal')).toBeVisible();
}
