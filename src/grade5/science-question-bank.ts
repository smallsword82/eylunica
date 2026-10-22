import {applyQuestionReview} from './question-review.ts';
import type {Question} from './catalog';
import {sciencePlans,scienceLessonById,type ScienceFigure,type ScienceKind} from './science-plans.ts';
export type ScienceQuestion=Question&{purpose:'practice'|'test'|'written';figure:ScienceFigure;family:string;legacyId?:string};
// Each row has two contrasting claims and a separate application question.
// Practice, test and written records are disjoint; variants are not sold as new objectives.
type Fact=[string,string,string,string,string,string];
const facts:Record<ScienceKind,Fact[]>={
 safety:[
 ['Etiketsiz bir maddeyle işlem yapmadan öğretmene danışılır.','Etiketi olmayan sıvı tadılarak tanınır.','Bir şişenin etiketi silinmiş. Deneye devam etmek için ne yapılmalı?','Öğretmenin güvenli yönergesi beklenmeli','Sıvılar karıştırılmalı','Şişe eve götürülmeli'],
 ['Kırık camdan uzak durup yetişkine haber verilir.','Kırık cam parçalarını elle ayırmak güvenlidir.','Yerde cam parçaları gören ekibin ilk işi hangisidir?','Bölgeden uzaklaşıp öğretmeni uyarmak','Parçaları avucunda toplamak','Parçaların üzerinden koşmak'],
 ['Koruyucu gözlük gözlere sıçrama riskini azaltmaya yardım eder.','Koruyucu gözlük kullanmak bütün güvenlik kurallarını gereksiz yapar.','Öğretmen gözlük kullanmanızı istedi. Gözlüğün amacı nedir?','Gözleri sıçramaya karşı korumaya yardım etmek','Bilinmeyen sıvıyı tanımak','Deneyi daha hızlı bitirmek'],
 ['Çalışma masasında gereksiz eşya olmaması devrilme riskini azaltır.','Deney kaplarını masanın en kenarında tutmak daha güvenlidir.','Defterler ve çanta deney kaplarına dayanıyor. Hangi düzenleme uygundur?','Gereksiz eşyaları çalışma alanından kaldırmak','Kapları masanın kenarına itmek','Daha fazla eşya yığmak'],
 ['Uzun saçlar deneyden önce toplanır.','Uzun saçların deney kaplarına değmesinde sakınca yoktur.','Saçı araçlara değen bir öğrenci hazırlığını nasıl tamamlamalı?','Saçını güvenli biçimde toplamalı','Saçını sıvıyla ıslatmalı','Yönergeyi okumadan başlamalı'],
 ['Bir araç arızalandığında deney durdurulup öğretmene bildirilir.','Arızalı elektrikli aracı çocuk tek başına açıp onarmalıdır.','Düzenek beklenmedik biçimde çalışmayı bıraktı. Hangisi güvenlidir?','Öğretmene bildirmek','Aracın içini sökmek','Prize başka bir tel sokmak'],
 ['Bilinmeyen döküntüye çıplak elle dokunulmaz.','Masanın üzerine dökülen her sıvı su kabul edilir.','Arkadaşın döküntüyü eliyle silmek üzere. Ne söylemelisin?','Dokunma, öğretmene bildirelim','Önce kokla','Başka madde ekle'],
 ['Güvenli bir deneyde yönerge anlaşılır ve izlenir.','Yönerge yerine yalnız tahminle çalışmak güvenilir sonuç sağlar.','İki ekipten biri yönergeyi izliyor, diğeri adımları atlıyor. Hangi çalışma güvenilirdir?','Yönergeye uygun olan','En hızlı görünen','En çok kap kullanan'],
 ['Deney sonunda araçlar yönergeye göre bırakılıp eller yıkanır.','Deney maddelerine dokunduktan sonra elleri yıkamak gerekmez.','Deney bittiğinde temizlik sırası için hangi seçim uygundur?','Araçları yönergeye göre bırakıp elleri yıkamak','Maddeleri arkadaşına vermek','Deney masasından yiyecek almak'],
 ['Ölçüm ve gözlemler yapıldığı gibi kaydedilir.','Beklenen sonuca uysun diye gözlem kaydı değiştirilir.','Sonuç tahmininden farklı çıktı. Bilimsel davranış hangisidir?','Gerçek gözlemi kaydedip nedenini araştırmak','Kaydı tahmine uydurmak','Arkadaşının sayısını kopyalamak'],
 ],
 sun:[
 ['Güneş kendi ışığını üreten bir yıldızdır.','Güneş ışığını yalnız Ay’dan alır.','Işık kaynağı arayan bir öğrenci hangi ikiliyi seçebilir?','Güneş ve yanan ampul','Ay ve ayna','Dünya ve sönük ampul'],
 ['Güneş yaklaşık küreseldir.','Güneş düz bir levha biçimindedir.','Güneş’in biçimini göstermek için hangi model daha uygundur?','Küre','Düz kare kart','İnce halka'],
 ['Güneş Dünya’dan çok daha büyüktür.','Güneş Dünya’dan küçüktür çünkü gökyüzünde küçük görünür.','Yakındaki küçük bir top uzaktaki büyük topu örtebiliyor. Hangi çıkarım uygundur?','Görünür boyut uzaklığa da bağlıdır','Uzaktaki top mutlaka daha küçüktür','Uzaklık görünüşü hiç etkilemez'],
 ['Güneş Dünya’ya çok uzakta olduğu için küçük görünür.','Güneş’in görünür boyutu gerçek çapını tek başına verir.','Bir fotoğraftaki Güneş’in büyüklüğünden tek başına hangisi bulunamaz?','Gerçek çapı','Fotoğraftaki yuvarlak görünüşü','Görüntüdeki bir lekenin konumu'],
 ['Güneş kendi ekseni çevresinde döner.','Güneş üzerindeki lekeler dönme hakkında bilgi vermez.','Farklı günlerde çekilen görüntülerde bir leke yer değiştiriyor. Ne araştırılabilir?','Güneş’in dönme hareketi','Ay’ın topraktan oluşması','Dünya’nın düz olması'],
 ['Güneş lekeleri çevrelerine göre daha serin görünür bölgelerle ilişkilidir.','Koyu bir güneş lekesi buz kadar soğuktur.','Bir leke çevresinden daha serinse hangi yargı doğrudur?','Yine de çok sıcak olabilir','Mutlaka buzdur','Hiç enerji yaymaz'],
 ['Güneş çok sıcak gazlardan oluşur.','Güneş’in yüzeyi sıradan katı bir kaya zemindir.','Güneş için bir yüzey gezisi çizimi yapan öğrenci hangi fikrini düzeltmeli?','Güneş üzerinde kaya zeminde yürünebileceği fikrini','Güneş’in küresel oluşunu','Güneş’in ışık üretmesini'],
 ['Güneş’i ders kitabındaki bilimsel görüntülerden incelemek güvenlidir.','Sıradan güneş gözlüğü Güneş’e dürbünle bakmayı güvenli yapar.','Güneş lekeleri ödevi için hangi kaynak seçilmelidir?','Güvenilir bilimsel görüntü arşivi','Güneş’e doğrultulan sıradan dürbün','Güneş’e uzun süre çıplak gözle bakış'],
 ['Güneş’in ışığı ve enerjisi Dünya’daki yaşam için önemlidir.','Güneş’in Dünya’daki yaşamla hiçbir ilişkisi yoktur.','Bitkilerin ışık alması için pencereli yer seçiliyor. Temel doğal ışık kaynağı hangisidir?','Güneş','Ay','Bir ayna'],
 ['Güneş ve Ay’ın ışıkla ilişkisi farklıdır.','Güneş ve Ay aynı biçimde kendi ışığını üretir.','Güneş ile Ay’ı ayıran temel özellik hangisidir?','Güneş ışık üretir, Ay gelen ışığı yansıtır','İkisi de yalnız ışık yansıtır','Ay yıldız, Güneş uydudur'],
 ],
 moon:[
 ['Ay Dünya’nın doğal uydusudur.','Ay Güneş gibi bir yıldızdır.','Dünya çevresinde doğal olarak dolanan gök cismi hangisidir?','Ay','Güneş','Bir gözlem teleskobu'],
 ['Ay Güneş ışığını yansıtır.','Ay’ın görünmesi kendi ışığını ürettiğini gösterir.','Karanlıkta aynaya ışık tutulması hangi Ay özelliğine örnek olabilir?','Gelen ışığı yansıtmasına','Kendi ışığını üretmesine','Küresel biçimini kaybetmesine'],
 ['Ay’ın yüzeyindeki çukurlara krater denir.','Ay yüzeyindeki bütün çukurlar denizle doludur.','Ay fotoğrafındaki yuvarlak çukur için hangi ad kullanılır?','Krater','Kloroplast','Dinamometre'],
 ['Ay kendi ekseni çevresinde döner.','Ay’ın aynı yüzünü görmemiz hiç dönmediğini kanıtlar.','Bir model Dünya çevresinde dolanırken hep aynı yüzünü Dünya’ya çeviriyor. Ne yapmış olur?','Kendi ekseni çevresinde de dönmüş olur','Hiç dönmemiş olur','Her zaman aynı yerde kalır'],
 ['Ay’ın dönme ve Dünya çevresinde dolanma süreleri yaklaşık eşittir.','Ay’ın dönme ve dolanma hareketi aynı hareketin iki adıdır.','Ay’ın yaklaşık aynı yüzünü görmemizi hangi iki süre açıklar?','Dönme ve Dünya çevresinde dolanma süreleri','Gece ve gündüzdeki oyun süreleri','Yağış ve rüzgâr süreleri'],
 ['Ay’ın evrelerinde gerçek biçimi yaklaşık küresel kalır.','Hilalde Ay’ın büyük bölümü gerçekten kopmuştur.','Hilal çizen öğrenci Ay’ın kalan kısmını ne yapmalı?','Karanlıkta kalan aynı kürenin parçası olarak düşünmeli','Yok olmuş saymalı','Dünya’ya düşmüş saymalı'],
 ['Ana evreler yeni ay, ilk dördün, dolunay ve son dördündür.','Dolunaydan sonraki ana evre ilk dördündür.','Yeni ay, ilk dördün, dolunay dizisinin sonraki ana evresi hangisidir?','Son dördün','İlk dördün','Güneş lekesi'],
 ['Dolunayda görünen Ay diski yaklaşık tamamen aydınlıktır.','İlk dördünde görünen Ay diski yaklaşık tamamen aydınlıktır.','Aydınlık görünümü yarım disk olan iki ana evre hangileridir?','İlk dördün ve son dördün','Yeni ay ve dolunay','Dolunay ve yeni ay'],
 ['Evreler aydınlık yarının görülen bölümüne bağlıdır.','Her Ay evresi bir Ay tutulmasıdır.','Her ay farklı Ay görünüşleri görmemiz hangi açıklamayla uyumludur?','Konuma göre aydınlık kısmı farklı görürüz','Her hafta Dünya Ay’ı tamamen örter','Ay her gece başka bir şekle dönüşür'],
 ['Ay Dünya ile birlikte Güneş çevresinde de yol alır.','Ay’ın Güneş çevresindeki hareketle hiçbir ilişkisi yoktur.','Bir çocuk Dünya ve Ay modelini birlikte Güneş çevresinde taşıyor. Bu neyi temsil eder?','Ay’ın Dünya’yla birlikte Güneş çevresindeki hareketini','Ay’ın yıldız olmasını','Ay’ın Güneş’ten büyük olmasını'],
 ],
 orbits:[
 ['Güneş Dünya ve Ay’dan büyüktür.','Ay bu üç gök cismi arasında en büyüktür.','Basketbol topu, tenis topu ve bilyeyle büyüklük sırası kurulacak. Güneş hangisi olmalı?','Basketbol topu','Tenis topu','Bilye'],
 ['Dünya Ay’dan büyüktür.','Dünya Ay’dan küçüktür.','Büyük top Güneş ise orta top hangi gök cismini temsil etmelidir?','Dünya','Ay','Bir güneş lekesi'],
 ['Dünya Güneş çevresinde dolanır.','Dünya Ay’ın çevresinde gezegen olarak dolanır.','Modelde Dünya’ya ait geniş yörünge hangi gök cismini çevrelemelidir?','Güneş’i','Yalnız Ay’ı','Dinamometreyi'],
 ['Ay Dünya çevresinde dolanır.','Ay’ın Dünya çevresindeki yolu Güneş’in eksenidir.','Modelde Ay için çizilen küçük dolanma yolu hangi cismin çevresindedir?','Dünya’nın','Yalnız bir yıldız kümesinin','Bir kasın'],
 ['Kendi ekseni çevresinde hareket dönmedir.','Bir cismin kendi ekseni çevresinde hareketine dolanma denir.','Topacın kendi ekseni çevresinde hareketi hangi harekete benzer?','Dönmeye','Dolanmaya','Sürtünmesiz durmaya'],
 ['Başka bir cisim çevresindeki hareket dolanmadır.','Dünya’nın Güneş çevresindeki hareketi yalnız kendi etrafında dönmedir.','Bir çocuk büyük topun çevresinde tur atıyor. Hangi hareketi modelliyor?','Dolanmayı','Yalnız dönmeyi','Kütle ölçmeyi'],
 ['Dünya’nın dönmesi yaklaşık bir gün sürer.','Dünya’nın kendi ekseninde bir turu yaklaşık bir yıl sürer.','Takvimde bir günün temel hareketi hangi seçenekte?','Dünya’nın kendi ekseninde dönmesi','Ay’ın bir kez görünmesi','Güneş’in Dünya çevresinde günlük dolanması'],
 ['Dünya Güneş çevresinde yaklaşık bir yılda dolanır.','Dünya Güneş çevresinde yaklaşık bir günde dolanır.','Bir yılı temsil etmek için hangi tam tur seçilir?','Dünya’nın Güneş çevresindeki turu','Dünya’nın kendi eksenindeki turu','Bir arabanın tekerleğinin turu'],
 ['Basitleştirilmiş bir modelde boyut ve uzaklıklar ölçekli olmayabilir.','Sınıf masasındaki her uzay modeli gerçek uzaklık oranlarını verir.','Toplar birbirine çok yakın çizilmişse model notunda ne açıklanmalıdır?','Uzaklıkların gerçek ölçekte olmadığı','Güneş’in Dünya’ya değdiği','Ay’ın hiç hareket etmediği'],
 ['Güneş yıldız, Dünya gezegen ve Ay doğal uydudur.','Güneş gezegen, Dünya uydu ve Ay yıldızdır.','Bir modelde ışık üreten merkez, gezegen ve doğal uydu etiketleri hangisiyle eşleşir?','Güneş, Dünya, Ay','Ay, Güneş, Dünya','Dünya, Ay, Güneş'],
 ],
 force:[
 ['Kuvvet bir itme veya çekme etkisidir.','Bir cisme dokunmak her zaman onun kütlesini değiştirir.','Çekmeceyi açmak ve topa vurmak neye örnektir?','Kuvvet uygulamaya','Kütle üretmeye','Ay evresi oluşturmaya'],
 ['Kuvvetin birimi newtondur.','Kuvvetin birimi kilogramdır.','Bir ölçüm çizelgesinde kuvvet sütununun birimi hangisi olmalı?','N','kg','cm'],
 ['Kuvvet dinamometreyle ölçülür.','Kuvvetin büyüklüğünü yalnız cetvelin boyu verir.','Bir cismin uyguladığı çekme kuvvetini ölçmek için hangi araç seçilir?','Dinamometre','Eşit kollu terazi','Dereceli silindir'],
 ['Esnek bir yay üzerindeki kuvvet arttığında yay daha çok uzayabilir.','Dinamometrede kuvvet büyürken yay mutlaka kısalır.','Aynı dinamometrede iki yükten hangisi daha büyük kuvvet uygulayabilir?','Yayı daha fazla uzatan','Yayı daha az uzatan','İkisinin rengi farklı olan'],
 ['Dinamometrede eşit aralıklar eşit kuvvet değişimini gösterir.','Dinamometrede her aralık rastgele bir değerdedir.','0 ve 10 N arasında beş eşit aralık var. Bir aralık kaç N?','2','5','10'],
 ['Ölçüm aracı kapasitesine uygun kuvvetlerle kullanılır.','Sınırı 5 N olan araca 20 N yük takmak uygundur.','En çok 10 N ölçen araçla 14 N ölçmek isteyen öğrenci ne yapmalı?','Uygun kapasiteli araç seçmeli','Yayı daha çok zorlamalı','Ölçeği yok saymalı'],
 ['Kuvvet bir cismin hızını değiştirebilir.','Kuvvet hiçbir cismin hızını değiştiremez.','Duran topa vurulduğunda hareket etmesi hangi etkiye örnektir?','Kuvvetin hareket başlatmasına','Kütlenin yok olmasına','Hücrenin bölünmesine'],
 ['Kuvvet hareketin yönünü değiştirebilir.','Kuvvet yalnız cisimlerin rengini değiştirir.','Gelen topu başka yöne gönderen oyuncu neyi değiştirmiştir?','Topun hareket yönünü','Topun madde miktarını','Topun bütün yapısını'],
 ['Kuvvet bazı cisimlerin şeklini değiştirebilir.','Süngeri sıkmak onun madde miktarını artırır.','Bir süngeri sıkan elin gözlenen etkisi hangisidir?','Şekil değiştirme','Yeni madde oluşturma','Işık üretme'],
 ['Esneklik sınırı aşılınca araç zarar görebilir.','Dinamometrenin yayı ne kadar zorlanırsa ölçüm o kadar güvenilirdir.','Ölçümden sonra yay eski hâline dönmüyor. Ne yapılmalı?','Aracı kullanmayı bırakıp öğretmene bildirmeli','Ölçümleri doğru kabul etmeli','Daha ağır yük eklemeli'],
 ],
 mass:[
 ['Kütle madde miktarının bir ölçüsüdür.','Bir cismin ağırlığı onun her yerde değişmeyen madde miktarıdır.','Bir valizdeki eşyalar aynı kalıyor. Kütleyle ilgili hangi yorum uygundur?','Madde miktarı değişmedi','Ay’da madde miktarı kaybolur','Çekim artınca madde kendiliğinden oluşur'],
 ['Kütlenin birimi kilogram olabilir.','Kütlenin birimi newtondur.','Un paketinde 2 kg yazıyor. Hangi büyüklük belirtilmiştir?','Kütle','Ağırlık kuvveti','Uzunluk'],
 ['Ağırlık bir çekim kuvvetidir.','Ağırlık yalnız cismin rengine bağlıdır.','Bir cismi aşağı doğru çeken Dünya etkisi nedir?','Yerçekimi kuvveti','Hücre duvarı','Ay ışığı'],
 ['Ağırlık newtonla ifade edilir.','Ağırlığın birimi kilogram olmalıdır.','Bir dinamometrede 30 N okundu. Hangi büyüklük ölçülmüş olabilir?','Ağırlık','Madde miktarı','Hacim'],
 ['Aynı cismin kütlesi Dünya’dan Ay’a gidince değişmez.','Bir valiz Ay’a götürülünce içindeki madde zorunlu olarak azalır.','10 kg valiz Ay’a taşındı; içinden eşya çıkarılmadı. Kütlesi kaç kg?','10','0','100'],
 ['Aynı cismin Ay’daki ağırlığı Dünya’dakinden daha azdır.','Aynı cismin Ay’daki ağırlığı Dünya’dakinden mutlaka büyüktür.','Astronot aynı valizi Ay’da dinamometreye asıyor. Ne beklenir?','Daha küçük ağırlık değeri','Daha fazla madde','Kütlenin tamamen sıfır olması'],
 ['Çekim daha büyükse aynı cismin ağırlığı daha büyük olur.','Çekim artarken aynı cismin ağırlığı daima azalır.','Aynı cisim iki gezegende farklı ağırlıkta. Madde miktarı aynıysa neden olabilir?','Gezegenlerin çekim etkisi farklıdır','Cismin rengi ölçümü belirler','Kütle mutlaka yok olmuştur'],
 ['Terazi kütle, dinamometre kuvvet ölçmede kullanılır.','Terazi ve dinamometre aynı büyüklüğün aynı birimini gösterir.','Kütle ve ağırlığı ayrı kaydeden ekip hangi araç eşlemesini kullanmalı?','Terazi ve dinamometre','İki cetvel','Mikroskop ve teleskop'],
 ['Kütle ile ağırlık farklı büyüklüklerdir.','Kilogram ve newton aynı birimin iki adıdır.','Bir tabloda kütle sütununa N yazılmış. Nasıl düzeltilmeli?','Kütle birimi kg olarak yazılmalı','Kütle yerine renk yazılmalı','İki sütun da silinmeli'],
 ['Madde eklemek cismin kütlesini artırabilir.','Boş çantaya kitap koymak kütleyi değiştirmez.','Aynı yerde boş çantaya kitaplar eklendi. Ne beklenir?','Kütle ve ağırlık artar','Madde miktarı azalır','Çanta ağırlıksız olur'],
 ],
 friction:[
 ['Sürtünme temas eden yüzeyler arasında oluşabilir.','Sürtünmenin oluşması için hiçbir temas gerekmez.','Masanın üzerinde kayan kitabın yavaşlaması hangi etkiyle açıklanabilir?','Yüzeyler arasındaki sürtünmeyle','Kitabın madde kaybetmesiyle','Ay’ın biçim değiştirmesiyle'],
 ['Kayan cismin sürtünme kuvveti hareketin ters yönündedir.','Kayan cismin sürtünme kuvveti her zaman hareketle aynı yöndedir.','Araba sağa kayarken zeminin sürtünme oku nereye çizilir?','Sola','Sağa','Daima yukarı'],
 ['Bu karşılaştırmada pürüzlü yüzey daha çok yavaşlatır.','Aynı koşullarda pürüzlü yüzeyde araba daima daha uzağa kayar.','Aynı hızdaki iki araba bu modelde halı ve düzgün tahta üzerinde bırakıldı. Hangisi önce durur?','Halıdaki','Tahtadaki','Yüzeyin hiç etkisi yoktur'],
 ['Adil yüzey karşılaştırmasında araba ve başlangıç koşulları aynı tutulur.','Yüzeyleri karşılaştırırken arabanın türü ve hızı birlikte değişmelidir.','Yalnız yüzey etkisini incelemek için hangisi aynı tutulmalı?','Araba ve başlangıç hızı','Yüzey türü','Sonuçta ölçülen mesafe'],
 ['Sürtünme yürürken kaymayı önlemeye yardım eder.','Yürümek için yerle etkileşim hiç gerekmez.','Buzda kaymamak için tabanın tutunması neden önemlidir?','Sürtünme yürümeye yardım eder','Kütleyi yok eder','Yeryüzü çekimini kaldırır'],
 ['Frenleme sırasında sürtünme yavaşlamaya yardım eder.','Fren her koşulda sürtünmeyi sıfırlayarak durdurur.','Bisiklet freninin hareketi yavaşlatması hangi yararlı etkiye örnektir?','Sürtünmeye','Işık üretimine','Hücre büyümesine'],
 ['Sürtünme yüzeylerde aşınmaya yol açabilir.','Sürtünme hiçbir yüzeyde aşınma oluşturamaz.','Ayakkabı tabanının zamanla incelmesi neye örnektir?','Aşınmaya','Yeni madde üretimine','Kütlenin yerçekimiyle değişmesine'],
 ['Uygun yağlama bazı düzeneklerde sürtünmeyi azaltabilir.','Yağlama her durumda sürtünmeyi artırmak içindir.','Bir menteşede gereksiz sürtünme azaltılmak isteniyor. Yetişkin hangi yöntemi kullanabilir?','Uygun yağlama','Daha pürüzlü yüzey yapma','Kum ekleme'],
 ['Sürtünmenin etkisi yüzey özelliklerine bağlıdır.','Yüzeyin pürüzlülüğü sürtünmeyle hiç ilişkili değildir.','Tırmanış ayakkabısının tabanı hangi amaçla tutucu yapılır?','Kaymayı azaltmak','Kütleyi sıfırlamak','Yerçekimini yok etmek'],
 ['İtme bırakıldığında da sürtünme hareketi yavaşlatabilir.','El çekilince kayan cisme hiçbir kuvvet etki edemez.','İtme bittikten sonra oyuncak araba yavaşlıyor. Hangi açıklama uygundur?','Sürtünme etkisi sürüyor','Araba madde olmaktan çıkıyor','Yol uzadıkça Ay büyüyor'],
 ],
 cell:[
 ['Hücre canlıların temel yapı birimidir.','Canlıların en küçük yapı birimi hücre değil, organdır.','Mikroskopta canlıya ait temel yapı birimleri görülüyor. Bunlara ne denir?','Hücre','Eklem','Krater'],
 ['Hücre zarı madde alışverişinde seçici bir sınır oluşturur.','Hücre zarı yalnız bitki hücrelerinde bulunur.','Bir hücrenin dış ortamla alışveriş yapan sınırı hangi yapıdır?','Hücre zarı','Çekirdek','Mitokondri'],
 ['Sitoplazmada birçok yaşamsal olay gerçekleşir.','Sitoplazma hücrenin dışındaki kemik tabakasıdır.','Organellerin bulunduğu ve yaşamsal olayların gerçekleştiği bölüm hangisidir?','Sitoplazma','Hücre duvarının dışı','Eklem boşluğu'],
 ['Çekirdek hücrenin yönetiminde görev alır.','Çekirdek yalnız enerji üretmekle görevli bir zar parçasıdır.','Hücreyi yöneten bilgi ve işleyişle ilişkili yapı hangisidir?','Çekirdek','Kloroplast','Hücre duvarı'],
 ['Bitki hücresinde zarın dışında hücre duvarı bulunur.','Hayvan hücresinde de bitkideki gibi hücre duvarı vardır.','Modelde zarın dışında sert bir destek tabakası var. Hangi hücreye işaret eder?','Bitki hücresine','Hücre duvarlı hayvan hücresine','Bir ekleme'],
 ['Kloroplast ışık kullanılarak besin üretilmesinde görevlidir.','Kloroplast bütün hayvan hücrelerinde bulunur.','Yeşil bir yaprak hücresinde ışıkla besin üretiminde hangi organel görev alır?','Kloroplast','Eklem','Krater'],
 ['Mitokondri hücrenin kullanılabilir enerji elde etmesinde görevlidir.','Mitokondri yalnız hücrenin dış şeklini belirler.','Bir hücrenin enerji ihtiyacıyla ilişkili organel hangisidir?','Mitokondri','Hücre duvarı','Hücre zarı'],
 ['Bitki ve hayvan hücrelerinde hücre zarı ve sitoplazma bulunur.','Bitki ve hayvan hücrelerinin hiçbir ortak yapısı yoktur.','İki farklı hücre modelinde ortak hangi ikili gösterilebilir?','Hücre zarı ve sitoplazma','Hücre duvarı ve kloroplast her ikisinde','Kemik ve eklem'],
 ['Kofullar depolamada görev alır.','Koful bir hücrenin yürüyen kasıdır.','Hücre içinde bazı maddeleri depolayan keseciklere hangi ad verilir?','Koful','Krater','Kiriş'],
 ['Doku ve organlar çok sayıda hücrenin örgütlenmesiyle oluşur.','Bir organ, hücrelerden bağımsız tek bir madde parçasıdır.','Benzer görevdeki hücrelerin oluşturduğu yapı düzeyi hangisidir?','Doku','Gök cismi','Dinamometre'],
 ],
 body:[
 ['İskelet vücuda destek sağlar.','İskelet yalnız vücudun rengini belirler.','İnsan bedeninin dik durmasına destek olan yapı hangisidir?','İskelet','Saç rengi','Yalnız deri'],
 ['Kafatası beyni korumaya yardım eder.','Kafatasının temel görevi dizin bükülmesini sağlamaktır.','Beyin çevresindeki kemik yapı hangi göreve örnektir?','Koruma','Işık yansıtma','Besin üretme'],
 ['Eklemler kemiklerin birleşme yerleridir.','Eklem tek başına bir güneş lekesidir.','İki kemiğin birleşip hareket ilişkisi kurduğu bölgeye ne denir?','Eklem','Kloroplast','Hücre çekirdeği'],
 ['Her eklemin hareket yeteneği aynı değildir.','Vücuttaki bütün eklemler dirsek kadar hareket eder.','Kafatası kemiklerinin bağlantıları ile dirsek karşılaştırılıyor. Hangi yorum doğrudur?','Hareket yetenekleri farklıdır','İkisi de aynı açıyla bükülür','Kemikler hiçbir yerde birleşmez'],
 ['Kaslar kasılıp gevşeyerek hareketi sağlar.','Kemikler kasların yardımı olmadan kendiliğinden kasılır.','Bir kol bükülürken kemikleri hareket ettiren temel etken hangisidir?','Kasların çalışması','Kemiklerin erimesi','Derinin renk değiştirmesi'],
 ['Kemikler ve kaslar hareket sırasında birlikte çalışır.','Kaslar iskeletten tamamen bağımsız hareket oluşturur.','Topa vurmak için hangi takım birlikte çalışır?','Kas, kemik ve eklemler','Yalnız saç ve tırnak','Yalnız dişler'],
 ['Dengeli beslenme destek ve hareket sistemi için önemlidir.','Tek bir besin bütün vücut gereksinimlerini karşılar.','Kemik ve kas sağlığını destekleyen beslenme yaklaşımı hangisidir?','Çeşitli ve dengeli beslenme','Yalnız şeker tüketme','Bütün öğünleri atlama'],
 ['Uygun düzenli hareket kas ve kemik sağlığını destekler.','Uzun süre hiç hareket etmemek her zaman en sağlıklı seçimdir.','Oyun ve çalışma arasında hangi alışkanlık uygundur?','Yaşa uygun düzenli hareket','Bütün gün aynı pozisyonda kalmak','Ağrıya rağmen zorlamaya devam etmek'],
 ['Doğru duruş ve uygun çanta kullanımı önemlidir.','Çantayı tek omuzda çok ağır taşımak her zaman uygundur.','Ağır çantayla eğilerek yürüyen öğrenciye ne önerilir?','Yükü azaltıp uygun biçimde iki omuzla taşımak','Çantayı daha da ağırlaştırmak','Ağrıyı görmezden gelmek'],
 ['Bir yaralanmada yetişkine haber verilir ve zorlayıcı hareket bırakılır.','Ağrıyan eklem zorlandıkça her zaman iyileşir.','Oyunda bileği ağrıyan çocuk için güvenli seçim hangisidir?','Hareketi bırakıp yetişkine haber vermek','Ağrıya rağmen sıçramak','Bileği zorla çevirmek'],
 ],
};
function choices(answer:string,others:string[],seed:number){const rows=[...new Set([answer,...others])];const shift=seed%rows.length;return [...rows.slice(shift),...rows.slice(0,shift)];}
const fillOptions:Record<ScienceKind,string[]>={safety:['öğretmene','arkadaşına','tek başına kendine'],sun:['dönme','dolanma','yansıma'],moon:['dolunay','yeni ay','son dördün'],orbits:['dönme','dolanma','sürtünme'],force:['2','1','4','10'],mass:['dinamometre','terazi','cetvel'],friction:['paraşüt','kaykay','paten'],cell:['çekirdek','sitoplazma','hücre zarı'],body:['eklem','kas','kemik']};
const extraPractice:Record<ScienceKind,[string,string,string,string]>={
 safety:['Deney öncesinde bir adımı anlamadın. Hangisini seçersin?','Öğretmenden açıklama isterim','Tahminle başlarım','Adımı atlarım'],
 sun:['Bir yıldız ile bir uyduyu karşılaştırıyorsun. Hangisi Güneş için uygundur?','Kendi enerjisini ve ışığını üretir','Işığını yalnız Dünya’dan alır','Dünya’nın çevresindeki doğal uydudur'],
 moon:['Yeni ay ve dolunay çizimlerinde Ay dairesinin boyutu nasıl olmalı?','Aynı büyüklükte','Yeni ayda yok olmalı','Dolunayda gerçek çapı ikiye katlanmalı'],
 orbits:['Dünya maketi Güneş çevresinde taşınırken Ay maketi masada kaldı. Modelde ne düzeltilmeli?','Ay, Dünya’yla birlikte taşınmalı','Ay bir yıldıza dönüştürülmeli','Dünya’nın hareketi tamamen durdurulmalı'],
 force:['Dinamometre başlangıçta yük yokken sıfırı göstermiyorsa ne yaparsın?','Öğretmene bildirip uygun ayarı beklersin','Yanlış değeri doğru kabul edersin','Yayı elle çok uzatırsın'],
 mass:['Aynı yerde bir çantadan kitap çıkarılıyor. Hangi değişim beklenir?','Kütle azalır','Madde miktarı artar','Kilogram kuvvete dönüşür'],
 friction:['Islak ve kaygan zeminde yürürken hangi davranış daha uygundur?','Yavaş ve dikkatli hareket etmek','Daha hızlı koşmak','Dengeyi önemsememek'],
 cell:['Hayvan hücresi modeli için hangisi ortak temel kısımlardan biridir?','Hücre zarı','Hücre duvarı','Kloroplast'],
 body:['Dirseğini bükerken kolundaki kemikler nasıl davranır?','Eklemin çevresinde konumları değişir','Kemikler kas gibi kısalır','Kemikler tamamen yok olur'],
};
function figureFor(kind:ScienceKind,i:number):ScienceFigure{
 const variants:Partial<Record<ScienceKind,string[]>>={force:['push','scale','scale','comparison','scale','capacity','push','turn','sponge','damaged'],cell:['animal','membrane','cytoplasm','nucleus','comparison','chloroplast','mitochondria','comparison','vacuole','levels'],body:['skeleton','skull','joint','jointComparison','muscle','kick','food','exercise','backpack','injury'],friction:['slide','direction','compare','compare','walk','brake','wear','hinge','grip','slide']};
 return {kind,focus:i%4,variant:variants[kind]?.[i],values:kind==='force'?[6,2,10,5]:kind==='mass'?[10,0]:kind==='moon'?[i%4]:[0]};
}
export const scienceQuestions:ScienceQuestion[]=sciencePlans.flatMap((plan)=>{
 const base=scienceLessonById.get(plan.id)!;
 const practice:ScienceQuestion[]=base.questions.map((raw,i)=>{
  const q=applyQuestionReview({...raw,topicId:plan.id,outcomeCode:null});
  const figure:ScienceFigure={...plan.figure,focus:i%4};
  if(plan.kind==='force'&&i===2)figure.values=[6,2,20,10];
  if(plan.kind==='force'&&i===3)figure.variant='sponge';
  if(plan.kind==='force'&&i===4)figure.variant='capacity';
  if(plan.kind==='force'&&i===5)figure.variant='comparison';
  if(plan.kind==='friction'&&(i===1||i===2))figure.variant='parachute';
  if(plan.kind==='friction'&&i===3)figure.variant='hinge';
  if(plan.kind==='cell'&&i===4)figure.variant='levels';
  if(plan.kind==='cell'&&i===5)figure.variant='root';
  return {...q,id:`sj-practice-${plan.kind}-${i}`,legacyId:q.id,topicId:plan.id,purpose:'practice',family:`practice-${i}`,outcomeCode:null,kind:'choice',choices:choices(q.answer,(q.choices||fillOptions[plan.kind]).filter(c=>c.toLocaleLowerCase('tr')!==q.answer.toLocaleLowerCase('tr')),i),prompt:q.prompt.replace(/Tek sözcük yaz\.?|Yalnız sayı yaz\.?/g,'Uygun yanıta dokun.').replace(/sözcüğü yaz\.?/g,'sözcüğü seç.'),figure};
 });
 practice.push({id:`sj-practice-${plan.kind}-6`,topicId:plan.id,purpose:'practice',family:'discovery-check',outcomeCode:null,kind:'choice',prompt:`Keşif görevindeki doğru sonuç hangisidir? ${plan.name}`,answer:plan.answer,choices:choices(plan.answer,plan.choices,2),explanation:plan.success,hints:[plan.hint],difficulty:1,figure:{...plan.figure,focus:3}});
 const extra=extraPractice[plan.kind];practice.push({id:`sj-practice-${plan.kind}-7`,topicId:plan.id,purpose:'practice',family:'transfer-check',outcomeCode:null,kind:'choice',prompt:extra[0],answer:extra[1],choices:choices(extra[1],extra.slice(2),1),explanation:extra[1].length<10?'Dönme, bir cismin kendi ekseni çevresinde yaptığı harekettir.':extra[1]+'.',hints:[plan.hint],difficulty:2,figure:{...plan.figure,focus:2}});
 const test:ScienceQuestion[]=facts[plan.kind].flatMap((f,i)=>{
  const trueClaim=i%2===0;
  return [
   {id:`sj-test-${plan.kind}-${i}-claim`,topicId:plan.id,purpose:'test' as const,family:`claim-${i}`,outcomeCode:null,kind:'boolean' as const,prompt:`${trueClaim?f[0]:f[1]} Bu açıklama doğru mu, yanlış mı?`,answer:trueClaim?'Doğru':'Yanlış',choices:choices(trueClaim?'Doğru':'Yanlış',[trueClaim?'Yanlış':'Doğru'],i),explanation:f[0],hints:[f[0]],difficulty:2 as const,figure:figureFor(plan.kind,i)},
   {id:`sj-test-${plan.kind}-${i}-apply`,topicId:plan.id,purpose:'test' as const,family:`apply-${i}`,outcomeCode:null,kind:'choice' as const,prompt:f[2],answer:f[3],choices:choices(f[3],[f[4],f[5]],i+2),explanation:f[0],hints:[f[0]],difficulty:3 as const,figure:figureFor(plan.kind,i)},
  ];
 });
 const written:ScienceQuestion[]=facts[plan.kind].map((f,i)=>({id:`sj-written-${plan.kind}-${i}`,topicId:plan.id,purpose:'written',family:`reason-${i}`,outcomeCode:null,kind:'choice',prompt:`Bir arkadaşın “${f[1]}” diyor. Bu düşünceyi hangi açıklamayla düzeltirsin?`,answer:f[0],choices:choices(f[0],[f[1],facts[plan.kind][(i+3)%10][1]],i+1),explanation:f[0],hints:[f[0]],difficulty:3,figure:figureFor(plan.kind,i)}));
 return [...practice,...test,...written];
});
export const scienceQuestionById=new Map(scienceQuestions.map(q=>[q.id,q]));
export function selectScienceQuestions(topicId:string,purpose:ScienceQuestion['purpose'],used:string[],count:number){const excluded=new Set(used);return scienceQuestions.filter(q=>q.topicId===topicId&&q.purpose===purpose&&!excluded.has(q.id)).slice(0,count);}
