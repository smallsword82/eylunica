# Yeni soru ve düzey akışı

- Normal matematik kolay sayılarla başlar. Beş bağımsız doğru yanıtın mevcut düzey artışı korunur; üst düzeyler daha büyük sayı aralıklarından seçilir. Son 200 cihaz kaydındaki aynı işlem, toplama/çarpma için ters operand sırası da dahil, tekrar seçilmez. Dar havuz tükenirse sonraki düzeyin yeni sorularına geçilir. İpucu/yanlışta mevcut destek davranışı ve geçmiş korunur.
- Zihin Atölyesi her açılışta aynı 8+7 sorusuna dönmez; yakın geçmişteki strateji işlemleri atlanır, sabit küçük liste bittikten sonra yeni sayı havuzu kullanılır.
- Dikkatte renkler, şekil düzenleri, ayrıntılar ve seçenekler çeşitlendirilmiştir. Tür/düzey başına 64 varyanttan yakın 12 etkinlikle aynı görünüme sahip olmayan ve mümkünse daha önce çözülmemiş olan seçilir. Sonlu havuz tükendiğinde en yeni görünümden kaçınılarak yeni tur başlar; sınırsız özgün içerik iddiası yoktur.
- Şekil kartları, örnekler, hafıza sıraları ve şekilli yönergeler SVG ile çizilir. Renk, doluluk ve ek nokta gerçekten görünür; şekil/renk açıklamaları kart üzerinde yazmaz, ekran okuyucu etiketlerinde kalır. Metin tabanlı okuma yanıtları değiştirilmez. Soru kimlikleri, seçenek sırası ve sunucu doğrulama kataloğu aynı kalır.
- Okumada **Sıradaki yeni hikâye** kısa metinlerden uzunlara ilerler. Yarım hikâyede kaydedilmiş ilk denemeler atlanır. Altı hikâyenin 36 sorusu bitince başa sarılmaz; diğer akademilere geçiş sunulur. Düzey kartları daha uzun metni bilinçli seçmeye devam eder.
- Konserde beş farklı bağlam, üç okuma derinliği ve farklı işaret sıraları vardır. On beş hazırlık kolaydan zora seçilir; kaydedilmiş adımlar atlanır. Tümü bitince başa dönülmez.
- Arena isteğe bağlı bir doğruluk/hız alıştırmasıdır. Bir tur kendi içinde farklı on işlem içerir; karşılaştırılabilir doğruluk hazırlığı için sonraki turlarda aynı matematik olguları yeniden gelebilir. Normal derslerin yeni soru seçimiyle aynı değerlendirme sistemi değildir.

Eski yıldızlar, düzeyler, ipuçları ve yerel kayıt anahtarı değiştirilmez. Hesaplar arası çevrimiçi puanlar ayrı; cihazdaki öğrenme geçmişi hâlâ cihaz bazlıdır. Soru çeşitliliği bu cihazın sınırlı geçmişini kullanır, cihazlar arası eksiksiz içerik takibi değildir.

## Görünür matematik bölümleri

Yeni cihaz kaydıyla başlayan öğrenci ilk girişte dört işlemden toplam 12 soruluk matematik seviye tespitine yönlendirilir. Her işlem üç kez yoklanır; ipucusuz doğru sonraki yoklamayı iki düzey artırır, hata bir düzey kolaylaştırır. Son yoklamada başarılı olunan düzey başlangıç düzeyidir (1–5). Bu kısa yerleştirme klinik/standartlaştırılmış bir ölçüm değildir. Mevcut cihaz kayıtları zorunlu sıfırlanmaz; haritadaki tanışma düğmesiyle isteğe bağlı yeniden keşif yapılabilir. Başlatılmış fakat bitirilmemiş yoklama sonraki girişte yeniden başlatılır; kaydedilmiş yanıtlar korunur. Okuma ve dikkat kendi uyarlamalı ilerleme sistemini kullanır.

Her adada beş soruluk bölüm tamamlandığında cihaz kaydındaki `mathSections` sayacı ilerler. Sonuç ekranındaki Devam et aynı adanın bir sonraki bölümünü açar; ada değiştirmek için harita kullanılır. Harita, soru ekranı ve sonuç ekranında bölüm numarası görünür. Soru sayısı ve zorluk seviyesi ayrı gösterilir.

Bölüm numarası her tamamlamada artar; zorluk ise öğrenme başarısına bağlıdır: art arda beş ipucusuz doğruyla yükselir (en fazla 5), zorlanmada destek için azalabilir. Yeni bölüm otomatik olarak zorlaştırılmaz. Son 200 işlemden kaçınma korunur. Önceki kayıtlarda bölüm tamamlanma sayacı bulunmadığından sayaç 1'den başlar; eski yıldızlar, beceriler ve soru geçmişi silinmez. Yarım bırakılmış bölümün soru indeksi kalıcı değildir.
