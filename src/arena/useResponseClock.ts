import { useEffect, useLayoutEffect, useRef } from "react";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { App as NativeApp } from "@capacitor/app";
import { ResponseClock } from "./response-clock";
export function useResponseClock(token: string, blocked: boolean) {
  const clock = useRef(new ResponseClock());
  const paused = useRef(blocked);
  const nativeActive = useRef(!Capacitor.isNativePlatform());
  const focused = useRef(document.hasFocus());
  const previousToken = useRef<string | null>(null);
  const active = () => !paused.current && !document.hidden && (Capacitor.isNativePlatform() ? nativeActive.current : focused.current);
  useLayoutEffect(() => {
    paused.current = blocked;
    if (previousToken.current !== token) {
      previousToken.current = token;
      clock.current.reset(performance.now(), active());
    } else clock.current.update(performance.now(), active());
  }, [token, blocked]);
  useEffect(() => {
    let disposed = false, revision = 0;
    let handle: PluginListenerHandle | undefined;
    const sync = () => clock.current.update(performance.now(), active());
    const focus = () => { focused.current = true; sync(); };
    const blur = () => { focused.current = false; sync(); };
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", focus);
    window.addEventListener("blur", blur);
    if (Capacitor.isNativePlatform()) {
      void NativeApp.addListener("appStateChange", ({ isActive }) => {
        revision++; nativeActive.current = isActive; sync();
      }).then(h => { if (disposed) void h.remove(); else handle = h; }).catch(() => { nativeActive.current = false; sync(); });
      const initialRevision = revision;
      void NativeApp.getState().then(({ isActive }) => {
        if (!disposed && revision === initialRevision) { nativeActive.current = isActive; sync(); }
      }).catch(() => { if (!disposed) { nativeActive.current = false; sync(); } });
    }
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", focus);
      window.removeEventListener("blur", blur);
      void handle?.remove();
    };
  }, []);
  return { read: () => {
    clock.current.update(performance.now(), active());
    return clock.current.read(performance.now());
  } };
}
