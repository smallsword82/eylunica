# Okul, akademiler ve özgün keşif kapakları — 22 Ekim 2026

İlk karşılama ve ad girişinden sonra iki ayrı giriş vardır:

- **Okul — 5. Sınıf Derslerim:** Matematik, Sosyal Bilgiler, Fen Bilimleri, Türkçe, İngilizce, Almanca ve Din Kültürü ve Ahlak Bilgisi. Yedi ders aynı ekranda görünür. Her kitap kendi konu görseline sahiptir; önceki düz simgeler kaldırıldı. Ders kitaplığının geri düğmesi iki girişin seçimine döner.
- **Akademiler:** Matematik, Okuduğunu Anlama, Dikkat ve Odaklanma; ayrıca mevcut konser, arena, müzik ve koleksiyon bağlantıları. Burada okul ders kartı bulunmaz. Akademi içinden geri dönüş akademilere yapılır; ayrı düğme ilk seçime döner.

Mevcut değerlendirme, yıldız, seviye, soru ve ders kayıtları korunur. Yeni hesap, sıfırlama veya veri taşıma gerekmez. Okul ve akademi seçimleri birbirinden ayrılır; depolama anahtarları değiştirilmez.

## Görseller

Kapaklar bu proje için görsel üretim aracıyla oluşturulmuş özgün, mor/altın keşif dünyalarıdır. Gerçek fotoğraf, ders kitabı kapağı veya üçüncü taraf sanatçının eseri olarak sunulmaz. Dış görsel sunucusuna bağlı değildir. İki yerel atlas aynı sayfada bir kez yüklenir; her kart SVG görünüm alanıyla kendi sahnesini gösterir. Kaynak resimler kırpılıp yeniden kodlanmaz. Yazılar resme gömülmez; ders adı ve yönlendirme gerçek metin olarak okunabilir kalır. Giriş düğmelerinin açık erişilebilir adları vardır, dekoratif resimler ekran okuyucuda gereksiz tekrar oluşturmaz.

- `public/discovery/academy-worlds.png`: 1254×1254; 16 sahne. Ana girişler, altı matematik dünyası, üç okuma düzeyi, dikkat etkinlikleri ve konser daveti. SHA256: `402ec42b7d7cb46dbfbfd20c2516acdcdbb0929b86156d88a76c2942125fc17a`.
- `public/discovery/school-worlds.png`: 1774×887; yedi derse özel sahne ve okul kitaplığı. SHA256: `f0bd0003d58d19144e49e93707ebd235091ebe14bca10adacac8f7d06fc100f8`.

PWA her iki dosyayı da çevrimdışı önbelleğe alır. Atlaslar yaklaşık 3,5 MiB olduğundan tek dosya önbellek sınırı 5 MiB yapıldı. Hafif yıldız/odak efektleri azaltılmış hareket tercihini izler; seçim için animasyonun bitmesini beklemek gerekmez.

Matematiğin bütün konularındaki sesli/dokunmatik öğretim değişikliği ayrı rapordadır: [MATH-GUIDED-NARRATION.md](MATH-GUIDED-NARRATION.md). Diğer derslerin sesli içerik dönüşümünün tamamlandığı iddia edilmez.

## Son doğrulama

305 birim/bileşen testi geçti. Chromium kontrollerinde iki girişin ayrılığı, tüm menülerde görseller, yedi okul kartının birlikte görünmesi, altı matematik dünyasının dar telefon/yatay ekranlarda görünmesi, geri dönüşler, kayıt koruma, erişilebilirlik ve iki atlasın çevrimdışı çözülmesi doğrulandı. Genel paketteki çevrimiçi lig yapılandırmasına bağlı dört senaryo atlandı. Ekran ve ses kontrolleri yerel üretim derlemesinde yapıldı; yayın durumu ayrıca Cloudflare API ile kontrol edilir.
