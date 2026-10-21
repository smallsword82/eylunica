import {expect,it} from 'vitest';
import {mathJourneyQuestions,journeyPool,freshJourneyQuestions,questionSignature} from './math-journey-bank';
import {topics,questionById} from './catalog';
import {graduated,readJourney} from './math-journey-progress';
it('provides three disjoint sets with valid figures and stable registered IDs for every math topic',()=>{
 const seen=new Set<string>();
 for(const topic of topics.filter(t=>t.courseId==='course-1')){
  const prompts=new Set<string>();
  for(const [purpose,count] of [['practice',40],['test',80],['written',80]] as const){
   const pool=journeyPool(topic.id,purpose);expect(pool).toHaveLength(count);
   for(const q of pool){expect(seen.has(q.id)).toBe(false);seen.add(q.id);expect(prompts.has(questionSignature(q))).toBe(false);prompts.add(questionSignature(q));expect(questionById.has(q.id)).toBe(true);expect(q.figure.values.every(Number.isFinite)).toBe(true);expect(q.answer).not.toBe('NaN');if(q.choices)expect(q.choices).toContain(q.answer);}
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

it('angle tasks use readable increments, correct alternatives and task-specific hints',()=>{
 const rows=mathJourneyQuestions.filter(q=>q.topicId==='topic-a0155915387c7658');
 for(const q of rows){const m=q.figure.angle!;expect(m).toBeTruthy();expect(q.id).toContain('-v2-');expect(q.choices).toHaveLength(4);expect(new Set(q.choices).size).toBe(4);expect(m.start%5).toBe(0);expect(m.end%5).toBe(0);expect(m.end).toBeGreaterThan(m.start);expect(m.end).toBeLessThanOrEqual(180);
  if(m.task==='classify'){expect(q.answer).toBe(m.end<90?'Dar açı':m.end===90?'Dik açı':m.end<180?'Geniş açı':'Doğru açı');}
  else {const expected=m.task==='missing'?m.total!-m.known!:m.end-m.start;expect(q.answer).toBe(`${expected}°`);}
 }
 const first=freshJourneyQuestions('topic-a0155915387c7658','practice',[],8);expect(first[0].answer).toBe('30°');expect(first[0].prompt).not.toContain('30°');expect(new Set(first.map(q=>q.hints[0])).size).toBe(4);
 for(let family=0;family<4;family++)expect(new Set(rows.filter(q=>q.taskFamily===family).map(q=>q.choices!.indexOf(q.answer))).size).toBeGreaterThan(2);
});

it('historical angle IDs stay readable while new sessions only select the revised tasks',async()=>{
 const {legacyAngleQuestions}=await import('./math-journey-bank');expect(legacyAngleQuestions).toHaveLength(200);
 for(const old of legacyAngleQuestions){expect(questionById.get(old.id)?.answer).toBe(old.answer);expect(mathJourneyQuestions.some(q=>q.id===old.id)).toBe(false);}
});
