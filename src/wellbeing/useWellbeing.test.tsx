import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, it, expect, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import { App as NativeApp } from "@capacitor/app";
import { useWellbeing } from "./useWellbeing";
import { loadWellbeing, saveWellbeing } from "./storage";
import { MINUTE, dayTotal, freshWellbeing, todayUsage } from "../time-engine";
vi.mock("./storage", () => ({
  loadWellbeing: vi.fn(),
  saveWellbeing: vi.fn(),
}));
vi.mock("@capacitor/app", () => ({
  App: { addListener: vi.fn(), getState: vi.fn() },
}));
beforeEach(() => {
  vi.useFakeTimers({
    toFake: ["Date", "performance", "setInterval", "clearInterval"],
  });
  vi.setSystemTime(new Date(2026, 9, 20, 12));
  vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(false);
  vi.spyOn(document, "hasFocus").mockReturnValue(true);
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.mocked(loadWellbeing).mockResolvedValue(freshWellbeing());
  vi.mocked(saveWellbeing).mockResolvedValue();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
async function open() {
  const h = renderHook(() => useWellbeing(true));
  await act(async () => {});
  act(() => h.result.current.setContext("math", true));
  return h;
}
const advance = async (ms: number) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
};
const total = (h: Awaited<ReturnType<typeof open>>) =>
  dayTotal(todayUsage(h.result.current.state, Date.now()));
it("15 dakikada soruyu kesmez; yalnız geçişte mesaj açar, devam ettirir", async () => {
  const h = await open(),
    next = vi.fn();
  await advance(15 * MINUTE);
  expect(h.result.current.notice).toBeNull();
  act(() => h.result.current.transition(next));
  expect(next).not.toHaveBeenCalled();
  expect(h.result.current.notice).toBe("goal");
  act(() => h.result.current.resume());
  expect(next).toHaveBeenCalledOnce();
  expect(h.result.current.state.days["2026-10-20"].goalAcknowledged).toBe(true);
});
it("arka plan, odak dışı ve mola sürelerini saymaz; kaldığı yerden devam eder", async () => {
  const h = await open();
  await advance(MINUTE);
  act(() => window.dispatchEvent(new Event("blur")));
  await advance(20 * MINUTE);
  expect(total(h)).toBe(MINUTE);
  act(() => window.dispatchEvent(new Event("focus")));
  await advance(MINUTE);
  expect(total(h)).toBe(2 * MINUTE);
  act(() => h.result.current.pause());
  await advance(10 * MINUTE);
  expect(total(h)).toBe(2 * MINUTE);
  act(() => h.result.current.resume());
  await advance(MINUTE);
  expect(total(h)).toBe(3 * MINUTE);
});
it("ebeveyn paneli sayılmaz; alan süreleri çift yazılmaz", async () => {
  const h = await open();
  await advance(MINUTE);
  act(() => h.result.current.setContext("reading", true));
  await advance(2 * MINUTE);
  act(() => h.result.current.setContext(null, false));
  await advance(5 * MINUTE);
  expect(total(h)).toBe(3 * MINUTE);
  expect(todayUsage(h.result.current.state, Date.now()).reading).toBe(
    2 * MINUTE,
  );
});
it("isteğe bağlı sınır soruyu kapatmaz, yeni soruyu engeller; sınır kaldırılınca açılır", async () => {
  const h = await open(),
    next = vi.fn();
  act(() =>
    h.result.current.settings({ dailyLimitMinutes: 1, breakReminders: true }),
  );
  await advance(2 * MINUTE);
  expect(total(h)).toBe(2 * MINUTE);
  expect(h.result.current.notice).toBeNull();
  act(() => h.result.current.transition(next));
  expect(h.result.current.notice).toBe("limit");
  expect(next).not.toHaveBeenCalled();
  act(() => h.result.current.dismiss());
  act(() =>
    h.result.current.settings({
      dailyLimitMinutes: null,
      breakReminders: true,
    }),
  );
  act(() => h.result.current.transition(next));
  expect(next).toHaveBeenCalledOnce();
});
it("duvar saati sıçraması veya kapalı uygulamadaki günler etkin süre yaratmaz", async () => {
  const h = await open();
  await advance(MINUTE);
  act(() => vi.setSystemTime(new Date(2026, 9, 22, 12)));
  await advance(MINUTE);
  expect(
    Object.values(h.result.current.state.days).reduce(
      (s, d) => s + dayTotal(d),
      0,
    ),
  ).toBe(2 * MINUTE);
  expect(total(h)).toBe(MINUTE);
});
it("gün değişince sınır ekranı çözülür ve günlük sayaç sıfırdan başlar", async () => {
  vi.setSystemTime(new Date(2026, 9, 20, 23, 58));
  const h = await open();
  act(() =>
    h.result.current.settings({ dailyLimitMinutes: 1, breakReminders: true }),
  );
  await advance(MINUTE);
  act(() => h.result.current.transition(vi.fn()));
  expect(h.result.current.notice).toBe("limit");
  await advance(MINUTE);
  expect(h.result.current.notice).toBeNull();
  expect(total(h)).toBe(0);
  await advance(MINUTE);
  expect(total(h)).toBe(MINUTE);
});
it("Android appStateChange arka planı durdurur ve listener temizlenir", async () => {
  vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
  let callback: (s: { isActive: boolean }) => void = () => {};
  const remove = vi.fn();
  vi.mocked(NativeApp.addListener).mockImplementation(
    async (_name, listener) => {
      callback = listener as unknown as typeof callback;
      return { remove };
    },
  );
  vi.mocked(NativeApp.getState).mockResolvedValue({ isActive: true });
  const h = await open();
  await advance(MINUTE);
  act(() => callback({ isActive: false }));
  await advance(25 * MINUTE);
  expect(total(h)).toBe(MINUTE);
  act(() => callback({ isActive: true }));
  await advance(MINUTE);
  expect(total(h)).toBe(2 * MINUTE);
  h.unmount();
  expect(remove).toHaveBeenCalledOnce();
});
it("gecikmiş Android başlangıç yanıtı yeni arka plan olayını ezmez", async () => {
  vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
  let callback: (s: { isActive: boolean }) => void = () => {},
    resolve: (s: { isActive: boolean }) => void = () => {};
  vi.mocked(NativeApp.addListener).mockImplementation(async (_n, l) => {
    callback = l as unknown as typeof callback;
    return { remove: vi.fn() };
  });
  vi.mocked(NativeApp.getState).mockReturnValue(
    new Promise((r) => {
      resolve = r;
    }),
  );
  const h = await open();
  act(() => callback({ isActive: false }));
  await act(async () => resolve({ isActive: true }));
  await advance(MINUTE);
  expect(total(h)).toBe(0);
});

it("sekme gizlenince son küçük aralığı saklar ve gizli süreyi eklemez", async () => {
  const h = await open();
  await advance(3000);
  act(() => {
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await advance(30 * MINUTE);
  expect(total(h)).toBe(3000);
  act(() => {
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await advance(5000);
  act(() => h.result.current.setContext("math", true)); // flush the fractional tail at a boundary
  expect(total(h)).toBe(8000);
});

it("önceki günün açık mesajı yeni günün hedefini tüketmez", async () => {
  vi.setSystemTime(new Date(2026, 9, 20, 23, 40));
  const h = await open();
  await advance(15 * MINUTE);
  act(() => h.result.current.transition(vi.fn()));
  expect(h.result.current.notice).toBe("goal");
  await advance(5 * MINUTE);
  expect(h.result.current.notice).toBeNull();
  expect(todayUsage(h.result.current.state, Date.now()).goalAcknowledged).toBe(
    false,
  );
  await advance(15 * MINUTE);
  act(() => h.result.current.transition(vi.fn()));
  expect(h.result.current.notice).toBe("goal");
});
