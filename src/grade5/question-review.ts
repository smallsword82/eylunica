import sourceData from './question-sources.json' with { type: 'json' };
import corrections from './question-corrections.json' with { type: 'json' };
import type { Question } from './catalog';

export type QuestionReview = {
 reviewedAt: string;
 comparison: 'writing-guidelines' | 'official-example';
 references: { sourceId: string; pdfPages: number[]; purpose: string }[];
 note: string;
};
export const questionSources = sourceData.sources;
export const questionSourceById = new Map(questionSources.map(source => [source.id, source]));
export const questionCorrections = corrections;
const byPrompt = new Map(corrections.map(correction => [correction.prompt, correction]));

export function applyQuestionReview(question: Question): Question {
 const correction = byPrompt.get(question.prompt);
 if (!correction || question.kind !== 'choice') return question;
 const revised = correction as typeof correction & { revisedPrompt?: string; reason?: string };
 return {
  ...question,
  prompt: revised.revisedPrompt || question.prompt,
  choices: [question.answer, ...correction.distractors],
  sourceReview: {
   reviewedAt: '2026-10-21', comparison: 'writing-guidelines',
   references: [{ sourceId: 'meb-item-guide-2026', pdfPages: [18,19,22,23], purpose: 'Soru kökü, tek doğru cevap ve konuya uygun çeldirici ilkeleri' }],
   note: revised.reason || 'Konu dışı veya kolay elenen çeldiriciler, aynı konu alanındaki karışıklıkları hedefleyecek şekilde düzeltildi. Doğru cevap ve soru kimliği korundu.',
  },
 };
}
