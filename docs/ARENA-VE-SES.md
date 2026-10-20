# RİTMA Hız Arenası ve özgün sesler — 0.5.0

## Öğrenme ve rekor kuralları

Arena ana sayfadaki ayrı düğmeden açılır; katılım isteğe bağlıdır. Geri sayım, yanıt süresi sınırı, çocuklar arası sıralama veya kaybetme cezası yoktur. Her tur 10 sorudur; tur sonunda devam zorunluluğu veya otomatik yeni tur yoktur.

- İşlem, gerçek soru düzeyi ve zihinden çözüm becerisi ayrı kaydedilir. Beceriler mevcut matematik stratejileridir: onluğa tamamlama, parçalara ayırma, tersine toplama, eş gruplar ve eşit paylaştırma. Toplam 25 işlem/beceri/düzey grubu vardır.
- Aynı gruptaki son 20 ilk yanıtın en az 18'i ipucusuz doğru olmalı ve en az 8 farklı işlem bulunmalıdır. Kapı süreye bakılarak açılmaz; yavaş ve doğru öğrenmek yeterlidir. Şartlar sonraki turlarda kaybolursa hız karşılaştırması yerine hazırlık sunulur.
- Normal matematikte yeni ilk yanıtlar da doğru düzeyle kaydedilir. Normal öğrenme düzeyleri ilerlediği için, Arena'da seçilen sabit düzeyde isteğe bağlı **Doğruluk hazırlığı** da bulunur. Bu hazırlık rekor veya ek yıldız vermez ve normal matematik beceri düzeylerini değiştirmez.
- Açılan karşılaştırma turları ayrı bir seçimdir. Aynı işlem/beceri/düzey havuzundan 10 farklı soru seçilir. Sorular normal matematik motoruyla üretilir; rekor değerlendirmesi farklı düzeyleri/becerileri karıştırmaz. Soru havuzundan rastgele seçilen işlemler değişebilir; karşılaştırma aynı sorunun tekrar edilmesini veya istatistiksel olarak kanıtlanmış bir gelişim ölçümünü vaat etmez.
- Yalnız tamamlanmış iki tur, çakışmayan **20 ilk yanıtlık** bir karşılaştırma grubu oluşturur. Yarım bırakılan turdaki ilk yanıtlar öğrenme geçmişinde kalır, rekor grubuna girmez. Mola ve geri dönüş açık turu korur.
- Rekor için 20 yanıtın tamamı ilk denemede doğru, ipucusuz ve kesintisiz olmalıdır. İlk uygun grup başlangıç ortalamasıdır; sonraki uygun grup önceki kişisel rekordan en az **%5 daha düşük ortalama etkin süre** gerektirir. Tek hızlı soru veya düşük doğruluklu hızlı grup ödül vermez.
- Hatalı ilk yanıt sonradan doğruya çevrilmez; tekrar denemeler yeni ilk yanıt veya yeni ödül sayılmaz. İpucu öğrenmek içindir; rekor hesabından ayrılır.

## Süre ve cihaz yaşam döngüsü

Soru ekrana geldiğinde monoton `performance.now()` ölçümü başlar. İlk yanıt anında yalnız etkin ön plan süresi alınır. Web görünürlüğü/odağı, Android AppState ve mola durumu izlenir. Bir soru sırasında mola/arka plan kesintisi varsa etkin süre kaydedilir ancak o soru rekor için geçersizdir; kapalı uygulamada geçen süre eklenmez. Geciken ilk Android durum sorgusu daha yeni AppState olayını ezmez.

300 ms altı, bir saatten uzun veya geçersiz sayısal süreler rekor/ortalama dışında kalır. Bu filtreler doğruluk puanını veya kazanılmış yıldızları azaltmaz. Ebeveyn ortalamaları için en az 10 bağımsız doğru ve geçerli süre gerekir; rekor için 20 gerekir. Eski kayıtlarda soru düzeyi bulunmuyorsa tahmin edilerek hız rekoru üretilmez.

## Sınırlı konser koleksiyonu

İlk uygun kişisel rekor **Arena konser ışıkları**, sonraki **yıldızlı sahne ceketi**, üçüncü **akıcılık yıldızı rozeti** verir. Her koleksiyon ödülü ayrıca 3 ortak yıldız verir. Ceket seçilen özgün SVG karakterde, ışıklar ana sahnede görünür; rozet koleksiyonda gösterilir.

