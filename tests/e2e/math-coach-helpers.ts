import {expect,type Page} from './local-test';
import {mathCoachPlans} from '../../src/grade5/math-coach';
import {finishAngleCoach} from './angle-coach-helpers';
export async function finishMathCoach(page:Page,id:string,check?:()=>Promise<void>){
 if(id==='topic-a0155915387c7658'){await finishAngleCoach(page);return;}
 const stop=page.getByRole('button',{name:'Hareketi durdur',exact:true});if(await stop.isVisible())await stop.click();
 await expect(page.locator('.journey-action-slot .journey-portal')).toHaveCount(0);
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'Sonraki animasyon karesi',exact:true}).click();
 await page.getByRole('button',{name:'✦ Birlikte yapalım →',exact:true}).click();
 for(const stage of ['together','try'] as const){
  await check?.();const task=mathCoachPlans[id][stage];await expect(page.locator('.journey-action-slot .journey-portal')).toHaveCount(0);
  const direction=task.target>task.initial?1:0;
  for(let i=0;i<Math.abs(task.target-task.initial);i++)await page.getByRole('button',{name:`${direction===0?'−':'+'} ${task.buttons[direction]}`,exact:true}).click();
  await check?.();if(stage==='together')await page.getByRole('button',{name:'✦ Şimdi sen dene →',exact:true}).click();
 }
 await expect(page.locator('.journey-action-slot .journey-portal')).toBeVisible();
}
