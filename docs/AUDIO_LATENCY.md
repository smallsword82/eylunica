# Hızlı cevap sesi

Ses açıkken giriş ekranında Ajda cevap kesiti ve 27 kısa müzik oynatıcısı `preload=auto` ile hazırlanır. Tıklamada yeni bir oynatıcı oluşturulmaz; hazır oynatıcı sıfırdan başlatılır. Ağ isteği veya zamanlayıcı beklenmeden `play()` çağrılır. İlk ziyaretin dosya indirmesi ve tarayıcının kullanıcı etkileşimi şartı yine geçerlidir.

Cevap kesiti sonraki soruya veya sonuç ekranına hızlı geçişte tamamlanır. Tamamlama efekti bu kesitin üstüne başlamaz. Sessiz modu, mola, ebeveyn ekranı, odak/görünürlük kaybı ve kullanıcının açık durdurma isteği sesi yine keser. Öğrenme ilerlemesine veya geçiş hızına kilit eklenmez.
