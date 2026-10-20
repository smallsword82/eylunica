import { it, expect, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { freshWellbeing, MINUTE, addUsage } from "../time-engine";
import { loadWellbeing, saveWellbeing, WELLBEING_KEY } from "./storage";
vi.mock("@capacitor/preferences", () => ({
  Preferences: { get: vi.fn(), set: vi.fn() },
}));
it("süre ayarları ve kullanım yerelde geri gelir; matematik kaydına dokunmaz", async () => {
  localStorage.setItem("ritma-progress-v1", "existing-progress");
  let s = addUsage(freshWellbeing(), Date.now(), MINUTE, "reading");
  s.settings.dailyLimitMinutes = 30;
  await saveWellbeing(s);
  expect(await loadWellbeing()).toEqual(s);
  expect(localStorage.getItem("ritma-progress-v1")).toBe("existing-progress");
});
it("Android Preferences aynı ayar anahtarını kullanır", async () => {
  const native = vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
  try {
    const s = freshWellbeing();
    s.settings.breakReminders = false;
    vi.mocked(Preferences.get).mockResolvedValue({ value: JSON.stringify(s) });
    vi.mocked(Preferences.set).mockResolvedValue();
    await saveWellbeing(s);
    expect(Preferences.set).toHaveBeenCalledWith({
      key: WELLBEING_KEY,
      value: JSON.stringify(s),
    });
    expect(await loadWellbeing()).toEqual(s);
  } finally {
    native.mockRestore();
  }
});
