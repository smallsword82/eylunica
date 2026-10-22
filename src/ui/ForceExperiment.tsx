import {useEffect,useRef,useState} from 'react';
import {advanceMotion,type MotionState} from '../grade5/force-physics';

const initial=():MotionState=>({x:0,v:0,t:0});
export function ForceExperiment({frictionOnly=false}:{frictionOnly?:boolean}){
 const [force,setForce]=useState(8);
 const [mass,setMass]=useState(2);
 const [surface,setSurface]=useState<'smooth'|'rough'>('smooth');
 const [running,setRunning]=useState(false);
 const [motion,setMotion]=useState<MotionState>(initial);
 const motionRef=useRef(motion);
 const paramsRef=useRef({mass,force,muStatic:0.15,muKinetic:0.1});
 const muStatic=surface==='smooth'?0.15:0.5;
 const muKinetic=surface==='smooth'?0.1:0.35;
 paramsRef.current={mass,force,muStatic,muKinetic};
 useEffect(()=>{
  if(!running)return;
  let frame=0,last=0,accumulator=0;
  const tick=(now:number)=>{
   if(!last)last=now;
   accumulator+=Math.min((now-last)/1000,0.05);last=now;
   while(accumulator>=0.01){
    motionRef.current=advanceMotion(motionRef.current,paramsRef.current,0.01);
    accumulator-=0.01;
   }
   setMotion({...motionRef.current});
   frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(frame);
 },[running]);
 const reset=()=>{setRunning(false);motionRef.current=initial();setMotion(initial());};
 const viewX=36+Math.min(motion.x,10)*27;
 return <section className="lesson-reading" aria-label="Kuvvet ve sürtünme fizik simülasyonu">
  <h2>Kuvvet ve sürtünme laboratuvarı</h2>
  <p>İtme kuvvetini (N), arabanın kütlesini (kg) ve yüzeyin sürtünmesini değiştir. Başlatınca araba Newton'un ikinci yasasına göre ivmelenir; kuvveti sıfırlarsan sürtünmeyle yavaşlar.</p>
  <svg viewBox="0 0 350 170" role="img" aria-label={`Araba ${motion.x.toFixed(2)} metre ilerledi, hızı ${motion.v.toFixed(2)} metre/saniye`} style={{width:'100%',maxWidth:550,display:'block',margin:'auto'}}>
   <rect width="350" height="170" rx="14" fill="#17172e"/>
   <path d="M 15 126 H 335" stroke={surface==='smooth'?'#9bc5d5':'#ad9b77'} strokeWidth="8" strokeDasharray={surface==='rough'?'8 4':undefined}/>
   <g transform={`translate(${viewX} 0)`}>
    <rect x="-19" y="95" width="38" height="23" rx="5" fill="#f0a56e"/>
    <circle cx="-12" cy="120" r="6" fill="#4e526c"/><circle cx="12" cy="120" r="6" fill="#4e526c"/>
   </g>
   <text x="18" y="28" fill="white" fontSize="13">Gösterim: 27 piksel = 1 m (ilk 10 m)</text>
   <text x="18" y="151" fill="white" fontSize="12">Araba 10 m sonrasında çizimin sağında kalır.</text>
  </svg>
  <label>Uygulanan kuvvet: {force} N<input type="range" min="0" max="30" step="1" value={force} onChange={e=>setForce(Number(e.target.value))} style={{width:'100%'}}/></label>
  <label>Kütle: {mass} kg<input type="range" min="1" max="10" step="1" value={mass} onChange={e=>setMass(Number(e.target.value))} style={{width:'100%'}}/></label>
  <fieldset><legend>Yüzey türü</legend><label><input type="radio" name="force-surface" checked={surface==='smooth'} onChange={()=>setSurface('smooth')}/> Düşük sürtünme</label>{' '}<label><input type="radio" name="force-surface" checked={surface==='rough'} onChange={()=>setSurface('rough')}/> Yüksek sürtünme</label></fieldset>
  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
   <button type="button" onClick={()=>setRunning(v=>!v)}>{running?'Duraklat':'Başlat'}</button>
   <button type="button" onClick={()=>setForce(0)}>İtmeyi bırak (0 N)</button>
   <button type="button" onClick={reset}>Sıfırla</button>
  </div>
  <p role="status">Süre: {motion.t.toFixed(2)} s · Konum: {motion.x.toFixed(2)} m · Hız: {motion.v.toFixed(2)} m/s</p>
  <p>Statik sürtünme katsayısı: {muStatic} · Kinetik sürtünme katsayısı: {muKinetic} · Yerçekimi: 9,81 m/s²</p>
  <p>{frictionOnly?'Aynı kuvvetle iki yüzeyin durma mesafesini karşılaştır.':'Aynı kuvveti farklı kütlelerde dene; hızlanma nasıl değişiyor?'}</p>
  <p>Model yatay zeminde tek boyutlu hareketi F=ma ve Coulomb sürtünmesiyle hesaplar. Hava direnci, tekerleklerin dönme ataleti ve çarpışmalar dahil değildir. Yüzey katsayıları örnek değerlerdir.</p>
 </section>;
}
