import { useState } from "react";
import { cardSeries, collectibleCards, type CollectibleCard } from "../game/cards";
import type { Progress } from "../storage";
import { cardCounts } from "../storage/cards";

function CardPhoto({ card }: { card: CollectibleCard }) {
  const [failed, setFailed] = useState(false);
  return <div className={`collectible-photo ${card.landscape ? "landscape" : ""}`}>
    {failed ? <span role="img" aria-label={`${card.character} · ${card.title}`}>{card.character} ✦</span>
      : <img src={card.image} alt={`${card.character} · ${card.title}`} loading="lazy" onError={() => setFailed(true)} />}
  </div>;
}

export function CardReward({ progress }: { progress: Progress }) {
  const last = progress.cards?.last;
  if (!last) return null;
  const counts = cardCounts(progress);
  const owned = collectibleCards.filter(card => counts[card.id]).length;
  const card = collectibleCards.find(card => card.id === last.cardId) ?? collectibleCards.find(card => card.character === last.character)!;
  if (last.collectionComplete) return <section className="card-reward" aria-label="Bölüm ödülün"><div><p className="eyebrow">KOLEKSİYONUN TAMAM!</p><h2>{collectibleCards.length} farklı kartı topladın!</h2><p>Yeni bölümlerle öğrenmeye ve yıldız kazanmaya devam edebilirsin.</p></div></section>;
  return <section className="card-reward" aria-label="Bölüm ödülün" style={{ "--card-color": card.color } as React.CSSProperties}>
    <CardPhoto card={card} />
    <div><p className="eyebrow">YENİ KARTIN!</p><h2>{card.character} kartı kazandın!</h2><p className="card-series-name">{card.title} · #{String(card.number).padStart(2, "0")}</p><p>Çaban için albümüne yeni bir görsel eklendi. İpucuyla öğrenmek de değerli!</p><p>{owned} / {collectibleCards.length} farklı kart</p><p className="small">{last.source}</p>{owned === collectibleCards.length && <strong>Koleksiyonun tamamlandı! ✦</strong>}</div>
  </section>;
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
