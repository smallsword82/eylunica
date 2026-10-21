import { describe, expect, it, vi } from 'vitest';
import type { Question } from './catalog';
import {
  availableExamQuestions, selectExamQuestions, createExam, scoreExam,
  completeExam, readExams, examStorageKey, type ExamDraft, type ExamStore,
} from './exams';

// Pure exam algorithms use fixtures; curriculum/content integration is covered
// by the catalog and student-flow suites.
vi.mock('./catalog', () => ({ questions: [], topics: [], questionById: new Map(), questionsByTopic: new Map(), topicById: new Map() }));

const references = [
  { id: 'a', courseId: 'math', unit: 'Birinci ünite' },
  { id: 'b', courseId: 'math', unit: 'Birinci ünite' },
  { id: 'c', courseId: 'math', unit: 'İkinci ünite' },
  { id: 'd', courseId: 'science', unit: 'Birinci ünite' },
];
const pool: Question[] = references.flatMap(topic => [1, 2, 3, 4].map(difficulty => ({
  id: `${topic.id}${difficulty}`, topicId: topic.id, prompt: `${topic.id} konusu, ${difficulty}. soru`,
  difficulty: difficulty as Question['difficulty'], kind: 'fill' as const,
  answer: String(difficulty * 2), explanation: 'İşlem adımlarını gözden geçir.', hints: ['Verilen sayıyı ikiyle çarp.'], outcomeCode: null,
})));
const selection = { courseId: 'math', units: ['Birinci ünite', 'İkinci ünite'], count: 12, seed: 17 };
const empty: ExamStore = { version: 1, drafts: {}, history: [] };

