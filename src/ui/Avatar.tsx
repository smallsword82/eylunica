import { useState } from "react";
import { characters, mentorPhotos, normalizeCharacter } from "../game";

export function Avatar({ name, large = false, label, costume = false }: {
  name: string; large?: boolean; label?: string; costume?: boolean;
}) {
  const mentor = normalizeCharacter(name);
  const character = characters.find(character => character.name === mentor)!;
  const [failed, setFailed] = useState(false);
  return <span className={`avatar mentor-avatar ${large ? "large" : ""} ${costume ? "mentor-star" : ""}`}
    style={{ "--mentor-color": character.color } as React.CSSProperties}>
    {failed
      ? <span role="img" aria-label={`${label ?? mentor}, Manifest eğitmeni`} className="mentor-initial">{mentor.slice(0, 1)}</span>
      : <img src={`./manifest/${mentorPhotos[mentor]}.webp`} alt={`${label ?? mentor}, Manifest eğitmeni`}
          onError={() => setFailed(true)} />}
    {costume && <span className="mentor-award" aria-label="Yıldızlı eğitmen rozeti">✦</span>}
  </span>;
}
