# Eylunica · 2026–2027 geliştirme durumu

Mevcut React/TypeScript/Vite PWA ve Capacitor kabuğu korunur. Matematik, okuma, dikkat, konser, Arena, karakterler, sesler, kartlar ve ebeveyn sınırlarına dokunulmadan ana ekrana “5. Sınıf Derslerim” eklenmiştir. Eski `ritma-progress-v1` kayıtları dönüştürülmez; yeni çalışma kayıtları ayrı `eylunica-grade5-v1` anahtarındadır.

## Güncel öncelik: birinci dönem

Kullanıcı isteğiyle çalışma önceliği ilk döneme alınmıştır. Doğrulanmış yıllık plandaki 1–18. haftalarda 157 konu kaydı, 156 hazır anlatım ve 974 soru ilişkisi vardır. Varsayılan öğrenci filtresi ve yeni yazılılar ilk dönemdir; aynı ünite iki döneme yayılmışsa sorular konu haftasına göre süzülür. İki döneme yayılan konular iki kapsamda da görünür. Haftası belirtilmeyen 421 konu kaydı tahminen sınıflandırılmaz; ayrı filtre ve tüm yıl seçeneğiyle erişilir. İkinci dönem verileri ve eski yazılı kayıtları korunmuştur.

Kaynak karşılaştırmasında 77 soru ilişkisinin kök/çeldiricileri düzeltildi ve 15 özgün bağlamlı soru eklendi. Genel toplam 2259 soru ilişkisidir; bunlar çıkmış MEB soruları değildir. Bireysel kaynak karşılaştırması 92 ilişkide, ilk dönem kapsamında 48 ilişkide kayıtlıdır. Tüm bankanın içerik doğrulaması tamamlanmış değildir. Kaynaklar ve kapsam: [QUESTION-REVIEW-REPORT.md](QUESTION-REVIEW-REPORT.md).

## Resmî program verileri

`src/grade5/official-curriculum.json`, MEB TYMM sınıf/ders/ünite uçları ve 2026–2027 taslak yıllık planlarından çıkarılmış **47 program başlığı, 240 ünite/tema, 722 konu ve 1374 ünite öğrenme çıktısı kaydı** içerir. 303 konuda plan haftaları vardır. Her kayıtta kaynak adresi, doğrulama tarihi; ünite/plan belgelerinde SHA-256 ve planlarda sayfa/satır yerine çalışma sayfası/satır izi saklanır. Çıktılar program/hafta kapsamıyla gösterilir; her içerik satırının tek bir çıktıyla birebir eşleştiği iddia edilmez.

Talim ve Terbiye Kurulunun **23.09.2026 tarihli 115 sayılı**, 2026–2027'den itibaren uygulanan resmî haftalık ders çizelgesi doğrulandı: 5. sınıfta **30 zorunlu + 5 seçmeli = 35 saat**. Kaynak PDF bağlantısı uygulamada ve JSON `timetable` alanındadır; indirilen belge `.tools/curriculum-sources/timetable-2026.pdf` dosyasındadır. Normal İngilizce, Çoklu Yabancı Dil Modeli İngilizce ve Almanca ayrı programlardır. Çoklu dil modeli için standart çizelgedeki yabancı dil saati otomatik varsayılmaz.

Seçmeli dersler, çizelgede 5. sınıfta seçilebilen modüler programlardan gelir; 5–8. sınıf modüllerinin düzeyi okulun planına göre belirlenir. Standart ve çoklu dil filtresi mevcuttur. Kaynağın yayımlamadığı hafta/çıktı alanları boş kalır.

**Eksikler:** 47 programdan 9'unda yapılandırılmış konu kaydı henüz yoktur: yedi seçmeli müzik dalı, Temel Dinî Bilgiler ve Rehberlik/Yönlendirme. Bu programlar çizelgedeki varlıkları nedeniyle listelenir; konu ve soru varmış gibi gösterilmez. Bütün içeriğin ve okulun seçmeli ders kombinasyonunun tamamlandığı iddia edilmez.

## Öğrenci akışı ve içerik kapsamı

Ders → ünite/konu → açıklamalı anlatım → adımlı örnek → alıştırma/konu testi → yanlış tekrarı akışı çalışır. **32 ders/programda 362 konu için anlatım ve örnek çözüm, 2259 soru kaydı (güncel farklı metin sayısı içerik raporunda)** vardır. Bunların 360 konu paketi yenidir; iki eski örnek ve sekiz örnek soru korunmuştur. Tekrar eden program başlıkları aynı kavram çalışmasını paylaşabilir. Kapsam ve eksiklerin tam listesi: [GRADE5-CONTENT-REPORT.md](GRADE5-CONTENT-REPORT.md), [JSON](GRADE5-CONTENT-REPORT.json).

Türkçe, matematik, fen, sosyal, İngilizce (iki model), Almanca, din kültürü, bilişim, görsel sanatlar, müzik ve beden eğitimi ana içerikleri eklenmiştir. Türkçede iki parçalı/belirsiz kaynak başlığı açıkta bırakılmıştır. Afet Bilinci bütün mevcut konularıyla, diğer 19 seçmeli program birer giriş konusuyla desteklenir. Kaynak program özeti bağımsız anlatım sayılmaz. İçeriği tamamlanmayan konu hazır gösterilmez; resmî program/hafta/çıktı bilgileri korunur.

