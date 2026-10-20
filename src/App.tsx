import { Arena } from "./ui/Arena";
import { ArenaProgress } from "./ui/ArenaProgress";
import { useResponseClock } from "./arena/useResponseClock";
import { useNarration } from "./audio/useNarration";
import { narrateFeedback, stopNarration } from "./audio/narration";
import { narrationTexts } from "./audio/narration-texts";
import { ListenButton, NarrationPlayback } from "./ui/ListenButton";
import { AccountForm, StarLeague } from "./ui/StarLeague";
import { useAccount } from "./online/useAccount";
import { onlineEnabled } from "./online/config";
import { useLessonScore } from "./online/useLessonScore";
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
import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
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
import { CardCollection, CardReward } from "./ui/CollectibleCards";
import { awardCard } from "./storage/cards";
import { Avatar } from "./ui/Avatar";
import { MusicLounge } from "./ui/MusicLounge";
import { ManifestAudioControls } from "./ui/ManifestAudioControls";
import { getManifestPlayback, startManifestShuffle, setStudyMode, beginStudyQuestion, playManifestWelcome } from "./audio/manifest";
import { freshQuestion, freshStrategy } from "./lesson-engine";
const ops: Operation[] = ["add", "subtract", "multiply", "divide"];
type Screen =
  | "welcome"
  | "league"
  | "music"
  | "collection"
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
  const account = useAccount();
  const [guest, setGuest] = useState(() => sessionStorage.getItem("eylunica-local-session") === "yes");
  const [savedProgress, setProgress] = useState<Progress>(fresh),
    [ready, setReady] = useState(false),
    [screen, setScreen] = useState<Screen>(() => new URLSearchParams(location.search).has("league") ? "league" : "welcome");
  const progress = onlineEnabled && account.username ? { ...savedProgress, learnerName: account.username } : savedProgress;
  const needsAccount = onlineEnabled && !account.session && !guest;
  const [learnerDraft, setLearnerDraft] = useState("Eylül");
  const [question, setQuestion] = useState<Question | null>(null),
    [mode, setMode] = useState("add"),
    [hint, setHint] = useState(false),
    [feedback, setFeedback] = useState(""),
    [solved, setSolved] = useState(false),
    [entry, setEntry] = useState(""),
    [inputMode, setInputMode] = useState<"choices" | "keypad">("choices");
  const scoreAnswer = useLessonScore(screen === "play" ? question : null);
  const [scoreNotice, setScoreNotice] = useState("");
  useEffect(() => {
    const report = (event: Event) => setScoreNotice((event as CustomEvent<string>).detail);
    window.addEventListener("eylunica-score", report);
    return () => window.removeEventListener("eylunica-score", report);
  }, []);
  const [count, setCount] = useState(0),
    [earned, setEarned] = useState(0),
    [section, setSection] = useState(1),
    [startingLevel, setStartingLevel] = useState(1),
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
    firstEntry = useRef<HTMLButtonElement>(null),
    nextEntry = useRef<HTMLButtonElement>(null),
    questionHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    loadProgress()
      .then(value => { setProgress(value); setLearnerDraft(value.learnerName || "Eylül"); })
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
  useEffect(() => { setStudyMode(["play", "reading", "attention", "concert", "arena"].includes(screen)); }, [screen]);
  const firstMusic = useRef(false);
  const welcomed = useRef(false);
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
    if (screen !== "play" || wellbeing.notice) return;
    if (solved) nextEntry.current?.focus();
    else questionHeading.current?.focus();
  }, [screen, question, solved, wellbeing.notice]);
  useEffect(() => {
    if (screen === "play") wellbeing.setContext("math", true);
    else if (screen === "parent") wellbeing.setContext(null, false);
    else if (!["reading", "attention", "concert", "arena", "league"].includes(screen))
      wellbeing.setContext("other", false);
  }, [screen, wellbeing.setContext]);
  function persist(next: Progress) {
    const stored = onlineEnabled && account.username ? { ...next, learnerName: savedProgress.learnerName } : next;
    setProgress(stored);
    writes.current = writes.current
      .then(() => saveProgress(stored))
      .catch(() =>
        setError(
          "İlerleme kaydedilemedi. Cihazının depolama iznini kontrol et.",
        ),
      );
  }
  function pickQuestion(m: string, p: Progress, index: number, cal = false) {
    stopNarration();
    beginStudyQuestion();
    const op: Operation = cal
      ? ops[index % 4]
      : m === "mixed"
        ? ops[index % 4]
        : m === "strategy"
          ? "add"
          : (m as Operation);
    let q = freshQuestion(op, p.skills[op].level, p.history);
    if (m === "strategy") {
      q = freshStrategy(p.skills.add.level, p.history);
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
  function start(m: string, cal = false, source = progress) {
    wellbeing.transition(() => {
      if (cal) persist({ ...source, assessmentPending: true, calibrationDone: false });
      setMode(m);
      setCalibration(cal);
      setCount(0);
      setEarned(0);
      setSection((source.mathSections?.[m] ?? 0) + 1);
      setStartingLevel(source.skills[ops.includes(m as Operation) ? m as Operation : "add"].level);
      pickQuestion(m, source, 0, cal);
      setScreen("play");
    });
  }
  function enterAdventure() {
    const named = onlineEnabled ? progress : { ...progress, learnerName: learnerDraft.trim() || "Eylül" };
    persist(named);
    if (screen === "welcome" && named.assessmentPending && !named.calibrationDone) start("mixed", true, named);
    else setScreen("home");
    if (screen === "welcome" && !welcomed.current) { welcomed.current = true; void playManifestWelcome(); }
  }
  function answer(value: number) {
    if (!question || solved || pending.current) return;
    pending.current = true;
    const correct = value === question.answer;
    stopNarration();
    void playAnswerEffect(correct);
    narrateFeedback(correct ? "correct" : "retry", answerSoundSeconds * 1000 + 100);
    if (!correct) usedHint.current = true;
    // One learning record and at most one star per question; retries remain encouraging.
    if (!attempted.current) {
      scoreAnswer({ answer: value });
      const timing = responseClock.read();
      const next = record(
        progress,
        question,
        correct,
        usedHint.current,
        timing.elapsedMs,
        timing.timingValid,
      );
      if (calibration) next.skills[question.operation].level = correct && !usedHint.current
        ? Math.min(5, question.level + (count < 8 ? 2 : 0)) : Math.max(1, question.level - 1);
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
    if (!solved) return;
    wellbeing.transition(
      () => {
        if (count >= (calibration ? 11 : 4)) {
          if (calibration) persist(awardCard({ ...progress, calibrationDone: true, assessmentPending: false }, "placement:math", "Matematik başlangıç keşfi"));
          else persist(awardCard({ ...progress, mathSections: { ...progress.mathSections, [mode]: section } }, `math:${mode}:${section}`, `${currentWorld.title} · Bölüm ${section}`));
          setScreen("summary");
          return;
        }
        const n = count + 1;
        setCount(n);
        pickQuestion(mode, progress, n, calibration);
        firstEntry.current?.focus();
      },
      count < (calibration ? 11 : 4),
    );
  }
  const total = Object.values(progress.skills).reduce(
      (n, s) => n + s.attempts,
      0,
    ),
    correct = Object.values(progress.skills).reduce((n, s) => n + s.correct, 0);
  const currentWorld = worlds.find((w) => w.operation === mode) || worlds[0];
  const nextWorld = calibration ? worlds[0] : currentWorld;
  const displayName = (name: string) => name;
  const guide = calibration ? "Zeynep" : currentWorld.character;
  return (
    <div className="app-shell" inert={!!wellbeing.notice}>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setScreen(screen === "welcome" ? "welcome" : "home")}
          aria-label="eylunica ana sayfa"
        >
          <span className="brand-icon">✦</span>
          <span>
            eylunica
            <span className="brand-bottom">
              Her zihin kendi ritminde<span className="brand-dot">.</span>
            </span>
          </span>
        </button>
        {!needsAccount && <><div className="top-actions">
          <button className="secondary" onClick={() => setScreen("league")}>Yıldız tablosu{onlineEnabled ? account.username ? ` · ${account.username}` : " · Giriş" : ""}</button>
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
          <button className="collection-button" aria-label="Kart koleksiyonum" title="Kart koleksiyonum" onClick={() => setScreen("collection")}><span aria-hidden="true">▣</span></button>
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
        </div></>}
      </header>
      <NarrationPlayback />
      {ready && !needsAccount && screen !== "parent" && <ManifestAudioControls paused={!!wellbeing.notice} onEnableMusic={() => audio.changeMode("music")} />}
      {narration.error && <div className="storage-error" role="alert">{narration.error}</div>}
      {error && (
        <div className="storage-error" role="alert">
          {error}
        </div>
      )}
      {scoreNotice && <p className="storage-error" role="status">{scoreNotice} <button className="text-button" onClick={() => setScoreNotice("")}>Kapat</button></p>}
      {audio.error && <div className="storage-error" role="alert">{audio.error}</div>}
      {wellbeing.error && (
        <div className="storage-error" role="alert">
          {wellbeing.error}
        </div>
      )}
      {!ready || !account.ready ? (
        <main>
          <p>Perdeler açılıyor…</p>
        </main>
      ) : needsAccount ? (
        <main className="subpage account-entry league-page"><AccountForm /><p className="small">Cihazındaki mevcut ilerleme korunur.</p><button className="text-button" onClick={() => { sessionStorage.setItem("eylunica-local-session", "yes"); setGuest(true); }}>Şimdilik bu cihazda çevrimdışı devam et</button></main>
      ) : (
        <>
          {screen === "league" && (onlineEnabled ? <StarLeague onBack={() => setScreen("home")} /> : <main className="subpage"><button className="text-button" onClick={() => setScreen("home")}>← Haritaya dön</button><h1>eylunica Yıldız Tablosu</h1><h2>{progress.learnerName || "Eylül"} · {progress.stars} yıldız</h2><p>Bu cihazdaki yıldızların ve kartların korunuyor. Şimdilik hesap girişi ve kişiler arası çevrimiçi sıralama kapalı.</p><button className="primary" onClick={() => setScreen("collection")}>Kart koleksiyonunu gör →</button></main>)}
          {screen === "collection" && <CardCollection progress={progress} onBack={() => setScreen("home")} />}
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
                  onClick={() => wellbeing.transition(() => setScreen("reading"), !progress.academies.reading.placementDone)}
                >
                  <span className="academy-symbol" aria-hidden="true">
                    Aa
                  </span>
                  <strong>Okuduğunu Anlama Akademisi</strong>
                  <span>Hikâyeleri oku, kanıtları birleştir →</span>
                </button>
                <button
                  className="academy-tile focus-tile"
                  onClick={() => wellbeing.transition(() => setScreen("attention"), !progress.academies.attention.placementDone)}
                >
                  <span className="academy-symbol" aria-hidden="true">
                    ◎
                  </span>
                  <strong>Dikkat ve Odaklanma Akademisi</strong>
                  <span>Ayrıntıları fark et, sırayı hatırla →</span>
                </button>
              </nav>
              <button className="arena-entry" onClick={() => setScreen("arena")}>
                <strong>eylunica Hız Arenası</strong><span>İsteğe bağlı · önce doğruluk, sonra kendi gelişimin →</span>
              </button>
              <section className="manifest-banner">
                <img src="./manifest/group.webp" alt="Manifest grubu" />
                <div><span className="eyebrow">eylunica × MANIFEST</span>
                  <h1>Sahne senin, {progress.learnerName || "Eylül"}!</h1>
                  <p>Oku, düşün, ritmi yakala. Manifest eğitmenlerinle her gün yeni bir keşif.</p>
                  <button className="primary" onClick={() => start("add")}>İlk keşfe başla →</button>
                  <button className="secondary" onClick={() => setScreen("music")}>Manifest müzik odası →</button>
                  <button className="secondary" onClick={() => setScreen("collection")}>Kazandığın kartları gör →</button>
                </div>
              </section>
              <section className="hero">
                <div className="hero-copy">
                  <div className="eyebrow">
                    <span /> eylunica İLE ZİHİNDEN MATEMATİK
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
                  aria-label="eylunica konser sahnesi"
                >
                  <div className="stage-orbit" />
                  <div className="beam beam-one" />
                  <div className="beam beam-two" />
                  <span className="floating-star s1">✦</span>
                  <span className="floating-star s2">✧</span>
                  <span className="floating-star s3">+</span>
                  <div className="stage-label">
                    eylunica<span>SAHNE SENİN!</span>
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
              {(
                <section className="checkin">
                  <div className="checkin-icon">✧</div>
                  <div>
                    <strong>{progress.calibrationDone ? "Seviyeni yeniden keşfedelim mi?" : "Önce seni tanıyalım mı?"}</strong>
                    <p>
                      Dört işlemden toplam 12 küçük soru, sana uygun bir başlangıç. Süre
                      tutmuyoruz.
                      Yıldızların ve tamamladığın bölümler korunur.
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
                        <p>Bölüm {(progress.mathSections?.[w.operation] ?? 0) + 1} · {(progress.mathSections?.[w.operation] ?? 0)} bölüm tamamlandı</p>
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
              <div className="eyebrow muted">{screen === "welcome" ? "eylunica’YA HOŞ GELDİN" : "BİRLİKTE DAHA GÜZEL"}</div>
              <h1>{screen === "welcome" ? `${progress.learnerName || "Eylül"}, sahne senin.` : "Manifest eğitmenini seç."}</h1>
              {!onlineEnabled && screen === "welcome" && <div className="name-entry"><label htmlFor="learner-name">Adın</label><input id="learner-name" name="nickname" autoComplete="nickname" maxLength={24} value={learnerDraft} onChange={event => setLearnerDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); enterAdventure(); } }} /><p className="small">Sadece ismini yazıp başlayabilirsin. Şifre veya hesap gerekmez; ilerlemen bu cihazda saklanır.</p></div>}
              <p className="intro">
                Başrol sensin. Manifest üyeleri de öğrenme yolculuğunda eğitmenlerin. İlk adımda sana kim eşlik etsin?
              </p>
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
              {screen === "welcome" && progress.assessmentPending && !progress.calibrationDone && <p>Önce seviyeni keşfedelim: dört işlemden 12 soru. Yanıtlarına göre sorular kolaylaşır veya zorlaşır; süre sınırı yok.</p>}
              <button className="primary" disabled={!audio.ready} onClick={enterAdventure}>
                {screen === "welcome" ? "eylunica’ya devam et →" : "Maceraya dön →"}
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
                  {count + 1}/{calibration ? 12 : 5}
                </span>
              </div>
              <div
                className="mission-progress"
                role="progressbar"
                aria-valuenow={count + 1}
                aria-valuemin={0}
                aria-valuemax={calibration ? 12 : 5}
                aria-label="Görev ilerlemesi"
              >
                {Array.from({ length: calibration ? 12 : 5 }, (_, i) => (
                  <span key={i} className={i <= count ? "active" : ""} />
                ))}
              </div>
              <div className="play-layout">
                {!calibration && <section className="section-progress" aria-label="Bölüm durumun">
                  <strong>{currentWorld.title} · Bölüm {section}</strong>
                  <span>Zorluk: {question.level} / 5 · Tamamlanan: {count + (solved ? 1 : 0)} / 5 soru</span>
                  <p>5 soru bitince bölüm tamamlanır. Zorluk, art arda 5 ipucusuz doğru yanıtta artar.</p>
                </section>}
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
                  <p className="question-count">Soru {count + 1} / {calibration ? 12 : 5}</p>
                  {!solved && <p className="small">Bu turda {calibration ? 12 : 5} soru var. Doğru yanıttan sonra aşağıdaki devam düğmesine dokun.</p>}
                  <div className="eyebrow muted">
                    {solved ? "BİR KEŞİF DAHA!" : "IŞIKLARI BİRLİKTE YAKALIM"}
                  </div>
                  <h1
                    className="equation"
                    ref={questionHeading}
                    tabIndex={-1}
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
                    id="math-feedback"
                    role="status"
                    className={`feedback ${solved ? "success" : ""}`}
                  >
                    {feedback}
                  </div>
                  {solved ? (
                    <button ref={nextEntry} className="primary next" onClick={next} aria-describedby="math-feedback">
                      {count >= (calibration ? 11 : 4)
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
              <CardReward progress={progress} />
              {calibration && <section className="section-progress" aria-label="Başlangıç seviyelerin"><h2>Seviye tespitin tamamlandı!</h2>{ops.map(operation => <p key={operation}>{worlds.find(world => world.operation === operation)?.title}: Seviye {progress.skills[operation].level} / 5</p>)}<p>Bu kısa keşif matematik içindir. Okuma ve dikkat dersleri kendi yanıtlarına göre ilerler.</p></section>}
              {!calibration && <section className="section-progress" aria-label="Tamamlanan bölüm">
                <h2>{currentWorld.title} · Bölüm {section} tamamlandı!</h2>
                <p>5 / 5 soru tamamlandı. İlerlemen kaydedildi.</p>
                <p>{progress.skills[ops.includes(mode as Operation) ? mode as Operation : "add"].level > startingLevel
                  ? `Zorluk yükseldi! Yeni seviye: ${progress.skills[ops.includes(mode as Operation) ? mode as Operation : "add"].level} / 5.`
                  : startingLevel === 5 ? "En yüksek zorluktasın. Yeni sorularla ustalaşmaya devam!" : "Henüz seviye atlanmadı. Art arda 5 ipucusuz doğru yanıtta zorluk artar; yeni sorularla pekiştirelim."}</p>
              </section>}
              <ContinueCard title={calibration ? nextWorld.title : `${currentWorld.title} · Bölüm ${section + 1} · Yeni sorular`} onContinue={() => start(calibration ? nextWorld.operation : mode)} />
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
              eylunica <span className="footer-dot">✦</span> Her zihin kendi
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
