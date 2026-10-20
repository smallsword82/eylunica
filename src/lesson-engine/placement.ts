import { stories, readingSkills } from "../reading-engine";
import { attentionKinds } from "../attention-engine";
import { freshAttention } from "./index";
import type { LearningResult, LearningState } from "../learning-engine";

export function placementStep(level: number, streak: number, result: Pick<LearningResult, "correct" | "hint">) {
  if (!result.correct || result.hint) return { level: Math.max(1, level - 1), streak: 0 };
  return streak === 1 ? { level: Math.min(3, level + 1), streak: 0 } : { level, streak: 1 };
}

export function placementTask(academy: "reading" | "attention", index: number, level: number, state: LearningState, rng = Math.random) {
  if (academy === "attention") return freshAttention(attentionKinds[index], level, state.seen, state.history.map(result => result.id), rng);
  const candidates = stories.filter(story => story.level === level).flatMap(story => story.questions);
  return candidates.find(task => task.skill === readingSkills[index] && !state.seen[task.id])
    ?? candidates.find(task => !state.seen[task.id])
    ?? stories.flatMap(story => story.questions).find(task => !state.seen[task.id])
    ?? null;
}
