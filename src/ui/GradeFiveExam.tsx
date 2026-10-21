import { matchesTerm, termLabels, type StudyTerm } from '../grade5/terms';
import { useMemo, useRef, useState } from 'react';
import { courses, topics, questionById, type Question } from '../grade5/catalog';
import {
  examStorageKey, availableExamQuestions, selectExamQuestions, createExam,
  readExams, scoreExam, completeExam, type ExamDraft, type ExamStore, type ExamResult,
} from '../grade5/exams';
import './GradeFiveExam.css';
import { QuestionSourceNote } from './QuestionSourceNote';

type Props = {
  courseId: string;
  initialTerm?: StudyTerm;
  onBack: () => void;
  onTransition: (action: () => void, startsTask?: boolean) => void;
  paused: boolean;
  guide?: string;
  onComplete?: (answers: { questionId: string; answer: string }[]) => void;
};
function loadStore() {
  try { return readExams(localStorage.getItem(examStorageKey)); }
  catch { return readExams(null); }
}

export function GradeFiveExam({ courseId, initialTerm = 'first', onBack, onTransition, paused, guide, onComplete }: Props) {
  const [term, setTerm] = useState<StudyTerm>(initialTerm);
  const course = courses.find(item => item.id === courseId);
  const courseTopics = useMemo(() => topics.filter(topic => topic.courseId === courseId), [courseId]);
  const allUnits = useMemo(() => [...new Set(courseTopics.map(topic => topic.unit))], [courseTopics]);
  const unitCounts = useMemo(() => new Map(allUnits.map(unit => [unit, availableExamQuestions(courseId, [unit], undefined, undefined, term).length])), [allUnits, courseId, term]);
  const readyUnits = useMemo(() => allUnits.filter(unit => unitCounts.get(unit)), [allUnits, unitCounts]);
  const [units, setUnits] = useState(readyUnits);
  const [count, setCount] = useState(10);
  const [store, setStore] = useState<ExamStore>(loadStore);
  const [phase, setPhase] = useState<'setup' | 'exam' | 'result'>('setup');
  const [result, setResult] = useState<ExamResult | null>(null);
  const [confirmBlanks, setConfirmBlanks] = useState(false);
  const [storageError, setStorageError] = useState('');
  const finishedSessions = useRef(new Set<string>());
  const draft = store.drafts[courseId];
  const eligible = useMemo(() => availableExamQuestions(courseId, units, undefined, undefined, term), [courseId, units, term]);
  const distinctCount = useMemo(() => selectExamQuestions({ courseId, units, count, seed: 1, term }).length, [courseId, units, count, term]);
  const selectedTopics = useMemo(() => new Set(eligible.map(question => question.topicId)).size, [eligible]);
  const history = useMemo(() => store.history.filter(item => item.courseId === courseId).slice().reverse(), [store.history, courseId]);
  const examQuestions = useMemo(() => draft?.questionIds.map(id => questionById.get(id)).filter((question): question is Question => !!question) || [], [draft?.questionIds]);
  const answered = examQuestions.filter(question => draft?.answers[question.id]?.trim()).length;

  function save(next: ExamStore) {
    setStore(next);
    try { localStorage.setItem(examStorageKey, JSON.stringify(next)); }
    catch { setStorageError('Yazılı kaydı cihazda saklanamadı. Bu oturumda devam edebilirsin; ekranı kapatırsan yanıtların kaybolabilir.'); }
  }
  function start() {
    if (paused) return;
    onTransition(() => {
      const seed = Math.floor(Math.random() * 0xffffffff);
      const next = createExam({ courseId, units, count, seed, term });
      save({ ...store, drafts: { ...store.drafts, [courseId]: next } });
      setConfirmBlanks(false); setResult(null); setPhase('exam');
    }, true);
  }
  function answer(questionId: string, value: string) {
    if (!draft || paused) return;
    const next: ExamDraft = { ...draft, answers: { ...draft.answers, [questionId]: value } };
    save({ ...store, drafts: { ...store.drafts, [courseId]: next } });
    setConfirmBlanks(false);
  }
  function finish() {
    if (!draft || paused || finishedSessions.current.has(draft.id)) return;
    onTransition(() => {
      if (finishedSessions.current.has(draft.id)) return;
      finishedSessions.current.add(draft.id);
      const finishedAt = Date.now();
      save(completeExam(store, draft, finishedAt));
      setResult({ ...draft, finishedAt }); setPhase('result'); setConfirmBlanks(false);
      onComplete?.(draft.questionIds.map(questionId => ({ questionId, answer: draft.answers[questionId] || '' })));
    });
  }
  function askFinish() {
    if (!draft || paused) return;
    if (answered < examQuestions.length) setConfirmBlanks(true);
    else finish();
  }
  const scored = useMemo(() => result ? scoreExam(result) : null, [result]);
  return <main className="subpage grade-five grade-five-exam">
    <button className="text-button exam-back" onClick={onBack}>← Derse dön</button>
    <div className="eyebrow muted">5. SINIF · YAZILIYA HAZIRLIK</div>
    <h1>{course?.name || 'Ders'} · Yazılı çalışması</h1>
    <p>Çalışma kapsamı: {termLabels[(phase === 'exam' ? draft?.term : phase === 'result' ? result?.term : term) || 'all']}</p>
    {phase === 'setup' && <label>Çalışma dönemi <select value={term} onChange={e => { const next = e.target.value as StudyTerm; setTerm(next); setUnits([...new Set(courseTopics.filter(t => matchesTerm(t, next)).map(t => t.unit))]); }}>{Object.entries(termLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>}
    <p>{guide ? `${guide} ile ` : ''}Öğrendiğin konuları kendi hızında gözden geçir. Bunlar Eylunica'nın özgün hazırlık sorularıdır; resmî MEB yazılısı veya sınav tahmini değildir.</p>
    {storageError && <p role="alert">{storageError}</p>}
    {paused && <p role="status">Mola sırasında yanıtların korunur. Devam ettiğinde kaldığın yerden çözebilirsin.</p>}
    {phase === 'setup' && <section aria-label="Yazılı hazırlama">
      <h2>Çalışacağın üniteleri seç</h2>
      <p>Okulunda işlenen üniteleri seç. Dönem ve sınav kapsamını öğretmeninin planına göre belirleyebilirsin.</p>
      {draft && <aside className="exam-resume" aria-label="Yarım kalan yazılı">
        <h3>Yarım kalan yazılın hazır</h3>
        <p>{draft.questionIds.length} sorudan {draft.questionIds.filter(id => draft.answers[id]?.trim()).length} tanesini yanıtladın. Kaydedilmiş soruların ve yanıtların korunuyor.</p>
        <button className="primary" disabled={paused} onClick={() => onTransition(() => { setPhase('exam'); setConfirmBlanks(false); }, true)}>Yarım kalan yazılıya devam et</button>
        <p>Yeni yazılı başlatırsan bu yarım kalan çalışma yerine yenisi kaydedilir.</p>
      </aside>}
      <fieldset disabled={paused} className="exam-units"><legend>Yazılı kapsamı</legend>
        {allUnits.map(unit => {
          const ready = unitCounts.get(unit) || 0;
          return <label key={unit}><input type="checkbox" checked={units.includes(unit)} disabled={!ready}
            onChange={event => setUnits(current => event.target.checked ? [...current, unit] : current.filter(item => item !== unit))} />
            <span>{unit} · {ready ? `${ready} soru` : 'Sorular hazırlanıyor'}</span></label>;
        })}
      </fieldset>
      {!allUnits.length && <p>Bu dersin konu ve soru içeriği henüz hazırlanmadı.</p>}
      <label className="exam-count">Hedef soru sayısı <select value={count} disabled={paused} onChange={event => setCount(Number(event.target.value))}><option value={10}>10 soru</option><option value={20}>20 soru</option></select></label>
      <p role="status">Seçilen kapsamda {selectedTopics} konu ve {eligible.length} kayıtlı soru var. Tekrarlanan soru metinleri çıkarılarak {distinctCount} soruluk yazılı hazırlanacak.</p>
      <p>Süre sınırı yok. Cevap anahtarı ve açıklamalar yazılıyı bitirdiğinde açılır. Yanlışlar puanından ayrıca düşülmez; boş yanıtlar puan getirmez.</p>
      <button className="primary" disabled={paused || !distinctCount} onClick={start}>{draft ? 'Yeni yazılı başlat' : 'Yazılıyı başlat'}</button>
      {history.length > 0 && <section aria-label="Önceki yazılılar"><h2>Önceki çalışmaların</h2>
        <ul>{history.map(item => { const score = scoreExam(item); return <li key={item.id}>
          <button onClick={() => { setResult(item); setPhase('result'); }}>
            {new Date(item.finishedAt).toLocaleDateString('tr-TR')} · {score.total} soru · {score.score}/100 · Sonucu incele
          </button>
        </li>; })}</ul>
      </section>}
    </section>}
    {phase === 'exam' && draft && <section aria-label="Yazılı soruları">
      <h2>Yazılı çalışman</h2>
      <p role="status">{answered}/{examQuestions.length} soru yanıtlandı. Yanıtların bu cihazda otomatik saklanır.</p>
      <form onSubmit={event => { event.preventDefault(); askFinish(); }}>
        {examQuestions.map((question, index) => <fieldset key={question.id} disabled={paused} className="exam-question">
          <legend>{index + 1}. {question.prompt}</legend>
          <p className="muted">{courseTopics.find(topic => topic.id === question.topicId)?.title}</p>
          {question.image && <img src={question.image.src} alt={question.image.alt} />}
          {['choice', 'boolean', 'visual'].includes(question.kind) && question.choices ? <div className="exam-choices">
            {question.choices.map(choice => <label key={choice}><input type="radio" name={`exam-${question.id}`} checked={draft.answers[question.id] === choice} onChange={() => answer(question.id, choice)} /><span>{choice}</span></label>)}
            {draft.answers[question.id] && <button type="button" onClick={() => answer(question.id, '')}>Yanıtı temizle</button>}
          </div> : <>
            {question.choices && <p>Kullanılacak ögeler: {question.choices.join(' · ')}</p>}
            <label>Yanıtın (soru {index + 1}) <input type="text" value={draft.answers[question.id] || ''} maxLength={2000} autoComplete="off" onChange={event => answer(question.id, event.target.value)} /></label>
          </>}
        </fieldset>)}
        <button className="primary" type="submit" disabled={paused}>Yazılıyı bitir</button>
      </form>
      {confirmBlanks && <aside className="exam-confirm" role="alert">
        <p>{examQuestions.length - answered} soru boş. Boş sorular puan getirmez. Yazılıyı bu yanıtlarla bitirmek istiyor musun?</p>
        <button disabled={paused} onClick={() => setConfirmBlanks(false)}>Sorulara dön</button>
        <button className="primary" disabled={paused} onClick={finish}>Boşlarla bitir</button>
      </aside>}
      <button className="text-button" onClick={() => setPhase('setup')}>Kaydet ve hazırlık ekranına dön</button>
    </section>}
    {phase === 'result' && result && scored && <section aria-label="Yazılı sonucu">
      <h2>Çalışmanın sonucu</h2>
      <p className="exam-score" role="status">{scored.score}/100 · {scored.correct} doğru · {scored.wrong} yanlış · {scored.blank} boş</p>
      <p>Her soru eşit ağırlıktadır. Doğru yanıt sayısı toplam soru sayısına bölünerek 100 üzerinden puanlanır.</p>
      <h3>Konu konu durumun</h3>
      <ul>{scored.byTopic.map(topic => <li key={topic.topicId}>
        {courseTopics.find(item => item.id === topic.topicId)?.title || 'Konu'}: {topic.correct}/{topic.total} doğru · {topic.wrong} yanlış · {topic.blank} boş
      </li>)}</ul>
      <p>Zorlandığın konuların anlatımına ve alıştırmalarına dönerek yeniden deneyebilirsin.</p>
      <h3>Cevap anahtarı ve çözümler</h3>
      <ol className="exam-answer-key">{scored.details.map(({ question, answer: given, status }) => <li key={question.id}>
        <h4>{question.prompt}</h4>
        <p>{status === 'correct' ? 'Doğru' : status === 'wrong' ? 'Yanlış' : 'Boş bırakıldı'} · Yanıtın: {given || '—'}</p>
        <p><strong>Doğru cevap: {question.answer}</strong></p>
        <p>{question.explanation}</p>
        <QuestionSourceNote question={question} />
      </li>)}</ol>
      <button className="primary" onClick={() => { setResult(null); setPhase('setup'); }}>Yeni yazılı hazırla</button>
    </section>}
  </main>;
}
