# MEB kaynaklarıyla soru bankası düzeltmesi

Öncelik ilk dönemdir (doğrulanmış 1–18. haftalar): **157 konu**, **156 sorulu konu**, **2374 soru ilişkisi**, bunların **48** tanesinde bireysel kaynak karşılaştırma kaydı. Dönemi belirtilmeyen **421** kayıt tahminen sınıflandırılmadı. İkinci dönem içerikleri korunur.

Tüm **6259 soru kaydı** konu bağlantısı, seçenek/cevap tutarlılığı ve zorunlu alanlar açısından tarandı. Teknik hata: **0**. Bu denetim pedagojik doğrulama veya her cevabın resmî bir soru anahtarından doğrulanması anlamına gelmez.

**77 soru kaydında (46 ortak soru kuralı) kök/çeldiriciler düzeltildi. 15 yeni bağlamlı soru** resmî örnek ve etkinliklerin beceri/soru yapısı karşılaştırılarak özgün hazırlandı. Doğru cevaplar ve eski soru kimlikleri korunarak mevcut kayıtların bozulması önlendi.

## İncelenen resmî kaynaklar

| Kaynak | İncelenen PDF sayfaları |
| --- | --- |
| [Türkiye Yüzyılı Maarif Modeli Bağlam Temelli Çoktan Seçmeli Soru Yazım Kılavuzu](https://tymm.meb.gov.tr/upload/kilavuz/coktan-secmeli-soru-yazim-kilavuzu.pdf) | 18, 19, 21, 22, 23, 86, 87, 88, 89, 90, 91, 92, 93, 94 |
| [Ortak Yazılı Sınav Sistemi Uygulama Kılavuzu](https://www.meb.gov.tr/meb_iys_dosyalar/2026_10/6ad703eb1bb29010473792_Ortak_Yazili_Sinav_Sistemi_OYSS_Uygulama_Kilavuzu.pdf) | 4 |
| [Bilişim Teknolojileri ve Yazılım 5. Sınıf Öğretmen Kılavuz Kitabı](https://tymm.meb.gov.tr/assets/pdf/bilisim-teknolojileri-ve-yazilim-dersi-5sinif-ogretmen-kilavuz-kitabi_20260930_175401_503.pdf) | 22, 46, 48, 54, 58 |
| [Görsel Sanatlar 5. Sınıf Öğretmen Kılavuz Kitabı](https://tymm.meb.gov.tr/assets/pdf/gorsel-sanatlar-5-sinif-ogretmen-kilavuz-kitabi_20260930_113624_715.pdf) | 20, 21, 119, 120, 121 |
| [Din Kültürü ve Ahlak Bilgisi 5. Sınıf Ders Kitabı](https://tymm.meb.gov.tr/assets/pdf/din-kulturu-ve-ahlak-bilgisi-5sinif-ders-kitabi_20261003_183932_159.pdf) | 25, 95, 106, 108 |

Sayfalar PDF dosyasındaki 1 tabanlı sayfa numarasıdır. Tam dosya karmaları, alınma zamanı ve yerel önbellek konumu `src/grade5/question-sources.json` içinde tutulur; PDF dosyaları öğrenci paketine kopyalanmaz. Otomatik rapor üretiminde mevcut önbellek dosyalarının SHA-256 değeri yeniden kontrol edilir.

## Yapılan düzeltmeler

- Konu dışı, bariz yanlış veya sırf seçenek dolduran çeldiriciler yerine konu içindeki karışıklıkları hedefleyen seçenekler yazıldı.
- AFAD, tarihî yapının işlevi ve takım planı gibi genel/eksik bağlamlı kökler açıklaştırıldı. Eski doğru cevap metinleri korundu.
- Türkçe için metne dayalı kanıt/çıkarım; matematik için kısıtlı sayı tablosu; fen için Ay gözlemi; sosyal için değişim/neden-sonuç; din kültürü için anlamı özetleme örnekleri karşılaştırıldı.
- Bilişim ve görsel sanatlarda gerçek 5. sınıf kılavuz etkinlikleriyle bağlantılı problem çözme ve afiş okuma soruları eklendi.
- Alıştırma çözümünde ve yazılı sonuçlarında kaynağın adı, amacı ve PDF sayfaları görülebilir. Cevap ve kaynak açıklamaları yazılı bitene kadar açılmaz.

## Kapsamın sınırı

Bireysel resmî kaynak karşılaştırması kaydedilen **92**, henüz kaydedilmeyen **6167** soru ilişkisi var. İkincilere otomatik kaynak onayı verilmedi. Bütün bankanın kaynak karşılaştırmasının tamamlandığı iddia edilmez. İncelenen belgeler bir “çıkmış sınav soruları” koleksiyonu değildir; bu tur doğrudan çıkmış soru diye etiketlenen kayıt yoktur.

OYSS kılavuzunun PDF 4. sayfası okul yazılılarında açık uçlu/kısa cevaplı sorulara ilişkin çerçeveyi anlatır. Uygulamadaki çoktan seçmeli/karma yazılı çalışması özgün bir hazırlık testidir; okulun resmî yazılısı, dağılım senaryosu veya resmî notu olarak sunulmaz. Kılavuzdaki 9/10. sınıf pilot uygulaması 5. sınıf soru bankası kabul edilmedi.

Yeniden üretim: `node tools/curriculum/question-review-report.mjs`. Makinece okunabilir sonuçlar: [QUESTION-REVIEW-REPORT.json](QUESTION-REVIEW-REPORT.json). Öğretmen onayı kaydı yoktur; kaynak temelli editöryel kontrol ile teknik test sonuçları ayrı tutulur.
