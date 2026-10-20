import { useEffect, useState } from "react";
import { getSoundMode, subscribeSoundMode } from "../audio";
import { getManifestPlayback, manifestTracks, playManifestTrack, stopManifestAudio, subscribeManifestPlayback, type ManifestTrack } from "../audio/manifest";

export function ManifestAudioControls({ paused }: { paused: boolean }) {
  const [mode, setMode] = useState(getSoundMode());
  const [playback, setPlayback] = useState(getManifestPlayback);
  const [track, setTrack] = useState<ManifestTrack>("zamansizdik");
  useEffect(() => subscribeSoundMode(() => setMode(getSoundMode())), []);
  useEffect(() => subscribeManifestPlayback(() => setPlayback(getManifestPlayback())), []);
  return <section className="manifest-audio-bar" aria-label="Kısa Manifest müzikleri">
    <span aria-hidden="true">♫</span>
    <div><strong>Manifest ritimleri</strong><small>Efektler 1–3,5 sn · Müzik 12 sn · Video yok</small></div>
    <select aria-label="Kısa şarkı seç" value={track} onChange={event => { stopManifestAudio(); setTrack(event.target.value as ManifestTrack); }}>
      {manifestTracks.map(track => <option key={track.id} value={track.id}>{track.title}</option>)}
    </select>
    <button className="secondary" disabled={mode !== "music" || paused} onClick={() => void playManifestTrack(track)}>12 saniye dinle</button>
    <button className="text-button" onClick={stopManifestAudio} disabled={!playback.playing}>Sesi durdur</button>
    {mode !== "music" && <small>Kısa arka plan müziği için “Müzik ve Efektler”i seç.</small>}
    {playback.error && <p role="alert">{playback.error}</p>}
  </section>;
}
