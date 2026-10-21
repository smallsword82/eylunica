import test from 'node:test';
import assert from 'node:assert/strict';
import { searchVideos } from './youtube.mjs';
const input={course:'Matematik',topicId:'place-value',topicTitle:'Basamak değeri'};
const state={version:1,videos:[]};
const now=new Date('2026-10-21T00:00:00Z');
test('anahtar yokken ağ kullanmaz; manuel katalog korunur',async()=>{
  await assert.rejects(searchVideos({state,input,key:'',fetcher:()=>assert.fail('ağ çağrısı')}),/YOUTUBE_API_KEY/);
  assert.deepEqual(state.videos,[]);
});
test('tarih önceliği, güvenli arama, metadata ve sonraki günlerde de sorgu tekrarını önleme',async()=>{
  const calls=[];
  const fetcher=async(url,options)=>{const u=new URL(url);calls.push(u);assert.equal(options.headers['X-Goog-Api-Key'],'fixture-key');assert.equal(u.searchParams.has('key'),false);return {ok:true,json:async()=>u.pathname.endsWith('/search')?{items:[{id:{videoId:'abcdefghijk'}}]}:{items:[{id:'abcdefghijk',snippet:{title:'Test adayı',channelTitle:'Test kanalı',publishedAt:'2026-10-01T12:00:00Z'},contentDetails:{duration:'PT5M'},status:{embeddable:true,privacyStatus:'public'}}]}};};
  const result=await searchVideos({state,input,key:'fixture-key',fetcher,now});
  assert.equal(calls[0].searchParams.get('order'),'date');assert.equal(calls[0].searchParams.get('safeSearch'),'strict');assert.equal(calls[0].searchParams.get('publishedAfter'),'2026-01-01T00:00:00Z');
  assert.equal(result.videos.length,1);assert.equal(result.videos[0].status,'pending');assert.equal(result.videos[0].publishedAt,'2026-10-01');assert.equal(result.videos[0].duration,'PT5M');
  assert.equal(calls.filter(u=>u.pathname.endsWith('/videos')).length,1);
  const count=calls.length;await searchVideos({state:result,input,key:'fixture-key',fetcher,now:new Date('2026-10-24')});assert.equal(calls.length,count);
  assert.equal(JSON.stringify(result).includes('fixture-key'),false);assert.deepEqual(state.videos,[]);
});

test('tek konu araştırması da kayıtlı günlük kota zamanından önce ağ kullanmaz',async()=>{
 const blocked={...state,research:{status:'quota-blocked',updatedAt:'2026-10-20T21:00:00Z',retryAfter:null}};
 let saved;
 const result=await searchVideos({state:blocked,input,key:'fixture',now,fetcher:()=>assert.fail('Kota beklemesinde API çağrısı'),onProgress:async next=>{saved=next;}});
 assert.equal(result.research.retryAfter,'2026-10-21T07:05:00.000Z');assert.deepEqual(saved,result);
});

test('ikinci yıl sorgusunda kota dolarsa birinci yıl sonuçları kalıcılaştırılmıştır',async()=>{
 let saved,calls=0;
 await assert.rejects(searchVideos({state,input,key:'fixture',now,onProgress:async next=>{saved=structuredClone(next);},fetcher:async()=>{
  calls++;return calls===1?{ok:true,json:async()=>({items:[]})}:{ok:false,status:403,json:async()=>({error:{errors:[{reason:'quotaExceeded'}]}})};
 }}),e=>e.code==='quotaExceeded');
 assert.equal(calls,2);assert.equal(Object.keys(saved.searches).length,1);assert.equal(state.searches,undefined);
});
test('mevcut red kararı korunur; eksik metadata uydurulmaz; oynatılamayan video atlanır',async()=>{
  const original={version:1,videos:[{identity:'place-value:abcdefghijk',id:'abcdefghijk',status:'rejected'}]};
  const fetcher=async(url)=>({ok:true,json:async()=>new URL(url).pathname.endsWith('/search')?{items:['abcdefghijk','12345678901','ABCDEFGHIJK'].map(videoId=>({id:{videoId}}))}:{items:[{id:'12345678901',status:{embeddable:true,privacyStatus:'public'}},{id:'ABCDEFGHIJK',status:{embeddable:false,privacyStatus:'public'}}]}});
  const result=await searchVideos({state:original,input,key:'fixture',fetcher,now});assert.equal(result.videos[0].status,'rejected');assert.equal(result.videos.length,1);
});
test('API veya ağ hatası anahtar değerini açığa çıkarmaz ve kısmi başarı sayılmaz',async()=>{
  await assert.rejects(searchVideos({state,input,key:'fixture-secret',now,fetcher:async()=>({ok:false,status:403})}),e=>e.message.includes('HTTP 403')&&!e.message.includes('fixture-secret'));
  await assert.rejects(searchVideos({state,input,key:'fixture-secret',now,fetcher:async()=>{throw Error('sensitive fixture-secret');}}),e=>!e.message.includes('fixture-secret'));
  assert.deepEqual(state.videos,[]);
});
