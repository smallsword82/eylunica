import { Arena } from "./ui/Arena";
import { ArenaProgress } from "./ui/ArenaProgress";
import { useResponseClock } from "./arena/useResponseClock";
import { useNarration } from "./audio/useNarration";
import { narrateFeedback, stopNarration } from "./audio/narration";
import { narrationTexts } from "./audio/narration-texts";
import { ListenButton, NarrationPlayback } from "./ui/ListenButton";
import { CharacterName } from "./ui/CharacterName";
import { useAudio } from "./audio/useAudio";
import { playAnswerEffect, answerSoundSeconds, playCompletionEffect, completionSoundSeconds, stopEffects, stopActivitySound } from "./audio";
import { createPortal } from "react-dom";
import { useWellbeing } from "./wellbeing/useWellbeing";
import { ParentTimePanel, TimeNotice } from "./ui/Wellbeing";
import {
  ReadingAcademy,
  AttentionAcademy,
  ConcertAcademy,
  AcademyProgress,
} from "./ui/Academies";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  generate,
  strategy,
  symbols,
  type Operation,
  type Question,
} from "./math-engine";
import {
  fresh,
  loadProgress,
  record,
  saveProgress,
  type Progress,
} from "./storage";
import { characters, worlds } from "./game";
import { ContinueCard } from "./ui/ContinueCard";
import { Avatar } from "./ui/Avatar";
import { MusicLounge } from "./ui/MusicLounge";
import { ManifestAudioControls } from "./ui/ManifestAudioControls";
import { getManifestPlayback, startManifestShuffle } from "./audio/manifest";
const StarLeague = lazy(() => import("./ui/StarLeague").then(module => ({ default: module.StarLeague })));
const ops: Operation[] = ["add", "subtract", "multiply", "divide"];
type Screen =
  | "welcome"
  | "league"
  | "music"
  | "home"
  | "characters"
  | "play"
  | "summary"
  | "parent"
  | "reading"
  | "attention"
  | "concert"
  | "arena";
