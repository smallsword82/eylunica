# Matematiğin bütün konularında sesli rehberlik — 22 Ekim 2026

Bu değişiklik 5. sınıf Matematik keşif yolundaki 19 müfredat kaydını ve korunmuş basamak değeri örneğini kapsar. Diğer derslerin aynı dönüşümden geçtiği iddia edilmez.

- **Keşfet:** Her konuda İzle → Birlikte yap → Sen dene. Açı tanıma rehberinin sürüklenebilir ışınları korunur. Diğer konularda kendi modelini değiştiren iki dokunmatik görev bulunur: cetvelde uç taşıma, çokgenin kenarını değiştirme, bölük/basamak seçme, kutu ekleme, bahçe alanını değiştirme, eş parçaları boyama, kesirleri eşitleme, oy/sütun düzeltme, dengeyi koruma, dağılan grupları inceleme, işlem sırası, örüntü artışı, sıralı/koşullu robot adımları ve taşların olasılıklarını karşılaştırma. Aynı model türünü kullanan farklı veri/algoritma/olasılık kayıtlarının hedefleri ayrı hazırlanmıştır. Yalnız beklemek devam kapısını açmaz; iki görevin de model üzerinde tamamlanması gerekir.
- **Anlatım ve çözümlü örnek:** Mevcut 135 sahnenin dört karesi de kendi metniyle seslendirilir. Otomatik geçiş sesin süresini ve gerçekten çalıyor olmasını dikkate alır; son kare de ses bitmeden otomatik tamamlanmaz. Tam açıklama ve çözüm metnine geçildiğinde o metin okunur. Manuel kare seçimi korunur.
- **Alıştırma:** İlk sorudan önce dokunmatik yanıt verme yönergesi, ardından soru okunur. 20 konu × 40 alıştırma kaydının sayıları dahil soru metinleri, istenen ipuçları ve yanıt kontrolünden sonraki çözümleri yerel ses kataloğuna dahildir. Ortak metinler dosya çoğaltılmadan paylaşılır. Bir oturumda mevcut davranışla sekiz yeni soru sunulur.
- **Konu testi/yazılı:** Girişte ne yapılacağı, kaydetme/otomatik sonraki soru, boş bırakma ve sonuç/not açıklanır. Çalışma ayrı bir giriş ekranıyla engellenmez. Testte 20 soru; yazılıda seçilen 10 veya 20 soru ve sonunda 100 üzerinden not korunur. Sınav sırasında ipucu/çözüm sesi verilmez. Yanıtın kaydedildiği ara ekran eklenmez.

Sesli yönergeler metin/altyazı ve tekrar dinleme ile desteklenir. Yeni ses düzeyi paneli eklenmez. Mevcut Sessiz modu ve açıkça kapatılmış otomatik konuşma korunur. Konuşma sırasında özgün sözsüz matematik müziği kısılır; Manifest parçaları ders içinde çalınmaz. Ekran değişimi, mola ve odak kaybı konuşmayı keser. Hareketi durdurma/azaltılmış hareket, elle ilerleme ve dokunmatik görevleri engellemez.

Katalog toplam 1.954 MP3 içerir (yaklaşık 60 MiB); bunun 1.932 dosyası bu genişletmede eklendi. Üretim yerel, SHA-256 doğrulanmış mevcut Türkçe modelle yapılır. Model/Python bağımlılıkları uygulamaya konmaz; yalnız MP3 dosyaları dağıtılır. İlk PWA kurulumu tamamlanınca sesler çevrimdışı önbellekten de kullanılabilir. İçerik, lisans ve yeniden üretim ayrıntıları: [SESLENDIRME.md](SESLENDIRME.md).

## Doğrulama

Konu kapsamı, iki gerçek hareket koşulu, bekleyerek tamamlanmama, tekrar izleyince kapının kapanması, konuşma kuyruğunun sırası/iptali, ses sürerken kareyi bekletme, mola/arka plan ve bütün ses dosyalarının metin-hash eşleşmesi sınanır. Tarayıcıda 20 konunun keşif görevleri ve mevcut anlatım/örnek/alıştırma görselleri dar telefon ve yatay ekranlarda kontrol edilir. Ayrı kontroller her konunun kendi sesinin gerçekten çaldığını; anlatım, tam metin, örnek, soru, ipucu, çözüm ve test/yazılı yönergelerinin oynadığını doğrular.

Testler yerel üretim derlemesinde Chromium ile yapılır. Canlı alan adı üzerinden UI testi, gerçek Android hoparlörü veya çocuklarla anlaşılabilirlik çalışması yapılmış gibi sunulmaz. Diğer derslerin sesli/görsel dönüşümü sonraki kapsamdır. Öğrenme geçmişi, müfredat, soru ayrımı, notlar ve doğrulanmış video kataloğu korunur.
