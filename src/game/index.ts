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
    name: "Eylül",
    role: "Adım adım ilerle",
    color: "#b1a2e8",
    hair: "#39334c",
    style: 1,
  },
  {
    name: "Alara",
    role: "Örüntüleri yakala",
    color: "#76d5d0",
    hair: "#77452f",
    style: 2,
  },
  {
    name: "Beren",
    role: "Birlikte paylaş",
    color: "#f0c47e",
    hair: "#302c39",
    style: 3,
  },
  {
    name: "Öykü",
    role: "Kısa yolları keşfet",
    color: "#a7c889",
    hair: "#8d5635",
    style: 4,
  },
  {
    name: "Defne",
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
    character: "Eylül",
    color: "#d1b9ee",
  },
  {
    title: "Çarpma Şehri",
    sub: "Ritmi eş gruplarla yakala",
    symbol: "×",
    operation: "multiply",
    character: "Alara",
    color: "#97dcd6",
  },
  {
    title: "Bölme Adası",
    sub: "Sahnenin ışığını paylaş",
    symbol: "÷",
    operation: "divide",
    character: "Beren",
    color: "#eed19c",
  },
  {
    title: "Zihin Atölyesi",
    sub: "Küçük adımlar, büyük fikirler",
    symbol: "✧",
    operation: "strategy",
    character: "Öykü",
    color: "#cadca3",
  },
  {
    title: "Konser Görevleri",
    sub: "Dört işlemi bir araya getir",
    symbol: "♫",
    operation: "mixed",
    character: "Defne",
    color: "#e9b8d6",
  },
];

// Preserve each existing companion's appearance and selection when names change.
export function normalizeCharacter(name: string): string {
  const legacy: Record<string, string> = {
    Lidya: "Eylül", Derin: "Alara", Arya: "Beren", Zeyna: "Öykü", Elya: "Defne",
  };
  const current = legacy[name] ?? name;
  return characters.some(c => c.name === current) ? current : "Mina";
}
