# MATEMATİK SAHNESİ — CODEX PROJE DEVRİ VE GELİŞTİRME TALİMATI

**Tarih:** 20.10.2026  
**GitHub deposu:** https://github.com/smallsword82/manifestakademi  
**Depo erişimi:** Private (kullanıcının oluşturduğu depo)  
**Ürün:** Matematik Sahnesi — RİTMA grubuyla zihinden dört işlem macerası  
**Hedef çıktılar:** Android APK + mobil/masaüstü uyumlu web uygulaması (PWA)

## 1. Amaç ve hedef kitle

7–12 yaşındaki kız çocuklarının zihinden toplama, çıkarma, çarpma ve bölme becerilerini geliştiren, **sessiz, reklamsız, çevrimdışı oynanabilen, Türkçe** bir oyun geliştir. Başlangıç referansı, dört işlemi kâğıt üzerinde yapabildiği hâlde kafadan hesaplamakta zorlanan 10 yaşındaki bir çocuktur. Bu nedenle işlemlerin yazılı algoritmasını tekrar öğretmekten çok **sayı hissi, zihinsel stratejiler, akıcılık ve özgüven** üzerine yoğunlaş. İleride erkek çocuklarına ve başka temalara uygun sürümler aynı matematik motoruyla oluşturulabilsin.

Oyun klasik bir test ekranı değil; kız müzik grubunun konser hazırlığı için görevlerin tamamlandığı bir macera olmalı. Öğrenmede **önce doğruluk ve kavrayış, sonra akıcılık, en son hız** ilkesi uygulanmalı. Başlangıçta süre baskısı olmamalı.

## 2. Kesin ürün kararları

- **Tek kod tabanından web sitesi ve Android APK** üretilecek.
- Web: mobil ve masaüstü uyumlu, kurulabilir PWA; ilk yüklemeden sonra temel oyun çevrimdışı çalışacak. İlk ziyaretin dosyaları indirmek için internete ihtiyaç duyacağı açıkça belirtilmeli.
- Android: uygulama paketinin içindeki varlıklarla **internetsiz** çalışacak; çalışması için sunucu/API gerekmeyecek.
- Sessiz: sesli öğretmen, müzik, sesli komut veya TTS zorunluluğu yok. İlk sürüm tamamen sessiz.
- Yapay zekâ API'si, token tüketimi, abonelik, reklam ve izleyici/analitik SDK'sı olmayacak.
- Kullanıcı hesabı veya çocuklardan kişisel bilgi isteme yok. İlerleme cihazda yerel saklanacak.
- Türkçe arayüz; dokunmatik ekran, erişilebilir yazı boyutları, okunaklı renk kontrastı ve tablet uyumu.
- Hata yapınca can kaybetme, utandırıcı mesaj veya cezalandırma olmayacak.
- GitHub deposu şimdilik özel kalacak. Yayımlama kararı ayrıca verilecek.

## 3. Güncel teknoloji kararı (önceki Kotlin önerisini değiştirir)

