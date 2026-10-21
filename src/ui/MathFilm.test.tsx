import {act,fireEvent,render,screen,cleanup} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {MathFilm} from './MathFilm';
import {MathDiagramCanvas} from './MathDiagramCanvas';
import {mathFilms} from '../grade5/math-films';
import {mathJourneyQuestions} from '../grade5/math-journey-bank';
afterEach(()=>{cleanup();vi.useRealTimers();});
it('plays a finite teaching sequence, pauses, steps manually and replays without leaving the lesson',()=>{
 vi.useFakeTimers();const done=vi.fn();const scene=mathFilms['topic-c89c9fdbb63ce0ad'].explain[3];const {container}=render(<MathFilm scene={scene} onComplete={done}/>);
 expect(container.querySelector('svg')).toHaveAttribute('data-frame','0');act(()=>vi.advanceTimersByTime(2800));expect(container.querySelector('svg')).toHaveAttribute('data-frame','1');fireEvent.click(screen.getByRole('button',{name:'Animasyonu duraklat'}));act(()=>vi.advanceTimersByTime(20000));expect(container.querySelector('svg')).toHaveAttribute('data-frame','1');fireEvent.click(screen.getByRole('button',{name:'Sonraki animasyon karesi'}));fireEvent.click(screen.getByRole('button',{name:'Sonraki animasyon karesi'}));expect(done).toHaveBeenCalledTimes(1);expect(screen.getByText('AB de yarıçapa eşitse üç kenar eşit: eşkenar.')).toBeInTheDocument();act(()=>vi.advanceTimersByTime(20000));expect(done).toHaveBeenCalledTimes(1);fireEvent.click(screen.getByRole('button',{name:'Animasyonu tekrar oynat'}));expect(container.querySelector('svg')).toHaveAttribute('data-frame','0');
});
it('global motion stop leaves manual frames usable and a parent pause disables them',()=>{
 vi.useFakeTimers();const scene=mathFilms['topic-c89c9fdbb63ce0ad'].explain[2];const {container,rerender}=render(<MathFilm scene={scene} motion={false}/>);act(()=>vi.advanceTimersByTime(20000));expect(container.querySelector('svg')).toHaveAttribute('data-frame','0');fireEvent.click(screen.getByRole('button',{name:'Sonraki animasyon karesi'}));expect(container.querySelector('svg')).toHaveAttribute('data-frame','1');rerender(<MathFilm scene={scene} paused/>);expect(screen.getByRole('button',{name:'Sonraki animasyon karesi'})).toBeDisabled();
});
it('does not calculate intermediate operation answers in a test figure',()=>{
 const q=mathJourneyQuestions.find(q=>q.figure.diagram?.kind==='flow')!;const {container,rerender}=render(<MathDiagramCanvas diagram={q.figure.diagram!} frame={3}/>);expect(container.textContent).toContain('…');expect(container.textContent).toContain('?');rerender(<MathDiagramCanvas diagram={q.figure.diagram!} frame={3} teaching reveal/>);expect(container.textContent).toContain(q.answer);
});
it('all lesson shots render finite geometry and positive rectangles',async()=>{
 const {renderToStaticMarkup}=await import('react-dom/server');
 for(const film of Object.values(mathFilms))for(const scene of [...film.explain,...film.example])for(let frame=0;frame<4;frame++){
  const markup=renderToStaticMarkup(<MathDiagramCanvas diagram={scene.diagrams[frame]} frame={frame} teaching reveal/>);
  expect(markup,scene.id).not.toMatch(/NaN|Infinity|(?:width|height)="-/);expect(markup,scene.id).toContain('role="img"');
 }
});
