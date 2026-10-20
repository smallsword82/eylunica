# İkinci aşama · 0.2.0 · Test raporu

20 Ekim 2026 tarihinde bu makinede çalıştırılan doğrulamalar.

## Teslim edilen davranış

Üç akademi, üç düzeyde altı özgün okuma metni ve 36 kanıtlı anlama sorusu, altı tür dikkat oyunu, uyarlanabilir düzey önerisi, ortak yıldız/konser sistemi ve üç alanı birleştiren konser görevleri. Metin ve görev havuzları paket içinde; dış API veya kullanıcı hesabı yok. Matematik motoru, özgün altı karakter ve mevcut CI `packages: platform-tools` düzeltmesi korunur.

## Yerel sonuçlar

| Kontrol                                                      | Sonuç                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| Matematik motoru                                             | 23 test geçti                                                      |
| Okuma motoru                                                 | 9 test geçti                                                       |
| Dikkat motoru                                                | 19 test geçti                                                      |
| Ortak uyarlama motoru                                        | 4 test geçti                                                       |
| Birleşik konser motoru                                       | 2 test geçti                                                       |
| Yerel kayıt/adaptörler                                       | 9 test geçti                                                       |
| Önceki arayüz                                                | 3 test geçti                                                       |
| Yeni etkinlik arayüzü                                        | 3 test geçti                                                       |
| **`npm test` toplamı**                                       | **72 test geçti**                                                  |
| Üretim tarayıcı akışları                                     | **8 test geçti**                                                   |
| `npm run build`                                              | TypeScript, Vite ve PWA başarılı                                   |
| `source scripts/cloud-env.sh` ardından `npm run android:apk` | Başarılı, debug APK üretildi                                       |
| Android `apksigner verify`                                   | Son yerel APK imzası doğrulandı                                    |
| APK varlık kontrolü                                          | Okuma metinleri ve dikkat motoru oyun JavaScript paketinde bulundu |

Tarayıcı komutu: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`.

Tarayıcı testleri önceki dört matematik testini korur. Ek dört akış: v1 kaydı ile başlama ve v2'ye korumalı geçiş, altı okuma becerisini tamamlama, çevrimdışı yeniden açma, altı dikkat türünü çevrimdışı çözme, konserin üç adımında yalnız üç yıldız yazılması, 390px mobil/768px tablet düzeni ve yeni akademilerin otomatik erişilebilirlik kontrolü. 1440px masaüstü matematik görünümü de önceki testtedir. Yanlış kanıt, ipucu, yeniden deneme, hafıza kartını isteğe bağlı kapatma ve tekrar açma birim/arayüz testleriyle kapsanır.

Axe WCAG 2 A/AA ve 2.1 AA kuralları kontrol edilen ana ekran, matematik görevi, 4./5. sınıf metin ekranları ve hafıza kartlarının açık/kapalı durumlarında geçti. Bu tam erişilebilirlik sertifikası değildir.

## Veri güvenliği ve geçiş

Web localStorage / Android Preferences adaptörü korunur. Depolama anahtarı `ritma-progress-v1` kalır; içerik şeması v2 olur. Matematik becerileri, yıldızlar, karakter, geçmiş, ödüller ve başlangıç yoklaması korunarak yeni akademiler eklenir. Yeni kayıt ilk yazma işleminde kalıcılaşır. Geçmiş 200 kayıt, soru tekrar sayıları 120 kimlikle sınırlandırılır. Yanlış sonrasında yeniden doğru yanıt vermek aynı soruyu tekrar puanlamaz. Konser istatistiği ayrıca tutulur ama yıldız ikinci kez verilmez.

## Android ve çıktılar

Paket `com.ritma.matematiksahnesi`, sürüm `0.2.0`, versionCode `2`, min SDK 23, hedef SDK 35. Yerel APK: `/workspace/artifacts/matematik-sahnesi-0.2.0-debug.apk`. Web ZIP ve ekran görüntüleri de `/workspace/artifacts/` altında. Aşağıdaki hash yalnızca bu makinedeki debug APK içindir; GitHub runner'ının farklı debug anahtarıyla oluşturduğu APK'nın hash'i farklı olabilir.

```text
5c787f8be07a542df61039c72a6ea7feb3830bfb0491a185b2f47189d528aa61
```

GitHub CI aynı commit için testleri ve APK derlemesini yeniden çalıştırır. İndirilebilir paket, başarılı `Web tests and Android APK` çalıştırmasının `matematik-sahnesi-debug-apk` artifact'idir. Uzaktaki sonuç, ilgili Actions çalıştırmasından ayrıca doğrulanmalıdır; yerel derleme uzak başarı yerine sayılmaz.

## Sınırlar

Gerçek Android cihazda kurulum, dokunma, WebView/Preferences ve uçak modu denemesi yapılmadı. Android üzerinde çalıştırılmış gibi raporlanmaz. Fiziksel cihaz ve çocukla kullanılabilirlik/öğretim incelemesi sonraki test adımıdır. Hikâye havuzu başlangıç içeriğidir; sınıf/yaş etiketleri standartlaştırılmış başarı ölçümü değildir. Dikkat oyunları tıbbi teşhis/tedavi aracı değildir. Kamuya açık site, mağaza yayını, yeni izin, analitik, ağ servisi veya yeni kişisel veri alanı eklenmedi. Bu aşama sonrasında yeni özellik eklenmez.
