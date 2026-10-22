# GitHub incelemesi · 22 Ekim 2026

İncelenen aralık: `bb48253..9de9d41` (17 commit). Başlangıçta çalışma kopyası temizdi; GitHub değişiklikleri fast-forward ile alındı.

## GitHub'dan gelen değişiklikler

- Fen Bilimleri haritası, Güneş–Dünya–Ay, Ay evreleri ve kuvvet/sürtünme modelleri.
- Matematikte altı maceranın doğrudan açılması, her düzeyde altısı tamamlanınca bir sonraki düzeyin açılması.
- Okuma ve dikkat akademilerinde sırayla açılan düzeyler.
- Kitaplıkta ses seçimleri, geri dönüş düğmesi, PWA ve ebeveyn gelişim göstergeleri.

İnceleme başında Cloudflare Workers Builds `9de9d41` için başarılıydı. GitHub web testi iptal edilmiş, Android işi atlanmıştı; bunlar testlerin geçtiğini göstermiyordu.

## Giderilen sorunlar

- Okuma tamamlaması `max(mevcut, tamamlanan) + 1` hesabıyla önceki düzeyi tekrar oynayınca kilit atlıyordu. Artık yalnız tamamlanan düzeyin bir sonrası açılır; kilitli düzeyin tamamlanması kabul edilmez.
- Seçilen okuma düzeyi farklı/kapalı düzeyden hikâye ödünç alamaz. Sorular tükenince görünür açıklama ve düzeylere dönüş sunulur.
- Yeni düzey menüsünde erişilemez kalan okuma kapakları geri getirildi; dikkat düzeyleri de yerel görseller kullanır. Kilitler korunur.
- Eski sürümde verilmiş okuma tamamlama ödüllerinden açık düzey korunur. İlerleme, beceriler ve kartlar sıfırlanmaz. Bozuk isteğe bağlı düzey alanları doğrulanır.
- Matematikte yeni düzey sekmeleri ve eğitmen portreleri küçük ekranı taşıyordu. Sekmeler tek sırada, altı macera telefon ve yatay ekrana uyarlanmıştır. Kısa seçim ekranlarında üst çubuk gizlenirken akademilere dönüş kalır.
- Ay görünümünün terminatör çizimi düzeltilmiştir: hilal, dördün ve şişkin evreler doğru aydınlık alanı gösterir; evre adı konuma en yakın evredir.
- Kurulu PWA yalnız dikey yöne zorlanmaz.
- Kuvvet deneyi mola/arka plan durumunda ilerlemez; dönüşte aradaki zamanı harekete eklemez.
- Çevrimdışı uyarısının zamanlayıcısı yeni kopmada eski zamanlayıcı tarafından gizlenmez; uyarı dokunmaları engellemez.
- Yeni akademi akışına uymayan ilk giriş açıklamaları ve tarayıcı testleri güncellenmiştir. Matematiğin isteğe bağlı seviye tespiti test edilmeye devam eder.

## Kapsam sınırı

Bu değişiklik fen dersinin tamamını matematikteki sesli, aşamalı anlatıma dönüştürmez. GitHub'dan gelen fen modelleri korunmuş ve yukarıdaki hataları giderilmiştir. Diğer derslerin bütün konularının aynı görsel/sesli düzeye ulaştığı iddia edilmez. Video kataloğu ve kota kayıtları değiştirilmemiştir.

## Doğrulama

`npm test -- --maxWorkers=4`: 53 dosyada 316 test geçti. `npm run build`: başarılı. Geniş tarayıcı turundaki başarısız durumlar yeni menüler/çevrimdışı bildirim seçicileri ve kurulum süresiyle ilgiliydi; ilgili 17 dosya güncellendikten sonra 52 senaryo yeniden çalıştırıldı. Bu turda 51 senaryo geçti; kalan şekil testinin ikinci düzey yerine birinci düzeyi seçen fixture kaydı düzeltildi ve ayrı doğrulandı. Toplam 88 tarayıcı senaryosu farklı turlarda doğrulanmıştır; çevrimiçi lig yapılandırması gerektiren dört senaryo atlanmıştır. Tek bir tam tarayıcı turunun baştan sona yeşil olduğu iddia edilmez. Tarayıcı çevrimdışı testleri her temiz bağlamda yaklaşık 79 MiB yerel kitaplığı kurar; eşzamanlılık iki tarayıcıyla sınırlandırılmış ve test bütçesi 60 saniyeye ayarlanmıştır. Bu ayar işlevsel doğrulamaları veya erişilebilirlik kontrollerini kaldırmaz.
