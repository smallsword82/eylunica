import { symbols, type Question } from "../math-engine";
import type { Activity } from "../learning-engine";
export function concert(
  level: number,
  round = 0,
): { sentences: string[]; tasks: Activity[]; math: Question } {
  level = Math.max(1, Math.min(3, level));
  const a = level === 1 ? 8 + round : level === 2 ? 3 + round : 24 + round * 6,
    b = level === 1 ? 7 : level === 2 ? 4 : 3;
  const operation = level === 1 ? "add" : level === 2 ? "multiply" : "divide";
  const answer =
    operation === "add" ? a + b : operation === "multiply" ? a * b : a / b;
  const math: Question = {
    a,
    b,
    operation,
    answer,
    options: [answer - 1, answer + 1, answer, answer + 2],
    level,
  };
  const sentences = [
    "RİTMA, okurlar rahatsız olmasın diye kütüphanenin yanındaki salonda sessiz prova yapmaya karar verdi.",
    level === 1
      ? `Mina ${a} ışık, Beren ${b} ışık getirdi; hepsi birlikte asılacak.`
      : level === 2
        ? `Alara ${a} sıra hazırladı; her sıraya ${b} sandalye koydu.`
        : `Beren ${a} bileti ${b} arkadaşına eşit paylaştıracak.`,
    "Defne sahne işaretlerinin sırasını belirledi: önce yıldız, sonra daire, en son üçgen.",
    "Ekip planı birlikte okuyup her görevin tamamlandığını kontrol etti.",
  ];
  const id = `concert-${level}-${round}`;
  return {
    sentences,
    math,
    tasks: [
      {
        id: `${id}-read`,
        title: "Sessiz konser hazırlığı",
        skill: "Neden-sonuç",
        sentences,
        evidence: [0],
        prompt: "Ekip neden sessiz prova yapacak?",
        choices: [
          "Okurlar rahatsız olmasın diye",
          "Işıklar bozulduğu için",
          "Biletler kaybolduğu için",
          "Salonda kimse olmadığı için",
        ],
        answer: 0,
        hint: "İlk cümledeki “diye” sözü amacı açıklıyor.",
        explanation:
          "Kütüphanedeki okurları düşünerek sessiz bir yöntem seçtiler. İlk cümle bu nedenin kanıtı.",
      },
      {
        id: `${id}-focus`,
        title: "Sahne işaretleri",
        skill: "Sıralı yönergeler",
        prompt: "Metindeki işaret sırasını uygula.",
        choices: ["✦ Yıldız", "● Daire", "▲ Üçgen", "■ Kare"],
        sequence: [0, 1, 2],
        answer: 0,
        hint: "Üçüncü cümlede “önce, sonra, en son” sözlerine bak.",
        explanation: "İşaretler yıldız → daire → üçgen sırasıyla seçilmeli.",
      },
      {
        id: `${id}-math`,
        title: "Sahnenin hesabı",
        skill: "Zihinden hesaplama",
        prompt:
          level === 1
            ? "Birlikte kaç ışık asılacak?"
            : level === 2
              ? "Toplam kaç sandalye hazırlandı?"
              : "Her arkadaşa kaç bilet düşecek?",
        choices: math.options.map(String),
        answer: math.options.indexOf(answer),
        hint: `İkinci cümledeki sayılarla ${a} ${symbols[operation]} ${b} işlemini düşün.`,
        explanation: `${a} ${symbols[operation]} ${b} = ${answer}. Metindeki sayıları ve ne istendiğini birlikte düşündün.`,
      },
    ],
  };
}
