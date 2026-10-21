import { matchesTerm } from '../../src/grade5/terms.ts';
// Local-only content inventory. This does not import curriculum or call APIs.
import { writeFile } from 'node:fs/promises';
import { courses, topics, questions, questionsByCourse } from '../../src/grade5/catalog.ts';
import { lessons, lessonByTopic, contentStats } from '../../src/grade5/content.ts';

const ready = topic => lessonByTopic.has(topic.id) || topic.source.status === 'pending' && Boolean(topic.summary);
const normalize = text => text.trim().toLocaleLowerCase('tr').replace(/\s+/g, ' ');
const programs = courses.map(course => {
 const selected = topics.filter(topic => topic.courseId === course.id);
 const pool = questionsByCourse.get(course.id) || [];
 return {
  id: course.id, name: course.name, model: course.model,
  topicRecords: selected.length, readyTopics: selected.filter(ready).length,
  questionRecords: pool.length, distinctQuestionPrompts: new Set(pool.map(q => normalize(q.prompt))).size,
  missingTopics: selected.filter(topic => !ready(topic)).map(topic => ({ id: topic.id, title: topic.title, unit: topic.unit })),
 };
});
const firstTopics = topics.filter(t => matchesTerm(t, 'first'));
const firstIds = new Set(firstTopics.map(t => t.id));
const firstSemester = { topicRecords: firstTopics.length, readyTopics: firstTopics.filter(ready).length, questionRecords: questions.filter(q => firstIds.has(q.topicId)).length };
const report = {
 firstSemester,
 generatedAt: new Date().toISOString(), year: '2026-2027',
 materialAuthor: 'Eylunica', officialExamQuestions: false,
 questionOutcomeMapping: 'not-individually-verified', videoResearch: 'paused-by-user',
 programCount: courses.length, totalTopicRecords: topics.length,
 readyTopics: topics.filter(ready).length, newlyAuthoredTopics: lessons.length,
 programsWithContent: programs.filter(program => program.readyTopics > 0).length,
 programsWithoutContent: programs.filter(program => !program.readyTopics).map(program => program.id),
 pendingTopicRecords: topics.filter(topic => !ready(topic)).length,
 questionRecords: questions.length,
 distinctQuestionPrompts: new Set(questions.map(question => normalize(question.prompt))).size,
 practicalActivities: contentStats.practicalActivities,
 types: Object.fromEntries([...new Set(questions.map(q => q.kind))].map(kind => [kind,questions.filter(q => q.kind === kind).length])),
 perTopicTarget: 50, topicsMeetingQuestionTarget: topics.filter(topic => questions.filter(q => q.topicId === topic.id).length >= 50).length,
 programs,
};
await writeFile(new URL('../../docs/GRADE5-CONTENT-REPORT.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
const lines = [
 '# Eylunica · Ders içeriği ve yazılı hazırlığı', '',
 'Öğrenci kitaplığı yedi ana dersle sınırlıdır. Aşağıdaki envanter, geçmişi korumak için tutulan tüm program kayıtlarını da içerir. Matematiğin dokunmatik harita ve ayrı soru setleri: [MATH-JOURNEY.md](MATH-JOURNEY.md).', '',
 `Öncelik **1. dönem**: yıllık planda 1–18. haftalara ait **${firstSemester.topicRecords} konu**, **${firstSemester.readyTopics} hazır anlatım** ve **${firstSemester.questionRecords} soru ilişkisi**. Öğrenci ve yazılı ekranları ilk dönemle açılır. Haftası olmayan kayıtlar tahminen sınıflandırılmaz; tüm yıl ve dönemi belirtilmeyen seçenekleriyle korunur. Kaynak karşılaştırması: [QUESTION-REVIEW-REPORT.md](QUESTION-REVIEW-REPORT.md).`, '',
 `2026–2027 müfredat kayıtları korunarak **${report.readyTopics} konuda anlatım ve örnek çözüm**, **${report.questionRecords} soru kaydı** ve **${report.practicalActivities} uygulama etkinliği** eklendi/korundu. ${report.programsWithContent} ders/programda çalışılabilir içerik var.`, '',
 `Tekrar eden program başlıkları aynı kavram çalışmasını paylaşabilir. ${report.questionRecords} soru ilişkisi, ${report.distinctQuestionPrompts} farklı soru metnine karşılık gelir; her kayıt ayrı özgün problem sayılmaz.`, '',
 'Anlatım ve sorular Eylunica için özgün hazırlanmıştır. Bunlar resmî MEB soruları, onaylı öğretmen materyali veya gelecek yazılı tahmini değildir. Kaynak program/ünite çıktıları gösterilir; sorulara doğrulanmamış bire bir çıktı kodu yazılmaz.', '',
 '## Çalışan akış', '',
 '- Ders ve konu seçimi → anlatım → adımlı örnek → açıklamalı alıştırma → konu testi → yanlış tekrarı.',
 '- Ders ekranındaki **Yazılı testleri** ile işlenen üniteler seçilir; 10 veya 20 soru hedefi mevcut havuzla sınırlandırılır. Aynı soru metni bir yazılıda yinelenmez ve konulara sırayla soru verilir.',
 '- Yazılıda ipucu ve cevap anahtarı bitişe kadar gösterilmez. Boş soruyla bitirme açıkça onaylanır; sonuç doğru/yanlış/boş, 100 üzerinden puan ve konu dökümü içerir.',
 '- Yanıtlar cihazda otomatik saklanır. Yarım yazılı aynı sorular ve yanıtlarla açılır; son 20 yazılı sonucu korunur. Biten yazılının yanlışları konu tekrarına katılır.',
 '- Anlatım ve sorular üretim PWA önbelleğiyle çevrimdışı çalışır. Ebeveyn mola/süre geçişleri korunur; eski oyun kaydı değiştirilmez.',
 '- Video araştırması kullanıcı isteğiyle duraklatılmıştır. API kotası yenilense veya servis yeniden açılsa da duraklatma aşılmaz.', '',
 '## Ders bazında kapsam', '',
 '| Ders / program | Hazır anlatım / konu | Soru kaydı | Farklı soru metni |',
 '| --- | ---: | ---: | ---: |',
 ...programs.map(program => `| ${program.name.replaceAll('|','/')} | ${program.readyTopics}/${program.topicRecords} | ${program.questionRecords} | ${program.distinctQuestionPrompts} |`), '',
 '## Kalan içerik', '',
 `${report.pendingTopicRecords} mevcut konu kaydında bağımsız anlatım/soru paketi henüz yok. Konusuz programlar, belirsiz/parçalı kaynak başlıkları ve hazırlanmamış seçmeli içerikler uygulamada hazır gösterilmez. Bölgesel dil dersleri için doğrulanmış dil örnekleri gereklidir.`, '',
 `Konu başına 50 soru hedefi tamamlanmadı (${report.topicsMeetingQuestionTarget} konu bu hedefe ulaştı). Uygulamalı etkinlikler için kendini değerlendirme soruları vardır; yazılı puanı fiziksel/sanatsal performansı veya inancı ölçmez. Öğretmen içerik incelemesi ve eksik ders/soru yazımı sürdürülmelidir.`, '',
 'Tam konu listesi ve sayılar: [GRADE5-CONTENT-REPORT.json](GRADE5-CONTENT-REPORT.json). Yeniden üretim: `node tools/curriculum/content-report.mjs`. Üretim derlemesi ve test sonuçları [GRADE5-PROTOTYPE.md](GRADE5-PROTOTYPE.md) dosyasında tutulur.', '',
];
await writeFile(new URL('../../docs/GRADE5-CONTENT-REPORT.md',import.meta.url),lines.join('\n'));
console.log(JSON.stringify({readyTopics:report.readyTopics,programsWithContent:report.programsWithContent,questionRecords:report.questionRecords,distinctQuestionPrompts:report.distinctQuestionPrompts,pendingTopicRecords:report.pendingTopicRecords},null,2));
