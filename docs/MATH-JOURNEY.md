# Matematik: dokunmatik keşif yolculuğu

Matematik kitabı, ilk dönemle açılan dört duraklı sayfalardan oluşan oyun haritasına gider. Fazla dersler geri eklenmez: öğrenci kitaplığı yedi ana dersle sınırlıdır. Matematikte 19 müfredat konu kaydı ve korunmuş bir ek örnek bu akışa bağlıdır. Tüm yıl/dönemi belirtilmeyen çalışmalar ayrı kapsam seçenekleriyle korunur.

## Sahne ve ilerleme

Keşif modeli → kısa anlatım adımları → çözümlü örnek adımları → 8 alıştırma → 20 soruluk konu testi. Her sahne tek göreve odaklanır. Sürekli sabit bir devam düğmesi yoktur: model değiştirildiğinde, anlatım adımı onaylandığında veya soru tamamlandığında görsel kapı belirir. Yanlış alıştırmada yeniden deneme veya çözümü inceleme seçilir; konu testi/yazılı cevapları bitişe kadar doğru/yanlış olarak açıklanmaz.

Harita ders/anlatım, alıştırma ve test rozetlerini saklar. Seçilen kapsamdaki bütün durakların üç aşaması tamamlanıp konu testlerinden en az 70 alınınca mezuniyet kapısı açılır. Verilen belge uygulama içi bir başarı belgesidir. `eylunica-math-journey-v1` yalnız bu ilerlemeyi tutar; eski oyun, ders ve sınav kayıtları dönüştürülmez veya silinmez.

## Soru setleri ve çeşitlilik

Her matematik konu kaydı için 40 alıştırma, 80 konu testi ve 80 yazılı soru kaydı vardır: toplam 4 000 yeni ilişki. Bunlar konuya özgü ölçme, eksik veriyi bulma, karşılaştırma, hesaplama ve görsel yorumlama şablonlarının parametreli varyantlarıdır; 4 000 bağımsız problem türü veya çıkmış MEB sorusu değildir. Tekrarlanan müfredat başlıkları kavram şablonlarını paylaşır. Kaynak/çıktı eşleştirmesi veya öğretmen onayı uydurulmaz.

Oturumda alıştırma için 8, konu testi için 20, yazılı için 10 veya 20 yeni soru seçilir. Seçim görev ailelerini dengeler. Üç amaç için soruların metinleri konu içinde ayrıdır; kaydedilmiş çözümlerin kimlikleri ve metinleri, diğer müfredat başlığı altındaki kopyalar dahil, yeni seçimden çıkarılır. `eylunica-math-used-v1` soru tüketimini saklar. Havuz yeni oturum hedefini karşılamazsa otomatik başa sarılmaz; kapsam değiştirme açıklaması gösterilir. Kasıtlı alıştırma yeniden denemesi aynı görev içinde yapılabilir. Depolama başarısızsa süreklilik uyarısı gösterilir.

## Dokunmatik, görsel çözüm ve not

Cihaz klavyesi gerekmez. Sayısal yanıtlar ekran içi tuşlarla, seçenekli sorular dokunarak verilir. Eski yazılıların sıralama/eşleştirme türleri için dokunmatik seçim desteği de vardır. Soruda, ipucunda ve çözümde aynı SVG model kullanılır. Bilinmeyen kenar ve değerler çizim/açıklamada gizlenir; çözümler cevap ve işlem gerekçesini birlikte gösterir. Şekiller hesaplanan verilere dayanır; öğretici içerik görüntü üreticisinin yazdığı sayılara bırakılmaz.

Yazılı sonunda 100 üzerinden not, doğru/yanlış/boş dökümü ve tek tek görselli çözümler açılır. Her doğru aynı puan getirir; yanlışlar ayrıca puan düşürmez. Boş bırakma desteklenir. Taslak yanıtlar ve biten sonuçlar mevcut `eylunica-grade5-exams-v1` alanında saklanır; önceki yazılı taslağına devam edilebilir. Kullanıcı yeni yazılı başlatırsa eski taslağın değişeceği açıklanır. Gerçek okul yazılısı veya gelecek sınav tahmini iddiası yoktur.

