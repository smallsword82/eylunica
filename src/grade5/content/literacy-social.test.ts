import { describe, expect, it } from 'vitest';
import official from '../official-curriculum.json';
import type { Question } from '../catalog';
import { isCorrect } from '../engine';
import { literacySocialLessons } from './literacy-social';

const getLesson = (topicId: string) => {
 const result = literacySocialLessons.find(lesson => lesson.topicId === topicId);
 if (!result) throw Error('Ders bulunamadı: ' + topicId);
 return result;
};
const getQuestion = (topicId: string, ordinal: number): Question => ({
 ...getLesson(topicId).questions[ordinal - 1], topicId, outcomeCode: null,
});

describe('Türkçe ve Sosyal Bilgiler içerik bağlamı', () => {
 it('iki belirsiz Türkçe başlığını atlar, mevcut örnek çalışmayı değiştirmez', () => {
  const excluded = ['topic-6ba2087e42e60d25', 'topic-6742d3514488a7b1'];
  const expected = official.topics.filter(topic => ['course-0', 'course-3'].includes(topic.courseId) && !excluded.includes(topic.id));
  expect(literacySocialLessons.map(lesson => lesson.topicId).sort()).toEqual(expected.map(topic => topic.id).sort());
  expect(literacySocialLessons).toHaveLength(103);
  expect(literacySocialLessons.some(lesson => lesson.topicId === 'reading-evidence')).toBe(false);
  for (const id of excluded) expect(literacySocialLessons.some(lesson => lesson.topicId === id)).toBe(false);
 });

 it('tekrarlanan başlık ilişkilerini özgün soru sayısından ayırır', () => {
  const questions = literacySocialLessons.flatMap(lesson => lesson.questions);
  expect(questions).toHaveLength(618);
  expect(new Set(questions.map(question => question.id)).size).toBe(618);
  expect(new Set(questions.map(question => question.prompt)).size).toBe(306);
  const full = getLesson('topic-cbc7e5a4f990fc71');
  for (const id of ['topic-fbd68f7e3a5702f4', 'topic-06848a65cd4c7f94', 'topic-fceea254542d41b4']) {
   const source = official.topics.find(topic => topic.id === id)!;
   expect(source.outcomes.some(outcome => outcome.code === 'SB.5.4.4')).toBe(true);
   expect(getLesson(id).introduction).toBe(full.introduction);
   expect(getLesson(id).questions[0].prompt).toBe(full.questions[0].prompt);
   expect(getLesson(id).questions[0].id).not.toBe(full.questions[0].id);
  }
 });

 it('açık bilgi, kanıta bağlı çıkarım ve verilmemiş ayrıntıyı ayırır', () => {
  const cases: [string, number, string, string][] = [
   ['topic-dd9cd10951724f08', 6, 'Sude kaç yaşındadır?', 'Çantası ne renktir?'],
   ['topic-bc4e48cb1910634c', 1, 'Uykusu gelmiş olabilir.', 'Kesin hasta olmuştur.'],
   ['topic-cd6471254582f0a0', 6, 'Önceden kesin olarak kırmızı otobüse bindiği', 'Ulaşım alışkanlığında değişim olduğu'],
  ];
  for (const [topicId, ordinal, right, wrong] of cases) {
   const question = getQuestion(topicId, ordinal);
   expect(isCorrect(question, right), question.prompt).toBe(true);
   expect(isCorrect(question, wrong), question.prompt).toBe(false);
  }
 });

 it('kişileştirmede Deniz kişi adı belirsizliğini kaldırır; özete yeni neden eklemez', () => {
  const personification = getQuestion('topic-7c4c6f82c67667d1', 2);
  expect(isCorrect(personification, 'Dalgalı deniz bize gülümsedi.')).toBe(true);
  expect(isCorrect(personification, 'Deniz dalgalıydı.')).toBe(false);
  expect(personification.choices?.find(choice => choice.includes('gülümsedi'))).toContain('Dalgalı deniz');
  const summary = getQuestion('topic-62fe1cff6ac909d4', 3);
  expect(isCorrect(summary, 'Ece’nin ektiği ve suladığı tohum filizlendi.')).toBe(true);
  expect(summary.answer).not.toContain('sayesinde');
 });

 it('eş anlamlı terimlerin açık uçlu yanıtlarını haksız elememek için sözcük seçenekleri verir', () => {
  const cases: [string, number, string][] = [
   ['topic-be932a472e7a5c7f', 1, 'Dize'],
   ['topic-7c4c6f82c67667d1', 5, 'Kişileştirme'],
   ['topic-211c8ddf94259378', 5, 'Yer'],
   ['topic-ec26e9fcd7de0312', 5, 'Soru işareti'],
  ];
  for (const [topicId, ordinal, answer] of cases) {
   const question = getQuestion(topicId, ordinal);
   expect(question.kind).toBe('fill');
   expect(question.prompt).toContain('seçip yaz:');
   expect(question.prompt.toLocaleLowerCase('tr')).toContain(answer.toLocaleLowerCase('tr'));
   expect(isCorrect(question, ' ' + answer.toLocaleUpperCase('tr') + ' ')).toBe(true);
  }
 });

 it('kara komşuluğu, Nahçıvan ve bütçeyi bağlama uygun değerlendirir', () => {
  const cases: [string, number, string, string][] = [
   ['topic-10080f13e5fc9081', 3, 'Doğru', 'Yanlış'],
   ['topic-10080f13e5fc9081', 4, 'İtalya', 'İran'],
   ['topic-10080f13e5fc9081', 5, '8', '7'],
   ['topic-ef1e552df3deddc1', 3, '50', '110'],
   ['topic-ef1e552df3deddc1', 6, 'Kalan 30 TL yetmez; planımı değiştirmeliyim.', 'Her koşulda 40 TL kalır.'],
  ];
  for (const [topicId, ordinal, right, wrong] of cases) {
   const question = getQuestion(topicId, ordinal);
   expect(isCorrect(question, right), question.prompt).toBe(true);
   expect(isCorrect(question, wrong), question.prompt).toBe(false);
  }
 });

 it('çoğunluk kararını temel hakların önüne koymaz, afet ve acil çağrıda güvenliği korur', () => {
  const democracy = getQuestion('topic-59bbf249a1108633', 6);
  expect(isCorrect(democracy, 'Temel hakların oylamayla yok sayılamayacağı hatırlatılmalıdır.')).toBe(true);
  expect(isCorrect(democracy, 'Oylama varsa her karar doğrudur denmelidir.')).toBe(false);
  const danger = getQuestion('topic-bb79c9e48d937792', 6);
  expect(isCorrect(danger, 'Girmemesini söyleyip güvenilir yetişkin veya görevliye haber vermek')).toBe(true);
  expect(isCorrect(danger, 'Onunla içeri koşmak')).toBe(false);
  const emergency = getQuestion('topic-cbc7e5a4f990fc71', 3);
  expect(isCorrect(emergency, 'Yanlış')).toBe(true);
  expect(emergency.explanation).toContain('gerçek yardımı geciktirebilir');
 });
});
