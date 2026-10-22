import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => { setOnline(true); setShow(true); setTimeout(() => setShow(false), 3000); };
    const off = () => { setOnline(false); setShow(true); };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`offline-banner ${online ? "online" : "offline"}`}
      role="status"
      aria-live="polite"
    >
      {online
        ? "Bağlantı geri geldi. Çevrimdışı modda çalışmaya devam edebilirsin."
        : "Çevrimdışısın. İlerlemen bu cihazda güvenle saklanıyor."}
    </div>
  );
}
