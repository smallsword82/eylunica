import { LessonShell, Pager } from './LessonShell';
import {ScienceJourney} from './ScienceJourney';
import {CourseRoad} from './CourseRoad';
import {ScienceOrbitModel} from './ScienceOrbitModel';
import {MoonPhaseModel} from './MoonPhaseModel';
import {ForceExperiment} from './ForceExperiment';
import {SocialLesson,socialVisualTopics} from './SocialLesson';
import { MathJourney } from './MathJourney';
import { AngleLesson } from './AngleLesson';
import { MathVisualLesson } from './MathVisualLesson';
import { MathTopicArt } from './MathTopicArt';
import { mathModels } from './math-visual-models';
import { GradeFiveDiscovery } from './GradeFiveDiscovery';
import { matchesTerm, termLabels, type StudyTerm } from '../grade5/terms';
import './GradeFive.css';
import { useEffect, useState, type ReactNode } from 'react';
import { courses, questionsByTopic, topicsByCourse, questionsByCourse, questionById, timetable, type Topic, type Question } from '../grade5/catalog';
import { readLearning, learningKey, nextQuestion, recordAttempt, isCorrect, latestAttempts } from '../grade5/engine';
import { approvedVideos, videoUrl } from '../grade5/videos';
import { lessonByTopic } from '../grade5/content';
import { GradeFiveExam } from './GradeFiveExam';
import { QuestionSourceNote } from './QuestionSourceNote';
type Stage = 'summary' | 'video' | 'example' | 'practice' | 'test' | 'review';
const stages: { id: Stage; label: string; icon: string }[] = [
  { id: 'summary', label: 'Konu anlatımı', icon: '⭐' }, { id: 'video', label: 'Video', icon: '▶' }, { id: 'example', label: 'Örnek çözüm', icon: '✎' },
  { id: 'practice', label: 'Alıştırmalar', icon: '✦' }, { id: 'test', label: 'Konu testi', icon: '☰' }, { id: 'review', label: 'Yanlışları tekrar et', icon: '↻' },
];
export function GradeFive({ onBack, onTransition, guide, paused, audioMode, onAudioMode }: { onBack: () => void; onTransition: (action: () => void, startsTask?: boolean) => void; guide: string; paused: boolean; audioMode: "silent" | "effects" | "music"; onAudioMode: (mode: "silent" | "effects" | "music") => void }) {
  const [courseId, setCourse] = useState<string | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [roadPage,setRoadPage]=useState(0);
  const [term, setTerm] = useState<StudyTerm>('first');
  const [unitFilter, setUnitFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const [stage, setStage] = useState<Stage>('summary');
  const [page, setPage] = useState(0);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [storageError, setStorageError] = useState('');
  const [learning, setLearning] = useState(() => { try { return readLearning(localStorage.getItem(learningKey)); } catch { return readLearning(null); } });
  const [question, setQuestion] = useState<Question>();
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videoConsent, setVideoConsent] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  useEffect(() => { if (paused) setPlayingVideo(null); }, [paused]);
  useEffect(() => { setPage(0); setVisited(new Set()); }, [topic?.id]);
  useEffect(() => { const hide = () => { if (document.hidden) setPlayingVideo(null); }; document.addEventListener('visibilitychange', hide); return () => document.removeEventListener('visibilitychange', hide); }, []);
  function selectStage(next: Stage) { onTransition(() => {
    setPlayingVideo(null); setVideoConsent(false); setVisited(v => new Set([...v, stage])); setStage(next); setPage(0); setSeen([]); setAnswer(''); setFeedback(null); setHint(false);
    setQuestion(topic ? nextQuestion(topic.id, learning, next === 'review') : undefined);
  }, ['practice', 'test', 'review'].includes(next)); }
  function submit() {
    if (paused || !question || feedback !== null || !answer.trim()) return;
    const updated = recordAttempt(learning, question, answer, hint);
    setLearning(updated);
    try { localStorage.setItem(learningKey, JSON.stringify(updated)); } catch { setStorageError('İlerleme kaydedilemedi; bu oturumda devam edebilirsin.'); }
    setFeedback(`${isCorrect(question, answer) ? 'Doğru!' : 'Birlikte bakalım.'} ${question.explanation}`);
  }
  function recordExam(answers: { questionId: string; answer: string }[]) {
    let updated = learning;
    for (const response of answers) {
      const q = questionById.get(response.questionId);
      if (q) updated = recordAttempt(updated, q, response.answer, false);
    }
    setLearning(updated);
    try { localStorage.setItem(learningKey, JSON.stringify(updated)); } catch { setStorageError('İlerleme kaydedilemedi; bu oturumda devam edebilirsin.'); }
  }
  const course = courses.find(c => c.id === courseId);
  const lesson = topic ? lessonByTopic.get(topic.id) : undefined;
  const attempts = topic ? learning.attempts.filter(a => questionById.get(a.questionId)?.topicId === topic.id) : [];
  const latest = latestAttempts(learning);
  const courseTopics = courseId ? (topicsByCourse.get(courseId) || []).filter(t => matchesTerm(t, term)) : [];
  const courseQuestions = courseId ? (questionsByCourse.get(courseId) || []).filter(q => courseTopics.some(t => t.id === q.topicId)) : [];
  const topicQuestions = topic ? questionsByTopic.get(topic.id) || [] : [];
  const filteredTopics = courseTopics.filter(t => (!unitFilter || t.unit === unitFilter) && t.title.toLocaleLowerCase('tr').includes(topicFilter.toLocaleLowerCase('tr')));
  if (!courseId) return <GradeFiveDiscovery audioMode={audioMode} onAudioMode={onAudioMode} paused={paused} onTransition={onTransition} onBack={onBack} onCourse={id => { setCourse(id);setRoadPage(0); setUnitFilter(''); setTopicFilter(''); setVisibleCount(24); if (id === 'course-6') setTerm('unknown'); else setTerm('first'); }} />;
  if (examOpen && course) return <GradeFiveExam initialTerm={term} courseId={course.id} onBack={() => setExamOpen(false)} onTransition={onTransition} paused={paused} guide={guide} onComplete={recordExam} />;
  if (courseId === 'course-1') return <MathJourney onBack={() => setCourse(null)} onExam={value => {setTerm(value);setExamOpen(true);}} paused={paused} onTransition={onTransition} onRecord={(id, value, hinted) => { const q=questionById.get(id); if(!q)return; setLearning(current => { const next=recordAttempt(current,q,value,hinted); try{localStorage.setItem(learningKey,JSON.stringify(next));}catch{setStorageError('İlerleme kaydedilemedi.');}return next; }); }} />;
  if(courseId==='course-2'&&!topic)return <ScienceJourney paused={paused} onBack={()=>setCourse(null)} onLegacyTopic={t=>onTransition(()=>{setTopic(t);setStage('summary');},true)} onLegacyExam={value=>{setTerm(value);setExamOpen(true);}} onTransition={onTransition} onRecord={(id,value,hinted)=>{const q=questionById.get(id);if(!q)return;setLearning(current=>{const next=recordAttempt(current,q,value,hinted);try{localStorage.setItem(learningKey,JSON.stringify(next));}catch{setStorageError('İlerleme kaydedilemedi.');}return next;});}}/>;
  if(courseId!=='course-1'&&!topic)return <CourseRoad courseId={courseId} page={roadPage} onPage={setRoadPage} topics={courseTopics} term={term} onTerm={setTerm} onTopic={t=>onTransition(()=>{setTopic(t);setStage('summary');},true)} onBack={()=>setCourse(null)} onExam={()=>onTransition(()=>setExamOpen(true))}/>;
  if(courseId==='course-3'&&topic&&socialVisualTopics[topic.id]&&['summary','example'].includes(stage))return <SocialLesson key={`${topic.id}-${stage}`} topic={topic} example={stage==='example'} paused={paused} onBack={()=>setTopic(null)} onPractice={()=>selectStage('practice')} onExample={()=>selectStage('example')}/>;
  if (topic) {
    const stageIndex = stages.findIndex(s => s.id === stage);
    const following = stages[stageIndex + 1];
    const nextStep = following ? <button className="ey-next" disabled={paused} onClick={() => selectStage(following.id)}>Sıradaki: {following.label} <span aria-hidden="true">→</span></button> : <button className="ey-next" onClick={() => { setTopic(null); setPlayingVideo(null); }}>Konuyu bitir <span aria-hidden="true">✓</span></button>;
    const reading: { title: string; body: ReactNode }[] = [
      { title: 'Birlikte keşfedelim', body: <>{!lesson && topic.source.status === 'verified' && <p>Bu konu için bağımsız ders anlatımı henüz hazırlanmadı. Kaynak programın hedefleri gösteriliyor.</p>}{topic.summary && <p>{topic.summary}</p>}
        {course?.id === 'course-2' && ['topic-deb6379d1b9f00ce','topic-cb9c84d286b6327c'].includes(topic.id) && <ForceExperiment paused={paused} frictionOnly={topic.id==='topic-cb9c84d286b6327c'} />}
        {course?.id === 'course-2' && topic.id === 'topic-55b0812fbc9fd348' && <MoonPhaseModel />}
        {course?.id === 'course-2' && ['topic-7e5324bf5f149562','topic-55b0812fbc9fd348','topic-7e58bf568a744020'].includes(topic.id) && <ScienceOrbitModel />}
        {attempts.slice(-3).filter(a => !a.correct).length >= 2 && <p>Bu konuyu birlikte yeniden okuyalım; sonra örnek çözüme bakabilirsin.</p>}</> },
      ...(lesson?.sections || []).map(part => ({ title: part.title, body: <>{part.body.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</> })),
      ...(lesson?.activity ? [{ title: lesson.activity.title, body: <aside className="lesson-activity"><ol>{lesson.activity.instructions.map((step, i) => <li key={i}>{step}</li>)}</ol><p>{lesson.activity.reflection}</p></aside> }] : []),
      ...(topic.outcomes.length ? [{ title: topic.outcomeScope === 'week' ? 'Bu haftalara ait öğrenme çıktıları' : 'Ünite öğrenme çıktıları', body: <><p>Kaynak programın kapsamını gösterir; her sorunun bu çıktılara tek tek eşleştirildiği anlamına gelmez.</p><ul>{topic.outcomes.map(o => <li key={o.code}>{o.code} · {o.text}</li>)}</ul>{topic.weeks.length > 0 && <p>Taslak plan haftaları: {topic.weeks.join(', ')}</p>}<p><a href={topic.source.url} target="_blank" rel="noreferrer">Resmî program kaynağı</a> · {topic.source.note}</p></> }] : []),
    ];
    const current = reading[Math.min(page, reading.length - 1)];
    return <LessonShell crumb={`${course?.name || ''} · ${topic.unit}`} title={topic.title} steps={stages} current={stage} done={visited} onStep={id => selectStage(id as Stage)} backLabel="Konulara dön" onBack={() => { setTopic(null); setPlayingVideo(null); }}
      footer={stage === 'summary' ? undefined : nextStep}
      status={['practice', 'test', 'review'].includes(stage) ? `${attempts.length} yanıt · doğruluk %${attempts.length ? Math.round(attempts.filter(a => a.correct).length / attempts.length * 100) : 0} · ${topicQuestions.filter(q => latest.get(q.id)?.correct === false).length} tekrar sorusu` : undefined}>
      {storageError && <p role="alert">{storageError}</p>}
      {stage === 'summary' && (course?.id === 'course-1' && mathModels[topic.id] ? <>{mathModels[topic.id] === 'angle' ? <AngleLesson key={topic.id} paused={paused} onTransition={onTransition} onPractice={() => selectStage('practice')} /> : <MathVisualLesson key={topic.id} topic={topic} paused={paused} onTransition={onTransition} onPractice={() => selectStage('practice')} />}<details><summary>Kaynak programın öğrenme çıktıları</summary><ul>{topic.outcomes.map(o => <li key={o.code}>{o.code} · {o.text}</li>)}</ul><p>Taslak plan haftaları: {topic.weeks.join(', ') || 'Belirtilmedi'}</p></details></> : <section className="lesson-reading ey-body" key={page}><h2>{current.title}</h2>{current.body}<Pager page={Math.min(page, reading.length - 1)} pages={reading.length} onPage={setPage} last={nextStep} /></section>)}
      {stage === 'example' && <section className="lesson-reading"><h2>Örnek çözüm</h2>{lesson ? <><h3>{lesson.workedExample.prompt}</h3><ol>{lesson.workedExample.steps.map((step,i) => <li key={i}>{step}</li>)}</ol><p><strong>Sonuç: </strong>{lesson.workedExample.answer}</p></> : <p>{topic.example || 'Bu konu için örnek çözüm henüz eklenmedi.'}</p>}</section>}
      {stage === 'video' && <section><h2>Eğitim videosu</h2><p>Video için internet ve ebeveyn onayı gerekir. Oynatıcı açıldığında YouTube’a bağlantı kurulur ve platformun veri/gizlilik kuralları geçerlidir. İlerlemen YouTube’a gönderilmez. Videolar indirilmez; metin ve alıştırmalar çevrimdışı çalışır.</p>{!approvedVideos.some(v => v.topicId === topic.id) && <p>Bu konu için incelenip onaylanmış video henüz yok.</p>}{approvedVideos.filter(v => v.topicId === topic.id).map(v => <article key={v.id}><p>{v.role === 'primary' ? 'Ana video' : 'Alternatif video'} · {v.title || 'Başlık doğrulanmadı'} · {v.channel || 'Kanal bilgisi yok'} · {v.publishedAt?.slice(0, 10) || 'Yayın tarihi bilinmiyor'}</p><label><input type="checkbox" checked={videoConsent} onChange={e => setVideoConsent(e.target.checked)} /> Ebeveynimle birlikte dış video bağlantısını açmayı kabul ediyorum</label><button disabled={!videoConsent} onClick={() => setPlayingVideo(v.id)}>Videoyu aç</button></article>)}{playingVideo && videoConsent && <iframe title="Onaylı eğitim videosu" src={videoUrl(playingVideo)} referrerPolicy="no-referrer" allowFullScreen />}</section>}
      {['practice', 'test', 'review'].includes(stage) && <section aria-label="Soru çalışması">
        {!question ? <p>{stage === 'review' ? 'Tekrar bekleyen yanlış yanıt kalmadı.' : !seen.length ? 'Bu konu için henüz soru eklenmedi.' : topic.source.status === 'pending' ? 'Bu oturumdaki örnek sorular tamamlandı. Soru havuzu henüz 50 soruya ulaşmadı.' : 'Bu oturumdaki sorular tamamlandı. Yeni bir çalışma başlatabilir veya yazılı testine geçebilirsin.'}</p> : <>
          <h2>{question.prompt}</h2><p>Zorluk {question.difficulty}/4</p>
          {question.image && <img style={{ maxWidth: "100%", height: "auto" }} src={question.image.src} alt={question.image.alt} />}
          {['choice', 'boolean', 'visual'].includes(question.kind) && question.choices ? <div className="ey-choices">{question.choices.map(choice => <button key={choice} disabled={paused || feedback !== null} aria-pressed={answer === choice} onClick={() => setAnswer(choice)}>{choice}</button>)}</div> : <><p>{question.choices?.join(' · ')}</p><label>Yanıtın <input value={answer} disabled={paused || feedback !== null} onChange={e => setAnswer(e.target.value)} /></label></>}
          {stage !== 'test' && <button onClick={() => setHint(true)} disabled={paused || feedback !== null}>İpucu</button>}{hint && <p>{question.hints.join(' ')}</p>}
          <button className="primary" disabled={paused || !answer.trim() || feedback !== null} onClick={submit}>Yanıtı kontrol et</button>
          {feedback !== null && <><p role="status">{feedback}</p><QuestionSourceNote question={question} /><button disabled={paused} onClick={() => onTransition(() => { const done = [...seen, question.id]; setSeen(done); setQuestion(nextQuestion(topic.id, learning, stage === 'review', done)); setAnswer(''); setFeedback(null); setHint(false); }, true)}>Sonraki soru</button></>}
        </>}
      </section>}
    </LessonShell>;
  }
  return <main className="subpage grade-five">
    <button className="text-button" onClick={() => { if (topic) { setTopic(null); setPlayingVideo(null); } else if (course) setCourse(null); else onBack(); }}>← {topic ? 'Konulara dön' : course ? 'Derslere dön' : 'Akademilere dön'}</button>
    <div className="eyebrow muted">5. SINIF · 2026–2027</div>
    <h1>{course?.name || 'Derslerim'}</h1>
    <p>{guide} ile adım adım öğren. {course?.id === 'course-1' ? 'Değiştir, gözlemle, keşfet; sonra alıştırmalarla pekiştir.' : 'Anlatımı oku, örnekleri incele ve alıştırmalarla pekiştir.'}</p>
    {!topic && <details><summary>İçerik ve program kaynakları</summary><p>Anlatım ve sorular Eylunica tarafından hazırlanmıştır; resmî MEB sorusu değildir. Plan haftaları okuluna göre değişebilir.</p><a href={timetable.url} target="_blank" rel="noreferrer">Resmî haftalık ders çizelgesi</a></details>}
    {!topic && <><label>Çalışma dönemi <select value={term} onChange={e => { setTerm(e.target.value as StudyTerm); setUnitFilter(''); setVisibleCount(24); }}>{Object.entries(termLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><p>İlk dönem kapsamı yıllık plandaki 1–18. haftalardır. İki döneme yayılan konular her iki kapsamda görünür. Haftası belirtilmeyen kayıtlar ayrı tutulur.</p></>}

    {storageError && <p role="alert">{storageError}</p>}
    {course && !topic && <>
      {course.id === 'course-1' && <header className="math-topics-banner"><h2>Matematik keşif haritan</h2><p>Bir konu seç. Çizgileri hareket ettir, sayıları değiştir, şekilleri keşfet.</p></header>}
      {course.programUrl && <p><a href={course.programUrl} target="_blank" rel="noreferrer">MEB öğretim programı</a></p>}
      <section className="written-exam-entry" aria-label="Yazılı hazırlığı"><h2>Yazılıya hazırlan</h2><p>Çalışacağın üniteleri seç, soruları çöz ve test sonunda çözümlerle birlikte sonucunu gör. Yazılı hazırlığı çevrimdışı çalışır.</p><button className="primary" disabled={!courseQuestions.length} onClick={() => onTransition(() => setExamOpen(true))}>Yazılı testleri</button>{!courseQuestions.length && <p>Seçilen dönem kapsamında hazır soru bulunamadı. Dönemi belirtilmeyen çalışmalar veya tüm yıl seçeneğine bakabilirsin.</p>}</section>
      <label>Ünite / tema <select value={unitFilter} onChange={e => { setUnitFilter(e.target.value); setVisibleCount(24); }}><option value="">Tüm üniteler</option>{[...new Set(courseTopics.map(t => t.unit))].map(unit => <option key={unit}>{unit}</option>)}</select></label>
      <label>Konu ara <input value={topicFilter} onChange={e => { setTopicFilter(e.target.value); setVisibleCount(24); }} /></label>
      <p>{filteredTopics.length} konu · {courseQuestions.length} hazır soru</p>
      <div className={`academy-grid ${course.id === 'course-1' ? 'math-topic-grid' : ''}`}>{filteredTopics.slice(0,visibleCount).map(t => <button key={t.id} data-topic-id={t.id} className="academy-tile" onClick={() => onTransition(() => { setTopic(t); setStage('summary'); }, course.id === 'course-1')} >{course.id === 'course-1' && <MathTopicArt topicId={t.id} />}<strong>{t.unit} · {t.title}</strong><span>{lessonByTopic.has(t.id) || t.source.status === 'pending' && t.summary ? 'Anlatım hazır' : 'Anlatım hazırlanıyor'} · {questionsByTopic.get(t.id)?.length || 0} soru · {t.weeks.length ? `Hafta ${t.weeks.join(', ')}` : 'Hafta planı belirtilmedi'} · {t.source.status === 'verified' ? 'MEB konu kaydı' : 'Örnek çalışma'}</span>{questionsByTopic.has(t.id) && <span>Doğru çözdüğün: {questionsByTopic.get(t.id)!.filter(q => latest.get(q.id)?.correct).length}/{questionsByTopic.get(t.id)!.length}</span>}</button>)}</div>
      {filteredTopics.length > visibleCount && <button onClick={() => setVisibleCount(n => n+24)}>Diğer konuları göster</button>}
      {!filteredTopics.length && <p>Bu dönem ve filtre için konu bulunamadı. Haftası belirtilmeyen kayıtları görmek için çalışma dönemi seçimini değiştirebilirsin.</p>}
    </>}
  </main>;
}
