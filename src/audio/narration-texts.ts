export const narrationTexts = {
  math: "İşlemi dikkatle incele. Yanıtını seçeneklerden seçebilir veya kendin yazabilirsin. İstersen ipucu al. Acele etmene gerek yok.",
  reading: "Önce hikâyeyi oku. Sonra yanıtını ve metinde yanıtını destekleyen cümleyi seç. İstersen hikâyeyi dinleyebilirsin. Dinlemek, destek olarak kaydedilir.",
  attention: "Ayrıntıları dikkatle incele. Görevde istenen seçeneği veya sırayı bul. Süre baskısı yok. Hazır olduğunda yanıtını kontrol et.",
  memory: "Kartlara istediğin kadar bak. Sırayı aklında tut. Hazır olduğunda kartları kapat ve hatırladığın sırayı seç.",
  sequence: "Yönergede verilen sırayı dikkatle takip et. Seçeneklere aynı sırayla dokun. İstersen sırayı yeniden seçebilirsin.",
  correct: "Harika! Yanıtını dikkatle düşündün.",
  retry: "Henüz olmadı. Birlikte başka bir yol deneyelim. Acelemiz yok. İpucuna bakabilir, yeniden deneyebilirsin.",
  complete: "Görev tamamlandı. Birlikte yeni yollar keşfettik! İlerlemen bu cihazda saklı. İstersen şimdi mola verebilirsin.",
} as const;
export type NarrationId = keyof typeof narrationTexts;
export function storyNarrationText(title: string, sentences: string[]): string {
  return `${title}. ${sentences.join(" ")}`;
}
