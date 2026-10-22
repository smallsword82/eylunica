import { enableEffects } from ".";
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { narrationTexts } from "./narration-texts";
import { getNarration, playNarration, playNarrationSequence, stopNarration, setAutomaticNarration, narrateFeedback, loadNarrationPreference, saveNarrationPreference, NARRATION_KEY } from "./narration";
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
  enableEffects(true);
});
afterEach(() => { enableEffects(false); stopNarration(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it("cevap kesitini konuşmayla kesmez; bekleyen konuşma ekran değişince iptal edilir", async () => {
  vi.useFakeTimers();
  try {
    setAutomaticNarration(true);
    narrateFeedback("correct", 1900);
    await vi.advanceTimersByTimeAsync(1800);
    expect(MockAudio.instances).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(100);
    expect(MockAudio.instances).toHaveLength(1);
    stopNarration();
    narrateFeedback("retry", 1900);
    stopNarration();
    await vi.advanceTimersByTimeAsync(2000);
    expect(MockAudio.instances).toHaveLength(1);
  } finally { vi.useRealTimers(); }
});
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
  enableEffects(true);
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

it("Sessiz modu manuel konuşmayı ve otomatik konuşmayı susturur", async () => {
  enableEffects(false);
  expect(await playNarration(narrationTexts.math)).toBe(false);
  setAutomaticNarration(true);
  narrateFeedback("correct");
  await Promise.resolve();
  expect(MockAudio.instances).toHaveLength(0);
});
it('lesson guidance defaults on but honors an explicit off without rewriting the preference',async()=>{
 const {loadLessonNarrationPreference}=await import('./narration');localStorage.removeItem(NARRATION_KEY);expect(await loadLessonNarrationPreference()).toBe(true);localStorage.setItem(NARRATION_KEY,'off');expect(await loadLessonNarrationPreference()).toBe(false);localStorage.setItem(NARRATION_KEY,'on');expect(await loadLessonNarrationPreference()).toBe(true);localStorage.removeItem(NARRATION_KEY);
});
it('finishes the instruction before reading the question and cancels the whole queue on navigation',async()=>{
 await playNarrationSequence([narrationTexts.math,narrationTexts.reading]);
 expect(MockAudio.instances).toHaveLength(1);const endInstruction=MockAudio.instances[0].onended!;
 endInstruction();await Promise.resolve();expect(MockAudio.instances).toHaveLength(2);expect(getNarration().text).toBe(narrationTexts.reading);
 const staleEnd=MockAudio.instances[1].onended!;stopNarration();staleEnd();await Promise.resolve();expect(MockAudio.instances).toHaveLength(2);expect(getNarration().playing).toBe(false);
 await playNarrationSequence([narrationTexts.math,narrationTexts.reading]);const staleInstructionEnd=MockAudio.instances[2].onended!;
 await playNarration(narrationTexts.math);staleInstructionEnd();await Promise.resolve();expect(MockAudio.instances).toHaveLength(4);expect(getNarration().text).toBe(narrationTexts.math);
});
