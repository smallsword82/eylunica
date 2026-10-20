import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

export const AUDIO_KEY = "ritma-audio-v1";
export type Effect = "correct" | "retry" | "star" | "complete";
let enabled = false;
let context: AudioContext | undefined;
let generation = 0;
const active = new Set<OscillatorNode>();
const isHidden = () => document.visibilityState === "hidden";

export async function loadAudio(): Promise<boolean> {
  const raw = Capacitor.isNativePlatform()
    ? (await Preferences.get({ key: AUDIO_KEY })).value
    : localStorage.getItem(AUDIO_KEY);
  return raw === "on";
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
  enabled = value;
  if (!value) stopEffects();
}

// Original, short synthesized sounds: no downloads, microphone or speech service.
export async function playEffect(effect: Effect): Promise<void> {
  if (!enabled || isHidden()) return;
  stopEffects();
  const ticket = generation;
  try {
    if (!window.AudioContext) return;
    context ??= new AudioContext();
    if (context.state === "suspended") await context.resume();
    if (!enabled || ticket !== generation || isHidden()) return;
    const notes = {
      correct: [523.25, 659.25],
      retry: [329.63],
      star: [523.25, 659.25, 783.99],
      complete: [523.25, 659.25, 783.99, 1046.5],
    }[effect];
    notes.forEach((frequency, i) => {
      const oscillator = context!.createOscillator();
      const gain = context!.createGain();
      const at = context!.currentTime + i * 0.09;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.045, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.13);
      oscillator.connect(gain);
      gain.connect(context!.destination);
      active.add(oscillator);
      oscillator.onended = () => {
        active.delete(oscillator);
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start(at);
      oscillator.stop(at + 0.14);
    });
  } catch {
    // Audio availability must never interrupt learning or saving progress.
    stopEffects();
  }
}
