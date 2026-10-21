import { describe, expect, it } from 'vitest';
import official from '../official-curriculum.json';
import { scienceLessons } from './science';

const bank = scienceLessons.flatMap(lesson => lesson.questions);
const find = (prompt: string) => {
 const question = bank.find(q => q.prompt === prompt);
 if (!question) throw Error(`Fen sorusu bulunamadı: ${prompt}`);
 return question;
};

describe('Fen Bilimleri anlatım ve soru içeriği', () => {
 it('korunan 22 resmî kaydın tümünü kapsar; tekrar başlıkları özgün soru sayısını şişirmez', () => {
  const expected = official.topics.filter(topic => topic.courseId === 'course-2').map(topic => topic.id).sort();
  expect(scienceLessons.map(lesson => lesson.topicId).sort()).toEqual(expected);
  expect(new Set(scienceLessons.map(lesson => lesson.topicId)).size).toBe(expected.length);
  expect(bank).toHaveLength(132);
  expect(new Set(bank.map(q => q.prompt + '|' + q.answer)).size).toBe(114);
  expect(new Set(bank.map(q => q.id)).size).toBe(bank.length);
 });

 it('her konuda açıklamalı çözüm, aşamalı örnek ve cevaplanabilir farklı zorluklar sunar', () => {
  for (const lesson of scienceLessons) {
   expect(lesson.sections.length).toBeGreaterThanOrEqual(2);
   expect(lesson.workedExample.steps.length).toBeGreaterThanOrEqual(3);
   expect(lesson.workedExample.answer).not.toBe('');
   expect(new Set(lesson.questions.map(q => q.difficulty))).toEqual(new Set([1, 2, 3, 4]));
   for (const question of lesson.questions) {
    expect(question.explanation.trim()).not.toBe('');
    expect(question.explanation.trim()).not.toBe(question.answer);
    expect(question.hints.length).toBeGreaterThan(0);
    if (question.choices) {
     expect(question.choices).toContain(question.answer);
     expect(new Set(question.choices).size).toBe(question.choices.length);
    }
   }
  }
 });

 it('evreyi tutulmayla, kütleyi ağırlıkla ve tanecik sıkışmasını tanecik küçülmesiyle karıştırmaz', () => {
  expect(find('“Ay’ın her evresi Dünya’nın gölgesinden oluşur.” diyen arkadaşına hangi açıklama uygundur?').answer)
   .toBe('Evreler, Ay’ın aydınlık yarısının farklı kısımlarını görmemizle oluşur.');
  expect(find('Bir taş Dünya’dan Ay’a taşınırsa hangisi değişmeden kalır?').answer).toBe('Kütlesi');
  expect(find('Bir modelde gaz sıkıştırılırken tanecikler daha küçük çizilmiş. Model nasıl düzeltilir?').answer)
   .toBe('Tanecikler aynı boyda, aralarındaki boşluk daha az çizilir.');
  expect(find('Katı maddelerin tanecikleri hiç hareket etmez.').answer).toBe('Yanlış');
 });

 it('özel ısı ve elektrik sonuçlarını gerekli koşullarıyla verir; değişken kontrolünü korur', () => {
  const temperature = find('İdeal yalıtılmış kapta eşit kütlede 20 °C ve 40 °C su karışırsa hangi son sıcaklık beklenir?');
  expect(temperature.answer).toBe('30 °C');
  expect(temperature.explanation).toMatch(/eşit kütlede.*ideal yalıtım/);
  expect(find('Aynı pille seri devrede özdeş ampul sayısı artırılırsa genellikle ne olur?').answer)
   .toBe('Ampuller daha sönük yanar.');
  expect(find('A düzeneğinde bir pil-bir ampul, B’de iki pil-üç ampul var. “Fark yalnız pil sayısındandır.” denebilir mi?').answer)
   .toBe('Hayır; hem pil hem ampul sayısı değişmiştir.');
 });

 it('etkinlikler priz, doğrudan Güneş gözlemi veya sıcak madde işlemi gerektirmez', () => {
  for (const lesson of scienceLessons) {
   expect(lesson.activity).toBeDefined();
   const instructions = lesson.activity!.instructions.join(' ');
   expect(instructions).not.toMatch(/prize\s+(?:bağla|tak|sok)|prizi\s+aç|güneş.e\s+(?:doğrudan\s+)?bak|(?:suyu|sıvıyı)\s+(?:kaynat|tat)|alevi\s+yak/iu);
  }
  expect(find('Bir öğrenci Güneş’i incelemek istiyor. Hangi yöntem güvenlidir?').answer)
   .toBe('Ders kitabındaki bilimsel görüntüleri karşılaştırmak');
  expect(find('Bir çocuk çizdiği devreyi denemek istiyor. Güvenli seçim hangisidir?').answer)
   .toBe('Öğretmen gözetiminde uygun düşük gerilimli pil düzeneği kullanmak');
  expect(find('Bir öğrenci kırık camı geri dönüşüme katkı için eliyle toplamak istiyor. Hangi yönlendirme uygundur?').answer)
   .toBe('Dokunmadan yetişkine haber vermek');
 });
});
