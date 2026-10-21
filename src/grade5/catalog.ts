import official from './official-curriculum.json' with { type: 'json' };
import { lessons, lessonByTopic } from './content.ts';
import { applyQuestionReview, type QuestionReview } from './question-review.ts';
import comparedQuestions from './source-compared-questions.json' with { type: 'json' };
export type Source = { url: string; checkedAt: string | null; status: 'pending' | 'verified'; note: string; sheet?: string; rows?: number[] };
export type Course = { id: string; name: string; model: 'standard' | 'multiple-language' | 'elective'; verification: 'pending' | 'verified'; programUrl?: string; sourceUrl?: string; weeklyHours?: number | null; category?: string };
export type Question = {
  id: string; topicId: string; prompt: string; difficulty: 1 | 2 | 3 | 4;
  kind: 'choice' | 'boolean' | 'fill' | 'matching' | 'ordering' | 'visual';
  choices?: string[]; answer: string; explanation: string; hints: string[];
  outcomeCode: string | null; image?: { src: string; alt: string };
  sourceReview?: QuestionReview;
};
export type Topic = {
  id: string; courseId: string; unit: string; title: string; year: '2026-2027';
  models: Course['model'][]; weeks: number[]; outcomes: { code: string; text: string }[];
  source: Source; summary: string; example: string; activity?: string; outcomeScope?: string; dates?: string[];
};
export const courses: Course[] = (official.courses as Course[]).sort((a,b) => a.name.localeCompare(b.name, 'tr'));
export const curriculumStats = { courses: official.courses.length, units: official.units.length, topics: official.topics.length, checkedAt: official.checkedAt };
export const timetable = official.timetable;
const source: Source = { url: 'https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim', checkedAt: null, status: 'pending', note: 'Bu örnek çalışma resmî programa henüz tek tek eşleştirilmedi; bu içerik müfredat kapsamı iddiası taşımayan prototip örneğidir.' };
const examples: Topic[] = [
  { id: 'place-value', courseId: 'course-1', unit: 'Örnek sayı çalışmaları', title: 'Basamak değeri', year: '2026-2027', models: ['standard', 'multiple-language'], weeks: [], outcomes: [], source,
    summary: 'Bir rakamın değeri bulunduğu basamağa bağlıdır. Birler, onlar, yüzler ve binler basamaklarında değer sırasıyla 1, 10, 100 ve 1000 ile çarpılır.', example: '4 582 sayısında 5 yüzler basamağındadır: 5 × 100 = 500.' },
  { id: 'reading-evidence', courseId: 'course-0', unit: 'Örnek okuma çalışmaları', title: 'Metinden kanıt bulma', year: '2026-2027', models: ['standard', 'multiple-language'], weeks: [], outcomes: [], source,
    summary: 'Bir çıkarımı kontrol ederken metindeki bilgileri kullanırız. Metinde olmayan bir bilgiyi kesin doğru saymayız.', example: '“Ada şemsiyesini açtı, yağmurda yürüdü.” cümlesi havanın yağmurlu olduğunu destekler; Ada’nın yaşını söylemez.' },
];
export const topics: Topic[] = [...examples, ...(official.topics as Topic[])].map(topic => {
 const lesson = lessonByTopic.get(topic.id);
 return lesson ? { ...topic, summary: lesson.introduction, example: lesson.workedExample.steps.join(' ') } : topic;
});
const sampleQuestions: Question[] = [
  { id: 'pv1', topicId: 'place-value', kind: 'choice', prompt: '3 482 sayısında 4 rakamının basamak değeri kaçtır?', choices: ['4', '40', '400', '4000'], answer: '400', difficulty: 1, explanation: '4 yüzler basamağında: 4 × 100 = 400.', hints: ['Sağdan üçüncü basamağı bul.'], outcomeCode: null },
  { id: 'pv2', topicId: 'place-value', kind: 'boolean', prompt: '5 216 sayısında 2 rakamının basamak değeri 200’dür.', choices: ['Doğru', 'Yanlış'], answer: 'Doğru', difficulty: 1, explanation: '2 yüzler basamağında olduğu için değeri 200’dür.', hints: ['Sağdan birler, onlar, yüzler diye say.'], outcomeCode: null },
  { id: 'pv3', topicId: 'place-value', kind: 'fill', prompt: '7 305 sayısında 3 rakamının basamak değeri kaçtır?', answer: '300', difficulty: 2, explanation: '3 yüzler basamağındadır: 3 × 100 = 300.', hints: ['Sıfırın solundaki basamağa bak.'], outcomeCode: null },
  { id: 'pv4', topicId: 'place-value', kind: 'ordering', prompt: 'Basamakları küçük değerden büyüğe sırala. Sözcükleri virgülle ayır.', choices: ['yüzler', 'birler', 'binler', 'onlar'], answer: 'birler,onlar,yüzler,binler', difficulty: 3, explanation: 'Her basamak sola doğru on kat büyür.', hints: ['En küçük basamak birlerdir.'], outcomeCode: null },
  { id: 'pv5', topicId: 'place-value', kind: 'matching', prompt: 'Eşleştir: A = 6 123 içindeki 6; B = 1 623 içindeki 6. “A=...,B=...” biçiminde yaz.', answer: 'A=6000,B=600', difficulty: 2, explanation: 'A’da 6 binler, B’de 6 yüzler basamağındadır.', hints: ['Önce her sayıda 6’nın yerini bul.'], outcomeCode: null },
  { id: 'pv6', topicId: 'place-value', kind: 'visual', prompt: 'Tablodaki sayıda 5 rakamı bir basamak sola taşınırsa basamak değeri kaç katına çıkar?', image: { src: './grade5/place-value.svg', alt: 'Basamak tablosu: binler 2, yüzler 5, onlar 0, birler 3.' }, choices: ['2', '5', '10', '100'], answer: '10', difficulty: 4, explanation: 'Yüzlerden binlere geçerken 500 yerine 5000 olur: 5000 ÷ 500 = 10.', hints: ['Sola her basamakta değer on katına çıkar.'], outcomeCode: null },
  { id: 're1', topicId: 'reading-evidence', kind: 'choice', prompt: '“Ece toprağı kurumuş çiçeğe su verdi.” Hangi bilgi metinde var?', choices: ['Ece çiçeği suladı.', 'Ece on yaşında.', 'Çiçek kırmızıydı.'], answer: 'Ece çiçeği suladı.', difficulty: 1, explanation: '“Su verdi” sözü suladığını doğrudan belirtir. Yaşı ve çiçeğin rengi verilmemiştir.', hints: ['Yalnız cümlede yazan bilgiyi seç.'], outcomeCode: null },
  { id: 're2', topicId: 'reading-evidence', kind: 'boolean', prompt: '“Ali kitabını çantasına koydu.” cümlesinden kitabın kaç sayfa olduğunu öğrenebiliriz.', choices: ['Doğru', 'Yanlış'], answer: 'Yanlış', difficulty: 2, explanation: 'Cümlede sayfa sayısı belirtilmiyor.', hints: ['Cümlede bir sayfa sayısı var mı?'], outcomeCode: null },
];
function varyChoiceOrder(question: Question): Question {
 if (!['choice', 'visual'].includes(question.kind) || !question.choices) return question;
 const choices = [...question.choices];
 let seed = [...question.id].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0, 2166136261);
 for (let index = choices.length - 1; index > 0; index--) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  const target = seed % (index + 1);
  [choices[index], choices[target]] = [choices[target], choices[index]];
 }
 return { ...question, choices };
}
// Stable per-question ordering preserves resumed answers without making the
// authored first option an answer-position clue. Keep legacy sample data intact.
export const sourceComparedQuestions = comparedQuestions as Question[];
export const questions: Question[] = [...sampleQuestions, ...lessons.flatMap(lesson => lesson.questions.map(q => varyChoiceOrder(applyQuestionReview({ ...q, topicId: lesson.topicId, outcomeCode: null })))), ...sourceComparedQuestions.map(varyChoiceOrder)];
export const questionById = new Map(questions.map(q => [q.id, q]));
export const questionsByTopic = new Map<string, Question[]>();
export const topicsByCourse = new Map<string, Topic[]>();
export const questionsByCourse = new Map<string, Question[]>();
for (const topic of topics) {
 const list = topicsByCourse.get(topic.courseId) || [];
 list.push(topic); topicsByCourse.set(topic.courseId, list);
}
export const topicById = new Map(topics.map(t => [t.id, t]));
for (const q of questions) {
 const list = questionsByTopic.get(q.topicId) || [];
 list.push(q); questionsByTopic.set(q.topicId, list);
 const courseId = topicById.get(q.topicId)?.courseId;
 if (courseId) { const list = questionsByCourse.get(courseId) || []; list.push(q); questionsByCourse.set(courseId, list); }
}
