import { useState } from "react";
import type { Progress } from "../storage";

export function CharacterName({ progress, onSave }: { progress: Progress; onSave: (p: Progress) => void }) {
  const [name, setName] = useState(progress.customCharacter?.character === progress.character ? progress.customCharacter.name : "");
  const [message, setMessage] = useState("");
  return <form className="custom-character" onSubmit={event => {
    event.preventDefault();
    if (!name.trim()) return;
    onSave({ ...progress, customCharacter: { character: progress.character, name: name.trim().slice(0, 24) } });
    setMessage("Adın seçtiğin karaktere verildi. Yalnızca bu cihazda saklanır.");
  }}>
    <h2>İstersen bir karakter senin adını taşısın</h2>
    <p>Önce görünümünü seç, sonra yalnızca ilk adını yaz. Hazır isimlerle de oynayabilirsin. Özel ad aynı anda yalnızca bir karaktere uygulanır.</p>
    <label htmlFor="character-name">Karaktere vereceğin ad</label>
    <input id="character-name" value={name} maxLength={24} autoComplete="off" onChange={event => { setName(event.target.value); setMessage(""); }} />
    <button className="secondary" type="submit" disabled={!name.trim()}>Bu adı seçtiğim karaktere ver</button>
    {progress.customCharacter && <button className="text-button" type="button" onClick={() => {
      const next = { ...progress };
      delete next.customCharacter;
      onSave(next);
      setName("");
      setMessage("Hazır karakter adı geri getirildi.");
    }}>Özel adı kaldır</button>}
    <p aria-live="polite">{message}</p>
  </form>;
}
