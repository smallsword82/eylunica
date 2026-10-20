export const manifestTracks = [
  { id: "zamansizdik", title: "Zamansızdık", seconds: 12 },
  { id: "ariyo", title: "Arıyo", seconds: 12 },
] as const;
export type ManifestTrack = typeof manifestTracks[number]["id"];
export const effectSeconds = { correct: 1.6, retry: 1.1, star: 2.2, record: 3, complete: 3.5 };
let active: HTMLAudioElement | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let error = "";
let playing = "";
let generation = 0;
let mode = "silent";
const listeners = new Set<() => void>();
export const getManifestPlayback = () => ({ playing, error });
export function subscribeManifestPlayback(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function notify() { listeners.forEach(listener => listener()); }
export function stopManifestAudio() {
  generation++;
  clearTimeout(timer);
  if (active) {
    active.onended = null;
    active.onerror = null;
    active.pause();
    active = null;
  }
  playing = "";
  notify();
}
export function setManifestMode(value: string) {
  mode = value;
  stopManifestAudio();
}
async function playClip(file: string, seconds: number, volume: number, label: string) {
  stopManifestAudio();
  if (mode === "silent" || document.hidden) return;
  const ticket = generation;
  error = "";
  try {
    const audio = new Audio(`${import.meta.env.BASE_URL}manifest/audio/${file}.mp3`);
    active = audio;
    audio.volume = volume;
    audio.loop = false;
    const fail = () => {
      if (ticket !== generation) return;
      stopManifestAudio();
      error = "Ses açılamadı. Yeniden dinle düğmesine basabilir veya sessiz devam edebilirsin.";
      notify();
    };
    audio.onerror = fail;
    audio.onended = () => { if (ticket === generation) stopManifestAudio(); };
    playing = label;
    notify();
    await audio.play();
    if (ticket !== generation) return;
    timer = setTimeout(() => { if (ticket === generation) stopManifestAudio(); }, seconds * 1000);
  } catch {
    if (ticket === generation) {
      stopManifestAudio();
      error = "Ses başlatılamadı. Dinle düğmesine tekrar basabilirsin.";
      notify();
    }
  }
}
export async function playManifestEffect(effect: keyof typeof effectSeconds) {
  await playClip(effect, effectSeconds[effect], 0.3, "Kısa Manifest efekti");
}
export async function playManifestTrack(track: ManifestTrack, volume = 0.12) {
  if (mode !== "music") return;
  const selected = manifestTracks.find(item => item.id === track)!;
  await playClip(selected.id, selected.seconds, Math.min(0.35, Math.max(0.02, volume)), selected.title);
}
