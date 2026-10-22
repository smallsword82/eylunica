import {mathFilms} from './math-films.ts';
import {mathCoachTexts} from './math-coach.ts';
import {mathJourneyQuestions,type JourneyQuestion} from './math-journey-bank.ts';
import {mathLessons} from './content/math.ts';
export const mathInstructions={
 practice:'Şimdi alıştırma zamanı. Soruyu dinle ve görseli incele. Yanıta dokun veya ekrandaki sayı tuşlarını kullan. Sonra Yanıtımı kontrol et düğmesine dokun. Takılırsan ipucu alabilirsin.',
 test:'Konu testinde yirmi yeni soru var. Görseli incele, yanıtını seç ve Yanıtımı kaydet düğmesine dokun. Otomatik olarak sonraki soruya geçeceksin. Çözümleri ve yüz üzerinden sonucunu test bitince göreceksin.',
 written:'Yazılı için çalışacağın üniteyi ve soru sayısını seç. Yazılıyı başlat düğmesine dokun. Her doğru eşit puan getirir. Yanlışlar ayrıca puan düşürmez. Sonunda yüz üzerinden notunu göreceksin.',
 writtenStart:'Yazılı başladı. Soruyu ve görseli incele. Yanıtını seçip Yanıtımı kaydet düğmesine dokun. Sonraki soruya doğrudan geçeceksin. İstersen Boş bırak düğmesini kullanabilirsin. Çözümler yazılı bitince açılacak.',
 result:'Çalışman tamamlandı. Yüz üzerinden puanını ekranda görebilirsin. Görselli çözümleri incele düğmesine dokunarak her sorunun nasıl çözüldüğüne bakabilirsin.',
};
export const practiceHintSpeech=(q:JourneyQuestion)=>`İpucu: ${q.hints[0]}`;
export const practiceSolutionSpeech=(q:JourneyQuestion)=>`Çözümü birlikte inceleyelim. ${q.explanation}`;
export const mathNarrationTexts=[...new Set([
 ...Object.values(mathInstructions),...mathCoachTexts,
 ...Object.values(mathFilms).flatMap(f=>[...f.explain,...f.example].flatMap(s=>s.captions)),
 ...mathLessons.flatMap(l=>[...l.sections.flatMap(s=>s.body),...l.workedExample.steps]),
 ...mathJourneyQuestions.filter(q=>q.purpose==='practice').flatMap(q=>[q.prompt,practiceHintSpeech(q),practiceSolutionSpeech(q)]),
 // Preserve the introductory sample's complete explanation too.
 'Bir rakamın değeri bulunduğu basamağa bağlıdır. Birler, onlar, yüzler ve binler basamaklarında değer sırasıyla 1, 10, 100 ve 1000 ile çarpılır.',
 '4 582 sayısında 5 yüzler basamağındadır: 5 × 100 = 500.',
])];
