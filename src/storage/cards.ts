import { characters } from "../game";
import type { Progress } from "./index";

export function awardCard(progress: Progress, key: string, source: string): Progress {
  if (progress.cards?.grants.includes(key)) return progress;
  const cards = progress.cards ?? { counts: {}, grants: [], last: { character: "", source: "" } };
  const total = Object.values(cards.counts).reduce((sum, count) => sum + count, 0);
  const character = characters[total % characters.length].name;
  return { ...progress, cards: {
    counts: { ...cards.counts, [character]: (cards.counts[character] ?? 0) + 1 },
    grants: [...cards.grants, key].slice(-1000),
    last: { character, source },
  } };
}
