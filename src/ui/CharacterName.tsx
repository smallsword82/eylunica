import { useState } from "react";
import type { Progress } from "../storage";

export function CharacterName({ progress, onSave }: { progress: Progress; onSave: (progress: Progress) => void }) {
  const [name, setName] = useState(progress.learnerName || "Eylül");
  const [message, setMessage] = useState("");
  return <form className="custom-character learner-profile" onSubmit={event => {
    event.preventDefault();
    const learnerName = name.trim().slice(0, 24);
    if (!learnerName) return;
    onSave({ ...progress, learnerName });
    setMessage(`Sahne senin, ${learnerName}! Adın bu cihazda kaydedildi.`);
  }}>
    <div className="learner-symbol" aria-hidden="true">✦</div>
    <h2>Bu hikâyenin başrolü sensin.</h2>
    <p>Eylül olarak başlayabilirsin. İstersen kendi adını yaz; eğitmenin kim olursa olsun bu senin maceran.</p>
    <label htmlFor="learner-name">Öğrenci adı</label>
    <input id="learner-name" value={name} maxLength={24} autoComplete="off"
      onChange={event => { setName(event.target.value); setMessage(""); }} />
    <button className="secondary" type="submit" disabled={!name.trim()}>Adımı kaydet</button>
    <p aria-live="polite">{message}</p>
  </form>;
}
