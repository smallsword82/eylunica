import { matchesTerm } from '../../src/grade5/terms.ts';
// Reproducible local audit; no network and no publication/approval side effects.
import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { questions, topics, sourceComparedQuestions } from '../../src/grade5/catalog.ts';
import { questionSources, questionCorrections, questionSourceById } from '../../src/grade5/question-review.ts';
const failures = [], ids = new Set(), topicIds = new Set(topics.map(t => t.id));
for (const question of questions) {
 if (ids.has(question.id)) failures.push({id:question.id,reason:'duplicate-id'});
 ids.add(question.id);
 if (!topicIds.has(question.topicId) || !question.answer.trim() || !question.explanation.trim() || !question.hints.length)
  failures.push({id:question.id,reason:'missing-topic-answer-or-explanation'});
 if (['choice','boolean','visual'].includes(question.kind) && (!question.choices?.includes(question.answer) || new Set(question.choices).size!==question.choices.length))
  failures.push({id:question.id,reason:'invalid-options'});
 for (const reference of question.sourceReview?.references || []) {
  const source=questionSourceById.get(reference.sourceId);
  if (!source || reference.pdfPages.some(page=>!source.reviewedPdfPages.includes(page))) failures.push({id:question.id,reason:'unverified-reference-page'});
 }
}
// Validate bytes when the local source cache is available; a missing cache is
// reported separately and never silently described as re-verified.
const sourceChecks=[];
for (const source of questionSources) {
 try { const data=await readFile(new URL('../../'+source.localCache,import.meta.url));
  const matches=data.subarray(0,4).toString()==='%PDF' && createHash('sha256').update(data).digest('hex')===source.sha256;
  sourceChecks.push({sourceId:source.id,cacheStatus:matches?'hash-verified':'hash-mismatch'});
  if(!matches)failures.push({sourceId:source.id,reason:'source-bytes-mismatch'});
 } catch(error){if(error.code!=='ENOENT')throw error;sourceChecks.push({sourceId:source.id,cacheStatus:'not-present'});}
}
const reviewed=questions.filter(q=>q.sourceReview);
const firstTopics = topics.filter(t => matchesTerm(t, 'first'));
const firstIds = new Set(firstTopics.map(t => t.id));
const firstQuestions = questions.filter(q => firstIds.has(q.topicId));
const firstSemester = { topicRecords: firstTopics.length, topicsWithQuestions: new Set(firstQuestions.map(q => q.topicId)).size, questionRecords: firstQuestions.length, sourceComparedRecords: firstQuestions.filter(q => q.sourceReview).length, unknownTermTopics: topics.filter(t => matchesTerm(t, 'unknown')).length };
const report={firstSemester,generatedAt:new Date().toISOString(),reviewer:'Codex',teacherApproval:false,officialPastExamItems:0,
 totalQuestionRecords:questions.length,automatedChecks:{checkedRecords:questions.length,failures},
 sourceComparedRecords:reviewed.length,writingGuidelineCorrections:reviewed.filter(q=>q.sourceReview.comparison==='writing-guidelines').length,
 distinctCorrectionRules:questionCorrections.length,newExampleBasedQuestions:sourceComparedQuestions.length,
 withoutIndividualSourceComparison:questions.length-reviewed.length,sourceChecks,
 sourceScope:'Official item-writing guide, its basic-education examples, three grade-5 books/guides, and assessment guidance; not a historical exam collection.',
 corrections:questions.filter(q=>q.sourceReview?.comparison==='writing-guidelines').map(q=>({id:q.id,topicId:q.topicId,prompt:q.prompt,note:q.sourceReview.note})),
 exampleBasedQuestions:sourceComparedQuestions.map(q=>({id:q.id,topicId:q.topicId,references:q.sourceReview.references})),
};
await writeFile(new URL('../../docs/QUESTION-REVIEW-REPORT.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
const lines=['# MEB kaynaklarıyla soru bankası düzeltmesi','',
 `Öncelik ilk dönemdir (doğrulanmış 1–18. haftalar): **${firstSemester.topicRecords} konu**, **${firstSemester.topicsWithQuestions} sorulu konu**, **${firstSemester.questionRecords} soru ilişkisi**, bunların **${firstSemester.sourceComparedRecords}** tanesinde bireysel kaynak karşılaştırma kaydı. Dönemi belirtilmeyen **${firstSemester.unknownTermTopics}** kayıt tahminen sınıflandırılmadı. İkinci dönem içerikleri korunur.`, '',
 `Tüm **${questions.length} soru kaydı** konu bağlantısı, seçenek/cevap tutarlılığı ve zorunlu alanlar açısından tarandı. Teknik hata: **${failures.length}**. Bu denetim pedagojik doğrulama veya her cevabın resmî bir soru anahtarından doğrulanması anlamına gelmez.`, '',
 `**${report.writingGuidelineCorrections} soru kaydında (${questionCorrections.length} ortak soru kuralı) kök/çeldiriciler düzeltildi. ${report.newExampleBasedQuestions} yeni bağlamlı soru** resmî örnek ve etkinliklerin beceri/soru yapısı karşılaştırılarak özgün hazırlandı. Doğru cevaplar ve eski soru kimlikleri korunarak mevcut kayıtların bozulması önlendi.`, '',
 '## İncelenen resmî kaynaklar', '',
 '| Kaynak | İncelenen PDF sayfaları |', '| --- | --- |',
 ...questionSources.map(source=>`| [${source.title}](${source.url}) | ${source.reviewedPdfPages.join(', ')} |`), '',
 'Sayfalar PDF dosyasındaki 1 tabanlı sayfa numarasıdır. Tam dosya karmaları, alınma zamanı ve yerel önbellek konumu `src/grade5/question-sources.json` içinde tutulur; PDF dosyaları öğrenci paketine kopyalanmaz. Otomatik rapor üretiminde mevcut önbellek dosyalarının SHA-256 değeri yeniden kontrol edilir.', '',
 '## Yapılan düzeltmeler', '',
 '- Konu dışı, bariz yanlış veya sırf seçenek dolduran çeldiriciler yerine konu içindeki karışıklıkları hedefleyen seçenekler yazıldı.',
 '- AFAD, tarihî yapının işlevi ve takım planı gibi genel/eksik bağlamlı kökler açıklaştırıldı. Eski doğru cevap metinleri korundu.',
 '- Türkçe için metne dayalı kanıt/çıkarım; matematik için kısıtlı sayı tablosu; fen için Ay gözlemi; sosyal için değişim/neden-sonuç; din kültürü için anlamı özetleme örnekleri karşılaştırıldı.',
 '- Bilişim ve görsel sanatlarda gerçek 5. sınıf kılavuz etkinlikleriyle bağlantılı problem çözme ve afiş okuma soruları eklendi.',
 '- Alıştırma çözümünde ve yazılı sonuçlarında kaynağın adı, amacı ve PDF sayfaları görülebilir. Cevap ve kaynak açıklamaları yazılı bitene kadar açılmaz.', '',
 '## Kapsamın sınırı', '',
 `Bireysel resmî kaynak karşılaştırması kaydedilen **${reviewed.length}**, henüz kaydedilmeyen **${report.withoutIndividualSourceComparison}** soru ilişkisi var. İkincilere otomatik kaynak onayı verilmedi. Bütün bankanın kaynak karşılaştırmasının tamamlandığı iddia edilmez. İncelenen belgeler bir “çıkmış sınav soruları” koleksiyonu değildir; bu tur doğrudan çıkmış soru diye etiketlenen kayıt yoktur.`, '',
 'OYSS kılavuzunun PDF 4. sayfası okul yazılılarında açık uçlu/kısa cevaplı sorulara ilişkin çerçeveyi anlatır. Uygulamadaki çoktan seçmeli/karma yazılı çalışması özgün bir hazırlık testidir; okulun resmî yazılısı, dağılım senaryosu veya resmî notu olarak sunulmaz. Kılavuzdaki 9/10. sınıf pilot uygulaması 5. sınıf soru bankası kabul edilmedi.', '',
 'Yeniden üretim: `node tools/curriculum/question-review-report.mjs`. Makinece okunabilir sonuçlar: [QUESTION-REVIEW-REPORT.json](QUESTION-REVIEW-REPORT.json). Öğretmen onayı kaydı yoktur; kaynak temelli editöryel kontrol ile teknik test sonuçları ayrı tutulur.',''];
await writeFile(new URL('../../docs/QUESTION-REVIEW-REPORT.md',import.meta.url),lines.join('\n'));
console.log(JSON.stringify({total:questions.length,corrected:report.writingGuidelineCorrections,newExampleBasedQuestions:sourceComparedQuestions.length,individualComparison:reviewed.length,remaining:report.withoutIndividualSourceComparison,failures:failures.length,sourceChecks},null,2));
if(failures.length)process.exitCode=1;
