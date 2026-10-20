import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { AUDIO_KEY, enableEffects, loadAudio, saveAudio, playEffect, stopEffects, setSoundMode } from ".";
import { effectSeconds, playManifestTrack, getManifestPlayback } from "./manifest";
vi.mock("@capacitor/preferences", () => ({ Preferences: { get: vi.fn(), set: vi.fn() } }));
const clips: FakeAudio[] = [];
class FakeAudio {
  volume = 1;
  loop = false;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  constructor(public src: string) { clips.push(this); }
}
beforeEach(() => { clips.length = 0; vi.stubGlobal("Audio", FakeAudio); });
afterEach(() => { enableEffects(false); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });
it("ilk açılışta efektler açıktır, web seçimi kalıcıdır ve bozuk kayıt kapalı kalır", async () => {
  expect(await loadAudio()).toBe(true);
  await saveAudio(true);
  expect(await loadAudio()).toBe(true);
  await saveAudio(false);
  expect(await loadAudio()).toBe(false);
  localStorage.setItem(AUDIO_KEY, "bad");
  expect(await loadAudio()).toBe(false);
});
it("Android ses tercihini cihaz Preferences kaydına yazar", async () => {
  vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
  vi.mocked(Preferences.get).mockResolvedValue({ value: "on" });
  await saveAudio(true);
  expect(Preferences.set).toHaveBeenCalledWith({ key: AUDIO_KEY, value: "on" });
  expect(await loadAudio()).toBe(true);
});
it("üç ses modu eski on/off ayarlarını koruyarak cihazda saklanır", async () => {
  const { loadSoundMode, saveSoundMode } = await import(".");
  expect(await loadSoundMode()).toBe("effects");
  await saveSoundMode("silent");
  expect(await loadSoundMode()).toBe("silent");
  localStorage.setItem(AUDIO_KEY, "on");
  expect(await loadSoundMode()).toBe("effects");
  localStorage.setItem(AUDIO_KEY, "off");
  expect(await loadSoundMode()).toBe("silent");
  await saveSoundMode("music");
  expect(await loadSoundMode()).toBe("music");
  vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
  vi.mocked(Preferences.get).mockResolvedValue({ value: "effects" });
  expect(await loadSoundMode()).toBe("effects");
  await saveSoundMode("music");
  expect(Preferences.set).toHaveBeenCalledWith({ key: AUDIO_KEY, value: "music" });
});
it("sessizken ve arka plandayken ses oluşturmaz", async () => {
  enableEffects(false);
  await playEffect("star");
  expect(clips).toHaveLength(0);
  enableEffects(true);
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
  await playEffect("correct");
  expect(clips).toHaveLength(0);
});
it("beş efekt gerçek yerel kesitleri çalar ve süre sınırında durur", async () => {
  vi.useFakeTimers();
  setSoundMode("effects");
  for (const effect of ["correct", "retry", "star", "record", "complete"] as const) {
    await playEffect(effect);
    const audio = clips.at(-1)!;
    expect(audio.src).toBe(`/manifest/audio/${effect}.mp3`);
    expect(audio.loop).toBe(false);
    expect(audio.volume).toBe(0.3);
    await vi.advanceTimersByTimeAsync(effectSeconds[effect] * 1000);
    expect(audio.pause).toHaveBeenCalled();
    expect(getManifestPlayback().playing).toBe("");
  }
});
it("arka plan kesiti yalnız müzik modunda 12 saniye düşük sesle çalar; sessiz mod keser", async () => {
  vi.useFakeTimers();
  setSoundMode("effects");
  await playManifestTrack("ariyo");
  expect(clips).toHaveLength(0);
  setSoundMode("music");
  await playManifestTrack("ariyo");
  const audio = clips.at(-1)!;
  expect(audio.src).toBe("/manifest/audio/ariyo.mp3");
  expect(audio.volume).toBe(0.12);
  await vi.advanceTimersByTimeAsync(12000);
  expect(audio.pause).toHaveBeenCalled();
  await playManifestTrack("zamansizdik");
  setSoundMode("silent");
  expect(clips.at(-1)!.pause).toHaveBeenCalled();
});
it("konuşma ve ekran geçişinde kullanılan durdurma tüm kesitleri keser; ses hatası oyunu durdurmaz", async () => {
  setSoundMode("music");
  await playManifestTrack("zamansizdik");
  stopEffects();
  expect(clips[0].pause).toHaveBeenCalled();
  vi.stubGlobal("Audio", class { constructor() { throw new Error("Unavailable"); } });
  await expect(playEffect("retry")).resolves.toBeUndefined();
  expect(getManifestPlayback().error).toContain("Ses başlatılamadı");
});
