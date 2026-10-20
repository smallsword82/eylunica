import { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { App as NativeApp } from "@capacitor/app";
import {
  acknowledge,
  dateKey,
  addUsage,
  dueReminder,
  freshWellbeing,
  limitReached,
  type Reminder,
  type TimeSettings,
  type UsageDomain,
  type WellbeingState,
} from "../time-engine";
import { loadWellbeing, saveWellbeing } from "./storage";
export type Notice = Reminder | "paused" | "limit";
export function useWellbeing(enabled: boolean) {
  const [state, setState] = useState(freshWellbeing),
    [loaded, setLoaded] = useState(false),
    [notice, setNoticeState] = useState<Notice | null>(null),
    [error, setError] = useState(""),
    [now, setNow] = useState(Date.now);
  const current = useRef(state),
    isLoaded = useRef(false),
    isEnabled = useRef(enabled),
    noticeRef = useRef<Notice | null>(null),
    noticeDay = useRef<string | null>(null),
    context = useRef<{ domain: UsageDomain | null; playing: boolean }>({
      domain: "other",
      playing: false,
    });
  const foreground = useRef(
      !document.hidden &&
        (Capacitor.isNativePlatform() ? false : document.hasFocus()),
    ),
    nativeActive = useRef(false),
    webFocused = useRef(document.hasFocus());
  const clock = useRef({ mono: performance.now(), wall: Date.now() }),
    pending = useRef<{ action: () => void; startsTask: boolean } | null>(null),
    nativeWrites = useRef(Promise.resolve());
  isEnabled.current = enabled;
  const setNotice = useCallback((n: Notice | null) => {
    noticeRef.current = n;
    noticeDay.current =
      n === "goal" || n === "break" ? dateKey(Date.now()) : null;
    setNoticeState(n);
    clock.current = { mono: performance.now(), wall: Date.now() };
  }, []);
  const commit = useCallback((s: WellbeingState, persist = true) => {
    current.current = s;
    setState(s);
    if (persist) {
      const fail = () =>
        setError(
          "Süre ve ebeveyn ayarları kaydedilemedi. Cihazının depolama iznini kontrol et.",
        );
      if (Capacitor.isNativePlatform())
        nativeWrites.current = nativeWrites.current
          .then(() => saveWellbeing(s))
          .catch(fail);
      else void saveWellbeing(s).catch(fail);
    }
  }, []);
  const flush = useCallback(() => {
    const end = Date.now(),
      mono = performance.now(),
      elapsed = Math.max(0, mono - clock.current.mono);
    const c = context.current;
    const active =
      isLoaded.current &&
      isEnabled.current &&
      foreground.current &&
      !noticeRef.current &&
      c.domain !== null &&
      (!limitReached(current.current, end) || c.playing);
    clock.current = { mono, wall: end };
    setNow(end);
    if (active && c.domain && elapsed > 0)
      commit(addUsage(current.current, end, elapsed, c.domain));
    return current.current;
  }, [commit]);
  useEffect(() => {
    let cancelled = false;
    loadWellbeing()
      .then((s) => {
        if (!cancelled) {
          current.current = s;
          setState(s);
          isLoaded.current = true;
          setLoaded(true);
          clock.current = { mono: performance.now(), wall: Date.now() };
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Süre ayarları okunamadı. Bu oturumda varsayılan serbest kullanım açık; önceki kayıtların üzerine yazılmıyor.",
          );
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    const visible = () =>
      !document.hidden &&
      (Capacitor.isNativePlatform()
        ? nativeActive.current
        : webFocused.current);
    const visibility = () => {
      flush();
      foreground.current = visible();
    };
    const focus = () => {
      flush();
      webFocused.current = true;
      foreground.current = visible();
    };
    const blur = () => {
      flush();
      webFocused.current = false;
      foreground.current = visible();
    };
    const hide = () => {
      flush();
      foreground.current = false;
    };
    const show = () => {
      clock.current = { mono: performance.now(), wall: Date.now() };
      webFocused.current = document.hasFocus();
      foreground.current = visible();
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("focus", focus);
    window.addEventListener("blur", blur);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    let cancelled = false,
      removeNative: (() => void) | undefined;
    if (Capacitor.isNativePlatform()) {
      let observedNativeEvent = false;
      void NativeApp.addListener("appStateChange", ({ isActive }) => {
        if (cancelled) return;
        observedNativeEvent = true;
        flush();
        nativeActive.current = isActive;
        foreground.current = visible();
      })
        .then((h) => {
          if (cancelled) {
            void h.remove();
            return;
          }
          removeNative = () => {
            void h.remove();
          };
          // Never let a late initial query overwrite a newer pause/resume event.
          void NativeApp.getState()
            .then(({ isActive }) => {
              if (!cancelled && !observedNativeEvent) {
                flush();
                nativeActive.current = isActive;
                foreground.current = visible();
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          nativeActive.current = false;
          foreground.current = false;
          setError(
            "Android arka plan takibi başlatılamadı; süre sayacı güvenli biçimde durduruldu.",
          );
        });
    } else foreground.current = visible();
    const interval = window.setInterval(() => {
      flush();
      if (
        (noticeRef.current === "limit" &&
          !limitReached(current.current, Date.now())) ||
        ((noticeRef.current === "goal" || noticeRef.current === "break") &&
          noticeDay.current !== dateKey(Date.now()))
      ) {
        pending.current = null;
        setNotice(null);
      }
    }, 5000);
    return () => {
      flush();
      cancelled = true;
      removeNative?.();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("focus", focus);
      window.removeEventListener("blur", blur);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
    };
  }, [flush, setNotice]);
  const setContext = useCallback(
    (domain: UsageDomain | null, playing = false) => {
      flush();
      context.current = { domain, playing };
    },
    [flush],
  );
  const transition = useCallback(
    (action: () => void, startsTask = true) => {
      const s = flush();
      if (startsTask && limitReached(s, Date.now())) {
        pending.current = { action, startsTask };
        setNotice("limit");
        return;
      }
      const reminder = dueReminder(s, Date.now());
      if (reminder) {
        pending.current = { action, startsTask };
        setNotice(reminder);
        return;
      }
      action();
    },
    [flush, setNotice],
  );
  const resume = useCallback(() => {
    flush();
    const n = noticeRef.current;
    if (
      (n === "goal" || n === "break") &&
      noticeDay.current === dateKey(Date.now())
    )
      commit(acknowledge(current.current, Date.now(), n));
    const next = pending.current;
    pending.current = null;
    setNotice(null);
    if (next) {
      if (next.startsTask && limitReached(current.current, Date.now())) {
        pending.current = next;
        setNotice("limit");
      } else next.action();
    }
  }, [flush, commit, setNotice]);
  const pause = useCallback(() => {
    flush();
    const n = noticeRef.current;
    if (
      (n === "goal" || n === "break") &&
      noticeDay.current === dateKey(Date.now())
    )
      commit(acknowledge(current.current, Date.now(), n));
    setNotice("paused");
  }, [flush, commit, setNotice]);
  const dismiss = useCallback(() => {
    flush();
    pending.current = null;
    setNotice(null);
  }, [flush, setNotice]);
  const settings = useCallback(
    (value: TimeSettings) => {
      if (!isLoaded.current) return;
      const s = flush();
      if (
        value.dailyLimitMinutes !== null &&
        (!Number.isInteger(value.dailyLimitMinutes) ||
          value.dailyLimitMinutes < 1 ||
          value.dailyLimitMinutes > 1440)
      )
        return;
      commit({ ...s, settings: value });
    },
    [flush, commit],
  );
  return {
    state,
    loaded,
    canConfigure: isLoaded.current,
    notice,
    error,
    now,
    transition,
    setContext,
    resume,
    pause,
    dismiss,
    settings,
  };
}
export type Wellbeing = ReturnType<typeof useWellbeing>;
