import { it, expect } from "vitest";
import { placementStep, placementTask } from "./placement";
import { newLearning } from "../learning-engine";
it("iki bağımsız doğruyla yükselir; destek ve hatada kolaylaşır, sınırları aşmaz", () => {
  expect(placementStep(1, 0, { correct: true, hint: false })).toEqual({ level: 1, streak: 1 });
  expect(placementStep(1, 1, { correct: true, hint: false })).toEqual({ level: 2, streak: 0 });
  expect(placementStep(3, 1, { correct: true, hint: false }).level).toBe(3);
  expect(placementStep(2, 1, { correct: true, hint: true }).level).toBe(1);
  expect(placementStep(1, 1, { correct: false, hint: true }).level).toBe(1);
});
it("her akademi altı farklı beceriyi ve yeni soruları yoklar", () => {
  for (const academy of ["reading", "attention"] as const) {
    const state = newLearning();
    const skills = new Set<string>();
    for (let index = 0; index < 6; index++) {
      const task = placementTask(academy, index, 1, state, () => .5)!;
      expect(state.seen[task.id]).toBeUndefined();
      state.seen[task.id] = 1;
      skills.add(task.skill);
    }
    expect(skills.size).toBe(6);
  }
});
