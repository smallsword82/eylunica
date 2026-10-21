import { describe, expect, it } from 'vitest';
import { matchesTerm } from './terms';
import { availableExamQuestions, createExam, readExams } from './exams';
import { topics, questions } from './catalog';

describe('verified semester scope', () => {
  it('uses week 18/19 boundary, preserves spanning topics and avoids guessing', () => {
    expect(matchesTerm({ weeks: [18] }, 'first')).toBe(true);
    expect(matchesTerm({ weeks: [19] }, 'first')).toBe(false);
    expect(matchesTerm({ weeks: [18,19] }, 'second')).toBe(true);
    for (const weeks of [[], [0], [37], [1, NaN]]) {
      expect(matchesTerm({ weeks }, 'first')).toBe(false);
      expect(matchesTerm({ weeks }, 'unknown')).toBe(true);
    }
  });
  it('filters individual topics even when a unit spans semesters', () => {
    const first = topics.find(t => t.weeks.includes(18) && questions.some(q => q.topicId === t.id))!;
    const second = topics.find(t => t.weeks.includes(19) && !t.weeks.some(w => w <= 18) && questions.some(q => q.topicId === t.id))!;
    const refs = [first, { ...second, courseId: first.courseId, unit: first.unit }];
    const result = availableExamQuestions(first.courseId, [first.unit], questions, refs, 'first');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(q => q.topicId === first.id)).toBe(true);
  });
  it('preserves old saved exams without assigning a semester', () => {
    const topic = topics.find(t => questions.some(q => q.topicId === t.id))!;
    const draft = createExam({ courseId: topic.courseId, units: [topic.unit], count: 2, seed: 1 });
    delete draft.term;
    const restored = readExams(JSON.stringify({ version: 1, drafts: { [topic.courseId]: draft }, history: [] })).drafts[topic.courseId];
    expect(restored.term).toBe('all');
    expect(restored.questionIds).toEqual(draft.questionIds);
  });
});
