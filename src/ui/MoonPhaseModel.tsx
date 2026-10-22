import {useState} from 'react';

/** Sunlight is represented as arriving from the right. Diagram is not to scale. */
export function MoonPhaseModel(){
 const [day,setDay]=useState(0);
 const phases=['Yeni ay','Büyüyen hilal','İlk dördün','Büyüyen şişkin ay','Dolunay','Küçülen şişkin ay','Son dördün','Küçülen hilal'];
 const index=Math.floor(day/3.6875)%8;
 const phase=phases[index];
 const phaseAngle=2*Math.PI*day/29.5;
 const x=140+Math.cos(phaseAngle)*88,y=115-Math.sin(phaseAngle)*78;
 // The eight phase icons are pedagogical approximations, not a lunar ephemeris.
 const litFraction=(1-Math.cos(phaseAngle))/2;
 const waxing=day<14.75;
 const left= waxing ? false : true;
 const r=38;
 const terminatorX=r*Math.abs(2*litFraction-1);
 const litPath=litFraction<0.5
 ? `M 0 ${-r} A ${terminatorX} ${r} 0 0 ${waxing?1:0} 0 ${r} A ${r} ${r} 0 0 ${waxing?1:0} 0 ${-r} Z`
 : `M 0 ${-r} A ${terminatorX} ${r} 0 0 ${waxing?0:1} 0 ${r} A ${r} ${r} 0 0 ${waxing?1:0} 0 ${-r} Z`;
 return <section className="lesson-reading" aria-label="Ay evreleri keşif modeli">
  <h2>Ay'ın evrelerini keşfet</h2>
  <p>Ay'ın Dünya çevresindeki konumunu değiştir. Güneş ışığı sağdan gelir. Evreler, Ay'ın aydınlık yarısının Dünya'dan görülen bölümünün değişmesidir; Dünya'nın gölgesi değildir.</p>
  <svg viewBox="0 0 320 230" role="img" aria-label={`Ay'ın yaklaşık ${phase} evresi; örnek döngünün ${day}. günü`} style={{display:'block',width:'100%',maxWidth:440,margin:'auto'}}>
   <rect width="320" height="230" rx="16" fill="#16142e"/>
   <ellipse cx="140" cy="115" rx="88" ry="78" fill="none" stroke="#9992bb" strokeDasharray="4 4"/>
   <circle cx="140" cy="115" r="20" fill="#5aa9df"/>
   <text x="140" y="148" textAnchor="middle" fill="white" fontSize="12">Dünya</text>
   <circle cx={x} cy={y} r="9" fill="#d9dbe4"/>
   <path d="M 274 64 L 244 64 M 274 115 L 244 115 M 274 166 L 244 166" stroke="#ffce69" strokeWidth="3"/>
   <text x="270" y="43" fill="#ffce69" fontSize="12" textAnchor="middle">Güneş ışığı</text>
  </svg>
  <div style={{textAlign:'center'}}>
   <svg viewBox="-44 -44 88 88" role="img" aria-label={`Dünya'dan görülen yaklaşık ${phase} görünümü`} style={{width:100,height:100}}>
    <circle r={r} fill="#343446" stroke="#9d9daa"/>
    {litFraction>0.005 && <path d={litPath} fill="#f1e8cb"/>}
    {litFraction>0.995 && <circle r={r} fill="#f1e8cb"/>}
   </svg>
   <p><strong>{phase}</strong> · Yaklaşık {Math.round(litFraction*100)}% aydınlık görünüm</p>
  </div>
  <label>Örnek ay döngüsünün günü: {day}
   <input type="range" min="0" max="29" step="1" value={day} onChange={e=>setDay(Number(e.target.value))} style={{width:'100%'}}/>
  </label>
  <button type="button" onClick={()=>setDay(0)}>Yeni aya dön</button>
  <p>Bu şema öğretim amaçlıdır. Gerçek Ay evrelerinin tarihini, görünüm açısını ve yörünge eğimini hesaplamaz.</p>
 </section>;
}
