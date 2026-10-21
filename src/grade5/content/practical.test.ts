import { describe, expect, it } from 'vitest';
import official from '../official-curriculum.json';
import { practicalLessons } from './practical';

const byTopic = new Map(practicalLessons.map(lesson => [lesson.topicId, lesson]));
const question = (topicId: string, fragment: string) => {
 const found = byTopic.get(topicId)?.questions.find(q => q.prompt.includes(fragment));
 expect(found, `${topicId}: ${fragment}`).toBeDefined();
 return found!;
};

describe('Bilişim, din kültürü ve sanat içeriklerinin bilgi doğruluğu', () => {
 it('dört programın bütün mevcut konu kayıtlarını kapsar ve spor paketine taşmaz', () => {
  const selected = new Set(['course-6','course-7','course-8','course-9']);
  const expected = official.topics.filter(topic => selected.has(topic.courseId)).map(topic => topic.id);
  expect([...byTopic.keys()].sort()).toEqual(expected.sort());
  expect(practicalLessons.every(lesson => lesson.questions.length === 6)).toBe(true);
  const artistic = new Set(official.topics.filter(topic => ['course-8','course-9'].includes(topic.courseId)).map(topic => topic.id));
  expect(practicalLessons.filter(lesson => artistic.has(lesson.topicId)).every(lesson => !!lesson.activity)).toBe(true);
 });
 it('millî marşın söz yazarıyla bestecisini ve iki tarihî caminin şehirlerini karıştırmaz', () => {
  const march = 'topic-af2e46b4c415b1ba';
  expect(question(march, 'söz yazarı kimdir').answer).toBe('Mehmet Âkif Ersoy');
  expect(question(march, 'bestesi kime').answer).toBe('Osman Zeki Üngör');
  expect(question(march, 'Soyadını yaz').answer).toBe('Ersoy');
  const mosques = 'topic-99c427c183d55b1d';
  expect(question(mosques, 'Selimiye Camii hangi').answer).toBe('Edirne');
  expect(question(mosques, 'Süleymaniye Camii hangi').answer).toBe('İstanbul');
 });
 it('dinî metinlerde sure ve ayet sayısını ayırır; sesli okumayı yazılı testle onaylamaz', () => {
  expect(question('topic-a5877b73d603f0d3', 'kaç sure').answer).toBe('114');
  expect(question('topic-a5877b73d603f0d3', 'cüz sayısını').answer).toBe('30');
  expect(question('topic-412fb285121ff468', 'kaç ayettir').answer).toBe('4');
  expect(question('topic-0fa66eb1117d8a9c', 'kaç ayettir').answer).toBe('3');
  expect(question('topic-c583d534aa16e2e0', 'kaç ayettir').answer).toBe('4');
  expect(question('topic-412fb285121ff468', 'sesli okuma telaffuzunu ölçer').answer).toBe('Yanlış');
 });
 it('parolayı paylaşmayı ve yapay zekâ tahminini kesin hüküm saymayı doğru davranış olarak sunmaz', () => {
  expect(question('topic-db349988d242c351', 'Parola nasıl').answer).toBe('Gizli tutulmalıdır.');
  expect(question('topic-db349988d242c351', 'ödül vaadi').answer).toBe('Yanlış');
  expect(question('topic-a603b43457817246', 'olumsuz tahmin').answer).toContain('kesin hüküm sayılmamalı');
  expect(question('topic-6eb1d7db45a446b1', 'her zaman hatasız').answer).toBe('Yanlış');
  expect(question('topic-8279adfa5784a890', 'tek örnekte').answer).toBe('Yanlış');
 });
 it('eş anlamlı kısa yanıtlarda görünür kavram havuzu sağlar; sanat beğenisini yanlış saymaz', () => {
  for (const [id, answer] of [
   ['topic-db349988d242c351','parola'], ['topic-6ebdc3de61172181','dizek'],
   ['topic-0b4a4ace1d9ac4bc','repertuvar'], ['topic-8279adfa5784a890','test'],
  ]) {
   const fill = byTopic.get(id)!.questions.find(q => q.kind === 'fill')!;
   expect(fill.answer).toBe(answer);expect(fill.prompt).toContain('Kavram havuzu:');expect(fill.prompt).toContain(answer);
  }
  expect(question('topic-3138bfad381b6804', 'Farklı türde müzik sevmek').answer).toBe('Yanlış');
  expect(question('topic-9cd5e970ea0b21cb', 'herkesin beğenmesi').answer).toBe('Yanlış');
 });
});
