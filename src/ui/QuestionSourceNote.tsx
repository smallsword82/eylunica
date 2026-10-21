import type { Question } from '../grade5/catalog';
import { questionSourceById } from '../grade5/question-review';

export function QuestionSourceNote({ question }: { question: Question }) {
 const review = question.sourceReview;
 return <details className="question-source-note">
  <summary>Soru kaynağı ve kontrolü</summary>
  <p>Özgün Eylunica hazırlık sorusudur; çıkmış veya MEB tarafından onaylanmış soru değildir.</p>
  {!review ? <p>Bu soru için bireysel resmî kaynak karşılaştırması henüz kaydedilmedi.</p> : <>
   <p>{review.comparison === 'official-example' ? 'Resmî örnek veya etkinlikle beceri ve soru yapısı karşılaştırıldı.' : 'MEB soru yazım ilkelerine göre kök ve çeldiriciler düzeltildi.'} Kontrol: {review.reviewedAt}.</p>
   <p>{review.note}</p>
   <ul>{review.references.map((reference,index) => {
    const source = questionSourceById.get(reference.sourceId);
    return source ? <li key={index}><a href={`${source.url}#page=${reference.pdfPages[0]}`} target="_blank" rel="noreferrer">{source.title} · PDF s. {reference.pdfPages.join(', ')}</a><p>{reference.purpose}</p></li> : null;
   })}</ul>
  </>}
 </details>;
}