Sorular Eylunica'nın özgün hazırlık materyalidir, resmî MEB sorusu veya öğretmen onaylı materyal iddiası taşımaz. Bire bir çıktı eşleştirmesi yapılmayan sorularda çıktı kodu boş kalır; program/ünite kapsamı ayrı gösterilir. Çoktan seçmeli, doğru/yanlış, boşluk, metinle eşleştirme/sıralama ve görsel sorular çalışır. Doğru seçenek konumu kalıcı bir ipucu oluşturmaz. Dil cevapları ilgili dilin büyük/küçük harf kuralını, düz/kıvrımlı kesme işaretini; matematik yüzdeleri iki işaret konumunu ve ondalık ayırıcıları destekler.

Son 500 cevap, ipucu kullanımı, yanlış tekrarı, oturumda tekrarı önleme ve konu bazında zorluk yönlendirmesi cihazda tutulur. Soru başlangıçları ebeveyn geçiş/sınır işlevinden geçer; molada cevaplama kapatılır. Oyun kaydı dönüştürülmez. Android Preferences adaptörü ve ders bazında ayrı zaman dökümü yeni modülde henüz yoktur.

## Yazılı hazırlığı

Ders ekranında **Yazılı testleri** açılır. Öğrenci işlenen üniteleri seçer; 10 veya 20 soru hedefi hazır havuzla sınırlanır. Konu ve zorluklar dengelenir, bir oturumda aynı soru metni tekrarlanmaz. Süre baskısı yoktur. İpucu/cevap/çözüm bitişe kadar gösterilmez; boşlarla bitirme ayrı onay ister. Sonuç 100 üzerinden puanı, doğru/yanlış/boşları ve konu dökümünü, ardından cevap anahtarı ile açıklamaları içerir.

Yarım yazılının soru ve cevapları ayrı `eylunica-grade5-exams-v1` anahtarına otomatik kaydedilir. Yeniden açılışta aynı çalışma sürdürülür; son 20 sonuç saklanır. Biten yazılının yanlış ve boşları konu tekrarına katılır. Kayıt yeri kullanılamazsa öğrenciye oturumluk devam uyarısı gösterilir. Bu akış gerçek okul yazılısı, dönem kapsamı veya sınav tahmini değildir; kapsamı öğretmenin planına göre öğrenci seçer.

Anlatım, örnek, soru ve yazılılar PWA üretim önbelleğinde çevrimdışı çalışır. Müfredat ve ders paketleri ayrı derleme dosyalarına bölünerek önbelleğin 2 MiB dosya sınırı korunmuştur; ana oyun başlangıcı bu paketleri yüklemeye zorlanmaz.

## Otomatik video araştırması

Video çalışması kullanıcı isteğiyle duraklatılmıştır (`research.pausedByUser=true`). Yönetici servisini otomatik başlatmayın; kota yenilense veya servis yeniden açılsa da yeni arama yapılmaz. Sonuçlar ve 418 konunun geçmişi korunur. Önceki canlı sonuçlar ve tarih kuralları: [VIDEO-RESEARCH-REPORT.md](VIDEO-RESEARCH-REPORT.md).

```sh
cd /workspace/eylunica
NODE_USE_ENV_PROXY=1 node tools/video-admin/server.mjs
```

Yönetici aracı yalnız loopback 4180'de çalışır; genel ağa açılmamalıdır. Manuel bağlantı girme veya Google'da elle arama akışı yoktur. Resmî YouTube Data API v3, kaynak konuları otomatik araştırır. `YOUTUBE_API_KEY` yalnız bu sunucunun ortamında, `www.googleapis.com` için güvenli bağlama olarak kullanılır. Anahtarı sohbete, kaynak koduna, `VITE_` değişkenlerine veya kataloğa yazmayın. Anahtar canlı istekte doğrulanmıştır. Node 24.19.0 ve `NODE_USE_ENV_PROXY=1`, mevcut HTTPS proxy/CA yolunu korur; TLS doğrulaması kapatılmaz.

İlk turda bütün derslerde bir aday önceliklidir; benzer konular gruplandırılır ve ayrı eşleştirilir. Var olan uygun adaylar ve 418 eski tarama işareti korunur. Alternatif araması ikinci aşamadır. Öğrenci yalnız `src/grade5/video-catalog.json` içindeki insan onaylı kayıtları okur; öğrenci açılışında API veya yönetici bağlantısı yoktur. Onay için API yayın tarihi, müfredat uyumu, çocuk uygunluğu, inceleyen ve kanıt notu gerekir. Puanlar bu kontrollerin yerine geçmez.

