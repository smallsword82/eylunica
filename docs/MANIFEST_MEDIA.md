# Kişisel Manifest öğrenme alanı

## Güncel katalog ve oynatma — 20.10.2026 ikinci geliştirme

Önceki iki şarkılık sürüm aşağıda tarihçe olarak kalır. Güncel katalog resmî `@m6nifestgirls/videos` kanalında doğrulanan 27 ayrı şarkı/remiks kaydını içerir. Aynı şarkının dans, klip, karaoke ve canlı kopyaları ayrıca çoğaltılmaz. Aynı isimli başka sanatçıların kanalın releases sekmesine karışmış Morning View, Still Breathing ve Crystal kayıtları dahil edilmez.

Tüm güncel dosyalar 12 saniyedir, 128 kbps MP3, 44,1 kHz stereo; loudnorm -16 LUFS / -1,5 dBTP ve yumuşak giriş/çıkış uygulanır. Tam kaynaklar Git dışında kalır. Manifest dans kaydının ses akışı 403 döndürdü; aynı şarkının yayınevi tarafından sağlanan resmî albüm ses kaydı kullanıldı. Liste kaynak kimlikleriyle `src/audio/manifest-catalog.ts` içindedir.

| Şarkı/remiks | Dosya | Başlangıç sn | Resmî kaynak |
| --- | --- | --- | --- |
| TRALALA | 0rW7Fbm4S7g.mp3 | 30 | https://www.youtube.com/watch?v=0rW7Fbm4S7g |
| pVg (Manifest Live Remix) | EQQNb4iJVIk.mp3 | 30 | https://www.youtube.com/watch?v=EQQNb4iJVIk |
| Toz Pembe | 0pg0raFMNIU.mp3 | 30 | https://www.youtube.com/watch?v=0pg0raFMNIU |
| Hileli | kXKhNI4DLHM.mp3 | 30 | https://www.youtube.com/watch?v=kXKhNI4DLHM |
| Daha İyi | vso1LpaQRbo.mp3 | 30 | https://www.youtube.com/watch?v=vso1LpaQRbo |
| Zehir (Arem & Arman Remix) | KyQnG5DHk2Q.mp3 | 30 | https://www.youtube.com/watch?v=KyQnG5DHk2Q |
| Manifest (Arem & Arman Remix) | Tb8tp104XAc.mp3 | 30 | https://www.youtube.com/watch?v=Tb8tp104XAc |
| Başrol Sensin | ICfGdpZCE1Q.mp3 | 30 | https://www.youtube.com/watch?v=ICfGdpZCE1Q |
| Amateur | l6mhoQvoKE8.mp3 | 30 | https://www.youtube.com/watch?v=l6mhoQvoKE8 |
| Amatör | JzH6uWBtC3I.mp3 | 30 | https://www.youtube.com/watch?v=JzH6uWBtC3I |
| RÜYA | nB0Kdt_QQ-w.mp3 | 30 | https://www.youtube.com/watch?v=nB0Kdt_QQ-w |
| Arıyo (Zeki Arkun Remix) | ARmwemnsAFE.mp3 | 30 | https://www.youtube.com/watch?v=ARmwemnsAFE |
| Hayır (AYDEED Remix) | wvzXUBmOs8Q.mp3 | 30 | https://www.youtube.com/watch?v=wvzXUBmOs8Q |
| Rampapapam (Arem Ozguc & Arman Aydin Remix) | oufzkdej2OA.mp3 | 30 | https://www.youtube.com/watch?v=oufzkdej2OA |
| Outro (Extended Version) | Gzgik5eAPrY.mp3 | 30 | https://www.youtube.com/watch?v=Gzgik5eAPrY |
| Zehir (Motive Remix) | FlhZsk9ZU3E.mp3 | 30 | https://www.youtube.com/watch?v=FlhZsk9ZU3E |
| Yaşanacaksa | zuP6l1oA3Ro.mp3 | 30 | https://www.youtube.com/watch?v=zuP6l1oA3Ro |
| Zehir | xM4Msflqxi0.mp3 | 30 | https://www.youtube.com/watch?v=xM4Msflqxi0 |
| Durma | kW9n1gj67LI.mp3 | 30 | https://www.youtube.com/watch?v=kW9n1gj67LI |
| Hayır | dCkigRZ9HxM.mp3 | 30 | https://www.youtube.com/watch?v=dCkigRZ9HxM |
| Outro | ME-aw9zFMiw.mp3 | 30 | https://www.youtube.com/watch?v=ME-aw9zFMiw |
| Intro | DxC98ouZLyk.mp3 | 20 | https://www.youtube.com/watch?v=DxC98ouZLyk |
| Manifest | fbelrTRlls8.mp3 | 30 | https://www.youtube.com/watch?v=N2WchAwoIR8 |
| Snap | KyQCrV-z4_A.mp3 | 30 | https://www.youtube.com/watch?v=KyQCrV-z4_A |
| KTS | yRqJ6gbkBA0.mp3 | 30 | https://www.youtube.com/watch?v=yRqJ6gbkBA0 |
| Arıyo | ariyo.mp3 | 30 | https://www.youtube.com/watch?v=yQ9lXHfv9Yg |
| Zamansızdık | zamansizdik.mp3 | 30 | https://www.youtube.com/watch?v=NDPWCGO7s6I |

Varsayılan Müzik ve Efektler; kayıtlı Sessiz veya Sadece Efektler tercihi korunur. Tarayıcı izni için ilk Devam et dokunuşunda karışık oynatma başlar. Dinle ve Rastgele çal düğmeleri gerektiğinde müzik modunu aynı dokunuşta açıp kaydeder. Önceki sürümde dinleme düğmesinin varsayılan efekt modunda kapalı oluşu giderildi. Genel ses düzeyi 0,35; kullanıcı 0,05–0,80 arasında değiştirebilir. Fiziksel cihazın sessiz/medya ses ayarı tarayıcı tarafından değiştirilemez.

Karışık sıra Fisher–Yates torbasıyla kurulur; tüm katalog tüketilmeden yeni tur kurulmaz ve tur sınırında aynı parça hemen tekrarlanmaz. 12 saniyelik kesitler arasında 2,5 saniye boşluk bulunur. Efektler de bu gerçek şarkılardan rastgele seçilir, 1,1–3,5 saniyede durur. Video/iframe yoktur. Karışık oynatma ders ekranları arasında devam eder; konuşma, Sessiz, mola, odak/görünürlük kaybı ve ebeveyn ekranı durdurur. Yeni kayıtlar çevrimdışı önbelleğe dahildir.

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
