// YouTube's daily quota resets at midnight Pacific time, including DST.
export const QUOTA_TIME_ZONE = 'America/Los_Angeles';
const resetBufferMs = 5 * 60 * 1000;
const pacific = new Intl.DateTimeFormat('en-US', {
 timeZone: QUOTA_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
 hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});
const localParts = date => Object.fromEntries(pacific.formatToParts(date)
 .filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
const validDate = value => Number.isFinite(Date.parse(value || ''));

export function nextQuotaResumeAt(blockedAt, retryAfterSeconds = 0) {
 const blocked = new Date(blockedAt);
 if (!Number.isFinite(blocked.getTime())) throw Error('Geçersiz kota zamanı');
 const { year, month, day } = localParts(blocked);
 const midnight = Date.UTC(year, month - 1, day + 1);
 let reset = midnight;
 for (let pass = 0; pass < 3; pass++) {
  const p = localParts(new Date(reset));
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - reset;
  reset = midnight - offset;
 }
 const retryMs = Math.max(0, Number(retryAfterSeconds) || 0) * 1000;
 return new Date(Math.max(reset + resetBufferMs, blocked.getTime() + retryMs)).toISOString();
}

export function restoreQuotaSchedule(state, now = new Date()) {
 const next = structuredClone(state);
 const research = next.research;
 if (research?.status !== 'quota-blocked') return next;
 const anchor = [research.quotaBlockedAt, research.updatedAt, research.startedAt]
  .find(validDate) || now.toISOString();
 research.quotaBlockedAt = anchor;
 research.quotaResetTimezone = QUOTA_TIME_ZONE;
 if (!validDate(research.retryAfter)) research.retryAfter = nextQuotaResumeAt(anchor);
 return next;
}

export function researchPauseUntil(state, now = new Date()) {
 const research = state.research;
 if (!['quota-blocked', 'rate-limited'].includes(research?.status)) return null;
 return validDate(research.retryAfter) && Date.parse(research.retryAfter) > now.getTime()
  ? research.retryAfter : null;
}

export function recordResearchFailure(state, error, now = new Date()) {
 const quota = ['quotaExceeded', 'dailyLimitExceeded'].includes(error.code) || error.limitScope === 'daily';
 if (error.httpStatus === 429) state.rateLimitErrors = (state.rateLimitErrors || 0) + 1;
 state.research = {
  ...state.research,
  status: quota ? 'quota-blocked' : error.httpStatus === 429 ? 'rate-limited' : 'blocked',
  updatedAt: now.toISOString(), limitScope: quota ? 'daily' : error.limitScope || 'unknown',
  errorCode: error.code || String(error.httpStatus || 'network-error'), error: error.message,
  retryAfter: quota ? nextQuotaResumeAt(now, error.retryAfterSeconds)
   : error.httpStatus === 429 && state.rateLimitErrors >= 3 ? null
   : new Date(now.getTime() + (error.httpStatus === 429
    ? Math.max(error.retryAfterSeconds || 0, Math.min(3600, 60 * 2 ** Math.min(6, (state.rateLimitErrors || 1) - 1)))
    : 3600) * 1000).toISOString(),
 };
 if (quota) {
  state.research.quotaBlockedAt = now.toISOString();
  state.research.quotaResetTimezone = QUOTA_TIME_ZONE;
 }
 return state;
}
