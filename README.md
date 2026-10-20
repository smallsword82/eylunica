# Matematik Sahnesi · RİTMA

7–12 yaş için Türkçe, sessiz, reklamsız matematik, okuduğunu anlama ve dikkat macerası. Tek React / TypeScript kod tabanından PWA ve paket içi varlıklarla çalışan Capacitor Android uygulaması.

## Yerelde geliştirme

Node.js 22+ ve npm gerekir. Sunucu, API anahtarı veya kullanıcı hesabı yoktur.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

Bulut makinesindeki Chromium için `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e` kullanılabilir. Uçtan uca testler **üretim derlemesi** üzerinde çalışır; önce `npm run build` gerekir.

## Android debug APK

Java 21, Android SDK Platform 35 ve Build Tools 35.0.0 kurulu olmalı. `ANDROID_HOME` SDK dizinine işaret etmeli veya yalnızca yerelde `android/local.properties` içinde `sdk.dir` belirtilmeli.

```sh
npm ci
npm run android:apk
```

Çıktı: `android/app/build/outputs/apk/debug/app-debug.apk`. Debug anahtarı yalnızca geliştirme içindir, mağaza sürümü değildir. Gradle wrapper projede bulunur. İlk derleme bağımlılıkları internetten indirir; uygulama çalışırken sunucuya ihtiyaç duymaz.

GitHub → **Actions → Web tests and Android APK** → başarılı çalıştırma → **Artifacts → matematik-sahnesi-debug-apk**. ZIP dosyasını indirip içindeki APK'yı Android cihazına aktar. Workflow yalnızca derler, test eder ve artifact saklar; site yayımlamaz ve Play Store'a yüklemez. İmzalı mağaza dağıtımı ayrı bir iştir.

## 0.3.0 · Ebeveyn ayarları ve akıllı molalar

Varsayılan kullanım serbesttir. Önerilen günlük öğrenme süresi **15 dakika**; buna ulaşmak otomatik kapanma veya ek yıldız üretmez. İlk güvenli geçişte hedef bilgisi, 25. dakikadan sonraki güvenli geçişte mola önerisi gösterilir. Sonraki öneri, gösterilen öneriden sonra yaklaşık **20 etkin dakika** sonradır. Uzun bir soru yüzünden ikisi birden gecikmişse tek mesajda birleştirilir. Çocuk mola verebilir veya devam edebilir; görev durumu, yıldızlar ve öğrenme kaydı korunur.

Ebeveyn köşesinde:

- Serbest kullanım veya 1–1440 dakika arasında isteğe bağlı günlük sınır.
- Mola önerilerini açma/kapatma (15 dakika hedef bilgisi ayrı kalır).
- Bugün ve bugün dahil son yedi takvim günü için toplam ve matematik/okuma/dikkat/menü süreleri.

Sınır seçilirse **açık soru bitirilebilir, yeni soru/görev engellenir**. Uygulama kapanmaz. Ebeveyn paneli açık kalır; sınır kaldırılabilir veya değiştirilebilir. Yeni cihaz-yerel takvim gününde sayaç yeni günün kaydından başlar. Panel PIN ile kilitli değildir; bu bir uygulama içi sınırdır, işletim sistemi ebeveyn kilidi değildir.

Yalnız görünür ve ön plandaki kullanım sayılır. Ebeveyn paneli, mola ekranları ve arka plan hariçtir. Menü/lobi süreleri ayrıca sayılır; birleşik konserin her adımı ilgili akademiye yazılır. Webde görünürlük/odak olayları; Android'de ayrıca Capacitor App `appStateChange` kullanılır. Süre monotonic saatten hesaplanır, yerel gece yarısında günlere bölünür. Duvar saati değişikliği/kapanıp yeniden açılma aralığı oyun süresi yaratmaz. Yaklaşık beş saniyede bir ve geçiş/arka plan olayında kaydedilir; ani süreç sonlandırmasında son birkaç saniye kaybolabilir.

Yeni süre kaydı `ritma-wellbeing-v1` anahtarında sürümlüdür; mevcut `ritma-progress-v1` öğrenme kaydı ve yıldızlar değiştirilmez. Son 90 günün süre özeti cihazda tutulur; ağ, hesap veya API yoktur. Öğrenme ilerlemesini sıfırlama süre ayarlarını/sayacını silmez. Ayrıntılı test kapsamı `docs/SURE-VE-MOLA-TEST-RAPORU.md` içindedir.

## 0.2.0 · Üç akademi

