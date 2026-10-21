import type {MathModel} from './math-models';
export type Operator='+'|'−'|'×'|'÷';
export type Expression=number|{op:Operator;left:Expression;right:Expression};
export const expr=(op:Operator,left:Expression,right:Expression):Expression=>({op,left,right});
export function evaluate(e:Expression):number {if(typeof e==='number')return e;const a=evaluate(e.left),b=evaluate(e.right);return e.op==='+'?a+b:e.op==='−'?a-b:e.op==='×'?a*b:b===0?NaN:a/b;}
export function expressionText(e:Expression):string {return typeof e==='number'?String(e):`(${expressionText(e.left)} ${e.op} ${expressionText(e.right)})`;}
export function expressionSteps(e:Expression):string[]{
 const rows=[expressionText(e)];let current=e;
 function reduce(x:Expression):Expression{if(typeof x==='number')return x;if(typeof x.left!=='number')return {...x,left:reduce(x.left)};if(typeof x.right!=='number')return {...x,right:reduce(x.right)};return evaluate(x);}
 for(let i=0;i<8&&typeof current!=='number';i++){current=reduce(current);rows.push(expressionText(current));}return rows;
}
export type MathDiagram=
 |{kind:'segment';task:'distance'|'join'|'half';a:number;b:number;unit:string}
 |{kind:'compass';radius:number}
 |{kind:'polygon';sides:number;edge:number;stars?:number;closed?:boolean;task:'perimeter'|'stars'|'features'}
 |{kind:'circle';radius:number;target:'diameter'|'radius'}
 |{kind:'circlePair';radius:number;equilateral?:boolean;unknownBase?:boolean}
 |{kind:'geometry';variant:'elements'|'parallel'|'polygonCompare'|'angleTypes'|'fullTurn'|'crossing'}
 |{kind:'number';groups:string[];task:'group'|'groupValue';selected:number}
 |{kind:'place';digits:string;selectedFromRight:number}
 |{kind:'groups';groups:number;each:number;task:'multiply'|'share';unit:string}
 |{kind:'subtract';whole:number;part:number;unit:string}
 |{kind:'combined';a:number;b:number;factor:number;unit:string}
 |{kind:'rectangle';a:number;b:number;task:'area'|'perimeter'|'missing'|'extend';unit:string}
 |{kind:'fraction';den:number;num:number;copies:number;task:'painted'|'unpainted'|'denominator'|'percent'|'budget'|'fraction';budget?:number;representation?:'numberLine'|'hundred'}
 |{kind:'compare';left:[number,number];right:[number,number];differentWholes?:boolean}
 |{kind:'chart';values:number[];labels:string[];task:'total'|'difference'|'add'|'pair'|'allClaim';add?:number}
 |{kind:'balance';n:number;m:number;task:'unknownAdd'|'bothAdd'|'bothDivide'|'unknownSubtract'|'oneSide'}
 |{kind:'property';n:number;m:number;extra?:number;task:'distribute'|'commute'|'associate'|'factor'}
 |{kind:'expression';expression:Expression}
 |{kind:'sequence';start:number;change:number;count:number;rule:'add'|'multiply';targetIndex?:number}
 |{kind:'flow';input:number;operations:{op:Operator;value:number}[]}
 |{kind:'shop';budget:number;price:number}
 |{kind:'walk';a:number;b:number}
 |{kind:'bag';a:number;b:number;names:[string,string];colors:[string,string];task:'likely'|'possible'|'equal'|'total'|'missingColor'}
 |{kind:'conditional';input:number;test:'even'|'greaterTen'}
 |{kind:'bus';people:number;capacity:number}
 |{kind:'spinner';equal:boolean}
 |{kind:'coin';history?:boolean}
 |{kind:'weather'}
 |{kind:'division';total:number;divisor:number}
 |{kind:'boxContext';groups:number;inside:number;extra:number;extraInside:boolean}
 |{kind:'shapePattern'}
 |{kind:'rule';lines:string[]};
