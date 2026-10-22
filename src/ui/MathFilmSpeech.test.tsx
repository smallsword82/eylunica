import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {MathFilm} from './MathFilm';
import type {MathFilmScene} from '../grade5/math-films';
const state=vi.hoisted(()=>({speaking:true,visible:true,paused:false}));
vi.mock('../audio/useLessonVoice',()=>({useLessonVoice:(_text:string,paused:boolean)=>{state.paused=paused;return {visible:state.visible,automatic:true,silent:false,playing:state.speaking,repeat:vi.fn()};}}));
const scene:MathFilmScene={id:'voice-sync',anchor:'',captions:['Bir','İki','Üç','Dört'],diagrams:Array.from({length:4},()=>({kind:'rule',lines:['Bir','İki','Üç','Dört']}))};
afterEach(()=>{cleanup();vi.useRealTimers();state.speaking=true;state.visible=true;});
it('waits for actual speech, including a slow buffer or replay, before advancing or completing',()=>{
 vi.useFakeTimers();const done=vi.fn(),{container,rerender}=render(<MathFilm scene={scene} spoken onComplete={done}/>);
 for(let frame=0;frame<4;frame++){
  state.speaking=true;rerender(<MathFilm scene={scene} spoken onComplete={done}/>);act(()=>vi.advanceTimersByTime(10000));expect(container.querySelector('svg')).toHaveAttribute('data-frame',String(frame));expect(done).not.toHaveBeenCalled();
  state.speaking=false;rerender(<MathFilm scene={scene} spoken onComplete={done}/>);act(()=>vi.advanceTimersByTime(100));
 }
 expect(done).toHaveBeenCalledTimes(1);
});
it('the pause control stops narration; backgrounding freezes automatic progress',()=>{
 vi.useFakeTimers();const {container,rerender}=render(<MathFilm scene={scene} spoken/>);fireEvent.click(screen.getByRole('button',{name:'Animasyonu duraklat'}));expect(state.paused).toBe(true);act(()=>vi.advanceTimersByTime(10000));expect(container.querySelector('svg')).toHaveAttribute('data-frame','0');
 fireEvent.click(screen.getByRole('button',{name:'Animasyonu oynat'}));expect(state.paused).toBe(false);state.visible=false;state.speaking=false;rerender(<MathFilm scene={scene} spoken/>);act(()=>vi.advanceTimersByTime(10000));expect(container.querySelector('svg')).toHaveAttribute('data-frame','0');
});
