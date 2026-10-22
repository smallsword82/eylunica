import {sciencePlans,scienceLessonById,scienceInstructions} from './science-plans.ts';
import {scienceQuestions,type ScienceQuestion} from './science-question-bank.ts';
export const scienceHintSpeech=(q:ScienceQuestion)=>`İpucu: ${q.hints.join(' ')}`;
export const scienceSolutionSpeech=(q:ScienceQuestion)=>`Çözümü birlikte inceleyelim. ${q.explanation}`;
export const scienceNarrationTexts=[...new Set([
 ...Object.values(scienceInstructions),...sciencePlans.flatMap(p=>[p.task,p.hint,p.success]),
 ...[...scienceLessonById.values()].flatMap(l=>[...l.sections.flatMap(s=>s.body),...l.workedExample.steps]),
 ...scienceQuestions.filter(q=>q.purpose==='practice').flatMap(q=>[q.prompt,scienceHintSpeech(q),scienceSolutionSpeech(q)]),
 ...scienceQuestions.map(scienceSolutionSpeech),
])];
