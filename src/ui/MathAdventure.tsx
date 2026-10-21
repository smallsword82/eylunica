import { useState } from 'react';
import { playAnswerEffect } from '../audio';
import './MathAdventure.css';
const places=['Binler','Yüzler','Onlar','Birler'];
const units=[1000,100,10,1];
const digits=[4,5,8,2];
export function MathAdventure({onBack,onTopics,paused,onTransition}:{onBack:()=>void;onTopics:()=>void;paused:boolean;onTransition:(action:()=>void,startsTask?:boolean)=>void}) {
 const [step,setStep]=useState(0);
 const [place,setPlace]=useState(1);
 const [moved,setMoved]=useState(false);
 const [answer,setAnswer]=useState<number|null>(null);
 const [motion,setMotion]=useState(true);
 const [visited,setVisited]=useState<number[]>([]);
 const correct=answer===800;
 function navigate(next:number){onTransition(()=>{setStep(next);setAnswer(null);},true);}
 function choose(value:number){if(paused)return;setAnswer(value);void playAnswerEffect(value===800);}
 return <main className={`subpage math-adventure ${!motion||paused?'adventure-still':''}`}>
 <button className="text-button" onClick={onBack}>← Ders kitaplığına dön</button>
 <div className="adventure-toolbar"><span>MATEMATİK · GÖRSELLİ ÖN DENEME</span><button aria-pressed={!motion} onClick={()=>setMotion(!motion)}>{motion?'Hareketleri durdur':'Hareketleri aç'}</button></div>
 <header className="adventure-hero"><div className="adventure-stars" aria-hidden="true">✦ · ✧ · ✦</div><div className="adventure-hero-copy"><span className="adventure-tag">SAYILAR KÜTÜPHANESİ</span><h1>Bir rakamın<br/><em>gizli gücü!</em></h1><p>Parlayan kulelerin sırrını çöz.<br/>Rakamın yeri, değerini nasıl değiştiriyor?</p><span className="adventure-tag">Basamak değeri · 3 küçük keşif</span></div></header>
 <nav className="adventure-path" aria-label="Keşif adımları">{['Kuleleri keşfet','Rakamı taşı','Sırrı çöz'].map((title,i)=><button key={title} disabled={paused} aria-current={step===i?'step':undefined} onClick={()=>navigate(i)}><span>{i+1}</span>{title}</button>)}</nav>
 {paused&&<p role="status">Mola zamanı. Keşfin burada seni bekliyor.</p>}
 <section className="adventure-chapter" aria-label={['Kuleleri keşfet','Rakamı taşı','Sırrı çöz'][step]}>
 <div className="adventure-guide"><span aria-hidden="true" className="guide-orb">✧</span><p>{step===0?'Her kule bir basamak! Bir kuleye dokun, içindeki rakamın değerini keşfet.':step===1?'5 rakamı yüzler kulesinden binler kulesine gidiyor. Sence değeri ne olacak?':'Şimdi sıra sende! Öğrendiğin sırrı kullanarak son kapıyı aç.'}</p></div>
 {step===0?<><h2>4 582 sayısının dört kulesi</h2><div className="adventure-towers">{digits.map((digit,i)=><button key={i} style={{'--tower-height':`${160-i*24}px`,'--tower-color':['#e9b964','#ac8bf0','#73bced','#7cdbc1'][i]} as React.CSSProperties} aria-pressed={place===i} disabled={paused} onClick={()=>{setPlace(i);setVisited(v=>v.includes(i)?v:[...v,i]);}}><span className="tower-name">{places[i]}</span><span className="tower-crystal"><strong>{digit}</strong><span className="tower-lines" aria-hidden="true"/></span><span className="tower-multiplier">× {units[i].toLocaleString('tr')}</span></button>)}</div><div className="adventure-equation" key={place} aria-live="polite"><span>{digits[place]} × {units[place].toLocaleString('tr')}</span><strong>= {(digits[place]*units[place]).toLocaleString('tr')}</strong><p>{digits[place]} rakamının {places[place].toLocaleLowerCase('tr')} basamağındaki değeri {(digits[place]*units[place]).toLocaleString('tr')}.</p></div><p className="adventure-small">{visited.length}/4 kuleyi keşfettin. Her basamağın birim değeri sola doğru 10 kat büyür.</p><button className="adventure-primary" disabled={paused} onClick={()=>navigate(1)}>Rakamı taşımayı dene →</button></>:
 step===1?<><h2>Aynı 5, daha büyük bir değer!</h2><div className={`adventure-transfer ${moved?'is-moved':''}`}><div><span>Yüzler</span><strong>{moved?'—':'5'}</strong><small>5 × 100 = 500</small></div><span className="transfer-arrow" aria-hidden="true">→</span><div><span>Binler</span><strong>{moved?'5':'?'}</strong><small>5 × 1 000 = 5 000</small></div><span className="travel-digit" aria-hidden="true">5</span></div><button className="adventure-primary" disabled={paused} onClick={()=>setMoved(!moved)}>{moved?'Bir kez daha keşfet':'5 rakamını binler kulesine taşı'}</button>{moved&&<div className="adventure-equation" role="status"><strong>500 → 5 000</strong><p>Rakam aynı kaldı; değeri 10 katına çıktı!</p></div>}<p className="adventure-small">Bu bir basamak değeri modeli: diğer rakamları sabit tutarak yeni bir sayı oluşturmuyoruz.</p><button className="adventure-secondary" disabled={paused} onClick={()=>navigate(2)}>Son göreve geç →</button></>:
 <><h2>8 rakamı yüzler kulesine yerleşirse…</h2><p className="adventure-prompt">Basamak değeri kaç olur?</p><div className="mission-crystal" aria-hidden="true">8<small>YÜZLER</small></div><div className="adventure-answers">{[80,800,8000].map(value=><button disabled={paused||correct} aria-pressed={answer===value} key={value} onClick={()=>choose(value)}>{value.toLocaleString('tr')}</button>)}</div>{answer!==null&&<div className={`adventure-feedback ${correct?'is-correct':''}`} role="status">{correct?<><span aria-hidden="true" className="success-stars">✦ ✧ ✦</span><strong>Kapı açıldı, sırrı keşfettin!</strong><p>8 × 100 = 800. Yüzler basamağındaki her birim 100 değerindedir.</p></>:<><strong>Bir ipucu daha…</strong><p>Yüzler kulesinde rakamı 100 ile çarp. 8 tane yüzlük kaç eder?</p></>}</div>}<button disabled={paused} className="adventure-secondary" onClick={()=>navigate(0)}>Kulelere yeniden bak</button></>}
 </section><footer className="adventure-footer"><p>Bu kısa deneme puanını değiştirmez. Sesler mevcut ses tercihine uyar.</p><button className="adventure-secondary" onClick={onTopics}>Matematik konuları ve yazılı testleri →</button></footer>
 </main>;
}
