import {legacyAngleQuestions} from './math-journey-bank';
import { mathJourneyQuestions } from './math-journey-bank';
import { describe, expect, it } from 'vitest';
import { lessons, lessonByTopic, contentStats } from './content';
import { topics, questions, questionById, questionsByTopic, topicsByCourse, questionsByCourse, sourceComparedQuestions } from './catalog';

describe('Özgün ders anlatımı ve alıştırma kataloğu', () => {
 it('anlatımları mevcut konu kayıtlarına bağlar, örnek ve resmî kaynak kayıtlarını korur', () => {
  expect(lessons.length).toBeGreaterThan(200);
  expect(lessonByTopic.size).toBe(lessons.length);
  const ids = new Set(topics.map(topic => topic.id));
  for (const lesson of lessons) expect(ids.has(lesson.topicId), lesson.topicId).toBe(true);
  expect(lessonByTopic.has('place-value')).toBe(false);
  expect(lessonByTopic.has('reading-evidence')).toBe(false);
  expect(topics.find(topic => topic.id === 'place-value')?.source.status).toBe('pending');
  expect(questionsByTopic.get('place-value')?.filter(q=>!q.id.startsWith('mj-'))).toHaveLength(6);
  expect(questionsByTopic.get('place-value')?.filter(q=>q.id.startsWith('mj-'))).toHaveLength(200);
  expect(questionsByTopic.get('reading-evidence')).toHaveLength(2);
 });
 it('hazır derslerde açıklama, adımlı örnek ve çözümlü soruları birlikte sunar', () => {
  for (const lesson of lessons) {
   expect(lesson.introduction.length, lesson.topicId).toBeGreaterThan(30);
   expect(lesson.sections.length, lesson.topicId).toBeGreaterThanOrEqual(2);
   for (const section of lesson.sections) {
    expect(section.title.trim()).not.toBe('');
    expect(section.body.length).toBeGreaterThan(0);
    expect(section.body.join(' ').length).toBeGreaterThan(30);
   }
   expect(lesson.workedExample.prompt.length).toBeGreaterThan(10);
   expect(lesson.workedExample.steps.length).toBeGreaterThanOrEqual(2);
   expect(lesson.workedExample.answer.trim()).not.toBe('');
   expect(lesson.questions.length, lesson.topicId).toBeGreaterThanOrEqual(6);
   if (lesson.activity) {
    expect(lesson.activity.instructions.length).toBeGreaterThanOrEqual(2);
    expect(lesson.activity.reflection.trim()).not.toBe('');
   }
  }
 });
 it('soru kimliği, seçenekleri, doğru yanıtı ve ipuçları tutarlıdır', () => {
  expect(questionById.size).toBe(questions.length+legacyAngleQuestions.length); // Archived angle IDs remain readable, outside fresh pools.
  for (const q of questions) {
   expect(q.prompt.length, q.id).toBeGreaterThan(8);
   expect(q.answer.trim(), q.id).not.toBe('');
   expect(q.explanation.length, q.id).toBeGreaterThan(10);
   expect(q.hints.length, q.id).toBeGreaterThan(0);
   expect(q.hints.every(hint => hint.trim().length > 0), q.id).toBe(true);
   expect([1,2,3,4]).toContain(q.difficulty);
   expect(q.outcomeCode).toBeNull();
   if (['choice','boolean','visual'].includes(q.kind)) {
    expect(q.choices?.length, q.id).toBeGreaterThanOrEqual(2);
    expect(q.choices, q.id).toContain(q.answer);
    expect(new Set(q.choices).size, q.id).toBe(q.choices?.length);
   }
  }
 });
 it('ders ve konu indeksleri bütün soruları doğru kapsamda tutar', () => {
  expect([...questionsByTopic.values()].flat()).toHaveLength(questions.length);
  expect([...questionsByCourse.values()].flat()).toHaveLength(questions.length);
  for (const [courseId, pool] of questionsByCourse) {
   const topicIds = new Set(topicsByCourse.get(courseId)?.map(topic => topic.id));
   expect(pool.every(q => topicIds.has(q.topicId))).toBe(true);
  }
  expect(contentStats.questionRecords + 8 + sourceComparedQuestions.length + mathJourneyQuestions.length).toBe(questions.length);
  expect(contentStats.distinctQuestionPrompts).toBeLessThanOrEqual(contentStats.questionRecords);
 });
 it('doğru seçeneğin yeri geniş ders havuzlarında sabit bir ipucu oluşturmaz', () => {
  for (const [courseId, pool] of questionsByCourse) {
   const choices = pool.filter(q => q.kind === 'choice');
   if (choices.length < 20) continue;
   expect(new Set(choices.map(q => q.choices!.indexOf(q.answer))).size, courseId).toBeGreaterThanOrEqual(3);
  }
 });
});
