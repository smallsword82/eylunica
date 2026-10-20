export const MINUTE = 60_000;
export type UsageDomain = "math" | "reading" | "attention" | "other";
export type TimeSettings = {
  dailyLimitMinutes: number | null;
  breakReminders: boolean;
};
export type DayUsage = {
  math: number;
  reading: number;
  attention: number;
  other: number;
  goalAcknowledged: boolean;
  nextBreakAtMs: number;
};
export type WellbeingState = {
  version: 1;
  settings: TimeSettings;
  days: Record<string, DayUsage>;
};
export type Reminder = "goal" | "break";
export const freshDay = (): DayUsage => ({
  math: 0,
  reading: 0,
  attention: 0,
  other: 0,
  goalAcknowledged: false,
  nextBreakAtMs: 25 * MINUTE,
});
export const freshWellbeing = (): WellbeingState => ({
  version: 1,
  settings: { dailyLimitMinutes: null, breakReminders: true },
  days: {},
});
export function dateKey(wall: number): string {
  const d = new Date(wall);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export const dayTotal = (day: DayUsage) =>
  day.math + day.reading + day.attention + day.other;
export const todayUsage = (s: WellbeingState, now: number) =>
  s.days[dateKey(now)] || freshDay();
/** Duration comes only from a foreground monotonic clock, never wall-clock gaps.
 * Split at device-local midnight (including 23/25-hour DST days). */
export function addUsage(
  s: WellbeingState,
  endWall: number,
  elapsedMs: number,
  domain: UsageDomain,
): WellbeingState {
  if (
    !Number.isFinite(endWall) ||
    !Number.isFinite(elapsedMs) ||
    elapsedMs <= 0
  )
    return s;
  const next = structuredClone(s);
  let cursor = endWall - elapsedMs;
  while (cursor < endWall) {
    const d = new Date(cursor);
    const midnight = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate() + 1,
    ).getTime();
    const end = Math.min(endWall, midnight);
    if (end <= cursor) break;
    const key = dateKey(cursor),
      day = next.days[key] || freshDay();
    day[domain] += end - cursor;
    next.days[key] = day;
    cursor = end;
  }
  next.days = Object.fromEntries(
    Object.entries(next.days)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-90),
  );
  return next;
}
export function limitReached(s: WellbeingState, now: number): boolean {
  return (
    s.settings.dailyLimitMinutes !== null &&
    dayTotal(todayUsage(s, now)) >= s.settings.dailyLimitMinutes * MINUTE
  );
}
export function dueReminder(s: WellbeingState, now: number): Reminder | null {
  const day = todayUsage(s, now),
    total = dayTotal(day);
  if (s.settings.breakReminders && total >= day.nextBreakAtMs) return "break";
  if (total >= 15 * MINUTE && !day.goalAcknowledged) return "goal";
  return null;
}
export function acknowledge(
  s: WellbeingState,
  now: number,
  kind: Reminder,
): WellbeingState {
  const next = structuredClone(s),
    key = dateKey(now),
    day = next.days[key] || freshDay();
  if (kind === "goal") day.goalAcknowledged = true;
  else {
    day.nextBreakAtMs = dayTotal(day) + 20 * MINUTE;
    if (dayTotal(day) >= 15 * MINUTE) day.goalAcknowledged = true;
  }
  next.days[key] = day;
  return next;
}
export function weekUsage(s: WellbeingState, now: number): DayUsage {
  const sum = freshDay(),
    d = new Date(now);
  for (let i = 0; i < 7; i++) {
    const day = s.days[dateKey(d.getTime())];
    if (day)
      for (const k of [
        "math",
        "reading",
        "attention",
        "other",
      ] as UsageDomain[])
        sum[k] += day[k];
    d.setDate(d.getDate() - 1);
  }
  return sum;
}
export function decodeWellbeing(raw: string | null): WellbeingState {
  if (!raw) return freshWellbeing();
  try {
    const p = JSON.parse(raw);
    if (
      p.version !== 1 ||
      !p.settings ||
      !p.days ||
      typeof p.days !== "object" ||
      Array.isArray(p.days)
    )
      return freshWellbeing();
    const s = freshWellbeing(),
      limit = p.settings.dailyLimitMinutes;
    s.settings.dailyLimitMinutes =
      Number.isInteger(limit) && limit >= 1 && limit <= 1440 ? limit : null;
    s.settings.breakReminders =
      typeof p.settings.breakReminders === "boolean"
        ? p.settings.breakReminders
        : true;
    for (const [key, value] of Object.entries(p.days)) {
      const day = value as DayUsage;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !day || typeof day !== "object")
        continue;
      if (
        !(["math", "reading", "attention", "other"] as const).every(
          (k) => Number.isFinite(day[k]) && day[k] >= 0,
        ) ||
        typeof day.goalAcknowledged !== "boolean" ||
        !Number.isFinite(day.nextBreakAtMs) ||
        day.nextBreakAtMs < 25 * MINUTE
      )
        continue;
      s.days[key] = {
        math: day.math,
        reading: day.reading,
        attention: day.attention,
        other: day.other,
        goalAcknowledged: day.goalAcknowledged,
        nextBreakAtMs: day.nextBreakAtMs,
      };
    }
    s.days = Object.fromEntries(
      Object.entries(s.days)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-90),
    );
    return s;
  } catch {
    return freshWellbeing();
  }
}
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000),
    minutes = Math.floor(seconds / 60);
  return `${minutes} dk ${seconds % 60} sn`;
}
