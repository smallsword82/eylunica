import { useEffect, useRef, useState } from "react";
import {DiscoveryCover,type DiscoveryScene} from "./DiscoveryCover";
import { playCompletionEffect, completionSoundSeconds } from "../audio";
import { narrateFeedback, stopNarration } from "../audio/narration";
import type { UsageDomain } from "../time-engine";
import { readingSkills, type Story } from "../reading-engine";
import { freshAttention, nextStory, readingStep } from "../lesson-engine";
import { placementStep, placementTask } from "../lesson-engine/placement";
import {
  attentionKinds,
  attentionLabels,
  type AttentionKind,
} from "../attention-engine";
import { concert } from "../concert-engine";
import {
  newLearning,
  type Activity,
  type Academy,
  type LearningResult,
} from "../learning-engine";
import { recordAcademy, record, trackConcert, type Progress } from "../storage";
import { ActivityPanel } from "./ActivityPanel";
import { Avatar } from "./Avatar";
import { ContinueCard } from "./ContinueCard";
import { CardReward } from "./CollectibleCards";
import { awardCard } from "../storage/cards";
import { completeAcademyLevel } from "../storage/academy-levels";
const names: Record<Academy, string> = {
  reading: "Okuduğunu Anlama Akademisi",
  attention: "Dikkat ve Odaklanma Akademisi",
  concert: "Büyük Konser Görevi",
};
type Props = {
  progress: Progress;
  onSave: (p: Progress) => void;
  onBack: () => void;
  onTransition?: (action: () => void, startsTask?: boolean) => void;
  onActivity?: (domain: UsageDomain | null, playing?: boolean) => void;
};
function Header({
  academy,
  onBack,
  character,
}: {
  academy: Academy;
  onBack: () => void;
  character: string;
}) {
  return (
    <>
      <button className="text-button" onClick={onBack}>
        ← Akademilere dön
      </button>
      <div className="academy-heading">
        <div>
          <div className="eyebrow muted">HER ZİHİN KENDİ RİTMİNDE</div>
          <h1>{names[academy]}</h1>
          <p>Süre yok. İpucu isteyebilir, yeniden deneyebilirsin.</p>
        </div>
        <Avatar name={character} />
      </div>
    </>
  );
}
function LevelCards({ unlocked, max, onSelect, reading = false }: { unlocked: number; max: number; onSelect: (level: number) => void; reading?: boolean }) {
  return <section className="academy-levels" aria-label="Akademi düzeyleri">
    <h2>Düzeyini seç</h2><p>İlk düzeyden başla. Tamamladıkça yeni düzeylerin kilidi açılır.</p>
    <div className={`academy-level-grid ${reading ? 'level-cards' : ''}`}>{Array.from({ length: max }, (_, i) => {
      const level = i + 1, locked = level > unlocked;
      return <button key={level} className={`academy-level-card ${reading ? 'academy-choice' : ''} ${locked ? "is-locked" : ""}`} disabled={locked} onClick={() => onSelect(level)}>
        <DiscoveryCover scene={reading ? (['shortReading','paragraphReading','deepReading'] as DiscoveryScene[])[i] : (['attention','pattern','instructions'] as DiscoveryScene[])[i]}/>
        <span>DÜZEY {level}{level === unlocked ? ' · SANA ÖNERİLEN' : ''}</span>
        <strong>{reading ? ['Kısa metinler','Paragraf keşfi','Derin okuma'][i] : `Düzey ${level}`}</strong>
        <small>{locked ? "Önceki düzeyi tamamla" : level < unlocked ? "Tamamlandı · Tekrar oyna" : "Başla →"}</small>
      </button>;
    })}</div>
  </section>;
}
function LessonProgress({ index, total }: { index: number; total: number }) {
  return (
    <div
      className="lesson-progress"
      role="progressbar"
      aria-label="Görev ilerlemesi"
      aria-valuenow={index + 1}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      Keşif {index + 1} / {total}
    </div>
  );
}
function Completion({
  progress,
  onBack,
  onAgain,
  nextTitle,
}: {
  progress: Progress;
  onBack: () => void;
  onAgain: () => void;
  nextTitle: string;
}) {
  const celebrated = useRef(false);
  useEffect(() => {
    if (celebrated.current) return;
    celebrated.current = true;
    stopNarration();
    void playCompletionEffect();
    narrateFeedback("complete", completionSoundSeconds * 1000 + 100);
  }, []);
  return (
    <section className="lesson-complete">
      <div className="summary-star">✦</div>
      <h2>Birlikte yeni yollar keşfettik!</h2>
      <CardReward progress={progress} />
      <ContinueCard focusOnMount={!progress.cards?.last || !!progress.cards.last.collectionComplete} title={nextTitle} onContinue={onAgain} />
      <p>
        İlerlemen bu cihazda saklanır. Yeniden denemek ve ipucu almak öğrenmenin
        bir parçası.
      </p>
      <button className="secondary" onClick={onBack}>
        Akademilere dön
      </button>
    </section>
  );
}
function AcademyPlacement({ academy, progress, onSave, onBack, onFinished, onActivity, onTransition = action => action() }: Props & { academy: "reading" | "attention"; onFinished: () => void }) {
  const [index, setIndex] = useState(0);
  const [level, setLevel] = useState(progress.academies[academy].level);
  const [task, setTask] = useState(() => placementTask(academy, 0, level, progress.academies[academy]));
  const [done, setDone] = useState(false);
  const streak = useRef(0);
  const nextLevel = useRef(level);
  useEffect(() => { if (done) { stopNarration(); void playCompletionEffect(); narrateFeedback("complete", completionSoundSeconds * 1000 + 100); } }, [done]);
  useEffect(() => { onActivity?.(done ? "other" : academy, !done && !!task); }, [onActivity, academy, done, !!task]);
  function recordPlacement(result: LearningResult) {
    const step = placementStep(level, streak.current, result);
    streak.current = step.streak;
    nextLevel.current = step.level;
    const updated = recordAcademy(progress, academy, result);
    updated.academies[academy].level = step.level;
    updated.academies[academy].streak = 0;
    updated.academies[academy].recent = [];
    onSave(updated);
  }
  function next() {
    onTransition(() => {
      if (index === 5) {
        const updated = awardCard(structuredClone(progress), `placement:${academy}`, `${names[academy]} başlangıç keşfi`);
        updated.academies[academy].placementDone = true;
        onSave(updated);
        setDone(true);
        return;
      }
      const nextTask = placementTask(academy, index + 1, nextLevel.current, progress.academies[academy]);
      setIndex(index + 1);
      setLevel(nextLevel.current);
      setTask(nextTask);
    }, index < 5);
  }
  return <main className="subpage academy-page">
    <Header academy={academy} onBack={onBack} character={academy === "reading" ? "Zeynep" : "Hilal"} />
    {done ? <section className="lesson-complete"><h2>Seviye tespitin tamamlandı!</h2><CardReward progress={progress} /><p>Başlangıç düzeyin: {progress.academies[academy].level} / 3. Yanıtlarına göre ilerlemeye devam edeceğiz.</p><ContinueCard focusOnMount={!progress.cards?.last || !!progress.cards.last.collectionComplete} title={`Sana uygun ${academy === "reading" ? "okuma" : "dikkat"} dersi`} onContinue={onFinished} /></section>
      : task ? <><section className="section-progress" aria-label="Seviye tespiti"><h2>Önce seviyeni keşfedelim</h2><p>6 kısa keşif · Şu anki düzey: {level} / 3. Süre sınırı yok; ipucu alabilirsin. Bu bir tanı veya sınav değildir.</p></section><LessonProgress index={index} total={6} /><ActivityPanel key={task.id} task={task} onRecord={recordPlacement} last={index === 5} onNext={next} /></>
      : <section><h2>Yeni değerlendirme sorusu kalmadı</h2><p>Mevcut düzeyin ve geçmişin korunarak devam edebilirsin.</p><button className="primary" onClick={() => { const updated = structuredClone(progress); updated.academies[academy].placementDone = true; onSave(updated); onFinished(); }}>Derslere devam et →</button></section>}
  </main>;
}
export function ReadingAcademy({
  progress,
  onSave,
  onBack,
  onTransition = (action) => action(),
  onActivity,
}: Props) {
  const [session, setSession] = useState<{
      story: Story;
      index: number;
      listened?: boolean;
    } | null>(null),
    [done, setDone] = useState(false);
  const state = progress.academies.reading;
  const [placing, setPlacing] = useState(false);
  const [levelMenu, setLevelMenu] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const nextLevel = state.placementDone ? state.level : readingStep(state.seen);
  const [libraryDone, setLibraryDone] = useState(false);
  useEffect(() => {
    if (!placing) onActivity?.(session && !done ? "reading" : "other", !!session && !done);
  }, [onActivity, !!session, done, placing]);
  function start(level: number) {
    if (level > (progress.academyUnlocked?.reading ?? 1)) return;
    setSelectedLevel(level);
    onTransition(() => {
      setLevelMenu(false);
      const story = nextStory(level, state.seen, true);
      setLibraryDone(!story);
      if (!story) { setSession(null); return; }
      setSession({ story, index: 0 });
      setDone(false);
    });
  }
  if (placing) return <AcademyPlacement academy="reading" progress={progress} onSave={onSave} onBack={onBack} onActivity={onActivity} onTransition={onTransition} onFinished={() => { setPlacing(false); start(state.level); }} />;
  return (
    <main className="subpage academy-page">
      <Header academy="reading" onBack={onBack} character="Zeynep" />
      {levelMenu ? <LevelCards reading unlocked={progress.academyUnlocked?.reading ?? 1} max={3} onSelect={start} /> : libraryDone ? <section className="lesson-complete"><h2>Bu düzeydeki hikâyeleri keşfettin!</h2><p>Yanıtladığın sorular korunuyor. Açılmış başka bir düzey seçebilir veya diğer akademileri keşfedebilirsin.</p><button className="primary" onClick={() => setLevelMenu(true)}>Okuma düzeylerine dön →</button><button className="secondary" onClick={onBack}>Diğer akademilere geç →</button></section> : done ? (
        <Completion
          progress={progress}
          onBack={onBack}
          nextTitle="Okuma düzeylerini keşfet"
          onAgain={() => setLevelMenu(true)}
        />
      ) : session ? (
        <>
          <LessonProgress index={session.index} total={session.story.questions.length} />
          <p className="level-note">{session.story.grade}</p>
          <ActivityPanel
            key={session.story.questions[session.index].id}
            task={session.story.questions[session.index]}
            onListen={() => setSession({ ...session, listened: true })}
            onRecord={(r) => onSave(recordAcademy(progress, "reading", { ...r, hint: r.hint || !!session.listened }))}
            last={session.index === session.story.questions.length - 1}
            onNext={() =>
              onTransition(
                () =>
                  session.index === session.story.questions.length - 1
                    ? (onSave(awardCard(completeAcademyLevel(progress, 'reading', selectedLevel), `reading:${session.story.id}`, session.story.title)), setDone(true))
                    : setSession({ ...session, index: session.index + 1 }),
                session.index < session.story.questions.length - 1,
              )
            }
          />
        </>
      ) : (
        <>
          <p className="intro">
            eylunica ile altı özgün hikâyedeki ipuçlarını keşfet. Önce düşün, sonra
            metindeki kanıtı göster. Yeni hikâyeler başlangıç düzeyine göre önerilir.
          </p>
          <button className="primary" onClick={() => start(nextLevel)}>Sıradaki yeni hikâye · Düzey {nextLevel} →</button>
          <p className="small">Başlangıç düzeyin ve yeni yanıtların öneriyi belirler. Yanıtladığın sorular yeniden açılmaz; yarım bırakırsan sıradaki yeni sorudan devam edersin.</p>
          <div className="level-cards">
            {[
              "Kısa metinler · 7–9 yaş",
              "Paragraf keşfi · 4. sınıf",
              "Derin okuma · 5. sınıf ve üzeri",
            ].map((s, i) => (
              <button
                className="academy-choice"
                key={s}
                onClick={() => start(i + 1)}
              >
                <DiscoveryCover scene={(['shortReading','paragraphReading','deepReading'] as DiscoveryScene[])[i]}/>
                <span>
                  DÜZEY {i + 1}
                  {nextLevel === i + 1 ? " · SANA ÖNERİLEN" : ""}
                </span>
                <h2>{s}</h2>
                <p>
                  {i === 0
                    ? "Kısa cümleler ve açık ipuçları"
                    : i === 1
                      ? "Nedenleri bul, olayları sırala"
                      : "Kanıtları birleştir, çıkarım yap"}
                </p>
                <strong>Hikâyeyi aç →</strong>
              </button>
            ))}
          </div>
          <p className="small">
            Düzeyler destek önerisidir; yaş veya sınıf için başarı ölçütü
            değildir. Daha kısa bir metin seçmek her zaman serbest.
          </p>
          <div className="skill-tags">
            {readingSkills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
export function AttentionAcademy({
  progress,
  onSave,
  onBack,
  onTransition = (action) => action(),
  onActivity,
}: Props) {
  const [placing, setPlacing] = useState(false);
  const [levelMenu, setLevelMenu] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const rewardKey = useRef("");
  const [kind, setKind] = useState<AttentionKind | null>(null),
    [tasks, setTasks] = useState<Activity[]>([]),
    [index, setIndex] = useState(0),
    [done, setDone] = useState(false);
  useEffect(() => {
    if (!placing) onActivity?.(kind && !done ? "attention" : "other", !!kind && !done);
  }, [onActivity, kind, done, placing]);
  function start(k: AttentionKind) {
    onTransition(() => {
      setLevelMenu(false);
      setKind(k);
      rewardKey.current = crypto.randomUUID();
      const state = progress.academies.attention;
      setTasks([freshAttention(k, selectedLevel, state.seen, state.history.map(result => result.id))]);
      setIndex(0);
      setDone(false);
    });
  }
  function next() {
    if (index === 3) {
      onSave(awardCard(completeAcademyLevel(progress, 'attention', selectedLevel), `attention:${rewardKey.current}`, names.attention));
      setDone(true);
      return;
    }
    setTasks((s) => [
      ...s,
      freshAttention(kind!, selectedLevel, progress.academies.attention.seen, [...progress.academies.attention.history.map(result => result.id), ...s.map(task => task.id)]),
    ]);
    setIndex((i) => i + 1);
  }
  if (placing) return <AcademyPlacement academy="attention" progress={progress} onSave={onSave} onBack={onBack} onActivity={onActivity} onTransition={onTransition} onFinished={() => { setPlacing(false); start(attentionKinds[0]); }} />;
  return (
    <main className="subpage academy-page">
      <Header academy="attention" onBack={onBack} character="Hilal" />
      <p className="health-note">
        Bu oyunlar öğrenme alıştırmasıdır; tıbbi teşhis veya tedavi aracı
        değildir.
      </p>
      {levelMenu ? <LevelCards unlocked={progress.academyUnlocked?.attention ?? 1} max={3} onSelect={level => { setSelectedLevel(level); setLevelMenu(false); }} /> : done ? (
        <Completion
          progress={progress}
          onBack={onBack}
          nextTitle={attentionLabels[attentionKinds[(attentionKinds.indexOf(kind!) + 1) % attentionKinds.length]]}
          onAgain={() => start(attentionKinds[(attentionKinds.indexOf(kind!) + 1) % attentionKinds.length])}
        />
      ) : kind ? (
        <>
          <LessonProgress index={index} total={4} />
          <ActivityPanel
            key={tasks[index].id}
            task={tasks[index]}
            onRecord={(r) => onSave(recordAcademy(progress, "attention", r))}
            last={index === 3}
            onNext={() => onTransition(next, index < 3)}
          />
        </>
      ) : (
        <>
          <p className="intro">
            Sakin bir bakışla ayrıntıları yakala. Düzey{" "}
            {progress.academies.attention.level} ile başlıyoruz; bağımsız
            çözdükçe görevler adım adım gelişir.
          </p>
          <div className="attention-menu">
            {attentionKinds.map((k, i) => (
              <button
                className="academy-choice"
                key={k}
                onClick={() => start(k)}
              >
                <DiscoveryCover scene={({odd:'attention',pattern:'pattern',match:'memory',memory:'memory',instructions:'instructions',detail:'deepReading'} as Record<AttentionKind,DiscoveryScene>)[k]}/>
                <span>0{i + 1} · eylunica İLE KEŞFET</span>
                <h2>{attentionLabels[k]}</h2>
                <p>
                  {
                    [
                      "Kartları dikkatle karşılaştır.",
                      "Tekrar eden düzenin devamını bul.",
                      "Örnekteki şekli ayrıntılarıyla eşleştir.",
                      "İstediğin kadar bak, hazır olunca kapat.",
                      "İşaretleri verilen sırayla seç.",
                      "Kısa metindeki önemli ayrıntıyı yakala.",
                    ][i]
                  }
                </p>
                <strong>Başla →</strong>
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
export function ConcertAcademy({
  progress,
  onSave,
  onBack,
  onTransition = (action) => action(),
  onActivity,
}: Props) {
  const [mission, setMission] = useState<ReturnType<typeof concert> | null>(
      null,
    ),
    [index, setIndex] = useState(0),
    [done, setDone] = useState(false);
  const [allDone, setAllDone] = useState(false);
  useEffect(() => {
    onActivity?.(
      mission && !done
        ? mission.tasks[index].id.endsWith("-read")
          ? "reading"
          : mission.tasks[index].id.endsWith("-focus")
            ? "attention"
            : "math"
        : "other",
      !!mission && !done,
    );
  }, [onActivity, !!mission, done, index]);
  function start() {
    onTransition(() => {
      const missions = [1, 2, 3].flatMap(level => Array.from({ length: 5 }, (_, round) => concert(level, round)));
      const unseen = missions.find(candidate => candidate.tasks.some(task => !progress.academies.concert.seen[task.id]));
      if (!unseen) { setAllDone(true); return; }
      setMission({ ...unseen, tasks: unseen.tasks.filter(task => !progress.academies.concert.seen[task.id]) });
      setIndex(0);
      setDone(false);
    });
  }
  function save(r: LearningResult) {
    if (!mission) return;
    let next =
      r.id.endsWith("-math")
        ? record(progress, mission.math, r.correct, r.hint, r.elapsedMs, false, "concert")
        : recordAcademy(progress, r.id.endsWith("-read") ? "reading" : "attention", r);
    next = trackConcert(next, r);
    onSave(next);
  }
  return (
    <main className="subpage academy-page">
      <Header academy="concert" onBack={onBack} character="Sueda" />
      {allDone ? <section className="lesson-complete"><h2>Konser hazırlıklarının hepsini keşfettin!</h2><button className="primary" onClick={onBack}>Diğer akademilere geç →</button></section> : done ? (
        <Completion
          progress={progress}
          onBack={onBack}
          nextTitle="Yeni konser hazırlığı"
          onAgain={start}
        />
      ) : mission ? (
        <>
          <LessonProgress index={index} total={mission.tasks.length} />
          {!mission.tasks[index].sentences && (
            <div className="story-text concert-context">
              <h2>Konser notu</h2>
              {mission.sentences.map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>
          )}
          <ActivityPanel
            key={mission.tasks[index].id}
            task={mission.tasks[index]}
            onRecord={save}
            last={index === mission.tasks.length - 1}
            onNext={() =>
              onTransition(
                () => (index === mission.tasks.length - 1 ? (onSave(awardCard(progress, `concert:${mission.tasks[0].id.replace(/-(read|focus|math)$/, "")}`, names.concert)), setDone(true)) : setIndex((i) => i + 1)),
                index < mission.tasks.length - 1,
              )
            }
          />
        </>
      ) : (
        <section className="concert-invitation"><DiscoveryCover scene="mixed"/>
          <div className="summary-star">✦</div>
          <h2>Bir hikâye, üç keşif.</h2>
          <p>
            Konser notunu oku ve kanıtı bul. Sahne işaretlerini sırayla seç.
            Sonra metindeki sayılarla zihinden hesap yap.
          </p>
          <p>
            Üç akademinin ilerlemesi ayrı kaydedilir; yıldızlar aynı sahneyi
            aydınlatır. Her adım en fazla bir yıldız kazandırır.
          </p>
          <button className="primary" onClick={start}>
            Konser hazırlığına başla →
          </button>
        </section>
      )}
    </main>
  );
}
export function AcademyProgress({ progress }: { progress: Progress }) {
  return (
    <section className="academy-progress-report">
      <h2>Akademilerdeki keşifler</h2>
      <p>
        Bağımsız çözüm: ilk denemede doğru, ipucu kullanılmadan verilen yanıt.
        Sonuçlar tanı veya standart başarı puanı değildir.
      </p>
      <div className="level-cards">
        {(["reading", "attention", "concert"] as Academy[]).map((a) => {
          const s = progress.academies[a] || newLearning();
          return (
            <article className="academy-report" key={a}>
              <h3>{names[a]}</h3>
              <p>
                Düzey {s.level} · {s.correct} / {s.attempts} ilk deneme doğru
              </p>
              <p>
                {s.independent} bağımsız çözüm · {s.hints} ipuçlu deneme
              </p>
              <details>
                <summary>Beceri ayrıntıları</summary>
                {Object.entries(s.bySkill).length ? (
                  Object.entries(s.bySkill).map(([name, v]) => (
                    <p key={name}>
                      {name}: {v.correct}/{v.attempts} doğru, {v.independent}{" "}
                      bağımsız, {v.hints} ipuçlu
                    </p>
                  ))
                ) : (
                  <p>Henüz alıştırma yapılmadı.</p>
                )}
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
