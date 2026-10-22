import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { narrationManifest } from "./narration-manifest";
import { narrationTexts, type NarrationId } from "./narration-texts";
import { getSoundMode, stopEffects } from ".";

export const NARRATION_KEY = "ritma-narration-v1";
type Playback = { text: string; playing: boolean; error: string };
const idle: Playback = { text: "", playing: false, error: "" };
let playback = idle;
let current: HTMLAudioElement | null = null;
let generation = 0;
let automatic = false;
let pendingFeedback: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
export const getNarration = () => playback;
export function subscribeNarration(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function publish(value: Playback) {
  playback = value;
  listeners.forEach(listener => listener());
}
export function hasNarration(text: string): boolean {
  return Object.hasOwn(narrationManifest, text);
}
export function stopNarration() {
  clearTimeout(pendingFeedback);
  generation++;
  if (current) {
    current.onended = null;
    current.onerror = null;
    current.pause();
    current = null;
  }
  publish(idle);
}
export async function playNarration(text: string): Promise<boolean> {
 return playNarrationSequence([text]);
}
/** A short instruction can precede the question without overlapping voices. */
export async function playNarrationSequence(texts: string[]): Promise<boolean> {
  stopNarration();
  if (!texts.length||texts.some(text=>!hasNarration(text)) || document.hidden || getSoundMode() === "silent") return false;
  stopEffects();
  const ticket = generation;
  async function start(index:number):Promise<boolean>{
   const text=texts[index];
   if(ticket!==generation)return false;
   try {
    const audio = new Audio(`${import.meta.env.BASE_URL}narration/${narrationManifest[text].file}`);
    current = audio;
    audio.volume = 0.8;
    const fail = () => {
      if (ticket !== generation) return;
      stopNarration();
      publish({ text, playing: false, error: "Ses açılamadı. Metni okuyabilir veya yeniden dinlemeyi deneyebilirsin." });
    };
    audio.onended = () => { if (ticket === generation){if(index+1<texts.length)void start(index+1);else stopNarration();} };
    audio.onerror = fail;
    publish({ text, playing: true, error: "" });
    await audio.play();
    if (ticket !== generation) return false;
    return true;
  } catch {
    if (ticket === generation) {
      stopNarration();
      publish({ text, playing: false, error: "Ses açılamadı. Metni okuyabilir veya yeniden dinlemeyi deneyebilirsin." });
    }
    return false;
   }
  }
  return start(0);
}
export function setAutomaticNarration(value: boolean) {
  automatic = value;
  if (!value) stopNarration();
}
export function narrateFeedback(id: NarrationId, delayMs = 0) {
  clearTimeout(pendingFeedback);
  if (!automatic) return;
  if (delayMs > 0) {
    const ticket = generation;
    pendingFeedback = setTimeout(() => {
      if (automatic && ticket === generation) void playNarration(narrationTexts[id]);
    }, delayMs);
  } else void playNarration(narrationTexts[id]);
}
export async function loadNarrationPreference(): Promise<boolean> {
  const value = Capacitor.isNativePlatform()
    ? (await Preferences.get({ key: NARRATION_KEY })).value
    : localStorage.getItem(NARRATION_KEY);
  return value === "on";
}
export async function saveNarrationPreference(value: boolean) {
  if (Capacitor.isNativePlatform())
    await Preferences.set({ key: NARRATION_KEY, value: value ? "on" : "off" });
  else localStorage.setItem(NARRATION_KEY, value ? "on" : "off");
}

/** Lesson guidance is spoken by default, while an explicit off preference is honored. */
export async function loadLessonNarrationPreference(): Promise<boolean> {
 const value=Capacitor.isNativePlatform()?(await Preferences.get({key:NARRATION_KEY})).value:localStorage.getItem(NARRATION_KEY);
 return value!=="off";
}
