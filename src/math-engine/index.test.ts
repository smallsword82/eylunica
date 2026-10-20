import { describe, it, expect } from "vitest";
import { generate, strategy, type Operation } from "./index";
describe("Dört işlem motoru", () => {
  for (const op of ["add", "subtract", "multiply", "divide"] as Operation[])
    for (let level = 1; level <= 5; level++)
      it(`${op} seviye ${level}: doğru, tam ve benzersiz yanıtlar`, () => {
        for (let i = 0; i < 200; i++) {
          const q = generate(op, level);
          expect(q.answer).toBe(
            op === "add"
              ? q.a + q.b
              : op === "subtract"
                ? q.a - q.b
                : op === "multiply"
                  ? q.a * q.b
                  : q.a / q.b,
          );
          expect(q.answer).toBeGreaterThanOrEqual(0);
          expect(Number.isInteger(q.answer)).toBe(true);
          expect(q.options).toHaveLength(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.options).toContain(q.answer);
          if (op === "divide") {
            expect(q.b).toBeGreaterThan(0);
            expect(q.a % q.b).toBe(0);
          }
        }
      });
  it("8 + 7 için onluk tamamlama gösterir", () => {
    expect(
      strategy({
        a: 8,
        b: 7,
        answer: 15,
        operation: "add",
        options: [],
        level: 1,
      }).steps,
    ).toEqual([
      "8 sayısını bir sonraki onluğa taşımak için 2 ekle.",
      "7 = 2 + 5",
      "8 + 2 = 10",
      "10 + 5 = 15",
    ]);
  });
  it("seviye sınırlarını korur", () => {
    expect(generate("add", -10).level).toBe(1);
    expect(generate("divide", 99).level).toBe(5);
  });
  it("sınır rastgele değerlerinde sıfıra bölme üretmez", () => {
    for (const r of [0, 0.999999])
      expect(generate("divide", 1, () => r).b).toBeGreaterThan(0);
  });
});
