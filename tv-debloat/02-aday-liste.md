# Aday paket listesi — Next 4K Google TV stick (Google TV 14, Realtek)

Kaynak: cleanyourtv `examples/next-start-pro-4k` (aynı marka, aynı Realtek/SDT platformu, Google TV 14,
21 Ekim 2026'dan beri kullanılıyor) + `google-chromecast-gtv-4k`. **Her satır TV'de `dumpsys package` ile
doğrulanmadan kapatılmaz**; paket adı sizin stick'inizde yoksa `kapat.sh` zaten atlar.

## (1) Telemetri / reklam takibi / analitik — ONAY SONRASI İLK PARTİ
| Paket | Bu ne? |
|---|---|
| com.google.android.feedback | Google hata/geri bildirim gönderici |
| com.android.tv.feedbackconsent | Geri bildirim onayı ekranı |
| com.google.android.tv.remotecontrol.logging | Kumanda kullanım kaydı |
| com.google.android.apps.tv.netoscope | Ağ tanılama raporlama |
| com.android.ondevicepersonalization.services / com.google.android.ondevicepersonalization.services | Cihaz üstü reklam kişiselleştirme |
| com.android.federatedcompute.services / com.google.android.federatedcompute | Federated learning (reklam modeli eğitimi) |
| com.google.android.adservices.api, com.google.android.ext.adservices.api | Privacy Sandbox reklam servisleri (Play Store aksarsa geri aç) |

## (2) Üreticinin reklam ve içerik servisleri — İKİNCİ PARTİ
| Paket | Bu ne? |
|---|---|
| com.google.android.apps.tv.dreamx | Google TV "ambient" ekran koruyucu, öneri şeritli |
| com.google.android.backdrop | Ambient mod arka planı |
| com.google.android.apps.tv.launcherx | Google TV ana ekranı (reklam/öneri) — **yalnız FLauncher kurulup varsayılan olduktan sonra** |
| com.google.android.tungsten.setupwraith | Kurulum sihirbazı; ana ekranı geri alıyor. Wi-Fi ağının sahibiyse önce ağı unut/yeniden bağlan |

## (3) Muhtemelen gereksiz arka plan servisleri
com.android.printspooler (yazıcı), com.android.cameraextensions, com.android.healthconnect.controller,
com.android.health.connect.backuprestore, com.android.dreams.basic (basit ekran koruyucu),
com.android.dynsystem (GSI yükleyici), com.android.hotspot2.osulogin (Passpoint), com.android.nearby.halfsheet,
com.oem.qa ve com.sdt.producttest (fabrika test uygulamaları)

## (4) Önceden yüklenmiş uygulamalar
com.next.iptv (Next IPTV), com.next.roket (Next Roket), com.jettv.player (JetTV),
com.google.android.youtube.tvmusic, com.google.android.play.games, com.google.android.videos (Google TV Filmler),
com.google.android.marvin.talkback (ekran okuyucu), com.google.android.tts (sesli okuma)

## (5) Size bağlı — işaretlemediklerinizi kapatırım (7. kural)
- [ ] Netflix (com.netflix.ninja), YouTube (com.google.android.youtube.tv), Prime Video (com.amazon.amazonvideo.livingroom), Disney+ ...
- [ ] Google Asistan (com.google.android.katniss) — kumandadaki mikrofon
- [ ] Chromecast alıcısı (com.google.android.apps.mediashell) — telefondan yansıtma
- [ ] Sistem güncellemesi (com.sdt.ota) — kapatmanızı önermem
- [ ] Google TTS (com.google.android.tts) — sesli asistan sesli yanıt veriyorsa gerekir

## (6) Dokunulmazlar (6. kural)
com.android.vending, com.google.android.gms, com.google.android.gsf, com.android.location.fused,
com.google.android.tv.remote.service, com.google.android.tv.dfuservice (kumanda yazılımı), com.sdt.mecoolrcupair
(kumanda eşleştirme), com.sdt.* (ön panel, global tuşlar, OTA), com.oemservice, com.rtk.partnerinterface,
com.realtek.slices (gizli ses/görüntü ayarları), com.dolby.android.audio.service, com.google.android.inputmethod.latin
(Gboard), com.android.tv.settings, com.android.systemui, com.android.bluetooth. Stick'te tuner/HDMI-in yok, Girişler
menüsü de yok; bu yüzden "TV uygulaması" maddesi uygulanmaz.
