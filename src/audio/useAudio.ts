import { useEffect, useRef, useState } from "react";
import { setSoundMode, loadSoundMode, saveSoundMode, playEffect, stopEffects, type SoundMode } from ".";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { App as NativeApp } from "@capacitor/app";
import { prepareManifestAudio } from "./manifest";

export function useAudio() {
  const [mode, setMode] = useState<SoundMode>("silent");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    let mounted = true;
    let native: PluginListenerHandle | undefined;
    setSoundMode("silent");
    loadSoundMode().then(value => {
      if (mounted) {
        setMode(value); setSoundMode(value);
        if (value !== "silent") prepareManifestAudio();
      }
    }).catch(() => {
      if (mounted) setError("Ses ayarı okunamadı; sesi yeniden açabilirsin.");
    }).finally(() => { if (mounted) setReady(true); });
    const stop = () => stopEffects();
    document.addEventListener("visibilitychange", stop);
    window.addEventListener("blur", stop);
    if (Capacitor.isNativePlatform()) void NativeApp.addListener("appStateChange", ({ isActive }) => {
      if (!isActive) stopEffects();
    }).then(h => { if (mounted) native = h; else void h.remove(); }).catch(stop);
    return () => {
      mounted = false;
      setSoundMode("silent");
      document.removeEventListener("visibilitychange", stop);
      window.removeEventListener("blur", stop);
      void native?.remove();
    };
  }, []);
  function changeMode(value: SoundMode) {
    setMode(value);
    setSoundMode(value);
    if (value !== "silent") prepareManifestAudio();
    setError("");
    if (value !== "silent") void playEffect("correct");
    writes.current = writes.current.then(() => saveSoundMode(value)).catch(() => {
      setError("Ses ayarı kaydedilemedi. Bu oturumdaki seçimin geçerli.");
    });
  }
  return { mode, ready, error, changeMode };
}
