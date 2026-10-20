import { characters } from "../game";
import type { Progress } from "../storage";
import { Avatar } from "./Avatar";

export function CardReward({ progress }: { progress: Progress }) {
  const last = progress.cards?.last;
  if (!last) return null;
  return <section className="card-reward" aria-label="Bölüm ödülün">
    <Avatar name={last.character} large costume />
    <div><p className="eyebrow">BÖLÜMÜ TAMAMLADIN!</p><h2>{last.character} kartı kazandın!</h2><p>Çaban için bu kart koleksiyonuna eklendi. İpucuyla öğrenmek de değerli!</p><p className="small">{last.source} · Koleksiyonunda bu karttan {progress.cards!.counts[last.character]} tane var.</p></div>
  </section>;
}

export function CardCollection({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  const counts = progress.cards?.counts ?? {};
  const unique = characters.filter(character => counts[character.name]).length;
  return <main className="subpage"><button className="text-button" onClick={onBack}>← Haritaya dön</button><h1>Manifest kart koleksiyonun</h1><p>{unique} / 6 farklı eğitmen kartı · {Object.values(counts).reduce((sum, count) => sum + count, 0)} toplam kart</p><p>Her tamamlanan bölümde bir kart kazanırsın. İlk altı kart farklıdır; sonra yeni kopyalar birikir. Süre veya kusursuz yanıt şartı yok.</p><div className="collectible-grid">{characters.map(character => <article key={character.name} className={`collectible-card ${counts[character.name] ? "collected" : ""}`}><Avatar name={character.name} large costume={!!counts[character.name]} /><h2>{character.name}</h2><p>{counts[character.name] ? `${counts[character.name]} kart kazandın` : "Henüz kazanılmadı"}</p><span>{character.role}</span></article>)}</div><p className="small">Kartlar bu cihazda saklanır; çevrimiçi yıldız sıralamasını değiştirmez. Koleksiyonu tamamlamak için acele etmene gerek yok.</p></main>;
}
