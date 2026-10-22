import type { Progress } from './index';

/** Replaying an earlier level cannot unlock an unfinished later level. */
export function completeAcademyLevel(progress: Progress, academy: 'reading' | 'attention', level: number): Progress {
  const unlocked = progress.academyUnlocked ?? { math: 1, reading: 1, attention: 1 };
  if (!Number.isInteger(level) || level < 1 || level > unlocked[academy]) return progress;
  return { ...progress, academyUnlocked: { ...unlocked, [academy]: Math.min(3, Math.max(unlocked[academy], level + 1)) } };
}
