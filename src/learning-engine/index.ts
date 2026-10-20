export type Academy = "reading" | "attention" | "concert";
export type Activity = {
  id: string;
  skill: string;
  title: string;
  prompt: string;
  choices: string[];
  answer: number;
  hint: string;
  explanation: string;
  sentences?: string[];
  evidence?: number[];
  visual?: string[];
  memory?: string[];
  sequence?: number[];
};
export type LearningResult = {
  id: string;
  skill: string;
  correct: boolean;
  hint: boolean;
  elapsedMs: number;
};
export type SkillStats = {
  attempts: number;
  correct: number;
  hints: number;
  independent: number;
};
export type LearningState = SkillStats & {
  placementDone?: boolean;
  level: number;
  streak: number;
  recent: boolean[];
  seen: Record<string, number>;
  bySkill: Record<string, SkillStats>;
  history: LearningResult[];
};
export const newLearning = (): LearningState => ({
  level: 1,
  attempts: 0,
  correct: 0,
  hints: 0,
  independent: 0,
  streak: 0,
  recent: [],
  seen: {},
  bySkill: {},
  history: [],
});
export function advanceLearning(
  state: LearningState,
  result: LearningResult,
): LearningState {
  const s = structuredClone(state),
    independent = result.correct && !result.hint;
  s.attempts++;
  s.correct += Number(result.correct);
  s.hints += Number(result.hint);
  s.independent += Number(independent);
  s.streak = independent ? s.streak + 1 : 0;
  s.recent = [...s.recent, result.correct].slice(-6);
  if (s.streak >= 4) {
    s.level = Math.min(3, s.level + 1);
    s.streak = 0;
    s.recent = [];
  } else if (
    s.recent.length >= 3 &&
    s.recent.slice(-3).filter(Boolean).length <= 1
  ) {
    s.level = Math.max(1, s.level - 1);
    s.streak = 0;
    s.recent = [];
  }
  s.seen[result.id] = (s.seen[result.id] || 0) + 1;
  // Bounded device-only history; no timing thresholds influence rewards or levels.
  s.seen = Object.fromEntries(Object.entries(s.seen).slice(-120));
  const stat = s.bySkill[result.skill] || {
    attempts: 0,
    correct: 0,
    hints: 0,
    independent: 0,
  };
  stat.attempts++;
  stat.correct += Number(result.correct);
  stat.hints += Number(result.hint);
  stat.independent += Number(independent);
  s.bySkill[result.skill] = stat;
  s.history = [
    ...s.history,
    { ...result, elapsedMs: Math.max(0, result.elapsedMs) },
  ].slice(-200);
  return s;
}
export function validLearning(s: unknown): s is LearningState {
  if (!s || typeof s !== "object") return false;
  const p = s as LearningState;
  const counts = (v: SkillStats) =>
    v &&
    ["attempts", "correct", "hints", "independent"].every(
      (k) =>
        Number.isInteger(v[k as keyof SkillStats]) &&
        v[k as keyof SkillStats] >= 0,
    ) &&
    v.correct <= v.attempts &&
    v.hints <= v.attempts &&
    v.independent <= v.correct;
  return (
    counts(p) &&
    Number.isInteger(p.level) &&
    p.level >= 1 &&
    p.level <= 3 &&
    Number.isInteger(p.streak) &&
    p.streak >= 0 &&
    Array.isArray(p.recent) &&
    p.recent.length <= 6 &&
    p.recent.every((x) => typeof x === "boolean") &&
    !!p.seen &&
    typeof p.seen === "object" &&
    !Array.isArray(p.seen) &&
    Object.values(p.seen).every((x) => Number.isInteger(x) && x >= 0) &&
    !!p.bySkill &&
    typeof p.bySkill === "object" &&
    Object.values(p.bySkill).every(counts) &&
    Array.isArray(p.history) &&
    p.history.every(
      (x) =>
        x &&
        typeof x.id === "string" &&
        typeof x.skill === "string" &&
        typeof x.correct === "boolean" &&
        typeof x.hint === "boolean" &&
        Number.isFinite(x.elapsedMs) &&
        x.elapsedMs >= 0,
    )
  );
}
