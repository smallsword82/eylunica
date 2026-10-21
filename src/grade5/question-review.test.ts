import { expect, it } from 'vitest';
import { questions, sourceComparedQuestions } from './catalog';
import { questionSourceById } from './question-review';

it('source notes cite inspected pages without implying past-exam origin', () => {
 const reviewed = questions.filter(q => q.sourceReview);
 expect(reviewed.length).toBeGreaterThan(0);
 for (const question of reviewed) {
  for (const ref of question.sourceReview!.references) {
   const source = questionSourceById.get(ref.sourceId)!;
   expect(source).toBeDefined();
   expect(ref.pdfPages.every(page => source.reviewedPdfPages.includes(page))).toBe(true);
  }
 }
});
it('new constrained-number questions have independently calculated answers', () => {
 const byId = new Map(sourceComparedQuestions.map(q => [q.id,q]));
 expect(byId.get('sr-math-grid-1')?.answer).toBe(String(15-3-7));
 expect(byId.get('sr-math-grid-2')?.answer).toBe(String(15-4-8));
 expect(byId.get('sr-math-grid-3')?.answer).toBe(String(Math.max(816,357,492,834,159,672)));
});
