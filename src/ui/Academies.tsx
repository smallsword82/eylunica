import { useEffect, useState } from "react";
import type { UsageDomain } from "../time-engine";
import { chooseStory, readingSkills, type Story } from "../reading-engine";
import {
  generateAttention,
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
  onBack,
  onAgain,
}: {
  onBack: () => void;
  onAgain: () => void;
}) {
  return (
    <section className="lesson-complete">
      <div className="summary-star">✦</div>
      <h2>Birlikte yeni yollar keşfettik!</h2>
      <p>
        İlerlemen bu cihazda saklanır. Yeniden denemek ve ipucu almak öğrenmenin
        bir parçası.
      </p>
      <button className="primary" onClick={onAgain}>
        Yeni görev seç →
      </button>{" "}
      <button className="secondary" onClick={onBack}>
        Akademilere dön
      </button>
    </section>
  );
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
  useEffect(() => {
    onActivity?.(session && !done ? "reading" : "other", !!session && !done);
  }, [onActivity, !!session, done]);
  function start(level: number) {
    onTransition(() => {
      setSession({ story: chooseStory(level, state.seen), index: 0 });
      setDone(false);
    });
  }
  return (
    <main className="subpage academy-page">
      <Header academy="reading" onBack={onBack} character="Zeynep" />
      {done ? (
        <Completion
          onBack={onBack}
          onAgain={() => {
            setSession(null);
            setDone(false);
          }}
        />
      ) : session ? (
        <>
          <LessonProgress index={session.index} total={6} />
          <p className="level-note">{session.story.grade}</p>
          <ActivityPanel
            key={session.story.questions[session.index].id}
            task={session.story.questions[session.index]}
            onListen={() => setSession({ ...session, listened: true })}
            onRecord={(r) => onSave(recordAcademy(progress, "reading", { ...r, hint: r.hint || !!session.listened }))}
            last={session.index === 5}
            onNext={() =>
              onTransition(
                () =>
                  session.index === 5
                    ? setDone(true)
                    : setSession({ ...session, index: session.index + 1 }),
                session.index < 5,
              )
            }
          />
        </>
      ) : (
        <>
          <p className="intro">
            RİTMA ile altı özgün hikâyedeki ipuçlarını keşfet. Önce düşün, sonra
            metindeki kanıtı göster. Önerilen düzey başarılarına göre değişir.
          </p>
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
                <span>
                  DÜZEY {i + 1}
                  {state.level === i + 1 ? " · SANA ÖNERİLEN" : ""}
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
  const [kind, setKind] = useState<AttentionKind | null>(null),
    [tasks, setTasks] = useState<Activity[]>([]),
    [index, setIndex] = useState(0),
    [done, setDone] = useState(false);
  useEffect(() => {
    onActivity?.(kind && !done ? "attention" : "other", !!kind && !done);
  }, [onActivity, kind, done]);
  function start(k: AttentionKind) {
    onTransition(() => {
      setKind(k);
      setTasks([generateAttention(k, progress.academies.attention.level)]);
      setIndex(0);
      setDone(false);
    });
  }
  function next() {
    if (index === 3) {
      setDone(true);
      return;
    }
    setTasks((s) => [
      ...s,
      generateAttention(kind!, progress.academies.attention.level),
    ]);
    setIndex((i) => i + 1);
  }
  return (
    <main className="subpage academy-page">
      <Header academy="attention" onBack={onBack} character="Hilal" />
      <p className="health-note">
        Bu oyunlar öğrenme alıştırmasıdır; tıbbi teşhis veya tedavi aracı
        değildir.
      </p>
      {done ? (
        <Completion
          onBack={onBack}
          onAgain={() => {
            setKind(null);
            setDone(false);
          }}
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
                <span>0{i + 1} · RİTMA İLE KEŞFET</span>
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
  useEffect(() => {
    onActivity?.(
      mission && !done
        ? index === 0
          ? "reading"
          : index === 1
            ? "attention"
            : "math"
        : "other",
      !!mission && !done,
    );
  }, [onActivity, !!mission, done, index]);
  function start() {
    onTransition(() => {
      setMission(
        concert(
          progress.academies.concert.level,
          Math.floor(progress.academies.concert.attempts / 3) % 5,
        ),
      );
      setIndex(0);
      setDone(false);
    });
  }
  function save(r: LearningResult) {
    if (!mission) return;
    let next =
      index === 2
        ? record(progress, mission.math, r.correct, r.hint, r.elapsedMs, false, "concert")
        : recordAcademy(progress, index === 0 ? "reading" : "attention", r);
    next = trackConcert(next, r);
    onSave(next);
  }
  return (
    <main className="subpage academy-page">
      <Header academy="concert" onBack={onBack} character="Sueda" />
      {done ? (
        <Completion
          onBack={onBack}
          onAgain={() => {
            setMission(null);
            setDone(false);
          }}
        />
      ) : mission ? (
        <>
          <LessonProgress index={index} total={3} />
          {index > 0 && (
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
            last={index === 2}
            onNext={() =>
              onTransition(
                () => (index === 2 ? setDone(true) : setIndex((i) => i + 1)),
                index < 2,
              )
            }
          />
        </>
      ) : (
        <section className="concert-invitation">
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
