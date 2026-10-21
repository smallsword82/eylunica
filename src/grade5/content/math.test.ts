import { describe, expect, it } from 'vitest';
import { mathLessons } from './math';

const question = (lesson: number, ordinal: number) => mathLessons[lesson].questions[ordinal - 1];
const repeat = (initial: number, iterations: number, transform: (value: number) => number) => {
 let value = initial;
 for (let i = 0; i < iterations; i++) value = transform(value);
 return value;
};

describe('matematik içeriğinin sayısal doğruluğu', () => {
 it('her tam sayılı cevabı sorudaki verilenlerden bağımsız hesapla denetler', () => {
  // null entries are verbal, comparison-sign, fraction or percentage answers.
  // Every purely integer answer in the authored pack must have a calculation.
  const expected: (number | null)[][] = [
   [null,null,null,9-2,4,null,90,3+5,10/2,null],
   [null,90,null,null,180-48,90-35,null,72,360-90-120,180/3],
   [null,5,null,2*7,18/2,8,null,6,null,3*5],
   [2e6+5e3+8,null,Math.floor(38241605/1e6),Math.floor(6708012/1e3)%1000,null,900e3+3,String(70508200).length,1e9+2e6,null,999999+1],
   [Math.floor(624508/1e4)%10*1e4,Math.floor(3706214/1e5)%10*1e5,900000+4000+60+5,null,8000/8,Math.floor(4050006/1e4)%10,null,3e6+8e4+400+2,100,700000-70],
   [348+175,920-386,7*18,216/9,12*16-145,Math.ceil(73/20),null,3*14+2*26,240-65,100-480/5],
   [2*(8+3),7*4,null,null,40/2-12,48/6,(5+2)*9,2*(11+7)-2,null,2*(2*6+10)],
   [8,null,10/2,null,null,null,null,null,3*100/5,null],
   [null,null,null,null,null,null,null,null,null,null],
   [null,8+11+6,null,14-7,null,6*2,null,24-9-8,null,(24-6)/2],
   [null,20-10,null,4*5,null,null,13+8+9,null,null,18+12],
   [24-9,17+8,36/4,7*5,null,6+8-5,null,(20-2)/3,12,(45-10)/5],
   [8,4,null,7*(10+2),9*(20-1),null,(18+32)+47,125*8*3,null,12*(24+6)],
   [6+4*3,(6+4)*3,24/6*2,18-7+2,null,40-18/3,null,3*(14-6)+5,60/(2*5)+7,50-2*(9+6)+4],
   [15+4,28-6,18*3,null,2+4*5,null,4+5*3,(26-8)/2+1,10+5,[5,7,9,11].reduce((sum,n)=>sum+n,0)],
   [(7+5)*2,(20-4)/4,null,null,repeat(3,3,n=>n+2),8*3+1,19-6,null,(4+3)*5-(4*5+3),(10-4)/3],
   [15-3,10+3,18/2,7+1,null,repeat(2,3,n=>n*2),(17-1)/4,null,(28+8)/4,repeat(20,3,n=>n-5)],
   [null,1,0,null,null,null,null,null,null,null],
   [null,7-3,null,null,5-3,null,null,8-3,null,9+1-4],
  ];
  let checked = 0;
  for (let index=0;index<mathLessons.length;index++) {
   expect(expected[index]).toHaveLength(mathLessons[index].questions.length);
   for(let ordinal=1;ordinal<=10;ordinal++) {
    const item=question(index,ordinal), value=expected[index][ordinal-1];
    const numeric=/^\d[\d\s]*$/.test(item.answer);
    expect(value!==null, item.id+' sayısal denetim kapsamı').toBe(numeric);
    if(value!==null) {expect(Number(item.answer.replace(/\s/g,'')),item.prompt).toBe(value);checked++;}
   }
  }
  expect(checked).toBeGreaterThan(110);
 });

 it('kesir karşılaştırmalarını ve yüzde dönüşümlerini miktar modeliyle denetler', () => {
  const fraction=(value:string)=>{const [a,b]=value.split('/').map(Number);return a/b;};
  expect(fraction(question(7,2).answer)).toBe(5/12);
  expect(fraction(question(7,4).answer)).toBe(0.7);
  expect(Number(question(7,7).answer.slice(1))/100).toBe(3/4);
  expect(fraction(question(7,8).answer)).toBe(2/5);
  const comparisons:[[number,number],number][]=[[[3/4,5/8],3],[[2/3,4/6],4],[[0.6,1/2],7],[[7/10,2/3],9]];
  for(const [[left,right],ordinal]of comparisons)expect(question(8,ordinal).answer).toBe(left>right?'>':left<right?'<':'=');
  const choicePairs:[number,string[]][]=[[1,['3/7','5/7']],[2,['2/5','2/9']]];
  for(const [ordinal,choices]of choicePairs)expect(question(8,ordinal).answer).toBe(choices.sort((a,b)=>fraction(b)-fraction(a))[0]);
 });

 it('alanı sabit dikdörtgenler arasında en küçük çevreyi seçer', () => {
  const item=question(6,9);
  const dimensions=item.choices!.map(label=>({label,sides:label.split(' × ').map(value=>Number.parseInt(value,10))}));
  for(const {sides:[a,b]}of dimensions)expect(a*b).toBe(36);
  const smallest=dimensions.sort((a,b)=>a.sides.reduce((x,y)=>x+y)-b.sides.reduce((x,y)=>x+y))[0];
  expect(item.answer).toBe(smallest.label);
  expect(2*(6+10)*2-2*10).toBe(Number(question(6,10).answer));
 });

 it('çözümlü örneklerdeki sayısal sonuçları işlem modeline göre kontrol eder', () => {
  const results:[number,number[]][]=[
   [1,[180-65]],[2,[4]],[3,[306e6+42e3+7]],[4,[3e5,200]],
   [5,[8*24-57]],[6,[30/2-9,9*(30/2-9)]],[7,[6,8,3,4,75]],
   [9,[9+6+5]],[11,[19-7]],[12,[25*16]],[13,[30-4*(2+3)]],
   [14,[6+7*5]],[15,[(5*2+6)/4]],[16,[13+1,8/2]],[18,[5-2]],
  ];
  for(const [index,numbers]of results)for(const number of numbers)
   expect(mathLessons[index].workedExample.answer.replace(/\s/g,''),mathLessons[index].topicId).toContain(String(number));
 });
});
