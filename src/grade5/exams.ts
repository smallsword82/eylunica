import { matchesTerm, type StudyTerm } from './terms';
import { questions, topics, type Question, type Topic } from './catalog';
import { isCorrect } from './engine';

export const examStorageKey = 'eylunica-grade5-exams-v1';
export type ExamDraft = {
  id: string;
  courseId: string;
  term?: StudyTerm;
  units: string[];
  questionIds: string[];
  answers: Record<string, string>;
  startedAt: number;
};
export type ExamResult = ExamDraft & { finishedAt: number };
export type ExamStore = { version: 1; drafts: Record<string, ExamDraft>; history: ExamResult[] };
export type ExamSelection = { courseId: string; units: string[]; count: number; seed: number; term?: StudyTerm };
export type AnswerStatus = 'correct' | 'wrong' | 'blank';
export type ExamCounts = { total: number; correct: number; wrong: number; blank: number; score: number };
export type ExamScore = ExamCounts & {
  byTopic: (ExamCounts & { topicId: string })[];
  details: { question: Question; answer: string; status: AnswerStatus }[];
};
type TopicReference = Pick<Topic, 'id' | 'courseId' | 'unit'> & { weeks?: number[] };

const normalizePrompt = (value: string) => value.trim().toLocaleLowerCase('tr').replace(/\s+/g, ' ');
function generator(seed: number) {
  let state = seed >>> 0 || 0x9e3779b9;
  return () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}
function shuffled<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function availableExamQuestions(
  courseId: string, units: string[], pool: Question[] = questions, references: TopicReference[] = topics, term: StudyTerm = 'all',
): Question[] {
  const allowed = new Set(references.filter(topic => topic.courseId === courseId && units.includes(topic.unit) && matchesTerm(topic, term)).map(topic => topic.id));
  return pool.filter(question => allowed.has(question.topicId) && !question.id.startsWith('mj-'));
}

// A topic gets one question per round before it gets a second question. Both
// topic order and questions vary reproducibly with the saved session seed.
export function selectExamQuestions(
  selection: ExamSelection, pool: Question[] = questions, references: TopicReference[] = topics,
): Question[] {
  const eligible = availableExamQuestions(selection.courseId, selection.units, pool, references, selection.term);
  const random = generator(selection.seed);
  const topicIds = shuffled([...new Set(eligible.map(question => question.topicId))], random);
  const buckets = new Map(topicIds.map(topicId => [topicId, shuffled(eligible.filter(question => question.topicId === topicId), random)]));
  const chosen: Question[] = [], ids = new Set<string>(), prompts = new Set<string>();
  const count = Number.isFinite(selection.count) ? Math.max(0, Math.floor(selection.count)) : 0;
  let round = 0;
  while (chosen.length < count) {
    let added = 0;
    for (const [topicIndex, topicId] of topicIds.entries()) {
      const bucket = buckets.get(topicId)!;
      // Across successive rounds, each topic practices all available levels.
      const target = ((round + topicIndex) % 4) + 1;
      bucket.sort((a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target));
      const index = bucket.findIndex(question => !ids.has(question.id) && !prompts.has(normalizePrompt(question.prompt)));
      if (index < 0) continue;
      const [question] = bucket.splice(index, 1);
      chosen.push(question); ids.add(question.id); prompts.add(normalizePrompt(question.prompt)); added++;
      if (chosen.length === count) break;
    }
    if (added === 0) break;
    round++;
  }
  return chosen;
}

export function createExam(
  selection: ExamSelection, now = Date.now(), pool: Question[] = questions, references: TopicReference[] = topics,
): ExamDraft {
  const selected = selectExamQuestions(selection, pool, references);
  if (!selected.length) throw Error('Seçilen ünitelerde henüz hazır soru yok.');
  return {
    id: `exam-${now.toString(36)}-${(selection.seed >>> 0).toString(36)}`,
    term: selection.term || 'all', courseId: selection.courseId, units: [...new Set(selection.units)],
    questionIds: selected.map(question => question.id), answers: {}, startedAt: now,
  };
}

