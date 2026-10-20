export type Operation = "add" | "subtract" | "multiply" | "divide";
export type Question = {
  a: number;
  b: number;
  answer: number;
  operation: Operation;
  options: number[];
  level: number;
};
export const symbols: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};
const int = (max: number, rng: () => number) => Math.floor(rng() * max);
export function generate(
  operation: Operation,
  level = 1,
  rng: () => number = Math.random,
): Question {
  level = Math.max(1, Math.min(5, Math.floor(level) || 1));
  const range = [10, 20, 50, 100, 200][level - 1];
  let a = 1 + int(range, rng),
    b = 1 + int(range, rng);
  if (operation === "subtract" && a < b) [a, b] = [b, a];
  if (operation === "multiply" || operation === "divide") {
    a = 1 + int(Math.min(12, level * 2 + 2), rng);
    b = 1 + int(Math.min(12, level * 2 + 2), rng);
  }
  if (operation === "divide") a *= b;
  const answer =
    operation === "add"
      ? a + b
      : operation === "subtract"
        ? a - b
        : operation === "multiply"
          ? a * b
          : a / b;
  const options = new Set([answer]);
  for (const offset of [1, -1, 10, -10, 2, -2]) {
    if (options.size === 4) break;
    if (answer + offset >= 0) options.add(answer + offset);
  }
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = int(i + 1, rng);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { a, b, answer, operation, options: shuffled, level };
}
export function strategy(q: Question): {
  title: string;
  steps: string[];
  dots: number;
  groups?: number;
} {
  const { a, b, answer, operation } = q;
  if (operation === "add") {
    const bridge = (10 - (a % 10)) % 10;
    if (bridge > 0 && b >= bridge)
      return {
        title: "Onluğa tamamla",
        steps: [
          `${a} sayısını bir sonraki onluğa taşımak için ${bridge} ekle.`,
          `${b} = ${bridge} + ${b - bridge}`,
          `${a} + ${bridge} = ${a + bridge}`,
          `${a + bridge} + ${b - bridge} = ${answer}`,
        ],
        dots: a % 10,
      };
    return {
      title: "Parçalara ayır",
      steps: [
        `${b} = ${Math.floor(b / 10) * 10} + ${b % 10}`,
        `Önce onlukları, sonra birlikleri ekle.`,
        `${a} + ${b} = ${answer}`,
      ],
      dots: Math.min(a, 10),
    };
  }
  if (operation === "subtract")
    return {
      title: "Tersine toplama",
      steps: [
        `${b} + ? = ${a}`,
        `${b} sayısından ${a} sayısına kaç adım var?`,
        `${b} + ${answer} = ${a}. Fark ${answer}.`,
      ],
      dots: Math.min(b, 10),
    };
  if (operation === "multiply")
    return {
      title: "Eş grupları keşfet",
      steps: [
        `${a} grup düşün; her grupta ${b} ışık var.`,
        `${a} × ${b} = ${answer}`,
        `Bir grubu biliyorsan, diğerlerini ekleyerek bulabilirsin.`,
      ],
      dots: b,
      groups: a,
    };
  return {
    title: "Eşit paylaştır",
    steps: [
      `${a} ışığı ${b} kişiye eşit paylaştır.`,
      `${b} × ? = ${a}`,
      `Her kişiye ${answer} ışık düşer.`,
    ],
    dots: answer,
    groups: b,
  };
}
