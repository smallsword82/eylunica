# Açıyı tanıma: izle, birlikte yap, sen dene — 22 Ekim 2026

Matematik → Açı Ölçme → Keşfet girişinde üç aşamalı, sesli ve dokunmatik bir açı tanıma rehberi bulunur. Girişte derece ve iletki eklenmez. Önce sabit mavi ışın, altın hareketli ışın, ortak köşe ve renkli açıklık öğretilir. Rehberden sonra mevcut derece/açı türleri, tam dönüş, iletki ve ters/komşu açı anlatımı bütün adımlarıyla korunur; eski iletki modeli de tamamlanan rehberden erişilebilir.

1. **İzle:** Yerel Türkçe ses, iki ışının ortak başlangıcını ve sabit ışını açıklar. Ardından altın ışın 25° konumundan 115° konumuna belirgin, yumuşak ve tek yönlü hareket eder; renkli bölge geometrik açıya göre büyür. Sayısal değerler öğrenciye bu aşamada gösterilmez. Yaklaşık 11,6 saniyelik gösterim bitince “Birlikte yapalım” açılır.
2. **Birlikte yap:** Altın tutamacı yukarı taşıma yönergesi sesli/altyazılı verilir. Parmak işareti ve kesikli yön oku hareketi gösterir. Çocuk tutamacı sürükler veya “Aç” düğmesini kullanır. Açıklık yeterince büyüdüğünde anlık geri bildirim ve “Şimdi sen dene” açılır. Yalnız beklemek görevi tamamlamaz.
3. **Sen dene:** Bu kez açıklığı küçültmesi istenir. Gerçek hareketten sonra görev tamamlanır, kısa sözlü/tonlu geri bildirim gelir ve ana devam kapısı görünür. Soru puanı/yanıt geçmişi bu keşif hareketleriyle değiştirilmez.

Gösterim dışında yaklaşık 8,5 saniyelik eylemsizlikte bir kısa hatırlatma sunulur. Her hareket sesli yönergeyi yeniden başlatmaz. “Tekrar dinle” mevcut yönergeyi yeniden oynatır. “Gösterimi tekrar izle” aşamaları başa alır ve o oturumun devam kapısını yeniden kapatır.

## Ses ve cihaz davranışı

Sekiz yeni Türkçe kayıt, mevcut metin anahtarlı `narration-manifest.ts` kataloğuna eklendi; toplam 22 kayıt vardır. Sesler daha önce kullanılan, arşiv SHA-256 değeri doğrulanmış Fahrettin/Piper modeliyle yerelde üretildi. Kaynak/model lisans bilgileri [SESLENDIRME.md](SESLENDIRME.md) ve mevcut model kartındadır. Yalnız MP3'ler uygulamaya eklenir. Geçici model arşivi, açılmış model ve Python üretim bağımlılıkları üretim sonunda temizlendi.

Bu dersin otomatik konuşması, konuşma tercihi hiç seçilmemişse açıktır. Kullanıcının açıkça kapattığı otomatik konuşma ve Sessiz modu korunur. Manuel yeniden dinleme, Sessiz modunda ses üretmez. Yeni sessize alma/ses düzeyi paneli eklenmedi.

Konuşma sürerken mevcut sözsüz matematik müziğinin kazancı %15'e indirilir; konuşma bittiğinde kullanıcı düzeyi geri yüklenir. Konuşma, Manifest parçalarını durdurur. Ekran değiştirme, mola, pencere odağını kaybetme veya arka plana geçme konuşmayı keser. Arka planda gösterim saati ilerlemez. Otomatik oynatma engellenirse “Yönergeyi dinle” düğmesiyle tekrar denenebilir; altyazı ve dokunma görevleri kullanılabilir.

Hareket durdurma/azaltılmış hareket, otomatik ışın hareketini durdurur. İki gösterim adımı elle ilerletilebilir; dokunarak yapılan görevler geçerli kalır. Ekrandaki koordinatlar gerçek SVG dönüşümüyle hesaplanır; merkezde yönü belirsiz sürüklemeler yok sayılır. Parmağı gösteren çizim dokunmaları yakalamaz. Tutamaç, saydam geniş dokunma alanı, klavye/ekran okuyucu kaydırıcı semantiği ve büyük Aç/Kapat alternatifleri sunar.

## Doğrulama ve sınırlar

Geometri, gerçek hareket koşulu, sahte zaman ilerlemesiyle tamamlanmama, eylemsizlik hatırlatması/mola, müzik kısma/geri yükleme, açık konuşma kapalı tercihi ve tüm MP3 bütünlükleri sınanır. Chromium'da altı çözünürlükte aşamalar, dokunma engelleri, gerçek SVG sürükleme ve WCAG A/AA kontrolü yapılır. Üretim ses nesnesinin gerçekten çaldığı; çevrimdışı ses çözümleme/oynatma, odak kaybında ses ve gösterim saatinin durması; otomatik konuşma kapalıyken elle dinleme sınanır.

Bu yayın açı tanıma girişini dönüştürür. Diğer derslerin sesli rehberlik dönüşümünün tamamlandığı veya gerçek Android hoparlöründe/çocuklarla anlaşılabilirlik çalışması yapıldığı iddia edilmez. Öğrenme kayıtları, alıştırma/test havuzları, yazılı notları, kitaplık, yol haritası ve videolar korunur.

Yayın öncesi son sonuç: 282 birim/bileşen testi ve genel pakette 82 tarayıcı testi geçti; çevrimiçi lig yapılandırmasına bağlı dört test atlandı. Altı çözünürlük: 320×568, 390×844, 768×1024, 1366×768, 844×390 ve 2560×1440. Üretim sürümünün Cloudflare dağıtım durumu ayrıca API üzerinden doğrulanır; yerel tarayıcı testi canlı sitede yapılmış gibi sunulmaz.
