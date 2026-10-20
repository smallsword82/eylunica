# Doğrulama · 20 Ekim 2026

Bu bulut makinesinde gerçekten çalıştırılan kontroller:

| Kontrol                                                                  | Sonuç                                                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `bash scripts/setup-cloud.sh`                                            | Başarılı; frozen `npm ci`, SDK hazırlığı, web build ve Android sync                  |
| `npm test`                                                               | 33 test geçti (matematik 23, depolama 7, arayüz 3)                                   |
| `npm run build`                                                          | TypeScript ve Vite üretim derlemesi başarılı; PWA önbelleği üretildi                 |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e` | 4 test geçti                                                                         |
| `source scripts/cloud-env.sh` ardından `npm run android:apk`             | Başarılı; 112 Gradle görevi, APK üretildi                                            |
| Android `apksigner verify`                                               | Son APK imzası doğrulandı                                                            |
| Android `aapt dump permissions`                                          | INTERNET, kamera, mikrofon, konum izni yok; yalnızca AndroidX internal receiver izni |
| APK ZIP içeriği                                                          | Web başlangıcı ve oyun JavaScript varlıkları pakette mevcut                          |

Tarayıcı testleri: 390×844 mobil görünüm, 1440×1000 masaüstü, yanlış yanıt–ipucu–tekrar deneme, klavyeden yanıt, karakter kaydı, internet kapalıyken yeniden yükleme ve oynama, yıldızın yeniden açılışta korunması, beş soruluk görev/ödül, ebeveyn tablosu ve sıfırlama onayı. Ana ekran ve ipucu açık görev ekranında axe WCAG 2 A/AA ve 2.1 AA otomatik kurallarında ihlal bulunmadı. Bu otomatik kontroller tam erişilebilirlik sertifikası değildir.

Android paketi: `com.ritma.matematiksahnesi`, sürüm `0.1.0`, min SDK 23, hedef SDK 35. Java 21 JDK ve doğrulanmış Gradle 8.11.1 kullanıldı. Bu bir debug APK; gerçek Android cihazında çalıştırma, WebView/Preferences uçak modu kontrolü ve mağaza imzalama henüz yapılmadı.

APK boyutu: 4064567 bayt. SHA-256:

```text
391e5b845459fea62b3554f8a31ef67093d9b473a9a07a1d9dd5667f08c5d177
```

Yerel çıktılar `/workspace/artifacts/` altında: APK, checksum, web ZIP ve mobil/masaüstü ekran görüntüleri. Derleme çıktıları kaynak Git deposuna eklenmez. GitHub Actions APK artifact yükleme adımı eklendi; GitHub API bu ortamdan `Forbidden` döndüğü için uzaktaki workflow sonucu veya artifact bağlantısı doğrulanamadı. Yerel APK üretimi yukarıdaki komutlarla doğrulandı.

Web sitesi herkese açık yayımlanmadı, depo görünürlüğü değiştirilmedi, mağazaya yükleme yapılmadı. İleri görev tipleri, aralıklı tekrar, daha kapsamlı uyarlama ve dekor sistemi README'deki sonraki aşamalardır.
