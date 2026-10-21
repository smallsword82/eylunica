import {questionDiagram,diagramHint,type MathDiagram} from './math-diagrams.ts';
import {makeAngleItem,type AngleDiagram} from './angle-questions.ts';
import archivedAngles from './legacy-angle-questions.json' with {type:'json'};
import official from './official-curriculum.json' with {type:'json'};
import type {Question} from './catalog';
import {mathModels,type MathModel} from './math-models.ts';
export type JourneyFigure={kind:'segment'|'angle'|'polygon'|'number'|'groups'|'rectangle'|'fraction'|'bars'|'balance'|'operation'|'pattern'|'bag';values:number[];labels?:string[];angle?:AngleDiagram;diagram?:MathDiagram};
export type JourneyQuestion=Question&{purpose:'practice'|'test'|'written';taskFamily:number;figure:JourneyFigure};
type Item={prompt:string;answer:string;explanation:string;figure:JourneyFigure;choices?:string[];hint?:string};
const number=(n:number)=>String(n);
function make(mode:MathModel,i:number,practice:boolean):Item{
 const n=Math.floor(i/4)+2+(practice?0:4),m=(i%3)+2,t=i%4;
 const f=(prompt:string,answer:string|number,explanation:string,kind:JourneyFigure['kind'],values:number[],choices?:string[]):Item=>({prompt,answer:String(answer),explanation,figure:{kind,values},choices});
 if(mode==='construction'){
  if(t===0)return f(`Cetvelde A ${n} cm, B ${n+m+2} cm çizgisinde. AB uzunluğu kaç cm?`,m+2,`${n+m+2} − ${n} = ${m+2} cm.`,'segment',[n,n+m+2]);
  if(t===1)return f(`AB = ${n} cm, BC = ${m} cm. B, A ile C arasında. AC kaç cm?`,n+m,`Ardışık uzunluklar toplanır: ${n} + ${m} = ${n+m}.`,'segment',[0,n,n+m]);
  if(t===2)return f(`Pergelin açıklığı ${n} cm. Çizilen çemberin yarıçapı kaç cm?`,n,'Pergelin sabit açıklığı yarıçaptır.','polygon',[0,n]);
  return f(`Bir doğru parçası ${2*n} cm. Orta noktadan bir uca uzaklık kaç cm?`,n,`${2*n} ÷ 2 = ${n} cm.`,'segment',[0,n,2*n]);
 }
 if(mode==='angle')return makeAngleItem(i);
 if(mode==='polygon'){
  const sides=3+i%6;
  if(t===0)return f(`Düzgün çokgenin ${sides} kenarının her biri ${n} cm. Çevresi kaç cm?`,sides*n,`${sides} × ${n} = ${sides*n} cm.`,'polygon',[sides]);
  if(t===1)return f(`${sides} kenarlı çokgenin her köşesine ${n} yıldız koyulacak. Kaç yıldız gerekir?`,sides*n,`${sides} köşe × ${n} yıldız = ${sides*n}.`,'polygon',[sides]);
  if(t===2)return f(`Yarıçapı ${n} cm olan çemberin çapı kaç cm?`,2*n,`Çap iki yarıçap uzunluğudur: 2 × ${n} = ${2*n}.`,'polygon',[0,n]);
  return f(`Düzgün çokgenin ${sides} kenarının her biri ${n+1} cm. Etrafını kaplamak için kaç cm şerit gerekir?`,sides*(n+1),`${sides} × ${n+1} = ${sides*(n+1)} cm.`,'polygon',[sides]);
 }
 if(mode==='reading'||mode==='place'){
  const value=n*1000000+m*1000+215,digit=n,d=1+i%9;
  if(t===0)return f(`${value.toLocaleString('tr')} sayısının milyonlar bölüğünde hangi sayı var?`,n,'Sağdan üçerli gruplandır: birler, binler, milyonlar.','number',[n,m,215]);
  if(t===1)return f(`${digit} milyon + ${m} bin + 215 biçimindeki çözümlemede milyonların değeri kaçtır?`,digit*1000000,`${digit} × 1 000 000 = ${digit*1000000}.`,'number',[digit,m,215]);
  if(t===2)return f(`${n} ${d}82 sayısında yüzler basamağındaki ${d} rakamının değeri kaçtır?`,d*100,`${d} × 100 = ${d*100}.`,'number',[n,d,8,2]);
  return f(`${d} 482 sayısının binler basamağındaki rakamın değeri kaçtır?`,d*1000,`${d} × 1 000 = ${d*1000}.`,'number',[d,4,8,2]);
 }
 if(mode==='operations'){
  if(t===0)return f(`${n} kutunun her birinde ${m} kalem var. Toplam kaç kalem var?`,n*m,`${n} × ${m} = ${n*m}.`,'groups',[n,m]);
  if(t===1)return f(`${n*m} kitap ${m} rafa eşit paylaştırıldı. Her rafta kaç kitap var?`,n,`${n*m} ÷ ${m} = ${n}.`,'groups',[m,n]);
  if(t===2)return f(`Kütüphanede ${n*10} kitap vardı. ${m*3} kitap ödünç verildi. Kaç kitap kaldı?`,n*10-m*3,`${n*10} − ${m*3} = ${n*10-m*3}.`,'operation',[n*10,m*3]);
  return f(`Bir grupta ${n} öğrenci, diğerinde ${m} öğrenci var. Her birine 2 kart verilirse toplam kaç kart gerekir?`,(n+m)*2,`Önce topla, sonra çarp: (${n}+${m}) × 2 = ${(n+m)*2}.`,'groups',[n+m,2]);
 }
 if(mode==='area'){
  if(t===0)return f(`Dikdörtgenin kenarları ${n} cm ve ${m} cm. Alanı kaç cm²?`,n*m,`${n} × ${m} = ${n*m} cm².`,'rectangle',[n,m]);
  if(t===1)return f(`${n} cm ve ${m} cm kenarlı kartın çevresi kaç cm?`,2*(n+m),`2 × (${n}+${m}) = ${2*(n+m)} cm.`,'rectangle',[n,m]);
  if(t===2)return f(`Bahçenin alanı ${n*m} m², bir kenarı ${m} m. Diğer kenarı kaç m?`,n,`${n*m} ÷ ${m} = ${n} m.`,'rectangle',[n,m]);
  return f(`${n} cm ve ${m} cm kenarlı dikdörtgenin ${n===m?'bir':'uzun'} kenarı 1 cm artırılıyor. Yeni alan kaç cm²?`,(Math.max(n,m)+1)*Math.min(n,m),`${n===m?'Bir':'Uzun'} kenara 1 ekle: (${Math.max(n,m)}+1) × ${Math.min(n,m)} = ${(Math.max(n,m)+1)*Math.min(n,m)}.`,'rectangle',[n,m]);
 }
 if(mode==='fraction'||mode==='fractionCompare'){
  const den=mode==='fractionCompare'?4+Math.floor(i/4):[4,5,8,10,20][i%5],num=1+i%(den-1);
  if(mode==='fractionCompare'){
   const first=i%3===0?num+1:num,second=i%3===1?num+1:num;
   return f(`${den} eş parçalı iki bütünde birincinin ${first}, ikincinin ${second} parçası boyalı. Hangisi daha büyük?`,first===second?'Eşit':first>second?'Birinci kesir':'İkinci kesir',`Paydalar eşit; payları karşılaştır: ${first} ${first===second?'=':first>second?'>':'<'} ${second}.`,'fraction',[den,first,second],['Birinci kesir','İkinci kesir','Eşit']);
  }
  if(t===0)return f(`Her biri ${den} eş parçalı ${n} bütünün her birinde ${num} parça boyalı. Toplam kaç eş parça boyalı?`,n*num,`${n} × ${num} = ${n*num} eş parça.`,'fraction',[den,num]);
  if(t===1)return f(`${den} eş parçanın ${num} tanesi boyalı. Kesrin paydası kaçtır?`,den,'Payda bütünün ayrıldığı eş parça sayısıdır.','fraction',[den,num]);
  if(t===2&&Math.floor(i/4)%2===0)return f(`${num}/${den} kesrinin yüzde gösteriminde yüzde işaretinin yanına hangi sayı gelir?`,num*100/den,`${num} ÷ ${den} × 100 = ${num*100/den}.`,'fraction',[den,num]);
  if(t===2)return f(`${n*den} TL bütçenin ${num}/${den} kadarı harcandı. Kaç TL harcandı?`,n*num,`${n*den} ÷ ${den} × ${num} = ${n*num} TL.`,'fraction',[den,num]);
  return f(`Her biri ${den} eş parçalı ${n} bütünün her birinde ${num} parça boyalı. Toplam kaç eş parça boyasız?`,n*(den-num),`${n} × (${den} − ${num}) = ${n*(den-num)}.`,'fraction',[den,num]);
 }
 if(mode==='data'){
  const vals=[n,m,n+2];
  if(t===0)return f(`Elma ${n}, armut ${m}, muz ${n+2} oy aldı. Toplam kaç oy var?`,2*n+m+2,`${n}+${m}+${n+2} = ${2*n+m+2}.`,'bars',vals);
  if(t===1)return f(`Elma ${n}, armut ${m}, muz ${n+2} oy aldı. Muz ile elma arasındaki fark kaçtır?`,2,`${n+2} − ${n} = 2.`,'bars',vals);
  if(t===2)return f(`Grafikte armut ${m} oy aldı. 3 yeni oy eklenirse kaç olur?`,m+3,`${m}+3 = ${m+3}.`,'bars',vals);
  return f(`Grafikte elma ${n}, armut ${m}, muz ${n+2} oy aldı. Elma ve armut toplamı kaçtır?`,n+m,`${n}+${m} = ${n+m}.`,'bars',vals);
 }
 if(mode==='equality'){
  if(t===0)return f(`${n} + □ = ${n+m}. Eşitliği sağlayan sayı kaç?`,m,`${n+m} − ${n} = ${m}.`,'balance',[n,n+m]);
  if(t===1)return f(`${n+m} = ${n+m}. İki tarafa da ${m} ekleniyor. Her tarafın yeni değeri kaç?`,n+2*m,`İki tarafa aynı işlem: ${n+m}+${m} = ${n+2*m}.`,'balance',[n+m,n+m]);
  if(t===2)return f(`${n*m} = ${n*m}. İki taraf ${m} ile bölünüyor. Yeni değer kaç?`,n,`${n*m} ÷ ${m} = ${n}.`,'balance',[n*m,n*m]);
  return f(`□ − ${m} = ${n}. Kutudaki sayı kaçtır?`,n+m,`Çıkarılanı geri ekle: ${n}+${m} = ${n+m}.`,'balance',[m,n]);
 }
 if(mode==='properties'){
  if(t===0)return f(`${n} × (${m} + 2) işleminin sonucu kaçtır?`,n*(m+2),`${n}×${m} + ${n}×2 = ${n*m}+${n*2} = ${n*(m+2)}.`,'rectangle',[n,m+2]);
  if(t===1)return f(`${n} × ${m} = ${m} × □. Kutuda hangi sayı olmalı?`,n,'Çarpanların yeri değişse de çarpım korunur.','rectangle',[n,m]);
  if(t===2)return f(`(${n} × 2) × ${m} işleminin sonucu kaçtır?`,n*2*m,`Gruplama değişebilir: ${n} × (2×${m}) = ${n*2*m}.`,'groups',[n,2*m]);
  return f(`${n} × ${m} + ${n} × 1 toplamı kaçtır?`,n*(m+1),`Ortak çarpanla: ${n} × (${m}+1) = ${n*(m+1)}.`,'rectangle',[n,m+1]);
 }
 if(mode==='precedence'){
  if(t===0)return f(`${n} + 3 × ${m} işleminin sonucu kaçtır?`,n+3*m,`Önce çarp: 3×${m}=${3*m}; sonra ${n} ekle.`,'operation',[n,3,m]);
  if(t===1)return f(`(${n} + 3) × ${m} işleminin sonucu kaçtır?`,(n+3)*m,`Önce parantez: ${n}+3=${n+3}; sonra çarp.`,'operation',[n,3,m]);
  if(t===2)return f(`${n*m} ÷ ${m} + 4 işleminin sonucu kaçtır?`,n+4,`Önce bölme: ${n*m}÷${m}=${n}; sonra 4 ekle.`,'operation',[n*m,m,4]);
  return f(`${n*2} − ${m} + 1 işleminin sonucu kaçtır?`,n*2-m+1,`Aynı öncelikte soldan sağa: ${n*2}−${m}=${n*2-m}; +1=${n*2-m+1}.`,'operation',[n*2,m,1]);
 }
 if(mode==='pattern')return f(`${n}, ${n+m}, ${n+2*m}, ${n+3*m}, … örüntüsünün sonraki terimi kaçtır?`,n+4*m,`Her adımda ${m} ekleniyor. ${n+3*m}+${m}=${n+4*m}.`,'pattern',[n,n+m,n+2*m,n+3*m]);
 if(mode==='algorithm'){
  if(t===0)return f(`Robot ${n} sayısına önce ${m} ekliyor, sonra sonucu 2 ile çarpıyor. Çıktı kaçtır?`,(n+m)*2,`Sırayla: ${n}+${m}=${n+m}; ${n+m}×2=${(n+m)*2}.`,'operation',[n,m,2]);
  if(t===1)return f(`Robot ${n*m+1} TL ile ${m} TL'lik defterlerden alıyor. En çok kaç defter alabilir?`,n,`Tam bölümü al: ${n*m+1}÷${m} işleminin tam bölümü ${n}.`,'operation',[n*m+1,m]);
  if(t===2)return f(`Başlangıç ${n*2}. Önce 2'ye böl, sonra ${m} ekle. Sonuç kaçtır?`,n+m,`${n*2}÷2=${n}; ${n}+${m}=${n+m}.`,'operation',[n*2,2,m]);
  return f(`Robot ${n} adım ileri, sonra ${m} adım daha ileri gidiyor. Toplam kaç adım atar?`,n+m,`Aynı yöndeki adımları topla: ${n}+${m}=${n+m}.`,'pattern',[n,m]);
 }
 const yellow=n,purple=i%4===0?(Math.floor(i/4)%3===0?Math.max(1,n-m):Math.floor(i/4)%3===1?n+m:n):m;
 if(t===0)return f(`Aynı özellikte ${yellow} sarı ve ${purple} mor taş iyi karıştırıldı. Hangisinin çekilmesi daha olası?`,yellow===purple?'Eşit olası':yellow>purple?'Sarı':'Mor','Sayıca fazla renk daha olasıdır; tek çekilişin sonucunu garanti etmez.','bag',[yellow,purple],['Sarı','Mor','Eşit olası']);
 if(t===1)return f(`Çantada ${yellow} sarı ve ${purple} mor taş var. Hangi ifade doğru?`,'İki renk de çekilebilir','İki renkten de taş olduğu için her ikisi de mümkündür.','bag',[yellow,purple],['Kesin sarı gelir','Kesin mor gelir','İki renk de çekilebilir']);
 if(t===2)return f(`Çantada ${yellow} sarı ve ${yellow} mor taş var. Renkler için hangi tahmin uygundur?`,'Eşit olası','Aynı özellikte taşlardan eşit sayıda varsa renkler eşit olasıdır.','bag',[yellow,yellow],['Sarı daha olası','Mor daha olası','Eşit olası']);
 return f(`Çantada ${yellow} sarı ve ${purple} mor taş var. Toplam kaç taş var?`,yellow+purple,`${yellow}+${purple}=${yellow+purple}.`,'bag',[yellow,purple]);
}
const topicRefs=[...official.topics.filter(t=>t.courseId==='course-1'),{id:'place-value'}];
export const mathJourneyQuestions:JourneyQuestion[]=topicRefs.flatMap(topic=>{
 const used=new Set<string>();const result:JourneyQuestion[]=[];
 for(const [purpose,count] of [['practice',40],['test',80],['written',80]] as const){
  let countAdded=0;
  for(let i=purpose==='practice'?0:purpose==='test'?40:140;countAdded<count&&i<2500;i++){
   const practice=purpose==='practice',item=make(mathModels[topic.id],i,practice);
   const diagram=questionDiagram(mathModels[topic.id],i,practice);if(diagram){item.figure.diagram=diagram;item.hint=diagramHint(diagram);}
   const key=questionSignature(item);if(used.has(key))continue;used.add(key);
   if(mathModels[topic.id]==='area'&&i%4===2)item.figure.labels=['?',String(item.figure.values[1])];
   if(mathModels[topic.id]==='construction'&&(i%4===1||i%4===3))item.figure.labels=['A','B','C'];
   if(mathModels[topic.id]==='equality'){const n=Math.floor(i/4)+2+(practice?0:4),m=i%3+2;item.figure.labels=i%4===0?[`${n} + ?`,String(n+m)]:i%4===1?[`${n+m} + ${m}`,`${n+m} + ${m}`]:i%4===2?[`${n*m} ÷ ${m}`,`${n*m} ÷ ${m}`]:[`? − ${m}`,String(n)];}
   if(mathModels[topic.id]==='fraction'&&i%4!==1)item.figure.labels=['Bir bütünün modeli'];
   if(item.choices){const offset=(i+(mathModels[topic.id]==='angle'?Math.floor(i/4):0))%item.choices.length;item.choices=[...item.choices.slice(offset),...item.choices.slice(0,offset)];}
   result.push({id:`mj-${purpose}-${topic.id}-${mathModels[topic.id]==='angle'?'v2-':''}${i+1}`,topicId:topic.id,purpose,taskFamily:i%4,kind:item.choices?'choice':'fill',prompt:item.prompt,answer:item.answer,choices:item.choices,explanation:item.explanation.length>16?item.explanation:`Verilenleri kullanalım: ${item.explanation}`,hints:[item.hint|| (item.figure.kind==='rectangle'?(item.prompt.includes('çevre')||item.prompt.includes('şerit')?'Dört kenarı takip et; karşılıklı kenarlar eşittir.':item.prompt.includes('Diğer kenarı')?'Alanı verilen kenar uzunluğuna böl.':'Şeklin iki kenarını incele; alan için birimkareleri düşün.'):item.figure.kind==='segment'?'Cetveldeki iki konumu karşılaştır; uzunluk konumların farkıdır.':item.figure.kind==='angle'?'İletkide başlangıç ışınındaki 0’dan say; açının açıklığını izle.':item.figure.kind==='fraction'?'Bütünün eş parçalarına bak; payı, paydayı ve sorulan miktarı ayırt et.':item.figure.kind==='balance'?'İki tarafın aynı değerde kalmasını sağlayan işlemi düşün.':item.figure.kind==='bars'?'Sütunların üzerindeki sayıları oku; sorunun toplam mı fark mı istediğine bak.':'Görseldeki verilenleri izle; sorulan miktar için işlemleri sırayla kur.')],difficulty:(practice?i%2+1:i%4+1) as 1|2|3|4,outcomeCode:null,figure:item.figure});countAdded++;
  }
 }
 return result;
});
export function journeyPool(topicId:string,purpose:'practice'|'test'|'written'):JourneyQuestion[]{return mathJourneyQuestions.filter(q=>q.topicId===topicId&&q.purpose===purpose);}
export function freshJourneyQuestions(topicId:string,purpose:'practice'|'test'|'written',used:string[],count:number):JourneyQuestion[]{
 const blocked=new Set(used),unique=new Set<string>(),usedPrompts=new Set(mathJourneyQuestions.filter(q=>blocked.has(q.id)).map(questionSignature));
 const eligible=journeyPool(topicId,purpose).filter(q=>{const key=questionSignature(q);if(blocked.has(q.id)||usedPrompts.has(key)||unique.has(key))return false;unique.add(key);return true;});
 const buckets=[0,1,2,3].map(family=>eligible.filter(q=>q.taskFamily===family));const result:JourneyQuestion[]=[];
 for(let round=0;result.length<count&&round<80;round++){let added=false;for(const bucket of buckets){if(bucket[round]&&result.length<count){result.push(bucket[round]);added=true;}}if(!added)break;}
 return result;
}

// Historical IDs stay resolvable for saved answers and unfinished exams; never selected for new sessions.
export const legacyAngleQuestions=archivedAngles as JourneyQuestion[];

export function questionSignature(q:{prompt:string;figure?:JourneyFigure}):string{return q.prompt.toLocaleLowerCase('tr').replace(/\s+/g,' ').trim()+(q.figure?.angle?'::'+JSON.stringify(q.figure.angle):'');}
