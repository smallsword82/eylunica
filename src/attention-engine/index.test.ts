import { it, expect } from "vitest";
import { generateAttention, attentionKinds, checkSequence } from "./index";
for (const kind of attentionKinds)
  for (const level of [1, 2, 3])
    it(`${kind} düzey ${level}: çözülebilir ve tutarlı`, () => {
      for (let seed = 0; seed < 15; seed++) {
        let n = seed + 1;
        const rng = () => (n = (n * 1664525 + 1013904223) >>> 0) / 4294967296;
        const q = generateAttention(kind, level, rng);
        expect(q.choices.length).toBeGreaterThanOrEqual(4);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.choices.length);
        expect(q.explanation.length).toBeGreaterThan(20);
        if (kind === "odd") {
          const correct = q.choices[q.answer];
          expect(q.choices.filter((s) => s === correct)).toHaveLength(1);
          expect(new Set(q.choices).size).toBe(2);
        } else expect(new Set(q.choices).size).toBe(q.choices.length);
        if (kind === "memory") {
          expect(q.memory).toHaveLength(level + 2);
          expect(q.choices[q.answer]).toBe(q.memory!.join(" → "));
        }
        if (kind === "match") expect(q.choices[q.answer]).toBe(q.visual![0]);
        if (kind === "instructions") {
          expect(checkSequence(q, q.sequence!)).toBe(true);
          expect(checkSequence(q, q.sequence!.slice(1))).toBe(false);
          expect(checkSequence(q, [...q.sequence!].reverse())).toBe(false);
          expect(checkSequence(q, [...q.sequence!, 0])).toBe(false);
        }
      }
    });
it("düzey arttıkça arama alanı ve yönerge uzar", () => {
  expect(generateAttention("odd", 3).choices.length).toBeGreaterThan(
    generateAttention("odd", 1).choices.length,
  );
  expect(generateAttention("instructions", 3).sequence!.length).toBeGreaterThan(
    generateAttention("instructions", 1).sequence!.length,
  );
});
