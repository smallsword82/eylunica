import { youtubeRequest } from './youtube.mjs';
import { newest, applyPublicationPolicy } from './research.mjs';
import { publicationRejection } from '../../src/grade5/video-policy.ts';
import { restoreQuotaSchedule, researchPauseUntil, recordResearchFailure } from './scheduling.mjs';
const normalize = text => text.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^\p{L}\p{N}]+/gu,' ');
const stop = new Set('ve ile bir bu konu tema unite sinif dersi the and of to in at for der die das und im den dem sich'.split(' '));
export const tokens = text => [...new Set(normalize(text).split(' ').filter(t=>t.length>2&&!stop.has(t)))];
export function matchVideo(video,topic) {
 const grades=[...video.title.matchAll(/\b(\d{1,2})\s*\.?\s*s[ıi]n[ıi]f/gi)].map(m=>Number(m[1]));
 if(grades.length&&!grades.includes(5))return {eligible:false,score:0,reason:'Başlıkta başka sınıf belirtiliyor.'};
 const words=tokens(topic.title),content=new Set(tokens(video.title+' '+(video.description||'')));
 const hits=words.filter(w=>content.has(w)).length;
 return {eligible:words.length>0&&hits>=Math.min(2,words.length),score:Math.round(hits/Math.max(1,words.length)*100),reason:grades.includes(5)?'Konu sözcükleri eşleşti; içerik incelemesi gerekli.':'Konu sözcükleri eşleşti; başlıkta 5. sınıf doğrulanmadı.'};
}
export function researchGroups(topics,courses) {
 const grouped=courses.map(c=>{
  const all=topics.filter(t=>t.courseId===c.id),groups=[];
  for(let i=0;i<all.length;i+=6)groups.push({course:c,topics:all.slice(i,i+6)});
  return groups;
 });
 const output=[];
 for(let index=0;grouped.some(g=>g[index]);index++)for(const groups of grouped)if(groups[index])output.push(groups[index]);
 return output;
}
export async function researchAll({state,topics,courses,key,fetcher=fetch,now=()=>new Date(),onProgress=async()=>{},paceMs=0}) {
 if(!key)throw Error('YOUTUBE_API_KEY henüz çalışma ortamında tanımlı değil.');
 const next=restoreQuotaSchedule(applyPublicationPolicy(state),now());
 if(next.research?.pausedByUser){await onProgress(next);return next;}
 if(researchPauseUntil(next,now())){await onProgress(next);return next;}
 next.batchQueries ||= {};next.topicScans ||= {};next.videoMetadata ||= {};
 let lastRequest=0;
 const request=async(resource,params)=>{const delay=paceMs-(Date.now()-lastRequest);if(delay>0)await new Promise(resolve=>setTimeout(resolve,delay));lastRequest=Date.now();return youtubeRequest(key,fetcher,resource,params);};
 const priorities=['course-0','course-1','course-2','course-3','course-4','course-5','course-6','course-7','course-8','course-9','course-10','meb-course-35'];
 courses=[...courses].sort((a,b)=>(priorities.includes(a.id)?priorities.indexOf(a.id):100)-(priorities.includes(b.id)?priorities.indexOf(b.id):100));
 const groups=researchGroups(topics,courses);
 const scanned={ '2026-2027':new Set(Object.keys(next.topicScans)), '2025-2026':new Set() };
 for(const cache of Object.keys(next.batchQueries)) { try { const [year,,ids]=JSON.parse(cache); if(scanned[year]&&Array.isArray(ids))for(const id of ids)scanned[year].add(id); }catch{} }
 const active=id=>next.videos.filter(v=>v.topicId===id&&v.status!=='rejected'&&!publicationRejection(v));
 const covered=course=>topics.filter(t=>t.courseId===course.id).some(t=>active(t.id).length>0);

 next.research={status:'running',totalTopics:topics.length,completedTopics:0,startedAt:now().toISOString(),updatedAt:now().toISOString()};
 const update=async()=>{
  next.research.completedTopics=topics.filter(t=>active(t.id).length>0||next.topicScans[t.id]).length;
  next.research.updatedAt=now().toISOString();next.videos.sort(newest);await onProgress(next);
 };
 await update();
 for(const mode of ['coverage','topics']) {
 for(const [year,after] of [['2026-2027','2026-01-01T00:00:00Z'],['2025-2026','2025-01-01T00:00:00Z']]) {
  const work=mode==='coverage'?courses.map(course=>({course,topics:topics.filter(t=>t.courseId===course.id)})):groups;
  for(const original of work) {
   if(!original.topics.length)continue;
   if(mode==='coverage'&&covered(original.course))continue;
   const missing=original.topics.filter(t=>!active(t.id).length && (mode==='coverage'||!scanned[year].has(t.id)));
   if(!missing.length)continue;
   const group={...original,topics:missing};
   const subject=group.course.name.replace('Çoklu Yabancı Dil Eğitim Modeli ','').replace(/Yaşayan Dil ve Lehçeler \((.+)\)/,'$1').replace(/[\"“”…]/g,'').replace(/\.{2,}/g,'').trim();
   const terms=group.topics.map(t=>tokens(t.title).slice(0,4).join(' ')).filter(Boolean);
   const q=mode==='coverage'?`5. sınıf ${subject}`:`5. sınıf ${subject} ${terms.join(' | ')}`;
   const cacheKey=JSON.stringify([year,group.course.id,mode==='coverage'?[]:group.topics.map(t=>t.id),mode]);
   if(next.batchQueries[cacheKey])continue;
   try {
    const found=await request('search',{part:'snippet',type:'video',q,order:'date',safeSearch:'strict',relevanceLanguage:'tr',maxResults:'50',publishedBefore:year==='2025-2026'?'2026-01-01T00:00:00Z':now().toISOString(),...(after?{publishedAfter:after}:{})});
    const ids=[...new Set((found.items||[]).map(v=>v.id?.videoId).filter(id=>/^[\w-]{11}$/.test(id||'')))];
    const unknown=ids.filter(id=>now().getTime()-Date.parse(next.videoMetadata[id]?.fetchedAt||'')>=86400000||!next.videoMetadata[id]);
    if(unknown.length){
     const details=await request('videos',{part:'snippet,contentDetails,status',id:unknown.join(',')});
     for(const v of details.items||[])if(unknown.includes(v.id)&&v.status?.embeddable&&v.status.privacyStatus==='public')next.videoMetadata[v.id]={id:v.id,title:v.snippet?.title||'',description:v.snippet?.description||'',channel:v.snippet?.channelTitle||null,publishedAt:Number.isFinite(Date.parse(v.snippet?.publishedAt))?v.snippet.publishedAt.slice(0,10):null,duration:v.contentDetails?.duration||null,fetchedAt:now().toISOString()};
    }
    let processedSinceSave=0;
    for(const topic of group.topics){
     for(const id of ids){
      const video=next.videoMetadata[id];if(!video||publicationRejection({...video,metadataStatus:'api-provided',metadataSource:'YouTube Data API v3'}))continue;
      const match=matchVideo(video,topic),identity=topic.id+':'+id;
      if(!match.eligible)continue;
      const existing=next.videos.find(v=>v.identity===identity);
      if(existing){ Object.assign(existing,{title:video.title,channel:video.channel,publishedAt:video.publishedAt,duration:video.duration,fetchedAt:video.fetchedAt,metadataSource:'YouTube Data API v3',metadataStatus:'api-provided'}); if(existing.rejectionReason==='publication-date-unverified'){existing.status='pending';delete existing.rejectionReason;} continue; }
      const {description,...metadata}=video;
      next.videos.push({...metadata,identity,url:'https://www.youtube.com/watch?v='+id,topicId:topic.id,topicTitle:topic.title,unit:topic.unit,course:group.course.name,model:group.course.model,status:'pending',method:'youtube-api-batch',query:q,metadataSource:'YouTube Data API v3',metadataStatus:'api-provided',matchScore:match.score,matchNote:match.reason,addedAt:now().toISOString()});
     }
     if(mode==='topics'){scanned[year].add(topic.id);if(year==='2026-2027')next.topicScans[topic.id]=now().toISOString();}
     processedSinceSave++;if(processedSinceSave>=50){await update();processedSinceSave=0;}
    }
    next.batchQueries[cacheKey]=now().toISOString();next.rateLimitErrors=0;await update();
   }catch(error){
    recordResearchFailure(next,error,now());
    await update();return next;
   }
  }
 }
 } // coverage before missing-topic searches; alternatives are a separate phase.
 next.research.status='complete';next.research.retryAfter=new Date(now().getTime()+86400000).toISOString();await update();return next;
}

export function researchReport(state, topics) {
 const active=state.videos.filter(v=>v.status!=='rejected'&&!publicationRejection(v));
 const videos=[...new Map(active.map(v=>[v.id,v])).values()];
 const first=new Set(),fallback=new Set();
 for(const key of Object.keys(state.batchQueries||{})){
  let query;try{query=JSON.parse(key);}catch{continue;}
  const [year,,ids]=query;if(!Array.isArray(ids))continue;for(const id of ids)(year==='2026-2027'?first:fallback).add(id);
 }
 const count=id=>active.filter(v=>v.topicId===id).length;
 const finished=topics.filter(t=>count(t.id)>=1||(first.has(t.id)&&fallback.has(t.id)));
 const coursesWithCandidates=new Set(active.map(v=>v.course).filter(Boolean));
 return { coursesWithCandidates:coursesWithCandidates.size,videos2026:videos.filter(v=>v.publishedAt.startsWith('2026-')).length,videos2025:videos.filter(v=>v.publishedAt.startsWith('2025-')).length,uniqueCandidates:videos.length,approvedVideos:new Set(active.filter(v=>v.status==='approved').map(v=>v.id)).size,totalTopics:topics.length,fullySearchedTopics:finished.length,topicsWithoutCandidates:finished.filter(t=>count(t.id)===0).length,topicsAwaitingSearch:topics.length-finished.length,rejectedByDatePolicy:state.videos.filter(v=>v.rejectionReason?.startsWith('publication-')||v.rejectionReason==='published-before-2025').length };
}
