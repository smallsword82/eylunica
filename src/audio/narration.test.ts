import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { narrationTexts } from "./narration-texts";
import { getNarration, playNarration, stopNarration, setAutomaticNarration, narrateFeedback, loadNarrationPreference, saveNarrationPreference, NARRATION_KEY } from "./narration";
vi.mock("@capacitor/preferences", () => ({ Preferences: { get: vi.fn(), set: vi.fn() } }));
class MockAudio {
  static instances: MockAudio[] = [];
  pause = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  volume = 1;
  constructor(public src: string) { MockAudio.instances.push(this); }
}
beforeEach(() => {
  MockAudio.instances = [];
  vi.stubGlobal("Audio", MockAudio);
  setAutomaticNarration(false);
});
afterEach(() => { stopNarration(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it("yalnızca gömülü metni oynatır; yeni ses önceki sesi durdurur", async () => {
  expect(await playNarration("Bilinmeyen veya çocuğun özel adı")).toBe(false);
  expect(await playNarration("toString")).toBe(false);
  expect(MockAudio.instances).toHaveLength(0);
  expect(await playNarration(narrationTexts.math)).toBe(true);
  const first = MockAudio.instances[0];
  expect(first.src).toMatch(/\/narration\/tr-[a-f0-9]+\.mp3$/);
  await playNarration(narrationTexts.reading);
  expect(first.pause).toHaveBeenCalledOnce();
  expect(getNarration().text).toBe(narrationTexts.reading);
  MockAudio.instances[1].onended!();
  expect(getNarration().playing).toBe(false);
});
it("otomatik ses kapalıdır, etkinleştirilince çalar ve kapatılınca kesilir", async () => {
  narrateFeedback("correct");
  expect(MockAudio.instances).toHaveLength(0);
  setAutomaticNarration(true);
  narrateFeedback("correct");
  await Promise.resolve();
  expect(getNarration().playing).toBe(true);
  setAutomaticNarration(false);
  expect(MockAudio.instances[0].pause).toHaveBeenCalledOnce();
});
it("geciken oynatma durdurulduğunda tekrar başlamaz", async () => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  class DelayedAudio extends MockAudio { play = vi.fn().mockReturnValue(pending); }
  vi.stubGlobal("Audio", DelayedAudio);
  const start = playNarration(narrationTexts.math);
  stopNarration();
  release();
  expect(await start).toBe(false);
  expect(getNarration().playing).toBe(false);
});
it("oynatma ve dosya hatalarını görünür kılar; gizliyken başlamaz", async () => {
  class FailedAudio extends MockAudio { play = vi.fn().mockRejectedValue(new Error("blocked")); }
  vi.stubGlobal("Audio", FailedAudio);
  expect(await playNarration(narrationTexts.math)).toBe(false);
  expect(getNarration().error).toContain("Ses açılamadı");
  vi.stubGlobal("Audio", MockAudio);
  await playNarration(narrationTexts.math);
  MockAudio.instances.at(-1)!.onerror!();
  expect(getNarration().playing).toBe(false);
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  expect(await playNarration(narrationTexts.math)).toBe(false);
});
it("konuşma tercihi webde ve Androidde ayrı cihaz kaydında saklanır", async () => {
  expect(await loadNarrationPreference()).toBe(false);
  await saveNarrationPreference(true);
  expect(await loadNarrationPreference()).toBe(true);
  localStorage.setItem(NARRATION_KEY, "invalid");
  expect(await loadNarrationPreference()).toBe(false);
  vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
  vi.mocked(Preferences.get).mockResolvedValue({ value: "on" });
  await saveNarrationPreference(true);
  expect(Preferences.set).toHaveBeenCalledWith({ key: NARRATION_KEY, value: "on" });
  expect(await loadNarrationPreference()).toBe(true);
});
