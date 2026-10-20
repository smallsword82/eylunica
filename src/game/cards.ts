import { characters, mentorPhotos } from "./index";

export const cardSeries = [
  { id: "debut", title: "İlk Buluşma", color: "#d5b2ed" },
  { id: "portrait", title: "Anı Albümü", color: "#9cddda" },
  { id: "hileli", title: "Hileli", color: "#f5bdb1" },
  { id: "spotlight", title: "Sahne Işıkları", color: "#f1d48d" },
];

export const collectibleCards = cardSeries.flatMap((series, seriesIndex) => characters.map((character, characterIndex) => {
  const slug = mentorPhotos[character.name];
  return {
    id: `${slug}-${series.id}`,
    character: character.name,
    series: series.id,
    title: series.title,
    color: series.color,
    number: seriesIndex * characters.length + characterIndex + 1,
    image: series.id === "debut" ? `./manifest/${slug}.webp` : `./manifest/cards/${slug}-${series.id}.${series.id === "portrait" ? "webp" : "jpg"}`,
    landscape: series.id === "portrait" || series.id === "spotlight",
  };
}));

export type CollectibleCard = typeof collectibleCards[number];
