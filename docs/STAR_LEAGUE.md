# eylunica çevrimiçi yıldız ligi

## Hesaplar

Telefon, gerçek e-posta ve Google hesabı istenmez. Kullanıcı adı 3–20 ASCII karakterden oluşur ve harfle başlar. Supabase Auth e-posta tabanlı arayüzüne uyum için yalnız teknik bir hesap kimliği üretilir: `<kullanıcı_adı>@accounts.eylunica.netlify.app`. Bu adres bir posta kutusu değildir ve e-posta gönderilmez. Parola en az 10 karakterdir. Parola ve oturumları Supabase Auth yönetir; uygulama kendi parola tablosunu tutmaz. Kayıt sırasında takma adın açık tabloda görünmesi ve otomatik parola sıfırlaması bulunmadığı açıkça belirtilir.

Supabase projesinde Email sağlayıcısı açık, Confirm email kapalı, Allow new users açık, anonim giriş ve sosyal sağlayıcılar kapalı olmalıdır. Minimum password length 10 ve Require current password when updating açık tutulur. Gerçek e-posta adresleri, geçersiz kullanıcı adları ve onaysız kayıtlar veritabanı tetikleyicisi tarafından reddedilir. Kullanıcı adı ve profil aynı kayıt işleminde atomik oluşturulur. E-posta/kullanıcı adı sonradan değiştirilemez. E-posta doğrulaması ve otomatik şifre sıfırlaması bu hesap modelinin parçası değildir.

## Puan güvenliği

`supabase/migrations/` dosyaları sırayla uygulanır. `ritma_private` şeması Data API'ye açılmaz; tablolar RLS ile korunur ve anon/authenticated rolleri doğrudan tablo okuyamaz/yazamaz. Dışarıdan yalnız dar kapsamlı public RPC sarmalayıcıları çağrılabilir. İç işlevler sabit, boş search_path kullanır ve sahipliği auth.uid() ile sınar.

Sunucu soruyu üretir ve doğru yanıtı gizli tutar. Soru kimliği yalnız sahibine ait tek kullanımlıktır; yanıt ve puan güncellemesi satır kilidi altında yapılır. İstemci toplam puan gönderemez. Doğru yanıt bir yıldız verir, yanlış yanıt yıldız azaltmaz. Günlük 20 yıldız ve 40 soru sınırı İstanbul tarihine göredir; hız bonusu yoktur. Soru 15 dakikada sona erer; gece yarısından önceki soru yeni günde yeniden açılır. Bu sınırlar botları tamamen önleyen bir sistem değildir; sınırlı bir öğrenme ligi içindir.

Herkese açık RPC yalnız ilk 50 görünür takma ad ve lig yıldızını döndürür. E-posta, kullanıcı kimliği ve öğrenme geçmişi döndürülmez. Kullanıcı kendini tablodan gizleyebilir; iki adımlı uygulama içi onayla hesabını silebilir. Hesap silme geri alınamaz. Eski JWT'lerin süresi dolana kadar geçerli kalabilmesi Supabase oturum modelinin sınırıdır; silinmiş hesabın lig profili ve yeni soru yetkisi kalmaz.

Yerel dersler, yıldızlar ve geçmiş `ritma-progress-v1` alanında korunur. Yerel puanlar güvenilir sunucu kanıtı olmadığı için lige aktarılmaz. Lig puanları aynı kullanıcı adı/şifreyle farklı cihazlardan görülebilir; normal ders ilerlemesi henüz buluta eşitlenmez. Paylaşılan cihazda çıkış yapılmalıdır.

## Yapılandırma ve test

İstemcideki Supabase publishable key gizli değildir; RLS korumasının yerini tutmaz. Service role veya gizli anahtar web paketine koyulmaz. Ortam değişkenleri `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` ile proje değiştirilebilir.

- `node --test tests/database/league.test.mjs`: gerçek yerel PostgreSQL/PGlite izin, atomiklik, tekrar yanıt ve kayıt tetikleyicisi senaryoları.
- `vitest run`: yerel uygulama regresyonları.
- `playwright test`: gerçek Chromium arayüz senaryoları; lig testlerinde API yanıtları kontrollü taklit edilir.
- Canlı API uçtan uca testleri ayrı kanıttır; taklit testler gerçek üretim girişi gibi sunulmamalıdır.

Android görünen adı `eylunica` olarak ayarlanır. Mevcut cihaz verilerini/güncelleme yolunu korumak için `com.ritma.matematiksahnesi` paket kimliği ve yerel kayıt anahtarları değiştirilmez.