## Ses ve hareket

Matematiğe giriş Manifest oynatımını durdurur. Hafif sözsüz fon ve kısa cevap sesleri Web Audio ile özgün sinüs tonlarından üretilir; üçüncü taraf müzik kaydı/sanatçı örneği kullanılmaz. Yeni ses düğmeleri eklenmez. Mevcut sessiz/efekt/müzik ve ses düzeyi tercihi uygulanır. Fon sadece müzik modunda, kısa efektler sessiz dışındaki modlarda çalışır. Mola, görünmez sekme ve video sahnesi fonu durdurur. Önceden açık olan ana uygulama müziği matematikten çıkışta mevcut tercihe göre geri dönebilir.

Hareket durdurma, sistemin azaltılmış hareket ayarı ve mola korunur. Normal telefon/tablet/masaüstü yerleşimi tam ekran sahnelerdir. 320×568, 390×844, 768×1024, 1366×768, 844×390 ve 2560×1440 boyutları test edilir. Çok dar/kısa erişilebilirlik boyutlarında içeriği kesmek yerine kaydırma yedeği bulunur. Tüm konuların kontrol alanları ayrıca küçük telefon ve yatay ekranda sınanır.

## Video

Öğrenci sadece önceden onaylanmış yerel katalogdan konu başına en yeni en fazla üç videoyu görebilir. Sınırsız liste veya öğrenci tarafında arama yoktur. YouTube oynatımı ebeveyn bağlantı onayı ister ve fon müziğini keser. 2025–2026 yayın tarihi/API doğrulama şartları korunur.

Kullanıcının yeniden matematik izni üzerine yalnız matematik için dört sınırlı YouTube API araması yapıldı; mevcut adaylar korundu. Diğer derslerin 418 konuluk taraması yeniden başlatılmadı, global kullanıcı duraklatması kaldırılmadı. Sonuç `.tools/video-admin/math-research.json` ve `docs/MATH-VIDEO-RESEARCH.json` içindedir. API metaverisi tam video içerik incelemesi değildir: öğrenci için onaylı yeni video yoktur. Bu nedenle öğrenci ekranı doğrulanamayan adayı oynatmak yerine durumu açıklar.

## Kontroller

Soru kimliği, veri/cevap tutarlılığı, amaç ayrımı, çizimde bilinmeyenin gizlenmesi, müfredat tekrarı altında metin tekilleştirme, mezuniyet koşulu, özgün sesler ve sessiz tercihine uyum birim testlerindedir. Tarayıcı testleri tüm matematik modellerini, altı ekran boyutunu, kapının koşullu görünmesini, fiziksel klavyesiz yanıtı, görselli ipucu/çözümü, not hesabını (12 doğru/6 yanlış/2 boş → 60), çevrimdışı açılışı, taslakla devamı ve önceki oyun kayıtlarını kapsar. Bunlar bütün soru bankasının pedagojik onayı anlamına gelmez.

Son doğrulama (21 Ekim 2026): 40 dosyada 258 birim testi ve 18 ilgili tarayıcı testi geçti. TypeScript kontrolü ve üretim derlemesi başarılı; kaynak inceleme raporunda teknik tutarsızlık sayısı 0. Pedagojik inceleme kapsamı yukarıdaki sınırlara tabidir.

Kanal sınırı (21 Ekim 2026): yalnız YouTube API channels.list ile doğrulanmış `@tonguc5` / `tonguç 5. SINIF` (`UCb-0JQ4tI03T5rHdFe2GVoA`) kabul edilir. Tonguç Akademi ve benzer adlı diğer hesaplar dahil başka kanallar reddedilir. Arama, API video metaverisi, yönetici onayı, JSON dışa aktarımı ve öğrenci filtresi aynı kanal kimliğini uygular. Kanal kimliği bilinmeyen eski kayıtlar onaylanmaz. Önceki genel arama önbelleği korunur, kanal taramasını tamamlanmış saymaz; kanal kapsamlı yeni önbellek ve ilerleme ayrı tutulur. Tarih ve içerik incelemesi şartları değişmez.
