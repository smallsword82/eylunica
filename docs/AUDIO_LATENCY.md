# Hızlı cevap sesi

Ses açıkken giriş ekranında 0,18 saniyelik sözsüz cevap efekti, Ajda bölüm sonu kesiti ve 27 kısa müzik oynatıcısı `preload=auto` ile hazırlanır. Tıklamada yeni bir oynatıcı oluşturulmaz; hazır oynatıcı sıfırdan başlatılır. Ağ isteği veya zamanlayıcı beklenmeden `play()` çağrılır. İlk ziyaretin dosya indirmesi ve tarayıcının kullanıcı etkileşimi şartı yine geçerlidir.

Cevaplarda doğru için yükselen `answer-tick.wav`, yanlış için daha alçak `answer-retry.wav` çalar. İkisi de 0,18 saniyelik sözsüzdür; `scripts/generate-answer-sound.mjs` ile üretilir ve önceden yüklenir. Konuşma/şarkı içermezler ve çevrimdışı önbelleğe dahildirler. Ajda “Manifest” kaydı yalnız matematik, okuma, dikkat, konser ve Arena bölüm/tur sonuçlarında çalar. Bölüm sonu kesiti hızlı devam geçişinde tamamlanır. Sessiz modu, mola, ebeveyn ekranı, odak/görünürlük kaybı ve açık durdurma isteği sesi yine keser. Öğrenme ilerlemesine veya geçiş hızına kilit eklenmez.
