import {useEffect,useState} from 'react';
import {mathCoachPlans,coachTaskComplete,type CoachTask} from '../grade5/math-coach';
import {mathFilms} from '../grade5/math-films';
import {useLessonVoice} from '../audio/useLessonVoice';
import {mathChime} from '../audio/math-sound';
import {MathFilm} from './MathFilm';
import {MathDiagramCanvas} from './MathDiagramCanvas';
import './AngleCoach.css';
import './MathCoach.css';
function Task({task,paused,motion,onPassed}:{task:CoachTask;paused:boolean;motion:boolean;onPassed:(value:boolean)=>void}){
 const [value,setValue]=useState(task.initial),[passed,setPassed]=useState(false),[reminded,setReminded]=useState(false),[interactions,setInteractions]=useState(0);
 const voice=useLessonVoice(passed?task.success:reminded?task.hint:task.prompt,paused),active=!paused&&voice.visible;
 useEffect(()=>{onPassed(passed);},[passed]);
 useEffect(()=>{if(!active||passed||reminded)return;const timer=setTimeout(()=>setReminded(true),8500);return()=>clearTimeout(timer);},[active,passed,reminded,interactions]);
 function change(delta:number){if(!active||passed)return;const next=Math.max(task.min,Math.min(task.max,value+delta));if(next===value)return;setValue(next);setInteractions(n=>n+1);if(coachTaskComplete(task,next,true)){setPassed(true);void mathChime(true);}}
 return <div className={`math-coach-task ${!motion?'film-still':''}`} data-task-complete={passed} data-model-value={value}>
  <h2>{passed?'✦ Görev tamamlandı':task.prompt}</h2>
  <MathDiagramCanvas diagram={task.diagram(value)} frame={3} reveal teaching className="coach-task-canvas"/>
  <output aria-live="polite">{task.readout(value)}</output>
  <p className="coach-caption" aria-live="polite">{passed?task.success:reminded?task.hint:'Düğmelere dokun; modelde neyin değiştiğini izle.'}</p>
  <div className="coach-task-controls">{task.buttons.map((label,i)=><button key={label} disabled={!active||passed||(i===0?value<=task.min:value>=task.max)} onClick={()=>change(i===0?-1:1)}>{i===0?'−':'+'} {label}</button>)}<button disabled={!active||voice.silent} onClick={voice.repeat}>↻ Tekrar dinle</button></div>
 </div>;
}
export function MathCoach({topicId,paused,motion,onReady}:{topicId:string;paused:boolean;motion:boolean;onReady:(value:boolean)=>void}){
 const [stage,setStage]=useState<'watch'|'together'|'try'>('watch'),[watchDone,setWatchDone]=useState(false),[passed,setPassed]=useState(false),[cycle,setCycle]=useState(0);
 const plan=mathCoachPlans[topicId],step=stage==='watch'?0:stage==='together'?1:2;
 useEffect(()=>{onReady(stage==='try'&&passed);},[stage,passed]);
 return <section className={`math-coach ${paused?'coach-paused':''}`} aria-label="Konunun sesli keşif rehberi" data-coach-stage={stage} data-topic-coach={topicId}>
  <ol className="coach-steps" aria-label="Öğrenme aşamaları">{['İzle','Birlikte yap','Sen dene'].map((label,i)=><li key={label} aria-current={step===i?'step':undefined} className={i<step?'coach-step-done':''}><b>{i<step?'✓':i+1}</b>{label}</li>)}</ol>
  {stage==='watch'?<MathFilm key={cycle} scene={mathFilms[topicId].explain[0]} paused={paused} motion={motion} spoken onComplete={()=>setWatchDone(true)}/>:<Task key={stage} task={plan[stage]} paused={paused} motion={motion} onPassed={setPassed}/>}
  <div className="coach-action">{stage==='watch'?watchDone?<button className="coach-next" disabled={paused} onClick={()=>{setPassed(false);setStage('together');}}>✦ Birlikte yapalım →</button>:<span>Önce sesli gösterimi izle. Sonra birlikte deneyeceğiz.</span>:stage==='together'?passed?<button className="coach-next" disabled={paused} onClick={()=>{setPassed(false);setStage('try');}}>✦ Şimdi sen dene →</button>:<span>Yönergedeki hedefi model üzerinde oluştur.</span>:passed?<button disabled={paused} onClick={()=>{setStage('watch');setWatchDone(false);setPassed(false);setCycle(n=>n+1);}}>Gösterimi tekrar izle</button>:<span>Bu kez hedefi sen oluştur. Devam kapısı sonra açılacak.</span>}</div>
 </section>;
}
