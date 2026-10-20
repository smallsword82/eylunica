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
  const contexts = [
    ["eylunica, okurlar rahatsız olmasın diye kütüphanenin yanındaki salonda sessiz prova yapmaya karar verdi.", "Ekip neden sessiz prova yapacak?", "Okurlar rahatsız olmasın diye", "Sessiz ritim kartlarıyla prova yapmak", "Ekip, çevresindekilerin ihtiyaçlarını da düşünüyor."],
    ["Ekip, kâğıt israfını azaltmak için geçen konserden kalan temiz süsleri yeniden kullanmaya karar verdi.", "Ekip eski süsleri neden yeniden kullanacak?", "Kâğıt israfını azaltmak için", "Temiz süsleri onarıp yeniden değerlendirmek", "Bir malzeme sağlam kaldığında yeniden kullanılabilir."],
    ["Akşam yağmur beklenince ekip, davetliler ıslanmasın diye konseri kapalı salona taşımayı planladı.", "Ekip konseri neden salona taşıyacak?", "Davetliler yağmurda ıslanmasın diye", "Davetlilere haber verip kapalı salonu hazırlamak", "Olası bir değişiklik için önceden plan yapılabilir."],
    ["Ekip, herkes rahatça geçebilsin diye sahneye giden yolu boş bıraktı ve kutuları depoya koydu.", "Ekip kutuları neden depoya koydu?", "Herkes rahatça geçebilsin diye", "Kutuları geçiş yolundan kaldırmak", "Bir düzenleme yapılırken farklı kişilerin erişimi düşünülmelidir."],
    ["Ekip, uzaktaki konuklar da okuyabilsin diye yön afişindeki yazıları büyüttü.", "Ekip afişteki yazıları neden büyüttü?", "Uzaktaki konuklar da okuyabilsin diye", "Büyük ve okunaklı yön afişleri hazırlamak", "İyi bir duyuru, onu okuyacak kişilerin ihtiyacına uygun olmalıdır."],
  ];
  const context = contexts[round % contexts.length];
  const signs = ["yıldız", "daire", "üçgen", "kare"];
  const sequence = [[0, 1, 2], [1, 3, 0], [2, 0, 3], [3, 2, 1], [0, 3, 2]][round % 5];
  const sentences = [
    context[0],
    level === 1
      ? `Mina ${a} ışık, Beren ${b} ışık getirdi; hepsi birlikte asılacak.`
      : level === 2
        ? `Alara ${a} sıra hazırladı; her sıraya ${b} sandalye koydu.`
        : `Beren ${a} bileti ${b} arkadaşına eşit paylaştıracak.`,
    `Defne sahne işaretlerinin sırasını belirledi: önce ${signs[sequence[0]]}, sonra ${signs[sequence[1]]}, en son ${signs[sequence[2]]}.`,
    "Ekip planı birlikte okuyup her görevin tamamlandığını kontrol etti.",
  ];
  const id = `concert2-${level}-${round}`;
  return {
    sentences,
    math,
    tasks: [
      {
        id: `${id}-read`,
        title: round === 0 ? "Sessiz konser hazırlığı" : "Konser planını keşfet",
        skill: level === 3 ? "Çıkarım" : level === 2 ? "Planlama" : "Neden-sonuç",
        sentences,
        evidence: [0],
        prompt: level === 1 ? context[1] : level === 2 ? "Bu durumda hangi plan en uygundur?" : "Ekibin kararından hangi sonuca ulaşılabilir?",
        choices: [
          context[level + 1],
          "Işıklar bozulduğu için",
          "Biletler kaybolduğu için",
          "Salonda kimse olmadığı için",
        ],
        answer: 0,
        hint: "İlk cümledeki “diye” sözü amacı açıklıyor.",
        explanation: `İlk cümledeki bilgi kararın dayanağıdır: ${context[0]}`,
      },
      {
        id: `${id}-focus`,
        title: "Sahne işaretleri",
        skill: "Sıralı yönergeler",
        prompt: "Metindeki işaret sırasını uygula.",
        choices: ["✦ Yıldız", "● Daire", "▲ Üçgen", "■ Kare"],
        sequence,
        answer: 0,
        hint: "Üçüncü cümlede “önce, sonra, en son” sözlerine bak.",
        explanation: `İşaretler ${sequence.map(index => signs[index]).join(" → ")} sırasıyla seçilmeli.`,
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
