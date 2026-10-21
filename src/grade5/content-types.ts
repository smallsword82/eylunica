import type { Question } from './catalog';

// Original teaching material mapped to existing curriculum records. These are
// Eylunica explanations and exercises, not official MEB questions or exams.
export type LessonQuestion = Omit<Question, 'topicId' | 'outcomeCode'>;
export type LessonContent = {
 topicId: string;
 introduction: string;
 sections: { title: string; body: string[] }[];
 workedExample: { prompt: string; steps: string[]; answer: string };
 activity?: { title: string; instructions: string[]; reflection: string };
 questions: LessonQuestion[];
};
