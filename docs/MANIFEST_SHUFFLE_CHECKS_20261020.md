# Tüm doğrulanmış şarkılar, rastgele sıra ve açık ses

20.10.2026 bu bilgisayarda yeni doğrulama. Önceki sürümün 136/21 sonuçları bu sürümün testi olarak kullanılmadı.

## Sonuç

- Resmî kanalın video kataloğundan 27 ayrı şarkı/remiks belirlendi; aynı şarkının klip/dans/karaoke tekrarları çoğaltılmadı. Intro ve Outro dahil. Tam kaynaklar ve 12 saniyelik kesit başlangıçları `src/audio/manifest-catalog.ts` ve `MANIFEST_MEDIA.md` içinde.
- Ses dosyaları -16 LUFS / -1,5 dBTP hedefiyle dengelendi. Varsayılan düzey 0,35, arayüzden değiştirilebilir.
- Varsayılan Müzik ve Efektler. İlk Devam et dokunuşu karışık oynatmayı başlatır; kayıtlı Sessiz/Sadece Efektler tercihleri korunur. Dinle/Rastgele düğmesi kapalı moddan tek dokunuşla müzik moduna geçebilir.
- 12 saniyelik müzik kesitleri, aralarda 2,5 saniye sessizlik; karışık torba ve tur sınırında hemen tekrar etmeme. Kısa efektler de katalogdan rastgele seçilir.
- Ders/soru değişimleri müziği kesmez; Sessiz, durdur, mola, konuşmalı anlatıcı, odak/görünürlük kaybı ve ebeveyn ekranı keser. Video/iframe yoktur. Öğrenci adı, eğitmen ve ilerleme korunur.

## Bu tur çalıştırılan kontroller

- `vitest run --maxWorkers=2`: 18 dosyada 138 test geçti, yakalanmamış hata yok.
- `tsc --noEmit`: başarılı.
- `vite build`: başarılı. PWA 65 girdiyi, yaklaşık 8373,96 KiB önbelleğe alır.
- `playwright test --workers=2`: son üretim derlemesinde 22 test geçti (28,8 saniye).
- Chromium internet kesikken 27 dosyanın tamamını gerçek AudioContext ile çözdü: her biri 11,9–12,1 saniye, RMS > 0,01 (sessiz kayıt değil).
- Gerçek HTMLAudioElement oynatma, kapalı moddan tek tıkla ses açma, değiştirilebilir ses düzeyi, rastgele sıranın sonraki dosyaya ilerlemesi, soru ekranına geçince aynı kesitin durmadan sürmesi ve durdur düğmesi test edildi.
- Eski akademi, Arena, ebeveyn süreleri, konuşmalı anlatıcı, erişilebilirlik ve çevrimdışı regresyonlar geçti.
- Yerel önizleme ve TRALALA MP3 isteği HTTP 200 ile doğrulandı. `test-results/manifest-shuffle-mobile.png` son ekran kanıtı.

## Giderilen deneme hataları ve sınırlar

İlk rastgele seçimde arama koşulu içinde tekrar örnekleme yakalanmamış hata üretti; seçim bir kez yapılacak şekilde düzeltildi, tüm birim testleri yeniden geçti. Ek tarayıcı kontrolü soru açma yolundaki eski stopEffects çağrısının karışık müziği durdurduğunu yakaladı; normal etkinlik geçişleri ile zorunlu durdurma ayrıldı. Son 22 test tamamı tekrar geçti.

Manifest dans videosunun ses akışı 403 verdi; aynı şarkının resmî Hypers albüm ses kaydı kullanıldı. Başka sanatçılara ait releases eşleşmeleri katalog sayılmadı. Android fiziksel cihaz/hoparlör ayarı testi yapılmadı; tarayıcıdan cihazın fiziksel sessiz modunu veya hoparlör sesini değiştirme iddiası yok.
