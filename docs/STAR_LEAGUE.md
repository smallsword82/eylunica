# eylunica eğitim yıldızları

## Geçici yerel isim modu

Hesap girişi ve çevrimiçi sıralama şimdilik kapalıdır. Açılışta yalnız isim sorulur (varsayılan Eylül); isim, ilerleme ve kartlar cihazda saklanır. Yerel yıldız ekranı başka kullanıcılarla sıralama yapmaz. Supabase hesapları, sunucu puanları ve mevcut tarayıcı oturum kayıtları silinmez; bu modda oturum okunmaz, yenilenmez veya ders puanı gönderilmez. Yeniden açmak için bilinçli olarak `VITE_ONLINE_ENABLED=true` ile yeni derleme gerekir. Eski çevrimiçi tarayıcı senaryoları bu modda atlanır; isim modu ayrıca test edilir. Aşağıdaki hesap ve puanlama bilgileri devre dışı bırakılan altyapının belgesidir.

## Hesaplar

Telefon, gerçek e-posta ve Google hesabı istenmez. Kullanıcı adı 3–20 ASCII karakterden oluşur ve harfle başlar. Supabase Auth e-posta tabanlı arayüzüne uyum için yalnız teknik bir hesap kimliği üretilir: `<kullanıcı_adı>@accounts.eylunica.netlify.app`. Bu adres bir posta kutusu değildir ve e-posta gönderilmez. Parola en az 10 karakterdir. Parola ve oturumları Supabase Auth yönetir; uygulama kendi parola tablosunu tutmaz. Kayıt sırasında takma adın açık tabloda görünmesi ve otomatik parola sıfırlaması bulunmadığı açıkça belirtilir.

Supabase projesinde Email sağlayıcısı açık, Confirm email kapalı, Allow new users açık, anonim giriş ve sosyal sağlayıcılar kapalı olmalıdır. Minimum password length 10 ve Require current password when updating açık tutulur. Gerçek e-posta adresleri, geçersiz kullanıcı adları ve onaysız kayıtlar veritabanı tetikleyicisi tarafından reddedilir. Kullanıcı adı ve profil aynı kayıt işleminde atomik oluşturulur. E-posta/kullanıcı adı sonradan değiştirilemez. E-posta doğrulaması ve otomatik şifre sıfırlaması bu hesap modelinin parçası değildir.

## Puan güvenliği

`supabase/migrations/` dosyaları sırayla uygulanır. `ritma_private` şeması Data API'ye açılmaz; tablolar RLS ile korunur ve anon/authenticated rolleri doğrudan tablo okuyamaz/yazamaz. Dışarıdan yalnız dar kapsamlı public RPC sarmalayıcıları çağrılabilir. İç işlevler sabit, boş search_path kullanır ve sahipliği auth.uid() ile sınar.

Puanlar artık ayrı lig sorularından değil, mevcut matematik, okuma, dikkat, konser, arena ve ritim alıştırmalarından gelir. Soru açılınca `lesson_start` hesaba ait bir bilet üretir. Matematikte sunucu geçerli işlem ve sayılardan sonucu hesaplar; diğer sorularda özel katalogdan yanıt, kanıt veya sırayı bulur. İlk katalog 1233 kayıt içerir. V2 dikkat ve konser varyantlarıyla birlikte eski açık sekmelerle uyumluluk için toplam 2430 kayıt korunur. `node scripts/generate-lesson-catalog.mjs <yeni-migration-yolu>` motorlardan yeni bir katalog migration'ı üretir; uygulanmış dosyalar değiştirilmez. Dikkat motoru her tür/düzey için 64 yeniden üretilebilir varyant kullanır.

`lesson_answer` yalnız ilk yanıtı satır kilidi altında bir kez değerlendirir. Yanlış yanıt sonrası doğru tekrar ek puan vermez; eksik okuma yanıtı/kanıtı gönderilmez ve deneme sayılmaz. İstemci toplam puan veya doğru/yanlış bayrağı gönderemez. Günlük 20 yıldız/40 yanıt sınırı İstanbul tarihine göredir; hız bonusu yoktur. Bilet iki saatte ve gün değişiminde geçersizleşir. Aynı kullanıcının bir günden eski geçici biletleri sonraki soru açılışında temizlenir. Eski ayrı lig uçlarının authenticated erişimi kapalıdır.

Bu sistem yüksek güvenlikli sınav/ödül sistemi değildir: eğitim içerikleri ve çözümler istemcide bulunur, matematik işlemlerini istemci seçer. Sunucu hesaplaması, sahiplik, idempotent biletler ve günlük sınır, otomasyonu tümüyle engellemez. Para veya maddi ödül için kullanılmamalıdır.

Herkese açık RPC yalnız ilk 50 görünür takma ad ve lig yıldızını döndürür. E-posta, kullanıcı kimliği ve öğrenme geçmişi döndürülmez. Kullanıcı kendini tablodan gizleyebilir; iki adımlı uygulama içi onayla hesabını silebilir. Hesap silme geri alınamaz. Eski JWT'lerin süresi dolana kadar geçerli kalabilmesi Supabase oturum modelinin sınırıdır; silinmiş hesabın lig profili ve yeni soru yetkisi kalmaz.

Yerel dersler, yıldızlar ve geçmiş `ritma-progress-v1` alanında korunur. Yerel puanlar güvenilir sunucu kanıtı olmadığı için lige aktarılmaz. Lig puanları aynı kullanıcı adı/şifreyle farklı cihazlardan görülebilir; normal ders ilerlemesi henüz buluta eşitlenmez. Paylaşılan cihazda çıkış yapılmalıdır.

İlk açılışta kullanıcı adı, şifre ve veli/yetişkin paylaşım onayı içeren sade kayıt ekranı sunulur; mevcut hesap için giriş sekmesi vardır. Giriş sonrası sitedeki ad, kayıt kullanıcı adıdır; ayrı öğrenci adı formu yoktur. Eski cihaz adı/verisi değiştirilmez. İsteyen mevcut cihazda çevrimdışı devam edebilir; bu seçim yalnız sekme oturumunda tutulur ve tabloya puan yazmaz.

## Yapılandırma ve test

İstemcideki Supabase publishable key gizli değildir; RLS korumasının yerini tutmaz. Service role veya gizli anahtar web paketine koyulmaz. Ortam değişkenleri `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` ile proje değiştirilebilir.

- `node --test tests/database/league.test.mjs`: gerçek yerel PostgreSQL/PGlite izin, atomiklik, tekrar yanıt ve kayıt tetikleyicisi senaryoları.
- `node --test tests/database/lessons.test.mjs`: yeni ders kataloğu, bilet sahipliği, eksik kanıt, tekrar gönderim, süre ve günlük sınır senaryoları.
- `vitest run`: yerel uygulama regresyonları.
- `playwright test`: gerçek Chromium arayüz senaryoları; lig testlerinde API yanıtları kontrollü taklit edilir.
- Canlı API uçtan uca testleri ayrı kanıttır; taklit testler gerçek üretim girişi gibi sunulmamalıdır.

Android görünen adı `eylunica` olarak ayarlanır. Mevcut cihaz verilerini/güncelleme yolunu korumak için `com.ritma.matematiksahnesi` paket kimliği ve yerel kayıt anahtarları değiştirilmez.
