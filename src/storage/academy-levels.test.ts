import { expect, it } from 'vitest';
import { fresh } from './index';
import { completeAcademyLevel } from './academy-levels';

it('opens only the next completed level and never skips a locked level when replaying', () => {
  for (const academy of ['reading', 'attention'] as const) {
    const original = fresh();
    original.stars = 19;
    original.skills.add.attempts = 7;
    const second = completeAcademyLevel(original, academy, 1);
    expect(second.academyUnlocked?.[academy]).toBe(2);
    expect(completeAcademyLevel(second, academy, 1)).toEqual(second);
    expect(completeAcademyLevel(original, academy, 2)).toEqual(original);
    const third = completeAcademyLevel(second, academy, 2);
    expect(third.academyUnlocked?.[academy]).toBe(3);
    expect(completeAcademyLevel(third, academy, 3)).toEqual(third);
    expect(third.stars).toBe(19);
    expect(third.skills).toEqual(original.skills);
    expect(original.academyUnlocked).toBeUndefined();
  }
});