**React + TypeScript + Vite + Capacitor + PWA** önerilir. Böylece web ile Android aynı matematik ve oyun kodunu paylaşır. Arayüz mobil öncelikli geliştirilir. Yerel ilerleme saklama için uygun, sürümlenebilir bir veri katmanı oluştur (ör. webde IndexedDB, Android'de Capacitor uyumlu depolama). Platforma özgü ayrıntıları soyutla. Gereksiz bağımlılıklardan kaçın.

Android için Capacitor projesi ve Gradle yapılandırmasını hazırla. Web için üretim derlemesi ve PWA servis çalışanı kur. Android APK'yı GitHub Actions üzerinden derleyen ve indirilebilir artifact olarak sunan iş akışı ekle. Derleme veya test doğrulanmadıysa başarılı olduğunu iddia etme.

## 4. Özgün müzik grubu: RİTMA

Başlangıçta gerçek Manifest üyelerinin kullanılması düşünülmüş, **telif, marka ve kişilik hakları riskleri nedeniyle bundan vazgeçilmiştir**. Gerçek kişilerin fotoğrafları, yüzleri, isimlerinin taklitleri, logoları, şarkıları, koreografileri ve ayırt edici sahne kimlikleri kullanılmayacak. Manifest'e çok benzeyen isimler üretmek de hedef değil. Amaç, çocukların sevebileceği **bağımsız ve özgün** bir kız müzik grubu yaratmak.

**Geçici grup adı: RİTMA** (yayımlanmadan önce marka araştırması ve hak kontrolü gerekir). **Oyun adı: Matematik Sahnesi** (aynı kontrol gerekir).

| Karakter | Öğrettiği alan | Önerilen kişilik |
|---|---|---|
| **Mina** | Toplama | Meraklı, çözüm yollarını keşfeder |
| **Lidya** | Çıkarma | Sakin, adım adım gösterir |
| **Derin** | Çarpma | Örüntüleri ve grupları fark ettirir |
| **Arya** | Bölme | Paylaşma ve ters işlem ilişkisini öğretir |
| **Zeyna** | Zihinden hesaplama stratejileri | Pratik kısa yolları gösterir |
| **Elya** | Karışık işlemler ve özel görevler | Görevleri birleştirir |

İsimler ve tasarımlar geçicidir; üçüncü taraf marka/karakter benzerliği denetiminden geçmeden kesinleştirilmez. Altı karakterin farklı renk paleti, kıyafeti, silüeti ve kişiliği olsun. Yaşa uygun, modern, enerjik, ancak gerçek sanatçıların görünüşlerine benzemeyen çizgi/oyun karakterleri kullan. Lisansı belirsiz web görsellerini projeye ekleme. İlk sürümde özgün SVG/CSS/Canvas çizimleri ve izinli font/ikonlar tercih edilebilir.

Önceki sohbette neon pembe-mor/turkuaz, konser sahnesi, karakter seçimi, matematik haritası, öğretici ekran ve yıldız ödüllerini gösteren bir **konsept görsel** oluşturuldu. Bu görsel Codex ortamında mevcut değilse kullanıcıdan iste; erişimin varmış gibi davranma. Konsept bağlayıcı nihai tasarım değil.

## 5. Oyun dünyaları ve akış

1. **Toplama Ormanı** — Mina
2. **Çıkarma Vadisi** — Lidya
3. **Çarpma Şehri** — Derin
4. **Bölme Adası** — Arya
5. **Zihin Atölyesi** — Zeyna
6. **Konser Görevleri** — Elya

Başlangıç akışı: açılış → isteğe bağlı yerel profil/karakter seçimi → süre baskısı olmayan kısa seviye yoklaması → uygun dünya ve görev → doğru/yanlış geri bildirim ve görsel strateji → yıldız/ödül → yerel ilerleme. Ödüller dekor, ışık, kostüm, dans animasyonu ve yeni sahne alanları açar; satın alma veya gerçek para yoktur.

## 6. Matematik pedagojisi ve soru motoru

**Toplama:** onluk tamamlama (8+7 → 8+2+5), parçalama, çiftler, yuvarlama.  
**Çıkarma:** onluk üzerinden geçiş, fark bulma, tersine toplama, parçalama.  
**Çarpma:** eş gruplar/diziler, tekrarlı toplama, ikiye katlama, 5 ve 10 ile ilişkiler, dağılma özelliği.  
**Bölme:** eşit paylaştırma, çarpmanın tersi, uygun katlar ve parçalama.

Soru üreteci matematiksel olarak doğru, seviyeye uygun ve test edilebilir olsun. Bölmede ilk seviyelerde tam sayı sonuçlar kullan. Her işlem ayrı seviyelendirilsin. Çözüm süresi, doğruluk, ipucu kullanımı, tekrar eden hata türleri ve öğrenilmiş stratejiler yerel olarak izlensin. Yalnızca yanlış cevaptan çocuğun düşünme sürecini kesin olarak çıkardığını iddia etme; bunun yerine uygun ipucu sun veya alternatif yöntem göster. Görsel destek aşamalı azaltılsın. Hız modu yalnızca çocuk yeterli doğruluk ve rahatlık gösterdiğinde devreye girsin. Kısa, yaklaşık 10 dakikalık oturumlar önerilsin; zorunlu günlük seri baskısı olmasın.

Çeşitli etkileşimler: çoktan seçmeli, sayı tuş takımı, eksik sayıyı bulma, sayı doğrusu, onluk çerçeve, kısa zihinsel işlem zincirleri. Çoktan seçmeli seçenekler makul çeldiriciler içersin; rastgele tahmin etmeyi tek başarı ölçütü yapma.

## 7. Uyarlanabilir öğrenme ve kayıt

- Her işlem için ayrı beceri düzeyi, doğru/yanlış, ipucu sayısı ve yanıt süresi.
- Zorlanınca kolaylaştırma, görsel strateji ve benzer soruyla yeniden deneme.
- Başarılı oldukça kademeli ilerleme; öğrenilmiş becerileri aralıklı tekrar etme.
- Ödül puanı ve matematik başarısını ayrı tutma; yalnızca hızla ödüllendirme yapma.
- Yerel veri formatını sürümlendir; çevrimdışı yeniden açıldığında ilerleme korunmalı.
- Hesap, bulut senkronizasyonu, reklam ve üçüncü taraf izleme yok.

## 8. Mimari ve kalite

Önerilen modüller: `math-engine` (soru, çözüm, strateji, seviye), `game` (görevler, ödüller), `ui` (ekranlar/animasyonlar), `storage` (yerel ilerleme), `platform` (PWA/Capacitor uyarlamaları). Sorumlulukları ayır. Matematik motoruna otomatik birim testleri yaz; seviye geçişleri, dört işlem doğruluğu, bölmede sıfır ve tam sayı sınırları, yerel kayıt ve yanlış cevap akışını test et. Erişilebilirlik ve küçük ekran düzenlerini kontrol et.

GitHub Actions: web build/test ve Android debug APK derlemesi. Mümkünse APK'yı artifact olarak sakla. Yayınlama/Play Store yükleme otomatik yapılmasın. Güvenli olmayan izinler veya gereksiz ağ erişimi ekleme. Web dağıtımında özel GitHub deposunun tek başına web sitesini gizli kılmadığını unutma; herkese açık yayımlamayı kullanıcı onayı olmadan yapma.

## 9. Aşamalı uygulama planı

**Aşama 1 — Çalışan temel:** Depoyu incele; boşsa proje oluştur. React/TypeScript/Vite, PWA ve Capacitor iskeleti; ana menü, karakter seçimi, toplama ve çıkarma; görsel ipuçları; yıldızlar; yerel kayıt. Web build ve testleri çalıştır.

**Aşama 2 — Android:** Capacitor Android entegrasyonu, APK build iş akışı, gerçek derleme doğrulaması ve indirilebilir artifact.

**Aşama 3 — Dört işlem:** Çarpma, bölme, karışık görevler; daha iyi uyarlanabilir öğrenme; öğretim stratejileri ve testler.

**Aşama 4 — Oyun deneyimi:** Matematik dünyaları, konser sahnesi, özgün karakter çizimleri, ödüller, geçiş animasyonları ve görsel iyileştirme.

**Aşama 5 — Ürünleştirme:** Tablet uyumu, erişilebilirlik, ebeveyn gelişim görünümü, veri/gizlilik incelemesi, lisans/marka kontrolü ve isteğe bağlı yayımlama.

## 10. Codex'e doğrudan görev

**Yalnızca plan yazıp durma; GitHub deposunda gerçek dosyalar oluşturarak çalışır ilk prototipi geliştir.**

1. `smallsword82/manifestakademi` deposunu aç, varsayılan dalı ve mevcut içeriği doğrula. Var olan dosyaları koru; gerekirse ayrı geliştirme dalı ve PR kullan.
2. Bu nottaki **güncel web + APK mimarisini** esas al. Eski yalnızca Kotlin/Jetpack Compose talimatı artık geçerli değil.
3. İlk teslimde ana menü, RİTMA karakter seçimi, toplama/çıkarma görevleri, onluk tamamlama ipucu, doğru/yanlış akışı, yıldız kazanma ve yerel kayıt gerçekten çalışsın.
4. Matematik motoru ve arayüz için testler ekle. Testleri ve web üretim derlemesini çalıştır.
5. Capacitor Android projesini ve GitHub Actions APK derleme iş akışını ekle; mümkünse başarılı APK artifact bağlantısını raporla. Gerçekten çalıştırılmayan derlemeyi başarılı gösterme.
6. Telif durumu belirsiz fotoğraf, müzik veya karakter görseli ekleme. İlk aşamada özgün, basit çizimlerle ilerle.
7. Değişiklikleri commit et, mümkünse PR aç; hangi dosyaları değiştirdiğini, hangi testleri geçtiğini, APK'nın gerçekten üretilip üretilmediğini ve sıradaki işleri özetle.
8. Kullanıcı açıkça istemeden herkese açık site yayımlama veya mağazaya APK yükleme.

**Başarı ölçütü:** Telefon ekranında oynanabilir, internetsiz kullanılabilir, Türkçe zihinden hesaplama öğretim mantığı çalışan bir prototip; aynı kod tabanından web çıktısı ve doğrulanabilir Android APK üretim yolu.
