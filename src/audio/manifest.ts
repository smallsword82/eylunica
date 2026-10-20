import { manifestTracks, type ManifestTrack } from "./manifest-catalog";
export { manifestTracks, type ManifestTrack } from "./manifest-catalog";
export const effectSeconds = { correct: 1.6, retry: 1.1, star: 2.2, record: 3, complete: 3.5 };
let active: HTMLAudioElement | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let error = "";
let playing = "";
let generation = 0;
let mode = "silent";
let shuffling = false;
let volume = 0.35;
let lastTrack: ManifestTrack | undefined;
let bag: ManifestTrack[] = [];
const listeners = new Set<() => void>();
export const getManifestPlayback = () => ({ playing, error, shuffling, volume });
export function subscribeManifestPlayback(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function notify() { listeners.forEach(listener => listener()); }
function clearCurrent() {
  generation++;
  clearTimeout(timer);
  if (active) {
    active.onended = null;
    active.onerror = null;
    active.pause();
    active = null;
  }
  playing = "";
}
export function stopManifestAudio() {
  shuffling = false;
  clearCurrent();
  notify();
}
export function setManifestMode(value: string) {
  mode = value;
  stopManifestAudio();
}
export function setManifestVolume(value: number) {
  if (!Number.isFinite(value)) return;
  volume = Math.min(0.8, Math.max(0.05, value));
  if (active) active.volume = volume;
  notify();
}
export function takeRandomTrack(): ManifestTrack {
  if (!bag.length) {
    bag = manifestTracks.map(track => track.id);
    for (let index = bag.length - 1; index > 0; index--) {
      const selected = Math.floor(Math.random() * (index + 1));
      [bag[index], bag[selected]] = [bag[selected], bag[index]];
    }
    if (bag.at(-1) === lastTrack) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
  }
  lastTrack = bag.pop()!;
  return lastTrack;
}
function finish(ticket: number) {
  if (ticket !== generation) return;
  clearCurrent();
  notify();
  if (shuffling) {
    const nextTicket = generation;
    timer = setTimeout(() => {
      if (nextTicket === generation && shuffling && mode === "music" && !document.hidden) void playNext();
    }, 2500);
  }
}
async function playClip(file: string, seconds: number, level: number, label: string) {
  clearCurrent();
  error = "";
  if (mode === "silent" || document.hidden) { shuffling = false; notify(); return; }
  const ticket = generation;
  try {
    const audio = new Audio(`${import.meta.env.BASE_URL}manifest/audio/${file}.mp3`);
    active = audio;
    audio.volume = level;
    audio.loop = false;
    const fail = () => {
      if (ticket !== generation) return;
      stopManifestAudio();
      error = "Ses açılamadı. Dinle düğmesine tekrar basabilir veya cihazının medya sesini kontrol edebilirsin.";
      notify();
    };
    audio.onerror = fail;
    audio.onended = () => finish(ticket);
    await audio.play();
    if (ticket !== generation) return;
    playing = label;
    notify();
    timer = setTimeout(() => finish(ticket), seconds * 1000);
  } catch {
    if (ticket === generation) {
      stopManifestAudio();
      error = "Ses başlatılamadı. Dinle düğmesine tekrar bas ve cihazının medya sesini kontrol et.";
      notify();
    }
  }
}
async function playNext() {
  const trackId = takeRandomTrack();
  const selected = manifestTracks.find(track => track.id === trackId)!;
  await playClip(selected.id, selected.seconds, volume, selected.title);
}
export async function startManifestShuffle() {
  stopManifestAudio();
  if (mode !== "music" || document.hidden) return;
  shuffling = true;
  await playNext();
}
export async function playManifestEffect(effect: keyof typeof effectSeconds) {
  await playClip(takeRandomTrack(), effectSeconds[effect], Math.min(0.5, volume), "Kısa Manifest efekti");
}
export async function playManifestTrack(track: ManifestTrack, level = volume) {
  if (mode !== "music") return;
  const selected = manifestTracks.find(item => item.id === track);
  if (!selected) return;
  stopManifestAudio();
  lastTrack = track;
  await playClip(selected.id, selected.seconds, Math.min(0.8, Math.max(0.05, level)), selected.title);
}
