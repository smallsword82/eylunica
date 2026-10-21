import { useEffect, useRef, useState } from "react";
import { cardSeries, collectibleCards, type CollectibleCard } from "../game/cards";
import type { Progress } from "../storage";
import { cardCounts } from "../storage/cards";

function CardPhoto({ card, eager = false }: { card: CollectibleCard; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className={`collectible-photo ${card.landscape ? "landscape" : ""}`}>
    {failed ? <span role="img" aria-label={`${card.character} · ${card.title}`}>{card.character} ✦</span>
      : <img src={card.image} alt={`${card.character} · ${card.title}`} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} />}
  </div>;
}

function RewardPack({ card, owned, source }: { card: CollectibleCard; owned: number; source: string }) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "revealed">("sealed");
  const opener = useRef<HTMLButtonElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  useEffect(() => { opener.current?.focus(); }, []);
  useEffect(() => {
    if (phase !== "opening") return;
    const timer = window.setTimeout(() => setPhase("revealed"), 850);
    return () => window.clearTimeout(timer);
  }, [phase]);
  useEffect(() => {
    if (phase !== "revealed") return;
    reveal.current?.focus({ preventScroll: true });
    reveal.current?.scrollIntoView?.({ block: "center", behavior: "instant" });
  }, [phase]);
  function open() {
    setPhase(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "revealed" : "opening");
  }
  return <section className={`card-reward pack-reward pack-${phase}`} aria-label="Bölüm ödülün" style={{ "--card-color": card.color } as React.CSSProperties}>
    <div className="pack-heading"><p className="eyebrow">BÖLÜMÜ TAMAMLADIN!</p><h2>{phase === "revealed" ? `${card.character} kartı kazandın!` : "Yeni kart paketin hazır!"}</h2><p>{phase === "sealed" ? "Pakete dokun, kartını keşfet." : phase === "opening" ? "Paketin açılıyor…" : `${card.title} · #${String(card.number).padStart(2, "0")}`}</p></div>
    <div className={`pack-stage ${card.landscape ? "landscape" : ""}`}>
      <div ref={reveal} className="pack-revealed-card" tabIndex={phase === "revealed" ? -1 : undefined} role="group" aria-label={`${card.character} · ${card.title} kartın`} aria-hidden={phase !== "revealed"}>
        <CardPhoto card={card} eager />
        <span className="pack-card-label">{card.character}<small>{card.title}</small></span>
      </div>
      {phase !== "revealed" && <button ref={opener} className="pack-trigger" aria-label="Kart paketini aç" disabled={phase === "opening"} onClick={open}>
        <span className="pack-wrapper" aria-hidden="true"><span className="pack-seal">MANIFEST ✦</span><span className="pack-emblem">✦</span><strong>KART PAKETİ</strong><span className="pack-tap">Dokun ve aç</span><span className="pack-ridge" /></span>
      </button>}
      {phase !== "sealed" && <span className="pack-sparkles" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <span key={index} style={{ "--spark-angle": `${index * 36}deg` } as React.CSSProperties}>✦</span>)}</span>}
    </div>
    <div className="pack-caption" aria-live="polite">{phase === "revealed" ? <><strong>Albümüne eklendi! {owned} / {collectibleCards.length}</strong><p className="small">{source}</p>{owned === collectibleCards.length && <p>Koleksiyonun tamamlandı! ✦</p>}</> : <p className="small">Kartın kaydedildi. Hazır olduğunda açabilirsin.</p>}</div>
  </section>;
}

export function CardReward({ progress }: { progress: Progress }) {
  const last = progress.cards?.last;
  if (!last) return null;
  const counts = cardCounts(progress);
  const owned = collectibleCards.filter(card => counts[card.id]).length;
  const card = collectibleCards.find(card => card.id === last.cardId) ?? collectibleCards.find(card => card.character === last.character)!;
  if (last.collectionComplete) return <section className="card-reward" aria-label="Bölüm ödülün"><div><p className="eyebrow">KOLEKSİYONUN TAMAM!</p><h2>{collectibleCards.length} farklı kartı topladın!</h2><p>Yeni bölümlerle öğrenmeye ve yıldız kazanmaya devam edebilirsin.</p></div></section>;
  return <RewardPack key={card.id} card={card} owned={owned} source={last.source} />;
}

export function CardCollection({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  const counts = cardCounts(progress);
  const unique = collectibleCards.filter(card => counts[card.id]).length;
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const next = collectibleCards.find(card => !counts[card.id]);
  return <main className="subpage collection-page"><button className="text-button" onClick={onBack}>← Haritaya dön</button><h1>Manifest kart koleksiyonun</h1>
    <p>{unique} / {collectibleCards.length} farklı kart · {total} toplam kart</p>
    <progress className="collection-progress" aria-label="Kart koleksiyonun" value={unique} max={collectibleCards.length} />
    <p>Her karakterin dört farklı görselini topla. Koleksiyon tamamlanana kadar her bölüm sonunda yeni bir kart seni bekliyor.</p>
    {next ? <p className="collection-next">Sıradaki kart: <strong>{next.character} · {next.title}</strong></p> : <p className="collection-next">Albümün tamamlandı! {collectibleCards.length} farklı kartın var. ✦</p>}
    {cardSeries.map(series => {
      const cards = collectibleCards.filter(card => card.series === series.id);
      return <section key={series.id} className="collection-series" aria-label={series.title} style={{ "--card-color": series.color } as React.CSSProperties}>
        <h2>{series.title} <span>{cards.filter(card => counts[card.id]).length} / {cards.length}</span></h2>
        <div className="collectible-grid">{cards.map(card => <article key={card.id} className={`collectible-card ${counts[card.id] ? "collected" : ""}`}>
          <span className="card-number">#{String(card.number).padStart(2, "0")}</span>
          {counts[card.id] ? <CardPhoto card={card} /> : <div className={`collectible-photo card-locked ${card.landscape ? "landscape" : ""}`} role="img" aria-label="Henüz kazanılmadı"><span aria-hidden="true">✦</span></div>}
          <h3>{card.character}</h3><p>{counts[card.id] ? counts[card.id] > 1 ? `Koleksiyonunda · ${counts[card.id]} eski kopya` : "Koleksiyonunda ✓" : "Bir bölüm daha, yeni bir kart"}</p>
        </article>)}</div>
      </section>;
    })}
    <p className="small">Eski kartların korunur; tekrar eden kartların farklı görsellere aktarılır. Kartlarını bu cihazda çevrimdışı da görebilirsin.</p>
  </main>;
}
