import { it, expect } from "vitest";
import { concert } from "./index";
import { fresh, record, recordAcademy, trackConcert } from "../storage";
it("konser seviyeleri tutarlı ve tam sonuçlu sayısal bağlam taşır", () => {
  for (const level of [1, 2, 3])
    for (let round = 0; round < 5; round++) {
      const m = concert(level, round);
      expect(m.tasks).toHaveLength(3);
      expect(m.sentences[1]).toContain(String(m.math.a));
      expect(m.sentences[1]).toContain(String(m.math.b));
      expect(Number.isInteger(m.math.answer)).toBe(true);
      expect(Number(m.tasks[2].choices[m.tasks[2].answer])).toBe(m.math.answer);
      expect(new Set(m.tasks[1].sequence).size).toBe(3);
      for (const index of m.tasks[1].sequence!) expect(m.tasks[1].choices[index]).toBeTruthy();
    }
});
it("üç akademi ve konser ayrı izlenir, her adım yalnız bir yıldız verir", () => {
  let p = fresh();
  const m = concert(1);
  for (const [i, q] of m.tasks.entries()) {
    const r = {
      id: q.id,
      skill: q.skill,
      correct: true,
      hint: false,
      elapsedMs: 3000,
    };
    p =
      i === 2
        ? record(p, m.math, true, false, 3000)
        : recordAcademy(p, i === 0 ? "reading" : "attention", r);
    p = trackConcert(p, r);
  }
  expect(p.stars).toBe(3);
  expect(p.academies.reading.attempts).toBe(1);
  expect(p.academies.attention.attempts).toBe(1);
  expect(p.skills.add.attempts).toBe(1);
  expect(p.academies.concert.attempts).toBe(3);
});
