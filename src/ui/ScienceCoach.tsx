import {useEffect,useRef,useState} from 'react';
import {useLessonVoice} from '../audio/useLessonVoice';
import type {SciencePlan} from '../grade5/science-plans';
import {ScienceScene} from './ScienceScene';
export function ScienceCoach({plan,paused,motion,onReady}:{plan:SciencePlan;paused:boolean;motion:boolean;onReady:()=>void}){
 const [value,setValue]=useState(0),[visited,setVisited]=useState<number[]>([]),[frame,setFrame]=useState(0),[animating,setAnimating]=useState(false),[observed,setObserved]=useState(false),[done,setDone]=useState(false),[wrong,setWrong]=useState(false),[orbit,setOrbit]=useState('earth');
 const voice=useLessonVoice(done?plan.success:wrong?plan.hint:plan.task,paused);
 const clock=useRef(0);
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 useEffect(()=>{
  if(!animating||paused||!voice.visible)return;
  if(!motion||reduced){setFrame(3);setObserved(true);setAnimating(false);return;}
  let last=performance.now();const timer=setInterval(()=>{const now=performance.now();clock.current+=now-last;last=now;setFrame(Math.min(3,clock.current/1400));if(clock.current>=4200){clearInterval(timer);setObserved(true);setAnimating(false);}},70);return()=>clearInterval(timer);
 },[animating,paused,voice.visible,motion,reduced]);
 function animate(){clock.current=0;setFrame(0);setObserved(false);setAnimating(true);}
 const allowed=plan.kind==='safety'?value===1:plan.kind==='moon'?value===2:plan.kind==='force'?value===6:plan.kind==='mass'?value===1:plan.kind==='cell'?visited.length===3:plan.kind==='orbits'?visited.length===2&&observed:observed;
 function answer(choice:string){if(paused||!allowed||done)return;const ok=choice===plan.answer;setWrong(!ok);if(ok){setDone(true);onReady();}}
 const figure={...plan.figure,focus:plan.kind==='cell'?(visited.at(-1)??0):Math.round(frame),variant:plan.kind==='orbits'?orbit:plan.figure.variant,values:plan.kind==='force'?[value,2,10,5]:plan.kind==='moon'?[value]:plan.kind==='safety'?[value]:plan.kind==='mass'?[10,value]:plan.figure.values};
 return <section className="science-coach" aria-label={`${plan.name} keşif görevi`} data-kind={plan.kind} data-ready={done}>
  <p className="science-task">{done?plan.success:plan.task}</p>
  <ScienceScene figure={figure} frame={frame} still={!motion||paused}/>
  <div className="science-touch-controls" aria-label="Keşif araçları">
   {plan.kind==='safety'&&<button disabled={paused||done} aria-pressed={value===1} onClick={()=>setValue(1)}>🥽 Gözlüğü tak</button>}
   {plan.kind==='sun'&&<button disabled={paused||animating||done} onClick={animate}>☀ Dönmeyi göster</button>}
   {plan.kind==='moon'&&<><button disabled={paused||done||value===0} onClick={()=>setValue(v=>(v+3)%4)}>← Önceki evre</button><button disabled={paused||done} onClick={()=>setValue(v=>(v+1)%4)}>Ay’ı ilerlet →</button><output>{['Yeni ay','İlk dördün','Dolunay','Son dördün'][value]}</output></>}
   {plan.kind==='orbits'&&['Dünya’yı dolandır','Ay’ı dolandır'].map((label,i)=><button key={label} disabled={paused||animating||done} aria-pressed={visited.includes(i)} onClick={()=>{setVisited(v=>[...new Set([...v,i])]);setOrbit(i?'moon':'earth');animate();}}>{label}</button>)}
   {plan.kind==='force'&&<><button disabled={paused||done||value===0} onClick={()=>setValue(v=>v-2)}>− Bir ağırlık çıkar</button><output>{value} N</output><button disabled={paused||done||value===10} onClick={()=>setValue(v=>v+2)}>+ Bir ağırlık ekle</button></>}
   {plan.kind==='mass'&&<button disabled={paused||done} aria-pressed={value===1} onClick={()=>setValue(1)}>Valizi Ay’a götür →</button>}
   {plan.kind==='friction'&&<button disabled={paused||animating||done} onClick={animate}>▶ İki arabayı birlikte bırak</button>}
   {plan.kind==='cell'&&['Hücre zarı','Sitoplazma','Çekirdek'].map((label,i)=><button key={label} disabled={paused||done} aria-pressed={visited.includes(i)} onClick={()=>setVisited(v=>[...v.filter(n=>n!==i),i])}>{visited.includes(i)?'✓ ':''}{label}</button>)}
   {plan.kind==='body'&&<button disabled={paused||animating||done} onClick={animate}>Kolu bük →</button>}
  </div>
  <div className="science-coach-choices" role="group" aria-label="Keşif sonucunu seç">{plan.choices.map(choice=><button key={choice} disabled={paused||!allowed||done} onClick={()=>answer(choice)}>{choice}</button>)}</div>
  <div className="science-coach-note"><span role="status">{done?'✦ Keşif tamamlandı':wrong?plan.hint:allowed?'Şimdi gözlemine uyan yanıtı seç.':animating?'Hareketi izle…':'Önce yukarıdaki keşif araçlarını kullan.'}</span><button disabled={paused||voice.silent} onClick={voice.repeat}>↻ Dinle</button></div>
 </section>;
}
