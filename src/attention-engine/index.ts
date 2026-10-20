import type { Activity } from "../learning-engine";
export const attentionKinds = [
  "odd",
  "pattern",
  "match",
  "memory",
  "instructions",
  "detail",
] as const;
export type AttentionKind = (typeof attentionKinds)[number];
export const attentionLabels: Record<AttentionKind, string> = {
  odd: "Farklı olanı bul",
  pattern: "Örüntüyü tamamla",
  match: "Şekil eşleştir",
  memory: "Görsel hafıza",
  instructions: "Sıralı yönergeler",
  detail: "Ayrıntıyı yakala",
};
const shapes = ["● Daire", "■ Kare", "▲ Üçgen", "◆ Baklava"];
function reorder(task: Activity, rng: () => number): Activity {
  if (task.sequence) return task;
  const entries = task.choices.map((label, i) => ({
    label,
    correct: i === task.answer,
  }));
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  return {
    ...task,
    choices: entries.map((x) => x.label),
    answer: entries.findIndex((x) => x.correct),
  };
}
export function generateAttention(
  kind: AttentionKind,
  level = 1,
  rng?: () => number,
): Activity {
  if (!rng) return attentionVariant(kind, level, Math.floor(Math.random() * 64));
  level = Math.max(1, Math.min(3, Math.floor(level) || 1));
  const shift = Math.floor(rng() * 4),
    rot = [...shapes.slice(shift), ...shapes.slice(0, shift)];
  const base = {
    id: `attention-${kind}-${level}-${Math.floor(rng() * 1e8)}`,
    skill: attentionLabels[kind],
    title: attentionLabels[kind],
    prompt: "",
    choices: [] as string[],
    answer: 0,
    hint: "Önce yönergeyi oku, sonra ayrıntıları karşılaştır.",
    explanation: "",
  };
  if (kind === "odd") {
    const size = level === 1 ? 6 : level === 2 ? 9 : 12,
      answer = Math.floor(rng() * size),
      usual = rot[0],
      odd = level === 3 ? `${rot[0]} · ek nokta` : rot[1];
    return {
      ...base,
      prompt: "Diğerlerinden farklı kartı seç.",
      choices: Array.from({ length: size }, (_, i) =>
        i === answer ? odd : usual,
      ),
      answer,
      explanation: `${answer + 1}. kart ${odd}; diğer kartlar ${usual}. Biçimi ve küçük ayrıntıları tek tek karşılaştır.`,
    };
  }
  if (kind === "pattern") {
    const cycle =
      level === 1
        ? [rot[0], rot[1]]
        : level === 2
          ? [rot[0], rot[0], rot[1]]
          : [rot[0], rot[1], rot[2]];
    const n = level === 1 ? 5 : level === 2 ? 7 : 8,
      visual = Array.from({ length: n }, (_, i) => cycle[i % cycle.length]);
    return reorder(
      {
        ...base,
        visual,
        prompt:
          "Şekillerin tekrar eden düzenini bul. Sırada hangi şekil olmalı?",
        choices: rot,
        answer: rot.indexOf(cycle[n % cycle.length]),
        hint: `Tekrarlanan grup ${cycle.length} şekilden oluşuyor.`,
        explanation: `Tekrarlanan grup: ${cycle.join(" → ")}. Bu düzeni sürdürünce sıradaki şekil ${cycle[n % cycle.length]}.`,
      },
      rng,
    );
  }
  if (kind === "match") {
    const labels =
        level === 1
          ? rot
          : rot.map((s, i) =>
              i % 2
                ? s
                    .replace("●", "○")
                    .replace("■", "□")
                    .replace("▲", "△")
                    .replace("◆", "◇") + " · içi boş"
                : s + " · içi dolu",
            ),
      answer = Math.floor(rng() * 4);
    return reorder(
      {
        ...base,
        visual: [labels[answer]],
        prompt: "Örnekteki kartla tamamen aynı olanı seç.",
        choices: labels,
        answer,
        explanation: `Örnek ${labels[answer]}. Sadece şekle değil, içinin dolu veya boş olduğuna da bak.`,
      },
      rng,
    );
  }
  if (kind === "memory") {
    const n = level + 2,
      memory = Array.from({ length: n }, (_, i) => rot[i % 4]);
    const right = memory.join(" → "),
      rev = [...memory].reverse().join(" → "),
      other = memory.map((_, i) => rot[(i + 1) % 4]).join(" → "),
      last = [...memory.slice(0, -1), rot[n % 4]].join(" → ");
    return reorder(
      {
        ...base,
        memory,
        prompt:
          "Kartlara istediğin kadar bak. Hazır olunca kapat ve aynı sırayı seç.",
        choices: [right, rev, other, last],
        answer: 0,
        hint: "Sırayı küçük gruplara ayırarak hatırlamayı dene. İstersen kartları yeniden açabilirsin.",
        explanation: `Kartların ilk sırası ${right}. Yeniden bakıp sırayı ses çıkarmadan kendine anlatabilirsin.`,
      },
      rng,
    );
  }
  if (kind === "instructions") {
    const sequence = Array.from({ length: level + 1 }, (_, i) => i % 4);
    return {
      ...base,
      choices: rot,
      sequence,
      prompt: `Sırayla seç: ${sequence.map((i) => rot[i]).join(" → ")}.`,
      hint: "Her adımda yalnızca bir sonraki şekli seç. Acele etme.",
      explanation: `İstenen sıra ${sequence.map((i) => rot[i]).join(" → ")}. Sıra da şekiller kadar önemli.`,
    };
  }
  const count = level + 2 + Math.floor(rng() * 5);
  return reorder(
    {
      ...base,
      sentences: [
        `Defne sahneye ${count} mavi kurdele ve ${count + 2} sarı kurdele getirdi.`,
        `Mavi kurdeleleri küçük kutuya, sarı kurdeleleri büyük kutuya koydu.`,
        ...(level > 1
          ? ["Öykü boş yeşil kutuyu masanın altına bıraktı."]
          : []),
        ...(level > 2
          ? ["Defne büyük kutunun kapağını kapattı, küçük kutu açık kaldı."]
          : []),
      ],
      prompt:
        level === 3
          ? "Kapağı açık kalan kutuda hangi kurdeleler var?"
          : "Küçük kutuda hangi kurdeleler var?",
      choices: [
        "Mavi kurdeleler",
        "Sarı kurdeleler",
        "Yeşil kurdeleler",
        "Küçük kutu boş",
      ],
      answer: 0,
      hint: "Kurdelelerin rengi ile kutunun yerini birbirinden ayır. İkinci cümleye yeniden bak.",
      explanation:
        "İkinci cümle mavi kurdelelerin küçük kutuda olduğunu söylüyor. Kutunun rengi ile içindeki nesnenin rengi aynı olmak zorunda değil.",
    },
    rng,
  );
}
export function attentionVariant(kind: AttentionKind, level: number, variant: number): Activity {
  let state = Math.imul(variant + 1, 0x9e3779b1) >>> 0;
  const rng = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const task = generateAttention(kind, level, rng);
  const colors = ["Mavi", "Sarı", "Mor", "Turuncu", "Yeşil", "Pembe", "Kırmızı", "Lacivert"];
  const paint = (text: string) => {
    const value = shapes.reduce((value, shape, index) => value.replaceAll(shape, `${shape} · ${colors[(variant + index * 2) % colors.length]}`), text);
    if (kind !== "detail") return value;
    const first = ["Mavi", "Mor", "Turuncu", "Kırmızı", "Lacivert"][variant % 5];
    const second = ["Sarı", "Pembe", "Beyaz", "Kahverengi", "Siyah"][variant % 5];
    return value.replaceAll("Mavi", first).replaceAll("mavi", first.toLocaleLowerCase("tr")).replaceAll("Sarı", second).replaceAll("sarı", second.toLocaleLowerCase("tr"));
  };
  return {
    ...task, id: `attention2-${kind}-${level}-v${variant}`,
    prompt: paint(task.prompt), choices: task.choices.map(paint), hint: paint(task.hint), explanation: paint(task.explanation),
    ...(task.visual ? { visual: task.visual.map(paint) } : {}),
    ...(task.memory ? { memory: task.memory.map(paint) } : {}),
    ...(task.sentences ? { sentences: task.sentences.map(paint) } : {}),
  };
}
export function checkSequence(task: Activity, selected: number[]): boolean {
  return (
    !!task.sequence &&
    selected.length === task.sequence.length &&
    task.sequence.every((n, i) => selected[i] === n)
  );
}
