import { getManifestPlayback, playManifestAnswer, playManifestCompletion, playManifestEffect, setManifestMode, stopManifestAudio } from "./manifest";
export { answerSoundSeconds, completionSoundSeconds } from "./manifest";
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
export async function loadAudio(): Promise<boolean> {
  return (await loadSoundMode()) !== "silent";
}
export async function loadSoundMode(): Promise<SoundMode> {
  const raw = Capacitor.isNativePlatform()
    ? (await Preferences.get({ key: AUDIO_KEY })).value
    : localStorage.getItem(AUDIO_KEY);
  return raw === null || raw === "music" ? "music" : raw === "on" || raw === "effects" ? "effects" : "silent";
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
export function stopEffects() { stopManifestAudio(); }
export function stopActivitySound() {
  const playback = getManifestPlayback();
  if (!playback.shuffling && !playback.answering) stopManifestAudio();
}
export function enableEffects(value: boolean) { setSoundMode(value ? "effects" : "silent"); }
export function setSoundMode(value: SoundMode) {
  mode = value;
  setManifestMode(value);
  modeListeners.forEach(listener => listener());
}
export async function playEffect(effect: Effect): Promise<void> {
  if (mode === "silent" || document.visibilityState === "hidden") return;
  await playManifestEffect(effect);
}
export async function playAnswerEffect(correct = true): Promise<void> {
  if (mode === "silent" || document.visibilityState === "hidden") return;
  await playManifestAnswer(correct);
}
export async function playCompletionEffect(): Promise<void> {
  if (mode === "silent" || document.visibilityState === "hidden") return;
  await playManifestCompletion();
}
