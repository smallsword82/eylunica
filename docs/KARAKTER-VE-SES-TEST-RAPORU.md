# Karakter adları ve ses efektleri — 0.3.1

20 Ekim 2026

- Hazır adlar: Mina, Eylül, Alara, Beren, Öykü, Defne. Görseller aynı özgün SVG karakterleridir.
- İsteğe bağlı ilk ad girişi, seçilen tek bir görünüme bağlanır. Başka karaktere atandığında öncekinin hazır adı geri gelir. Özel ad kaldırılabilir. Ad yalnızca cihazda saklanır.
- Eski karakter adları aynı görünümün yeni adına taşınır; öğrenme, yıldız, ödül ve ebeveyn kayıtları korunur.
- Kısa doğru cevap, yeniden deneme, yıldız ve tamamlama efektleri Web Audio ile üretilir. Harici ses dosyası, konuşma servisi, internet veya mikrofon gerekmez.
- Ses varsayılan kapalıdır. Üst düğmeyle açılır ve kapatılır; tercih ayrı cihaz kaydında saklanır. Konuşmalı seslendirme ve sürekli müzik eklenmemiştir.

## Yerel doğrulama

- `npm test`: 101 test başarılı. Özel adın tek karaktere atanması, kaldırılması, yeniden yüklenmesi, eski adların göçü, ses depolama adaptörleri, ses desteği yokken akışın sürmesi ve efektlerin durması dahil.
- `npm run build`: TypeScript ve Vite/PWA üretim derlemesi başarılı.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`: 13 tarayıcı senaryosu. Ses düğmesiyle gerçek Web Audio oscillator üretimi, özel ad ve ses tercihinin çevrimdışı yeniden açılışı; mevcut üç akademi, mola/süre ve erişilebilirlik akışları.
- `source scripts/cloud-env.sh && npm run android:apk`: başarılı, 139 Gradle görevi. Android sürüm kodu 4, sürüm adı 0.3.1.

GitHub'a gönderilen sürüm ayrıca mevcut `Web tests and Android APK` iş akışıyla doğrulanır; çalışmanın kesin sonucu ve APK artifact bağlantısı teslim mesajında belirtilir.

## Doğrulanmayanlar

Gerçek Android cihazda kurulum, sesin fiziksel hoparlörden duyulması, üreticilere özgü yaşam döngüsü ve önceki APK üzerine yükseltme denenmedi. Tarayıcı testi sesin teknik olarak üretildiğini doğrular; sesin çocuk açısından uygunluğu dinleme testiyle değerlendirilmelidir. Web paketi oluşturulması, bir hosting hizmetinde yayına alındığı anlamına gelmez.
