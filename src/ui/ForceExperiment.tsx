import {useState} from 'react';

export function ForceExperiment({frictionOnly=false}:{frictionOnly?:boolean}){
 const [push,setPush]=useState(4);
 const [surface,setSurface]=useState<'smooth'|'rough'>('smooth');
 const resistance=surface==='smooth'?2:6;
 const net=Math.max(0,push-resistance);
 const position=45+net*24;
 return <section className="lesson-reading" aria-label="Kuvvet ve sürtünme keşif deneyi">
  <h2>Kuvveti değiştir, hareketi gözlemle</h2>
  <p>Bir oyuncak arabaya uygulanan itme kuvvetini ve yüzeyi seç. Modeldeki değerler örnektir; gerçek ölçüm değildir.</p>
  <svg viewBox="0 0 350 160" role="img" aria-label={`İtme ${push} birim, direnç ${resistance} birim, oyuncak araba ${position} konumunda`} style={{width:'100%',maxWidth:520,display:'block',margin:'auto'}}>
   <rect width="350" height="160" rx="14" fill="#17172e"/>
   <path d="M 16 125 H 334" stroke={surface==='smooth'?'#9bc5d5':'#ad9b77'} strokeWidth="8" strokeDasharray={surface==='rough'?'8 4':undefined}/>
   <g transform={`translate(${position} 0)`}>
    <rect x="-23" y="95" width="46" height="23" rx="6" fill="#f0a56e"/>
    <circle cx="-13" cy="120" r="7" fill="#4e526c"/><circle cx="13" cy="120" r="7" fill="#4e526c"/>
   </g>
   <path d={`M 22 55 h ${push*17}`} stroke="#f5d76e" strokeWidth="5"/>
   <text x="20" y="40" fill="white" fontSize="12">İtme kuvveti →</text>
   <text x="20" y="149" fill="white" fontSize="11">{surface==='smooth'?'Düz yüzey':'Pürüzlü yüzey'}</text>
  </svg>
  <label>İtme kuvveti (model birimi): {push}<input type="range" min="0" max="10" value={push} onChange={e=>setPush(Number(e.target.value))} style={{width:'100%'}}/></label>
  <fieldset><legend>Yüzey</legend>
   <label><input type="radio" name="force-surface" checked={surface==='smooth'} onChange={()=>setSurface('smooth')}/> Düz</label>{' '}
   <label><input type="radio" name="force-surface" checked={surface==='rough'} onChange={()=>setSurface('rough')}/> Pürüzlü</label>
  </fieldset>
  <p role="status"><strong>Gözlem:</strong> {net===0?'Bu basitleştirilmiş modelde araba hareket etmiyor.':`Bu modelde net etki ${net} birim; araba daha ileri konuma geçiyor.`}</p>
  <p>{frictionOnly?'Yüzeyler değiştiğinde aynı itmenin sonucu nasıl değişiyor?':'Aynı yüzeyde itme arttıkça sonuç nasıl değişiyor?'}</p>
  <p>Bu etkinlik kuvvet ve sürtünme ilişkisini nitel olarak anlatır. Sürtünme her durumda sabit değildir; gerçek hareketi hesaplayan bir fizik simülasyonu değildir.</p>
  <button type="button" onClick={()=>{setPush(4);setSurface('smooth');}}>Deneyi sıfırla</button>
 </section>;
}
