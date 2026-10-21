# Matematik görsel ön denemesi

Öğrenci kitaplığında yalnız Matematik, Sosyal Bilgiler, Fen Bilimleri, Türkçe, İngilizce, Almanca ve Din Kültürü ve Ahlak Bilgisi görünür. Diğer programların kaynak ve ilerleme verileri silinmez. İngilizcede standart program, Almancada mevcut çoklu dil programı kullanılır; ikinci bir İngilizce kartı gösterilmez.

Matematik kartı yeni keşif akışına açılır. Diğer altı dersin içeriği mevcut sürümdür; bu turda görsel içerikleri yeniden yazılmaz. Matematikte mevcut konu ve yazılı ekranına ayrıca geçilebilir.

## Örnek konu: basamak değeri

- Sayılar kütüphanesi için kullanıcı tarafından beğenilen masalsı mor/gold, karakterli görsel dili temel alınarak özgün bir illüstrasyon üretildi (`src/assets/math-world.png`). Sayısal açıklamalar ve kontrol edilen değerler gerçek HTML metnidir, görseldeki üretilmiş metne dayanmaz.
- 4 582'nin dört basamağı, seçilebilen parlayan kulelerle gösterilir. Rakam × basamak birimi hesaplaması seçime göre değişir.
- 5 yüzlükten 5 binliğe geçiş animasyonu ile 500 → 5 000 karşılaştırması yapılır. Bu, yeni bir sayının bütün basamaklarını oluşturma iddiası taşımayan bir basamak değeri modelidir.
- 8 yüzlüğün değeri için 80/800/8 000 seçenekli görevde yanlış cevap ipucu, doğru cevap gerekçeli kutlama gösterir.
- Sesler mevcut sessiz/efekt/müzik tercihine uyar. Başarı/tekrar mevcut ses katmanını kullanır. Üstteki hareket durdurma, işletim sisteminin azaltılmış hareket tercihi ve mola durumu animasyonları durdurur.
- Keşif adımları mevcut ebeveyn görev geçişinden geçer. Mola sırasında görev düğmeleri kapatılır. Bu ön deneme puan ve çalışma geçmişine yazmaz; önceki oyun/konu/yazılı kayıtları korunur.
- İllüstrasyon 2.22 MB olduğundan PWA tek dosya önbellek sınırı 3 MiB'ye çıkarıldı. Dosya derleme karmalı varlıktır ve çevrimdışı önbelleğe alınır.

Bu çalışma kullanıcının matematikle sınırlı ön deneme isteğidir; bütün matematik konularının veya diğer derslerin görsel dönüşümünün tamamlandığı anlamına gelmez. Kullanıcı isteğiyle bu ön deneme Netlify yayını için main dalına gönderilir. Netlify canlı sonucunun bu ortamdan doğrulanması ağ erişimine bağlıdır.

## Doğrulama

233 birim/bileşen testi, 14 ders/konu/yazılı/keşif tarayıcı testi ve üretim derlemesi geçti. Keşif testinde kitaplık ve matematik için WCAG A/AA denetimi, telefonda yatay taşma, animasyon durdurma, doğru/yanlış geri bildirimi, eski öğrenme kaydını koruma ve illüstrasyonun çevrimdışı açılması doğrulandı. Bu testler bütün soru bankasının pedagojik onayı anlamına gelmez.
