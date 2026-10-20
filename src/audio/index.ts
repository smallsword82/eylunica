import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

export const AUDIO_KEY = "ritma-audio-v1";
export type Effect = "correct" | "retry" | "star" | "record" | "complete";
export type SoundMode = "silent" | "effects" | "music";
let mode: SoundMode = "silent";
const modeListeners = new Set<() => void>();
export const getSoundMode = () => mode;
export function subscribeSoundMode(listener: () => void) {
  modeListeners.add(listener);
  return () => { modeListeners.delete(listener); };
}
let context: AudioContext | undefined;
let generation = 0;
const active = new Set<OscillatorNode>();
const isHidden = () => document.visibilityState === "hidden";

export async function loadAudio(): Promise<boolean> {
  return (await loadSoundMode()) !== "silent";
}
export async function loadSoundMode(): Promise<SoundMode> {
  const raw = Capacitor.isNativePlatform()
    ? (await Preferences.get({ key: AUDIO_KEY })).value
    : localStorage.getItem(AUDIO_KEY);
  return raw === "on" || raw === "effects" ? "effects" : raw === "music" ? "music" : "silent";
}
export async function saveSoundMode(value: SoundMode): Promise<void> {
  if (Capacitor.isNativePlatform()) await Preferences.set({ key: AUDIO_KEY, value });
  else localStorage.setItem(AUDIO_KEY, value);
}
export async function saveAudio(value: boolean): Promise<void> {
  if (Capacitor.isNativePlatform())
    await Preferences.set({ key: AUDIO_KEY, value: value ? "on" : "off" });
  else localStorage.setItem(AUDIO_KEY, value ? "on" : "off");
}
export function stopEffects() {
  generation++;
  for (const oscillator of active) {
    try { oscillator.stop(); } catch { /* Already ended. */ }
  }
  active.clear();
}
export function enableEffects(value: boolean) {
  setSoundMode(value ? "effects" : "silent");
}
export function setSoundMode(value: SoundMode) {
  mode = value;
  stopEffects();
  modeListeners.forEach(listener => listener());
}

// Original, short synthesized sounds: no downloads, microphone or speech service.
export async function playEffect(effect: Effect): Promise<void> {
  if (mode === "silent" || isHidden()) return;
  stopEffects();
  const ticket = generation;
  try {
    if (!window.AudioContext) return;
    context ??= new AudioContext();
    if (context.state === "suspended") await context.resume();
    if (getSoundMode() === "silent" || ticket !== generation || isHidden()) return;
    const notes = {
      correct: [523.25, 659.25],
      retry: [329.63],
      star: [783.99, 1046.5, 1318.51],
      record: [659.25, 783.99, 987.77, 1174.66, 1046.5],
      complete: [523.25, 783.99, 880, 659.25],
    }[effect];
    const music = mode === "music" && (effect === "record" || effect === "complete");
    const voices = notes.map((frequency, i) => ({ frequency, at: i * 0.09, wave: effect === "correct" || effect === "complete" ? "triangle" as OscillatorType : "sine" as OscillatorType, duration: 0.14, volume: 0.035 }));
    // Original electronic-pop transition stinger: a short bass/chord response.
    // No loop, background track, sample, or external recording is used.
    if (music) voices.push(
      { frequency: 130.81, at: 0, wave: "triangle", duration: 0.18, volume: 0.025 },
      { frequency: 196, at: 0.24, wave: "triangle", duration: 0.18, volume: 0.025 },
      ...[523.25, 659.25, 783.99].map(frequency => ({ frequency, at: 0.52, wave: "sine" as OscillatorType, duration: 0.28, volume: 0.018 })),
    );
    voices.forEach(({ frequency, at: offset, wave, duration, volume }) => {
      const oscillator = context!.createOscillator();
      const gain = context!.createGain();
      const at = context!.currentTime + offset;
      oscillator.type = wave;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(volume, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, at + duration - 0.01);
      oscillator.connect(gain);
      gain.connect(context!.destination);
      active.add(oscillator);
      oscillator.onended = () => {
        active.delete(oscillator);
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start(at);
      oscillator.stop(at + duration);
    });
  } catch {
    // Audio availability must never interrupt learning or saving progress.
    stopEffects();
  }
}
