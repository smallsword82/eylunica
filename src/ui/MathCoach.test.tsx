import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {mathCoachPlans} from '../grade5/math-coach';
import {mathModels} from '../grade5/math-models';
import {MathCoach} from './MathCoach';
vi.mock('../audio/useLessonVoice',()=>({useLessonVoice:()=>({visible:true,automatic:false,silent:false,error:'',repeat:vi.fn()})}));
vi.mock('../audio/math-sound',()=>({mathChime:vi.fn()}));
afterEach(()=>{cleanup();vi.useRealTimers();});
it('every non-angle mathematics topic has both a concrete guided and an independent task',()=>{
 expect(Object.keys(mathCoachPlans).sort()).toEqual(Object.keys(mathModels).filter(id=>mathModels[id]!=='angle').sort());
 for(const plan of Object.values(mathCoachPlans))for(const task of [plan.together,plan.try]){
  expect(task.initial).not.toBe(task.target);expect(task.target).toBeGreaterThanOrEqual(task.min);expect(task.target).toBeLessThanOrEqual(task.max);
  expect(task.diagram(task.initial)).not.toEqual(task.diagram(task.target));expect(task.readout(task.initial)).not.toBe(task.readout(task.target));
 }
});
it.each(Object.keys(mathCoachPlans))('%s only opens continuation after both correct manipulations; replay resets it',id=>{
 vi.useFakeTimers();const ready=vi.fn();render(<MathCoach topicId={id} paused={false} motion={false} onReady={ready}/>);
 act(()=>vi.advanceTimersByTime(60000));expect(ready).toHaveBeenLastCalledWith(false);
 for(let i=0;i<3;i++)fireEvent.click(screen.getByRole('button',{name:'Sonraki animasyon karesi'}));
 fireEvent.click(screen.getByRole('button',{name:'✦ Birlikte yapalım →'}));
 for(const stage of ['together','try'] as const){const task=mathCoachPlans[id][stage],direction=task.target>task.initial?1:0;
  act(()=>vi.advanceTimersByTime(60000));expect(ready).toHaveBeenLastCalledWith(false);
  for(let i=0;i<Math.abs(task.target-task.initial);i++)fireEvent.click(screen.getByRole('button',{name:`${direction===0?'−':'+'} ${task.buttons[direction]}`}));
  expect(ready).toHaveBeenLastCalledWith(stage==='try');if(stage==='together')fireEvent.click(screen.getByRole('button',{name:'✦ Şimdi sen dene →'}));
 }
 fireEvent.click(screen.getByRole('button',{name:'Gösterimi tekrar izle'}));expect(ready).toHaveBeenLastCalledWith(false);
});
