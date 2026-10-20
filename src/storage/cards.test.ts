import { it, expect } from "vitest";
import { fresh, decode } from "./index";
import { awardCard } from "./cards";
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
  expect(progress.stars).toBe(17);
  expect(progress.history).toEqual([]);
  expect(decode(JSON.stringify(progress))).toEqual(progress);
});
it("bozuk kart verisi eski öğrenme geçmişini silmez", () => {
  const progress = { ...fresh(), stars: 9 };
  expect(decode(JSON.stringify({ ...progress, cards: { counts: { Mina: -1 } } }))).toEqual(progress);
});
