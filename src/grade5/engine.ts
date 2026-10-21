import { questionById, questionsByTopic, topicById, type Question } from './catalog';
export type Attempt = { questionId: string; correct: boolean; hinted: boolean; at: number };
export type Learning = { version: 1; attempts: Attempt[] };
export const learningKey = 'eylunica-grade5-v1';
export function readLearning(raw: string | null): Learning {
  try { const parsed = JSON.parse(raw || 'null');
    if (parsed?.version === 1 && Array.isArray(parsed.attempts)) return { version: 1, attempts: parsed.attempts.filter((a: Attempt) => questionById.has(a?.questionId) && typeof a.correct === 'boolean' && typeof a.hinted === 'boolean' && Number.isFinite(a.at)).slice(-500) };
  } catch { /* corrupted or unavailable data starts a separate record */ }
  return { version: 1, attempts: [] };
}
const normalize = (value: string, locale: string) => value.normalize('NFC').trim().toLocaleLowerCase(locale).replace(/[’‘ʼ]/g, "'").replace(/\s+/g, '');
export function isCorrect(q: Question, answer: string): boolean {
  const courseId = topicById.get(q.topicId)?.courseId;
  const locale = courseId === 'course-5' ? 'de' : ['course-4', 'meb-course-35'].includes(courseId || '') ? 'en' : 'tr';
  let expected = normalize(q.answer, locale), given = normalize(answer, locale);
  if (courseId === 'course-1' && q.kind === 'fill') {
    const percent = (value: string) => value.replace(/^%(-?\d+(?:[.,]\d+)?)$/, '$1%');
    expected = percent(expected); given = percent(given);
    if (/^-?\d+[,.]\d+%?$/.test(expected) && /^-?\d+[,.]\d+%?$/.test(given)) {
      expected = expected.replace(',', '.'); given = given.replace(',', '.');
    }
  }
  return expected === given;
}
export function recordAttempt(state: Learning, question: Question, answer: string, hinted: boolean): Learning {
  return { version: 1, attempts: [...state.attempts, { questionId: question.id, correct: isCorrect(question, answer), hinted, at: Date.now() }].slice(-500) };
}
export function latestAttempts(state: Learning): Map<string, Attempt> { return new Map(state.attempts.map(a => [a.questionId, a])); }
export function nextQuestion(topicId: string, state: Learning, review = false, excluded: string[] = []): Question | undefined {
  const latest = latestAttempts(state);
  const pool = (questionsByTopic.get(topicId) || []).filter(q => !excluded.includes(q.id) && (!review || latest.get(q.id)?.correct === false));
  const recent = state.attempts.filter(a => questionById.get(a.questionId)?.topicId === topicId).slice(-5).filter(a => !a.hinted);
  const target = recent.length >= 3 && recent.every(a => a.correct) ? 3 : 1;
  return pool.sort((a, b) => Number(latest.has(a.id)) - Number(latest.has(b.id)) || (latest.get(a.id)?.at || 0) - (latest.get(b.id)?.at || 0) || Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target))[0];
}
