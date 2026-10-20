# Kişisel Manifest öğrenme alanı

Kullanıcının 20.10.2026 tarihli isteği: gerçek Manifest grubu üyeleri eğitmen; öğrenci varsayılan Eylül, değiştirilebilir. Kısa gerçek şarkı efektleri ve düşük sesli müzik; video yok. Depo özel kalır.

## Fotoğraflar

Erişilebilir referans: https://manifestbyme.vercel.app/ . Kaynak sayfanın ad/fotoğraf eşlemesi kullanıldı; resmî `manifestgirlband.com` sayfası erişim sırasında 403 döndürdü. Bu referansın resmîliği veya görseller için açık lisans iddia edilmez.

| Eğitmen | Referans dosyası | Yerel dosya |
| --- | --- | --- |
| Mina | minaguncel.webp | public/manifest/mina.webp |
| Lidya | lidya-cutout.webp | public/manifest/lidya.webp |
| Hilal | hilal-cutout.webp | public/manifest/hilal.webp |
| Esin | esin-cutout.webp | public/manifest/esin.webp |
| Zeynep | zoktay-cutout.webp | public/manifest/zeynep.webp |
| Sueda | mina-cutout.webp | public/manifest/sueda.webp |
| Grup | groupphoto1.webp | public/manifest/group.webp |

Sueda referansı kaynak sitede teknik dosya adı `mina-cutout.webp` olmasına rağmen SUEDA adıyla eşlenmiştir. Özgün dosyalar değiştirilmeden alınmıştır. Eğitmen rolü ve öğrenme metinleri uygulama kurgusudur; grubun gerçek ders verdiği veya projeyi desteklediği iddia edilmez. Hikâyelerdeki eski kurgu kişileri mevcut gömülü Türkçe anlatım kayıtlarıyla tutarlılık için korunur.

## Ses kaynakları ve kesitler

- Manifest resmî sanatçı kanalı, Zamansızdık Official Dance Video: https://www.youtube.com/watch?v=NDPWCGO7s6I
- Manifest resmî sanatçı kanalı, Arıyo Official Music Video: https://www.youtube.com/watch?v=yQ9lXHfv9Yg

Kullanıcının açık isteğiyle yalnız ses akışları alındı. Çalışma kopyaları `media-source/`, geçici araçlar `.tools/` altında ve Git dışında. Tam şarkılar dağıtıma dahil değildir. `public/manifest/audio/` yalnız aşağıdaki kısa MP3 dosyalarını içerir. Stereo, 44,1 kHz, 128 kbps; baş ve son geçişleri yumuşatıldı.

| Dosya | Kaynak | Başlangıç (sn) | Süre (sn) |
| --- | --- | --- | --- |
| correct.mp3 | Zamansızdık | 38 | 1,6 |
| retry.mp3 | Zamansızdık | 14 | 1,1 |
| star.mp3 | Zamansızdık | 40 | 2,2 |
| record.mp3 | Zamansızdık | 52 | 3 |
| complete.mp3 | Zamansızdık | 65 | 3,5 |
| zamansizdik.mp3 | Zamansızdık | 35 | 12 |
| ariyo.mp3 | Arıyo | 32 | 12 |

Efekt düzeyi 0,30; kısa arka plan müziği 0,12. Kısa müzik yalnız Müzik ve Efektler modunda kullanıcı düğmesiyle başlar; dosya sonu ve süre korumasıyla durur, tekrar etmez. Sessiz mod, görünürlük/odak kaybı, ekran değişimi, mola ve anlatıcı tüm müziği keser. Tarayıcı ses engeli hata mesajıyla bildirilir; öğrenme ve kayıt devam eder. Dış oynatıcı, iframe, video veya ziyaret sırasında haricî medya isteği yoktur.

## Kayıt koruması

`learnerName` ayrı öğrenci adı alanıdır. Eski kayıtlar alanı içermiyorsa geçerli eski özel ad aktarılır; yoksa Eylül olur. Eski eğitmen adları normalize edilir; diğer ilerleme alanları korunur. `customCharacter` eski alanı kayıttan silinmez, ancak eğitmenin adını değiştirmek için kullanılmaz.
