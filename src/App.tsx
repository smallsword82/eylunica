import { useEffect, useRef, useState } from "react";
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
import { Avatar } from "./ui/Avatar";
const ops: Operation[] = ["add", "subtract", "multiply", "divide"];
type Screen = "home" | "characters" | "play" | "summary" | "parent";
export default function App() {
  const [progress, setProgress] = useState<Progress>(fresh),
    [ready, setReady] = useState(false),
    [screen, setScreen] = useState<Screen>("home");
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
    [offlineReady, setOfflineReady] = useState(false);
  const started = useRef(0),
    sessionStart = useRef(0),
    attempted = useRef(false),
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
    started.current = performance.now();
  }
  function start(m: string, cal = false) {
    setMode(m);
    setCalibration(cal);
    setCount(0);
    setEarned(0);
    sessionStart.current = Date.now();
    pickQuestion(m, progress, 0, cal);
    setScreen("play");
  }
  function answer(value: number) {
    if (!question || solved || pending.current) return;
    pending.current = true;
    const correct = value === question.answer;
    // One learning record and at most one star per question; retries remain encouraging.
    if (!attempted.current) {
      const next = record(
        progress,
        question,
        correct,
        usedHint.current,
        performance.now() - started.current,
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
    if (count >= 4 || (calibration && count >= 3)) {
      if (calibration) persist({ ...progress, calibrationDone: true });
      setScreen("summary");
      return;
    }
    const n = count + 1;
    setCount(n);
    pickQuestion(mode, progress, n, calibration);
    firstEntry.current?.focus();
  }
  const total = Object.values(progress.skills).reduce(
      (n, s) => n + s.attempts,
      0,
    ),
    correct = Object.values(progress.skills).reduce((n, s) => n + s.correct, 0);
  const currentWorld = worlds.find((w) => w.operation === mode) || worlds[0];
  const guide = calibration ? "Zeyna" : currentWorld.character;
  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setScreen("home")}
          aria-label="Matematik Sahnesi ana sayfa"
        >
          <span className="brand-icon">✦</span>
          <span>
            matematik
            <span className="brand-bottom">
              sahnesi<span className="brand-dot">.</span>
            </span>
          </span>
        </button>
        <div className="top-actions">
          <span className="quiet">
            <span aria-hidden="true">◉</span> Sessiz bir macera
          </span>
          <span className="star-pill" aria-label={`${progress.stars} yıldız`}>
            ✦ {progress.stars}
          </span>
          <button
            className="avatar-button"
            onClick={() => setScreen("characters")}
            aria-label="Karakter seç"
          >
            <Avatar name={progress.character} />
          </button>
        </div>
      </header>
      {error && (
        <div className="storage-error" role="alert">
          {error}
        </div>
      )}
      {!ready ? (
        <main>
          <p>Perdeler açılıyor…</p>
        </main>
      ) : (
        <>
          {screen === "home" && (
            <main>
              <section className="hero">
                <div className="hero-copy">
                  <div className="eyebrow">
                    <span /> RİTMA İLE ZİHİNDEN MATEMATİK
                  </div>
                  <h1>
                    Küçük adımlar.
                    <br />
                    Kocaman bir <em>sahne.</em>
                  </h1>
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
                  className={`stage ${progress.rewards.includes("lights") ? "lit" : ""} ${progress.rewards.includes("confetti") ? "confetti" : ""}`}
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
                    <Avatar name="Derin" large />
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
              <section className="world-section">
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
              <section className="companion">
                <Avatar name={progress.character} />
                <div>
                  <div className="eyebrow muted">SAHNE ARKADAŞIN</div>
                  <h3>{progress.character} yanında.</h3>
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
                <span>♡ Reklamsız ve güvenli</span>
                <span>☁ Cihazında saklanır</span>
                <span>◷ Günde yaklaşık 10 dakika</span>
              </section>
            </main>
          )}
          {screen === "characters" && (
            <main className="subpage">
              <button className="text-button" onClick={() => setScreen("home")}>
                ← Macera haritana dön
              </button>
              <div className="eyebrow muted">BİRLİKTE DAHA GÜZEL</div>
              <h1>Sahne arkadaşını seç.</h1>
              <p className="intro">
                Hepsi farklı düşünür. Hepsi senin yanında.
              </p>
              <div className="character-grid">
                {characters.map((c) => (
                  <button
                    key={c.name}
                    className={`character-card ${progress.character === c.name ? "selected" : ""}`}
                    onClick={() => persist({ ...progress, character: c.name })}
                    aria-pressed={progress.character === c.name}
                  >
                    <Avatar name={c.name} large />
                    <h2>{c.name}</h2>
                    <p>{c.role}</p>
                    <span>
                      {progress.character === c.name
                        ? "✓ Sahne arkadaşın"
                        : "Seç"}
                    </span>
                  </button>
                ))}
              </div>
              <button className="primary" onClick={() => setScreen("home")}>
                Maceraya dön →
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
              <div className="mission-progress" role="progressbar" aria-valuenow={count+1} aria-valuemin={0} aria-valuemax={calibration?4:5} aria-label="Görev ilerlemesi">
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
                      <div className="ten-frame" role="img" aria-label={`Onluk çerçeve: ${Math.min(strategy(question).dots,10)} dolu, ${10-Math.min(strategy(question).dots,10)} boş yer`}>
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
              {Date.now() - sessionStart.current > 600000 && (
                <p className="break-note">
                  Biraz mola vermek iyi gelebilir. Maceran burada seni bekliyor.
                </p>
              )}
            </main>
          )}
          {screen === "summary" && (
            <main className="subpage summary">
              <div className="summary-star">✦</div>
              <div className="eyebrow muted">
                BUGÜN SAHNE BİRAZ DAHA AYDINLIK
              </div>
              <h1>Her keşif bir adım.</h1>
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
              <button className="primary" onClick={() => setScreen("home")}>
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
                Bu cihazdaki ilerleme. Hesap, reklam, analiz veya bulut kaydı
                yok.
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
              <h2>Gizlilik ve çevrimdışı kullanım</h2>
              <p>
                Web sürümünü ilk kez açmak internet gerektirir. Dosyalar
                indirildikten sonra temel oyun çevrimdışı kullanılabilir.
                Android sürümü oyun dosyalarını paketin içinde taşır. Tarayıcı
                verilerini silmek ilerlemeyi de siler.
              </p>
              <p>
                Karakterler ve çizimler bu proje için oluşturulmuştur. RİTMA ve
                Matematik Sahnesi adları geçicidir; yayımdan önce marka
                incelemesi gerekir.
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
                  <p>Tüm yerel yıldızlar ve beceri kayıtları silinecek.</p>
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
    </div>
  );
}
