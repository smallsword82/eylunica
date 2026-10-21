import type { LessonContent } from './content-types.ts';
import { mathLessons } from './content/math.ts';
import { scienceLessons } from './content/science.ts';
import { literacySocialLessons } from './content/literacy-social.ts';
import { languageLessons } from './content/languages.ts';
import { practicalLessons } from './content/practical.ts';
import { electiveLessons } from './content/electives.ts';
import { disasterLessons } from './content/disaster.ts';
import { sportsLessons } from './content/sports.ts';

export const lessons: LessonContent[] = [
 ...mathLessons, ...scienceLessons, ...literacySocialLessons,
 ...languageLessons, ...practicalLessons, ...electiveLessons, ...disasterLessons, ...sportsLessons,
];
export const lessonByTopic = new Map(lessons.map(lesson => [lesson.topicId, lesson]));
const normalize = (text: string) => text.trim().toLocaleLowerCase('tr').replace(/\s+/g, ' ');
export const contentStats = {
 lessonTopics: lessons.length,
 questionRecords: lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0),
 distinctQuestionPrompts: new Set(lessons.flatMap(lesson => lesson.questions.map(q => normalize(q.prompt)))).size,
 practicalActivities: lessons.filter(lesson => lesson.activity).length,
};