const bagColors:[string,string]=['#ffd47c','#b99aee'];
export function questionDiagram(mode:MathModel,i:number,practice:boolean):MathDiagram|undefined{
 const n=Math.floor(i/4)+2+(practice?0:4),m=i%3+2,t=i%4;
 if(mode==='angle')return undefined;
 if(mode==='construction')return t===0?{kind:'segment',task:'distance',a:n,b:n+m+2,unit:'cm'}:t===1?{kind:'segment',task:'join',a:n,b:m,unit:'cm'}:t===2?{kind:'compass',radius:n}:{kind:'segment',task:'half',a:2*n,b:0,unit:'cm'};
 if(mode==='polygon'){const sides=3+i%6;return t===2?{kind:'circle',radius:n,target:'diameter'}:{kind:'polygon',sides,edge:t===3?n+1:n,stars:t===1?n:undefined,task:t===1?'stars':'perimeter'};}
 if(mode==='reading'||mode==='place')return t===0||t===1?{kind:'number',groups:[String(n),String(m).padStart(3,'0'),'215'],selected:0,task:t===0?'group':'groupValue'}:{kind:'place',digits:t===2?`${n}${1+i%9}82`:`${1+i%9}482`,selectedFromRight:t===2?2:3};
 if(mode==='operations')return t===0?{kind:'groups',groups:n,each:m,task:'multiply',unit:'kalem'}:t===1?{kind:'groups',groups:m,each:n,task:'share',unit:'kitap'}:t===2?{kind:'subtract',whole:n*10,part:m*3,unit:'kitap'}:{kind:'combined',a:n,b:m,factor:2,unit:'kart'};
 if(mode==='area')return {kind:'rectangle',a:n,b:m,task:(['area','perimeter','missing','extend'] as const)[t],unit:t===2?'m':'cm'};
 if(mode==='fraction'||mode==='fractionCompare'){
  const den=mode==='fractionCompare'?4+Math.floor(i/4):[4,5,8,10,20][i%5],num=1+i%(den-1);
  if(mode==='fractionCompare')return {kind:'compare',left:[i%3===0?num+1:num,den],right:[i%3===1?num+1:num,den]};
  return {kind:'fraction',den,num,copies:n,task:t===0?'painted':t===1?'denominator':t===3?'unpainted':Math.floor(i/4)%2===0?'percent':'budget',budget:n*den};
 }
 if(mode==='data')return {kind:'chart',values:[n,m,n+2],labels:['Elma','Armut','Muz'],task:(['total','difference','add','pair'] as const)[t],add:3};
 if(mode==='equality')return {kind:'balance',n,m,task:(['unknownAdd','bothAdd','bothDivide','unknownSubtract'] as const)[t]};
 if(mode==='properties')return {kind:'property',n,m,task:(['distribute','commute','associate','factor'] as const)[t]};
 if(mode==='precedence')return {kind:'expression',expression:t===0?expr('+',n,expr('×',3,m)):t===1?expr('×',expr('+',n,3),m):t===2?expr('+',expr('÷',n*m,m),4):expr('+',expr('−',n*2,m),1)};
 if(mode==='pattern')return {kind:'sequence',start:n,change:m,count:4,rule:'add',targetIndex:5};
 if(mode==='algorithm')return t===0?{kind:'flow',input:n,operations:[{op:'+',value:m},{op:'×',value:2}]}:t===1?{kind:'shop',budget:n*m+1,price:m}:t===2?{kind:'flow',input:n*2,operations:[{op:'÷',value:2},{op:'+',value:m}]}:{kind:'walk',a:n,b:m};
 const yellow=n,purple=t===0?(Math.floor(i/4)%3===0?Math.max(1,n-m):Math.floor(i/4)%3===1?n+m:n):t===2?n:m;
 return {kind:'bag',a:yellow,b:purple,names:['Sarı','Mor'],colors:bagColors,task:(['likely','possible','equal','total'] as const)[t]};
}
export function diagramAnswer(d:MathDiagram):number|string|undefined{
 switch(d.kind){
  case 'segment':return d.task==='distance'?d.b-d.a:d.task==='join'?d.a+d.b:d.a/2;
  case 'compass':return d.radius;
  case 'polygon':return d.task==='features'?d.sides:d.task==='stars'?d.sides*(d.stars||0):d.sides*d.edge;
  case 'circle':return d.target==='diameter'?2*d.radius:d.radius;
  case 'number':return Number(d.groups[d.selected])*(d.task==='groupValue'?1000**(d.groups.length-1-d.selected):1);
  case 'place':return Number(d.digits.at(-1-d.selectedFromRight))*10**d.selectedFromRight;
  case 'groups':return d.task==='share'?d.each:d.groups*d.each;
  case 'subtract':return d.whole-d.part;
  case 'combined':return (d.a+d.b)*d.factor;
  case 'rectangle':return d.task==='area'?d.a*d.b:d.task==='perimeter'?2*(d.a+d.b):d.task==='missing'?d.a:(Math.max(d.a,d.b)+1)*Math.min(d.a,d.b);
  case 'fraction':return d.task==='painted'?d.copies*d.num:d.task==='unpainted'?d.copies*(d.den-d.num):d.task==='denominator'?d.den:d.task==='percent'?d.num*100/d.den:d.task==='budget'?(d.budget||0)*d.num/d.den:`${d.num}/${d.den}`;
  case 'compare':{const a=d.left[0]*d.right[1],b=d.right[0]*d.left[1];return a===b?'Eşit':a>b?'Birinci kesir':'İkinci kesir';}
  case 'chart':return d.task==='total'?d.values.reduce((a,b)=>a+b,0):d.task==='difference'?d.values[2]-d.values[0]:d.task==='add'?d.values[1]+(d.add||0):d.task==='pair'?d.values[0]+d.values[1]:d.values[0]===d.values.reduce((a,b)=>a+b,0)?'Doğru':'Yanlış';
  case 'balance':return d.task==='unknownAdd'?d.m:d.task==='bothAdd'?d.n+2*d.m:d.task==='bothDivide'?d.n:d.task==='unknownSubtract'?d.n+d.m:undefined;
  case 'property':return d.task==='distribute'?d.n*(d.m+(d.extra??2)):d.task==='commute'?d.n:d.task==='associate'?d.n*2*d.m:d.n*(d.m+1);
  case 'expression':return evaluate(d.expression);
  case 'sequence':return d.rule==='add'?d.start+((d.targetIndex||d.count+1)-1)*d.change:d.start*d.change**((d.targetIndex||d.count+1)-1);
  case 'flow':return d.operations.reduce((n,o)=>evaluate(expr(o.op,n,o.value)),d.input);
  case 'shop':return Math.floor(d.budget/d.price);
  case 'walk':return d.a+d.b;
  case 'bag':return d.task==='total'?d.a+d.b:d.task==='possible'?'İki renk de çekilebilir':d.task==='equal'?'Eşit olası':d.task==='missingColor'?'İmkânsız':d.a===d.b?'Eşit olası':d.names[d.a>d.b?0:1];
  case 'conditional':return d.test==='even'?(d.input%2===0?d.input/2:d.input+1):d.input>10?d.input-3:d.input+3;
  case 'bus':return Math.ceil(d.people/d.capacity);
 }
}
export function diagramHint(d:MathDiagram):string{
 switch(d.kind){
  case 'segment':return d.task==='distance'?'B noktasının cetvel değerinden A’nın değerini çıkar.':d.task==='join'?'A’dan C’ye giderken AB ve BC uzunluklarını birlikte al.':'Orta nokta, doğru parçasını iki eş uzunluğa ayırır.';
  case 'compass':return 'Pergelin uçları arasındaki açıklık, merkezden çembere olan uzaklıktır.';
  case 'polygon':return d.task==='stars'?'Her köşedeki yıldız sayısı aynı. Köşe sayısıyla çarp.':'Sınırdaki bütün eş kenarları topla; kenar sayısı ile bir kenarı çarpabilirsin.';
  case 'circle':return 'Çap merkezden geçer ve yan yana iki yarıçaptan oluşur.';
  case 'number':return d.task==='group'?'Sağdan üçerli bölükleri izle; milyonlar bölüğünü seç.':'Seçilen bölükteki sayıyı o bölüğün birim değeriyle çarp.';
  case 'place':return 'Rakamın sağındaki basamakları say. Rakamı basamağın birimiyle çarp.';
  case 'groups':return d.task==='share'?'Toplam kitabı eş raf sayısına böl.':'Her kutudaki miktar aynı; kutu sayısıyla çarp.';
  case 'subtract':return 'Başlangıçtaki miktardan ayrılan miktarı çıkar.';
  case 'combined':return 'Önce iki öğrenci grubunu birleştir; sonra kişi başına kart sayısıyla çarp.';
  case 'rectangle':return d.task==='perimeter'?'Çerçevenin dört kenarını takip et. Karşılıklı kenarlar eşittir.':d.task==='missing'?'Alanı bilinen kenara böl; diğer kenarı bul.':d.task==='extend'?'Uzatılan kenara 1 ekle; yeni kenarları çarp.':'Birim kareler satır ve sütun oluşturur; iki kenarı çarp.';
  case 'fraction':return d.task==='painted'?'Bir bütündeki boyalı parça sayısını bütün sayısıyla çarp.':d.task==='unpainted'?'Bir bütünde boyasız parçaları bul; bütün sayısıyla çarp.':d.task==='denominator'?'Payda, bir bütünün eş parça sayısıdır; yalnız boyalıları sayma.':d.task==='budget'?'Önce bütçeyi eş parçalara böl; sonra seçilen parça sayısını al.':'Bir bütün yüzde 100’dür; payı paydaya bölüp 100 ile çarp.';
  case 'compare':return d.left[1]===d.right[1]?'Bütünler ve parça büyüklükleri eşit. Boyalı parça sayılarını karşılaştır.':'Bütünler aynı büyüklükte. Parça büyüklüğünü ve boyalı miktarı birlikte incele.';
  case 'chart':return d.task==='difference'?'Muz sütunu ile elma sütununun yükseklik farkını bul.':d.task==='add'?'Armutun mevcut oyuna yeni oyları ekle.':d.task==='pair'?'Yalnız elma ve armut oylarını birleştir.':'Her kategorideki kişi sayısını bir kez topla.';
  case 'balance':return d.task==='unknownAdd'?'Sağdaki değerden bilinen toplananı çıkar.':d.task==='unknownSubtract'?'Çıkarılan miktarı sağdaki değere geri ekle.':'Aynı işlemi iki tarafta da uygula; dengedeki değerleri izle.';
  case 'property':return d.task==='commute'?'Çarpanlar yer değiştiriyor; eksik çarpanı ilk işlemden bul.':d.task==='associate'?'Çarpanlar aynı kalır; yalnız hangi grubun önce hesaplandığı değişir.':'Renkli parçaların her birini ayrı hesaplayıp birleştir.';
  case 'expression':return 'Önce parantez; sonra çarpma/bölme; sonra toplama/çıkarma. Aynı öncelikte soldan sağa.';
  case 'sequence':return 'Ardışık iki terim arasındaki artışı bul; aynı kuralı bir sonraki adıma uygula.';
  case 'flow':return 'Robotun oklarını sırayla izle; bir adımın çıktısı sonraki adımın girdisidir.';
  case 'shop':return 'Bütçeyi bir defterin fiyatına böl; yalnız tam defterleri say.';
  case 'walk':return 'İki hareket aynı yönde. Adım sayılarını birleştir.';
  case 'bag':return d.task==='total'?'İki renk grubundaki taş sayılarını birleştir.':d.task==='possible'?'Torbada hangi renklerden en az bir taş bulunduğuna bak.':'Aynı özellikteki taşlarda renk sayılarını karşılaştır; daha olası olmak kesin olmak değildir.';
  default:return 'Verilenleri sahnedeki sırayla izle.';
 }
}
