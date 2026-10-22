import {useEffect,useRef,useState} from 'react';
import type {MathFilmScene} from '../grade5/math-films';
import {diagramHint,type MathDiagram} from '../grade5/math-diagrams';
import {MathDiagramCanvas} from './MathDiagramCanvas';
import {useLessonVoice} from '../audio/useLessonVoice';
import {narrationManifest} from '../audio/narration-manifest';
import {playNarration} from '../audio/narration';
import './MathFilm.css';
/** A finite, four-shot animation. Manual stepping remains available without motion. */
export function MathFilm({scene,diagram,mode='lesson',paused=false,motion=true,spoken=false,onComplete}:{scene?:MathFilmScene;diagram?:MathDiagram;mode?:'lesson'|'question'|'hint'|'solution';paused?:boolean;motion?:boolean;spoken?:boolean;onComplete?:()=>void}){
 const reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const [frame,setFrame]=useState(0),[playing,setPlaying]=useState(!reduced),[done,setDone]=useState(false),[voicePaused,setVoicePaused]=useState(false);
 const model=scene?.diagrams[frame]||diagram;
 const text=scene?.captions[frame]||'',voice=useLessonVoice(text,paused||voicePaused,spoken);
 const speaking=useRef(false);speaking.current=spoken&&voice.playing;
 const duration=spoken&&!voice.silent&&voice.automatic!==false?Math.max(2800,(narrationManifest[text]?.duration||0)*1000+450):mode==='lesson'?2800:1800;
 useEffect(()=>{if(!playing||paused||!voice.visible||!motion||reduced||done||spoken&&voice.automatic===null)return;let timer:ReturnType<typeof setTimeout>;const advance=()=>{if(speaking.current){timer=setTimeout(advance,100);return;}if(frame<3)setFrame(f=>f+1);else{setDone(true);setPlaying(false);}};timer=setTimeout(advance,duration);return()=>clearTimeout(timer);},[frame,playing,paused,motion,reduced,done,duration,voice.visible,voice.automatic,spoken]);
 useEffect(()=>{if(done)onComplete?.();},[done]);
 if(!model)return null;
 const compact=mode!=='lesson';
 return <section className={`math-film ${compact?'math-film-question':''} ${paused||!motion?'film-still':''}`} aria-label={compact?'Sorunun hareketli modeli':'Adım adım animasyon'} data-scene={scene?.id}>
  <MathDiagramCanvas diagram={model} frame={frame} reveal={mode==='lesson'||mode==='solution'} teaching={mode!=='question'} className="math-film-canvas"/>
  {!compact&&<p className="math-film-caption" aria-live={playing?'off':'polite'}>{scene?.captions[frame]||diagramHint(model)}</p>}
  <nav className="math-film-controls" aria-label="Animasyon kontrolleri">
   <button disabled={paused} aria-label={done?'Animasyonu tekrar oynat':playing?'Animasyonu duraklat':'Animasyonu oynat'} onClick={()=>{if(done){setFrame(0);setDone(false);setPlaying(true);setVoicePaused(false);}else{setVoicePaused(playing);setPlaying(!playing);}}}>{done?'↻':playing?'Ⅱ':'▶'}</button>
   <button disabled={paused||frame===0} aria-label="Önceki animasyon karesi" onClick={()=>{setPlaying(false);setVoicePaused(false);setFrame(frame-1);}}>‹</button>
   <span>{frame+1}/4</span>
   <div className="math-film-timeline" aria-hidden="true">{[0,1,2,3].map(i=><i className={i<=frame?'shot-complete':''} key={i}/>)}</div>
   <button disabled={paused||frame===3} aria-label="Sonraki animasyon karesi" onClick={()=>{setPlaying(false);setVoicePaused(false);setFrame(frame+1);if(frame===2)setDone(true);}}>›</button>
   {spoken&&<button disabled={paused||voice.silent} aria-label="Bu adımı tekrar dinle" onClick={()=>{if(!voice.visible)return;if(voicePaused)void playNarration(text);else voice.repeat();}}>↻♪</button>}
  </nav>
 </section>;
}