- **Matematik Akademisi:** önceki dört işlem dünyaları, ipuçları, karakterler ve ödüller korunur.
- **Okuduğunu Anlama Akademisi:** üç düzeyde altı özgün hikâye, 36 soru. Kısa metinler, 4. sınıf paragraf çalışmaları ve 5. sınıf/üzeri çıkarım çalışmaları. Ana fikir, yardımcı fikir, neden-sonuç, çıkarım, olay sırası ve kelime anlamı; yanıtla birlikte metinden destekleyici cümle seçimi gerekir.
- **Dikkat ve Odaklanma Akademisi:** farklı kartı bulma, örüntü, şekil eşleştirme, görsel hafıza, sıralı yönerge ve ayrıntı okuma. Hafıza kartları zamanla kendiliğinden kapanmaz; çocuk hazır olduğunda kapatır, tekrar bakmak ipucu sayılır. Üç kademeli zorluk vardır. Tıbbi teşhis veya tedavi aracı değildir.
- **Büyük Konser Görevi:** aynı hikâyede okuma kanıtı, sahne işaretleri ve metindeki sayılarla zihinden hesap. Üç akademinin becerileri ayrı, konser görev istatistiği ayrıca kaydedilir; her adım en fazla bir yıldız kazandırır.
- Yeni akademilerde dört ipucusuz ilk-deneme başarısı önerilen düzeyi artırır; son üç denemenin en fazla biri doğruysa düzey kolaylaşır. Süre zorluk veya yıldızları etkilemez. Okumada daha kısa metin seçmek her zaman serbesttir; yeni hikâye önerisi düzeye ve daha az çalışılmış içeriğe dayanır.
- Ebeveyn köşesinde ilk deneme doğruluğu, ipucu kullanımı, bağımsız çözüm ve beceri ayrıntıları görülür. Bunlar standart başarı ölçümü değildir.
- Veri şeması v2'ye yükselir; mevcut `ritma-progress-v1` anahtarı **özellikle değiştirilmez**. V1 matematik becerileri, karakter, yıldızlar, geçmiş ve ödüller korunarak yeni alanlar eklenir. İlk kayıt işleminde yeni şema yazılır. Sonuçlar webde ve Android'de aynı yerel adaptörden geçer.
- Yeni içerikler de üretim servis çalışanının önbelleğinde ve APK içinde paketlenir. Harici API, hesap, veri aktarımı, görsel/font isteği veya yeni uygulama izni eklenmez.

İçerik havuzu başlangıç havuzudur; sınıf/yaş etiketleri destek önerisidir. İçerikler standartlaştırılmış eğitim değerlendirmesi veya klinik araç değildir. Tam bir müfredat, sınırsız hikâye veya tıbbi ölçüm sunulmaz.

## Korunan matematik temeli

- Altı özgün SVG karakter, altı dünya ve konser sahnesi.
- Dört işlem, işlem başına 5 seviye, tam sonuçlu / sıfıra bölmesiz bölme.
- İsteğe bağlı dört soruluk başlangıç yoklaması; baskısız beş soruluk görevler.
- Seçenek veya sayı girişi; yanlış yanıtta strateji, tekrar deneme; onluk tamamlama.
- İşlem başına doğruluk, ipucu, ilk yanıt süresi ve yakın geçmiş. Beş ipucusuz doğruyla yükselme, zorlanınca kolaylaştırma.
- Cihazda sürümlü kayıt; karakter ve yıldızlar; 5 yıldızda sahne ışıkları.
- Ebeveyn köşesi ve onaylı veri sıfırlama.

Yıldızlar hızdan bağımsızdır. Soru başına ilk yanıt kaydedilir; yanlış sonrası tekrar deneme kayıt veya yıldızları çoğaltmaz. Bu basit ilk sürümün uyarlama kuralları pedagojik/klinik ölçüm değildir.

## Çevrimdışı ve gizlilik

Web ilk ziyarette internet ister. Üretim derlemesinin servis çalışanı oyun varlıklarını önbelleğe alır; hazır olduktan sonra yeniden açma ve oyun çevrimdışı çalışır. Kurulabilir PWA için HTTPS (yerelde localhost) gerekir. Tarayıcı önbelleğini/verilerini temizlemek çevrimdışı dosyaları ve ilerlemeyi silebilir. Android oyun dosyalarını APK içinde taşır; PWA servis çalışanı Android içinde kaydedilmez.

Webde localStorage, Android'de Capacitor Preferences kullanılır; depolama erişim hataları kullanıcıya bildirilir. Kayıt yalnızca cihazdadır. Hesap, bulut senkronizasyonu, reklam, üçüncü taraf analitik, AI API veya harici font/görsel isteği yoktur. Çocuklardan kişisel bilgi istenmez.

## Mimari

