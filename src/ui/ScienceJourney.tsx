import {useCallback,useEffect,useMemo,useRef,useState,type CSSProperties} from 'react';
import {topics as allTopics,type Topic} from '../grade5/catalog';
import {matchesTerm,termLabels,type StudyTerm} from '../grade5/terms';
import {sciencePlans,sciencePlanById,scienceLessonById,scienceInstructions,scienceTeachingFigure} from '../grade5/science-plans';
import {scienceQuestions,scienceQuestionById,type ScienceQuestion} from '../grade5/science-question-bank';
import {scienceJourneyKey,readScienceProgress,readScienceWithLegacy,newScienceSession,scienceWrittenQuestions,completeScienceReview,type ScienceProgress,type ScienceSession} from '../grade5/science-journey-progress';
import {scienceHintSpeech,scienceSolutionSpeech} from '../grade5/science-narration';
import {emptyTopic,graduated,type TopicProgress} from '../grade5/math-journey-progress';
import {examStorageKey,readExams,completeExam,type ExamDraft} from '../grade5/exams';
import {isCorrect} from '../grade5/engine';
import {startMathMusic,stopMathMusic,mathChime} from '../audio/math-sound';
import {getSoundMode,subscribeSoundMode} from '../audio';
import {stopManifestAudio,getManifestPlayback,startManifestShuffle} from '../audio/manifest';
import {LearningRoad} from './LearningRoad';
import {LessonSpeech} from './LessonSpeech';
import {ScienceCoach} from './ScienceCoach';
import {ScienceFilm} from './ScienceFilm';
import {ScienceQuestionFigure} from './ScienceQuestionFigure';
import './MathJourney.css';
import './ScienceJourney.css';
type Phase='map'|'explore'|'explain'|'example'|'practice'|'test'|'writtenSetup'|'written'|'result'|'solutions'|'graduate';
type Props={paused:boolean;onBack:()=>void;onLegacyTopic:(topic:Topic)=>void;onLegacyExam:(term:StudyTerm)=>void;onTransition:(action:()=>void,startsTask?:boolean)=>void;onRecord:(id:string,answer:string,hinted:boolean)=>void};
export function ScienceCover({index}:{index:number}){
 const tops=[0,395,788],heights=[395,393,466];
 return <span className="science-stop-cover" aria-hidden="true"><svg viewBox={`${index%3*418} ${tops[Math.floor(index/3)]} 418 ${heights[Math.floor(index/3)]}`} preserveAspectRatio="xMidYMid slice"><image href="/discovery/science-worlds.png" width="1254" height="1254"/></svg></span>;
}
export function ScienceJourney({paused,onBack,onLegacyTopic,onLegacyExam,onTransition,onRecord}:Props){
 const [phase,setPhase]=useState<Phase>('map'),[term,setTerm]=useState<StudyTerm>('first'),[page,setPage]=useState(0),[topic,setTopic]=useState<Topic>();
 const [progress,setProgress]=useState(()=>{try{return readScienceWithLegacy(localStorage.getItem(scienceJourneyKey),localStorage.getItem('eylunica-grade5-v1'));}catch{return readScienceProgress(null);}});
 const [step,setStep]=useState(0),[ready,setReady]=useState(false),[motion,setMotion]=useState(true),[fullText,setFullText]=useState(false);
 const [pool,setPool]=useState<ScienceQuestion[]>([]),[index,setIndex]=useState(0),[value,setValue]=useState(''),[responses,setResponses]=useState<Record<string,string>>({});
 const [hint,setHint]=useState(false),[submitted,setSubmitted]=useState(false),[session,setSession]=useState<ScienceSession>();
 const [purpose,setPurpose]=useState<'practice'|'test'|'written'>('practice'),[unit,setUnit]=useState(''),[count,setCount]=useState(20);
 const [draft,setDraft]=useState<ExamDraft|undefined>(()=>{try{return readExams(localStorage.getItem(examStorageKey)).drafts['course-2'];}catch{return undefined;}});
 const [error,setError]=useState(''),[exhausted,setExhausted]=useState(false);
 const submitting=useRef(false),transitioning=useRef(false),finished=useRef('');
 const notice=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(exhausted&&!notice.current?.open)notice.current?.showModal();},[exhausted]);
 const markReady=useCallback(()=>setReady(true),[]);
 useEffect(()=>{submitting.current=false;transitioning.current=false;setFullText(false);},[phase,step,index,topic?.id]);
 const topics=useMemo(()=>allTopics.filter(t=>t.courseId==='course-2'&&matchesTerm(t,term)),[term]);
 const prepared=topics.filter(t=>sciencePlanById.has(t.id));
 const plan=topic?sciencePlanById.get(topic.id):undefined,lesson=topic?scienceLessonById.get(topic.id):undefined;
 const paragraphs=lesson?.sections.flatMap(s=>s.body.map(body=>({title:s.title,body})))||[];
 const q=pool[index],taskPhase=['practice','test','written'].includes(phase);
 const currentProgress=topic?progress.topics[topic.id]||emptyTopic():emptyTopic();
 const availableWritten=scienceWrittenQuestions(prepared.filter(t=>!unit||t.unit===unit).map(t=>t.id),progress.used,100).length;
 const score=pool.length?Math.round(pool.filter(q=>isCorrect(q,responses[q.id]||'')).length/pool.length*100):0;
 useEffect(()=>{const resume=getManifestPlayback().shuffling;return()=>{if(resume&&getSoundMode()==='music'&&!document.hidden)void startManifestShuffle();};},[]);
 useEffect(()=>{
  document.body.classList.add('science-journey-open');stopManifestAudio();
  const sync=()=>{stopManifestAudio();if(!paused&&!document.hidden&&getSoundMode()==='music')void startMathMusic();else stopMathMusic();};
  const blur=()=>stopMathMusic();const unsub=subscribeSoundMode(sync);
  document.addEventListener('visibilitychange',sync);window.addEventListener('blur',blur);window.addEventListener('focus',sync);sync();
  return()=>{document.body.classList.remove('science-journey-open');document.removeEventListener('visibilitychange',sync);window.removeEventListener('blur',blur);window.removeEventListener('focus',sync);unsub();stopMathMusic();};
 },[paused]);
 function save(next:ScienceProgress){setProgress(next);try{localStorage.setItem(scienceJourneyKey,JSON.stringify(next));}catch{setError('İlerleme bu oturumda korunuyor; cihaz kaydı yapılamadı.');}}
 function flags(source:ScienceProgress,patch:Partial<TopicProgress>):ScienceProgress{
  if(!topic)return source;const old=source.topics[topic.id]||emptyTopic();return {...source,topics:{...source.topics,[topic.id]:{...old,...patch,bestScore:Math.max(old.bestScore,patch.bestScore||0)}}};
 }
 function reset(){setIndex(0);setStep(0);setValue('');setHint(false);setSubmitted(false);setReady(false);setExhausted(false);setResponses({});}
 function open(t:Topic){if(!sciencePlanById.has(t.id)){onLegacyTopic(t);return;}onTransition(()=>{reset();setTopic(t);setPhase('explore');},true);}
 function go(next:Phase){if(paused)return;onTransition(()=>{reset();setPhase(next);},next!=='map');}
 function begin(next:'practice'|'test',source=progress){
  if(!topic||paused)return;
  const key=`${next}:${topic.id}`,active=source.sessions[key]||newScienceSession(topic.id,next,source.used);
  if(!active){setExhausted(true);return;}
  const rows=active.questionIds.map(id=>scienceQuestionById.get(id)!);
  onTransition(()=>{
   reset();setPurpose(next);setPool(rows);setSession(active);setResponses(active.answers);setIndex(active.index);setPhase(next);
   const answered=Object.hasOwn(active.answers,rows[active.index].id);
   if(next==='practice'&&answered){setValue(active.answers[rows[active.index].id]);setSubmitted(true);setReady(true);}
   save({...source,sessions:{...source.sessions,[key]:active}});
   if(active.questionIds.every(id=>Object.hasOwn(active.answers,id)))finish(next,active.answers,source,undefined,rows);
  },true);
 }
 function storeDraft(next:ExamDraft){setDraft(next);try{const stored=readExams(localStorage.getItem(examStorageKey));localStorage.setItem(examStorageKey,JSON.stringify({...stored,drafts:{...stored.drafts,'course-2':next}}));}catch{setError('Yazılı kaydı yapılamadı; bu ekran açıkken yanıtların korunuyor.');}}
 function startWritten(){
  const selected=prepared.filter(t=>!unit||t.unit===unit),rows=scienceWrittenQuestions(selected.map(t=>t.id),progress.used,count);
  if(rows.length<count){setExhausted(true);return;}
  onTransition(()=>{
   reset();setPool(rows);setPurpose('written');setPhase('written');finished.current='';
   const now=Date.now();storeDraft({id:`science-written-${now}`,courseId:'course-2',term,units:[...new Set(selected.map(t=>t.unit))],questionIds:rows.map(q=>q.id),answers:{},startedAt:now});
  },true);
 }
 function finish(nextPurpose:'practice'|'test'|'written',answers:Record<string,string>,source:ScienceProgress,activeDraft=draft,rows=pool){
  const finalScore=rows.length?Math.round(rows.filter(q=>isCorrect(q,answers[q.id]||'')).length/rows.length*100):0;
  let next=source;
  if(nextPurpose==='practice'||nextPurpose==='test'){
   const sessions={...source.sessions};
   next=flags({...source,sessions},nextPurpose==='practice'?{practice:true}:{test:currentProgress.test||finalScore>=70,bestScore:finalScore});
  }else if(activeDraft&&finished.current!==activeDraft.id){
   finished.current=activeDraft.id;
   try{const saved=readExams(localStorage.getItem(examStorageKey));localStorage.setItem(examStorageKey,JSON.stringify(completeExam(saved,{...activeDraft,answers})));setDraft(undefined);}catch{setError('Sonuç bu ekranda korunuyor; yazılı geçmişi cihazda saklanamadı.');}
  }
  save(next);setResponses(answers);setPurpose(nextPurpose);setPhase('result');setReady(false);setExhausted(false);void mathChime(true);
 }
 function resumeWritten(){
  if(!draft)return;
  const rows=draft.questionIds.map(id=>scienceQuestionById.get(id));
  if(rows.some(q=>!q)){onLegacyExam(draft.term||'first');return;}
  const first=rows.findIndex(q=>!Object.hasOwn(draft.answers,q!.id));
  onTransition(()=>{reset();setPurpose('written');setPool(rows as ScienceQuestion[]);setResponses(draft.answers);setIndex(first<0?rows.length-1:first);setPhase('written');if(first<0)finish('written',draft.answers,progress,draft,rows as ScienceQuestion[]);},true);
 }
 function submit(blank=false){
  if(paused||!q||submitted||submitting.current||!value&&!blank)return;
  submitting.current=true;const answer=blank?'':value,answers={...responses,[q.id]:answer};
  const used=[...new Set([...progress.used,q.id])];let next={...progress,used};
  setResponses(answers);onRecord(q.id,answer,hint);
  let activeDraft=draft;
  if(phase==='written'&&draft){activeDraft={...draft,answers};storeDraft(activeDraft);}
  if(session&&(phase==='practice'||phase==='test')){
   const active={...session,answers,hinted:hint?[...new Set([...session.hinted,q.id])]:session.hinted,index:phase==='test'&&index+1<pool.length?index+1:index};
   setSession(active);next={...next,sessions:{...next.sessions,[`${purpose}:${active.topicId}`]:active}};
  }
  save(next);
  if(phase==='practice'){setSubmitted(true);setReady(true);void mathChime(isCorrect(q,answer));return;}
  onTransition(()=>{setValue('');setHint(false);setSubmitted(false);if(index+1<pool.length)setIndex(i=>i+1);else finish(purpose,answers,next,activeDraft);},true);
 }
 function next(){
  if(paused||!ready||transitioning.current)return;transitioning.current=true;
  onTransition(()=>{
   setReady(false);setFullText(false);
   if(phase==='explore'){setStep(0);setPhase('explain');}
   else if(phase==='explain'){if(step+1<paragraphs.length)setStep(s=>s+1);else{setStep(0);setPhase('example');}}
   else if(phase==='example'){
    if(step+1<(lesson?.workedExample.steps.length||0))setStep(s=>s+1);
    else{const updated=flags(progress,{lesson:true});save(updated);begin('practice',updated);}
   }else if(phase==='practice'){
    if(index+1<pool.length){const active={...session!,index:index+1};setSession(active);save({...progress,sessions:{...progress.sessions,[`practice:${active.topicId}`]:active}});setIndex(i=>i+1);setValue('');setHint(false);setSubmitted(false);}
    else finish('practice',responses,progress);
   }else if(phase==='solutions'){if(index+1<pool.length)setIndex(i=>i+1);else{if(purpose==='test'&&topic)save(completeScienceReview(progress,topic.id));setPhase('result');}setReady(true);}
  },true);
 }
 const portal=ready&&['explore','explain','example','practice','solutions'].includes(phase);
 const portalTitle=phase==='explore'?'Anlatıma devam et':phase==='explain'?(step+1<paragraphs.length?'Sonraki anlatım adımı':'Örneği birlikte çözelim'):phase==='example'?(step+1<(lesson?.workedExample.steps.length||0)?'Sonraki çözüm adımı':'Alıştırmalara başla'):phase==='solutions'?(index+1<pool.length?'Sonraki çözüm':'Sonuca dön'):(index+1<pool.length?'Sonraki soruya geç':'Sonucumu gör');
 return <main className={`science-journey science-phase-${phase} ${!motion||paused?'science-still':''}`} aria-label="Fen Bilimleri keşif yolculuğu" onPointerDown={()=>{if(!paused&&getSoundMode()==='music')void startMathMusic();}}>
  <header className="science-top"><button onClick={()=>phase==='map'?onBack():go('map')}>← {phase==='map'?'Dersler':'Harita'}</button><div><span>FEN BİLİMLERİ · KEŞİF YOLU</span><strong>{phase==='map'?'Merak et, gözlemle, keşfet.':phase==='written'||phase==='writtenSetup'?'Fen yazılısı':topic?.title||'Fen yazılısı'}</strong></div>{topic&&<button disabled={paused||phase==='test'||phase==='written'} aria-label="Konu kaynakları ve ayrıntılar" title="Konu kaynakları ve ayrıntılar" onClick={()=>onLegacyTopic(topic)}>ℹ</button>}<button aria-pressed={!motion} onClick={()=>setMotion(v=>!v)}>{motion?'Hareketi durdur':'Hareketi aç'}</button></header>
  {phase==='map'?<section className="science-map" aria-label="Fen Bilimleri oyun haritası">
   <div className="science-map-intro"><h1>Her durakta yeni bir keşif.</h1><label>Çalışma dönemi<select value={term} onChange={e=>{setTerm(e.target.value as StudyTerm);setPage(0);}}>{Object.entries(termLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><p>{prepared.filter(t=>progress.topics[t.id]?.lesson&&progress.topics[t.id]?.practice&&progress.topics[t.id]?.test).length}/{prepared.length} görselli durak tamamlandı · İlk dönem: 9 konu</p></div>
   <LearningRoad offset={page*4} stops={topics.slice(page*4,page*4+4).map(t=>({id:t.id,title:t.title,detail:sciencePlanById.has(t.id)?'Sesli keşif · 8 alıştırma · 20 test sorusu':t.unit,complete:!!(progress.topics[t.id]?.lesson&&progress.topics[t.id]?.practice&&progress.topics[t.id]?.test),art:sciencePlanById.has(t.id)?<ScienceCover index={sciencePlans.findIndex(p=>p.id===t.id)}/>:undefined}))} onOpen={id=>open(topics.find(t=>t.id===id)!)}/>
   <nav className="science-map-paging" aria-label="Harita sayfaları"><button disabled={!page} onClick={()=>setPage(p=>p-1)}>← Önceki duraklar</button><span>{page+1}/{Math.max(1,Math.ceil(topics.length/4))}</span><button disabled={(page+1)*4>=topics.length} onClick={()=>setPage(p=>p+1)}>Sonraki duraklar →</button></nav>
   <div className="science-map-bottom"><button onClick={()=>go('writtenSetup')}>Yazılı testleri</button><button disabled={prepared.length!==topics.length||!graduated(topics.map(t=>t.id),progress)} onClick={()=>go('graduate')}>✦ Keşif belgem</button><a href={topics[0]?.source.url} target="_blank" rel="noreferrer">Program kaynağı ↗</a></div>
  </section>:<>
   {!['writtenSetup','result','graduate'].includes(phase)&&<nav className="science-tabs" aria-label="Konu aşamaları"><button disabled={paused||!topic||phase==='written'} aria-pressed={['explore','explain','example'].includes(phase)} onClick={()=>go('explore')}>Keşfet</button><button disabled={paused||!topic||phase==='written'} aria-pressed={phase==='practice'} onClick={()=>begin('practice')}>Alıştırma · 8</button><button disabled={paused||!topic||phase==='written'} aria-pressed={phase==='test'} onClick={()=>begin('test')}>Konu testi · 20</button></nav>}
   <section className={`science-stage ${submitted?'science-feedback-stage':''}`} aria-label="Fen çalışma sahnesi" data-topic-id={topic?.id} data-question-id={taskPhase?q?.id:undefined}>
    {phase==='explore'&&plan&&<ScienceCoach key={plan.id} plan={plan} paused={paused} motion={motion} onReady={markReady}/>}
    {(phase==='explain'||phase==='example')&&plan&&lesson&&<><span className="science-step-label">{phase==='explain'?`ANLATIM · ${step+1}/${paragraphs.length}`:`BİRLİKTE ÇÖZELİM · ${step+1}/${lesson.workedExample.steps.length}`}</span><h2>{phase==='explain'?paragraphs[step].title:lesson.workedExample.prompt}</h2><ScienceFilm key={`${plan.id}-${phase}-${step}`} figure={scienceTeachingFigure(plan,phase,step)} text={phase==='explain'?paragraphs[step].body:lesson.workedExample.steps[step]} caption={fullText?(phase==='explain'?paragraphs[step].body:lesson.workedExample.steps[step]):phase==='explain'?plan.captions[step%4]:lesson.workedExample.steps[step]} paused={paused} motion={motion} onReady={markReady}/><button className="science-full-text" aria-pressed={fullText} onClick={()=>setFullText(v=>!v)}>{fullText?'Kısa açıklamaya dön':'Tam açıklamayı göster'}</button></>}
    {taskPhase&&q&&<>
     {phase==='practice'?<LessonSpeech key={`${q.id}-${hint}-${submitted}`} text={submitted?scienceSolutionSpeech(q):hint?scienceHintSpeech(q):q.prompt} intro={index===0&&!hint&&!submitted?scienceInstructions.practice:''} paused={paused}/>:<LessonSpeech key={phase} text={phase==='test'?scienceInstructions.test:scienceInstructions.writtenStart} paused={paused}/>}
     <span className="science-question-count">{phase==='practice'?'ALIŞTIRMA':phase==='test'?'KONU TESTİ':'YAZILI'} · {index+1}/{pool.length}</span>
     <h2>{q.prompt}</h2>
     <div className="science-question-figure"><ScienceQuestionFigure key={`${q.id}-${submitted}`} figure={q.figure} paused={paused} motion={motion&&phase==='practice'} solution={submitted}/></div>
     {submitted?<div className="science-answer-feedback" role="status"><strong>{isCorrect(q,value)?'✦ Keşfettin!':'Birlikte öğrenelim.'}</strong><p>{q.explanation}</p><span>Doğru yanıt: {q.answer}</span></div>:<>
      <div className="science-choices" role="group" aria-label="Yanıt seçenekleri">{q.choices?.map(choice=><button key={choice} disabled={paused} aria-pressed={value===choice} onClick={()=>setValue(choice)}>{choice}</button>)}</div>
      {hint&&<p className="science-hint">{q.hints.join(' ')}</p>}
      <div className="science-answer-actions">{phase==='practice'&&<button disabled={paused} onClick={()=>setHint(true)}>İpucu</button>}<button disabled={paused||!value} onClick={()=>submit()}>{phase==='practice'?'Yanıtımı kontrol et':'Yanıtımı kaydet'}</button>{phase==='written'&&<button disabled={paused} onClick={()=>submit(true)}>Boş bırak</button>}</div>
     </>}
    </>}
    {phase==='writtenSetup'&&<div className="science-written-setup"><LessonSpeech text={scienceInstructions.written} paused={paused}/><h1>Fen yazılısı</h1><p>Alıştırma ve konu testlerinden ayrı sorular. İlk dönem konuları için özgün Eylunica hazırlık yazılısı.</p><label>Ünite / tema<select value={unit} onChange={e=>setUnit(e.target.value)}><option value="">Bu dönemin hazır konuları</option>{[...new Set(prepared.map(t=>t.unit))].map(u=><option key={u} value={u}>{u}</option>)}</select></label><label>Soru sayısı<select value={count} onChange={e=>setCount(Number(e.target.value))}>{[10,20].map(n=><option key={n} value={n}>{n} soru</option>)}</select></label><p>{availableWritten} yeni yazılı sorusu var. Yanlışlar ayrıca puan düşürmez.</p>{draft&&<button className="science-primary" onClick={resumeWritten}>Yarım kalan yazılıya devam et</button>}<button className="science-primary" disabled={paused||availableWritten<count||!!draft} onClick={startWritten}>Yazılıyı başlat</button>{draft&&<small>Kaydını korumak için önce yarım kalan yazılını tamamla.</small>}</div>}
    {phase==='result'&&<div className="science-result"><LessonSpeech text={purpose==='test'&&score<70&&!currentProgress.test?scienceInstructions.review:scienceInstructions.result} paused={paused}/><span className="science-celebrate">✦ ✧ ✦</span><h1>{purpose==='written'?'Yazılı notun':purpose==='test'?'Konu testi tamamlandı':'Alıştırmalar tamamlandı'}</h1><strong>{score}/100</strong><p>{pool.filter(q=>isCorrect(q,responses[q.id]||'')).length} doğru · {pool.filter(q=>!!responses[q.id]&&!isCorrect(q,responses[q.id])).length} yanlış · {pool.filter(q=>!responses[q.id]).length} boş</p>{purpose==='test'&&score<70&&!currentProgress.test&&<p>Görselli çözümleri sırayla inceleyince durağın tamamlanacak. Aldığın not değişmeyecek.</p>}<button className="science-primary" onClick={()=>{setIndex(0);setPhase('solutions');setReady(true);}}>Görselli çözümleri incele</button>{purpose==='practice'&&<button className="science-primary" onClick={()=>begin('test')}>20 soruluk konu testine başla</button>}<button onClick={()=>go('map')}>Haritaya dön</button></div>}
    {phase==='solutions'&&q&&<><LessonSpeech key={q.id} text={scienceSolutionSpeech(q)} paused={paused}/><span className="science-step-label">ÇÖZÜM · {index+1}/{pool.length}</span><h2>{q.prompt}</h2><div className="science-question-figure"><ScienceQuestionFigure key={q.id} figure={q.figure} paused={paused} motion={motion} solution/></div><p className="science-solution-answer">Senin yanıtın: {responses[q.id]||'Boş'} · Doğru yanıt: {q.answer}</p><p className="science-solution-text">{q.explanation}</p></>}
    {phase==='graduate'&&<div className="science-graduation"><span className="science-celebrate">✦ ✧ ✦</span><h1>Fen keşif yolculuğunu tamamladın!</h1><p>{termLabels[term]} kapsamındaki hazır durakların anlatımını, alıştırmalarını ve konu testlerini tamamladın.</p><strong>EYLUNICA · FEN KEŞİF BELGESİ</strong><p>Bu bir uygulama başarı belgesidir.</p><button className="science-primary" onClick={()=>go('map')}>Yeni keşiflere dön →</button></div>}
   </section>
   <div className="science-action-slot" aria-live="polite">{portal&&<button className="science-portal" disabled={paused} onClick={next}><span aria-hidden="true">✦</span><strong>{portalTitle}</strong><span aria-hidden="true">→</span></button>}</div>
  </>}
  {exhausted&&<dialog ref={notice} className="science-notice" aria-label="Yeni soru kalmadı" onCancel={()=>setExhausted(false)}><h2>Bu bölümdeki yeni soruları tamamladın.</h2><p>Önceden yanıtladığın soruları otomatik olarak tekrar sormuyoruz. Başka bir konuyu seçebilirsin.</p><button onClick={()=>setExhausted(false)}>Çalışmaya dön</button><button onClick={()=>go('map')}>Haritaya dön</button></dialog>}
  {error&&<p className="science-error" role="alert">{error}</p>}
 </main>;
}
