# Seslendirme test raporu — 0.4.0

20 Ekim 2026

## Tamamlanan kapsam

- Sekiz yönerge/geri bildirim ve altı özgün hikâye için toplam 14 Türkçe sentetik anlatıcı kaydı, yaklaşık 2 MB.
- İsteğe bağlı yönerge/hikâye dinleme ve durdurma; ebeveyn panelinden kalıcı otomatik geri bildirim ayarı.
- Çevrimdışı PWA önbelleği ve APK içine gömme. Cihaz TTS paketi, internet, hesap, ses API'si veya mikrofon gerekmez.
- Hikâye dinleme isteği, aynı okuma oturumundaki sonraki soruların bağımsız çözüm sayılmasını önler; yıldızları azaltmaz. Mevcut kayıtlar korunur.

## Yerel sonuçlar

| Kontrol | Sonuç |
| --- | --- |
| Birim/arayüz testleri (`npm test`) | 109 başarılı |
| Playwright tam paket | 15 başarılı |
| TypeScript + Vite/PWA üretim derlemesi | Başarılı; 14 MP3 önbellekte |
| Android debug APK (`npm run android:apk`) | Başarılı; 139 Gradle görevi |
| Yerel APK imza kontrolü (`apksigner verify`) | Başarılı |
| APK içindeki sesler | 14/14 dosya kaynak kayıtlarla birebir aynı |

Tarayıcı testleri çevrimdışı 14 kaydın medya çözücüsüyle açıldığını ve sürelerini doğrular; ayrıca gerçek oynatma zamanının ilerlediğini kontrol eder. Manuel durdurma, odağın kaybolması, mola, ekran geçişi, üst üste ses başlamaması, konuşma tercihinin çevrimdışı kalıcılığı, okuma oturumunda destek kaydı ve ses çalarken erişilebilirlik test edilir. Android arka plan AppState dinleyicisi otomatik testte taklit edilerek doğrulanır.

Mevcut matematik, okuma, dikkat, konser, karakter adları, kayıt ve mola testleri de geçer. Model/API normal derlemenin parçası değildir; gömülü dosyaların metin ve SHA256 bütünlüğü test edilir. Son arayüz düzenlemesinin ardından ilgili etkinlik ve ses testleri ayrıca çalıştırılmıştır.

GitHub'a gönderilen commit ayrıca mevcut web ve Android Actions iş akışıyla sınanır. Kesin çalışma sonucu ve artifact bağlantıları teslim mesajında paylaşılır.

## Sınırlar

Gerçek Android cihazda kurulum, hoparlör/kulaklıktan dinleme, çağrı veya başka uygulamaların ses kesintileri, önceki APK üzerine yükseltme ve çocuklarla telaffuz/anlaşılabilirlik değerlendirmesi yapılmadı. Otomatik medya testi insanın dinleyerek yaptığı değerlendirme yerine geçmez. Sesler sentetiktir. Rastgele sayılar, yanıt seçenekleri ve dinamik konser metni seslendirilmez. Hikâyeler kendiliğinden başlamaz; durdurulan kayıt baştan tekrar dinlenir.

Kaynaklar ve yeniden üretim: [SESLENDIRME.md](SESLENDIRME.md).
