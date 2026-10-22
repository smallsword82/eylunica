import { expect, it } from "vitest";
import { freshQuestion, freshStrategy, questionKey, freshAttention, nextStory, readingStep } from "./index";
import { stories } from "../reading-engine";
import type { Question } from "../math-engine";
it("matematik kolay başlar ve son 200 işlemi ters sırayla da tekrarlamaz", () => {
  for (const operation of ["add", "subtract", "multiply", "divide"] as const) {
    const history: Question[] = [];
    for (let index = 0; index < 210; index++) {
      const question = freshQuestion(operation, 1, history, () => .5);
      expect(history.slice(-200).map(questionKey)).not.toContain(questionKey(question));
      if (index === 0) expect(question.level).toBe(1);
      history.push(question);
    }
  }
});
it("strateji dersine yeniden girince 8+7 başa sarmaz", () => {
  const first = freshStrategy(1, []);
  const second = freshStrategy(1, [first]);
  expect(questionKey(first)).toBe("add:7:8");
  expect(questionKey(second)).not.toBe(questionKey(first));
});
it("üst düzeyde sayılar kademeli büyür", () => {
  for (const level of [1, 2, 3, 4, 5]) {
    const question = freshQuestion("add", level, [], () => .5);
    expect(question.answer).toBeLessThanOrEqual([10, 20, 50, 100, 200][level - 1]);
    if (level > 1) expect(question.answer).toBeGreaterThan([10, 20, 50, 100][level - 2]);
  }
});
it("dikkatte yeni varyantlar yakın geçmişteki görünümü tekrarlamaz", () => {
  for (const kind of ["odd", "pattern", "match", "memory", "instructions", "detail"] as const) {
    const seen: Record<string, number> = {}, history: string[] = [], fingerprints: string[] = [];
    for (let index = 0; index < 12; index++) {
      const task = freshAttention(kind, 1, seen, history, () => .5);
      const fingerprint = JSON.stringify([task.prompt, task.sentences, task.visual, task.memory, kind === "odd" ? task.choices : [...task.choices].sort()]);
      expect(fingerprints).not.toContain(fingerprint);
      expect(seen[task.id]).toBeUndefined();
      seen[task.id] = 1; history.push(task.id); fingerprints.push(fingerprint);
    }
  }
});
it("okuma yarım hikâyenin yalnız yeni sorularıyla devam eder; tümü bitince tekrar etmez", () => {
  const seen = { [stories[0].questions[0].id]: 1 };
  expect(nextStory(1, seen)?.questions[0].id).toBe(stories[0].questions[1].id);
  const firstLevel = Object.fromEntries(stories.filter(story => story.level === 1).flatMap(story => story.questions.map(question => [question.id, 1])));
  expect(readingStep(firstLevel)).toBe(2);
  expect(nextStory(1, firstLevel)?.level).toBe(2);
  const allSeen = Object.fromEntries(stories.flatMap(story => story.questions.map(question => [question.id, 1])));
  expect(nextStory(1, allSeen)).toBeNull();
});
it('selected reading levels never borrow a story from a locked or different level', () => {
  const seen = Object.fromEntries(stories.filter(story => story.level === 1).flatMap(story => story.questions.map(question => [question.id, 1])));
  expect(nextStory(1, seen, true)).toBeNull();
  expect(nextStory(2, seen, true)?.level).toBe(2);
  expect(nextStory(1, {}, true)?.level).toBe(1);
});
