import { useEffect, useRef, useState } from "react";
import { OPERATIONS, SESSION, eligibility, getLane, makeDeck, observation, operationNames, specs, type Comparison, type LaneSpec, type Observation } from "../arena-engine";
import { useResponseClock } from "../arena/useResponseClock";
import { completeArena, recordArena, type Progress } from "../storage";
import { strategy, symbols, type Operation, type Question } from "../math-engine";
import { playAnswerEffect, answerSoundSeconds, playCompletionEffect, completionSoundSeconds, stopActivitySound } from "../audio";
import { narrateFeedback, stopNarration } from "../audio/narration";
import type { UsageDomain } from "../time-engine";
import { ContinueCard } from "./ContinueCard";

type Session = { id: string; spec: LaneSpec; questions: Question[]; index: number; race: boolean };
export function Arena({ progress, onSave, onBack, onPractice, onTransition, onActivity, paused }: {
  progress: Progress; onSave: (p: Progress) => void; onBack: () => void;
  onPractice: (op: Operation) => void; onTransition: (action: () => void, startsTask?: boolean) => void;
  onActivity: (domain: UsageDomain | null, playing?: boolean) => void; paused: boolean;
}) {
  const [operation, setOperation] = useState<Operation>("add");
  const [level, setLevel] = useState(1);
  const [session, setSession] = useState<Session | null>(null);
  const [solved, setSolved] = useState(false), [hint, setHint] = useState(false), [feedback, setFeedback] = useState("");
  const [summary, setSummary] = useState<{ correct: number; race: boolean; bonus: string | null; comparison: Comparison | null; previousBestMs: number | null } | null>(null);
  const answers = useRef<Observation[]>([]), attempted = useRef(false), usedHint = useRef(false), lock = useRef(false), finished = useRef(false), latest = useRef(progress);
  latest.current = progress;
  const clock = useResponseClock(session ? `${session.id}:${session.index}` : "arena-menu", paused || !session || solved);
  useEffect(() => {
    onActivity(session ? "math" : "other", !!session);
  }, [!!session, onActivity]);
  useEffect(() => () => { onActivity("other", false); stopNarration(); stopActivitySound(); }, [onActivity]);
  const save = (p: Progress) => { latest.current = p; onSave(p); };
  function start(spec: LaneSpec) {
    onTransition(() => {
      stopActivitySound();
      const race = eligibility(getLane(latest.current.arena, spec)).open;
      answers.current = []; attempted.current = false; usedHint.current = false; lock.current = false; finished.current = false;
      setSession({ id: crypto.randomUUID(), spec, questions: makeDeck(spec), index: 0, race });
      setSummary(null); setSolved(false); setHint(false); setFeedback("");
    });
  }
  function answer(value: number) {
    if (!session || solved || lock.current) return;
    lock.current = true;
    const q = session.questions[session.index], correct = value === q.answer;
    if (!attempted.current) {
      const time = clock.read();
      const o = observation(q, correct, usedHint.current, time.elapsedMs, time.timingValid, session.race ? "arena" : "practice", `${session.id}:${session.index}`);
      answers.current.push(o);
      save(recordArena(latest.current, session.spec, o));
      attempted.current = true;
    }
    stopNarration(); void playAnswerEffect(); narrateFeedback(correct ? "correct" : "retry", answerSoundSeconds * 1000 + 100);
    setSolved(correct);
    setFeedback(correct ? "Yanıtını düşündün, bir adım daha attın." : "Henüz olmadı. İpucuna bakıp yeniden deneyebilirsin. Acelemiz yok.");
    if (!correct) { usedHint.current = true; setHint(true); lock.current = false; }
  }
  function next() {
    if (!session || !solved) return;
    const last = session.index === SESSION - 1;
    onTransition(() => {
      if (last) {
        if (finished.current) return;
        finished.current = true;
        const previousBestMs = getLane(latest.current.arena, session.spec).bestMs;
        const result = session.race ? completeArena(latest.current, session.spec, session.id, answers.current) : null;
        if (result) save(result.progress);
        setSummary({ correct: answers.current.filter(a => a.correct).length, race: session.race, bonus: result?.bonus ?? null, comparison: result?.comparison ?? null, previousBestMs });
        setSession(null);
        stopNarration(); void playCompletionEffect(); narrateFeedback("complete", completionSoundSeconds * 1000 + 100);
      } else {
        stopNarration(); stopActivitySound(); setSession({ ...session, index: session.index + 1 });
        setSolved(false); setHint(false); setFeedback("");
        attempted.current = false; usedHint.current = false; lock.current = false;
      }
    }, !last);
  }
  return <main className="subpage arena-page">
    <button className="text-button" onClick={() => onTransition(onBack, false)}>← Arenadan ayrıl</button>
    <div className="eyebrow muted">KENDİ RİTMİNDE, KENDİ GELİŞİMİN</div>
    <h1>RİTMA Hız Arenası</h1>
    <p>Katılmak tamamen isteğe bağlı. Geri sayım ve süre sınırı yok. Önce doğru düşün; kendini yalnızca önceki sonuçlarınla karşılaştır.</p>
    {session ? <section className="arena-task" aria-label="Arena sorusu">
      <p>{operationNames[session.spec.operation]} · {session.spec.skill} · Düzey {session.spec.level}</p>
      <p>{session.race ? "Kendine karşı tur" : "Doğruluk hazırlığı"} · Soru {session.index + 1} / {SESSION}</p>
      <h2 className="arena-equation">{session.questions[session.index].a} {symbols[session.spec.operation]} {session.questions[session.index].b} = ?</h2>
      <div className="answer-options" role="group" aria-label="Arena yanıtları">
        {session.questions[session.index].options.map(n => <button key={n} disabled={solved} onClick={() => answer(n)}>{n}</button>)}
      </div>
      <p role="status">{feedback}</p>
      {!solved && <button className="hint-button" aria-expanded={hint} onClick={() => { usedHint.current = true; setHint(!hint); }}>Bir ipucu al</button>}
      {hint && <aside className="strategy"><h3>{strategy(session.questions[session.index]).title}</h3><ol>{strategy(session.questions[session.index]).steps.map((s, i) => <li key={i}>{s}</li>)}</ol><p>İpucuyla çözmek öğrenmenin bir parçası. Bu soru hız rekoruna katılmaz.</p></aside>}
      {solved && <button className="primary" onClick={next}>{session.index === SESSION - 1 ? "Turu bitir" : "Sonraki arena sorusu"}</button>}
      <p className="small">İstediğinde mola verebilirsin. Kesintili sorular hız rekoruna katılmaz. Yıldızların ve kazanılmış ödüllerin korunur.</p>
    </section> : summary ? <section className="arena-summary" aria-label="Arena tur sonucu">
      <h2>Bu tur tamamlandı.</h2><p>İlk yanıtlarda {summary.correct} / {SESSION} doğru. Yeniden denemeler cezalandırılmaz.</p>
      <ContinueCard title="Matematik maceran" onContinue={() => onPractice(operation)} />
      {!summary.race ? <p>Bu bir doğruluk çalışmasıydı. Hız hedefi yok; öğrenmek için normal matematiğe de dönebilirsin.</p> : summary.comparison ? <>
        {summary.comparison.record ? <p>Yeni kişisel rekor! Aynı beceri ve düzeyde, 20 bağımsız doğru yanıtta ortalaman önceki rekorundan en az %5 daha iyi.</p> : summary.comparison.qualified ? <p>20 bağımsız doğru yanıt tamamlandı. Sonuçların yalnızca kendi önceki sonuçlarınla karşılaştırılır. Daha yavaş olmak hiçbir ödülünü azaltmaz.</p> : <p>Bu grup rekor koşullarını karşılamadı. Bu bir ceza değil; öğrenmeye ve ipucu almaya devam edebilirsin.</p>}
        {summary.comparison.qualified && summary.comparison.meanMs !== null && <p>Bu 20 yanıtta ortalama etkin süren: {(summary.comparison.meanMs / 1000).toFixed(1)} saniye.{summary.previousBestMs !== null ? ` Önceki kişisel ölçümün: ${(summary.previousBestMs / 1000).toFixed(1)} saniye.` : " Bu, sonraki karşılaştırmalar için ilk ölçümün."}</p>}
        {summary.bonus && <p className="arena-award">Konser koleksiyonuna yeni bir ödül ve 3 yıldız eklendi.</p>}
      </> : <p>Karşılaştırmalar tek soruyla yapılmaz; tamamlanan turlar birikir. Bugün devam etmek zorunda değilsin.</p>}
      <p>Mola vermek iyi bir seçenek. Yeni tur veya başka bir bölüm her zaman isteğe bağlı.</p>
      <button className="secondary" onClick={() => setSummary(null)}>Arena menüsüne dön</button>{" "}<button className="primary" onClick={() => onTransition(onBack, false)}>Öğrenme haritasına dön</button>
    </section> : <>
      <div className="arena-selectors"><label>İşlem <select value={operation} onChange={e => setOperation(e.target.value as Operation)}>{OPERATIONS.map(op => <option key={op} value={op}>{operationNames[op]}</option>)}</select></label>
        <label>Zorluk <select value={level} onChange={e => setLevel(Number(e.target.value))}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Düzey {n}</option>)}</select></label></div>
      <div className="arena-lanes">{specs(operation, level).map(spec => {
        const gate = eligibility(getLane(progress.arena, spec));
        return <section className="arena-lane" key={spec.skill}><h2>{spec.skill}</h2>
          <p>{gate.open ? "İsteğe bağlı karşılaştırma turu açık." : "Önce doğruluğunu pekiştir. Hız karşılaştırması henüz kapalı."}</p>
          <p>Son {gate.total} ilk yanıtta {gate.independent} ipucusuz doğru. Açılma koşulu: aynı beceri ve düzeyde 20 yanıtın en az 18’i bağımsız doğru; en az 8 farklı işlem.</p>
          <button className="primary" onClick={() => start(spec)}>{gate.open ? "İsteğe bağlı tura katıl" : "Doğruluk hazırlığı yap"}</button>
        </section>;
      })}</div>
      <p>Her tur 10 sorudur. Rekor için iki tamamlanmış turun 20 yanıtı da ilk denemede doğru, ipucusuz ve kesintisiz olmalı. Her rekor en az %5 iyileşme gerektirir; tek hızlı soru yeterli değildir.</p>
      <p>Ek rekor ödülü cihazın yerel takvim gününde en fazla bir kez verilir. Koleksiyon toplam üç ödül ve dokuz ek yıldızla sınırlıdır. Daha uzun oynamak için ödül verilmez.</p>
      <button className="secondary" onClick={() => onPractice(operation)}>Normal matematiğe devam et</button>
    </>}
    <section className="arena-collection" aria-label="Arena konser koleksiyonu"><h2>Konser koleksiyonun</h2><ul>{[["arena-lights", "Arena konser ışıkları"], ["arena-costume", "Yıldızlı sahne ceketi"], ["arena-badge", "Akıcılık yıldızı rozeti"]].map(([id, name]) => <li key={id}>{progress.rewards.includes(id) ? "Kazanıldı" : "Koleksiyon öğesi"}: {name}</li>)}</ul></section>
  </main>;
}
