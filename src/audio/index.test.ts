import { afterEach, expect, it, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { AUDIO_KEY, enableEffects, loadAudio, saveAudio, playEffect, stopEffects } from ".";
vi.mock("@capacitor/preferences", () => ({ Preferences: { get: vi.fn(), set: vi.fn() } }));
afterEach(() => { enableEffects(false); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it("ilk açılışta sessizdir, web seçimi kalıcıdır ve bozuk kayıt kapalı kalır", async () => {
  expect(await loadAudio()).toBe(false);
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
it("ses desteği olmasa da oyun akışını durdurmaz", async () => {
  enableEffects(true);
  vi.stubGlobal("AudioContext", undefined);
  await expect(playEffect("retry")).resolves.toBeUndefined();
});
it("kapalıyken ses oluşturmaz; açıkken kısa ses çalar, kapatınca durdurur", async () => {
  const oscillators: Array<{start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>}> = [];
  class FakeContext {
    state = "running";
    currentTime = 0;
    destination = {};
    createOscillator() {
      const oscillator = { frequency: { value: 0 }, connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null };
      oscillators.push(oscillator);
      return oscillator;
    }
    createGain() { return { gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn() }; }
  }
  vi.stubGlobal("AudioContext", FakeContext);
  enableEffects(false);
  await playEffect("star");
  expect(oscillators).toHaveLength(0);
  enableEffects(true);
  await playEffect("complete");
  expect(oscillators).toHaveLength(4);
  expect(oscillators[3].stop).toHaveBeenCalledWith(0.41000000000000003);
  enableEffects(false);
  expect(oscillators[0].stop).toHaveBeenCalledTimes(2);
  stopEffects();
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
  enableEffects(true);
  await playEffect("star");
  expect(oscillators).toHaveLength(4);
});
