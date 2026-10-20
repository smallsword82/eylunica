import { act, renderHook } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { App as NativeApp } from "@capacitor/app";
import { useNarration } from "./useNarration";
import { getNarration, playNarration } from "./narration";
import { narrationTexts } from "./narration-texts";
vi.mock("@capacitor/app", () => ({ App: { addListener: vi.fn() } }));
vi.mock("@capacitor/preferences", () => ({ Preferences: { get: vi.fn(), set: vi.fn() } }));
it("Android arka plan sinyali konuşmayı keser ve yaşam döngüsü dinleyicisini temizler", async () => {
  const pause = vi.fn(), remove = vi.fn();
  let callback!: (state: { isActive: boolean }) => void;
  vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
  vi.mocked(Preferences.get).mockResolvedValue({ value: "on" });
  vi.mocked(NativeApp.addListener).mockResolvedValue({ remove });
  vi.stubGlobal("Audio", class { pause = pause; play = vi.fn().mockResolvedValue(undefined); });
  const hook = renderHook(() => useNarration());
  try {
    await act(async () => {});
    callback = vi.mocked(NativeApp.addListener).mock.calls[0][1] as unknown as typeof callback;
    expect(hook.result.current.enabled).toBe(true);
    await act(async () => { await playNarration(narrationTexts.math); });
    expect(getNarration().playing).toBe(true);
    act(() => callback({ isActive: false }));
    expect(pause).toHaveBeenCalledOnce();
    expect(getNarration().playing).toBe(false);
    hook.unmount();
    expect(remove).toHaveBeenCalledOnce();
  } finally {
    hook.unmount();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  }
});
