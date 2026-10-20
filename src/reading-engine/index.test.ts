import { describe, it, expect } from "vitest";
import { stories, readingSkills, chooseStory, checkReading } from "./index";
describe("Özgün okuma havuzu", () => {
  it("üç düzeyde altı hikâye ve altı beceri için 36 soru içerir", () => {
    expect(stories).toHaveLength(6);
    expect(stories.flatMap((s) => s.questions)).toHaveLength(36);
    for (const level of [1, 2, 3])
      expect(stories.filter((s) => s.level === level)).toHaveLength(2);
    expect(
      new Set(stories.flatMap((s) => s.questions.map((q) => q.id))).size,
    ).toBe(36);
  });
  for (const story of stories)
    it(`${story.title}: yanıt ve kanıt birlikte gereklidir`, () => {
      expect(story.questions.map((q) => q.skill)).toEqual([...readingSkills]);
      for (const q of story.questions) {
        expect(new Set(q.choices).size).toBe(4);
        expect(q.explanation.length).toBeGreaterThan(30);
        expect(q.evidence!.length).toBeGreaterThan(0);
        for (const i of q.evidence!) {
          expect(story.sentences[i]).toBeTruthy();
          expect(checkReading(q, q.answer, i)).toBe(true);
        }
        expect(checkReading(q, (q.answer + 1) % 4, q.evidence![0])).toBe(false);
        expect(checkReading(q, q.answer, -1)).toBe(false);
      }
    });
  it("düzey arttıkça metinler uzar", () => {
    const words = (level: number) =>
      stories
        .filter((s) => s.level === level)
        .map((s) => s.sentences.join(" ").split(/\s+/).length);
    expect(Math.min(...words(2))).toBeGreaterThan(Math.max(...words(1)));
    expect(Math.min(...words(3))).toBeGreaterThan(Math.max(...words(2)));
  });
  it("aynı düzeyde daha az çalışılmış hikâyeyi önerir", () => {
    const first = chooseStory(2, {});
    const seen = Object.fromEntries(first.questions.map((q) => [q.id, 1]));
    expect(chooseStory(2, seen).id).not.toBe(first.id);
  });
});
