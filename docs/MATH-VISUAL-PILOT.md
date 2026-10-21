İçeriğe bağlı yeni anlatım/soru animasyonları: [MATH-CONTENT-FILMS.md](MATH-CONTENT-FILMS.md).

Güncel sahne/harita, soru setleri ve ses akışı: [MATH-JOURNEY.md](MATH-JOURNEY.md). Aşağıdaki metin önceki görselli anlatım katmanını açıklar.

# Matematik konularının görselli akışı

Matematik kitabı artık ayrı bir demo açmaz. Akış: yedi ana dersin kitaplığı → matematik konu haritası → seçilen konunun görselli anlatımı → mevcut alıştırmalar/yazılılar. Diğer derslerin görsel dönüşümü bu çalışmanın kapsamında değildir. Fazla programlar öğrenci kitaplığına geri eklenmez; geçmiş verileri korunur.

Matematikteki 19 müfredat konu kaydı ve korunmuş basamak değeri örneği için model eşleştirmesi `src/ui/math-visual-models.ts` dosyasındadır. Tekrarlanan algoritma/veri/olasılık başlıkları kendi konu kayıtlarını koruyarak aynı kavram modelini kullanır. Varsayılan dönem filtresi önceki gibi ilk dönemdir; diğer konular Tüm yıl seçeneğinde erişilir.

## Konuya göre etkileşim

- Geometrik çizimler: cetvelde iki noktanın yerini ve aralarındaki uzunluğu değiştirme.
- Açı ölçme: hareketli ışın, 0–180° iletki, açı sınıfları, çizim uzunluğunun açıyı değiştirmediğini gözlemleme ve 90/45/120° görevleri.
- Çokgen ve çember: kenar/köşe sayısını değiştirme, çemberle karşılaştırma.
- Çok basamaklı sayılar: bölükleri renkli gruplama, milyonlar bölüğüyle sayı okuma.
- Basamak değeri: rakam seçimiyle çarpan ve değerin değişmesi.
- Dört işlem problemleri: eşit kutu grupları, toplam ve ters bölme işlemi.
- Dikdörtgen: değişebilir birimkare ızgarası, ayrı çevre/alan sonuçları.
- Kesirler: eş parçaları boyama, payda değiştirme, sayı doğrusu, ondalık ve yüzde karşılığı; yuvarlanan sonuçlar yaklaşık olarak belirtilir.
- Kesir karşılaştırma: eş büyüklükte iki bütün, ortak paydada miktar karşılaştırması.
- Kategorik veri: meyve tercihine oy eklenince değişen sütun grafiği. Bu, uydurulmuş örnek sınıf verisidir.
- Eşitlik: iki tarafa aynı sayı ekleyerek dengeyi koruma.
- Özellikler: değişme/birleşme/dağılma seçimi, boyalı kareler ve işlem eşitlikleri.
- İşlem önceliği: çarpmanın önce yapıldığını gösteren işlem rotası.
- Örüntü: ilk terim ve artış miktarını değiştirerek sayı ritmi oluşturma.
- Algoritma: bütçe, fiyat, tam defter sayısı ve kalan için sonlu işlem adımları.
- Olasılık: iyi karıştırılmış, aynı özellikteki taşların renk sayılarına bağlı tahmin; tek çekiliş için garanti verilmez.

Anlatım kısa adımlara bölünür. Önceki ayrıntılı açıklamalar ve çözümlü örnekler açılır bölümde korunur. Her konu, kendi soru kaydından küçük bir deneme ve mevcut alıştırmalara geçiş içerir. Mini keşifler ilerleme kaydına yazmaz; alıştırma ve yazılıların mevcut kayıt davranışı korunur. Ebeveyn görev geçişi, mola, ses tercihleri, hareket durdurma ve azaltılmış hareket ayarı korunur.

Masalsı illüstrasyon `src/assets/math-world.png` olarak paketlenmiştir. Öğretici şekiller HTML/SVG ile hesaplanır; açı, değer ve görevler görsel üretim aracının yazılarına dayanmaz. Üretim PWA önbelleğinde çalışır. `MathAdventure` adlı ayrı basamak demosu kaldırılmıştır.

Bu değişiklik sunum ve etkileşim kapsamını tamamlar; konu başına 50 soru hedefinin veya bütün bankanın bağımsız kaynak/öğretmen incelemesinin tamamlandığını iddia etmez.

## Doğrulama

251 birim/bileşen testi ve 14 ders/konu/yazılı tarayıcı testi geçti. Tarayıcı testi bütün 20 matematik konu kartını tek tek açar, görselli modelin kendi konu ekranında bulunduğunu ve ayrı demo ekranı olmadığını doğrular. Ayrıca mobil taşma, iletki görevleri, kesir anlatımı ve açı atölyesinde WCAG A/AA kontrolleri, hareket durdurma, alıştırmaya geçiş, çevrimdışı yeniden açılış ve önceki öğrenme kaydının korunması sınanır. Son görünüm değişikliğinden sonra üretim/PWA derlemesi ve tüm konu açılış testi yeniden çalıştırılır.
