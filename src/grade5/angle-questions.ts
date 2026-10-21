import type {JourneyFigure} from './math-journey-bank';
export type AngleDiagram={task:'read'|'classify'|'between'|'missing';start:number;end:number;fromLeft?:boolean;total?:number;known?:number};
const measurements=[30,60,90,120,150,45,75,105,135,165,...Array.from({length:35},(_,i)=>(i+1)*5).filter(v=>![30,60,90,120,150,45,75,105,135,165].includes(v))];
const categories=[90,45,120,180,...measurements.filter(v=>![90,45,120].includes(v))];
const pairs:number[][]=[[20,70],[30,90],[10,50],[40,120]];
for(let start=10;start<=80;start+=10)for(let end=start+10;end<=180;end+=10)if(!pairs.some(p=>p[0]===start&&p[1]===end))pairs.push([start,end]);
const missing:number[][]=[[90,30],[180,60],[90,45],[180,120]];
for(const total of [90,120,150,180])for(let known=5;known<total;known+=5)if(!missing.some(p=>p[0]===total&&p[1]===known))missing.push([total,known]);
function degreeChoices(answer:number){
 const options=[...new Set([answer,180-answer,answer+10,answer-10,answer+5,answer-5,90,180,0].filter(v=>v>=0&&v<=180))].slice(0,4);
 return options.map(n=>`${n}°`);
}
export function makeAngleItem(i:number){
 const family=i%4,index=Math.floor(i/4);
 let prompt:string,answer:string,explanation:string,hint:string,angle:AngleDiagram,choices:string[];
 if(family===0){
  const a=measurements[index%measurements.length],fromLeft=Math.floor(index/measurements.length)%2===1;
  prompt=`OA ışını ${fromLeft?'soldaki':'sağdaki'} 0° çizgisinde. Sarı AOB açısı kaç derecedir?`;
  answer=`${a}°`;choices=degreeChoices(a);angle={task:'read',start:0,end:a,fromLeft};
  hint='Mavi OA ışınındaki 0’dan başla. Sarı OB ışınının geçtiği çizgiyi oku.';
  explanation=`OA ışını ${fromLeft?'soldaki':'sağdaki'} 0° çizgisinde. Bu 0’dan başlayan ölçekte OB ışını ${a}° çizgisinden geçiyor. AOB = ${a}°.`;
 }else if(family===1){
  const a=categories[index%categories.length];answer=a<90?'Dar açı':a===90?'Dik açı':a<180?'Geniş açı':'Doğru açı';
  prompt=`Şekilde AOB açısı ${a}°. Bu açıya hangi ad verilir?`;choices=['Dar açı','Dik açı','Geniş açı','Doğru açı'];angle={task:'classify',start:0,end:a};
  hint='Açıyı 90° ve 180° ile karşılaştır. Dik açı 90°, doğru açı 180° olur.';
  explanation=a===90?'AOB = 90°. Tam bir dik köşe oluşturduğu için bu bir dik açıdır.':a===180?'AOB = 180°. Işınlar zıt yönlerde tek bir doğru oluşturur; bu bir doğru açıdır.':a<90?`${a}°, 90°’den küçüktür. Bu yüzden AOB bir dar açıdır.`:`${a}°, 90°’den büyük ve 180°’den küçüktür. Bu yüzden AOB bir geniş açıdır.`;
 }else if(family===2){
  const [start,end]=pairs[index%pairs.length],a=end-start;
  prompt=`OA ışını ${start}°, OB ışını ${end}° çizgisinde. Aralarındaki sarı açı kaç derecedir?`;answer=`${a}°`;choices=degreeChoices(a);angle={task:'between',start,end};
  hint='Bu kez OA ışını 0’da değil. Büyük ölçümden küçük ölçümü çıkar.';
  explanation=`Açı ${start}° çizgisinde başlayıp ${end}° çizgisinde bitiyor. Aradaki açıklık ${end} − ${start} = ${a}° olur.`;
 }else{
  const [total,known]=missing[index%missing.length],a=total-known;
  prompt=`Büyük AOB açısı ${total}°. Mavi AOC bölümü ${known}°. Sarı COB bölümü kaç derecedir?`;answer=`${a}°`;choices=degreeChoices(a);angle={task:'missing',start:0,end:total,total,known};
  hint='Mavi ve sarı bölümler büyük açıyı oluşturur. Bütünden mavi bölümü çıkar.';
  explanation=`Mavi AOC ile sarı COB yan yana gelince ${total}° olur. Sarı bölüm = ${total} − ${known} = ${a}°.`;
 }
 const figure:JourneyFigure={kind:'angle',values:[angle.start,angle.end,...(angle.known===undefined?[]:[angle.known])],angle};
 return {prompt,answer,explanation,hint,choices,figure};
}
