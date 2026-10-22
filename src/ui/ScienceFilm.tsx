import {useEffect,useRef,useState} from 'react';
import {useLessonVoice} from '../audio/useLessonVoice';
import {narrationManifest} from '../audio/narration-manifest';
import type {ScienceFigure} from '../grade5/science-plans';
import {ScienceScene} from './ScienceScene';
export function ScienceFilm({text,caption,figure,paused,motion,onReady}:{text:string;caption:string;figure:ScienceFigure;paused:boolean;motion:boolean;onReady:()=>void}){
 const [frame,setFrame]=useState(0),[playing,setPlaying]=useState(true),[complete,setComplete]=useState(false);
 const voice=useLessonVoice(text,paused||!playing);
 const speaking=useRef(false);speaking.current=voice.playing;
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const duration=Math.max(5500,(narrationManifest[text]?.duration||6)*1000+250);
 const elapsed=useRef(0);
 useEffect(()=>{
  if(!playing||paused||!voice.visible||!motion||reduced||complete||voice.automatic===null)return;
  let last=performance.now();
  const timer=setInterval(()=>{const now=performance.now();elapsed.current+=now-last;last=now;setFrame(Math.min(3,elapsed.current/duration*3));if(elapsed.current>=duration&&!speaking.current){clearInterval(timer);setComplete(true);setPlaying(false);onReady();}},100);
  return()=>clearInterval(timer);
 },[playing,paused,voice.visible,motion,reduced,complete,voice.automatic,duration,onReady]);
 function advance(){setPlaying(false);const next=Math.min(3,Math.floor(frame)+1);setFrame(next);if(next===3){setComplete(true);onReady();}}
 return <section className="science-film" aria-label="Sesli ve hareketli fen anlatımı">
  <ScienceScene animate figure={{...figure,...(figure.kind==='moon'?{values:[frame]}:{})}} frame={frame} still={paused||!motion||reduced}/>
  <p className="science-caption">{caption}</p>
  <div className="science-film-controls">
   <button disabled={paused} aria-label={playing?'Animasyonu duraklat':'Animasyonu oynat'} onClick={()=>{if(complete){elapsed.current=0;setFrame(0);setComplete(false);}setPlaying(!playing);}}>{playing?'Ⅱ':'▶'}</button>
   <span aria-label="Gösterim ilerlemesi">{Array.from({length:4},(_,i)=><i key={i} className={frame>=i?'is-seen':''}/>)}</span>
   <button disabled={paused||complete} onClick={advance}>Sonraki görüntü →</button>
   <button disabled={paused||voice.silent} onClick={voice.repeat} aria-label="Bu adımı tekrar dinle">↻ Dinle</button>
  </div>
 </section>;
}
