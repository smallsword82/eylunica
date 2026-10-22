import {describe,it,expect} from 'vitest';
import official from './official-curriculum.json';
import {matchesTerm} from './terms';
import {sciencePlans,scienceTeachingFigure,scienceLessonById} from './science-plans';
import {scienceQuestions,scienceQuestionById} from './science-question-bank';
import {readScienceProgress,readScienceWithLegacy,completeScienceReview,preserveScienceAttempts,newScienceSession,scienceWrittenQuestions} from './science-journey-progress';
import {questionById} from './catalog';
import {availableExamQuestions,createExam,readExams,completeExam,scoreExam} from './exams';
import {isCorrect} from './engine';

describe('first-term science learning catalog',()=>{
 it('covers exactly the nine preserved first-term topic records, including the topic spanning both terms',()=>{
  const first=official.topics.filter(t=>t.courseId==='course-2'&&matchesTerm(t,'first'));
  expect(sciencePlans.map(p=>p.id).sort()).toEqual(first.map(t=>t.id).sort());
  expect(first).toHaveLength(9);
  for(const plan of sciencePlans){expect(scienceLessonById.get(plan.id)?.sections.length).toBeGreaterThan(0);expect(plan.choices).toContain(plan.answer);}
 });
 it('has eight touch-only practice items, twenty mixed test items and ten separate written items for each topic',()=>{
  expect(scienceQuestions).toHaveLength(342);
  expect(new Set(scienceQuestions.map(q=>q.id)).size).toBe(342);
  const revised=scienceQuestionById.get('sj-practice-sun-3')!;expect(revised.sourceReview).toBeTruthy();expect(revised.choices).not.toContain('Küp biçiminde olduğu için');
  expect(new Set(scienceQuestions.map(q=>q.prompt.trim().toLocaleLowerCase('tr'))).size).toBe(342);
  for(const plan of sciencePlans){
   const rows=scienceQuestions.filter(q=>q.topicId===plan.id);
   expect(rows.filter(q=>q.purpose==='practice')).toHaveLength(8);
   expect(rows.filter(q=>q.purpose==='test'&&q.kind==='boolean')).toHaveLength(10);
   expect(rows.filter(q=>q.purpose==='test'&&q.kind==='choice')).toHaveLength(10);
   expect(rows.filter(q=>q.purpose==='written')).toHaveLength(10);
   for(const q of rows){expect(q.choices?.length).toBeGreaterThanOrEqual(2);expect(q.choices?.filter(c=>isCorrect(q,c))).toHaveLength(1);expect(q.choices?.length).toBe(new Set(q.choices?.map(c=>c.toLocaleLowerCase('tr'))).size);expect(q.explanation.length).toBeGreaterThan(10);expect(questionById.get(q.id)).toBe(q);expect(q.figure.kind).toBe(plan.kind);}
  }
 });
 it('maps the teaching model to the actual six-kilogram bag and measured 20/60 cm friction example',()=>{
  const mass=sciencePlans.find(p=>p.kind==='mass')!,friction=sciencePlans.find(p=>p.kind==='friction')!,force=sciencePlans.find(p=>p.kind==='force')!;
  expect(scienceTeachingFigure(mass,'example',1).values?.[0]).toBe(6);
  expect(scienceTeachingFigure(friction,'example',1)).toMatchObject({variant:'measured',values:[20,60]});
  expect(scienceTeachingFigure(force,'example',1).values).toEqual([6,2,10,5]);
  const cell=sciencePlans.find(p=>p.kind==='cell')!;expect(scienceTeachingFigure(cell,'explain',3).variant).toBe('levels');
 });
 it('keeps old answered questions excluded without resetting new science progress',()=>{
  const p=readScienceProgress(null),plan=sciencePlans[0];p.topics[plan.id]={lesson:true,practice:false,test:false,bestScore:35};
  const old=scienceQuestions.filter(q=>q.topicId===plan.id&&q.legacyId).slice(0,2);
  const next=preserveScienceAttempts(p,old.map(q=>q.legacyId!));
  expect(next.topics).toEqual(p.topics);expect(p.used).toEqual([]);
  const session=newScienceSession(plan.id,'practice',next.used,7)!;
  expect(session.questionIds).toHaveLength(6);for(const q of old)expect(session.questionIds).not.toContain(q.id);
  expect(newScienceSession(plan.id,'test',scienceQuestions.filter(q=>q.topicId===plan.id&&q.purpose==='test').map(q=>q.id))).toBeNull();
 });
 it('restores sessions and answers while discarding only malformed session entries',()=>{
  const p=readScienceProgress(null),session=newScienceSession(sciencePlans[2].id,'test',[],9)!;
  session.answers[session.questionIds[0]]='Yanlış';session.index=1;
  p.sessions[`test:${session.topicId}`]=session;p.used=[session.questionIds[0]];
  expect(readScienceProgress(JSON.stringify(p))).toEqual(p);
  const invalid=structuredClone(p);invalid.sessions[`test:${session.topicId}`].questionIds[0]='unknown';
  expect(readScienceProgress(JSON.stringify(invalid)).sessions).toEqual({});
  expect(readScienceWithLegacy(JSON.stringify(p),'malformed-old-json')).toEqual(p);
 });
 it('selects a balanced disjoint written set and preserves its grade across a saved draft',()=>{
  const ids=sciencePlans.map(p=>p.id),pool=scienceWrittenQuestions(ids,[],20);
  expect(pool).toHaveLength(20);expect(new Set(pool.map(q=>q.topicId)).size).toBe(9);
  for(const q of pool)expect(q.purpose).toBe('written');
  const units=[...new Set(official.topics.filter(t=>ids.includes(t.id)).map(t=>t.unit))];
  const draft=createExam({courseId:'course-2',units,count:10,seed:3,term:'first'},1,pool);
  draft.questionIds.forEach((id,i)=>draft.answers[id]=i<7?scienceQuestionById.get(id)!.answer:i<9?'Yanlış yanıt':'');
  const stored=readExams(JSON.stringify({version:1,drafts:{'course-2':draft},history:[]}));
  expect(stored.drafts['course-2']).toEqual(draft);
  expect(scoreExam(draft)).toMatchObject({correct:7,wrong:2,blank:1,score:70});
  expect(completeExam(stored,draft,2).history).toHaveLength(1);
  const eligible=availableExamQuestions('course-2',units);
  expect(eligible.some(q=>q.id.startsWith('sj-practice-')||q.id.startsWith('sj-test-'))).toBe(false);
 });
 it('lets a child finish corrections after a low test grade without repeating questions or changing the grade',()=>{
  const state=readScienceProgress(null),id=sciencePlans[0].id,session=newScienceSession(id,'test',[],7)!;
  state.topics[id]={lesson:true,practice:true,test:false,bestScore:40};
  expect(completeScienceReview(state,id)).toBe(state);
  session.questionIds.forEach(qid=>session.answers[qid]='Yanlış');session.index=19;state.sessions[`test:${id}`]=session;
  const reviewed=completeScienceReview(state,id);
  expect(reviewed.topics[id]).toMatchObject({test:true,bestScore:40});expect(state.topics[id].test).toBe(false);
  expect(reviewed.sessions[`test:${id}`].answers).toEqual(session.answers);
 });

});