Ek rekor ödülü cihazın yerel takvim gününde en fazla bir kez, toplamda üç kez verilir (en fazla 9 ek yıldız). Aynı günün diğer rekorları yine kaydedilir, ek ödül üretmez. Yavaşlama, yanlış yanıt, mola veya Arena'dan ayrılma hiçbir kazanılmış ödülü düşürmez. Süre için ödül, günlük giriş serisi veya sınırsız bonus döngüsü yoktur.

Ödül, yıldız ve Arena geçmişi aynı `ritma-progress-v1` kaydında birlikte saklanır; aynı tur tekrar teslim edilirse yeniden ödül verilmez. Geriye alınan yerel gün ek günlük bonus açmaz. İnternet veya merkezi saat doğrulaması kullanılmaz.

## Ebeveyn grafikleri ve kayıt

Ebeveyn köşesinde işlem, düzey ve beceri seçilerek doğruluk ve bağımsız doğru yanıtlardaki ortalama etkin süre grafikleri birlikte görülebilir. Sayısal değerler klavyeyle kaydırılabilir tabloda da bulunur. Uygun olmayan gruplar rekor gibi gösterilmez; eksik süre örneklerinden sıfır saniyelik sonuç çıkarılmaz. Arena karşılaştırması henüz yoksa son öğrenme/hazırlık yanıtları en az 10 soruluk gruplarda gösterilir ve açıkça rekor olmadığı belirtilir.

Her grupta son 40 ilk yanıt, son 24 karşılaştırma, varsa tamamlanan bir turun 10 yanıtı, başlangıç ve en iyi ortalama saklanır. Son 80 tamamlanmış tur kimliği tekrar teslimi önler. Veriler webde localStorage, Androidde mevcut Preferences adaptörüyle yalnız cihazdadır. Mevcut v1/v2 öğrenme kayıtları, karakter/özel ad, yıldızlar, okuma/dikkat ve ebeveyn ayarları korunur. Arena alanı eksik veya bozuksa yalnız Arena ölçümleri boş başlatılır; kalan ilerleme silinmez. Ebeveynin mevcut ilerleme sıfırlama işlemi Arena'yı da sıfırlar.

Arena'nın görev süreleri matematik kullanımına dahil olur. Mevcut 15 dakika hedefi, 25 dakika/sonraki mola hatırlatmaları ve isteğe bağlı günlük sınır Arena'da aynı geçiş mekanizmasını kullanır. Açık soru sınır nedeniyle yarıda kapanmaz; yeni soru geçişte engellenir.

## Üç ses modu ve özgün elektronik pop efektleri

Üstteki ses seçimi: **Sessiz**, **Sadece Efektler** (varsayılan açık), **Müzik ve Efektler**. İlk açılışta yalnız kısa efektler açıktır; önceki Sessiz tercihi korunur. `ritma-audio-v1` anahtarında saklanır; eski `on` tercihi Efektler, `off` tercihi Sessiz olarak okunur. Konuşmalı geri bildirim tercihi korunur; Sessiz modu manuel/otomatik konuşmayı da susturur. Dinleme için diğer iki moddan biri seçilebilir.

Doğru yanıt, yıldız, kişisel rekor ve bölüm tamamlama için birbirinden farklı nota dizileri, yumuşak sinüs/üçgen osilatörler ve kısa ses zarfları kullanılır. Müzik ve Efektler modunda yalnız rekor/tamamlama ödül ve geçiş durumlarına kısa bas/akor yanıtı eklenir. Bütün efektler bir saniyeden kısadır. Yanlış yanıt yumuşak tek ton olarak kalır.

Hiçbir öğrenme, okuma, dikkat veya Arena sorusunda arka plan müziği veya döngü başlatılmaz. Yeni görev başladığında önceki ödül sesleri kesilir. Mola, görünürlük/odak kaybı ve Android arka plan olayında efektler durur. Yeni ses eskisini keser. İsteğe bağlı konuşmalı geri bildirim ortak yanıtlarda kısa efektin önüne geçebilir; kişisel rekorun ayrı melodisi ödül ekranındadır.

Yeni efektler mevcut Web Audio altyapısında bu proje için kodlanan özgün kısa motiflerdir. Yeni ses/müzik kütüphanesi, kayıt, örnek, dış ses dosyası, müzik indirme veya API eklenmedi. Önceki sürümdeki gömülü Türkçe konuşma kayıtları korunur; bunlar yeni efekt üretiminin parçası değildir. Ayrıntılı müzik prodüksiyonu bu ilk sürümün dışında kalır.
