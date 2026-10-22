import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(!navigator.onLine);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const on = () => { clearTimeout(timeout); setOnline(true); setShow(true); timeout = setTimeout(() => setShow(false), 3000); };
    const off = () => { clearTimeout(timeout); setOnline(false); setShow(true); };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`offline-banner ${online ? "online" : "offline"}`}
      role="status"
      aria-label="Bağlantı durumu"
      aria-live="polite"
    >
      {online
        ? "Bağlantı geri geldi. Çevrimdışı modda çalışmaya devam edebilirsin."
        : "Çevrimdışısın. İlerlemen bu cihazda güvenle saklanıyor."}
    </div>
  );
}
