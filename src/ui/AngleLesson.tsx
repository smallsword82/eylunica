import { useState } from 'react';
import { playAnswerEffect } from '../audio';
import './AngleLesson.css';
const point=(angle:number,radius:number)=>({x:240+radius*Math.cos(angle*Math.PI/180),y:245-radius*Math.sin(angle*Math.PI/180)});
const missions=[{angle:90,title:'Kapıyı tam dik açıyla aç.',hint:'Dik açı 90° olur.'},{angle:45,title:'Şimdi 45° büyüklüğünde dar açı oluştur.',hint:'45°, 0 ile 90 arasında; dik açının yarısıdır.'},{angle:120,title:'Son olarak 120° büyüklüğünde geniş açı oluştur.',hint:'120°, 90 ile 180 arasındadır.'}];
export function AngleLesson({paused,onPractice,onTransition,scene='all'}:{paused:boolean;onPractice:()=>void;onTransition:(action:()=>void,startsTask?:boolean)=>void;scene?:'all'|'explore'}){
 const [angle,setAngle]=useState(60),[long,setLong]=useState(false),[motion,setMotion]=useState(true);
 const [mission,setMission]=useState(0),[feedback,setFeedback]=useState<boolean|null>(null);
 const end=point(angle,65);const category=angle===0?'Sıfır açı':angle===90?'Dik açı':angle===180?'Doğru açı':angle<90?'Dar açı':'Geniş açı';
 function update(value:number){if(paused)return;setAngle(value);setFeedback(null);}
 function check(){if(paused)return;const ok=angle===missions[mission].angle;setFeedback(ok);void playAnswerEffect(ok);}
 return <section className={`angle-lesson ${!motion||paused?'angle-still':''}`} aria-label="Görselli açı anlatımı">
 {scene==='all'&&<><header className="angle-intro"><span>GEOMETRİ ATÖLYESİ · AÇI ÖLÇME</span><h2>Bir ışını hareket ettir.<br/><em>Açının sırrını keşfet!</em></h2><p>İki ışın aynı noktadan başlıyor. Aralarındaki açıklığın ölçüsüne bak.</p></header>
 <div className="angle-controls-top"><span>Dokun · Değiştir · Gözlemle</span><button aria-pressed={!motion} onClick={()=>setMotion(!motion)}>{motion?'Hareketleri durdur':'Hareketleri aç'}</button></div></>}
 <section className="angle-workshop" aria-label="Hareketli iletki"><div className="angle-guide"><span aria-hidden="true">✦</span><p>İletkinin merkezini ortak başlangıç noktasına, 0° çizgisini sabit ışına yerleştir. Sağdaki 0’dan başlayarak iç ölçeği oku.</p></div>
 <svg viewBox="0 0 480 300" role="img" aria-label={`İletki üzerinde ${angle} derecelik ${category.toLocaleLowerCase('tr')}; başlangıç ışını sağa bakıyor.`}>
 <defs><radialGradient id="angle-dome"><stop stopColor="#b18be8" stopOpacity=".25"/><stop offset="1" stopColor="#8eb4fa" stopOpacity=".1"/></radialGradient><marker id="angle-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs>
 <path d="M40 245 A200 200 0 0 1 440 245 Z" fill="url(#angle-dome)" stroke="#b89fe2" strokeWidth="2"/>
 {Array.from({length:37},(_,i)=>{const a=i*5,p=point(a,200),q=point(a,i%2===0?184:191),label=point(a,165);return <g key={a}><line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#dbccf4" strokeWidth={i%6===0?2:1}/>{i%6===0&&<text x={label.x} y={label.y+5} fill="#f2e9ff" textAnchor="middle" fontSize="13">{a}°</text>}</g>;})}
 {angle>0&&<path d={`M240 245 L305 245 A65 65 0 ${angle>180?1:0} 0 ${end.x} ${end.y} Z`} fill="#f8ca7455" stroke="#ffd98d" strokeWidth="2"/>}
 <line x1="240" y1="245" x2="449" y2="245" stroke="#88dfeb" strokeWidth="5" markerEnd="url(#angle-arrow)"/>
 <g className="angle-moving-ray" style={{transform:`rotate(${-angle}deg)`,transformOrigin:'240px 245px'}}><line x1="240" y1="245" x2={long?462:388} y2="245" stroke="#ffd17a" strokeWidth="5" markerEnd="url(#angle-arrow)"/><circle cx={long?450:377} cy="245" r="7" fill="#ffe6ac"/></g>
 <circle cx="240" cy="245" r="7" fill="#fff3c9"/><text x="240" y="278" textAnchor="middle" fill="#eadcf8" fontSize="12">Ortak başlangıç noktası</text>
 </svg>
 <div className="angle-result" aria-live="polite"><strong>{angle}°</strong><span>{category}</span></div>
 <label className="angle-slider-label">Işını hareket ettir <input type="range" min="0" max="180" step="5" value={angle} disabled={paused} onChange={e=>update(Number(e.target.value))}/></label>
 <div className="angle-presets">{[0,45,90,120,180].map(value=><button key={value} disabled={paused} aria-pressed={angle===value} onClick={()=>update(value)}>{value}°</button>)}</div>
 <div className="angle-rule"><strong>{angle===0?'Işınlar aynı yönde.':angle===180?'Işınlar zıt yönlerde.':angle===90?'Bir dik köşe oluştu!':angle<90?'Dik açıdan daha küçük.':'Dik açıdan büyük, doğru açıdan küçük.'}</strong><p>Dar açı: 0° &lt; açı &lt; 90° · Dik açı: 90° · Geniş açı: 90° &lt; açı &lt; 180° · Doğru açı: 180°</p></div>
 <button className="angle-secondary" disabled={paused} onClick={()=>setLong(!long)}>{long?'Işını kısalt':'Işını uzat'}</button><p className="angle-small">Işınlar sonsuza uzanır; çizimde yalnız bir kısmını gösteririz. Çizgiyi uzatmak açıyı değiştirmez: açıklık hâlâ {angle}°.</p>
 </section>
 {scene==='all'&&<section className="angle-mission" aria-label="Açı görevi"><span>KÜÇÜK GÖREV · {mission+1}/3</span><h3>{missions[mission].title}</h3><p>Yukarıdaki ışını değiştir, sonra kontrol et.</p><button className="angle-primary" disabled={paused||feedback===true} onClick={check}>Açımı kontrol et</button>
 {feedback!==null&&<div role="status" className={`angle-feedback ${feedback?'angle-success':''}`}><strong>{feedback?'Keşfettin! ✦':'Biraz daha deneyelim.'}</strong><p>{feedback?`${angle}° ile görevi tamamladın. ${missions[mission].hint}`:`Şu an ${angle}° gösteriyorsun. ${missions[mission].hint}`}</p></div>}
 {feedback&&mission<2&&<button className="angle-secondary" disabled={paused} onClick={()=>onTransition(()=>{setMission(mission+1);setFeedback(null);},true)}>Sonraki keşif →</button>}
 {feedback&&mission===2&&<p className="angle-finish">Üç açıyı da oluşturdun. Şimdi konu alıştırmalarıyla pekiştirebilirsin.</p>}
 <button className="angle-secondary" disabled={paused} onClick={onPractice}>Konu alıştırmalarına geç →</button><p className="angle-small">Keşif denemeleri puanını değiştirmez. Alıştırma yanıtların mevcut çalışma geçmişine kaydedilir.</p>
 </section>}</section>;
}
