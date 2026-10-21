import { describe, expect, it } from 'vitest';
import { approvedOnly } from './videos';
const fixture = { id: 'abcdefghijk', url:'https://www.youtube.com/watch?v=abcdefghijk', topicId:'place-value', role:'primary', title:null, channel:null, publishedAt:'2026-10-01',channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z', duration:null, status:'approved', curriculumVerified:true, childSafetyVerified:true, reviewer:'Test', reviewedAt:'2026-10-20T00:00:00Z' };
describe('öğrenci JSON kataloğu',()=>{
  it('bekleyen, reddedilen veya incelemesi eksik kaydı göstermez',()=>{
    for(const patch of [{status:'pending'},{status:'rejected'},{curriculumVerified:false},{childSafetyVerified:false},{reviewer:''},{url:'https://example.com'},{role:'other'}]) expect(approvedOnly({version:1,videos:[{...fixture,...patch}]})).toEqual([]);
    expect(approvedOnly({version:2,videos:[fixture]})).toEqual([]);
  });
  it('bilinmeyen başlık/kanal/süre metadatasını uydurmadan null olarak korur',()=>{
    expect(approvedOnly({version:1,videos:[fixture]})).toEqual([fixture]);
  });
});

it('2025 öncesi, bilinmeyen veya API doğrulaması olmayan yayın tarihini öğrenciye göstermez',()=>{
 for(const patch of [{publishedAt:'2024-12-31'},{publishedAt:null},{publishedAt:'2026-02-30'},{metadataStatus:'unverified'},{fetchedAt:null}])expect(approvedOnly({version:1,videos:[{...fixture,...patch}]})).toEqual([]);
 expect(approvedOnly({version:1,videos:[{...fixture,publishedAt:'2025-01-01'}]})).toHaveLength(1);
});

it('aynı kanal adını kullanan farklı kanal ve bilinmeyen kanal kimliği kabul edilmez',()=>{
 for(const channelId of [undefined,null,'UC-other-channel'])expect(approvedOnly({version:1,videos:[{...fixture,channel:'tonguç 5. SINIF',channelId}]})).toEqual([]);
});

it('yayınlanan matematik kataloğu gerçek API kaydı, sınırlı inceleme kapsamı ve konu başına en fazla üç video taşır',async()=>{
 const catalog=(await import('./video-catalog.json')).default;
 expect(approvedOnly(catalog)).toHaveLength(catalog.videos.length);
 expect(catalog.videos.length).toBeGreaterThan(0);
 const byTopic=new Map<string,number>();
 for(const v of catalog.videos){
  expect(v.channelId).toBe('UCb-0JQ4tI03T5rHdFe2GVoA');expect(v.madeForKids).toBe(true);expect(v.fullVideoWatched).toBe(false);expect(v.reviewScope).toBe('channel-title-description-publisher-kids-declaration');expect(v.evidence).toContain('Video bütünü izlenmedi');expect(v.topicCoverage.length).toBeGreaterThan(5);
  byTopic.set(v.topicId,(byTopic.get(v.topicId)||0)+1);
 }
 expect([...byTopic.values()].every(count=>count<=3)).toBe(true);
 expect(new Set(catalog.videos.map(v=>v.topicId+':'+v.id)).size).toBe(catalog.videos.length);
});
