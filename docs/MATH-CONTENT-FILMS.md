# Matematikte içeriğe bağlı animasyonlar — 21 Ekim 2026

Kapsam: matematikte 19 resmî konu kaydı ve korunmuş `place-value` örneği. Kitaplıkta yedi ders kalır; diğer derslerin animasyon dönüşümü bu yayının kapsamında değildir. İlk dönem varsayılandır; tüm yıl seçilince diğer matematik durakları açılır.

## Anlatım ve örnek

`math-films.ts`, 76 anlatım paragrafını ve 57 çözümlü örnek adımını ayrı sahnelerle eşleştirir. Korunmuş örneğin iki sahnesiyle toplam 135 sahne, her sahnede dört açıklamalı kare bulunur. Harita süslemesi anlatım veya soru resmi olarak kullanılmaz. Tam açıklama ve çözüm metinleri aynı ekranda açılabilir. Önceki değiştirilebilir modeller, “Modeli kendin değiştir” düğmesindedir.

Animasyonlar MP4 değil, sayılar ve geometriyle hesaplanan yerel SVG/HTML sahneleridir: sonlu oynatma, duraklatma, önceki/sonraki kare ve tekrar oynatma. Çizim izleri, kategori/basamak vurguları, nesne grupları ve ara işlemler ilgili açıklamayı takip eder. Küresel hareket durdurma ve azaltılmış hareket otomatik oynatmayı durdurur; manuel kare seçimi kullanılabilir. Ebeveyn molasında kontroller durur. Yeni ses/volume denetimi eklenmez; mevcut ses tercihleri korunur.

| Alan | İlgili sahneler |
| --- | --- |
| Geometrik çizim/açı | Nokta/doğru/ışın, gerçek cetvel konumları, pergel, paralel/dik doğrular, açı türleri ve dönüş, kesişen doğrular |
| Çokgen/çember | Kapalı ve açık sınır, kenar/köşe, yarıçap–çap, iki çemberin ortak noktasından AC=BC; AB verilmediyse eşkenar varsayılmaz |
| Sayılar/basamak | Üçlü bölükler, her basamağa tek rakam, seçilen basamak ve birimi, gerçek örnek sayıları |
| Problemler/alan | Eş kutular, paylaşma, çıkarma, kalanlı bölme, ek araç gereksinimi; çevre sınırı ve alan birimkareleri ayrı |
| Kesir | Eş parçalar, çoklu bütünün sayısı, sayı doğrusu, denk kesir, yüzde yüzlük tablosu, eş büyüklükte bütün karşılaştırması |
| Veri | Konunun kendi meyve/kitap kategorileri, sıklık sütunları, sıfır başlangıcı, toplam ve iddia kontrolü |
| Eşitlik/özellikler | Bilinmeyen, iki tarafa aynı işlem, dağılmada iki renkli alan, değişme ve birleşme adımları |
| İşlem önceliği | İşleçli ifadeler ve tek işlemde sadeleştirme; kutu dışındaki ek nesne ile her kutuya eklenen nesnenin farkı |
| Örüntü/algoritma | Toplama/çarpma örüntüsü, tekrar bloğu, ara işlem akışı, koşul dalları, bütçe ve tam defter sayısı |
| Olasılık | Gerçek renk/adetler, eşit/eşit olmayan çark bölgeleri, adil para, imkânsız ve daha olası ayrımı |

## Soru, ipucu, çözüm

Aktif 4.000 matematik soru kaydının 3.800’ü kendi verilerinden oluşturulan tipli `MathDiagram` taşır. 200 açı sorusu önceki uzmanlaşmış iletki modelini korur. Soru kimlikleri, yanıtlar, tüketilmiş soru listeleri ve geçmiş sonuçlar korunur. Karede “uzun kenar” ifadesi “bir kenar” olarak düzeltilmiştir.

Soru görünümünde bilinmeyen sonuç gizlenir. İşlem/algoritma sorularında ara hesaplar test sırasında otomatik açılmaz; ipucunda yöntem, çözümde sonuç gösterilir. Çevrede cm, alanda cm²; eksik kenarda bilinmeyen ve ölçeksiz çizim notu vardır. Kalabalık gruplarda tek kutu, kaç aynı kutu olduğunu belirten açık çarpanla gösterilir; nesneler sessizce kesilmez.

4.000 kayıt, farklı sayılarla üretilmiş soru ailesi varyantlarıdır; 4.000 bağımsız öğretmen onaylı soru iddiası yoktur. Bu çalışma yeni bir çıkmış soru veya öğretmen onayı eklemez. Kaynak/inceleme kayıtları korunur.

## Doğrulama

- Her açı dışı sorunun görsel modelinden bağımsız hesaplanan yanıtı, kayıtlı yanıtla karşılaştırılır; açıların tür/ölçü kontrolleri korunur.
- Her resmî paragraf/örnek için sahne sayısı ve paragraf başlangıcı eşleşmesi; dört dolu kare kontrol edilir.
- Oynatma, duraklatma, son karede durma, tekrar, hareket durdurma, mola ve testte ara sonucu gizleme bileşen testleri vardır.
- Tarayıcı testi 20 kaydın her anlatım ve örnek sahnesini, ayrıca soru akışını 320×568 ve 844×390 ekranlarda açar; ekran sınırı ve düğme üstüne başka öğe gelmesi kontrol edilir.
- Mevcut çoklu ekran, yazılı notu/geçmişi, tekrar etmeyen sorular, çevrimdışı açılış, erişilebilirlik ve YouTube akış testleri korunur. Yayın öncesi sonuçlar görev raporunda bildirilir.

Son sonuç: 270 birim/bileşen testi geçti. Genel tarayıcı paketinde 75 test geçti; çevrimiçi lig yapılandırmasına bağlı dört test atlandı. Ek olarak bütün konuların ipucu açık durumunu da içeren 20-konuluk tarayıcı turu geçti. 320×568 ve 844×390 denetimleri gerçek Chromium ile yerel üretim derlemesinde yapıldı; Cloudflare yayını ayrıca dağıtım API’siyle doğrulanır.
