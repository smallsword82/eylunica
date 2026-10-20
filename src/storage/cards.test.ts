import { it, expect } from "vitest";
import { fresh, decode } from "./index";
import { awardCard, cardCounts } from "./cards";
import { collectibleCards } from "../game/cards";
import { characters } from "../game";
it("her bölümde tek kart verir; ilk altı farklıdır, yıldız ve geçmiş korunur", () => {
  let progress = fresh();
  progress.stars = 17;
  for (let index = 0; index < 6; index++) {
    progress = awardCard(progress, `section:${index}`, "Bölüm");
    expect(awardCard(progress, `section:${index}`, "Bölüm")).toEqual(progress);
  }
  expect(Object.keys(progress.cards!.counts)).toHaveLength(6);
  progress = awardCard(progress, "section:6", "Bölüm");
  expect(progress.cards!.counts.Mina).toBe(2);
  expect(progress.cards!.last.cardId).toBe("mina-portrait");
  expect(progress.stars).toBe(17);
  expect(progress.history).toEqual([]);
  expect(decode(JSON.stringify(progress))).toEqual(progress);
});
it("24 farklı kart verir, koleksiyon tamamlanınca kopya üretmez", () => {
  let progress = fresh();
  for (let index = 0; index < collectibleCards.length; index++) {
    progress = awardCard(progress, `section:${index}`, "Bölüm");
    expect(progress.cards!.last.cardId).toBe(collectibleCards[index].id);
    expect(Object.keys(cardCounts(progress))).toHaveLength(index + 1);
  }
  expect(Object.values(cardCounts(progress)).every(count => count === 1)).toBe(true);
  const completed = awardCard(progress, "section:24", "Bölüm");
  expect(completed.cards!.variants).toEqual(progress.cards!.variants);
  expect(completed.cards!.counts).toEqual(progress.cards!.counts);
  expect(completed.cards!.last.collectionComplete).toBe(true);
  expect(decode(JSON.stringify(completed))).toEqual(completed);
});
it("eski kopyaları farklı görsellere aktarır, toplamı ve bölüm kayıtlarını korur", () => {
  const progress = fresh();
  progress.stars = 40;
  progress.cards = { counts: { Mina: 7, Lidya: 2 }, grants: ["old"], last: { character: "Mina", source: "Eski bölüm" } };
  const migrated = cardCounts(decode(JSON.stringify(progress)));
  expect(Object.keys(migrated)).toHaveLength(6);
  expect(Object.values(migrated).reduce((total, count) => total + count, 0)).toBe(9);
  expect(migrated["mina-debut"]).toBe(2);
  expect(migrated["lidya-portrait"]).toBe(1);
  expect(awardCard(progress, "old", "Eski bölüm")).toBe(progress);
  const awarded = awardCard(progress, "new", "Yeni bölüm");
  expect(awarded.cards!.last.cardId).toBe("hilal-debut");
  expect(awarded.stars).toBe(40);
  expect(awarded.cards!.grants).toEqual(["old", "new"]);
  expect(decode(JSON.stringify(awarded))).toEqual(awarded);
});
it("her karakter için dört ayrı görsel ve kalıcı kart kimliği vardır", () => {
  expect(collectibleCards).toHaveLength(24);
  expect(new Set(collectibleCards.map(card => card.id)).size).toBe(24);
  expect(new Set(collectibleCards.map(card => card.image)).size).toBe(24);
  for (const character of characters) expect(collectibleCards.filter(card => card.character === character.name)).toHaveLength(4);
});
it("bozuk kart verisi eski öğrenme geçmişini silmez", () => {
  const progress = { ...fresh(), stars: 9 };
  expect(decode(JSON.stringify({ ...progress, cards: { counts: { Mina: -1 } } }))).toEqual(progress);
});
