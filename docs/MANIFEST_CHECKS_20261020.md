# Manifest kişisel öğrenme alanı — yerel doğrulama

20.10.2026, bu bilgisayarda çalıştırıldı. Kaynak manifestakademi değiştirilmedi; geliştirme özel eylunica deposunda.

- `vitest run --maxWorkers=2`: 18 dosya, 136 test geçti.
- `tsc --noEmit`: başarılı.
- `vite build`: başarılı. PWA, fotoğraf ve MP3 dahil 40 girdiyi (3654,74 KiB) önbelleğe alır.
- `playwright test --workers=2`: son tam turda 21 test geçti (31,6 saniye).
- Yedi MP3 dosyası FFmpeg hata denetimiyle baştan sona çözümlendi.

Yeni testler varsayılan Eylül adını, değiştirilebilir öğrenci adını, eğitmen değişiminin öğrenci adından bağımsızlığını, eski ad eşlemelerini ve tüm mevcut ilerlemenin korunmasını doğrular. Gerçek Chromium testinde altı üye fotoğrafının yüklendiği; video/iframe bulunmadığı; internet kesikken Arıyo kesitinin gerçekten çaldığı, süresinin 12,1 saniyeden kısa, sesinin 0,12 ve döngüsünün kapalı olduğu; Sessiz seçilince durduğu doğrulandı. Müzik odasının ritim sorusu çalıştı. Mevcut akademi, Arena, anlatıcı, erişilebilirlik ve mola regresyonları geçti.

Önceki turda yeni üretim derlemesinin service worker üretimi bitmeden başlatılan ilk iki tarayıcı kontrolü önbellek hazır bekleyişinde zaman aşımına uğradı. Sonra derleme tamamlanarak yeniden çalıştırıldı. Eski kurgu eğitmen adı beklentisi Sueda’ya güncellendi; anlatıcı testi artık yalnız `/narration/` kayıtlarını sayar, gerçek Manifest MP3 efektlerini anlatıcı sanmaz. Son 21 testin tamamı yeniden geçti. Başarısız denemeler başarı diye sunulmadı.

Görsel inceleme: `test-results/ritma-welcome-mobile.png`, `test-results/ritma-welcome-desktop.png`, `test-results/manifest-home-mobile.png`. Telefon taşması ve WCAG A/AA kontrolleri geçti. Yerel önizleme HTTP 200 doğrulandı. Görseller test fixture profilinde Eylül/Deniz adlarını gösterir; gerçek kullanıcı kaydı değildir.

Sınırlar: fiziksel Android cihazı/APK bu tur test edilmedi. Tarayıcıda gerçek ses kaynağı, oynatma durumu ve süre doğrulandı; hoparlörden işitsel kalite değerlendirmesi yapıldığı iddia edilmez. Eski kurgu hikâyeleri gömülü Türkçe anlatımlarıyla korunur. Medya kaynakları ve kesit başlangıçları `MANIFEST_MEDIA.md` belgesindedir.
