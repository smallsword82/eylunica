// Optional server-side YouTube Data API access. Never import in the student app.
import { publicationRejection } from '../../src/grade5/video-policy.ts';
import { newest } from './research.mjs';
import { restoreQuotaSchedule, researchPauseUntil } from './scheduling.mjs';
export async function searchVideos({ state, input, key, fetcher = fetch, now = new Date(), onProgress = async () => {} }) {
  if (!key) throw Error('API araması için ortam ayarlarına YOUTUBE_API_KEY ekleyin.');
  const next = restoreQuotaSchedule(state, now);
  if (next.research?.pausedByUser) { await onProgress(next); return next; }
  if (researchPauseUntil(next, now)) { await onProgress(next); return next; }
  const { course, topicId, topicTitle } = input;
  if (![course, topicTitle].every(v => typeof v === 'string' && v.trim() && v.length <= 200) || typeof topicId !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,199}$/.test(topicId)) throw Error('Ders, konu kimliği ve konu başlığı gerekli.');
  next.searches ||= {};
  const request = (resource, params) => youtubeRequest(key, fetcher, resource, params);
  for (const [year, after] of [['2026-2027','2026-01-01T00:00:00Z'],['2025-2026','2025-01-01T00:00:00Z']]) {
    const q = `5. sınıf ${course.trim()} ${year} ${topicTitle.trim()} konu anlatımı`.replace(/\s+/g,' ');
    const cacheKey = JSON.stringify([topicId,q,after]);
    if (next.searches[cacheKey]) continue;
    const result = await request('search',{part:'snippet',type:'video',q,order:'date',safeSearch:'strict',relevanceLanguage:'tr',maxResults:'10',publishedBefore:year==='2025-2026'?'2026-01-01T00:00:00Z':now.toISOString(),...(after?{publishedAfter:after}:{})});
    const ids = [...new Set((result.items || []).map(v=>v.id?.videoId).filter(id=>/^[\w-]{11}$/.test(id || '') && !next.videos.some(v=>v.identity===topicId+':'+id)))];
    if (ids.length) {
      const details = await request('videos',{part:'snippet,contentDetails,status',id:ids.join(',')});
      for (const video of details.items || []) {
        if (!ids.includes(video.id) || !video.status?.embeddable || video.status.privacyStatus !== 'public') continue;
        const publishedAt = Number.isFinite(Date.parse(video.snippet?.publishedAt)) ? video.snippet.publishedAt.slice(0,10) : null;
        if (publicationRejection({ publishedAt, metadataStatus:'api-provided', metadataSource:'YouTube Data API v3', fetchedAt:now.toISOString() })) continue;
        next.videos.push({ id:video.id,url:'https://www.youtube.com/watch?v='+video.id,identity:topicId+':'+video.id,topicId,course:course.trim(),topicTitle:topicTitle.trim(),title:video.snippet?.title || null,channel:video.snippet?.channelTitle || null,publishedAt,duration:video.contentDetails?.duration || null,metadataSource:'YouTube Data API v3',metadataStatus:'api-provided',status:'pending',addedAt:now.toISOString(),fetchedAt:now.toISOString(),method:'youtube-api',query:q });
      }
    }
    next.searches[cacheKey] = now.toISOString();
    await onProgress(next);
  }
  next.videos.sort(newest);
  return next;
}

export async function youtubeRequest(key, fetcher, resource, params) {
    let response;
    try { response = await fetcher('https://www.googleapis.com/youtube/v3/' + resource + '?' + new URLSearchParams(params), { headers: { 'X-Goog-Api-Key': key, Accept: 'application/json' }, signal: AbortSignal.timeout(15000), redirect: 'error' }); }
    catch { throw Error('YouTube API bağlantısı kurulamadı. Ağ erişimini ve zaman aşımını kontrol edin.'); }
    if (!response.ok) {
      const guidance = response.status === 403 ? 'YouTube Data API v3 etkinliğini, anahtar kısıtlarını, kotayı ve ağ iznini kontrol edin.' : response.status === 400 || response.status === 401 ? 'API anahtarını ve istek yetkisini kontrol edin.' : 'Daha sonra yeniden deneyin.';
      const error = Error(`YouTube API HTTP ${response.status}. ${guidance}`);
      try { const payload = await response.json(); const scopeText=[payload?.error?.message,...(payload?.error?.details||[]).map(d=>[d.metadata?.quota_limit,d.metadata?.quota_unit].join(' '))].join(' ');error.limitScope=/perday|per day|daily|\/d(?:\/|$)/i.test(scopeText)?'daily':/perminute|per minute|persecond|per second|\/min(?:\/|$)/i.test(scopeText)?'short-window':'unknown';const reason = payload?.error?.errors?.[0]?.reason; if (['quotaExceeded','dailyLimitExceeded','accessNotConfigured','keyInvalid','ipRefererBlocked','rateLimitExceeded','userRateLimitExceeded'].includes(reason)) error.code = reason; } catch {}
      const retry = Number(response.headers?.get?.('retry-after')); if (Number.isFinite(retry) && retry > 0 && retry <= 86400) error.retryAfterSeconds = retry;
      error.httpStatus = response.status;
      throw error;
    }
    try { return await response.json(); } catch { throw Error('YouTube API yanıtı okunamadı.'); }
}

