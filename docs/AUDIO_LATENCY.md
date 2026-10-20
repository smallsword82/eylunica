# Hızlı cevap sesi

Ses açıkken giriş ekranında 0,18 saniyelik sözsüz cevap efektleri, Ajda giriş kesiti ve 27 kısa müzik oynatıcısı `preload=auto` ile hazırlanır. Efekt tıklamasında yeni oynatıcı oluşturulmaz; hazır oynatıcı sıfırdan başlatılır. Ağ isteği veya zamanlayıcı beklenmeden `play()` çağrılır. İlk ziyaretin dosya indirmesi ve tarayıcının kullanıcı etkileşimi şartı yine geçerlidir.

Cevaplarda doğru için yükselen `answer-tick.wav`, yanlış için daha alçak `answer-retry.wav` çalar. İkisi de 0,18 saniyelik sözsüzdür; `scripts/generate-answer-sound.mjs` ile üretilir ve önceden yüklenir.

Ajda “Manifest” kaydı yalnız açılıştaki devam düğmesinde, uygulamanın her açılışında en fazla bir kez çalar. Bölüm/tur sonuçlarında bunun yerine karışık torbadan seçilen dört saniyelik bir Manifest şarkı kesiti çalar. Yeni soru bu kutlamayı beklemez: sözlü kayıt hemen kesilir.

Matematik, okuma, dikkat, konser, Arena ve değerlendirme soru ekranlarında sözlü şarkı başlatılamaz. Müzik modunda düşük sesli `public/audio/study-ambient.wav` döngüsü kullanılır. Bu özgün, sözsüz, 24 saniyelik yumuşak akor fonu `node scripts/generate-study-music.mjs` ile üretilir; Manifest şarkısının enstrümantal sürümü olduğu iddia edilmez. Müzik odasındaki katalog değişmez. Yönerge/hikâye seslendirmeleri isteğe bağlı eğitim desteği olarak kalır.

Efektler modunda fon çalmaz; Sessiz modu, mola, ebeveyn ekranı, odak/görünürlük kaybı ve açık durdurma isteği tüm sesi keser. Dosyalar PWA çevrimdışı önbelleğine dahildir. Öğrenme ilerlemesine veya geçiş hızına kilit eklenmez.
