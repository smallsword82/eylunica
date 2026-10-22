import { useState } from 'react';

/** Conceptual, deliberately not-to-scale orbital model. */
export function ScienceOrbitModel() {
  const [angle, setAngle] = useState(0);
  const [moonAngle, setMoonAngle] = useState(0);
  const rad = angle * Math.PI / 180;
  const mr = moonAngle * Math.PI / 180;
  const earthX = 180 + Math.cos(rad) * 102;
  const earthY = 140 + Math.sin(rad) * 86;
  const moonX = earthX + Math.cos(mr) * 29;
  const moonY = earthY + Math.sin(mr) * 29;
  return <section className="lesson-reading" aria-label="Güneş Dünya Ay etkileşimli modeli">
    <h2>Güneş, Dünya ve Ay'ı keşfet</h2>
    <p>Kaydırıcıları hareket ettirerek Dünya'nın Güneş çevresindeki, Ay'ın Dünya çevresindeki konumunu değiştir. Çizim büyüklükleri, uzaklıkları, yörünge eğimlerini ve gerçek hareket hızlarını ölçekli göstermez.</p>
    <svg viewBox="0 0 360 280" role="img" aria-label={`Güneş merkezde, Dünya yörünge konumu ${angle} derece, Ay konumu ${moonAngle} derece`} style={{width:'100%',maxWidth:540,display:'block',margin:'auto'}}>
      <rect width="360" height="280" rx="20" fill="#16142e"/>
      <ellipse cx="180" cy="140" rx="102" ry="86" fill="none" stroke="#9d95c7" strokeDasharray="5 5"/>
      <circle cx="180" cy="140" r="27" fill="#ffca59"/>
      <text x="180" y="180" textAnchor="middle" fill="white" fontSize="13">Güneş</text>
      <circle cx={earthX} cy={earthY} r="11" fill="#5fbce6"/>
      <circle cx={earthX-3} cy={earthY-2} r="4" fill="#70c78c"/>
      <circle cx={moonX} cy={moonY} r="5" fill="#dedee7"/>
      <text x={earthX} y={earthY-17} textAnchor="middle" fill="white" fontSize="11">Dünya</text>
      <text x={moonX} y={moonY+17} textAnchor="middle" fill="white" fontSize="10">Ay</text>
    </svg>
    <label style={{display:'block',marginTop:12}}>Dünya'nın yörüngedeki konumu: {angle}°
      <input type="range" min="0" max="360" value={angle} onChange={e=>setAngle(Number(e.target.value))} style={{width:'100%'}}/>
    </label>
    <label style={{display:'block',marginTop:12}}>Ay'ın Dünya çevresindeki konumu: {moonAngle}°
      <input type="range" min="0" max="360" value={moonAngle} onChange={e=>setMoonAngle(Number(e.target.value))} style={{width:'100%'}}/>
    </label>
    <button type="button" onClick={()=>{setAngle(0);setMoonAngle(0);}}>Başlangıç konumuna dön</button>
    <p><strong>Gözlem:</strong> Dünya'nın konumu değişirken Güneş'in yeri sabit çiziliyor. Ay ise Dünya'nın çevresinde konum değiştiriyor. Gerçekte bütün bu gök cisimleri hareket eder.</p>
  </section>;
}
