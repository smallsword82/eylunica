import {expect,it} from 'vitest';
import {mathJourneyQuestions,journeyPool,freshJourneyQuestions} from './math-journey-bank';
import {topics,questionById} from './catalog';
import {graduated,readJourney} from './math-journey-progress';
it('provides three disjoint sets with valid figures and stable registered IDs for every math topic',()=>{
 const seen=new Set<string>();
 for(const topic of topics.filter(t=>t.courseId==='course-1')){
  const prompts=new Set<string>();
  for(const [purpose,count] of [['practice',40],['test',80],['written',80]] as const){
   const pool=journeyPool(topic.id,purpose);expect(pool).toHaveLength(count);
   for(const q of pool){expect(seen.has(q.id)).toBe(false);seen.add(q.id);expect(prompts.has(q.prompt)).toBe(false);prompts.add(q.prompt);expect(questionById.has(q.id)).toBe(true);expect(q.figure.values.every(Number.isFinite)).toBe(true);expect(q.answer).not.toBe('NaN');if(q.choices)expect(q.choices).toContain(q.answer);}
  }
 }
 expect(mathJourneyQuestions).toHaveLength(4000);
});
it('never reuses an answered question or a repeated prompt under a curriculum alias',()=>{
 const first=freshJourneyQuestions('topic-735059132b26c64d','test',[],20);
 const used=first.map(q=>q.id);
 const second=freshJourneyQuestions('topic-a606b079db4e39a1','test',used,20);
 expect(second).toHaveLength(20);
 expect(second.some(q=>first.some(old=>old.prompt===q.prompt))).toBe(false);
 const all=journeyPool('topic-a0155915387c7658','test');
 expect(freshJourneyQuestions('topic-a0155915387c7658','test',all.map(q=>q.id),20)).toEqual([]);
});
it('checks rectangle computations and keeps the missing side hidden',()=>{
 for(const q of journeyPool('topic-9087112a70441c7a','written')){
  const [a,b]=q.figure.values,variant=(Number(q.id.split('-').at(-1))-1)%4;
  const expected=variant===0?a*b:variant===1?2*(a+b):variant===2?a:(Math.max(a,b)+1)*Math.min(a,b);
  expect(Number(q.answer)).toBe(expected);
  if(variant===2)expect(q.figure.labels?.[0]).toBe('?');
 }
});
it('uses the actual single digit for a thousands-place question',()=>{
 const rows=mathJourneyQuestions.filter(q=>q.prompt.includes('sayısının binler basamağındaki'));
 expect(rows.length).toBeGreaterThan(0);
 for(const q of rows)expect(Number(q.answer)).toBe(Number(q.prompt.match(/^([1-9])/)![1])*1000);
});
it('requires all three stages for graduation and safely reads progress',()=>{
 const p=readJourney(JSON.stringify({version:1,topics:{a:{lesson:false,practice:false,test:true,bestScore:100}}}));
 expect(graduated(['a'],p)).toBe(false);p.topics.a.lesson=true;p.topics.a.practice=true;expect(graduated(['a'],p)).toBe(true);
 expect(graduated([],p)).toBe(false);expect(readJourney('broken')).toEqual({version:1,topics:{}});
});
