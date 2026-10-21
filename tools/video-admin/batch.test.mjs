import test from 'node:test';import assert from 'node:assert/strict';
import { researchGroups,matchVideo,researchAll,researchReport } from './batch.mjs';
const courses=[{id:'math',name:'Matematik',model:'standard'},{id:'science',name:'Fen Bilimleri',model:'standard'}];
const topics=[{id:'number',courseId:'math',title:'Basamak değeri',unit:'Sayılar'},{id:'sun',courseId:'science',title:'Güneş yapısı',unit:'Gökyüzü'}];
test('bütün konular aynı dersin sorgularına tam bir kez alınır ve dersler sırayla taranır',()=>{const all=Array.from({length:15},(_,i)=>({id:String(i),courseId:i<8?'math':'science'}));const groups=researchGroups(all,courses);assert.equal(new Set(groups.flatMap(g=>g.topics.map(t=>t.id))).size,15);assert.ok(groups.every(g=>g.topics.length<=6&&g.topics.every(t=>t.courseId===g.course.id)));assert.equal(groups[1].course.id,'science');});
test('başka sınıfın videosu elenir, konu eşleşmesi otomatik onay sayılmaz',()=>{assert.equal(matchVideo({title:'6. Sınıf Basamak değeri'},topics[0]).eligible,false);assert.equal(matchVideo({title:'5. Sınıf Basamak Değeri'},topics[0]).eligible,true);assert.equal(matchVideo({title:'5. sınıf toplama'},topics[0]).eligible,false);});
test('canlı yanıt biçimi kaydedilir, onay bekler ve tekrar sorgusu önbellekten kullanılır',async()=>{let calls=0;const fetcher=async url=>{calls++;return {ok:true,json:async()=>url.includes('/search?')?{items:[{id:{videoId:'abcdefghijk'}}]}:{items:[{id:'abcdefghijk',snippet:{title:'5. sınıf Basamak değeri',channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',publishedAt:'2026-10-01',description:''},status:{embeddable:true,privacyStatus:'public'}}]}};};const input={state:{videos:[]},topics:[topics[0]],courses:[courses[0]],key:'fixture',fetcher,now:()=>new Date('2026-10-21')};const state=await researchAll(input);assert.equal(state.research.status,'complete');assert.equal(state.videos.length,1);assert.equal(state.videos[0].status,'pending');assert.equal(state.research.completedTopics,1);const count=calls;await researchAll({...input,state});assert.equal(calls,count);});
test('kota bittiğinde ilerleme saklanır ve otomatik devam zamanı belirlenir',async()=>{let saved,calls=0;const state=await researchAll({state:{videos:[]},topics,courses,key:'fixture',now:()=>new Date('2026-10-21'),fetcher:async()=>{calls++;return{ok:false,status:403,json:async()=>({error:{errors:[{reason:'quotaExceeded'}]}})};},onProgress:async s=>{saved=s.research.status;}});assert.equal(saved,'quota-blocked');assert.equal(state.research.completedTopics,0);assert.equal(state.research.retryAfter,'2026-10-21T07:05:00.000Z');assert.equal(calls,1);
 const paused=await researchAll({state,topics,courses,key:'fixture',now:()=>new Date('2026-10-21T07:04:59Z'),fetcher:()=>assert.fail('Kota yenilenmeden API isteği yapılmamalı')});assert.deepEqual(paused,state);
});

test('429 geri çekilmesi Retry-After değerini korur ve hatalar arttıkça uzar',async()=>{
 const run=(state,at='2026-10-21')=>researchAll({state,topics,courses,key:'fixture',now:()=>new Date(at),fetcher:async()=>({ok:false,status:429,headers:{get:()=> '120'},json:async()=>({})})});
 const first=await run({videos:[]});assert.equal(first.research.status,'rate-limited');assert.equal(first.research.retryAfter,'2026-10-21T00:02:00.000Z');
 const third=await run({...first,rateLimitErrors:2},first.research.retryAfter);assert.equal(third.research.retryAfter,null);
});
test('eski adaylar reddedilir, iki tarama kademesi de 2025 veya sonrasına sınırlandırılır',async()=>{
 const seen=[];const state=await researchAll({state:{videos:[{id:'abcdefghijk',topicId:'number',status:'approved',publishedAt:'2024-12-31'}]},topics:[topics[0]],courses:[courses[0]],key:'fixture',now:()=>new Date('2026-10-21'),fetcher:async url=>{seen.push(new URL(url));return{ok:true,json:async()=>({items:[]})};}});
 assert.equal(state.videos[0].status,'rejected');assert.equal(state.videos[0].rejectionReason,'published-before-2025');assert.equal(seen.length,4);assert.deepEqual(seen.slice(0,2).map(u=>u.searchParams.get('publishedAfter')),['2026-01-01T00:00:00Z','2025-01-01T00:00:00Z']);
});

test('ilk aşama mevcut uygun adayın konusuna yeni istek yapmaz',async()=>{
 const record={id:'abcdefghijk',identity:'number:abcdefghijk',topicId:'number',course:'Matematik',title:'5. sınıf Basamak değeri',channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',publishedAt:'2026-10-01',channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z',status:'pending'};
 const result=await researchAll({state:{videos:[record]},topics:[topics[0]],courses:[courses[0]],key:'fixture',fetcher:()=>assert.fail('Zaten adayı olan konu tekrar aranmamalı'),now:()=>new Date('2026-10-21')});assert.equal(result.research.status,'complete');assert.equal(result.videos.length,1);
});

test('kullanıcı video araştırmasını duraklattığında kota dönemi geçmiş olsa da API çağrılmaz',async()=>{
 const state={videos:[],research:{status:'quota-blocked',pausedByUser:true,updatedAt:'2026-10-20T21:00:00Z',retryAfter:'2026-10-21T07:05:00Z',completedTopics:418}};
 const next=await researchAll({state,topics,courses,key:'fixture',now:()=>new Date('2026-10-22'),fetcher:()=>assert.fail('Kullanıcı duraklatmasını atlama')});
 assert.deepEqual(next.research.completedTopics,418);assert.equal(next.research.pausedByUser,true);
});

test('sonraki kota döneminde kayıtlı konular korunur, yalnız yarım kalan sorgu devam eder',async()=>{
 const savedAt='2026-10-18T00:00:00.000Z';
 const batchQueries=Object.fromEntries(['2026-2027','2025-2026'].flatMap(year=>[
  [JSON.stringify([year,'math',[],'coverage','UCb-0JQ4tI03T5rHdFe2GVoA']),savedAt],
  [JSON.stringify([year,'math',['number'],'topics','UCb-0JQ4tI03T5rHdFe2GVoA']),savedAt],
 ]));
 const state={videos:[],batchQueries,topicScans:{number:savedAt},research:{status:'quota-blocked',updatedAt:'2026-10-20T21:00:00Z',completedTopics:1}};
 assert.equal(researchReport(state,topics).fullySearchedTopics,1);
 assert.equal(researchReport(state,topics).topicsWithoutCandidates,1);
 const requests=[];
 const result=await researchAll({state,topics,courses,key:'fixture',now:()=>new Date('2026-10-21T07:05:00Z'),fetcher:async url=>{requests.push(new URL(url).searchParams.get('q'));return{ok:true,json:async()=>({items:[]})};}});
 assert.equal(requests.length,4);assert.ok(requests.every(q=>q.includes('Fen Bilimleri')));
 assert.equal(result.research.status,'complete');assert.equal(result.research.completedTopics,2);
 assert.equal(result.topicScans.number,savedAt);assert.equal(researchReport(result,topics).fullySearchedTopics,2);
});
