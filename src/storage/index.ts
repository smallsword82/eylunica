import {
  newLearning,
  advanceLearning,
  validLearning,
  type Academy,
  type LearningState,
  type LearningResult,
} from "../learning-engine";
import { normalizeCharacter } from "../game";
import { freshArena, decodeArena, observe, observation, specFor, finishSession, type ArenaState, type LaneSpec, type Observation } from "../arena-engine";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import type { Operation, Question } from "../math-engine";
export type Skill = {
  level: number;
  correct: number;
  attempts: number;
  hints: number;
  streak: number;
  recent: boolean[];
  lastPlayed: number;
};
export type Attempt = {
  operation: Operation;
  correct: boolean;
  hint: boolean;
  elapsedMs: number;
  at: number;
  a: number;
  b: number;
  level?: number;
  skill?: string;
  timingValid?: boolean;
};
export type Progress = {
  version: 2;
  academies: Record<Academy, LearningState>;
  character: string;
  learnerName?: string;
  customCharacter?: { character: string; name: string };
  stars: number;
  skills: Record<Operation, Skill>;
  history: Attempt[];
  calibrationDone: boolean;
  rewards: string[];
  arena: ArenaState;
  mathSections?: Record<string, number>;
  assessmentPending?: boolean;
};
export const KEY = "ritma-progress-v1";
const skill = (): Skill => ({
  level: 1,
  correct: 0,
  attempts: 0,
  hints: 0,
  streak: 0,
  recent: [],
  lastPlayed: 0,
});
export const fresh = (): Progress => ({
  version: 2,
  academies: {
    reading: newLearning(),
    attention: newLearning(),
    concert: newLearning(),
  },
  character: "Mina",
  learnerName: "Eylül",
  stars: 0,
  skills: {
    add: skill(),
    subtract: skill(),
    multiply: skill(),
    divide: skill(),
  },
  history: [],
  calibrationDone: false,
  rewards: [],
  arena: freshArena(),
});
export function decode(raw: string | null): Progress {
  if (!raw) return fresh();
  try {
    const p = JSON.parse(raw);
    if (
      (p.version !== 1 && p.version !== 2) ||
      !Number.isInteger(p.stars) ||
      p.stars < 0 ||
      typeof p.character !== "string" ||
      typeof p.calibrationDone !== "boolean" ||
      !Array.isArray(p.history) ||
      !Array.isArray(p.rewards)
    )
      return fresh();
    for (const op of ["add", "subtract", "multiply", "divide"]) {
      const s = p.skills?.[op];
      if (
        !s ||
        !Number.isInteger(s.level) ||
        s.level < 1 ||
        s.level > 5 ||
        !["correct", "attempts", "hints", "streak", "lastPlayed"].every(
          (k) => Number.isFinite(s[k]) && s[k] >= 0,
        ) ||
        !Array.isArray(s.recent) ||
        !s.recent.every((x: unknown) => typeof x === "boolean")
      )
        return fresh();
    }
    p.character = normalizeCharacter(p.character);
    p.learnerName = typeof p.learnerName === "string" && p.learnerName.trim()
      ? p.learnerName.trim().slice(0, 24)
      : typeof p.customCharacter?.name === "string" && p.customCharacter.name.trim()
        ? p.customCharacter.name.trim().slice(0, 24) : "Eylül";
    p.arena = decodeArena(p.arena);
    if (p.mathSections) p.mathSections = Object.fromEntries(Object.entries(p.mathSections).filter(([key, value]) => ["add", "subtract", "multiply", "divide", "mixed", "strategy"].includes(key) && Number.isSafeInteger(value) && (value as number) >= 0));
    if (p.customCharacter) {
      const custom = p.customCharacter;
      if (typeof custom.character === "string" && typeof custom.name === "string" && custom.name.trim())
        p.customCharacter = { character: normalizeCharacter(custom.character), name: custom.name.trim().slice(0, 24) };
      else delete p.customCharacter;
    }
    if (p.version === 1)
      return {
        ...p,
        version: 2,
        academies: {
          reading: newLearning(),
          attention: newLearning(),
          concert: newLearning(),
        },
      };
    if (
      !p.academies ||
      !["reading", "attention", "concert"].every((k) =>
        validLearning(p.academies[k]),
      )
    )
      return fresh();
    return p;
  } catch {
    return fresh();
  }
}
export async function loadProgress(): Promise<Progress> {
  const raw = Capacitor.isNativePlatform()
    ? (await Preferences.get({ key: KEY })).value
    : localStorage.getItem(KEY);
  return raw ? decode(raw) : { ...fresh(), assessmentPending: true };
}
export async function saveProgress(p: Progress): Promise<void> {
  if (Capacitor.isNativePlatform())
    await Preferences.set({ key: KEY, value: JSON.stringify(p) });
  else localStorage.setItem(KEY, JSON.stringify(p));
}
export function record(
  p: Progress,
  q: Question,
  correct: boolean,
  hint: boolean,
  elapsedMs: number,
  timingValid = false,
  source: "practice" | "concert" = "practice",
): Progress {
  const next = structuredClone(p),
    s = next.skills[q.operation];
  s.attempts++;
  s.level = Math.max(s.level, q.level);
  if (correct) s.correct++;
  if (hint) s.hints++;
  s.streak = correct && !hint ? s.streak + 1 : 0;
  s.recent = [...s.recent, correct].slice(-8);
  s.lastPlayed = Date.now();
  if (s.streak >= 5) {
    s.level = Math.min(5, s.level + 1);
    s.streak = 0;
  }
  if (s.recent.length >= 4 && s.recent.slice(-4).filter(Boolean).length <= 1) {
    s.level = Math.max(1, s.level - 1);
    s.recent = [];
  }
  if (correct) next.stars++;
  if (next.stars >= 5 && !next.rewards.includes("lights"))
    next.rewards.push("lights");
  if (next.stars >= 15 && !next.rewards.includes("confetti"))
    next.rewards.push("confetti");
  next.history = [
    ...next.history,
    {
      operation: q.operation,
      correct,
      hint,
      elapsedMs: Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0,
      at: Date.now(),
      a: q.a,
      b: q.b,
      level: q.level,
      skill: specFor(q).skill,
      timingValid,
    },
  ].slice(-200);
  if (source === "practice") next.arena = observe(next.arena, specFor(q), observation(q, correct, hint, elapsedMs, timingValid, "practice", crypto.randomUUID()));
  return next;
}

