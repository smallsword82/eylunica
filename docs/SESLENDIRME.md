# Türkçe konuşmalı seslendirme — 0.4.0

Yönergeler ve geri bildirimler için sekiz, mevcut altı özgün hikâye için altı Türkçe kayıt uygulamaya gömülüdür. Toplam yaklaşık 2 MB MP3; cihazda TTS modeli veya Türkçe ses paketi gerekmez. Sentetik anlatıcı karakterlerden birini veya gerçek bir kişiyi canlandırmaz. Özel karakter adı ve çocuk verileri ses üretimine gönderilmez.

## Kullanım

- Matematik ve etkinlik ekranlarında **Yönergeyi dinle**.
- Okuma etkinliklerinde **Hikâyeyi dinle**. Otomatik başlamaz. Dinleme isteği aynı hikâye oturumundaki sonraki sorularda da destek sayılır; yıldız eksiltmez. Önceki yanıtların kayıtlarını değiştirmez. Metindeki kanıt seçimi hâlâ gereklidir.
- Ebeveyn köşesinde **Otomatik konuşmalı geri bildirim**. Varsayılan kapalı; açılınca doğru yanıt, yeniden deneme ve tamamlama mesajı çalar. Tercih `ritma-narration-v1` anahtarında cihazda saklanır. Manuel Dinle düğmeleri bundan bağımsızdır.
- **Dinlemeyi durdur** veya **Tüm konuşmayı durdur** ile kesilebilir. Yeni ses eskisini durdurur. Otomatik konuşma varsa kısa efektin yerine geçer. Görev/ekran geçişinde, mola penceresinde, web odağı kaybolduğunda, görünürlük değiştiğinde ve Android AppState arka plan sinyalinde durur. Dönüşte kendiliğinden yeniden başlamaz.
- Ses açılamazsa açıklama gösterilir; oyun ve kayıt devam eder. Konuşmanın metinsel karşılıkları arayüzde kalır.

Hikâyeler baştan tekrar dinlenebilir; bu sürümde duraklatıp aynı saniyeden sürdürme veya cümle eşzamanlama yoktur. Rastgele üretilen matematik sorularının sayıları, yanıt seçenekleri ve konser metinleri seslendirilmez; ortak yönergeler ve geri bildirimler seslendirilir.

## Üretim kaynağı

Sesler derleme öncesinde yerel CPU üzerinde `sherpa-onnx 1.12.35`, Piper Türkçe `tr_TR-fahrettin-medium` modeliyle üretilmiştir. Uygulama çalışırken Python, model, konuşma API'si veya ağ isteği yoktur. Üretim esnasında dış servise metin gönderilmemiştir.

- [Model dağıtımı](https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-tr_TR-fahrettin-medium.tar.bz2)
- Arşiv SHA256: `2ee3c18b5dc0a5faf913f995b027163befa6e7a6ad2f5c6b8a2e99fe1aad8b6d`
- [Dağıtımdaki kaynak kartının kopyası](licenses/piper-tr_TR-fahrettin-MODEL_CARD.md). Kart eğitim veri kümesi lisansını **CC0** olarak belirtir ve lessac modelinden ince ayar yapıldığını açıklar. Bu bilgi veri kümesine aittir; tüm araçlara CC0 lisansı atfedilmez.
- Model, veri kümesi, espeak-ng veya Python çalışma ortamı APK/web paketine eklenmez. Yalnızca proje için üretilen statik sesler dağıtılır.
- `ffmpeg` ile mono, 24 kHz, 56 kbit/s MP3; ses yüksekliği hedefi -20 LUFS, tepe -2 dBTP.

Yeniden üretmek için Python sanal ortamında `pip install -r scripts/narration-requirements.txt`, FFmpeg/ffprobe ve Node 22+ gerekir. Arşivin SHA256 değerini kontrol edip çalışma alanında açtıktan sonra:

```sh
python scripts/generate-narration.py --model-dir /path/to/vits-piper-tr_TR-fahrettin-medium
```

Mevcut metne ait dosyalar yeniden kullanılabilir; tümünü yeniden üretmek için önce `public/narration/tr-*.mp3` dosyalarını kaldırın. Script, mevcut yönerge ve hikâye metinlerinden içerik anahtarlı dosyalar ve `narration-manifest.ts` üretir, eski dosyaları temizler. Normal web/Android derlemesi bu üretimi veya model indirmesini yapmaz. Ses dosyaları ve manifest Git deposunda tutulur. Metin değiştiğinde seslerin güncellenmesini bütünlük testi zorunlu kılar.

## Çevrimdışı çalışma ve doğrulama sınırı

PWA önbelleğine 14 MP3 de dahildir; ilk yüklemede service worker kurulumu ve dosyaların indirilmesi tamamlanmalıdır. Android hepsini APK içinde taşır. Kayıtlar yalnızca metne göre yerel dosyadan seçilir; tarayıcı speechSynthesis veya işletim sistemi TTS hizmetine başvurulmaz.

Otomatik testler dosya bütünlüğünü, çevrimdışı ses çözümlemeyi ve oynatma zamanının ilerlediğini kontrol eder. Gerçek Android hoparlörü, kulaklık, telefon çağrısı gibi ses kesintileri ve çocuklarla dinleme/anlaşılabilirlik değerlendirmesi yapılmadı. Bunlar doğrulanmış gibi sunulmaz.
