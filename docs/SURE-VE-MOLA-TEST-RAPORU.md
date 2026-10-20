# Ebeveyn ayarları, süre ve mola · 0.3.0

20 Ekim 2026. Bu ek sürüm matematik, okuma ve dikkat motorlarını ve mevcut öğrenme kayıtlarını korur.

## Davranış

- Varsayılan serbest kullanım; önerilen günlük süre 15 dakika. Süreye bağlı yıldız, zorunlu seri veya otomatik kapanma yok.
- 15 dakika hedefi, 25 dakika ilk mola ve daha sonra yaklaşık 20 etkin dakika aralıkları. Mesajlar yalnız yeni soru/görev veya uygun bölüm geçişlerinde açılır. Uzun soru yüzünden hedef ve mola gecikirse tek mesajda birleştirilir; üst üste mesaj üretilmez.
- Mola isteğe bağlıdır. Mola ekranı mevcut soruyu ve yıldızları korur, süre saymayı durdurur. Devam et seçimi yeni bir ödül üretmez.
- İsteğe bağlı günlük sınır: açık soru tamamlanabilir, yeni soru/görev başlayamaz. Sınır her üç akademide ve birleşik konser görevinde uygulanır. Ebeveyn paneli erişilebilir kalır. Panel PIN ile kilitli değildir; ayar uygulama içi bir kuraldır.
- Günlük ve bugün dahil son yedi takvim günü için toplam ve matematik/okuma/dikkat/menü ayrımı. Menü/lobi süresi diğer olarak, konser adımları ilgili akademi altında sayılır.

## Doğrulama

| Kontrol                    | Sonuç                                                         |
| -------------------------- | ------------------------------------------------------------- |
| `npm test`                 | **95 test geçti**: önceki 72 test ve 23 yeni süre/kayıt testi |
| `npm run build`            | TypeScript, Vite üretim çıktısı ve PWA başarılı               |
| Üretim Playwright testleri | **12 test geçti**: önceki 8 akış ve 4 yeni süre/ebeveyn akışı |

Yeni birim testleri: 15 dakika önerisinin sınır olmaması; 25/45/65 dakikada mola; gecikmiş önerinin yinelenmemesi; hatırlatma ayarı; akademi sürelerinin ayrılması; günlük sınır; yerel gece yarısı ve yıl değişimi; son yedi gün; 90 günlük saklama; bozuk kayıt; görünürlük/odak/arka plan; ebeveyn ve mola sürelerinin hariç tutulması; duvar saati sıçraması; gün değişiminde sınırın çözülmesi; önceki günün açık mesajının yeni hedefi tüketmemesi; Android `appStateChange` ve geciken başlangıç sorgusu yarışı; depolama adaptörleri ve eski öğrenme anahtarının değişmemesi.

Yeni tarayıcı akışları:

1. Saat ilerletilerek 15/25/45 dakika eşikleri; soru ortasında mesaj olmaması; 30 dakikalık molada sayaç ve yıldızın korunması; devam seçimi.
2. Bir dakikalık ebeveyn sınırı; açık sorunun yanıtlanabilmesi; yeni sorunun durması; sayfa yenileme ve çevrimdışı ayar kalıcılığı; okuma, dikkat ve konser başlangıçlarının da sınırla durması; serbest kullanıma dönüş.
3. Matematik, okuma ve dikkat sürelerinin ayrılması; simüle edilen odak kaybının ve ebeveyn panelinde geçirilen sürenin sayılmaması; günlük/haftalık rapor ve otomatik erişilebilirlik kontrolü.
4. Gece yarısında limit ekranının çözülmesi ve yeni gün görevinin açılması; limit iletişim kutusunun otomatik erişilebilirlik kontrolü.

Tarayıcı zaman senaryolarında Playwright saati, birim testlerinde monotonic/duvar saati ve Android yaşam döngüsü olayları kontrollü taklitlerle kullanılır. Fiziksel Android arka plan davranışının cihazda doğrulanması yerine sayılmaz. Axe WCAG A/AA kontrolleri tam erişilebilirlik sertifikası değildir.

## Kayıt ve sayaç kuralları

Yeni `ritma-wellbeing-v1` anahtarı, sürümlü ebeveyn ayarları ve son 90 günün süre özetini saklar. Önceki `ritma-progress-v1` öğrenme şeması/anahtarı, yıldız ve beceri verileri değiştirilmez. Öğrenme kaydını sıfırlamak süre ayarlarını/sayacını silmez.

Yalnız görünür ve ön plandaki kullanım sayılır; ebeveyn paneli ve mola ekranları hariçtir. Web görünürlük/odak olayları, Android'de ek olarak resmi Capacitor App yaşam döngüsü kullanılır. Elapsed süre monotonic saatten gelir; kapalı uygulama aralığı eklenmez. Süre cihazın yerel gece yarısında bölünür. Sayaç yaklaşık beş saniyede bir ve geçiş/arka plan olaylarında kaydedilir; ani süreç sonlandırması son birkaç saniyeyi kaybettirebilir. Günün anahtarı cihazın yerel takvimidir; yedi günlük rapor bugün dahil kayan yedi gündür.

Süre ve sonuçlar yalnız cihazda tutulur; sunucu, hesap, API, analitik veya yeni kişisel bilgi yoktur. Yeni Android bağımlılığı `@capacitor/app`, yaşam döngüsü takibi içindir. Gerçek Android cihaz testi ve mağaza yayını bu doğrulamaya dahil değildir.

Android APK derlemesi ve aynı commit'in GitHub Actions sonucu ayrıca doğrulanır. Yerel APK başarısı uzaktaki başarı yerine geçmez. İndirilebilir debug APK, başarılı CI çalıştırmasının `matematik-sahnesi-debug-apk` artifact'idir.