export function recordArena(p: Progress, spec: LaneSpec, answer: Observation): Progress {
  return { ...p, arena: observe(p.arena, spec, answer) };
}
export function completeArena(p: Progress, spec: LaneSpec, sessionId: string, answers: Observation[], now = Date.now()) {
  const result = finishSession(p.arena, spec, sessionId, answers, now);
  const next = { ...p, arena: result.state, rewards: [...p.rewards] };
  if (result.bonus && !next.rewards.includes(result.bonus)) {
    next.rewards.push(result.bonus);
    next.stars += 3;
  }
  return { progress: unlockRewards(next), bonus: result.bonus, comparison: result.comparison };
}

export function recordAcademy(
  p: Progress,
  academy: Academy,
  result: LearningResult,
): Progress {
  const next = structuredClone(p);
  next.academies[academy] = advanceLearning(next.academies[academy], result);
  if (result.correct) next.stars++;
  return unlockRewards(next);
}
export function trackConcert(p: Progress, result: LearningResult): Progress {
  const next = structuredClone(p);
  next.academies.concert = advanceLearning(next.academies.concert, result);
  return next;
}
function unlockRewards(p: Progress): Progress {
  if (p.stars >= 5 && !p.rewards.includes("lights")) p.rewards.push("lights");
  if (p.stars >= 15 && !p.rewards.includes("confetti"))
    p.rewards.push("confetti");
  return p;
}
