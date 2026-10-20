import { useEffect, useRef, useState } from "react";
import { enableEffects, loadAudio, saveAudio, playEffect, stopEffects } from ".";

export function useAudio() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    let mounted = true;
    enableEffects(false);
    loadAudio().then(value => {
      if (mounted) { setEnabled(value); enableEffects(value); }
    }).catch(() => {
      if (mounted) setError("Ses ayarı okunamadı; sesi yeniden açabilirsin.");
    }).finally(() => { if (mounted) setReady(true); });
    const stop = () => stopEffects();
    document.addEventListener("visibilitychange", stop);
    window.addEventListener("blur", stop);
    return () => {
      mounted = false;
      enableEffects(false);
      document.removeEventListener("visibilitychange", stop);
      window.removeEventListener("blur", stop);
    };
  }, []);
  function toggle() {
    const value = !enabled;
    setEnabled(value);
    enableEffects(value);
    setError("");
    if (value) void playEffect("correct");
    writes.current = writes.current.then(() => saveAudio(value)).catch(() => {
      setError("Ses ayarı kaydedilemedi. Bu oturumdaki seçimin geçerli.");
    });
  }
  return { enabled, ready, error, toggle };
}
