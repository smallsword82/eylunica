# Fen Bilimleri · İlk dönem keşif akışı

Mevcut 2026–2027 konu kayıtları ve kaynak bağlantıları korunur. Yıllık planın 1–18. haftalarıyla kesişen dokuz konu görselli akışa alınmıştır. 19. haftaya uzanan destek ve hareket konusu ilk dönemde de yer alır. İkinci dönemin diğer konuları mevcut ders görünümünde açılır; onlar için yeni akışın tamamlandığı iddia edilmez.

## Kapsam

1. Laboratuvar güvenliği: koruyucuyu hazırlama ve öğretmene bildirme.
2. Güneş: leke hareketini izleme, güvenli gözlem ve ışık kaynağı.
3. Ay: aynı yüzünü çevirme, evreler ve aydınlık yarının görünüşü.
4. Güneş–Dünya–Ay: ayrı dönme/dolanma ilişkileri, ölçeksiz model.
5. Kuvvet: eşit aralıklı dinamometre, 2 N'luk ağırlıklarla 6 N ölçümü.
6. Kütle–ağırlık: Dünya/Ay karşılaştırması; çözümlü örnekte tam olarak 6 kg çanta.
7. Sürtünme: aynı başlangıç hızıyla farklı yüzeylerde yavaşlama; anlatım örneğinde halı 20 cm/karton 60 cm verileri.
8. Hücre: zar, sitoplazma, çekirdek, organeller, bitki/hayvan karşılaştırması ve yapı düzeyleri.
9. Destek ve hareket: kas–kemik–eklem ilişkisi, korunma ve sağlıklı alışkanlıklar.

Her konuda dokunmatik keşif görevi, kaynak ders metninin sesli adımları, ayrı çözümlü örnek, sekiz alıştırma ve yirmi soruluk konu testi vardır. Keşif tamamlanınca devam kapısı görünür. Anlatımın ses ve hareketi kendiliğinden ilerler; hareket kapatılmışsa görüntüler elle ilerletilebilir. Alıştırma sonrasında açıklama gösterilir; test/yazılı yanıtı kaydedilince doğrudan sonraki soru açılır.

## Soru kümeleri ve kayıtlar

`science-question-bank.ts` 342 kayıt içerir: 72 alıştırma, 180 konu testi, 90 yazılı sorusu. Her konunun testinde on bilgi/gözlem değerlendirmesi ve on uygulama sorusu, yazılı kümesinde on yanlış düşünceyi düzeltme sorusu bulunur. Aynı konunun farklı değerlendirmelerinde aynı kazanım ele alınabilir; bu, 342 ayrı kazanım olduğu anlamına gelmez. Kümeler soru kimliği ve tam soru metni bakımından ayrıdır. Yeni sorular Eylunica'nın özgün çalışmalarıdır; resmî veya çıkmış MEB sorusu olarak sunulmaz.

Altı eski ders alıştırması, yeni dokunmatik biçimde de kullanılır. Önceden yanıtlanmış eski kimlikler eşleştirilerek yeniden sorulmaz; öğrenci kalan yeni alıştırmalardan devam eder. Eski veri dosyaları ve soru kimlikleri silinmez. Yanıtlanmış yeni sorular da otomatik tekrar edilmez; havuz bitince açıklama gösterilir.

Yeni durum ayrı `eylunica-science-journey-v1` kaydında tutulur. Her konu ve çalışma türünün yarım oturumu, soru sırası, yanıtları, ilerlemesi ve kullanılan sorular saklanır. Genel öğrenme kaydıyla matematik ve akademi kayıtları korunur.

Yazılı kapsamı hazırlanmış konulardan ve ünitelerden seçilir; 10 veya 20 soru kullanılabilir. Sorular konu başına dengeli seçilir ve alıştırma/test kümelerine karışmaz. Yarım yazılı mevcut `eylunica-grade5-exams-v1` düzeninde saklanır. Eski biçimdeki yazılılar mevcut yazılı ekranıyla devam eder. Boş bırakılan sorular kaydedilmiş kabul edilir; devam edildiğinde ilk kaydedilmemiş soru açılır. Not, doğru sayısı/toplam soru × 100 olarak hesaplanır. Yanlışlar ayrıca puan düşürmez. Tamamlanan sonuç geçmişe bir kez eklenir.

