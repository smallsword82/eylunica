import {expect,type Page} from './local-test';
/** Exercise the child-visible controls; never set completion storage or internal state. */
export async function finishAngleCoach(page:Page){
 const stop=page.getByRole('button',{name:'Hareketi durdur',exact:true});if(await stop.isVisible())await stop.click();
 for(let i=0;i<2;i++)await page.getByRole('button',{name:'Gösterimi ilerlet →',exact:true}).click();
 await page.getByRole('button',{name:'✦ Birlikte yapalım →',exact:true}).click();
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'↑ Aç',exact:true}).click();
 await page.getByRole('button',{name:'✦ Şimdi sen dene →',exact:true}).click();
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'↓ Kapat',exact:true}).click();
 await expect(page.locator('.journey-action-slot .journey-portal')).toBeVisible();
}
