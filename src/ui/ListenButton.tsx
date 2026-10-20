import { useEffect, useSyncExternalStore } from "react";
import { getNarration, hasNarration, playNarration, stopNarration, subscribeNarration } from "../audio/narration";

export function ListenButton({ text, label = "Yönergeyi dinle", onRequest }: {
  text: string; label?: string; onRequest?: () => void;
}) {
  const playback = useSyncExternalStore(subscribeNarration, getNarration, getNarration);
  const playing = playback.text === text && playback.playing;
  useEffect(() => () => {
    if (getNarration().text === text) stopNarration();
  }, [text]);
  if (!hasNarration(text)) return null;
  return <div className="listen-control">
    <button type="button" className="listen-button" aria-pressed={playing} onClick={() => {
      if (playing) stopNarration();
      else { onRequest?.(); void playNarration(text); }
    }}>{playing ? "Dinlemeyi durdur" : label}</button>
    {playback.text === text && playback.error && <p aria-live="polite">{playback.error}</p>}
  </div>;
}

export function NarrationPlayback() {
  const playback = useSyncExternalStore(subscribeNarration, getNarration, getNarration);
  if (!playback.playing && !playback.error) return null;
  return <div className="narration-playback" aria-live="polite">
    {playback.playing ? <><span>Seslendirme çalıyor</span> <button className="text-button" onClick={stopNarration}>Tüm konuşmayı durdur</button></> : <span>{playback.error}</span>}
  </div>;
}
