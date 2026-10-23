# Video taraması · 23 Ekim 2026

Kullanıcı isteğiyle tarama **baştan** yapıldı (önceki `.tools/video-admin/state.json` bulunamadı). Kanal kısıtı korundu: yalnız `tonguç 5. SINIF` (`UCb-0JQ4tI03T5rHdFe2GVoA`). Kapsam, öğrenci kitaplığındaki 7 ders (`course-0` … `course-6`); kota tek günde yetti.

Çalıştırma: `node --experimental-strip-types tools/video-admin/run-research.mjs` (`YOUTUBE_API_KEY` gerekli). İlerleme her aramadan sonra depodaki `data/video-research/state.json` dosyasına yazılır; kota dolarsa bir sonraki çalıştırma kaldığı yerden sürer. Yönetim sunucusu (`tools/video-admin/server.mjs`) da varsayılan olarak bu dosyayı kullanır.

| Ölçüm | Sonuç |
| --- | ---: |
| Arama sorgusu | 83 |
| Taranan konu | 207 / 207 |
| Aday bulunan konu | 60 |
| Aday bulunmayan konu | 147 |
| Benzersiz aday video (2026 / 2025) | 44 (36 / 8) |
| Konu–video eşleşmesi | 97 |
| Aday bulunan ders | 6 (Almanca'da yok) |
| Onaylı video | 0 |

Adaylar `pending` durumundadır. Konu eşleştirmesi başlık sözcüklerine dayanır ve hatalı eşleşmeler içerir (ör. "Güneş" konusuna "Ay" videosu). Öğrenci uygulamasına yalnız müfredat ve çocuk güvenliği incelemesinden geçen videolar aktarılır; mevcut 36 videoluk katalog değiştirilmedi.

---

## Önceki tarama · 21 Ekim 2026

**Güncel tercih:** Video araştırması kullanıcı isteğiyle duraklatıldı. Kaydedilmiş kota zamanı artık otomatik devamı başlatmaz; önce ders anlatımları, alıştırmalar ve yazılılar üzerinde çalışılır. Önceki sonuçlar korunur.

Tarama **tamamlanmadı**: YouTube API, 429 `rateLimitExceeded` ve günlük kota sınırı bildirdi. İlerleme kaydedildi; yeni istekler durduruldu. Servis yeniden başlatılarak da doğrulandı: kota engeli ve kayıtlı devam zamanı korunuyor; yenilenme saatinden önce yeni API isteği yapılmıyor.

| Ölçüm | Sonuç |
| --- | ---: |
| API tarih doğrulaması olan 2026 adayları (benzersiz video) | 5 |
| API tarih doğrulaması olan 2025 adayları (benzersiz video) | 3 |
| Toplam benzersiz aday | 8 |
| Aday bulunan ders/program | 4 |
| Aday ilişkisi bulunan konu | 14 |
| 2026 ve 2025 araması yapıldığı halde adaysız konu | 80 |
| İlk aşamada sonuçlandırılan konu (aday bulundu veya iki yıl arandı) | 94 |
| Eksik taraması kalan konu | 630 |
| Güncel araştırma listesi | 724 |
| Öğrenci kataloğuna onaylanıp aktarılmış video | 0 |

724 kayıt, resmî kaynaklardan alınan 722 konu ile korunan 2 örnek çalışmadan oluşur. Önceki 418 konunun ilk yıl tarama işaretleri ve sonuçları sıfırlanmadı. Yeni doğrulanan seçmeli ders/modül konuları eklendi. Tarama bekleyen 630 konu “videosu bulunamadı” sayılmaz. 8 aday, 14 konuya ayrı metin eşleşmesiyle ilişkilendirildi; bu ilişki müfredat veya çocuk uygunluğunun onaylandığı anlamına gelmez. Hiçbir konuya alakasız video doldurmak için otomatik onay verilmedi.

Makinece okunabilir sayılar: [VIDEO-RESEARCH-REPORT.json](VIDEO-RESEARCH-REPORT.json). Kamuya açık video bağlantıları ve API metadata özeti: [VIDEO-CANDIDATES.json](VIDEO-CANDIDATES.json). Tam yerel araştırma geçmişi ve sorgu önbelleği ignored `.tools/video-admin/state.json` dosyasındadır. Bu aday dosyaları öğrenci uygulamasına dahil değildir.

## Uygulanan kurallar

- Yayın aralığı **01.01.2025–31.12.2026**. Önce 2026, yetersizse 2025 sorgulanır; 2024 ve öncesi araştırma aralığına alınmaz.
- Yayın tarihi, API kaynağı ve metadata alınma zamanı doğrulanmadan onay verilemez. Tarihsiz/elle yazılmış tarihli kayıtlar yayımlanamaz. Aynı kural yönetici onayı, JSON aktarımı ve öğrenci okuyucusunda uygulanır.
- Var olan uygun adayı olan konu için yeni API araması yapılmaz. Var olan tarama işaretleri ve videolar kullanılır. Aynı dersin benzer konuları en fazla altılı gruplarda aranır; video birden fazla konuya yalnız ayrı eşleşme kontrolüyle önerilir.
- İlk öncelik her derste bir uygun adaydır. Alternatif araması için fazladan API isteği bu turda yapılmaz. İnsan incelemesinden sonra eldeki uygun adaylardan bir ana ve varsa bir alternatif seçilebilir.
- İstekler arasında en az 1,2 saniye vardır. İlerleme her sorgudan sonra ve büyük ders gruplarında her 50 konu işlenince atomik kaydedilir.
- Kısa süreli 429 için `Retry-After` ve artan geri çekilme uygulanır; iki beklemeli tekrardan sonra duraklatılır. Günlük kota tespitinde hemen durur; sonraki Pasifik gece yarısından 5 dakika sonrasına otomatik devam zamanı kaydeder. Yaz/kış saati ve daha uzun `Retry-After` korunur. Bekleme bitene kadar API çağrısı yapılmaz; arama düğmesi de beklemeyi aşamaz. Eski videoya veya engel aşmaya yönelmez.

## Devam ve doğrulama

Kaydedilen sonraki devam zamanı **21 Ekim 2026 07:05 UTC / 10:05 Türkiye saati**. YouTube günlük kota sıfırlaması `America/Los_Angeles` gece yarısıdır; 5 dakikalık tampon kullanılır. Yönetici servisi çalıştığı sürece zamanlayıcı en geç bir dakika içinde yalnız eksik işlerden devam eder. Bulut ortamı kapalıysa işlem çalışmaz; servis açıldığında kayıtlı saat geçmişse kaldığı yerden devam eder. Tekrar kota dolarsa sonuçlar yeniden kaydedilip sonraki döneme beklenir. Anahtarı yeniden vermek gerekmez. Kuyruk ve önbelleği silmeyin; 418 eski konuyu baştan taramayın. Tarama ve rapor sayımları artık 24 saat sonra unutulmaz.

Son doğrulama: üretim derlemesi geçti; **175 birim/bileşen testi, 29 API/katalog/yönetici testi ve 7 seçili tarayıcı testi geçti**. Tarayıcı testleri eski oyun akışlarını, çevrimdışı ilerlemeyi, altı soru türünü ve resmî fen konusu/hafta/çıktı görünümünü kapsar. Canlı API bağlantısı ve günlük kota engeli önceki turda gözlendi. Bu değişiklikte gerçek API kotası harcanmadı; kota bitişi, zamanı gelen devam ve yeniden başlatma davranışı sahte API ile sınandı. Gerçek yerel durumun 418 tarama kaydı, 90 sorgu önbelleği ve 31 video ilişkisi bire bir korundu. Çocuk uygunluğu/öğretmen içerik onayı yapılmadığı için öğrenci video kataloğu boş bırakıldı.
