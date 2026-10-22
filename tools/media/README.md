# Sosyal Bilgiler fotoğraf kataloğu

Öğrenci uygulaması webde fotoğraf aramaz. Yalnız `social-photo-catalog.json` içindeki, görsel olarak incelenmiş ve lisansı kaydedilmiş yerel fotoğrafları gösterir. Katalog boşken mevcut öğretici şekil kullanılır; uydurma bağlantı veya lisans eklenmez.

Wikimedia Commons kaynağına erişim için `commons.wikimedia.org` ve `upload.wikimedia.org` gerekir. Fotoğraf API anahtarı gerekmez. Ortam taslağının kaydedilmesi bu erişimi açmaz; kullanıcı ortam ayarlarını kaydedip ortamı yayımlamalıdır.

Akış:

1. `python3 tools/media/commons_photos.py search 'family photograph'` gibi konuya özgü bir sorguyla lisanslı adayları bul.
2. Sonuçtaki tam dosya başlığını `download --title 'File:…' --out /tmp/commons-family` komutuna ver. Bu aşama öğrenci kataloğuna eklemez.
3. `candidate.image` dosyasını görsel araçla incele: gerçek fotoğraf mı, hedef kavramı gösteriyor mu, yazı/filigran veya alakasız içerik var mı? Açıklamayı fotoğrafta gerçekten görülenlere göre yaz.
4. İncelenen adayı `approve --candidate /tmp/commons-family --topic topic-f31f5d0c12bc3e58 --role family --frames 0 --context explanation --alt '…' --caption '…'` ile ekle. Bu açık onay, aracı kullanan içerik editörünün incelemesini temsil eder; öğretmen onayı değildir.
5. Yerel dosya, kaynak, fotoğrafçı, lisans bağlantısı, dönüşüm açıklaması ve SHA-256 kaydedilir. Aynı lisansı taşıyan `.license.txt` dosyası görselin yanındadır. Sonrasında derleme ve mobil görüntüleme kontrol edilir.

İlk somut hedefler aile (`family`), okul (`school`) ve koro (`choir`) üyeliğidir. Deniz’in mevcut çözümlü örneği satranç kulübündedir: koro fotoğrafı o örneğe yerleştirilmez. Kurgusal Deniz’in ailesi gerçek fotoğraftaki kişiler olarak tanıtılmaz. Gerçek fotoğraf örnekleri ile yön/ölçek gibi hesaplanan öğretici şemalar birbirinin yerine otomatik konmaz.

Kabul edilen lisanslar CC0, açık kamu malı ve belirtilen CC BY/CC BY-SA 3.0/4.0 lisanslarıdır. “İnternette var” veya “ücretsiz indir” tek başına lisans kanıtı sayılmaz. İzin ve atıf bilgisi eksik aday reddedilir. Lisans/atıf açılır bölümünde kaynaklar erişilebilirdir; fotoğraf yüklenemezse kırık görsel yerine mevcut çizim kullanılır.

Doğrulama: `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/media -p 'test_*.py'` ve `npm test -- --maxWorkers=4`. Pillow yalnız düzenleyici içe aktarma aracında gereklidir; öğrenci uygulamasında Python çalışmaz.
