import { it, expect } from "vitest";
import { newLearning, advanceLearning, validLearning } from "./index";
const result = {
  id: "test",
  skill: "Ana fikir",
  correct: true,
  hint: false,
  elapsedMs: 90000,
};
it("dört bağımsız başarı zorluğu artırır; hız etkilemez", () => {
  let a = newLearning(),
    b = newLearning();
  for (let i = 0; i < 4; i++) {
    a = advanceLearning(a, result);
    b = advanceLearning(b, { ...result, elapsedMs: 10 });
  }
  expect(a.level).toBe(2);
  expect(b.level).toBe(2);
  expect(a.independent).toBe(4);
  expect(a.bySkill["Ana fikir"].correct).toBe(4);
});
it("ipucuyla başarı yıldızdan bağımsız olarak ayrı izlenir ve düzeyi şişirmez", () => {
  let p = newLearning();
  for (let i = 0; i < 5; i++) p = advanceLearning(p, { ...result, hint: true });
  expect(p.level).toBe(1);
  expect(p.hints).toBe(5);
  expect(p.independent).toBe(0);
});
it("zorlanmada düşer, sınırları aşmaz ve girdiyi değiştirmez", () => {
  const source = newLearning();
  let p = { ...source, level: 2 };
  for (let i = 0; i < 3; i++)
    p = advanceLearning(p, { ...result, correct: false, hint: true });
  expect(p.level).toBe(1);
  expect(source.attempts).toBe(0);
  for (let i = 0; i < 20; i++) p = advanceLearning(p, result);
  expect(p.level).toBe(3);
});
it("geçmiş ve soru tekrar sayıları sınırlıdır; bozuk şema reddedilir", () => {
  let p = newLearning();
  for (let i = 0; i < 250; i++)
    p = advanceLearning(p, { ...result, id: `q-${i}` });
  expect(p.history).toHaveLength(200);
  expect(Object.keys(p.seen)).toHaveLength(120);
  expect(validLearning(p)).toBe(true);
  expect(validLearning({ ...p, level: 4 })).toBe(false);
  expect(validLearning({ ...p, correct: 999 })).toBe(false);
});
