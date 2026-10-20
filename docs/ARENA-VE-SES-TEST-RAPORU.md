# Arena ve özgün elektronik pop efektleri — 0.5.0 test raporu

20 Ekim 2026

## Sonuçlar

| Kontrol | Yerel sonuç |
| --- | --- |
| `npm test` | 133 birim/arayüz testi başarılı |
| `npm run build` | TypeScript, Vite ve PWA üretim derlemesi başarılı |
| Playwright tam test paketi | 19 senaryo başarılı |
| Sonuç ekranındaki ortalama gösteriminden sonra Arena senaryoları | 3 senaryo başarılı |
| `source scripts/cloud-env.sh && npm run android:apk` | Başarılı; 139 Gradle görevi |
| `apksigner verify` | Yerel debug APK imzası başarılı |
| APK içeriği | Arena ve üç ses modu mevcut; önceki 14 Türkçe kayıt korunuyor |

GitHub'a gönderilen commit ayrıca mevcut Web tests and Android APK Actions iş akışıyla doğrulanır. Kesin iş akışı sonucu ve indirilebilir artifact bağlantıları teslim mesajında belirtilir; yerel derleme sonucu GitHub başarısı yerine geçmez.

## Otomatik doğrulama kapsamı

- 25 işlem/beceri/düzey grubunun tümünde aynı gruptan 10 farklı, geçerli soru üretimi.
- 20 ilk yanıt, en az %90 bağımsız doğruluk ve yeterli çeşitlilik olmadan hız karşılaştırmasının açılmaması; açılmanın hıza bağlı olmaması.
- İlk yanıtın yalnızca bir kez kaydedilmesi; yanlış yanıttan sonra tekrar çözmenin ilk kaydı değiştirmemesi; ipucu ayrımı.
- Yarım tur veya 10 sorudan rekor çıkmaması; 20 bağımsız doğru yanıttan ilk ölçüm; en az %5 iyileşme olmadan rekor verilmemesi.
- Hatalı, ipuçlu, kesintili ve çok kısa yanıt içeren grupların hız ödülü alamaması.
- Günlük tek, toplam üç ek rekor ödülü; aynı tur tekrar tesliminin veya geriye alınan yerel tarihin ek yıldız üretmemesi. Yavaşlamanın mevcut rekor ve ödülleri azaltmaması.
- Eski kayıtların taşınması, Arena alanındaki bozulmanın diğer öğrenme ve ödülleri silmemesi; ödül/geçmiş/yıldızın tek cihaz kaydında tutulması.
- Etkin monoton süre, mola/arka plan dışlama, yeni soruda ölçümün yeniden başlaması ve geciken Android durum sorgusunun yeni olayı ezmemesi.
- Tarayıcıda hazırlık turları, açılma, kişisel rekor, ödül, ebeveyn grafikleri ve tablo, çevrimdışı yeniden açılış, mola ve günlük sınır entegrasyonu.
- Grafik/tablo ve mevcut ekranlarda WCAG A/AA otomatik kontrolleri; klavyeyle kaydırılabilir tablo ve mobil genişlik.
- İlk açılışta Sadece Efektler seçilmesi; Sessiz/Sadece Efektler/Müzik ve Efektler tercihlerinin yerel ve Android depolaması; eski on/off tercihinin korunması.
- Dört farklı motif; müzikal ekin yalnız rekor/tamamlamaya ait olması ve bir saniyeden kısa bitmesi. Sessiz modun konuşmayı da susturması.
- Tarayıcıda Müzik ve Efektler açıkken matematik, okuma ve dikkat görevlerine geçişin arka plan müziği başlatmaması. Rekor ödülünde Web Audio osilatörlerinin gerçekten oluşturulması.
- Mevcut matematik, okuma, dikkat, konser, karakter/özel ad, konuşma, çevrimdışı kayıt ve mola testleri.

## Sınırlar

Gerçek Android cihazda kurulum/önceki APK üzerine yükseltme, fiziksel hoparlör veya kulaklıkla dinleme, üreticiye özgü arka plan davranışı ve çocuklarla müzik/öğrenme değerlendirmesi yapılmadı. Native AppState davranışı otomatik testlerde taklit edilmiştir; fiziksel cihaz doğrulaması değildir. Otomatik ses testleri nota planını, üretilen ses düğümlerini ve medya akışını kontrol eder; insanın dinleyerek yaptığı değerlendirme yerine geçmez.

Rekorlar aynı beceri/düzeydeki rastgele soru havuzunun 20 yanıtlık ortalamalarıdır. İstatistiksel veya tıbbi gelişim ölçümü olarak sunulmaz. Bütün oyun verileri cihazda kalır; uygulama için yeni API, hesap veya internet gereksinimi eklenmedi. Web sürümünün ilk kurulumu ve PWA önbelleğinin tamamlanması internet gerektirir.

Ayrıntılı ürün kuralları: [ARENA-VE-SES.md](ARENA-VE-SES.md).
