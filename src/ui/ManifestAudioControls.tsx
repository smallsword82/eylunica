import { useEffect, useState } from "react";
import { getSoundMode, subscribeSoundMode } from "../audio";
import { getManifestPlayback, manifestTracks, playManifestTrack, setManifestVolume, startManifestShuffle, stopManifestAudio, subscribeManifestPlayback, type ManifestTrack } from "../audio/manifest";

export function ManifestAudioControls({ paused, onEnableMusic }: { paused: boolean; onEnableMusic: () => void }) {
  const [mode, setMode] = useState(getSoundMode());
  const [playback, setPlayback] = useState(getManifestPlayback);
  const [track, setTrack] = useState<ManifestTrack>("zamansizdik");
  useEffect(() => subscribeSoundMode(() => setMode(getSoundMode())), []);
  useEffect(() => subscribeManifestPlayback(() => setPlayback(getManifestPlayback())), []);
  function enable() { if (getSoundMode() !== "music") onEnableMusic(); }
  return <section className="manifest-audio-bar" aria-label="Kısa Manifest müzikleri">
    <span aria-hidden="true">♫</span>
    <div><strong>Manifest ritimleri</strong><small>{manifestTracks.length} şarkı ve remiks · Kısa, videosuz kesitler</small></div>
    <select aria-label="Kısa şarkı seç" value={track} onChange={event => { stopManifestAudio(); setTrack(event.target.value as ManifestTrack); }}>
      {manifestTracks.map(track => <option key={track.id} value={track.id}>{track.title}</option>)}
    </select>
    <button className="secondary" disabled={paused} onClick={() => { enable(); void playManifestTrack(track); }}>12 saniye dinle</button>
    <button className="primary shuffle-button" disabled={paused} aria-pressed={playback.shuffling}
      onClick={() => { enable(); void startManifestShuffle(); }}>Rastgele çal</button>
    <label className="manifest-volume">Ses düzeyi
      <input type="range" min="5" max="80" value={Math.round(playback.volume * 100)}
        onChange={event => setManifestVolume(Number(event.target.value) / 100)} />
    </label>
    <button className="text-button" onClick={stopManifestAudio} disabled={!playback.playing && !playback.shuffling}>Sesi durdur</button>
    {playback.playing && <small aria-live="polite">Çalıyor: {playback.playing}</small>}
    {playback.shuffling && <small>12 saniyelik kesitler aralarda kısa sessizlikle karışık çalar.</small>}
    {mode !== "music" && <small>Dinle veya Rastgele çal düğmesi müziği açar.</small>}
    {playback.error && <p role="alert">{playback.error}</p>}
  </section>;
}