export function scoreExam(draft: ExamDraft, pool: Question[] = questions): ExamScore {
  const byId = new Map(pool.map(question => [question.id, question]));
  const details: ExamScore['details'] = [];
  for (const id of [...new Set(draft.questionIds)]) {
    const question = byId.get(id);
    if (!question) continue;
    const answer = draft.answers[id] || '';
    details.push({ question, answer, status: !answer.trim() ? 'blank' : isCorrect(question, answer) ? 'correct' : 'wrong' });
  }
  const count = (rows: typeof details): ExamCounts => {
    const correct = rows.filter(row => row.status === 'correct').length;
    return { total: rows.length, correct, wrong: rows.filter(row => row.status === 'wrong').length,
      blank: rows.filter(row => row.status === 'blank').length, score: rows.length ? Math.round(correct / rows.length * 100) : 0 };
  };
  return { ...count(details), details, byTopic: [...new Set(details.map(row => row.question.topicId))]
    .map(topicId => ({ topicId, ...count(details.filter(row => row.question.topicId === topicId)) })) };
}

export function completeExam(store: ExamStore, draft: ExamDraft, finishedAt = Date.now()): ExamStore {
  const drafts = { ...store.drafts }; delete drafts[draft.courseId];
  return { version: 1, drafts, history: [...store.history.filter(result => result.id !== draft.id), { ...draft, finishedAt }].slice(-20) };
}

const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
export function readExams(raw: string | null, pool: Question[] = questions, references: TopicReference[] = topics): ExamStore {
  const empty: ExamStore = { version: 1, drafts: {}, history: [] };
  try {
    const parsed: unknown = JSON.parse(raw || 'null');
    if (!object(parsed) || parsed.version !== 1) return empty;
    const questionMap = new Map(pool.map(question => [question.id, question]));
    const referenceMap = new Map(references.map(topic => [topic.id, topic]));
    function draft(value: unknown): ExamDraft | null {
      if (!object(value) || typeof value.id !== 'string' || typeof value.courseId !== 'string' ||
        !Number.isFinite(value.startedAt) || !Array.isArray(value.questionIds) || !object(value.answers)) return null;
      const courseId = value.courseId;
      const ids = [...new Set(value.questionIds.filter((id): id is string => typeof id === 'string'))]
        .filter(id => referenceMap.get(questionMap.get(id)?.topicId || '')?.courseId === courseId).slice(0, 100);
      if (!ids.length) return null;
      const allowedUnits = new Set(references.filter(topic => topic.courseId === courseId).map(topic => topic.unit));
      const declaredUnits = Array.isArray(value.units) ? [...new Set(value.units.filter((unit): unit is string => typeof unit === 'string' && allowedUnits.has(unit)))] : [];
      const units = declaredUnits.length ? declaredUnits : [...new Set(ids.map(id => referenceMap.get(questionMap.get(id)!.topicId)!.unit))];
      const answers: Record<string, string> = {};
      for (const id of ids) if (typeof value.answers[id] === 'string') answers[id] = value.answers[id].slice(0, 2000);
      return { id: value.id.slice(0, 200), term: ['first', 'second', 'unknown', 'all'].includes(String(value.term)) ? value.term as StudyTerm : 'all', courseId, units, questionIds: ids, answers, startedAt: value.startedAt as number };
    }
    if (object(parsed.drafts)) for (const [courseId, value] of Object.entries(parsed.drafts)) {
      const saved = draft(value); if (saved && saved.courseId === courseId) empty.drafts[courseId] = saved;
    }
    if (Array.isArray(parsed.history)) for (const value of parsed.history.slice(-20)) {
      const saved = draft(value);
      if (saved && object(value) && typeof value.finishedAt === 'number' && Number.isFinite(value.finishedAt) && value.finishedAt >= saved.startedAt)
        empty.history.push({ ...saved, finishedAt: value.finishedAt });
    }
  } catch { /* unavailable or corrupt exam storage never changes game progress */ }
  return empty;
}
