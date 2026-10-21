import { describe, expect, it } from 'vitest';
import { questions, courses, topics } from './catalog';
import { readLearning, recordAttempt, nextQuestion, isCorrect } from './engine';
describe('5. sınıf yerel öğrenme', () => {
  it('mevcut ilerleme şemasını yeni kayıt olarak kullanmaz; bozuk veriyi ayıklar', () => {
    expect(readLearning('{broken')).toEqual({ version: 1, attempts: [] });
    expect(readLearning(JSON.stringify({ stars: 50 }))).toEqual({ version: 1, attempts: [] });
    expect(readLearning(JSON.stringify({ version: 1, attempts: [null, { questionId: 'pv1', correct: true, hinted: false, at: 4 }] })).attempts).toHaveLength(1);
  });
  it('ilk yanıtı kaydeder, yanlışları tekrar seçer, düzelen yanlışı tekrar havuzundan çıkarır', () => {
    const q = questions[0]; const empty = readLearning(null);
    const wrong = recordAttempt(empty, q, '40', false);
    expect(nextQuestion(q.topicId, wrong, true)?.id).toBe(q.id);
    expect(nextQuestion(q.topicId, wrong)?.id).not.toBe(q.id);
    const fixed = recordAttempt(wrong, q, q.answer, false);
    expect(nextQuestion(q.topicId, fixed, true)).toBeUndefined();
    expect(empty.attempts).toHaveLength(0);
  });
  it('oturum içinde tükenen soruları tekrarlamaz', () => {
    const ids = questions.filter(q => q.topicId === 'place-value').map(q => q.id);
    expect(nextQuestion('place-value', readLearning(null), false, ids)).toBeUndefined();
  });
  it('başka dersteki başarı matematik konusunun başlangıç zorluğunu değiştirmez', () => {
    const reading = questions.find(q => q.id === 're1')!;
    let state = readLearning(null);
    for (let i=0;i<3;i++) state = recordAttempt(state, reading, reading.answer, false);
    expect(nextQuestion('place-value', state)?.difficulty).toBe(1);
    for (const id of ['pv1','pv2','pv3']) {
      const q = questions.find(q => q.id === id)!;
      state = recordAttempt(state, q, q.answer, false);
    }
    expect(nextQuestion('place-value', state)?.id).toBe('pv4');
  });
  it('eşleştirme, sıralama, metin ve seçenek cevaplarını değerlendirir', () => {
    for (const q of questions) expect(isCorrect(q, ` ${q.answer} `)).toBe(true);
    expect(isCorrect(questions[0], '4')).toBe(false);
    expect(isCorrect(questions.find(q => q.kind === 'matching')!, 'a = 6000, b = 600')).toBe(true);
  });
  it('İngilizce ve Almanca yanıtlarında Türkçe I dönüşümünü uygulamaz', () => {
    const english = topics.find(t => t.courseId === 'course-4')!;
    const german = topics.find(t => t.courseId === 'course-5')!;
    expect(isCorrect({ ...questions[0], topicId: english.id, answer: 'I am ten.' }, 'i AM ten.')).toBe(true);
    expect(isCorrect({ ...questions[0], topicId: german.id, answer: 'Ich heiße Ada.' }, 'ich heiße ada.')).toBe(true);
    expect(isCorrect({ ...questions[0], topicId: english.id, answer: 'Don’t' }, "Don't")).toBe(true);
    expect(isCorrect({ ...questions[0], answer: 'IŞIK' }, 'ışık')).toBe(true);
  });
  it('matematikte yüzde işaretinin eşdeğer yerini ve ondalık ayırıcıyı kabul eder', () => {
    const question = { ...questions[0], kind: 'fill' as const, answer: '%75' };
    expect(isCorrect(question, '75%')).toBe(true);
    expect(isCorrect(question, '75')).toBe(false);
    expect(isCorrect({ ...question, answer: '0,25' }, '0.25')).toBe(true);
    expect(isCorrect({ ...question, answer: '0,25' }, '0.5')).toBe(false);
  });
  it('doğrulanmamış içerik için çıktı kodu ve hafta uydurmaz', () => {
    expect(courses.length).toBeGreaterThanOrEqual(12);
    expect(courses.some(c => c.id === 'course-5' && c.model === 'multiple-language')).toBe(true);
    expect(topics.filter(t => t.source.status === 'pending').every(t => !t.weeks.length && !t.outcomes.length)).toBe(true);
    expect(topics.filter(t => t.source.status === 'verified').length).toBeGreaterThan(300);
    expect(topics.some(t => t.courseId === 'course-1' && t.weeks.includes(10) && t.outcomes.some(o => o.code === 'MAT.5.1.1'))).toBe(true);
    expect(new Set(topics.map(t=>t.id)).size).toBe(topics.length);
    expect(questions.every(q => q.outcomeCode === null)).toBe(true);
  });
});
