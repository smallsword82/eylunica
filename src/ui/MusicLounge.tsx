import { useState } from "react";
import { manifestTracks, playManifestTrack, startManifestShuffle, stopManifestAudio } from "../audio/manifest";
import { getSoundMode } from "../audio";

const songs = manifestTracks.map((track, index) => ({
  title: track.title, track: track.id,
  prompt: index % 2 === 0 ? "Birlikte ritim tut: dört vuruşluk iki grup kaç vuruş eder?" : "Altı kişilik grubun her üyesi iki adım atarsa toplam kaç adım olur?",
  answer: index % 2 === 0 ? 8 : 12,
}));


export function MusicLounge({ onBack, paused, learnerName, onEnableMusic }: { onBack: () => void; paused: boolean; learnerName: string; onEnableMusic: () => void }) {
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const song = songs[selected];
  return <main className="subpage music-lounge">
    <button className="text-button" onClick={onBack}>← Haritaya dön</button>
    <div className="eyebrow muted">MANIFEST MÜZİK ODASI</div>
    <h1>Biraz ritim, biraz keşif.</h1>
    <p>{learnerName}, şarkını seç. Kısa bir bölüm dinle, sonra ritim sorusunu birlikte çöz.</p>
    <div className="song-list" role="group" aria-label="Manifest şarkıları">
      {songs.map((song, index) => <button key={song.track} className="secondary" aria-pressed={selected === index}
        onClick={() => { setSelected(index); stopManifestAudio(); setAnswer(""); setFeedback(""); }}>{song.title}</button>)}
    </div>
    <div className="music-poster audio-poster"><img src="./manifest/group.webp" alt="Manifest grubu" />
      <button className="primary" disabled={paused} onClick={() => { if (getSoundMode() !== "music") onEnableMusic(); void playManifestTrack(song.track); }}>Kısa bölümü dinle · 12 sn</button>
    </div>
    <button className="secondary" disabled={paused} onClick={() => { if (getSoundMode() !== "music") onEnableMusic(); void startManifestShuffle(); }}>Şarkıları karışık dinle →</button>
    <p className="music-note">Sadece müzik. Video yok, uzun şarkı yok. Sesler cihazında; çevrimdışı da dinleyebilirsin.</p>
    <form className="rhythm-challenge" onSubmit={event => {
      event.preventDefault(); stopManifestAudio();
      setFeedback(Number(answer) === song.answer ? `Harika, ${learnerName}! Ritmi matematikle yakaladın.` : "Birlikte gruplayıp yeniden sayalım. Acelemiz yok.");
    }}>
      <div className="eyebrow muted">RİTMİ SAYILARA DÖNÜŞTÜR</div>
      <h2>{song.prompt}</h2>
      <label htmlFor="rhythm-answer">Ritim sorusunun yanıtı</label>
      <input id="rhythm-answer" type="number" min="0" required value={answer} onChange={event => setAnswer(event.target.value)} />
      <button className="primary" type="submit">Birlikte kontrol edelim →</button>
      <p role="status">{feedback}</p>
    </form>
  </main>;
}
