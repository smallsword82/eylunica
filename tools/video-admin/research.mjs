import { videoRejection } from '../../src/grade5/video-policy.ts';
// Local catalog operations only. No API requests, scraping or video downloads.
export function newest(a, b) { return (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0); }
export function parseYouTubeUrl(value) {
  let url; try { url = new URL(value); } catch { throw Error('Geçerli bir YouTube bağlantısı girin.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) throw Error('HTTPS YouTube bağlantısı gerekli.');
  let id;
  if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
  else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
    if (url.pathname === '/watch') id = url.searchParams.get('v');
    else id = /^\/(?:shorts|embed)\/([\w-]{11})$/.exec(url.pathname)?.[1];
  }
  if (!/^[\w-]{11}$/.test(id || '')) throw Error('Desteklenen bir YouTube video bağlantısı gerekli.');
  return { id, url: `https://www.youtube.com/watch?v=${id}` };
}
function text(value, limit = 500) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.length > limit) throw Error('Geçersiz veya çok uzun metin.');
  return value.trim() || null;
}
export function addManual(state, input, now = new Date().toISOString()) {
  const video = parseYouTubeUrl(input.url);
  const topicId = text(input.topicId, 200);
  if (!topicId || !/^[a-z0-9][a-z0-9_-]*$/.test(topicId)) throw Error('Konu kimliği gerekli (küçük harf, rakam, tire).');
  const publishedAt = text(input.publishedAt, 10);
  if (publishedAt && (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt) || new Date(publishedAt).toISOString().slice(0,10) !== publishedAt || publishedAt > now.slice(0,10))) throw Error('Geçerli, gelecekte olmayan yayın tarihi gerekli; bilinmiyorsa boş bırakın.');
  const duration = text(input.duration, 30);
  if (duration && !/^(?:\d+:)?[0-5]?\d:[0-5]\d$/.test(duration)) throw Error('Süreyi dk:ss veya sa:dk:ss biçiminde yazın; bilinmiyorsa boş bırakın.');
  const identity = topicId + ':' + video.id;
  if (state.videos.some(v => v.identity === identity)) throw Error('Bu video bu konu için zaten kayıtlı.');
  return { ...state, version: 1, videos: [...state.videos, { ...video, identity, topicId, course: text(input.course, 200), topicTitle: text(input.topicTitle, 200), title: text(input.title), channel: text(input.channel, 200), publishedAt, duration, metadataSource: text(input.metadataSource, 2000), metadataStatus: 'unverified', status: 'pending', addedAt: now, method: 'manual' }].sort(newest) };
}
export function score(v) { return ['curriculum', 'freshness', 'quality', 'safety'].reduce((sum, key) => sum + (v.scores?.[key] || 0), 0); }
export function review(video, input, now = new Date().toISOString()) {
  if (!['approved', 'rejected'].includes(input.status)) throw Error('Geçersiz karar');
  if (input.status === 'rejected') return { ...video, status: 'rejected', reviewedAt: now };
  if (videoRejection(video)) throw Error('Yayın tarihi ve Tonguç 5. Sınıf kanal kimliği YouTube API ile doğrulanmış olmalıdır; yalnız 2025–2026 videoları kabul edilir.');
  if (input.curriculumVerified !== true || input.childSafetyVerified !== true || !input.reviewer?.trim() || !input.evidence?.trim()) throw Error('Müfredat, çocuk güvenliği, inceleyen ve inceleme notu zorunlu');
  const maxima = { curriculum: 40, freshness: 25, quality: 20, safety: 15 };
  for (const [key, max] of Object.entries(maxima)) if (!Number.isFinite(input.scores?.[key]) || input.scores[key] < 0 || input.scores[key] > max) throw Error('Geçersiz puan');
  return { ...video, status: 'approved', curriculumVerified: true, childSafetyVerified: true, reviewer: input.reviewer.trim(), evidence: input.evidence.trim(), scores: input.scores, reviewedAt: now };
}
export function publishable(state) {
  const candidates = state.videos.filter(v => !videoRejection(v) && v.status === 'approved' && v.curriculumVerified === true && v.childSafetyVerified === true && v.reviewer && v.evidence && /^[\w-]{11}$/.test(v.id));
  // Verified 2026–2027 fit is a publication prerequisite. Among approved
  // candidates, prioritize known newest dates, then editorial score.
  const output = [];
  for (const v of candidates.sort((a,b) => Number(b.publishedAt.startsWith('2026-'))-Number(a.publishedAt.startsWith('2026-')) || score(b)-score(a) || newest(a,b))) {
    const count = output.filter(other => other.topicId === v.topicId).length;
    if (count < 2) output.push({ ...v, role: count === 0 ? 'primary' : 'alternative' });
  }
  return output;
}

export function applyPublicationPolicy(state) {
  return { ...state, videos: state.videos.map(v => {
    const reason = videoRejection(v);
    return reason ? { ...v, status: 'rejected', rejectionReason: reason } : v;
  }) };
}
