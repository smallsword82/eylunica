import { generate, strategy, type Operation, type Question } from "../math-engine";
import { dateKey } from "../time-engine";
export const OPERATIONS: Operation[] = ["add", "subtract", "multiply", "divide"];
export const operationNames: Record<Operation, string> = { add: "Toplama", subtract: "Çıkarma", multiply: "Çarpma", divide: "Bölme" };
export const WINDOW = 20;
export const SESSION = 10;
export type LaneSpec = { operation: Operation; level: number; skill: string };
export type Observation = {
  id: string; fact: string; correct: boolean; hint: boolean;
  elapsedMs: number; timingValid: boolean; at: number; source: "practice" | "arena";
};
export type Comparison = { at: number; correct: number; independent: number; meanMs: number | null; qualified: boolean; record: boolean };
export type Lane = LaneSpec & {
  recent: Observation[]; pending: Observation[]; comparisons: Comparison[];
  baselineMs: number | null; bestMs: number | null;
};
export type ArenaState = { version: 1; lanes: Record<string, Lane>; completed: string[]; bonusCount: number; bonusDay: string | null };
export const freshArena = (): ArenaState => ({ version: 1, lanes: {}, completed: [], bonusCount: 0, bonusDay: null });
export const skillFor = (q: Question) => strategy(q).title;
export const laneKey = (s: LaneSpec) => `${s.operation}:${s.level}:${s.skill}`;
export const specFor = (q: Question): LaneSpec => ({ operation: q.operation, level: q.level, skill: skillFor(q) });
export const factKey = (q: Question) => ["add", "multiply"].includes(q.operation) ? `${Math.min(q.a, q.b)},${Math.max(q.a, q.b)}` : `${q.a},${q.b}`;
export function specs(operation: Operation, level: number): LaneSpec[] {
  const skills = operation === "add" ? ["Onluğa tamamla", "Parçalara ayır"] : [operation === "subtract" ? "Tersine toplama" : operation === "multiply" ? "Eş grupları keşfet" : "Eşit paylaştır"];
  return skills.map(skill => ({ operation, level, skill }));
}
export function getLane(state: ArenaState, s: LaneSpec): Lane {
  return state.lanes[laneKey(s)] || { ...s, recent: [], pending: [], comparisons: [], baselineMs: null, bestMs: null };
}
const timed = (o: Observation) => o.timingValid && o.elapsedMs >= 300 && o.elapsedMs <= 3_600_000;
export function eligibility(lane: Lane) {
  const recent = lane.recent.slice(-WINDOW);
  const independent = recent.filter(o => o.correct && !o.hint).length;
  const distinct = new Set(recent.map(o => o.fact)).size;
  return { total: recent.length, independent, distinct, open: recent.length === WINDOW && independent >= 18 && distinct >= 8 };
}
export function observation(q: Question, correct: boolean, hint: boolean, elapsedMs: number, timingValid: boolean, source: Observation["source"], id: string, at = Date.now()): Observation {
  const finite = Number.isFinite(elapsedMs) && elapsedMs >= 0;
  return { id, fact: factKey(q), correct, hint, elapsedMs: finite ? Math.min(elapsedMs, 86_400_000) : 0, timingValid: timingValid && finite, source, at };
}
export function observe(state: ArenaState, s: LaneSpec, o: Observation): ArenaState {
  const lane = getLane(state, s);
  if (lane.recent.some(x => x.id === o.id)) return state;
  return { ...state, lanes: { ...state.lanes, [laneKey(s)]: { ...lane, recent: [...lane.recent, o].slice(-40) } } };
}
export function meanIndependent(items: Observation[], min = 10): number | null {
  const clean = items.filter(o => o.correct && !o.hint && timed(o));
  return clean.length >= min ? clean.reduce((n, o) => n + o.elapsedMs, 0) / clean.length : null;
}
/** Only complete ten-question sessions feed disjoint twenty-question comparisons.
 * Partial sessions retain their first attempts but cannot improve a record. */