Keşif belgesi, seçilen kapsamdaki bütün konuların hazırlanmış olması ve anlatım/alıştırma/test koşullarının tamamlanmasıyla açılır. Konu testinde en az 70/100 alınması veya test sonrasında bütün görselli çözümlerin incelenmesi durağı tamamlar. Düşük puanlı öğrenci yeni soru kalmadığı için kilitlenmez; çözüm incelemek notu değiştirmez. Tamamlanmış oturumlar sonuç incelemesi için korunur; sorular tekrar yanıtlatılmaz. Daha önce açılmış başarı geriye alınmaz. Belge resmî mezuniyet belgesi değildir.

## Görsel ve ses

Dokuz konu kapağı yerel özgün `public/discovery/science-worlds.png` atlasındadır. Dekoratif kapaklar bilimsel veri kaynağı değildir. Sayılar, etiketler, ölçümler ve sorulara ait öğretim çizimleri SVG ile ayrı oluşturulur. Ay'ın aydınlık alanı geometrik olarak hesaplanır; sürtünme karşılaştırması aynı başlangıç hızı ve farklı sürtünme katsayılarıyla hesaplanır. Güneş–Dünya–Ay modeli ölçekli değildir; kütle/ağırlık sayıları yaklaşık sınıf modeli değerleridir.

393 yeni metnin Türkçe sesleri mevcut yerel seslendirme altyapısıyla üretilmiştir. Keşif yönergesi, ders paragrafları, örnek adımları, alıştırma soruları/ipucu/çözüm ve test/yazılı girişleri seslidir. Test ve yazılıda yanıt veya ipucu okunmaz. Çözümler bitişten sonra açılır. Sesler API anahtarı, cihaz TTS servisi veya ders sırasında internet gerektirmez. Mevcut sessiz/otomatik konuşma tercihleri korunur. Yeni ses düzeyi paneli eklenmez. Fon için mevcut özgün sözsüz müzik, konuşma sırasında kısılma ve kısa efektler kullanılır. Ders sırasında Manifest parçaları başlatılmaz. Mola/arka plan durumu sesi ve hareketi durdurur.

Bilgi düğmesi önceki kaynak metinleri, öğrenme çıktıları ve serbest deney modellerini açar. Test/yazılı sırasında kaynak düğmesi kapalıdır. Video kataloğu, video taraması ve kota kayıtları değiştirilmemiştir.

## Doğrulama

- 54 dosyada 323 birim testi; konu kapsamı, soru kümeleri, geçerli yanıtlar, eski kimlik eşlemesi, oturum geri yükleme ve yazılı notu dahil.
- Dokuz konunun beş ekran boyutunda keşif/anlatım/örnek/alıştırma akışı; yalnız gerekli olduğunda devam kapısı.
- Gerçek MP3 oynatımı, konuşmanın arka planda durması ve sessiz tercihinin korunması.
- Çevrimdışı yazılı devamı, doğru/yanlış/boş hesapları ve eski veri koruması.
- Mevcut matematik seslendirmesi ve diğer dersleri açma kontrolleri.

İlk çevrimdışı kurulum, sesli kitaplığı indirmek için internet ister. Bundan sonra onaylanmış yerel ders materyali çevrimdışı kullanılabilir. Kullanıcı verileri sunucuya taşınmamıştır.

Son fen tarayıcı turu: 6/6 geçti. Önceki ders/kaynak kontrollerinde 13/13 ve matematik/okuma ses kontrollerinde 4/4 senaryo doğrulandı. Bu sayılar farklı turlardaki kontrollerdir; tüm GitHub CI sürecinin tamamlandığı anlamına gelmez.
