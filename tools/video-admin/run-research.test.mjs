import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { run, bookshelf, bookshelfCourseIds } from './run-research.mjs';

test('yalnız yedi kitaplık dersini tarar, kota durunca kaydı korur ve sonraki çalıştırmada aynı aramayı yinelemez', async () => {
 const directory = await mkdtemp(path.join(tmpdir(), 'eylunica-run-'));
 assert.equal(bookshelf.courses.length, 7);
 assert.ok(bookshelf.topics.every(t => bookshelfCourseIds.includes(t.courseId)));
 const queries = [];
 let allowed = 3;
 const fetcher = async url => {
  const params = new URL(url).searchParams;
  if (url.includes('/search?')) {
   queries.push(params.get('q') + '|' + params.get('publishedAfter'));
   if (allowed-- <= 0) return { ok: false, status: 403, headers: new Headers(), json: async () => ({ error: { errors: [{ reason: 'quotaExceeded' }] } }) };
  }
  return { ok: true, json: async () => ({ items: [] }) };
 };
 const now = () => new Date('2026-10-23T10:00:00Z');
 const first = await run({ directory, key: 'fixture', fetcher, now, paceMs: 0 });
 assert.equal(first.report.status, 'quota-blocked');
 assert.ok(first.report.retryAfter);
 const saved = JSON.parse(await readFile(path.join(directory, 'state.json'), 'utf8'));
 assert.equal(Object.keys(saved.batchQueries).length, 3);
 assert.ok(queries.every(q => bookshelf.courses.some(c => q.includes(c.name.replace('Çoklu Yabancı Dil Eğitim Modeli ', '')))));
 const done = queries.length;
 allowed = 1000;
 const later = () => new Date('2026-10-24T10:00:00Z');
 const second = await run({ directory, key: 'fixture', fetcher, now: later, paceMs: 0 });
 assert.equal(second.report.status, 'complete');
 assert.deepEqual(queries.slice(done).filter(q => queries.slice(0, 3).includes(q)), []);
 assert.equal(second.report.totalTopics, bookshelf.topics.length);
});
