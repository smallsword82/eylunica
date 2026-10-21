import test from 'node:test';
import assert from 'node:assert/strict';
import {
 nextQuotaResumeAt, restoreQuotaSchedule, researchPauseUntil, recordResearchFailure,
} from './scheduling.mjs';

test('günlük kota Pasifik gece yarısında, yaz/kış saati ve yıl geçişi korunarak yenilenir', () => {
 const cases = [
  ['2026-01-15T12:00:00Z', '2026-01-16T08:05:00.000Z'],
  ['2026-07-15T12:00:00Z', '2026-07-16T07:05:00.000Z'],
  ['2026-03-08T07:59:00Z', '2026-03-08T08:05:00.000Z'],
  ['2026-03-08T08:01:00Z', '2026-03-09T07:05:00.000Z'],
  ['2026-11-01T06:59:00Z', '2026-11-01T07:05:00.000Z'],
  ['2026-11-01T07:01:00Z', '2026-11-02T08:05:00.000Z'],
  ['2026-12-31T12:00:00Z', '2027-01-01T08:05:00.000Z'],
 ];
 for (const [blocked, expected] of cases) assert.equal(nextQuotaResumeAt(blocked), expected, blocked);
});

test('gece yarısına çok yakın kota hatasında tampon ve daha uzun Retry-After korunur', () => {
 const blocked = '2026-10-21T06:59:30.000Z';
 assert.equal(nextQuotaResumeAt(blocked), '2026-10-21T07:05:00.000Z');
 assert.equal(nextQuotaResumeAt(blocked, 900), '2026-10-21T07:14:30.000Z');
 assert.equal(nextQuotaResumeAt(blocked, -1), '2026-10-21T07:05:00.000Z');
 assert.throws(() => nextQuotaResumeAt('unknown'), /Geçersiz/);
});

test('eski duraklatma kaydı asıl hata zamanından taşınır ve yeniden başlatma zamanı ertelemez', () => {
 const original = {
  videos: [{ id: 'saved' }], topicScans: { preserved: '2026-10-19T12:00:00Z' },
  research: { status: 'quota-blocked', updatedAt: '2026-10-20T21:38:12.515Z', retryAfter: null },
 };
 const before = structuredClone(original);
 const migrated = restoreQuotaSchedule(original, new Date('2026-10-21T01:00:00Z'));
 assert.equal(migrated.research.retryAfter, '2026-10-21T07:05:00.000Z');
 assert.equal(migrated.research.quotaBlockedAt, '2026-10-20T21:38:12.515Z');
 assert.equal(migrated.research.quotaResetTimezone, 'America/Los_Angeles');
 assert.deepEqual(original, before);
 assert.deepEqual(migrated.videos, original.videos);
 assert.deepEqual(migrated.topicScans, original.topicScans);
 const restarted = restoreQuotaSchedule(migrated, new Date('2026-10-23T12:00:00Z'));
 assert.deepEqual(restarted, migrated);
 assert.equal(researchPauseUntil(restarted, new Date('2026-10-23T12:00:00Z')), null);
});

test('önceden kaydedilen daha uzun bekleme ve kota dışındaki durumlar değiştirilmez', () => {
 const state = { videos: [], research: {
  status: 'quota-blocked', quotaBlockedAt: '2026-10-20T21:38:12.515Z',
  updatedAt: '2026-10-22T12:00:00Z', retryAfter: '2026-10-25T12:00:00.000Z',
 } };
 const restored = restoreQuotaSchedule(state, new Date('2026-10-23T12:00:00Z'));
 assert.equal(restored.research.retryAfter, state.research.retryAfter);
 assert.equal(restored.research.quotaBlockedAt, state.research.quotaBlockedAt);
 const complete = { videos: [], research: { status: 'complete', retryAfter: '2026-10-25T12:00:00.000Z' } };
 assert.deepEqual(restoreQuotaSchedule(complete), complete);
 assert.equal(researchPauseUntil(complete, new Date('2026-10-23')), null);
});

test('günlük kota ve hız sınırı bekleme kapısı yalnız süre dolduğunda açılır', () => {
 const due = '2026-10-21T07:05:00.000Z';
 for (const status of ['quota-blocked', 'rate-limited']) {
  const state = { research: { status, retryAfter: due } };
  assert.equal(researchPauseUntil(state, new Date('2026-10-21T07:04:59.999Z')), due);
  assert.equal(researchPauseUntil(state, new Date(due)), null);
  assert.equal(researchPauseUntil(state, new Date('2026-10-22T00:00:00Z')), null);
 }
});

test('günlük hata kuyruk ve sonuçları koruyarak tek kalıcı devam zamanı kaydeder', () => {
 const ledger = { '["2026-2027","math",["done"]]': '2026-10-20T20:00:00Z' };
 for (const error of [
  { httpStatus: 403, code: 'quotaExceeded', message: 'Quota reached' },
  { httpStatus: 403, code: 'dailyLimitExceeded', message: 'Daily quota reached' },
  { httpStatus: 429, code: 'rateLimitExceeded', limitScope: 'daily', message: 'Daily quota reached' },
 ]) {
  const state = { videos: [{ id: 'candidate' }], batchQueries: structuredClone(ledger),
   topicScans: { done: '2026-10-20T20:00:00Z' }, research: { completedTopics: 418 }, rateLimitErrors: 5 };
  const result = recordResearchFailure(state, error, new Date('2026-10-20T21:38:12.515Z'));
  assert.equal(result.research.status, 'quota-blocked');
  assert.equal(result.research.limitScope, 'daily');
  assert.equal(result.research.retryAfter, '2026-10-21T07:05:00.000Z');
  assert.equal(result.research.quotaBlockedAt, '2026-10-20T21:38:12.515Z');
  assert.equal(result.research.completedTopics, 418);
  assert.deepEqual(result.batchQueries, ledger);
  assert.deepEqual(result.videos, [{ id: 'candidate' }]);
  assert.deepEqual(result.topicScans, { done: '2026-10-20T20:00:00Z' });
 }
});

test('kısa süreli 429 hatası kontrollü bekler ve üçüncü hatada sürekli denemeyi durdurur', () => {
 const state = { videos: [], research: { completedTopics: 418 } };
 const error = { httpStatus: 429, code: 'rateLimitExceeded', limitScope: 'short-window', message: 'Slow down', retryAfterSeconds: 120 };
 recordResearchFailure(state, error, new Date('2026-10-21T00:00:00Z'));
 assert.equal(state.research.status, 'rate-limited');
 assert.equal(state.research.retryAfter, '2026-10-21T00:02:00.000Z');
 recordResearchFailure(state, error, new Date('2026-10-21T00:02:00Z'));
 assert.equal(state.research.retryAfter, '2026-10-21T00:04:00.000Z');
 recordResearchFailure(state, error, new Date('2026-10-21T00:04:00Z'));
 assert.equal(state.rateLimitErrors, 3);
 assert.equal(state.research.retryAfter, null);
 assert.equal(state.research.completedTopics, 418);
});
