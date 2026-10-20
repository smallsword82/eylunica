import type { Operation } from "../math-engine";
export const characters = [
  {
    name: "Mina",
    role: "Merakla keşfet",
    color: "#e69abc",
    hair: "#67374b",
    style: 0,
  },
  {
    name: "Lidya",
    role: "Adım adım ilerle",
    color: "#b1a2e8",
    hair: "#39334c",
    style: 1,
  },
  {
    name: "Hilal",
    role: "Örüntüleri yakala",
    color: "#76d5d0",
    hair: "#77452f",
    style: 2,
  },
  {
    name: "Esin",
    role: "Birlikte paylaş",
    color: "#f0c47e",
    hair: "#302c39",
    style: 3,
  },
  {
    name: "Zeynep",
    role: "Kısa yolları keşfet",
    color: "#a7c889",
    hair: "#8d5635",
    style: 4,
  },
  {
    name: "Sueda",
    role: "Sahneyi birleştir",
    color: "#db9de3",
    hair: "#473359",
    style: 5,
  },
];
export const worlds: {
  title: string;
  sub: string;
  symbol: string;
  operation: Operation | "strategy" | "mixed";
  character: string;
  color: string;
}[] = [
  {
    title: "Toplama Ormanı",
    sub: "Ateş böceklerini sahneye taşı",
    symbol: "+",
    operation: "add",
    character: "Mina",
    color: "#b9d9ad",
  },
  {
    title: "Çıkarma Vadisi",
    sub: "Işıklara giden yolu keşfet",
    symbol: "−",
    operation: "subtract",
    character: "Lidya",
    color: "#d1b9ee",
  },
  {
    title: "Çarpma Şehri",
    sub: "Ritmi eş gruplarla yakala",
    symbol: "×",
    operation: "multiply",
    character: "Hilal",
    color: "#97dcd6",
  },
  {
    title: "Bölme Adası",
    sub: "Sahnenin ışığını paylaş",
    symbol: "÷",
    operation: "divide",
    character: "Esin",
    color: "#eed19c",
  },
  {
    title: "Zihin Atölyesi",
    sub: "Küçük adımlar, büyük fikirler",
    symbol: "✧",
    operation: "strategy",
    character: "Zeynep",
    color: "#cadca3",
  },
  {
    title: "Konser Görevleri",
    sub: "Dört işlemi bir araya getir",
    symbol: "♫",
    operation: "mixed",
    character: "Sueda",
    color: "#e9b8d6",
  },
];

export function normalizeCharacter(name: string): string {
  const legacy: Record<string, string> = {
    Eylül: "Lidya", Alara: "Hilal", Beren: "Esin", Öykü: "Zeynep", Defne: "Sueda",
    Derin: "Hilal", Arya: "Esin", Zeyna: "Zeynep", Elya: "Sueda",
  };
  const current = legacy[name] ?? name;
  return characters.some(character => character.name === current) ? current : "Mina";
}
export const mentorPhotos: Record<string, string> = {
  Mina: "mina", Lidya: "lidya", Hilal: "hilal", Esin: "esin", Zeynep: "zeynep", Sueda: "sueda",
};
