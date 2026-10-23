import test from 'node:test';
import assert from 'node:assert/strict';
import { parseYouTubeUrl, addManual, review, publishable, mergeCatalog, newest } from './research.mjs';
const initial = { version: 1, videos: [] };
// Synthetic IDs are isolated test fixtures, never shipped in the student catalog.
const input = { topicId: 'place-value', url: 'https://youtu.be/abcdefghijk' };
const approval = { status: 'approved', curriculumVerified: true, childSafetyVerified: true, reviewer: 'Test editörü', evidence: 'Yalnız test verisi', scores: { curriculum: 40, freshness: 25, quality: 20, safety: 15 } };
test('normal YouTube bağlantı biçimleri standartlaştırılır; dış alanlar ve betikler reddedilir', () => {
  for (const url of ['https://youtu.be/abcdefghijk?t=5','https://www.youtube.com/watch?v=abcdefghijk&list=playlist','https://m.youtube.com/shorts/abcdefghijk']) assert.equal(parseYouTubeUrl(url).id,'abcdefghijk');
  for (const url of ['javascript:alert(1)','https://www.youtube.com.evil.test/watch?v=abcdefghijk','https://evil.test/watch?v=abcdefghijk','http://youtu.be/abcdefghijk','https://user@youtu.be/abcdefghijk','https://youtu.be/short']) assert.throws(()=>parseYouTubeUrl(url));
});
test('anahtarsız manuel kayıt bilinmeyen metadata alanlarını boş bırakır ve ağ kullanmaz', () => {
  const state=addManual(initial,input);
  assert.equal(state.videos[0].title,null);assert.equal(state.videos[0].publishedAt,null);assert.equal(state.videos[0].channel,null);assert.equal(state.videos[0].duration,null);
  assert.equal(state.videos[0].status,'pending');assert.equal(publishable(state).length,0);assert.equal(initial.videos.length,0);
  assert.throws(()=>addManual(state,{...input,url:'https://www.youtube.com/watch?v=abcdefghijk'}),/zaten/);
});
test('hatalı ve gelecekteki tarihler reddedilir; en yeni kayıt önce gelir', () => {
  for(const date of ['2026-02-30','2026-13-01','yarın','2027-01-01']) assert.throws(()=>addManual(initial,{...input,publishedAt:date},'2026-10-20T00:00:00Z'));
  assert.ok(newest({publishedAt:'2026-01-01'},{publishedAt:'2026-02-01'})>0);
  assert.ok(newest({publishedAt:null},{publishedAt:'2026-02-01'})>0);
});
test('onayda müfredat ve çocuk uygunluğu kapıları ve kanıt zorunlu', () => {
  const video={...addManual(initial,input).videos[0],publishedAt:'2026-10-01',channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z'};
  assert.throws(()=>review(video,{status:'approved',scores:approval.scores}));
  assert.throws(()=>review(video,{...approval,evidence:''}));
  assert.throws(()=>review(video,{...approval,scores:{...approval.scores,curriculum:41}}));
  const approved=review(video,approval);
  assert.equal(publishable({videos:[approved]}).length,1);
  assert.equal(publishable({videos:[review(approved,{status:'rejected'})]}).length,0);
});
test('konu başına en yeni iki onaylı kayıt ana ve alternatif olarak JSONa aktarılır', () => {
  const videos=['2025-01-01','2026-10-01','2026-09-01'].map((publishedAt,i)=>review({...addManual(initial,{...input,url:`https://youtu.be/abcdefghij${i}`}).videos[0],publishedAt,channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z'},approval));
  const catalog=publishable({videos});
  assert.deepEqual(catalog.map(v=>[v.publishedAt,v.role]),[['2026-10-01','primary'],['2026-09-01','alternative']]);
  assert.doesNotThrow(()=>JSON.parse(JSON.stringify({version:1,videos:catalog})));
});

test('2024 ve doğrulanmamış tarih yüksek puanla bile onaylanmaz veya dışa aktarılmaz',()=>{
 const good={...addManual(initial,input).videos[0],...approval,publishedAt:'2025-01-01',channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z'};
 for(const patch of [{publishedAt:'2024-12-31'},{publishedAt:null},{metadataStatus:'unverified'},{fetchedAt:null}]) {const v={...good,...patch};assert.throws(()=>review(v,approval),/2025/);assert.deepEqual(publishable({videos:[v]}),[]);}
 assert.equal(publishable({videos:[good]}).length,1);
});

test('kanal adı aynı olsa da başka kanal veya bilinmeyen kimlik onaylanmaz',()=>{
 const good={...addManual(initial,input).videos[0],...approval,publishedAt:'2026-10-01',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z'};
 for(const channelId of [undefined,'UCm3vDH7Uvz_qwql5Qih4yGw']){const v={...good,channel:'tonguç 5. SINIF',channelId};assert.throws(()=>review(v,approval),/kanal/);assert.deepEqual(publishable({videos:[v]}),[]);}
});
test('baştan taramadan sonra dışa aktarım yayımlanmış kataloğu korur; durumda reddedilen kayıt çıkarılır', () => {
 const verified={channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z',publishedAt:'2026-10-01'};
 const make=(topicId,i)=>review({...addManual(initial,{topicId,url:`https://youtu.be/abcdefghij${i}`}).videos[0],...verified},approval);
 const published=[make('old-topic',1),make('dropped-topic',2)].map(({identity,...v})=>({...v,role:'primary'}));
 const state={videos:[make('new-topic',3),{...make('dropped-topic',2),status:'rejected'}]};
 assert.deepEqual(mergeCatalog(published,state).map(v=>v.topicId).sort(),['new-topic','old-topic']);
 assert.deepEqual(mergeCatalog(published,{videos:[]}).length,2);
});
test('elle eklenmiş üçüncü video ve bekleyen durum kaydı yayımlanmış katalogdan düşmez', () => {
 const verified={channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z',publishedAt:'2026-10-01'};
 const make=i=>review({...addManual(initial,{topicId:'busy',url:`https://youtu.be/abcdefghij${i}`}).videos[0],...verified},approval);
 const published=[1,2,3].map(i=>({...make(i),role:i===1?'primary':'alternative'}));
 const state={videos:[{...make(1),status:'pending'},make(4)]};
 assert.deepEqual(mergeCatalog(published,state).map(v=>v.id),published.map(v=>v.id));
});