describe('5. sınıf yazılı hazırlığı', () => {
  it('yalnız seçilen ders ve ünitelerin sorularını alır; kaynak veriyi değiştirmez', () => {
    const before = structuredClone(pool);
    expect(availableExamQuestions('math', ['Birinci ünite'], pool, references)).toHaveLength(8);
    expect(selectExamQuestions({ ...selection, units: ['İkinci ünite'] }, pool, references).map(question => question.topicId)).toEqual(['c', 'c', 'c', 'c']);
    expect(selectExamQuestions({ ...selection, units: [] }, pool, references)).toEqual([]);
    expect(selectExamQuestions({ ...selection, courseId: 'missing' }, pool, references)).toEqual([]);
    expect(pool).toEqual(before);
  });

  it('konulara sıra ile pay verir ve dört zorluk düzeyini kapsar', () => {
    const selected = selectExamQuestions(selection, pool, references);
    expect(selected).toHaveLength(12);
    expect(new Set(selected.slice(0, 3).map(question => question.topicId)).size).toBe(3);
    expect(selected.slice(0, 3).map(question => question.difficulty)).toEqual([1, 2, 3]);
    for (const id of ['a', 'b', 'c']) expect(selected.filter(question => question.topicId === id).map(question => question.difficulty).sort()).toEqual([1, 2, 3, 4]);
  });

  it('aynı tohum aynı yazılıyı üretir, oturumlar soruların sırasını değiştirebilir', () => {
    const first = selectExamQuestions(selection, pool, references).map(question => question.id);
    expect(selectExamQuestions(selection, pool, references).map(question => question.id)).toEqual(first);
    expect(new Set(Array.from({ length: 15 }, (_, seed) => selectExamQuestions({ ...selection, seed }, pool, references).map(question => question.id).join(','))).size).toBeGreaterThan(1);
  });

  it('soru sayısı mevcut havuzla sınırlanır; aynı kimlik veya metin iki kez sorulmaz', () => {
    const repeated = [...pool, { ...pool[0], id: 'copy', topicId: 'c', prompt: `  ${pool[0].prompt}  ` }, pool[0]];
    const selected = selectExamQuestions({ ...selection, count: 100 }, repeated, references);
    expect(selected).toHaveLength(12);
    expect(new Set(selected.map(question => question.id)).size).toBe(12);
    expect(selectExamQuestions({ ...selection, count: Number.NaN }, pool, references)).toEqual([]);
    expect(selectExamQuestions({ ...selection, count: -5 }, pool, references)).toEqual([]);
  });

  it('soru olmayan kapsam için yanıltıcı boş yazılı başlatmaz', () => {
    expect(() => createExam({ ...selection, units: [] }, 1000, pool, references)).toThrow(/hazır soru yok/);
    const draft = createExam({ ...selection, count: 20 }, 1000, pool, references);
    expect(draft.questionIds).toHaveLength(12);
    expect(draft.answers).toEqual({});
    expect(draft.startedAt).toBe(1000);
  });

  it('doğru, yanlış ve boşları ayrı sayıp boşları puanlandırmaz; konu dökümü verir', () => {
    const draft: ExamDraft = { id: 'x', courseId: 'math', units: [], questionIds: ['a1', 'a2', 'c3', 'c4'], startedAt: 1000,
      answers: { a1: ' 2 ', a2: '99', c3: '  ', c4: '8' } };
    const score = scoreExam(draft, pool);
    expect({ total: score.total, correct: score.correct, wrong: score.wrong, blank: score.blank, score: score.score })
      .toEqual({ total: 4, correct: 2, wrong: 1, blank: 1, score: 50 });
    expect(score.byTopic).toEqual([
      { topicId: 'a', total: 2, correct: 1, wrong: 1, blank: 0, score: 50 },
      { topicId: 'c', total: 2, correct: 1, wrong: 0, blank: 1, score: 50 },
    ]);
    expect(score.details.map(row => row.status)).toEqual(['correct', 'wrong', 'blank', 'correct']);
  });

  it('puanlamada yinelenen veya sonradan silinen soruyu tekrar saymaz', () => {
    const draft: ExamDraft = { id: 'x', courseId: 'math', units: [], questionIds: ['a1', 'a1', 'removed'], answers: { a1: '2' }, startedAt: 0 };
    expect(scoreExam(draft, pool).score).toBe(100);
    expect(scoreExam(draft, pool).total).toBe(1);
    expect(scoreExam({ ...draft, questionIds: [] }, pool).score).toBe(0);
  });

  it('yeniden açılışta aynı sorular ve yanıtlarla kaldığı yerden devam eder', () => {
    const draft = createExam(selection, 1000, pool, references);
    draft.answers[draft.questionIds[0]] = '2';
    const store: ExamStore = { version: 1, drafts: { math: draft }, history: [] };
    expect(readExams(JSON.stringify(store), pool, references)).toEqual(store);
    expect(examStorageKey).not.toBe('ritma-progress-v1');
    expect(examStorageKey).not.toBe('eylunica-grade5-v1');
  });

  it('bozuk ve eski kayıtları ayıklar; yabancı ders soruları ve yanıtları içeri almaz', () => {
    expect(readExams('{broken', pool, references)).toEqual(empty);
    expect(readExams(JSON.stringify({ version: 2, history: [] }), pool, references)).toEqual(empty);
    const saved = readExams(JSON.stringify({ version: 1, drafts: { math: {
      id: 'x', courseId: 'math', units: ['yanlış ünite'], startedAt: 1000,
      questionIds: ['a1', 'a1', 'd1', 'removed', null], answers: { a1: '2', d1: '2', removed: '3' },
    }, science: null }, history: [null, { finishedAt: 'yesterday' }] }), pool, references);
    expect(saved.drafts.math.questionIds).toEqual(['a1']);
    expect(saved.drafts.math.units).toEqual(['Birinci ünite']);
    expect(saved.drafts.math.answers).toEqual({ a1: '2' });
    expect(saved.history).toEqual([]);
  });

  it('biten yazılı taslağı kaldırılır ve geçmişe yalnız bir kez eklenir', () => {
    const draft = createExam(selection, 1000, pool, references);
    const store: ExamStore = { ...empty, drafts: { math: draft } };
    const completed = completeExam(store, draft, 2000);
    expect(completed.drafts.math).toBeUndefined();
    expect(store.drafts.math).toEqual(draft);
    expect(completed.history).toEqual([{ ...draft, finishedAt: 2000 }]);
    expect(completeExam(completed, draft, 2000).history).toHaveLength(1);
    expect(readExams(JSON.stringify(completed), pool, references)).toEqual(completed);
  });

  it('yazılı geçmişini son 20 çalışma ile sınırlar', () => {
    const draft = createExam(selection, 1000, pool, references);
    let store = empty;
    for (let index = 0; index < 25; index++) store = completeExam(store, { ...draft, id: String(index) }, 2000 + index);
    expect(store.history).toHaveLength(20);
    expect(store.history[0].id).toBe('5');
    expect(readExams(JSON.stringify(store), pool, references).history).toHaveLength(20);
  });
});
