import { characters } from "../game";
import { collectibleCards } from "../game/cards";
import type { Progress } from "./index";

export function validCardProgress(value: unknown): value is NonNullable<Progress["cards"]> {
  if (!value || typeof value !== "object") return false;
  const cards = value as NonNullable<Progress["cards"]>;
  if (!cards.counts || !Object.entries(cards.counts).every(([name, count]) => characters.some(character => character.name === name) && Number.isSafeInteger(count) && count >= 0)
    || !Array.isArray(cards.grants) || !cards.grants.every(key => typeof key === "string")
    || !cards.last || !characters.some(character => character.name === cards.last.character) || typeof cards.last.source !== "string") return false;
  if (cards.variants !== undefined && (!cards.variants || typeof cards.variants !== "object"
    || !Object.entries(cards.variants).every(([id, count]) => collectibleCards.some(card => card.id === id) && Number.isSafeInteger(count) && count >= 0)
    || characters.some(character => collectibleCards.filter(card => card.character === character.name).reduce((total, card) => total + (cards.variants?.[card.id] ?? 0), 0) !== (cards.counts[character.name] ?? 0)))) return false;
  if (cards.last.cardId !== undefined && !collectibleCards.some(card => card.id === cards.last.cardId && card.character === cards.last.character)) return false;
  return cards.last.collectionComplete === undefined || typeof cards.last.collectionComplete === "boolean";
}

export function cardCounts(progress: Progress): Record<string, number> {
  if (progress.cards?.variants) return progress.cards.variants;
  const counts: Record<string, number> = {};
  for (const character of characters) {
    const total = progress.cards?.counts[character.name] ?? 0;
    const variants = collectibleCards.filter(card => card.character === character.name);
    variants.forEach((card, index) => {
      const count = Math.floor(total / variants.length) + (index < total % variants.length ? 1 : 0);
      if (count) counts[card.id] = count;
    });
  }
  return counts;
}

export function awardCard(progress: Progress, key: string, source: string): Progress {
  if (progress.cards?.grants.includes(key)) return progress;
  const cards = progress.cards ?? { counts: {}, grants: [], last: { character: "", source: "" } };
  const variants = cardCounts(progress);
  const next = collectibleCards.find(card => !variants[card.id]);
  const grants = [...cards.grants, key].slice(-1000);
  if (!next) return { ...progress, cards: { ...cards, variants, grants, last: { ...cards.last, source, collectionComplete: true } } };
  return { ...progress, cards: {
    counts: { ...cards.counts, [next.character]: (cards.counts[next.character] ?? 0) + 1 },
    variants: { ...variants, [next.id]: 1 },
    grants,
    last: { character: next.character, source, cardId: next.id },
  } };
}
