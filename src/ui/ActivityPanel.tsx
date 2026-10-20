import { useEffect } from "react";
import { hasNarration, narrateFeedback, stopNarration } from "../audio/narration";
import { narrationTexts, storyNarrationText } from "../audio/narration-texts";
import { ListenButton } from "./ListenButton";
import { playAnswerEffect, answerSoundSeconds, stopActivitySound } from "../audio";
import { useRef, useState } from "react";
import type { Activity, LearningResult } from "../learning-engine";
import { checkReading } from "../reading-engine";
import { checkSequence } from "../attention-engine";
export function ActivityPanel({
  task,
  onRecord,
  onNext,
  last = false,
  onListen,
}: {
  task: Activity;
  onRecord: (result: LearningResult) => void;
  onNext: () => void;
  last?: boolean;
  onListen?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null),
    [evidence, setEvidence] = useState<number | null>(null),
    [sequence, setSequence] = useState<number[]>([]),
    [hint, setHint] = useState(false),
    [solved, setSolved] = useState(false),
    [feedback, setFeedback] = useState(""),
    [hidden, setHidden] = useState(false);
  const attempted = useRef(false),
    usedHint = useRef(false),
    start = useRef(performance.now()),
    lock = useRef(false);
  useEffect(() => {
    stopActivitySound();
    return () => { stopNarration(); stopActivitySound(); };
  }, [task.id]);
  function check() {
    if (solved || lock.current) return;
    lock.current = true;
    const correct = task.sequence
      ? checkSequence(task, sequence)
      : task.evidence
        ? selected !== null &&
          evidence !== null &&
          checkReading(task, selected, evidence)
        : selected === task.answer;
    stopNarration();
    void playAnswerEffect();
    narrateFeedback(correct ? (last ? "complete" : "correct") : "retry", answerSoundSeconds * 1000 + 100);
    if (!correct) {
      usedHint.current = true;
      setHint(true);
    }
    if (!attempted.current) {
      onRecord({
        id: task.id,
        skill: task.skill,
        correct,
        hint: usedHint.current,
        elapsedMs: performance.now() - start.current,
      });
      attempted.current = true;
    }
    setSolved(correct);
    setFeedback(
      correct
        ? "Harika! Yanıtını dikkatle düşündün."
        : "Henüz olmadı. Kanıta ve açıklamaya birlikte bakalım; yeniden deneyebilirsin.",
    );
    lock.current = false;
  }
  const canCheck = task.sequence
    ? sequence.length === task.sequence.length
    : selected !== null && (!task.evidence || evidence !== null);
  const storyText = task.sentences ? storyNarrationText(task.title, task.sentences) : "";
  const canListenToStory = !!task.evidence && hasNarration(storyText);
  return (
    <section className="activity-panel" aria-label={task.title}>
      <div className="eyebrow muted">{task.skill}</div>
      <h2>{task.title}</h2>
      <ListenButton text={canListenToStory ? narrationTexts.reading : task.memory ? narrationTexts.memory : task.sequence ? narrationTexts.sequence : narrationTexts.attention} />
      {canListenToStory && <>
        <ListenButton text={storyText} label="Hikâyeyi dinle" onRequest={() => { usedHint.current = true; onListen?.(); }} />
        <p className="small">Hikâyeyi dinlemek bu okuma oturumunda destek olarak kaydedilir. Yıldızların azalmaz.</p>
      </>}
      {task.sentences && (
        <div className="story-text">
          <h3>
            {task.evidence
              ? "Önce metni oku; sonra yanıtını destekleyen bir cümle seç."
              : "Ayrıntıları incele"}
          </h3>
          {task.sentences.map((sentence, i) =>
            task.evidence ? (
              <button
                key={i}
                className={`evidence-sentence ${hint && task.evidence?.includes(i) ? "evidence-hint" : ""}`}
                aria-pressed={evidence === i}
                aria-label={`Kanıt cümlesi ${i + 1}: ${sentence}`}
                onClick={() => !solved && setEvidence(i)}
              >
                <span className="sentence-number" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  {evidence === i ? <mark>{sentence}</mark> : sentence}
                </span>
              </button>
            ) : (
              <p key={i}>{sentence}</p>
            ),
          )}
        </div>
      )}
      <h3 className="activity-prompt">{task.prompt}</h3>
      {task.visual && (
        <div className="shape-strip" aria-label="Örnek şekiller" role="group">
          {task.visual.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      )}
      {task.memory && (
        <div className="memory-board">
          {!hidden ? (
            <>
              <div className="shape-strip">
                {task.memory.map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <button className="primary" onClick={() => setHidden(true)}>
                Hazırım, kartları kapat
              </button>
            </>
          ) : (
            <>
              <p>Kartlar kapalı. Hatırladığın sırayı seç.</p>
              <button
                className="secondary"
                onClick={() => {
                  usedHint.current = true;
                  setHidden(false);
                  setSelected(null);
                }}
              >
                Kartlara yeniden bak (ipucu)
              </button>
            </>
          )}
        </div>
      )}
      {(!task.memory || hidden) && !solved && (
        <>
          {task.sequence && (
            <p className="sequence-picked" role="status">
              Seçtiğin sıra:{" "}
              {sequence.length
                ? sequence.map((i) => task.choices[i]).join(" → ")
                : "Henüz seçmedin."}
            </p>
          )}
          <div
            className={`activity-choices ${task.skill === "Farklı olanı bul" ? "shape-grid" : ""}`}
            role="group"
            aria-label="Yanıt seçenekleri"
          >
            {task.choices.map((choice, i) => (
              <button
                key={i}
                aria-label={
                  task.skill === "Farklı olanı bul"
                    ? `Kart ${i + 1}: ${choice}`
                    : choice
                }
                aria-pressed={task.sequence ? undefined : selected === i}
                disabled={
                  !!task.sequence && sequence.length >= task.sequence.length
                }
                onClick={() =>
                  task.sequence ? setSequence((s) => [...s, i]) : setSelected(i)
                }
              >
                {choice}
              </button>
            ))}
          </div>
          {task.sequence && (
            <button className="text-button" onClick={() => setSequence([])}>
              Sırayı yeniden seç
            </button>
          )}
          <button className="primary" disabled={!canCheck} onClick={check}>
            Yanıtımı kontrol et →
          </button>
        </>
      )}
      <div className={`feedback ${solved ? "success" : ""}`} role="status">
        {feedback}
      </div>
      {!solved && (
        <button
          className="hint-button"
          aria-expanded={hint}
          onClick={() => {
            usedHint.current = true;
            setHint((v) => !v);
          }}
        >
          ✧ Bir ipucu al
        </button>
      )}
      {hint && (
        <aside className="strategy">
          <h3>Birlikte düşünelim</h3>
          <p>{task.hint}</p>
          {feedback && <p>{task.explanation}</p>}
        </aside>
      )}
      {solved && (
        <>
          <p className="explanation">{task.explanation}</p>
          <button className="primary" onClick={onNext}>
            {last ? "Görevi tamamla" : "Sonraki keşif"} →
          </button>
        </>
      )}
    </section>
  );
}
