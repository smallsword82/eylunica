import {useEffect,useState} from 'react';
import type {MathFilmScene} from '../grade5/math-films';
import {diagramHint,type MathDiagram} from '../grade5/math-diagrams';
import {MathDiagramCanvas} from './MathDiagramCanvas';
import './MathFilm.css';
/** A finite, four-shot animation. Manual stepping remains available without motion. */
export function MathFilm({scene,diagram,mode='lesson',paused=false,motion=true,onComplete}:{scene?:MathFilmScene;diagram?:MathDiagram;mode?:'lesson'|'question'|'hint'|'solution';paused?:boolean;motion?:boolean;onComplete?:()=>void}){
 const reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const [frame,setFrame]=useState(0),[playing,setPlaying]=useState(!reduced);
 const model=scene?.diagrams[frame]||diagram;
 useEffect(()=>{if(!playing||paused||!motion||reduced||frame===3)return;const timer=setTimeout(()=>setFrame(f=>Math.min(3,f+1)),mode==='lesson'?2800:1800);return()=>clearTimeout(timer);},[frame,playing,paused,motion,reduced,mode]);
 useEffect(()=>{if(frame===3){setPlaying(false);onComplete?.();}},[frame]); // Completion is tied to the scene's last shot, not the callback identity.
 if(!model)return null;
 const compact=mode!=='lesson';
 return <section className={`math-film ${compact?'math-film-question':''} ${paused||!motion?'film-still':''}`} aria-label={compact?'Sorunun hareketli modeli':'Adım adım animasyon'} data-scene={scene?.id}>
  <MathDiagramCanvas diagram={model} frame={frame} reveal={mode==='lesson'||mode==='solution'} teaching={mode!=='question'} className="math-film-canvas"/>
  {!compact&&<p className="math-film-caption" aria-live={playing?'off':'polite'}>{scene?.captions[frame]||diagramHint(model)}</p>}
  <nav className="math-film-controls" aria-label="Animasyon kontrolleri">
   <button disabled={paused} aria-label={frame===3?'Animasyonu tekrar oynat':playing?'Animasyonu duraklat':'Animasyonu oynat'} onClick={()=>{if(frame===3){setFrame(0);setPlaying(true);}else setPlaying(!playing);}}>{frame===3?'↻':playing?'Ⅱ':'▶'}</button>
   <button disabled={paused||frame===0} aria-label="Önceki animasyon karesi" onClick={()=>{setPlaying(false);setFrame(frame-1);}}>‹</button>
   <span>{frame+1}/4</span>
   <div className="math-film-timeline" aria-hidden="true">{[0,1,2,3].map(i=><i className={i<=frame?'shot-complete':''} key={i}/>)}</div>
   <button disabled={paused||frame===3} aria-label="Sonraki animasyon karesi" onClick={()=>{setPlaying(false);setFrame(frame+1);}}>›</button>
  </nav>
 </section>;
}