Yayın penceresi 2025–2026'dır. Tarih/kanıt denetimi yönetici, dışa aktarıcı ve öğrenci okuyucusunda ortak `video-policy.ts` ile uygulanır. Öğrenci videosu ebeveyn bilgilendirmesi ve açık onaydan sonra resmî YouTube gizlilik geliştirilmiş iframe ile açılır. Mola veya sekme gizlenmesi oynatıcıyı kapatır. Video indirilmez. Metin/soru/oyun/ilerleme çevrimdışı çalışır. Tam çocuk gizliliği ve YouTube üretim politikası incelemesi ayrıca gereklidir.

Yerel durum ignored `.tools/video-admin/state.json` dosyasındadır. Her sorgudan sonra ve en geç 50 konu işlenince kaydedilir. Kota veya hız sınırı nedeniyle yarım kalan iş korunur. Günlük kota dolunca tarama durur; sonuçlar ve sonraki `America/Los_Angeles` gece yarısından 5 dakika sonrası kaydedilir. Yaz/kış saati ve daha uzun `Retry-After` korunur. Bekleme bitmeden düğme veya yeniden başlatma yeni API isteği üretemez. Servis açıkken zamanı gelen iş en geç bir dakika içinde otomatik devam eder; ortam kapalıysa yeniden açılan servis yalnız eksikleri sürdürür. Tamamlanan tarama kayıtları ve rapor sayıları 24 saat sonra silinmez. Onaylı JSON aktarımı sonrası `npm run build` gerekir; aktarım site yayımlamaz.

## Kurulum ve testler

Mevcut `/workspace/eylunica` checkout'unu kullanın; ortam zaten yalıtılmıştır. Kullanıcı istemedikçe Git worktree oluşturmayın. Node 24.19.0 ve npm ile çalışır; bağımlılıklar gerektiğinde frozen `npm ci` ile yenilenir.

```sh
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
```

```sh
npm test -- --maxWorkers=4
node --test tools/video-admin/*.test.mjs
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=1
```

Güncel ilk dönem/kaynak düzeltmesi turunda **228 birim/bileşen ve 18 ders/yazılı tarayıcı testi geçti**; TypeScript kontrolü ve üretim/PWA derlemesi başarılı. API/yönetici için önceki turdaki 30 test ve eski oyun akışları için önceki tarayıcı sonuçları bu tur yeniden çalıştırılmadı. Tarayıcı kontrolleri 12 ana ders/programın anlatım–örnek–alıştırma akışını, çevrimdışı ders/yazılı çalışmasını, yarım yazılıda aynı cevaplarla devamı, puan/boş/yanlış tekrarını ve eski oyun/veri akışlarını kapsar. Geniş önceki tarayıcı turunda mevcut 53 test geçmişti; 4 çevrimiçi hesap/lig testi mevcut kapalı-mod koşullarıyla atlanmıştı. Son değişikliklerde bütün geniş küme yeniden çalıştırılmadı. Mobil görünüm ve yatay taşma ayrıca kontrol edildi. Ders anlatımı ve yazılı hazırlığı için ek erişilebilirlik kontrolü yapıldı. Üretim derlemesindeki büyük JS parçası uyarısı engelleyici değildir; ders modülü ayrı yüklenir.

Kaynak aktarım araçları `tools/curriculum/import.py` ve `build.py` dosyalarındadır. İkincisi bu makinede hazır `openpyxl` ve `xlrd` kullanır; resmî ZIP/PDF ve HTML önbelleği `.tools/curriculum-sources` altında korunur. Verileri yenilemeden önce kaynak program yılı ve TTKB kararı kontrol edilmeli; tarama önbelleği silinmemelidir.

## Kalan işler

Video taraması kullanıcı isteğiyle beklemektedir. 362 mevcut konu kaydında bağımsız anlatım/soru paketi henüz yoktur; seçmelilerin çoğunda yalnız giriş dersi vardır. Bölgesel dil içerikleri, dokuz konusuz programın kaynak çıkarımı, bütün konularda 50 soru hedefi, öğretmen içerik incelemesi, Android kayıt/APK ve gerçek cihaz testleri tamamlanmış değildir. Uygulamalı etkinliklerdeki bilgi testi, fiziksel/sanatsal performansı ölçmez. Müfredattaki iki belirsiz Türkçe başlık parçası uydurulmamıştır.

Başlangıç geri dönüş noktası `46136e1240a0040e6b6c0d02852480530b36ef03`; doğrulanmış Git arşivi `/workspace/onboarding-backups/eylunica-before-grade5.bundle` dosyasında durur. Kurulum/başlangıç talimatları ortam taslağına kaydedilir. Taslak kaydı çalıştırma, değişken enjeksiyonu, site veya ortam yayımlama değildir; canlı süreçlerin yeni görevde yeniden başlaması gerekir.

## Netlify yayın hazırlığı

Mevcut main dalındaki kart paketi animasyonu güncellemesi korunarak ders modülü birleştirildi. Birleşmiş sürümde 231 birim/bileşen testi ve 24 ders/yazılı/kart/oyun tarayıcı testi geçti; TypeScript ve üretim/PWA derlemesi başarılı. Netlify ayarı `npm run build` ve `dist` kullanır. Yayın için main dalına gönderim yapılır; bu ortamda Netlify alan adına HTTP erişimi ağ politikası tarafından reddedildiğinden canlı yayın sonucu ayrıca doğrulanmalıdır.
