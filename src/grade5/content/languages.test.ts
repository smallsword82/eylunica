import { describe, expect, it } from 'vitest';
import official from '../official-curriculum.json';
import { languageLessons } from './languages';
import { isCorrect } from '../engine';
import type { Question } from '../catalog';

const lesson = (topicId: string) => {
 const result = languageLessons.find(item => item.topicId === topicId);
 if (!result) throw Error('Dil dersi bulunamadı: '+topicId);
 return result;
};
const question = (topicId: string, ordinal: number): Question => ({
 ...lesson(topicId).questions[ordinal - 1], topicId, outcomeCode: null,
});

describe('İngilizce ve Almanca derslerinin bağlam ve dil denetimi', () => {
 it('üç programın tam 90 konu kaydını kapsar, farklı modelleri birleştirmez', () => {
  const courseIds = ['course-4','meb-course-35','course-5'];
  const expected = official.topics.filter(topic => courseIds.includes(topic.courseId));
  const actual = languageLessons.map(item => item.topicId);
  expect(new Set(actual).size).toBe(90);
  expect([...actual].sort()).toEqual(expected.map(topic => topic.id).sort());
  for (const [courseId,count] of [['course-4',25],['meb-course-35',49],['course-5',16]] as const) {
   const ids = new Set(official.topics.filter(topic => topic.courseId === courseId).map(topic => topic.id));
   expect(languageLessons.filter(item => ids.has(item.topicId))).toHaveLength(count);
  }
 });

 it('paylaşılan kavramları ayrı konu ilişkileri olarak sayar, özgün soru sayısını şişirmez', () => {
  const all = languageLessons.flatMap(item => item.questions);
  expect(all).toHaveLength(540);
  expect(new Set(all.map(item => item.id)).size).toBe(540);
  expect(new Set(all.map(item => item.prompt)).size).toBe(420);
  const standard = lesson('topic-2409a01c42aec18a');
  const multiple = lesson('topic-9e4f8f28b49f3b49');
  expect(standard.introduction).toBe(multiple.introduction);
  expect(standard.questions[0].prompt).toBe(multiple.questions[0].prompt);
  expect(standard.questions[0].id).not.toBe(multiple.questions[0].id);
 });

 it('İngilizce saat, miktar, sıra ve metin sorularını verilen bağlama göre değerlendirir', () => {
  const cases: [string,number,string,string][] = [
   ['topic-9e4db5b22b127dba',6,'Quarter to eight','Quarter past seven'],
   ['topic-10756edc86b845da',3,'500','200'],
   ['topic-20266991e17b877a',6,'Fiftieth','Fifty'],
   ['topic-ed6ead28ab460afd',3,'Twenty-first','Twenty-one'],
   ['topic-aa1a2706f23a5ef3',3,'Jüpiter','Satürn'],
   ['topic-a4359f52adf62967',3,'Bir olasılık','Kesinleşmiş geçmiş olay'],
   ['topic-42349b6be41bb7d5',5,'Yanlış','Doğru'],
  ];
  for(const [topicId,ordinal,right,wrong] of cases) {
   const item=question(topicId,ordinal);
   expect(isCorrect(item,right),item.prompt).toBe(true);
   expect(isCorrect(item,wrong),item.prompt).toBe(false);
  }
 });

 it('İngilizcede özne-fiil uyumunu, edatı ve devam eden eylemi ayırır', () => {
  const cases: [string,string,string][] = [
   ['topic-75fb1c0990be496d','open','close'],
   ['topic-5a826dfd6ffb9736','has','have'],
   ['topic-a46b97cfec893b7a','wearing','wear'],
   ['topic-7d7d4fcb7d5ea315','at','on'],
   ['topic-2190c427d1b083a8','lives','live'],
   ['topic-167f59ec153f4396','sing','sings'],
  ];
  for(const [topicId,right,wrong] of cases) {
   const item=question(topicId,4);
   expect(isCorrect(item,right),item.prompt).toBe(true);
   expect(isCorrect(item,wrong),item.prompt).toBe(false);
  }
  // A plural interpretation of collective "family" would make this item unfair.
  expect(question('topic-2190c427d1b083a8',4).prompt).toContain('My aunt');
 });

 it('Almancanın 16 dersinde çekim, soru amacı, ad ve zaman bağlamları doğrudur', () => {
  const cases: [string,number,string,string][] = [
   ['topic-5d9bf79f27812303',6,'Wie heißt du?','Wo wohnst du?'],
   ['topic-20eeb2eaef42b4c0',4,'Buchstaben','Bücher'],
   ['topic-7ec2a900647d22d2',6,'Guten Abend!','Gute Nacht!'],
   ['topic-27517cfd0d357e96',4,'gut','schlecht'],
   ['topic-222c7422bab17715',4,'bin','ist'],
   ['topic-02e14c6b7b77bf0b',4,'spreche','spricht'],
   ['topic-ce962873d0baeae1',4,'in','aus'],
   ['topic-3178b0a51d4d0200',4,'meine','mein'],
   ['topic-4cb83d8b4777a1e3',4,'ist','bin'],
   ['topic-ec46b4ed84d9558e',4,'Buch','Heft'],
   ['topic-b879cf5c232bd02b',4,'sind','ist'],
   ['topic-93104bb5b9aa589b',4,'Bibliothek','Musikraum'],
   ['topic-0adbc8a5aa95bbc4',4,'ist','sind'],
   ['topic-f200a2a2ecd17df9',4,'Mittwoch','Freitag'],
   ['topic-0b0498324882ae04',4,'um','am'],
   ['topic-48bd22bf5c3da3d9',4,'spiele','schwimme'],
  ];
  for(const [topicId,ordinal,right,wrong] of cases) {
   const item=question(topicId,ordinal);
   expect(isCorrect(item,right),item.prompt).toBe(true);
   expect(isCorrect(item,wrong),item.prompt).toBe(false);
  }
 });

 it('birden çok doğru kelime alabilen boşluklarda anlam ve sözcük havuzunu açıklar', () => {
  const rabbit = question('topic-2191a91e4b0421a2',4);
  const giraffe = question('topic-f87c0506de0246d6',4);
  expect(rabbit.prompt).toContain('(kulaklar)');
  expect(giraffe.prompt).toContain('(boyun)');
  expect(isCorrect(rabbit,'ears')).toBe(true);
  expect(isCorrect(rabbit,'legs')).toBe(false);
  expect(isCorrect(giraffe,'neck')).toBe(true);
  expect(isCorrect(giraffe,'legs')).toBe(false);
  const museum = question('topic-1b4bbd51c1b627b3',4);
  expect(museum.prompt).toContain('(visit fiilini kullan)');
  expect(museum.prompt).toContain('Sözcük havuzu:');
  expect(isCorrect(museum,'visit')).toBe(true);
  // “See the museum” is valid English, so the task explicitly bounds the word.
  expect(museum.prompt).toContain('Yalnız havuzdaki uygun sözcüğü yaz.');
  const library = question('topic-93104bb5b9aa589b',4);
  expect(library.prompt).toContain('(kütüphane)');
  expect(isCorrect(library,'Bibliothek')).toBe(true);
  expect(isCorrect(library,'Turnhalle')).toBe(false);
 });

 it('çoktan seçmeli durum sorularında renk, kişi ve zaman anlamını açıkça sınırlar', () => {
  for (const id of ['topic-6be89b487a0ee7bf','topic-2d2bd7a1febfc939','topic-c2f908ae8ceddffa']) {
   const item=question(id,6);
   expect(item.prompt).toContain('Yeşil gözlerin');
   expect(item.prompt).toContain('birinci tekil kişi');
   expect(isCorrect(item,'I have got green eyes.')).toBe(true);
   // Brown describes the same speaker, but fails the requested green colour.
   expect(isCorrect(item,'I have got brown eyes.')).toBe(false);
   // She has the requested colour, but fails the requested first-person subject.
   expect(isCorrect(item,'She has got green eyes.')).toBe(false);
  }
  for (const id of ['topic-5a826dfd6ffb9736','topic-75517981852adfbe']) {
   const item=question(id,6);
   expect(item.prompt).toContain('geniş zamanda');
   expect(isCorrect(item,'My sister reads books.')).toBe(true);
   // Read can also be past tense, so the scenario must request present habits.
   expect(isCorrect(item,'My sister read books every day.')).toBe(false);
  }
 });

 it('gerçek dil sorularında I/Ich küçük harfini Türkçe ı ile karıştırmaz', () => {
  const english=question('topic-ee32c4efbaab6355',6);
  expect(isCorrect(english,'i am from germany.')).toBe(true);
  expect(isCorrect(english,'ı am from germany.')).toBe(false);
  const german=question('topic-48bd22bf5c3da3d9',6);
  expect(isCorrect(german,'ich schwimme gern.')).toBe(true);
  expect(isCorrect(german,'ıch schwimme gern.')).toBe(false);
 });
});
