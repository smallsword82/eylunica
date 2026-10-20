import { useEffect, useRef } from "react";

export function ContinueCard({ title, onContinue }: { title: string; onContinue: () => void }) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => { button.current?.focus(); }, []);
  return <section className="continue-card" aria-label="Sıradaki adım">
    <span className="continue-check" aria-hidden="true">✓</span>
    <div>
      <p className="continue-label">BU BÖLÜM TAMAM!</p>
      <h2>Şimdi ne yapalım?</h2>
      <p>Sırada: <strong>{title}</strong></p>
      <button ref={button} className="primary continue-button" onClick={onContinue}>
        Devam et <span aria-hidden="true">→</span>
      </button>
      <p className="small">Devam etmek için büyük düğmeye dokun. İlerlemen kaydedildi.</p>
    </div>
  </section>;
}
