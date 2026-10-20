import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { AUDIO_KEY, enableEffects, loadAudio, saveAudio, playEffect, playAnswerEffect, playCompletionEffect, answerSoundSeconds, stopEffects, stopActivitySound, setSoundMode } from ".";
import { effectSeconds, playManifestTrack, getManifestPlayback, manifestTracks, startManifestShuffle, takeRandomTrack, prepareManifestAudio } from "./manifest";
vi.mock("@capacitor/preferences", () => ({ Preferences: { get: vi.fn(), set: vi.fn() } }));
const clips: FakeAudio[] = [];
class FakeAudio {
  volume = 1;
  loop = false;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();
  load = vi.fn();
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
  expect(await loadSoundMode()).toBe("music");
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
it("cevap yalnız kısa sözsüz efekttir; sessiz modda çalmaz ve kısa sürede durur", async () => {
  vi.useFakeTimers();
  setSoundMode("effects");
  await playAnswerEffect();
  expect(clips.at(-1)!.src).toBe("/manifest/audio/answer-tick.wav");
  const audio = clips.at(-1)!;
  await vi.advanceTimersByTimeAsync(answerSoundSeconds * 1000);
  expect(audio.pause).toHaveBeenCalled();
  const count = clips.length;
  setSoundMode("silent");
  await playAnswerEffect();
  expect(clips).toHaveLength(count);
});
it("sesleri önceden yükler ve cevap tıklamasında hazır oynatıcıyı beklemeden başlatır", async () => {
  setSoundMode("music");
  prepareManifestAudio();
  const answer = clips.find(clip => clip.src.endsWith("/ajda-manifest.mp3"))!;
  expect(answer.load).toHaveBeenCalledOnce();
  expect(answer.play).not.toHaveBeenCalled();
  const count = clips.length;
  const playback = playCompletionEffect();
  expect(answer.play).toHaveBeenCalledOnce();
  await playback;
  expect(clips).toHaveLength(count);
  await playManifestTrack("ariyo");
  expect(clips).toHaveLength(count);
});
it("doğru ve yanlış yanıtta farklı sözsüz efekt kullanır", async () => {
  setSoundMode("effects");
  await playAnswerEffect(false);
  expect(clips.at(-1)!.src).toBe("/manifest/audio/answer-retry.wav");
  await playAnswerEffect(true);
  expect(clips.at(-1)!.src).toBe("/manifest/audio/answer-tick.wav");
});
it("hızlı bölüm geçişi bitiş sesini kesmez; sessiz ve mola keser", async () => {
  setSoundMode("music");
  await playCompletionEffect();
  const answer = clips.at(-1)!;
  stopActivitySound();
  await playEffect("complete");
  expect(answer.pause).not.toHaveBeenCalled();
  expect(getManifestPlayback().answering).toBe(true);
  stopEffects();
  expect(answer.pause).toHaveBeenCalledOnce();
  expect(getManifestPlayback().answering).toBe(false);
});
it("beş efekt gerçek yerel kesitleri çalar ve süre sınırında durur", async () => {
  vi.useFakeTimers();
  setSoundMode("effects");
  for (const effect of ["correct", "retry", "star", "record", "complete"] as const) {
    await playEffect(effect);
    const audio = clips.at(-1)!;
    expect(manifestTracks.some(track => audio.src === `/manifest/audio/${track.id}.mp3`)).toBe(true);
    expect(audio.loop).toBe(false);
    expect(audio.volume).toBe(0.35);
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
  expect(audio.volume).toBe(0.35);
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
  setSoundMode("silent");
  setSoundMode("music");
  vi.stubGlobal("Audio", class { constructor() { throw new Error("Unavailable"); } });
  await expect(playEffect("retry")).resolves.toBeUndefined();
  expect(getManifestPlayback().error).toContain("Ses başlatılamadı");
});

it("rastgele sıra her şarkıyı tüketmeden yeniden torba kurmaz ve hemen tekrar etmez", async () => {
  const { takeRandomTrack, manifestTracks } = await import("./manifest");
  const history = Array.from({ length: manifestTracks.length * 3 }, () => takeRandomTrack());
  expect(new Set(history).size).toBe(manifestTracks.length);
  history.slice(1).forEach((track, index) => expect(track).not.toBe(history[index]));
  let foundCycle = false;
  for (let offset = 0; offset < manifestTracks.length; offset++)
    if (new Set(history.slice(offset, offset + manifestTracks.length)).size === manifestTracks.length) foundCycle = true;
  expect(foundCycle).toBe(true);
});
it("karışık oynatma 12 saniye ve kısa arayla sonraki şarkıya geçer; durdurma sırayı iptal eder", async () => {
  vi.useFakeTimers();
  setSoundMode("music");
  await startManifestShuffle();
  const first = clips.at(-1)!;
  expect(getManifestPlayback().shuffling).toBe(true);
  await vi.advanceTimersByTimeAsync(14500);
  expect(clips.at(-1)!.src).not.toBe(first.src);
  const count = clips.length;
  stopEffects();
  await vi.advanceTimersByTimeAsync(30000);
  expect(clips).toHaveLength(count);
  expect(getManifestPlayback().shuffling).toBe(false);
});