`src/math-engine`: üretim ve strateji; `src/reading-engine`: özgün metinler/kanıt kontrolü; `src/attention-engine`: dikkat görevi üretimi; `src/concert-engine`: birleşik hikâye görevleri; `src/learning-engine`: ortak uyarlama/ölçüm; `src/storage`: sürümlü kayıt ve uyarlama; `src/game`: dünyalar ve karakter tanımları; `src/ui`: özgün çizimler; `src/App.tsx`: ekran ve görev akışı. `capacitor.config.ts` ve `android/` paketleme; `vite.config.ts` PWA önbelleği.

## Sonraki aşamalar

Eksik sayıyı bulma, etkileşimli sayı doğrusu, gerçek aralıklı tekrar planlayıcısı, strateji ustalığı modeli, süreli modun isteğe bağlı açılması, daha çeşitli görevler ve dekor/kostüm sistemi henüz tamamlanmadı. Gerçek Android cihazında erişilebilirlik ve uçak modu testi ayrıca yapılmalı. Prototip telefon ve masaüstü Chromium testleri bu gerçek cihaz kontrolünün yerine geçmez.

RİTMA / Matematik Sahnesi adları ve karakter isimleri geçicidir; yayımdan önce marka ve hak incelemesi gerekir. Gerçek müzik gruplarının görselleri veya müzikleri kullanılmaz. Kullanıcı onayı olmadan herkese açık dağıtım yapılmaz.

## Bu bulut ortamı

Hazırlanmış makinede `source scripts/cloud-env.sh` Android SDK/JDK yollarını ve Java'nın desteklediği proxy/CA ayarlarını etkinleştirir. Yeni Linux x86_64 makinesinde `bash scripts/setup-cloud.sh` bağımlılıkları ve Android araçlarını kurar; indirmeler resmi kaynak ve yayımlanmış checksum ile doğrulanır. Proje dosyaları/lockfile kurulumda değiştirilmez. SDK lisans kabul girdisi bu kurulum betiğinin parçasıdır.

Ortam zaten yalıtılmıştır; mevcut `/workspace/manifestakademi` checkout'unda çalışın, kullanıcı istemedikçe Git worktree oluşturmayın. Geliştirme sunucusu: `npm run dev -- --port 5173 --strictPort`. Üretim servis çalışanı geliştirme modunda etkin değildir; çevrimdışı doğrulamada `npm run build` ve `npm run preview` kullanılır. Süreçler yeni görevde yeniden başlatılmalıdır.

## Herkese açık web test sitesi

Web test sitesinin yayımlanması kullanıcı tarafından onaylandı. Kaynak depoyu özel tutun. GitHub'da **Settings → Pages → Build and deployment → Source: GitHub Actions** ayarının açık olması gerekir; bu ayarı açmak mevcut bulut bağlantısının Pages API yetkisini aştığı için depo sahibi tarafından yapılabilir.

**Actions → Publish web test site → Run workflow → main** iş akışı web testlerini ve üretim derlemesini çalıştırır, yalnızca `dist/` dizinini Pages'e yayımlar. Gerçek site adresi başarılı `deploy` işinin `github-pages` ortam bağlantısında bulunur. İş akışı elle tetiklenir; sonraki Git push'ları kendiliğinden siteyi yayımlamaz. Kaynak depo, test raporları ve APK dosyaları bu siteye yüklenmez. PWA'nın göreli varlık yolları proje alt dizini ile uyumludur. Site ilk açılışta internet gerektirir; önbellek hazır olduktan sonra çevrimdışı oyun kullanılabilir.


### 0.3.1: karakter adları ve kısa sesler

RİTMA kadrosu Mina, Eylül, Alara, Beren, Öykü ve Defne. Önceki karakter seçimleri aynı görünümün yeni adına taşınır; yıldızlar ve öğrenme kayıtları korunur. Karakter ekranında hazır bir ad seçilebilir veya seçilen görünüme en fazla 24 karakterlik bir ilk ad verilebilir. Tek bir özel ad tutulur; başka görünüme atanınca önceki görünümün hazır adı geri gelir. Bu bilgi yalnızca cihazdaki mevcut ilerleme kaydında tutulur ve istenildiğinde kaldırılabilir; hikâyeler özgün kurgu adlarını kullanır.

Üstteki **Ses efektleri** düğmesi kısa doğru cevap, yeniden deneme, yıldız ve tamamlama seslerini açar/kapatır. Varsayılan kapalıdır; tercih webde localStorage, Androidde Preferences içinde `ritma-audio-v1` anahtarında saklanır. Efektler Web Audio ile özgün olarak üretilir; ses dosyası indirme, internet, mikrofon, sürekli müzik veya konuşma API'si yoktur. Ses desteği olmasa da öğrenme akışı sürer. Sekme gizlenince, odak kaybolunca, mola penceresi açılınca veya ses kapatılınca çalmakta olan efektler kesilir. Ses düzeyi cihazın medya sesine de bağlıdır. Türkçe konuşmalı seslendirme bu sürüme dahil değildir.
