import {scienceQuestionById,scienceQuestions,type ScienceQuestion} from './science-question-bank.ts';
import {sciencePlanById} from './science-plans.ts';
import {readJourney,type JourneyProgress} from './math-journey-progress.ts';
export const scienceJourneyKey='eylunica-science-journey-v1';
export type ScienceSession={id:string;topicId:string;purpose:'practice'|'test';questionIds:string[];answers:Record<string,string>;hinted:string[];index:number};
export type ScienceProgress=JourneyProgress&{used:string[];sessions:Record<string,ScienceSession>};
export function readScienceProgress(raw:string|null):ScienceProgress{
 const value:ScienceProgress={...readJourney(raw),used:[],sessions:{}};
 try{
  const p=JSON.parse(raw||'null');
  if(!p||p.version!==1)return value;
  value.used=Array.isArray(p.used)?[...new Set<string>(p.used.filter((id:unknown):id is string=>typeof id==='string'&&scienceQuestionById.has(id)))]:[];
  for(const [key,s] of Object.entries(p.sessions||{}) as [string,ScienceSession][]){
   if(!s||!sciencePlanById.has(s.topicId)||!['practice','test'].includes(s.purpose)||key!==`${s.purpose}:${s.topicId}`||typeof s.id!=='string'||!Array.isArray(s.questionIds)||!s.questionIds.length||new Set(s.questionIds).size!==s.questionIds.length||!s.questionIds.every(id=>{const q=scienceQuestionById.get(id);return q?.purpose===s.purpose&&q.topicId===s.topicId;})||!s.answers||typeof s.answers!=='object'||!Number.isInteger(s.index)||s.index<0||s.index>=s.questionIds.length)continue;
   value.sessions[key]={...s,answers:Object.fromEntries(Object.entries(s.answers).filter(([id,a])=>s.questionIds.includes(id)&&typeof a==='string')),hinted:Array.isArray(s.hinted)?s.hinted.filter(id=>s.questionIds.includes(id)):[]};
  }
 }catch{}return value;
}
export function newScienceSession(topicId:string,purpose:'practice'|'test',used:string[],now=Date.now()):ScienceSession|null{
 const exclude=new Set(used);
 const pool=scienceQuestions.filter(q=>q.topicId===topicId&&q.purpose===purpose&&!exclude.has(q.id));
 const count=purpose==='test'?20:Math.min(8,pool.length);
 if(!count||pool.length<count)return null;
 // Reproducible local order: not all statements followed by all applications.
 let state=(now>>>0)||1;for(let i=pool.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}
 return {id:`science-${now}-${topicId}-${purpose}`,topicId,purpose,questionIds:pool.slice(0,count).map(q=>q.id),answers:{},hinted:[],index:0};
}
export function preserveScienceAttempts(state:ScienceProgress,legacyQuestionIds:string[]):ScienceProgress{
 const old=new Set(legacyQuestionIds);
 return {...state,used:[...new Set([...state.used,...scienceQuestions.filter(q=>q.legacyId&&old.has(q.legacyId)).map(q=>q.id)])]};
}
export function readScienceWithLegacy(rawScience:string|null,rawLearning:string|null):ScienceProgress{
 const current=readScienceProgress(rawScience);
 try{const old=JSON.parse(rawLearning||'null');return preserveScienceAttempts(current,Array.isArray(old?.attempts)?old.attempts.map((a:{questionId?:string})=>a?.questionId).filter((id:unknown):id is string=>typeof id==='string'):[]);}catch{return current;}
}
/** Completing the correction path clears the stop, without inventing a higher grade. */
export function completeScienceReview(state:ScienceProgress,topicId:string):ScienceProgress{
 const session=state.sessions[`test:${topicId}`],old=state.topics[topicId];
 if(!old||!session||session.questionIds.length!==20||!session.questionIds.every(id=>Object.hasOwn(session.answers,id)))return state;
 return {...state,topics:{...state.topics,[topicId]:{...old,test:true}}};
}
export function scienceWrittenQuestions(topicIds:string[],used:string[],count:number):ScienceQuestion[]{
 const allowed=new Set(topicIds),excluded=new Set(used),buckets=new Map<string,ScienceQuestion[]>();
 for(const q of scienceQuestions)if(q.purpose==='written'&&allowed.has(q.topicId)&&!excluded.has(q.id)){const rows=buckets.get(q.topicId)||[];rows.push(q);buckets.set(q.topicId,rows);}
 const rows:ScienceQuestion[]=[];for(let round=0;rows.length<count;round++){let added=false;for(const bucket of buckets.values()){if(bucket[round]&&rows.length<count){rows.push(bucket[round]);added=true;}}if(!added)break;}return rows;
}
