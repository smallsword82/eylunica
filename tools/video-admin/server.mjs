// Separate, loopback-only editorial tool. Never import this into the student app.
import http from 'node:http';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { review, publishable, applyPublicationPolicy } from './research.mjs';
import { searchVideos } from './youtube.mjs';
import { researchAll, researchReport, matchVideo } from './batch.mjs';
import { restoreQuotaSchedule, researchPauseUntil, recordResearchFailure } from './scheduling.mjs';
import { courses, topics } from '../../src/grade5/catalog.ts';
const researchTopics = topics.map(t => ({ topicId: t.id, topicTitle: t.title, course: courses.find(c => c.id === t.courseId)?.name || t.courseId }));
const root = fileURLToPath(new URL('../../', import.meta.url));
const directory = process.env.EYLUNICA_VIDEO_ADMIN_DATA_DIR || path.join(root, 'data/video-research');
const catalogPath = process.env.EYLUNICA_VIDEO_CATALOG_PATH || path.join(root, 'src/grade5/video-catalog.json');
const stateFile = path.join(directory, 'state.json');
await mkdir(directory, { recursive: true });
let state;
try { state = JSON.parse(await readFile(stateFile, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; state = { version: 1, videos: [] }; }
const save = async () => { await writeFile(stateFile + '.tmp', JSON.stringify(state, null, 2)); await rename(stateFile + '.tmp', stateFile); };
state = restoreQuotaSchedule(applyPublicationPolicy(state));
state.videos = state.videos.map(v => {const topic = topics.find(t=>t.id===v.topicId);if(!topic || (v.status!=='pending' && v.rejectionReason!=='topic-or-grade-mismatch'))return v;const match=matchVideo({...v,description:state.videoMetadata?.[v.id]?.description},topic);if(!match.eligible)return {...v,status:'rejected',rejectionReason:'topic-or-grade-mismatch'};if(v.rejectionReason==='topic-or-grade-mismatch'){const recovered={...v,status:'pending'};delete recovered.rejectionReason;return recovered;}return v;});
await save();
try { const old = JSON.parse(await readFile(catalogPath,'utf8')); const filtered = publishable({ videos: old.videos || [] }); if(filtered.length !== old.videos?.length){ await writeFile(catalogPath+'.tmp',JSON.stringify({version:1,videos:filtered},null,2)+'\n');await rename(catalogPath+'.tmp',catalogPath); } } catch(e){if(e.code!=='ENOENT')throw e;}
const port = Number(process.env.EYLUNICA_VIDEO_ADMIN_PORT || 4180);
let busy = false;
function startResearch() {
 if (busy || state.research?.pausedByUser || researchPauseUntil(state)) return false;
 if (!process.env.YOUTUBE_API_KEY) throw Error('YOUTUBE_API_KEY henüz çalışma ortamında tanımlı değil.');
 busy = true;
 void researchAll({ state, topics, courses, key: process.env.YOUTUBE_API_KEY, paceMs: 1200, onProgress: async next => { state = next; await save(); } })
  .then(async next => { state = next; await save(); })
  .catch(async () => { state.research = { ...state.research, status: 'blocked', error: 'Araştırma kaydedilemedi; sunucu günlüklerini kontrol edin.' }; await save(); })
  .finally(() => { busy = false; });
 return true;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-src https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  // Reject DNS rebinding and cross-origin writes. This tool is not a hosted admin service.
  const origin = `http://127.0.0.1:${port}`;
  if (req.headers.host !== `127.0.0.1:${port}` || (req.method !== 'GET' && req.headers.origin !== origin)) { res.writeHead(403); res.end('{}'); return; }
  try {
    if (req.method === 'GET' && req.url === '/') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(await readFile(new URL('index.html', import.meta.url))); return; }
    if (req.method === 'GET' && req.url === '/api/capabilities') { res.end(JSON.stringify({ youtubeApiConfigured: !!process.env.YOUTUBE_API_KEY, topicCount: researchTopics.length })); return; }
    if (req.method === 'GET' && req.url === '/api/report') { res.end(JSON.stringify(researchReport(state,topics))); return; }
    if (req.method === 'GET' && req.url === '/api/research-status') { res.end(JSON.stringify({ ...(state.research || {status:'idle'}), totalTopics:topics.length, candidateCount:state.videos.length, topicsWithCandidates:new Set(state.videos.map(v=>v.topicId)).size })); return; }
    if (req.method === 'GET' && req.url === '/api/videos') { res.end(JSON.stringify(state.videos)); return; }
    if (req.method !== 'POST' || !['/api/search', '/api/search-all', '/api/review', '/api/export'].includes(req.url)) { res.writeHead(404); res.end('{}'); return; }
    if (['/api/search', '/api/search-all'].includes(req.url) && state.research?.pausedByUser) { res.writeHead(409); res.end(JSON.stringify({ error: 'Video araştırması kullanıcı isteğiyle duraklatıldı; kayıtlı sonuçlar korunuyor.' })); return; }
    const pausedUntil = researchPauseUntil(state);
    if (['/api/search', '/api/search-all'].includes(req.url) && pausedUntil) {
      res.setHeader('Retry-After', String(Math.ceil((Date.parse(pausedUntil) - Date.now()) / 1000)));
      res.writeHead(429); res.end(JSON.stringify({ error: 'Kota/hız sınırı beklemesi sürüyor. Kaydedilen tarama belirtilen zamanda otomatik devam edecek.', retryAfter: pausedUntil })); return;
    }
    if (busy) { res.writeHead(409); res.end(JSON.stringify({ error: 'Bir işlem sürüyor.' })); return; }
    busy = true;
    try {
      let body = ''; for await (const chunk of req) { body += chunk; if (body.length > 20000) throw Error('İstek çok büyük'); }
      const input = JSON.parse(body || '{}');
      if (req.url === '/api/search-all') {
        busy = false; startResearch(); res.writeHead(202); res.end(JSON.stringify({ok:true,started:true})); return;
      } else if (req.url === '/api/search') {
        try { state = await searchVideos({ state, input, key: process.env.YOUTUBE_API_KEY, onProgress: async next => { state = next; await save(); } }); await save(); }
        catch (error) { if (error.httpStatus) { recordResearchFailure(state,error); await save(); } throw error; }

      } else if (req.url === '/api/review') {
        const index = state.videos.findIndex(v => v.identity === input.identity);
        if (index < 0) throw Error('Video bulunamadı');
        state.videos[index] = review(state.videos[index], input); await save();
      } else {
        const videos = publishable(state);
        await writeFile(catalogPath + '.tmp', JSON.stringify({ version: 1, videos }, null, 2) + '\n');
        await rename(catalogPath + '.tmp', catalogPath);
      }
      res.end(JSON.stringify({ ok: true, count: state.videos.length }));
    } finally { if (req.url !== '/api/search-all' || state.research?.status !== 'running') busy = false; }
  } catch (error) { res.writeHead(400); res.end(JSON.stringify({ error: error.message })); }
});
server.listen(port, '127.0.0.1', () => {
 console.log(`Video yönetici aracı ${port} portunda hazır; yalnız yerel kullanım.`);
 const autoResume = !state.research || state.research.status === 'running' || (state.research.retryAfter && Date.parse(state.research.retryAfter) <= Date.now());
 if (process.env.YOUTUBE_API_KEY && !state.research?.pausedByUser && autoResume) startResearch();
});
setInterval(() => {
 if (!busy && !state.research?.pausedByUser && process.env.YOUTUBE_API_KEY && state.research?.retryAfter && Date.parse(state.research.retryAfter) <= Date.now()) startResearch();
}, 60000).unref();