export function finishSession(state: ArenaState, s: LaneSpec, sessionId: string, answers: Observation[], now = Date.now()): { state: ArenaState; bonus: string | null; comparison: Comparison | null } {
  const unchanged = { state, bonus: null, comparison: null };
  if (state.completed.includes(sessionId) || answers.length !== SESSION || new Set(answers.map(a => a.id)).size !== SESSION || new Set(answers.map(a => a.fact)).size !== SESSION) return unchanged;
  const lane = getLane(state, s);
  if (answers.some(a => a.source !== "arena" || !lane.recent.some(r => r.id === a.id && JSON.stringify(r) === JSON.stringify(a)))) return unchanged;
  let next: ArenaState = { ...state, completed: [...state.completed, sessionId].slice(-80), lanes: { ...state.lanes } };
  let updated = { ...lane, pending: [...lane.pending, ...answers] };
  let comparison: Comparison | null = null, bonus: string | null = null;
  if (updated.pending.length === WINDOW) {
    const block = updated.pending;
    const qualified = block.every(o => o.correct && !o.hint && timed(o));
    const meanMs = meanIndependent(block, 10);
    const record = qualified && meanMs !== null && lane.bestMs !== null && meanMs <= lane.bestMs * 0.95;
    comparison = { at: now, correct: block.filter(o => o.correct).length, independent: block.filter(o => o.correct && !o.hint && timed(o)).length, meanMs, qualified, record };
    updated = { ...updated, pending: [], comparisons: [...lane.comparisons, comparison].slice(-24) };
    if (qualified && meanMs !== null) {
      updated.baselineMs ??= meanMs;
      if (lane.bestMs === null || record) updated.bestMs = meanMs;
    }
    const day = dateKey(now);
    if (record && next.bonusCount < 3 && (next.bonusDay === null || day > next.bonusDay)) {
      bonus = ["arena-lights", "arena-costume", "arena-badge"][next.bonusCount];
      next = { ...next, bonusCount: next.bonusCount + 1, bonusDay: day };
    }
  }
  next.lanes[laneKey(s)] = updated;
  return { state: next, bonus, comparison };
}
/** A finite domain makes ten distinct, comparable facts possible without retry loops. */
export function makeDeck(s: LaneSpec, rng = Math.random): Question[] {
  const pool = new Map<string, Question>();
  // Use the same generator's finite operands, enumerated to avoid random starvation.
  const limit = [10, 20, 50, 100, 200][s.level - 1];
  if (!limit || !OPERATIONS.includes(s.operation)) throw new Error("Geçersiz arena düzeyi");
  const bound = ["multiply", "divide"].includes(s.operation) ? Math.min(12, s.level * 2 + 2) : limit;
  for (let a = 1; a <= bound; a++) for (let b = 1; b <= bound; b++) {
    const values = [(a - 0.5) / bound, (b - 0.5) / bound];
    let index = 0;
    const draws = ["multiply", "divide"].includes(s.operation) ? 4 : 2;
    const q = generate(s.operation, s.level, () => index < draws ? values[index++ % 2] : rng());
    if (skillFor(q) === s.skill) pool.set(factKey(q), q);
  }
  const items = [...pool.values()];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.max(0, Math.min(0.999999, rng())) * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  if (items.length < SESSION) throw new Error("Bu beceri için yeterli farklı soru yok");
  return items.slice(0, SESSION);
}
export function decodeArena(raw: unknown): ArenaState {
  try {
    const s = raw as ArenaState;
    if (!s || s.version !== 1 || !s.lanes || typeof s.lanes !== "object" || Array.isArray(s.lanes) || Object.keys(s.lanes).length > 25 || !Array.isArray(s.completed) || s.completed.length > 80 || !s.completed.every(id => typeof id === "string") || !Number.isInteger(s.bonusCount) || s.bonusCount < 0 || s.bonusCount > 3 || !(s.bonusDay === null || /^\d{4}-\d{2}-\d{2}$/.test(s.bonusDay))) return freshArena();
    const validO = (o: Observation) => o && typeof o.id === "string" && typeof o.fact === "string" && typeof o.correct === "boolean" && typeof o.hint === "boolean" && typeof o.timingValid === "boolean" && Number.isFinite(o.elapsedMs) && o.elapsedMs >= 0 && Number.isFinite(o.at) && ["practice", "arena"].includes(o.source);
    for (const [key, l] of Object.entries(s.lanes)) {
      if (!OPERATIONS.includes(l.operation) || !Number.isInteger(l.level) || !specs(l.operation, l.level).some(x => x.skill === l.skill) || l.level < 1 || l.level > 5 || key !== laneKey(l) || !Array.isArray(l.recent) || l.recent.length > 40 || !l.recent.every(validO) || !Array.isArray(l.pending) || ![0, SESSION].includes(l.pending.length) || !l.pending.every(validO) || !Array.isArray(l.comparisons) || l.comparisons.length > 24 || ![l.baselineMs, l.bestMs].every(v => v === null || Number.isFinite(v) && v >= 300) || !l.comparisons.every(c => c && Number.isFinite(c.at) && Number.isInteger(c.correct) && c.correct >= 0 && c.correct <= WINDOW && Number.isInteger(c.independent) && c.independent >= 0 && c.independent <= c.correct && (c.meanMs === null || Number.isFinite(c.meanMs) && c.meanMs >= 300) && typeof c.qualified === "boolean" && typeof c.record === "boolean")) return freshArena();
    }
    return s;
  } catch { return freshArena(); }
}
