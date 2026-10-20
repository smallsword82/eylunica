# Eylunica aktarımı ve RİTMA girişi — 20.10.2026

Kaynak `smallsword82/manifestakademi` özel depo, hedef `smallsword82/eylunica` başlangıçta herkese açıktı. Kullanıcının açık tercihiyle hedef önce özel yapıldı ve GitHub üzerinden özel olduğu tekrar doğrulandı. Ardından boş hedefin main dalına kaynak main aynen push edildi.

- Kaynak ve ilk hedef main: `b38b95e32174a37fc54623a803f64f3b2cba6af9`.
- Main üzerinden erişilen 10 commit, özgün kimlikleri ve ebeveyn bağlantılarıyla taşındı. Klon sığ değil; `git fsck --full` başarılı.
- Kaynağa yazılmadı. Yerel `source` uzak deposunun push adresi `DISABLED`, `origin` hedef eylunica. Main artık origin/main izler; varsayılan push origin.
- İlk geliştirme aktarılmış main üzerine eklenen ayrı bir committir; geçmiş yeniden yazılmadı.

RİTMA her açılışta karakter seçimiyle başlar. Son karakter önceden seçilidir; seçme ve özel ad verme mevcut kayıt yapısıyla çalışır. Devam düğmesi eski akademi ve macera haritasına götürür. İlerleme anahtarı/sürümü değiştirilmedi. Yerel testte karakter dışındaki yıldız, beceri, akademi, Arena, ödül ve özel ad alanlarının aynı kaldığı doğrulandı. Web verisi tarayıcı kökenine bağlıdır; başka site adresine otomatik kullanıcı verisi aktarımı yapılmaz.

Bu bilgisayarda yeni doğrulama:

- Kilit dosyasıyla `npm ci --no-audit --no-fund`.
- `vitest run`: 18 dosyada 134 test geçti.
- `tsc --noEmit`: başarılı.
- `vite build`: başarılı, PWA service worker üretildi.
- `playwright test --workers=2`: 20 test geçti, 14,9 saniye. Yerel üretim sunucusu ve Chromium kullanıldı.
- Karakter seçimi, tam kayıt koruma, yeniden açılış, çevrimdışı oyun, akademiler, Arena, ses, süre sınırları ve WCAG A/AA kontrolleri kapsandı.
- Telefon/masaüstü giriş ekranı görüntüleri yerel `test-results/ritma-welcome-mobile.png` ve `test-results/ritma-welcome-desktop.png`; görsel inceleme yapıldı.
- İlk tarayıcı denemesinde iki eski test marka düğmesinin eski erişilebilir adını aradığı için başarısızdı; seçiciler RİTMA adına güncellendi, tüm 20 test yeniden geçti.

Android APK derlemesi ve gerçek Android cihaz testi bu tur yapılmadı. GitHub Actions sonuçları yerel test kanıtı olarak kullanılmadı. Imar3B kaynakları, açık çalışması ve başlatıcıları değiştirilmedi.
