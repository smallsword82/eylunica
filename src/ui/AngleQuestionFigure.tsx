import {useId} from 'react';
import type {JourneyFigure} from '../grade5/math-journey-bank';
const center={x:200,y:172};
const point=(degrees:number,radius:number)=>({x:center.x+radius*Math.cos(degrees*Math.PI/180),y:center.y-radius*Math.sin(degrees*Math.PI/180)});
function sector(start:number,end:number,radius:number){const a=point(start,radius),b=point(end,radius);return `M${center.x} ${center.y}L${a.x} ${a.y}A${radius} ${radius} 0 0 ${end>start?0:1} ${b.x} ${b.y}Z`;}
export function AngleQuestionFigure({figure,mode}:{figure:JourneyFigure;mode:'question'|'hint'|'solution'}){
 const labelId=useId(),[a,b]=figure.values;
 const model=figure.angle||(b===undefined?{task:'read' as const,start:0,end:a}:{task:'missing' as const,start:0,end:a,total:a,known:b});
 const physical=(angle:number)=>model.fromLeft?180-angle:angle;
 const start=physical(model.start),end=physical(model.end),known=model.known??0;
 const answer=model.task==='missing'?(model.total||model.end)-known:model.end-model.start;
 const missing=model.task==='missing',measuring=model.task==='read'||model.task==='between';
 const startPoint=point(start,151),endPoint=point(end,151),middle=missing?point(known,151):undefined;
 const label=(degree:number,text:string,color='#fff0c8',radius=158)=>{const p=point(degree,radius);return <text x={p.x} y={p.y+4} textAnchor="middle" fill={color} fontSize="15" fontWeight="700">{text}</text>;};
 return <svg className={`journey-figure journey-angle-figure figure-${mode}`} viewBox="0 0 400 210" role="img" aria-labelledby={labelId}>
 <title id={labelId}>{missing?'Mavi AOC ile sarı COB yan yana gelerek büyük AOB açısını oluşturuyor.':`O ortak noktasından çıkan OA ve OB ışınları. ${model.fromLeft?'Başlangıç soldaki 0 çizgisinde.':'Ölçek sağdaki 0 çizgisinden başlıyor.'}`}</title>
 <desc>{model.task==='read'?`OB, başlangıçtan itibaren beşer derecelik ${answer/5}. işarette.`:model.task==='between'?`OA ${model.start}, OB ${model.end} derece çizgisinde.`:missing?`Büyük açı ${model.total} derece, mavi bölüm ${known} derece, sarı bölüm soruluyor.`:`Verilen açının ölçüsü ${answer} derece.`}</desc>
 {!missing&&<g><path d="M70 172A130 130 0 0 1 330 172Z" fill="#b28ae519" stroke="#aa97c9" strokeWidth="1.5"/>{Array.from({length:37},(_,i)=>{
  const degree=i*5,p=point(degree,130),q=point(degree,degree%10===0?118:124);
  return <g key={degree}><path d={`M${p.x} ${p.y}L${q.x} ${q.y}`} stroke={degree%10===0?'#f4e6ff':'#ac98c1'} strokeWidth={degree%10===0?1.7:1}/></g>;
 })}</g>}
 {missing&&<><path d={sector(0,known,48)} fill="#7bd8ed55" stroke="#81e4ef" strokeWidth="2"/><path d={sector(known,end,64)} fill="#f6c66a55" stroke="#ffd782" strokeWidth="2"/>{label(known/2,`${known}°`,'#9af1ff',82)}{label((known+end)/2,mode==='solution'?`${answer}°`:'?','#ffe19a',89)}<path d={sector(0,end,117)} fill="none" stroke="#c6b2e5" strokeWidth="1.5" strokeDasharray="5 5"/>{label(end/2,`${model.total}°`,'#e0cff6',133)}</>}
 {!missing&&<><path d={sector(start,end,43)} fill="#f6c66a55" stroke="#ffd782" strokeWidth="2"/>{label((start+end)/2,measuring&&mode!=='solution'?'?':`${answer}°`,'#ffe19a',64)}</>}
 <path d={`M${center.x} ${center.y}L${startPoint.x} ${startPoint.y}`} stroke="#7edfed" strokeWidth="4"/>
 <path d={`M${center.x} ${center.y}L${endPoint.x} ${endPoint.y}`} stroke="#ffd782" strokeWidth="4"/>
 {middle&&<path d={`M${center.x} ${center.y}L${middle.x} ${middle.y}`} stroke="#83e3ed" strokeWidth="3"/>}
 <circle cx={center.x} cy={center.y} r="4" fill="#fff0cd"/>
 {label(start,'A','#9af1ff')}{label(end,'B','#ffe19a')}{missing&&label(known,'C','#9af1ff')}<text x="200" y="198" fill="#fff0cd" fontSize="15" textAnchor="middle" fontWeight="700">O</text>
 {!missing&&<>{[0,30,60,90,120,150,180].map(degree=>{const n=point(degree,105);return <text key={degree} x={n.x} y={n.y+(degree===0||degree===180?20:4)} textAnchor="middle" fontSize="16" fill="#f8efff" stroke="#261735" strokeWidth="3" paintOrder="stroke">{model.fromLeft?180-degree:degree}</text>;})}<text x="10" y="20" fill="#d9c9ec" fontSize="12">Küçük çizgi: 5°</text></>}
 {mode==='hint'&&!missing&&<circle cx={point(start,105).x} cy={point(start,105).y} r="15" fill="none" stroke="#8de9f1" strokeWidth="2" strokeDasharray="3 3"/>}
 </svg>;
}
