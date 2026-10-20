import { useEffect, useState } from "react";
import { getSoundMode, subscribeSoundMode } from "../audio";
import { getManifestPlayback, manifestTracks, playManifestTrack, setManifestVolume, startManifestShuffle, stopManifestAudio, subscribeManifestPlayback, type ManifestTrack } from "../audio/manifest";

export function ManifestAudioControls({ paused, onEnableMusic }: { paused: boolean; onEnableMusic: () => void }) {
  const [mode, setMode] = useState(getSoundMode());
  const [playback, setPlayback] = useState(getManifestPlayback);
  const [track, setTrack] = useState<ManifestTrack>("zamansizdik");
  const [expanded, setExpanded] = useState(() => window.innerWidth > 600);
  useEffect(() => {
    const resize = () => setExpanded(window.innerWidth > 600);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => subscribeSoundMode(() => setMode(getSoundMode())), []);
  useEffect(() => subscribeManifestPlayback(() => setPlayback(getManifestPlayback())), []);
  function enable() { if (getSoundMode() !== "music") onEnableMusic(); }
  return <section className="manifest-audio-bar" aria-label="Kısa Manifest müzikleri">
    <div className="manifest-audio-heading"><span aria-hidden="true">♫</span>
      <div><strong>Manifest ritimleri</strong><small>{manifestTracks.length} şarkı ve remiks · Kısa, videosuz kesitler</small></div>
    </div>
    <button className="primary shuffle-button" disabled={paused} aria-pressed={playback.shuffling}
      onClick={() => { enable(); void startManifestShuffle(); }}>Rastgele çal</button>
    <button className="text-button" onClick={stopManifestAudio} disabled={!playback.playing && !playback.shuffling}>Sesi durdur</button>
    <details className="manifest-audio-details" open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary>Müzik ayarları</summary>
      <div className="manifest-audio-options">
    <select aria-label="Kısa şarkı seç" value={track} onChange={event => { stopManifestAudio(); setTrack(event.target.value as ManifestTrack); }}>
      {manifestTracks.map(track => <option key={track.id} value={track.id}>{track.title}</option>)}
    </select>
    <button className="secondary" disabled={paused} onClick={() => { enable(); void playManifestTrack(track); }}>12 saniye dinle</button>
    <label className="manifest-volume">Ses düzeyi
      <input type="range" min="5" max="80" value={Math.round(playback.volume * 100)}
        onChange={event => setManifestVolume(Number(event.target.value) / 100)} />
    </label>
    {playback.shuffling && <small>12 saniyelik kesitler aralarda kısa sessizlikle karışık çalar.</small>}
    {mode !== "music" && <small>Dinle veya Rastgele çal düğmesi müziği açar.</small>}
      </div>
    </details>
    {playback.playing && <small className="manifest-now-playing" aria-live="polite">Çalıyor: {playback.playing}</small>}
    {playback.error && <p role="alert">{playback.error}</p>}
  </section>;
}