export default function App() {
  const [progress, setProgress] = useState<Progress>(fresh),
    [ready, setReady] = useState(false),
    [screen, setScreen] = useState<Screen>(() => new URLSearchParams(location.search).has("league") ? "league" : "welcome");
  const [question, setQuestion] = useState<Question | null>(null),
    [mode, setMode] = useState("add"),
    [hint, setHint] = useState(false),
    [feedback, setFeedback] = useState(""),
    [solved, setSolved] = useState(false),
    [entry, setEntry] = useState(""),
    [inputMode, setInputMode] = useState<"choices" | "keypad">("choices");
  const [count, setCount] = useState(0),
    [earned, setEarned] = useState(0),
    [error, setError] = useState(""),
    [calibration, setCalibration] = useState(false),
    [confirmReset, setConfirmReset] = useState(false),
    [offlineReady, setOfflineReady] = useState(() =>
      Capacitor.isNativePlatform(),
    );
  const attempted = useRef(false),
    usedHint = useRef(false),
    writes = useRef(Promise.resolve()),
    pending = useRef(false),
    firstEntry = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    loadProgress()
      .then(setProgress)
      .catch(() =>
        setError("Cihaz kaydına ulaşılamadı. Bu oturumda oynayabilirsin."),
      )
      .finally(() => setReady(true));
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.ready
        .then(() => setOfflineReady(true))
        .catch(() => {});
  }, []);
  useEffect(() => {
    if (screen !== "summary") window.scrollTo(0, 0);
  }, [screen]);
  const narration = useNarration();
  const audio = useAudio();
  const firstMusic = useRef(false);
  useEffect(() => {
    stopNarration();
    if (screen === "parent") stopEffects();
    else stopActivitySound();
    if (screen === "home" && audio.mode === "music" && !firstMusic.current) {
      firstMusic.current = true;
      void startManifestShuffle();
    }
    if (screen === "summary") {
      void playCompletionEffect(); narrateFeedback("complete", completionSoundSeconds * 1000 + 100);
    }
  }, [screen]);
  const wellbeing = useWellbeing(ready);
  const responseClock = useResponseClock(`${screen}:${mode}:${count}:${calibration}:${question?.a}:${question?.b}`, screen !== "play" || !!wellbeing.notice);
  useEffect(() => { if (wellbeing.notice) { stopEffects(); stopNarration(); } }, [wellbeing.notice]);
  useEffect(() => {
    if (screen === "play") wellbeing.setContext("math", true);
    else if (screen === "parent") wellbeing.setContext(null, false);
    else if (!["reading", "attention", "concert", "arena", "league"].includes(screen))
      wellbeing.setContext("other", false);
  }, [screen, wellbeing.setContext]);
  function persist(next: Progress) {
    setProgress(next);
    writes.current = writes.current
      .then(() => saveProgress(next))
      .catch(() =>
        setError(
          "İlerleme kaydedilemedi. Cihazının depolama iznini kontrol et.",
        ),
      );
  }
  function pickQuestion(m: string, p: Progress, index: number, cal = false) {
    stopNarration();
    stopActivitySound();
    const op: Operation = cal
      ? ops[index % 4]
      : m === "mixed"
        ? ops[index % 4]
        : m === "strategy"
          ? "add"
          : (m as Operation);
    let q = generate(op, p.skills[op].level);
    if (m === "strategy") {
      const pairs = [
        [8, 7],
        [9, 6],
        [7, 5],
        [6, 8],
        [8, 9],
      ];
      const [a, b] = pairs[index % pairs.length];
      q = {
        a,
        b,
        answer: a + b,
        operation: "add",
        level: 1,
        options: [a + b - 1, a + b, a + b + 1, a + b + 2],
      };
    }
    setQuestion(q);
    usedHint.current = m === "strategy";
    setHint(m === "strategy");
    setFeedback("");
    setSolved(false);
    setEntry("");
    attempted.current = false;
    pending.current = false;

  }
  function start(m: string, cal = false) {
    wellbeing.transition(() => {
      setMode(m);
      setCalibration(cal);
      setCount(0);
      setEarned(0);
      pickQuestion(m, progress, 0, cal);
      setScreen("play");
    });
  }
  function answer(value: number) {
    if (!question || solved || pending.current) return;
    pending.current = true;
    const correct = value === question.answer;
    stopNarration();
    void playAnswerEffect();
    narrateFeedback(correct ? "correct" : "retry", answerSoundSeconds * 1000 + 100);
    if (!correct) usedHint.current = true;
    // One learning record and at most one star per question; retries remain encouraging.
    if (!attempted.current) {
      const timing = responseClock.read();
      const next = record(
        progress,
        question,
        correct,
        usedHint.current,
        timing.elapsedMs,
        timing.timingValid,
      );
      persist(next);
      attempted.current = true;
      if (correct) setEarned((n) => n + 1);
    }
    if (correct) {
      setSolved(true);
      setFeedback("Harika! Sahneye bir adım daha yaklaştın.");
    } else {
      setHint(true);
      setFeedback(
        "Henüz olmadı. Birlikte başka bir yol deneyelim; acelemiz yok.",
      );
      pending.current = false;
    }
  }
  function next() {
    wellbeing.transition(
      () => {
        if (count >= 4 || (calibration && count >= 3)) {
          if (calibration) persist({ ...progress, calibrationDone: true });
          setScreen("summary");
          return;
        }
        const n = count + 1;
        setCount(n);
        pickQuestion(mode, progress, n, calibration);
        firstEntry.current?.focus();
      },
      count < (calibration ? 3 : 4),
    );
  }
  const total = Object.values(progress.skills).reduce(
      (n, s) => n + s.attempts,
      0,
    ),
    correct = Object.values(progress.skills).reduce((n, s) => n + s.correct, 0);
  const currentWorld = worlds.find((w) => w.operation === mode) || worlds[0];
  const nextWorld = calibration ? worlds[0] : worlds[(worlds.indexOf(currentWorld) + 1) % worlds.length];
  const displayName = (name: string) => name;
  const guide = calibration ? "Zeynep" : currentWorld.character;
  return (
    <div className="app-shell" inert={!!wellbeing.notice}>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setScreen(screen === "welcome" ? "welcome" : "home")}
          aria-label="RİTMA ana sayfa"
        >
          <span className="brand-icon">✦</span>
          <span>
            RİTMA
            <span className="brand-bottom">
              Her zihin kendi ritminde<span className="brand-dot">.</span>
            </span>
          </span>
        </button>
        <div className="top-actions">
          <button className="secondary" onClick={() => setScreen("league")}>Yıldız ligi · Giriş</button>
          {ready && screen !== "parent" && (
            <button className="pause-button" onClick={() => wellbeing.pause()}>
              Mola ver
            </button>
          )}
          <select className="sound-button" aria-label="Ses modu" value={audio.mode} disabled={!audio.ready}
            onChange={event => audio.changeMode(event.target.value as "silent" | "effects" | "music")}>
            <option value="silent">Sessiz</option><option value="effects">Efektler</option><option value="music">Müzik + efekt</option>
          </select>
        </div>
        <div className="profile-actions">
          <span className="star-pill" aria-label={`${progress.stars} yıldız`}>
            ✦ {progress.stars}
          </span>
          <button
            className="avatar-button"
            onClick={() => setScreen("characters")}
            aria-label="Karakter seç"
          >
            <Avatar name={progress.character} label={displayName(progress.character)} costume={progress.rewards.includes("arena-costume")} />
          </button>
        </div>
      </header>
      <NarrationPlayback />
      {ready && screen !== "parent" && <ManifestAudioControls paused={!!wellbeing.notice} onEnableMusic={() => audio.changeMode("music")} />}
      {narration.error && <div className="storage-error" role="alert">{narration.error}</div>}
      {error && (
        <div className="storage-error" role="alert">
          {error}
        </div>
      )}
      {audio.error && <div className="storage-error" role="alert">{audio.error}</div>}
      {wellbeing.error && (
        <div className="storage-error" role="alert">
          {wellbeing.error}
        </div>
      )}
      {!ready ? (
        <main>
          <p>Perdeler açılıyor…</p>
        </main>
      ) : (
        <>
          {screen === "league" && <Suspense fallback={<main><p role="status">Yıldız ligi açılıyor…</p></main>}><StarLeague onBack={() => setScreen("home")} onActivity={wellbeing.setContext} onTransition={wellbeing.transition} paused={!!wellbeing.notice} /></Suspense>}
          {screen === "music" && <MusicLounge learnerName={progress.learnerName || "Eylül"} paused={!!wellbeing.notice} onBack={() => setScreen("home")} onEnableMusic={() => audio.changeMode("music")} />}
          {screen === "home" && (
            <main>
              <nav className="academy-hub" aria-label="Üç akademi">
                <button
                  className="academy-tile math-tile"
                  onClick={() =>
                    document
                      .querySelector("#math-map")
                      ?.scrollIntoView({ behavior: "instant" })
                  }
                >
                  <span className="academy-symbol" aria-hidden="true">
                    +
                  </span>
                  <strong>Matematik Akademisi</strong>
                  <span>Sayılarla düşün, stratejini keşfet →</span>
                </button>
                <button
                  className="academy-tile reading-tile"
                  onClick={() => setScreen("reading")}
                >
                  <span className="academy-symbol" aria-hidden="true">
                    Aa
                  </span>
                  <strong>Okuduğunu Anlama Akademisi</strong>
                  <span>Hikâyeleri oku, kanıtları birleştir →</span>
                </button>
                <button
                  className="academy-tile focus-tile"
                  onClick={() => setScreen("attention")}
                >
                  <span className="academy-symbol" aria-hidden="true">
                    ◎
                  </span>
                  <strong>Dikkat ve Odaklanma Akademisi</strong>
                  <span>Ayrıntıları fark et, sırayı hatırla →</span>
                </button>
              </nav>
              <button className="arena-entry" onClick={() => setScreen("arena")}>
                <strong>RİTMA Hız Arenası</strong><span>İsteğe bağlı · önce doğruluk, sonra kendi gelişimin →</span>
              </button>
              <section className="manifest-banner">
                <img src="./manifest/group.webp" alt="Manifest grubu" />
                <div><span className="eyebrow">RİTMA × MANIFEST</span>
                  <h1>Sahne senin, {progress.learnerName || "Eylül"}!</h1>
                  <p>Oku, düşün, ritmi yakala. Manifest eğitmenlerinle her gün yeni bir keşif.</p>
                  <button className="primary" onClick={() => start("add")}>İlk keşfe başla →</button>
                  <button className="secondary" onClick={() => setScreen("music")}>Manifest müzik odası →</button>
                </div>
              </section>
              <section className="hero">
                <div className="hero-copy">
                  <div className="eyebrow">
                    <span /> RİTMA İLE ZİHİNDEN MATEMATİK
                  </div>
                  <h2>
                    Küçük adımlar.
                    <br />
                    Kocaman bir <em>sahne.</em>
                  </h2>
                  <p>
                    Biraz merak, biraz matematik…
                    <br />
                    Konserin ışıklarını birlikte yakalım.
                  </p>
                  <button className="primary" onClick={() => start("add")}>
                    Maceraya devam et <span>→</span>
                  </button>
                  <div className="hero-note">
                    Süre yok. Baskı yok. Keşfetmek var.
                  </div>
                </div>
                <div
                  className={`stage ${progress.rewards.includes("arena-lights") ? "arena-lit" : ""} ${progress.rewards.includes("lights") ? "lit" : ""} ${progress.rewards.includes("confetti") ? "confetti" : ""}`}
                  aria-label="RİTMA konser sahnesi"
                >
                  <div className="stage-orbit" />
                  <div className="beam beam-one" />
                  <div className="beam beam-two" />
                  <span className="floating-star s1">✦</span>
                  <span className="floating-star s2">✧</span>
                  <span className="floating-star s3">+</span>
                  <div className="stage-label">
                    RİTMA<span>SAHNE SENİN!</span>
                  </div>
                  <div className="stage-team">
                    <Avatar name="Lidya" large />
                    <Avatar name="Mina" large />
                    <Avatar name="Hilal" large />
                  </div>
                  <div className="stage-floor" />
                  <div className="stage-badge">✦ Her fikir bir ışık yakar</div>
                </div>
              </section>
              {!progress.calibrationDone && (
                <section className="checkin">
                  <div className="checkin-icon">✧</div>
                  <div>
                    <strong>Önce seni tanıyalım mı?</strong>
                    <p>
                      Dört küçük soru, sana uygun bir başlangıç. Süre
                      tutmuyoruz.
                    </p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => start("mixed", true)}
                  >
                    Birlikte keşfedelim →
                  </button>
                </section>
              )}
              <section className="world-section" id="math-map">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow muted">MACERA HARİTAN</div>
                    <h2>Bugün nerede buluşalım?</h2>
                  </div>
                  <span className="map-note">6 dünya · sayısız keşif</span>
                </div>
                <div className="world-grid">
                  {worlds.map((w, i) => (
                    <button
                      key={w.title}
                      className="world-card"
                      onClick={() => start(w.operation)}
                      style={{ "--world": w.color } as React.CSSProperties}
                    >
                      <div className="card-top">
                        <span className="world-number">0{i + 1}</span>
                        <span className="world-tag">{w.character} ile</span>
                        <span className="card-arrow">→</span>
                      </div>
                      <div className={`landscape landscape-${i}`}>
                        <span className="planet" />
                        <span className="hill hill-one" />
                        <span className="hill hill-two" />
                        <span className="world-symbol">{w.symbol}</span>
                        <span className="land-star">✦</span>
                      </div>
                      <div className="world-info">
                        <h3>{w.title}</h3>
                        <p>{w.sub}</p>
                        <div className="card-progress">
                          <span>
                            {i < 4
                              ? `Seviye ${progress.skills[w.operation as Operation].level}`
                              : i === 4
                                ? "Birlikte düşünelim"
                                : "Sahneye hazırlan"}
                          </span>
                          <span>
                            {i < 4
                              ? `${progress.skills[w.operation as Operation].correct} keşif`
                              : "Keşfet →"}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
              <section className="concert-banner">
                <div>
                  <div className="eyebrow muted">OKU · FARK ET · HESAPLA</div>
                  <h2>Üç keşif, tek konser.</h2>
                  <p>
                    Bir hikâyenin içindeki ipuçlarıyla sahneyi birlikte
                    hazırlayalım.
                  </p>
                </div>
                <button
                  className="primary"
                  onClick={() => setScreen("concert")}
                >
                  Büyük Konser Görevi →
                </button>
              </section>
              <section className="companion">
                <Avatar name={progress.character} label={displayName(progress.character)} costume={progress.rewards.includes("arena-costume")} />
                <div>
                  <div className="eyebrow muted">MANIFEST EĞİTMENİN</div>
                  <h3>{displayName(progress.character)} yanında.</h3>
                  <p>
                    Her sorunun birden fazla yolu var. Kendi yolunu
                    bulabilirsin.
                  </p>
                </div>
                <button
                  className="secondary"
                  onClick={() => setScreen("characters")}
                >
                  Arkadaşını seç →
                </button>
              </section>
              <section className="bottom-strip">
                <span>♡ Kendi ritminde öğren</span>
                <span>☁ Cihazında saklanır</span>
                <span>◷ Önerilen öğrenme süresi 15 dakika</span>
              </section>
            </main>
          )}
          {screen === "arena" && <Arena progress={progress} onSave={persist} onBack={() => setScreen("home")} onPractice={op => start(op)} onTransition={wellbeing.transition} onActivity={wellbeing.setContext} paused={!!wellbeing.notice} />}
          {screen === "reading" && (
            <ReadingAcademy
              progress={progress}
              onSave={persist}
              onBack={() =>
                wellbeing.transition(() => setScreen("home"), false)
              }
              onTransition={wellbeing.transition}
              onActivity={wellbeing.setContext}
            />
          )}
          {screen === "attention" && (
            <AttentionAcademy
              progress={progress}
              onSave={persist}
              onBack={() =>
                wellbeing.transition(() => setScreen("home"), false)
              }
              onTransition={wellbeing.transition}
              onActivity={wellbeing.setContext}
            />
          )}
          {screen === "concert" && (
            <ConcertAcademy
              progress={progress}
              onSave={persist}
              onBack={() =>
                wellbeing.transition(() => setScreen("home"), false)
              }
              onTransition={wellbeing.transition}
              onActivity={wellbeing.setContext}
            />
          )}
          {(screen === "characters" || screen === "welcome") && (
            <main className={`subpage ${screen === "welcome" ? "welcome-page" : ""}`}>
              {screen !== "welcome" && <button className="text-button" onClick={() => setScreen("home")}>
                ← Macera haritana dön
              </button>}
              <div className="eyebrow muted">{screen === "welcome" ? "RİTMA’YA HOŞ GELDİN" : "BİRLİKTE DAHA GÜZEL"}</div>
              <h1>{screen === "welcome" ? `${progress.learnerName || "Eylül"}, sahne senin.` : "Manifest eğitmenini seç."}</h1>
              <p className="intro">
                Başrol sensin. Manifest üyeleri de öğrenme yolculuğunda eğitmenlerin. İlk adımda sana kim eşlik etsin?
              </p>
              <CharacterName progress={progress} onSave={persist} />
              {screen === "welcome" && <p className="welcome-progress" role="status">
                {progress.stars > 0 || total > 0 || progress.history.length > 0
                  ? `${progress.stars} yıldızın ve mevcut ilerlemen burada. Kaldığın yerden devam edebilirsin.`
                  : "Acele yok. Altı arkadaş, yepyeni keşifler."}
              </p>}
              <div className="character-grid">
                {characters.map((c) => (
                  <button
                    key={c.name}
                    className={`character-card ${progress.character === c.name ? "selected" : ""}`}
                    onClick={() => persist({ ...progress, character: c.name })}
                    aria-pressed={progress.character === c.name}
                  >
                    <Avatar name={c.name} label={displayName(c.name)} large />
                    <h2>{displayName(c.name)}</h2>
                    <p>{c.role}</p>
                    <span>
                      {progress.character === c.name
                        ? "✓ Eğitmenin"
                        : "Seç"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="welcome-companion">{progress.learnerName || "Eylül"}, eğitmenin {progress.character}. Hazırsan sahne senin!</p>
              <button className="primary" disabled={!audio.ready} onClick={() => setScreen("home")}>
                {screen === "welcome" ? "RİTMA’ya devam et →" : "Maceraya dön →"}
              </button>
            </main>
          )}
          {screen === "play" && question && (
            <main className="subpage play-page">
              <div className="play-toolbar">
                <button
                  className="text-button"
                  onClick={() => setScreen("home")}
                >
                  ← Haritaya dön
                </button>
                <span>
                  {calibration ? "Seni tanıyalım" : currentWorld.title} ·{" "}
                  {count + 1}/{calibration ? 4 : 5}
                </span>
              </div>
              <div
                className="mission-progress"
                role="progressbar"
                aria-valuenow={count + 1}
                aria-valuemin={0}
                aria-valuemax={calibration ? 4 : 5}
                aria-label="Görev ilerlemesi"
              >
                {Array.from({ length: calibration ? 4 : 5 }, (_, i) => (
                  <span key={i} className={i <= count ? "active" : ""} />
                ))}
              </div>
              <div className="play-layout">
                <aside className="guide">
                  <Avatar name={guide} large />
                  <h2>{guide} ile düşün</h2>
                  <p>
                    {calibration
                      ? "Bu bir sınav değil. Nereden başlayacağımızı keşfediyoruz."
                      : "Konser için ışıkları hazırlıyoruz. Her küçük keşif sahneyi aydınlatır."}
                  </p>
                  <span className="guide-note">Acele etmen gerekmiyor ♡</span>
                </aside>
                <section className="question-panel">
                  <ListenButton text={narrationTexts.math} />
                  <div className="eyebrow muted">
                    {solved ? "BİR KEŞİF DAHA!" : "IŞIKLARI BİRLİKTE YAKALIM"}
                  </div>
                  <h1
                    className="equation"
                    aria-label={`${question.a} ${symbols[question.operation]} ${question.b} kaç eder?`}
                  >
                    {question.a} <span>{symbols[question.operation]}</span>{" "}
                    {question.b} <span>=</span>{" "}
                    <span className="answer-box">
                      {solved ? question.answer : "?"}
                    </span>
                  </h1>
                  {!solved && (
                    <>
                      <div
                        className="input-tabs"
                        role="group"
                        aria-label="Yanıt biçimi"
                      >
                        <button
                          aria-pressed={inputMode === "choices"}
                          onClick={() => setInputMode("choices")}
                        >
                          Seçenekler
                        </button>
                        <button
                          aria-pressed={inputMode === "keypad"}
                          onClick={() => setInputMode("keypad")}
                        >
                          Kendim yazayım
                        </button>
                      </div>
                      {inputMode === "choices" ? (
                        <div className="answer-options">
                          {question.options.map((n, i) => (
                            <button
                              ref={i === 0 ? firstEntry : undefined}
                              key={n}
                              onClick={() => answer(n)}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (entry.trim()) answer(Number(entry));
                          }}
                        >
                          <label htmlFor="answer">Yanıtın</label>
                          <input
                            id="answer"
                            inputMode="numeric"
                            autoComplete="off"
                            pattern="[0-9]*"
                            value={entry}
                            onChange={(e) =>
                              setEntry(
                                e.target.value.replace(/\D/g, "").slice(0, 5),
                              )
                            }
                          />
                          <button className="primary" disabled={!entry}>
                            Kontrol edelim →
                          </button>
                        </form>
                      )}
                    </>
                  )}
                  <div
                    role="status"
                    className={`feedback ${solved ? "success" : ""}`}
                  >
                    {feedback}
                  </div>
                  {solved ? (
                    <button className="primary next" onClick={next}>
                      {count >= (calibration ? 3 : 4)
                        ? "Sahnedeki ışıklarını gör"
                        : "Sıradaki keşif"}{" "}
                      →
                    </button>
                  ) : (
                    <button
                      className="hint-button"
                      aria-expanded={hint}
                      onClick={() => {
                        usedHint.current = true;
                        setHint((v) => !v);
                      }}
                    >
                      ✧ {hint ? "İpucunu kapat" : "Birlikte düşünelim"}
                    </button>
                  )}
                  {hint && (
                    <div className="strategy">
                      <h3>{strategy(question).title}</h3>
                      <div
                        className="ten-frame"
                        role="img"
                        aria-label={`Onluk çerçeve: ${Math.min(strategy(question).dots, 10)} dolu, ${10 - Math.min(strategy(question).dots, 10)} boş yer`}
                      >
                        {Array.from({ length: 10 }, (_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.min(strategy(question).dots, 10)
                                ? "filled"
                                : ""
                            }
                          />
                        ))}
                      </div>
                      {strategy(question).groups && (
                        <p>{strategy(question).groups} eş grup düşün.</p>
                      )}
                      <ol>
                        {strategy(question).steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </section>
              </div>
            </main>
          )}
          {screen === "summary" && (
            <main className="subpage summary">
              <div className="summary-star">✦</div>
              <div className="eyebrow muted">
                BUGÜN SAHNE BİRAZ DAHA AYDINLIK
              </div>
              <h1>Her keşif bir adım.</h1>
              <ContinueCard title={nextWorld.title} onContinue={() => start(nextWorld.operation)} />
              <p>
                Birlikte düşündük, yeni yollar keşfettik.
                <br />
                Bu görevde <strong>{earned} yıldız</strong> kazandın. İpucuyla
                öğrenmek de çok değerli.
              </p>
              <div className="summary-team">
                {characters.slice(0, 3).map((c) => (
                  <Avatar key={c.name} name={c.name} large />
                ))}
              </div>
              <div className="reward-note">
                {progress.rewards.includes("confetti")
                  ? "✧ Konfeti dekorun açıldı!"
                  : progress.rewards.includes("lights")
                    ? "✦ Sahnenin renkli ışıkları açıldı!"
                    : `İlk sahne dekoruna ${Math.max(0, 5 - progress.stars)} yıldız kaldı.`}
              </div>
              <button className="secondary" onClick={() => setScreen("home")}>
                Macera haritana dön →
              </button>
              <p className="small">
                İstersen mola ver. İlerlemen cihazında seni bekler.
              </p>
            </main>
          )}
          {screen === "parent" && (
            <main className="subpage parent">
              <button className="text-button" onClick={() => setScreen("home")}>
                ← Haritaya dön
              </button>
              <h1>Küçük keşiflerin günlüğü</h1>
              <p>
                Bu rapor cihazdaki yerel öğrenme ilerlemesidir. İsteğe bağlı Yıldız Ligi hesabı ve çevrimiçi lig yıldızları ayrı tutulur; bu öğrenme geçmişi buluta gönderilmez.
              </p>
              <div className="stats">
                <div>
                  <strong>{total}</strong>
                  <span>İlk deneme</span>
                </div>
                <div>
                  <strong>
                    {total ? Math.round((correct / total) * 100) : 0}%
                  </strong>
                  <span>İlk denemede doğruluk</span>
                </div>
                <div>
                  <strong>{progress.stars}</strong>
                  <span>Keşif yıldızı</span>
                </div>
              </div>
              <p>
                Tekrar denemeler cezalandırılmaz; yıldız ve beceri ölçümü soru
                başına ilk yanıttan kaydedilir. İpucu kullanımı ayrıca izlenir.
              </p>
              <div className="table-scroll">
                <table>
                  <caption>İşlem bazında yerel gelişim</caption>
                  <thead>
                    <tr>
                      <th>İşlem</th>
                      <th>Seviye</th>
                      <th>Doğru / deneme</th>
                      <th>İpucu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ops.map((op, i) => (
                      <tr key={op}>
                        <th>{worlds[i].title}</th>
                        <td>{progress.skills[op].level}</td>
                        <td>
                          {progress.skills[op].correct} /{" "}
                          {progress.skills[op].attempts}
                        </td>
                        <td>{progress.skills[op].hints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Yanıt süreleri yalnızca cihazda tutulur; hız için ödül veya süre
                baskısı uygulanmaz. Bir yanlış yanıttan düşünme süreci hakkında
                kesin çıkarım yapılmaz.
              </p>
              <section className="parent-time-panel" aria-labelledby="narration-title">
                <h2 id="narration-title">Konuşmalı seslendirme</h2>
                <label><input type="checkbox" checked={narration.enabled} disabled={!narration.ready}
                  onChange={event => narration.change(event.target.checked)} /> Otomatik konuşmalı geri bildirim</label>
                <p>Sessiz mod tüm konuşma, müzik ve efektleri kapatır. Varsayılan Müzik ve Efektler modudur; kayıtlı tercihin korunur. Manifest şarkıları 12 saniyelik kesitlerle, aralarda kısa sessizlikle rastgele çalar. Ses düzeyini ayarlayabilir veya durdurabilirsin. Konuşma, mola ve ebeveyn ekranı müziği durdurur.</p>
                <p>Doğru yanıt, yeniden deneme ve tamamlama mesajlarını seslendirir. Varsayılan kapalıdır. Yönergeler ve altı hikâye, Dinle düğmesiyle her zaman isteğe bağlı dinlenebilir. Konuşmayı ekrandaki durdurma düğmesiyle kesebilirsin.</p>
                <p>Sesler Türkçe sentetik bir anlatıcıyla hazırlanmıştır; karakterlerin gerçek sesi değildir. İnternet veya cihazda Türkçe ses paketi gerekmez. Hikâyeyi dinleme isteği okuma oturumunda destek sayılır; yıldız kaybettirmez.</p>
                <ListenButton text={narrationTexts.correct} label="Anlatıcı sesini dene" />
              </section>
              <ParentTimePanel wellbeing={wellbeing} />
              <ArenaProgress progress={progress} />
              <AcademyProgress progress={progress} />
              <h2>Gizlilik ve çevrimdışı kullanım</h2>
              <p>
                Web sürümünü ilk kez açmak internet gerektirir. Dosyalar
                indirildikten sonra temel oyun çevrimdışı kullanılabilir.
                Android sürümü oyun dosyalarını paketin içinde taşır. Tarayıcı
                verilerini silmek ilerlemeyi de siler.
              </p>
              <p>
                Manifest üyelerinin fotoğraflarıyla hazırlanmış kişisel bir öğrenme alanıdır.
                Eğitmenlerin sözleri ve sorular uygulamanın kurgusudur; grubun gerçek ders anlatımı değildir.
              </p>
              {!confirmReset ? (
                <button
                  className="secondary"
                  onClick={() => setConfirmReset(true)}
                >
                  Bu cihazdaki ilerlemeyi sıfırla
                </button>
              ) : (
                <div role="alert">
                  <p>
                    Tüm yerel yıldızlar ve beceri kayıtları silinecek. Süre
                    ayarları ve kullanım sayacı korunacak.
                  </p>
                  <button
                    className="secondary"
                    onClick={() => {
                      persist(fresh());
                      setConfirmReset(false);
                    }}
                  >
                    Evet, sıfırla
                  </button>{" "}
                  <button
                    className="text-button"
                    onClick={() => setConfirmReset(false)}
                  >
                    Vazgeç
                  </button>
                </div>
              )}
            </main>
          )}
          <footer>
            <span>
              RİTMA <span className="footer-dot">✦</span> Her zihin kendi
              ritminde.
            </span>
            <div>
              <span>
                {offlineReady
                  ? "Çevrimdışı oynamaya hazır"
                  : "İlk web ziyareti internet gerektirir"}
              </span>
              <button onClick={() => setScreen("parent")}>
                Ebeveyn köşesi →
              </button>
            </div>
          </footer>
        </>
      )}
      {createPortal(
        <TimeNotice
          wellbeing={wellbeing}
          onParent={() => setScreen("parent")}
          onHome={() => setScreen("home")}
        />,
        document.body,
      )}
    </div>
  );
}
