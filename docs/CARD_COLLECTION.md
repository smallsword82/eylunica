# 24 kartlık Manifest albümü

Her eğitmenin dört farklı görseli vardır: İlk Buluşma, Anı Albümü, Hileli ve Sahne Işıkları. Görseller sadece renk değiştirilmiş kopyalar değildir; yeni portreler ve fotoğraf kolajları içerir. Kart kimlikleri ve sırası `src/game/cards.ts` içinde sabittir.

Ödül önce eksik kartı seçer; 24 kart tamamlanınca yeni kopya üretmez, koleksiyon tamamlandı mesajı gösterir. Öğrenme ve yıldızlar devam eder. Mevcut bölüm ödül anahtarları tekrar kart verilmesini engellemeye devam eder.

Eski karakter başına kart sayıları korunur. Tekrar eden kartlar aynı kişinin dört görseline dağıtılır; dört adetten fazlası eski kopya olarak saklanır. Toplam kart, yıldız, öğrenme geçmişi ve bölüm anahtarları silinmez. Yeni kayıtlar ayrıca görsel kimliği başına sayıyı saklar.

## Görsel kaynakları

İlk Buluşma mevcut `public/manifest/*.webp` görsellerini kullanır; kaynakları `MANIFEST_MEDIA.md` içindedir.

Anı Albümü: https://manifestbyme.vercel.app/ sayfasındaki isimli detay görselleri. Kaynak veri ad eşlemesi: Mina 3.webp, Lidya 4.webp, Hilal 8.webp, Esin 7.webp, Zeynep 6.webp, Sueda 5.webp. Kaynak sitedeki teknik mina/sueda kimlikleri ters olduğundan görünen ad ve biyografi başlıkları esas alındı.

Hileli: https://kprofiles.com/manifest-members-profile/ sayfasındaki her üyenin ad başlığından hemen sonraki fotoğraf. Sahne Işıkları: https://blog.biletino.com/manifest-grubu-kimdir/ sayfasındaki kişi adlarıyla açıklanan Instagram fotoğraf kolajları.

Tam kaynak dosya URL'leri `scripts/download-card-photos.mjs` içindedir. İndirilen 18 dosya değiştirilmeden yerelde saklanır; ziyaretçi dış fotoğraf sunucularına bağlanmaz. JPEG dosyaları PWA önbelleğine dahildir. Kaynak siteler veya bu görseller için açık lisans ya da grubun projeyi desteklediği iddia edilmez.
