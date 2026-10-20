import { useEffect, useRef, useState } from "react";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { App as NativeApp } from "@capacitor/app";
import { loadNarrationPreference, saveNarrationPreference, setAutomaticNarration, stopNarration } from "./narration";
import { getSoundMode, subscribeSoundMode } from ".";

export function useNarration() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    let mounted = true;
    let native: PluginListenerHandle | undefined;
    setAutomaticNarration(false);
    const unsubscribe = subscribeSoundMode(() => { if (getSoundMode() === "silent") stopNarration(); });
    loadNarrationPreference().then(value => {
      if (mounted) { setEnabled(value); setAutomaticNarration(value); }
    }).catch(() => { if (mounted) setError("Konuşma ayarı okunamadı; yeniden seçebilirsin."); })
      .finally(() => { if (mounted) setReady(true); });
    const stop = () => stopNarration();
    document.addEventListener("visibilitychange", stop);
    window.addEventListener("blur", stop);
    if (Capacitor.isNativePlatform()) {
      void NativeApp.addListener("appStateChange", ({ isActive }) => {
        if (!isActive) stopNarration();
      }).then(handle => {
        if (mounted) native = handle;
        else void handle.remove();
      }).catch(() => { /* Web visibility/blur handling remains available. */ });
    }
    return () => {
      mounted = false;
      setAutomaticNarration(false);
      unsubscribe();
      document.removeEventListener("visibilitychange", stop);
      window.removeEventListener("blur", stop);
      void native?.remove();
    };
  }, []);
  function change(value: boolean) {
    setEnabled(value);
    setAutomaticNarration(value);
    setError("");
    writes.current = writes.current.then(() => saveNarrationPreference(value))
      .catch(() => { setError("Konuşma ayarı kaydedilemedi. Seçimin bu oturumda geçerli."); });
  }
  return { enabled, ready, error, change };
}
