import type { LessonContent, LessonQuestion } from '../content-types';

type Check = [string, string, string, string, string];
type Seed = {
 ids: string[];
 teaching: [string, string, string];
 example: [string, string, string, string];
 checks: [Check, Check, Check, Check];
 gap: [string, string, string];
 statement: [string, boolean, string];
 activity?: { title: string; instructions: string[]; reflection: string };
};
const seeds: Seed[] = [];
const add = (seed: Seed) => seeds.push(seed);
const activity = (title: string, instructions: string[], reflection: string) => ({ title, instructions, reflection });

// Din kültürü: beliefs are described in their curricular context. No quotation
// or pronunciation is invented, and a pupil's personal belief is never graded.
add({ids:['topic-676d823386fee9f0'],teaching:[
 'İslam düşüncesinde evrendeki düzen, varlıkların birbiriyle ilişkisi üzerinde düşünmeye yönelten bir konudur. Gece ve gündüzün düzenli oluşu gözlem örneklerinden biridir.',
 'Gözlem, duyularımızla veya araçlarla bilgi toplamaktır; bir gözlemden çıkarılan anlam ise yorumdur. Dünya’nın dönmesi bilimsel açıklamadır; bu düzenin anlamı üzerine düşünmek dinî yorum alanına da girer.',
 'Doğadaki canlıların birbirine ihtiyacını fark etmek, kaynakları koruma sorumluluğunu hatırlatır. Bilimsel açıklama ile dinî yorumu birbirinin yerine kullanmamak gerekir.'
],example:['Arıların çiçekler arasında dolaşmasını gözlemleyen Ece hangi ilişkiyi fark edebilir?','Arı besin toplarken çiçekler arasında polen taşınmasına katkı sağlar.','Bu karşılıklı ilişkiyi fark etmek doğayı korumaya yönelik bir sorumluluğa dönüştürülebilir.','Canlılar arasındaki ilişkiyi gözlemleyip çiçekleri ve yaşam alanlarını koruyabilir.'],checks:[
 ['Gece ve gündüzün oluşumunu açıklayan hareket hangisidir?','Dünya’nın kendi ekseni etrafında dönmesi','Ay’ın renginin değişmesi','Bulutların kaybolması','Dünya döndükçe bir bölge sırayla Güneş ışığı alır veya almaz.'],
 ['“Bu hafta her gün Güneş’in doğuş saatini not ettim.” cümlesi neye örnektir?','Gözlem verisi toplamaya','Kanıtsız söylentiye','Kaynak israfına','Saatleri düzenli kaydetmek gözlem yoluyla veri toplamaktır.'],
 ['Doğadaki ilişkileri fark eden bir öğrencinin hangi davranışı uygundur?','Canlıların yaşam alanlarını koruması','Çiçekleri gereksiz yere koparması','Suyu boşa akıtması','Canlıların birbirine bağımlılığı, yaşam alanlarını korumayı gerektirir.'],
 ['“Dünya döner” açıklaması ile “Düzen üzerinde düşünmek insana sorumluluk hatırlatır” yorumu nasıl ele alınmalıdır?','Bilimsel açıklama ile değer yorumunu ayırt ederek','İkisini aynı tür ölçüm sayarak','Gözlemi gereksiz sayarak','Birincisi doğal olgunun açıklaması, ikincisi o olguya verilen anlamla ilgilidir.']
],gap:['Duyularımız veya araçlarla bilgi toplamaya ne denir? Tek sözcük yaz.','gözlem','Gözlem, bir durumu dikkatle inceleyip bilgi toplamaktır.'],statement:['Doğadaki düzen üzerine düşünmek, çevreyi koruma sorumluluğuyla ilişkilendirilebilir.',true,'Düşünme, kaynakları bilinçli kullanma gibi davranışlara dönüşebilir.']});

add({ids:['topic-fa98998239e0f4f6'],teaching:[
 'İslam inancında Allah’ın var ve bir olduğuna inanılır. Allah’ın birliği, din kültürü dersinde “tevhit” kavramıyla anlatılır.',
 'Tevhit, Allah’ın eşi ve benzeri olmadığı inancını içerir. Bu, İslam’ın temel inanç esaslarının açıklanmasıdır; insanların kişisel inançları hakkında not verme ölçütü değildir.',
 'Bir inanç konusunu öğrenirken tanımları doğru kullanmak ve farklı görüşlere sahip insanlarla saygılı konuşmak gerekir.'
],example:['“İslam inancında Allah’ın birliğini anlatan kavram nedir?” sorusu nasıl cevaplanır?','Sorunun bir dinin temel kavramını sorduğunu fark et.','Birlik inancının adını hatırla.','Tevhit.'],checks:[
 ['İslam inancında Allah’ın birliğini ifade eden kavram hangisidir?','Tevhit','Hicret','Mihrap','Tevhit, Allah’ın birliği inancını ifade eder.'],
 ['Tevhit kavramı hangi konuyla ilgilidir?','İnanç','Mimari ölçü','Müzik ritmi','Tevhit, İslam’ın inanç esaslarıyla ilgilidir.'],
 ['Dinî kavramları konuşurken hangi davranış uygundur?','Karşıdakini dinleyip saygılı ifadeler kullanmak','Farklı düşüneni küçümsemek','Soru sormayı yasaklamak','Saygı, birlikte öğrenmenin temelidir.'],
 ['Bir öğrenci “tevhit” ile “cami”yi karıştırıyor. Hangi açıklama yardımcı olur?','Tevhit inanç kavramı, cami ibadet yapısıdır.','İkisi de çalgı adıdır.','İkisi aynı yapı bölümüdür.','Kavramları ait oldukları alana göre ayırmak karışıklığı giderir.']
],gap:['Allah’ın birliğini anlatan kavramı tek sözcükle yaz.','tevhit','Tevhit, Allah’ın birliği inancıdır.'],statement:['Tevhit, bir caminin giriş kapısının adıdır.',false,'Tevhit bir inanç kavramıdır, yapı bölümü değildir.']});

add({ids:['topic-bb4ba5bb487fc7f0'],teaching:[
 'İslam geleneğinde Allah’ın güzel isimleri “esma-i hüsna” ifadesiyle anılır. Bu isimler Allah’ın özelliklerini tanımaya yardımcı olur.',
 'Rahman merhametle, Alîm her şeyi bilmeyle, Semi işitmeyle, Basîr görmeyle ilişkilidir. İsimlerin anlamları birbiriyle karıştırılmamalıdır.',
 'Bu kavramlar öğrenilirken başkalarına merhametli davranmak gibi günlük yaşam örnekleri üzerinde düşünülebilir. İnsanların bilgisi ve gücü sınırlıdır; bu isimlerin anlamı insan özellikleriyle tamamen özdeş sayılmaz.'
],example:['Alîm ve Semi isimlerini anlamlarına göre ayır.','“Bilmek” ve “işitmek” eylemlerini ayır.','Alîm bilmeyle, Semi işitmeyle ilişkilidir.','Alîm: bilen; Semi: işiten.'],checks:[
 ['Allah’ın güzel isimlerini anlatan ifade hangisidir?','Esma-i hüsna','İçindekiler','Repertuvar','Esma-i hüsna, Allah’ın güzel isimleri için kullanılır.'],
 ['Alîm ismi hangi anlamla ilişkilidir?','Bilmek','Renk','Uzunluk','Alîm, Allah’ın her şeyi bilmesiyle ilişkilidir.'],
 ['Semi ismi hangi anlamla ilişkilidir?','İşitmek','Yazmak','Yüzmek','Semi, işitmeyle ilgili isimdir.'],
 ['Yardıma ihtiyacı olan arkadaşına anlayışla yaklaşan öğrenci hangi değer üzerinde çalışmaktadır?','Merhamet','İsraf','Kibir','Başkasının ihtiyacını fark edip nazik davranmak merhamet örneğidir.']
],gap:['İşitmeyle ilişkilendirilen güzel isim hangisidir?','Semi','Semi, Allah’ın işitmesiyle ilişkilidir.'],statement:['Alîm ve Semi isimleri aynı anlama gelir.',false,'Alîm bilmeyle, Semi işitmeyle ilişkilidir.']});

add({ids:['topic-412fb285121ff468'],teaching:[
 'İhlas suresi, Kur’an-ı Kerim’in 112. suresidir ve dört ayetten oluşur. Temel konusu Allah’ın birliğidir.',
 'Surenin anlamı öğrenilirken Allah’ın eşi ve benzeri olmadığı vurgusu üzerinde durulur. Sure, İslam inancındaki tevhit anlayışıyla ilişkilidir.',
 'Okunuş çalışması öğretmenin veya güvenilir bir basılı metnin rehberliğinde yapılmalıdır. Buradaki çalışma anlam ve temel bilgi üzerinedir; sesli okuma becerisini ölçmez.'
],example:['Bir öğrenci İhlas suresinin ana fikrini bir kavramla özetlemek istiyor.','Surenin Allah’ın birliğini anlattığını belirle.','Bu inancın adını hatırla.','Tevhit.'],checks:[
 ['İhlas suresinin ana konusu hangisidir?','Allah’ın birliği','Alışveriş ölçüleri','Yol tarifi','İhlas suresinde Allah’ın birliği vurgulanır.'],
 ['İhlas suresi kaç ayettir?','4','12','20','İhlas suresi dört ayetten oluşur.'],
 ['İhlas suresinin Kur’an’daki sıra numarası hangisidir?','112','1','36','İhlas suresi Kur’an’ın 112. suresidir.'],
 ['İhlas suresinin anlamını öğrenen bir öğrenci hangi kavramla bağlantı kurar?','Tevhit','Minare','Rekat','Surenin birlik vurgusu tevhit kavramıyla ilişkilidir.']
],gap:['İhlas suresi kaç ayettir? Rakamla yaz.','4','Surenin ayet sayısı dörttür.'],statement:['Bu metinle yapılan çalışma, öğrencinin sesli okuma telaffuzunu ölçer.',false,'Metin anlam bilgisini destekler; telaffuz için dinleme ve öğretmen rehberliği gerekir.']});

add({ids:['topic-942f8092400f8da2'],teaching:[
 'Namaz, İslam’da belirli vakitlerde yerine getirilen bir ibadettir. Dua, okuma ve belirli beden hareketlerini içerir.',
 'Namaz öncesinde temizlik ve uygun bir ortam hazırlığı yapılır. İbadetin anlamını öğrenmek, yalnız hareketlerin adını ezberlemekten daha kapsamlıdır.',
 'Din kültürü dersinde namazın yeri ve kavramları öğrenilir. Kişinin ibadet edip etmemesi hakkında hüküm vermek ya da sınıf arkadaşını baskılamak uygun değildir.'
],example:['“Namaz sadece bir beden egzersizidir” diyen bir öğrenciye nasıl açıklama yapılır?','İbadette okuma ve dua bulunduğunu hatırla.','Hareketlerin bu ibadet bütününün bir parçası olduğunu belirt.','Namaz, dua ve okumayı da içeren bir ibadettir.'],checks:[
 ['Namaz din kültürü dersinde hangi başlık altında öğrenilir?','İbadet','Alışveriş','Spor karşılaşması','Namaz, İslam’da bir ibadettir.'],
 ['Namaz hazırlığında hangi davranış yer alır?','Temizliğe dikkat etmek','Çevreyi kirletmek','Başkalarını rahatsız etmek','İbadet hazırlığında temizlik ve uygun ortam önemlidir.'],
 ['Namazın içeriği hangi ifadeyle daha doğru anlatılır?','Dua, okuma ve belirli hareketler','Yalnız hızlı koşma','Yalnız bir yapı adı','Namaz, farklı unsurları olan bir ibadet bütünüdür.'],
 ['Sınıfta namaz konusunu öğrenirken hangi tutum uygundur?','Kavramları öğrenip arkadaşların kişisel alanına saygı göstermek','Arkadaşları ibadetleri üzerinden küçümsemek','Kimsenin soru sormasına izin vermemek','Dersin amacı öğrenmektir; kişisel yaşamı yargılamak değildir.']
],gap:['İslam’da dua, okuma ve belirli hareketleri içeren bu ibadetin adı nedir?','namaz','Tanım namaz ibadetini anlatır.'],statement:['Namazın din kültürü dersindeki yeri ibadet konusudur.',true,'Namaz ibadetler arasında ele alınır.']});

add({ids:['topic-18992c208fc2157b'],teaching:[
 'Namazın bölümlerini öğrenirken hazırlık, başlangıç ve ibadet içindeki duruşları ayırt ederiz. Niyet ve başlangıç tekbiri namaza başlama ile ilgilidir.',
 'Kıyam ayakta durma, rükû eğilme, secde ise yere kapanma duruşudur. Rekat, namazın belirli okuma ve hareketlerden oluşan bölümüdür.',
 'Uygulama ayrıntıları ve sağlık durumuna uygun düzenlemeler öğretmen rehberliğinde öğrenilir. Buradaki sorular kavram bilgisini ölçer; ibadetin kabulü veya kişinin inancı hakkında karar vermez.'
],example:['Kıyam ve rükûyu karıştıran bir öğrenci iki kavramı nasıl ayırır?','Kıyamın ayakta durma olduğunu belirle.','Rükûnun eğilme olduğunu karşılaştır.','Kıyam: ayakta durma; rükû: eğilme.'],checks:[
 ['Namazda ayakta durmaya ne denir?','Kıyam','Minare','Mihrap','Kıyam, ayakta durma bölümünün adıdır.'],
 ['Namazdaki eğilme duruşunun adı nedir?','Rükû','Ezan','Sure','Rükû, eğilme duruşudur.'],
 ['Rekat hangi ifadeyle açıklanır?','Belirli okuma ve hareketlerden oluşan bölüm','Bir caminin bahçesi','Bir çalgı türü','Rekat namazın yapısındaki bir bölümdür.'],
 ['Bir öğrenci uygulama ayrıntısında kararsız kaldığında ne yapmalıdır?','Öğretmeninden güvenilir açıklama istemelidir.','Duyduğu her bilgiyi denetlemeden doğru saymalıdır.','Arkadaşını küçümsemelidir.','Ayrıntılar rehberlikle öğrenilmeli, tahminle kesin bilgiye dönüştürülmemelidir.']
],gap:['Namazda ayakta durmanın adını yaz.','kıyam','Kıyam ayakta durmadır.'],statement:['Rükû, namazdaki eğilme duruşudur.',true,'Rükû ile kıyam farklı duruşlardır.']});

add({ids:['topic-f88e70eb7816d042'],teaching:[
 'İslam’ın ibadet anlayışında namazın kişiye zamanını düzenleme, temizliğe dikkat etme ve sorumluluk üzerinde düşünme fırsatı sunduğu anlatılır.',
 'İbadetlerin ahlaki davranışlarla ilişkisi, örneğin başkasını incitmemek ve verilen sözü tutmak üzerinden ele alınır. İbadet etmek başkalarını küçümseme gerekçesi olamaz.',
 'Bir davranışın günlük yaşama yansımasını değerlendirirken somut örnek ararız: zamanı planlamak, ortak alanı temiz bırakmak ve yardım etmek gibi.'
],example:['Bir öğrenci yaptığı işleri zamanında tamamlamak için gününü planlıyor. Bu örnek hangi kazanımla ilişkilendirilebilir?','Planlamanın davranışa dönüştüğünü fark et.','Zamanı düzenleme ve sorumluluk kavramlarını eşleştir.','Zaman yönetimi ve sorumluluk.'],checks:[
 ['Namazın günlük yaşamla ilişkilendirilen yönlerinden biri hangisidir?','Zamanı düzenleme','İsrafı artırma','Başkalarını küçümseme','Belirli vakitler, zamanı planlama üzerinde düşünmeye yardımcı olur.'],
 ['İbadetin ahlakla ilişkisini hangi davranış örnekler?','Verdiği sözü tutmak','Sırayı bozmak','Arkadaşına hakaret etmek','Sözünde durmak sorumluluk ve güvenle ilişkilidir.'],
 ['Temizlik bilincinin ortak yaşama yansıması hangisidir?','Kullandığı yeri temiz bırakmak','Çöpünü yere atmak','Ortak araçları kirletmek','Temizlik yalnız kişisel değil ortak alanlarla da ilgilidir.'],
 ['Bir öğrenci ibadet ettiği için arkadaşını küçümsüyor. Konu açısından hangi değerlendirme uygundur?','Saygı ve alçak gönüllülükle bağdaşmaz.','Her zaman doğru bir davranıştır.','Sorumluluk örneğidir.','İbadet başkalarını değersizleştirme gerekçesi değildir.']
],gap:['Verilen işi ve sözü yerine getirme bilincine ne denir?','sorumluluk','Sorumluluk, üstlenilen görevlerin bilincinde olmaktır.'],statement:['İbadetle ilgili değerler, günlük yaşam davranışlarından bütünüyle bağımsız ele alınır.',false,'Din kültürü dersinde ibadetlerin ahlaki davranışlarla ilişkisi üzerinde de durulur.']});

add({ids:['topic-272fe72bc85ed968'],teaching:[
 'Tahiyyat duası, namazın oturuş bölümünde okunan dualardan biridir. Dua, kişinin Allah’a yönelişini ve niyazını anlatan bir kavramdır.',
 'Bu duanın anlam çalışmasında saygı, selam ve iyi dilek gibi ifadelerin üzerinde durulur. Anlamı öğrenmek, metnin doğru okunuşunu öğrenmeyle birlikte yürütülebilir.',
 'Okunuş ve ezber, güvenilir metin ve öğretmen rehberliği gerektirir. Bu uygulamadaki kısa testler sesli okumayı değerlendirmez ve dua metni yerine geçmez.'
],example:['Tahiyyat duasını öğrenmek için bir çalışma planı yap.','Önce güvenilir kaynaktan duanın anlamını incele.','Sonra öğretmen rehberliğinde okunuşu çalış.','Anlam ve okunuş birlikte, güvenilir rehberlikle çalışılır.'],checks:[
 ['Tahiyyat duası namazın hangi bölümünde okunur?','Oturuşta','Yalnız minarede','Yalnız yolculukta','Tahiyyat, namazın oturuş bölümünde okunan dualardandır.'],
 ['Dua kavramı hangi ifadeyle ilişkilidir?','Allah’a yöneliş ve niyaz','Bir yapı malzemesi','Bir bilgisayar dosyası','Dua kişinin Allah’a yönelişini ifade eder.'],
 ['Duanın okunuşunu çalışırken hangi kaynak seçilmelidir?','Öğretmen rehberliğinde güvenilir metin','Kaynağı belirsiz uydurma sözler','Konuyla ilgisiz bir reklam','Okunuşun doğru öğrenilmesi için güvenilir kaynak gerekir.'],
 ['Bir öğrenci testte doğru cevap verdi. Bu neyi tek başına göstermez?','Duanın telaffuzunu doğru yaptığını','Kavram sorusunu cevapladığını','Bilgi çalışmasına katıldığını','Yazılı test, sesli okuma ve telaffuzu tek başına ölçemez.']
],gap:['Tahiyyat duası namazın hangi bölümünde okunur? Tek sözcük yaz.','oturuşta','Tahiyyat duası namazın oturuşunda okunur.'],statement:['Tahiyyat duasının anlamı ile okunuşu üzerinde ayrı ayrı çalışılabilir.',true,'Anlamı kavramak ve doğru okumak birbirini destekleyen farklı çalışmalardır.']});

add({ids:['topic-a5877b73d603f0d3'],teaching:[
 'Kur’an-ı Kerim’in metin düzeninde ayet, sure ve cüz kavramları kullanılır. Ayetler sureleri oluşturur; Kur’an’da 114 sure bulunur.',
 'Cüz, okuma takibini kolaylaştıran otuz bölümden her biridir. Cüz ile sure aynı kavram değildir; bir cüz birden fazla surenin bölümlerini içerebilir.',
 'Bir metin yerini bulurken sure adı ve ayet numarası birlikte kullanılabilir. Bu düzen, kaynağı açıkça belirtmeye yardımcı olur.'
],example:['“Sure ve cüz aynı şeydir” ifadesini değerlendir.','Surenin ayetlerden oluşan metin bölümü olduğunu hatırla.','Cüzün otuz okuma bölümünden biri olduğunu karşılaştır.','Aynı değildir; Kur’an’da 114 sure ve 30 cüz vardır.'],checks:[
 ['Kur’an’da kaç sure vardır?','114','30','12','Kur’an’da 114 sure bulunur.'],
 ['Kur’an’ın otuz okuma bölümünden her birine ne denir?','Cüz','Minare','Rekat','Cüz, okuma takibi için kullanılan bölüm adıdır.'],
 ['Sureler hangi metin birimlerinden oluşur?','Ayetlerden','Rekatlardan','Minberlerden','Ayetler surelerin metin birimleridir.'],
 ['Bir öğrenci bir ayetin yerini açıkça göstermek istiyor. Hangi bilgi uygundur?','Sure adı ve ayet numarası','Kitap kapağının rengi','Sadece kendi tahmini','Sure ve ayet bilgisi metnin bulunmasını sağlar.']
],gap:['Kur’an’ın okuma takibi için ayrıldığı cüz sayısını rakamla yaz.','30','Kur’an 30 cüze ayrılmıştır.'],statement:['Sure ve cüz her zaman aynı metin bölümünü anlatır.',false,'Sure ile cüz farklı düzenleme kavramlarıdır.']});

add({ids:['topic-48ae9ea75ad2cc7a'],teaching:[
 'Kur’an-ı Kerim, İslam’ın kutsal kitabıdır. İslam inancında Allah tarafından vahiy yoluyla Hz. Muhammed’e bildirildiği kabul edilir.',
 'Vahiy, peygamberlere bildirilen ilahî mesajı anlatan dinî kavramdır. Kur’an’ın dili Arapçadır; meal, anlamının başka bir dile aktarılmasıdır.',
 'Meal ile açıklama çalışmalarının amacı anlamayı desteklemektir. Kaynak okurken çeviri, açıklama ve asıl metnin farklı işlevleri olduğunu ayırt ederiz.'
],example:['Bir öğrenci Türkçe bir meal ile Arapça asıl metni karşılaştırıyor.','Mealin anlamı Türkçe aktardığını fark et.','Asıl metnin dilinin Arapça olduğunu ayır.','Meal bir anlam aktarımıdır; asıl metinle aynı dilde değildir.'],checks:[
 ['Kur’an, hangi dinin kutsal kitabıdır?','İslam','Bir spor dalı','Bir sanat akımı','Kur’an İslam’ın kutsal kitabıdır.'],
 ['Vahiy kavramı neyi anlatır?','Peygamberlere bildirilen ilahî mesajı','Bir mimari kubbeyi','Bir müzik ölçüsünü','Vahiy dinî bir mesaj bildirimini anlatır.'],
 ['Kur’an’ın anlamının başka bir dile aktarımına ne denir?','Meal','Minber','Rekat','Meal, anlamın başka bir dile aktarılmasıdır.'],
 ['Türkçe anlam çalışması yapan öğrenci hangi bilgiyi ayırt etmelidir?','Çeviri ile asıl metnin farklı işlevleri olduğunu','Bütün açıklamaların aynı dilde yazıldığını','Kaynağın hiçbir önem taşımadığını','Kaynak türünü bilmek okuduğumuz metni doğru değerlendirmeyi sağlar.']
],gap:['Kur’an’ın asıl metninin dili nedir?','Arapça','Kur’an’ın asıl metni Arapçadır.'],statement:['Meal, Kur’an’ın anlamını başka bir dilde anlamaya yardımcı olur.',true,'Meal bir anlam aktarımıdır.']});

add({ids:['topic-da75097fff4f1974'],teaching:[
 'Kur’an’ın ana konuları arasında inanç, ibadet, ahlak ve insanlar arası ilişkiler bulunur. Peygamber kıssaları da öğüt ve düşünme amacıyla ele alınır.',
 'İnanç kişinin dinin temel esaslarıyla ilişkisini; ibadet dinî görevleri; ahlak ise iyi ve sorumlu davranışları öğrenme alanını anlatır. Bu başlıklar birbiriyle ilişkilidir.',
 'Bir örneği sınıflandırırken hangi yönünün vurgulandığına bakarız. Dürüst davranma örneği ahlakla; namaz örneği ibadetle doğrudan ilişkilidir.'
],example:['Namaz ve dürüstlüğü ana konu başlıklarına yerleştir.','Namazın bir ibadet olduğunu belirle.','Dürüstlüğün davranış niteliği olduğunu belirle.','Namaz: ibadet; dürüstlük: ahlak.'],checks:[
 ['Dürüstlük, ana konu başlıklarından hangisiyle doğrudan ilgilidir?','Ahlak','Yapı ölçüsü','Çalgı türü','Dürüstlük ahlaki bir değerdir.'],
 ['Namaz hangi başlığa örnektir?','İbadet','Coğrafi yön','Müzik türü','Namaz İslam’da bir ibadettir.'],
 ['Peygamberlerin hayatından aktarılan öğüt verici anlatılar nasıl adlandırılır?','Kıssa','Kroki','Tablo','Peygamber anlatıları din kültürü dersinde kıssa kavramıyla ele alınır.'],
 ['Aynı olayda hem yardımlaşma hem sorumluluk görülmesi neyi gösterir?','Konu başlıklarının ilişkili olabileceğini','Olayın incelenemeyeceğini','Ahlakın davranışla ilgisiz olduğunu','Değerler ve ana konular günlük yaşamda birlikte bulunabilir.']
],gap:['İyi ve sorumlu davranışlarla ilgili ana konu başlığını yaz.','ahlak','Ahlak, davranışların iyi ve sorumlu oluşuyla ilgilidir.'],statement:['Kur’an’ın ana konuları yalnız yapı ve süsleme biçimleridir.',false,'İnanç, ibadet, ahlak ve ilişkiler ana konulardandır.']});

add({ids:['topic-0fa66eb1117d8a9c'],teaching:[
 'Kevser suresi, Kur’an-ı Kerim’in 108. suresidir ve üç ayetten oluşur. Adı bolluk ve çok hayır anlamlarıyla ilişkilendirilir.',
 'Surenin anlam çalışmasında verilen nimetleri fark etmek ve şükür kavramı üzerinde durulur. Şükür, nimeti fark etme ve bunu sorumlu davranışla karşılama düşüncesiyle ele alınabilir.',
 'Okunuş ve ezber için güvenilir metin ile öğretmen rehberliği kullanılmalıdır. Bu kısa içerik sure metninin veya telaffuz dersinin yerine geçmez.'
],example:['Bir öğrenci Kevser suresini çalıştıktan sonra nimetleri israf etmemek üzerine düşünüyor.','Nimetin farkına varmayı şükürle ilişkilendir.','Kaynağı korumanın günlük yaşam davranışı olduğunu belirt.','Şükür düşüncesi, nimetleri bilinçli kullanmayla ilişkilendirilebilir.'],checks:[
 ['Kevser suresi kaç ayettir?','3','30','114','Kevser suresi üç ayetten oluşur.'],
 ['Kevser suresinin Kur’an’daki sıra numarası hangisidir?','108','112','1','Kevser suresi 108. suredir.'],
 ['Nimetin farkına varıp teşekkür bilinciyle yaklaşmak hangi kavramla ilgilidir?','Şükür','İsraf','Kibir','Şükür, nimetin farkına varma düşüncesiyle ilişkilidir.'],
 ['Nimetleri sorumlu kullanmaya hangi davranış örnektir?','Yiyeceği ihtiyacı kadar almak','Yiyeceği bilerek çöpe atmak','Su musluğunu açık bırakmak','İhtiyaç kadar kullanmak israfı azaltır.']
],gap:['Kevser suresinin ayet sayısını rakamla yaz.','3','Kevser suresi üç ayettir.'],statement:['Bu testte doğru cevap vermek, surenin sesli okunuşunun değerlendirildiği anlamına gelir.',false,'Sesli okunuş için dinleme ve rehberlik gerekir; bu test temel bilgiyi ölçer.']});

add({ids:['topic-7f9bea4dd091c0d1'],teaching:[
 'İslam inancında peygamberler, Allah’ın mesajlarını insanlara bildirmekle görevlendirilen kişilerdir. Bu görev peygamberlik olarak adlandırılır.',
 'Peygamberlerle ilgili anlatımlarda doğruluk ve güvenilirlik gibi örnek özellikler üzerinde durulur. Mesajı insanlara bildirme görevine tebliğ denir.',
 'Kavramları öğrenirken peygamberliği bir meslek veya mimari yapı adıyla karıştırmamak gerekir. Sınıf çalışmasında kişisel inanç değil, kavram bilgisi değerlendirilir.'
],example:['Bir metinde “mesajı insanlara bildirme” görevi anlatılıyor. Hangi kavram aranır?','Görevin iletmeyle ilgili olduğunu fark et.','Bu görev için kullanılan dinî kavramı hatırla.','Tebliğ.'],checks:[
 ['İslam inancında ilahî mesajı insanlara bildirmekle görevlendirilen kişiye ne denir?','Peygamber','Mimar','Seyirci','Peygamberlik ilahî mesajı bildirme göreviyle ilgilidir.'],
 ['Mesajı insanlara bildirme görevi hangi kavramla anlatılır?','Tebliğ','Minare','Rekat','Tebliğ, mesajı bildirme görevidir.'],
 ['Peygamberlerin örnek özellikleri arasında hangisi ele alınır?','Doğruluk','Hile','Güveni kötüye kullanma','Doğruluk ve güvenilirlik örnek özelliklerdendir.'],
 ['Bir öğrenci “tebliğ” ile “mihrap”ı karıştırıyor. Hangi ayrım doğrudur?','Tebliğ bildirme görevi, mihrap yapı bölümüdür.','İkisi de spor terimidir.','İkisi de aynı sure adıdır.','Kavramların ait oldukları alanları ayırmak anlamayı kolaylaştırır.']
],gap:['Peygamberlerin mesajı insanlara bildirme görevini anlatan kavramı yaz.','tebliğ','Tebliğ, mesajı bildirmektir.'],statement:['Din kültürü sorusu bir öğrencinin kişisel inancının değerini ölçer.',false,'Sorular kavram ve içerik bilgisini ölçer; kişisel inancı değerlendirmez.']});

add({ids:['topic-3622c03ebcd89760'],teaching:[
 'Kıssa, Kur’an’da geçmiş olaylar ve peygamberlerle ilgili aktarılan, üzerinde düşünülüp öğüt çıkarılan anlatıdır.',
 'Bir kıssayı okurken olay, davranış ve çıkarılan öğüdü ayrı belirleriz. Sabır, doğruluk ve adalet gibi değerler anlatının hangi davranışları öne çıkardığına bakılarak konuşulur.',
 'Kıssayı anlatırken kaynakta olmayan konuşma ve ayrıntıları kesin olmuş gibi eklememek gerekir. Öğüt çıkarmak ile kaynağa yeni bilgi eklemek aynı şey değildir.'
],example:['Kaynakta dürüst davranan bir kişi anlatılıyor, fakat yaşı belirtilmiyor. Nasıl özetlenir?','Dürüstlük davranışını öne çıkar.','Yaş bilgisi verilmediği için yaş uydurma.','Dürüstlük öğüdünü aktar; kaynakta bulunmayan yaşı ekleme.'],checks:[
 ['Kıssa çalışmasının amaçlarından biri hangisidir?','Anlatıdan öğüt çıkarmak','Kaynağa rastgele ayrıntı eklemek','Bütün olayları yarışmaya çevirmek','Kıssalar üzerinde düşünülerek öğüt çıkarılır.'],
 ['Kıssayı incelerken hangi ayrım yararlıdır?','Olay, davranış ve öğüt','Kapak rengi ve sayfa kokusu','Yalnız metin uzunluğu','Bu ayrım anlatıyı ve çıkarımı ayırır.'],
 ['Kaynakta belirtilmeyen bir ayrıntı için hangi tutum doğrudur?','Bilinmediğini söylemek','Kesin olmuş gibi eklemek','Rastgele sayı vermek','Doğru aktarım, kaynakta olmayan bilgiyi uydurmamayı gerektirir.'],
 ['Bir anlatıda zorluk karşısında sorumlu biçimde çaba sürdürülüyor. Hangi değer üzerinde düşünülebilir?','Sabır','İsraf','Kibir','Sabır, zorlukta sorumlu çabayı sürdürmeyle ilişkilendirilebilir.']
],gap:['Peygamberlerle ilgili, öğüt çıkarılan anlatıyı belirten kavramı yaz.','kıssa','Kıssa, üzerinde düşünülen öğüt verici anlatıdır.'],statement:['Kıssa özeti yazarken kaynakta olmayan ayrıntılar kesin bilgi gibi eklenebilir.',false,'Kaynağa bağlı kalmak doğru bilgi aktarımının gereğidir.']});

add({ids:['topic-c583d534aa16e2e0'],teaching:[
 'Kureyş suresi, Kur’an-ı Kerim’in 106. suresidir ve dört ayetten oluşur. Anlam çalışmasında güvenlik, geçim ve şükür konuları üzerinde durulur.',
 'İnsanların güven içinde yaşaması ve temel ihtiyaçlarını karşılayabilmesi toplumsal yaşam açısından önemlidir. Metnin dinî bağlamını öğrenirken bu kavramlar ayırt edilir.',
 'Surenin okunuşu güvenilir metin ve öğretmen rehberliğiyle çalışılmalıdır. Buradaki bilgiler sure metni veya sesli okuma değerlendirmesi değildir.'
],example:['Güvenlik ile geçim kavramlarını ayır.','Güvenliği tehlikelerden korunmayla ilişkilendir.','Geçimi temel ihtiyaçları karşılayabilmeyle ilişkilendir.','Güvenlik korunma; geçim ihtiyaçları karşılamayla ilgilidir.'],checks:[
 ['Kureyş suresi kaç ayettir?','4','40','30','Kureyş suresi dört ayettir.'],
 ['Kureyş suresinin sıra numarası hangisidir?','106','108','112','Kureyş suresi Kur’an’ın 106. suresidir.'],
 ['Geçim kavramı hangi durumla ilişkilidir?','Temel ihtiyaçları karşılayabilmek','Bir çalgının sesini yükseltmek','Bir resmin boyutunu değiştirmek','Geçim insanların temel ihtiyaçlarını karşılamasıyla ilgilidir.'],
 ['Güvenlik ve geçim hakkında düşünmek hangi yaklaşımı destekler?','İnsanların ihtiyaçlarına duyarlı olmayı','İhtiyaçları küçümsemeyi','Yardımı gereksiz saymayı','Toplumsal ihtiyaçların farkına varmak duyarlılığı geliştirir.']
],gap:['Kureyş suresinin ayet sayısını rakamla yaz.','4','Kureyş suresi dört ayettir.'],statement:['Kureyş suresinin anlam çalışmasında güvenlik ve geçim kavramları ele alınabilir.',true,'Bu kavramlar surenin anlam çalışmasında öne çıkar.']});

add({ids:['topic-da8fab78eb6cfdd7'],teaching:[
 'İbadet ve toplumsal ihtiyaçlar, farklı yapı türlerinin ortaya çıkmasına katkıda bulunmuştur. Cami, mescit ve külliye din kültürü ile mimari ilişkisini incelemek için örneklerdir.',
 'Külliye, bir cami çevresinde eğitim, yardım veya başka hizmetler sunan yapıların birlikte düzenlendiği bütündür. Her caminin mutlaka bir külliyenin parçası olması gerekmez.',
 'Mimariyi incelerken yapının amacı, kullanılan malzeme ve çevreyle ilişkisine bakılır. Tarihî yapılara zarar vermemek kültürel mirası koruma sorumluluğudur.'
],example:['Bir caminin çevresinde eğitim ve yardım yapıları birlikte düzenlenmiş. Bu bütüne hangi ad verilebilir?','Tek yapıyı değil yapı topluluğunu incele.','Farklı hizmetleri aynı düzende birleştiren kavramı seç.','Külliye.'],checks:[
 ['Cami çevresindeki farklı hizmet yapılarının birlikte oluşturduğu bütüne ne denir?','Külliye','Rekat','Ayet','Külliye farklı işlevli yapıların bir arada düzenlenmesidir.'],
 ['Bir tarihî yapıyı incelerken hangi bilgi önemlidir?','Yapının kullanım amacı','Yalnız ziyaretçinin ayakkabı rengi','Rastgele bir söylenti','İşlevi bilmek yapının düzenini anlamaya yardımcı olur.'],
 ['Kültürel mirası koruyan davranış hangisidir?','Yapının yüzeylerine zarar vermemek','Duvarına adını kazımak','Tarihî parçaları koparmak','Tarihî yapılar ortak mirastır ve korunmalıdır.'],
 ['İki caminin farklı malzemelerle yapılması nasıl incelenebilir?','Dönem ve çevre koşullarını araştırarak','Birini değersiz ilan ederek','İkisini aynı yapı sayarak','Malzeme ve çevre yapılar arasında farklılık oluşturabilir.']
],gap:['Cami çevresinde farklı hizmet yapılarını birleştiren bütünü tek sözcükle yaz.','külliye','Külliye, birlikte düzenlenen yapı topluluğudur.'],statement:['Her cami mutlaka bir külliyenin parçasıdır.',false,'Bir cami tek başına da bulunabilir.']});

add({ids:['topic-5105bfdf531d9eae'],teaching:[
 'Camilerin bölümleri farklı işlevlere sahiptir. Mihrap kıble yönünü belirtir; minber hutbe için kullanılan yükseltilmiş bölümdür.',
 'Minare, ezanla ilişkili mimari öğedir. Kubbe ise yapının üstünü örten biçimlerden biridir; bütün camilerin biçimi ve büyüklüğü aynı değildir.',
 'Bir camiyi gezerken kullanım kurallarına uymak, sessiz ve saygılı davranmak gerekir. Yapının işlevini öğrenmek, başkalarının alanına saygıyı da içerir.'
],example:['Bir çizimde kıbleyi belirten bölüm ile hutbe için kullanılan bölüm gösteriliyor.','Kıble yönünü belirten bölümü mihrapla eşleştir.','Hutbe için kullanılan yükseltilmiş bölümü minberle eşleştir.','Mihrap: kıble yönü; minber: hutbe bölümü.'],checks:[
 ['Camide kıble yönünü belirten bölüm hangisidir?','Mihrap','Minber','Avlu','Mihrap kıble yönünü belirtir.'],
 ['Hutbe için kullanılan yükseltilmiş bölüme ne denir?','Minber','Mihrap','Şadırvan','Minber hutbe için kullanılan bölümdür.'],
 ['Minare hangi işlevle ilişkilidir?','Ezan','Dosya saklama','Oyun puanı','Minare ezanla ilişkili bir mimari öğedir.'],
 ['Bir yapıyı gezerken diğer insanlara saygı için ne yapılır?','Ziyaret kurallarına uyulur.','Yüksek sesle herkes rahatsız edilir.','İzin verilmeyen bölümlere girilir.','Kullanım ve ziyaret kuralları başkalarının alanını korur.']
],gap:['Camide kıble yönünü belirten bölümün adını yaz.','mihrap','Mihrap, kıbleyi belirten bölümdür.'],statement:['Bütün camilerin mimari biçimi ve büyüklüğü aynıdır.',false,'Dönem, çevre ve ihtiyaçlar mimaride çeşitlilik oluşturur.']});

add({ids:['topic-99c427c183d55b1d'],teaching:[
 'Türkiye’deki camiler farklı dönemlerin mimari özelliklerini taşır. Süleymaniye Camii İstanbul’da, Selimiye Camii Edirne’dedir; ikisi de Mimar Sinan’ın eserlerindendir.',
 'Bir yapıyı tanıtırken adı, bulunduğu şehir ve doğrulanmış mimari bilgileri ayrı kaydederiz. Yalnız fotoğrafa bakarak yapının tarihini veya mimarını kesinleştirmeyiz.',
 'Yapıları karşılaştırmak birini küçümsemek için değil, ortak mirasın çeşitliliğini anlamak içindir. Ziyaret veya araştırmada kaynak belirtmek önemlidir.'
],example:['Süleymaniye ile Selimiye’nin şehirlerini karşılaştır.','Süleymaniye’yi İstanbul ile eşleştir.','Selimiye’yi Edirne ile eşleştir.','Süleymaniye İstanbul’da, Selimiye Edirne’dedir.'],checks:[
 ['Selimiye Camii hangi şehirdedir?','Edirne','İzmir','Antalya','Selimiye Camii Edirne’dedir.'],
 ['Süleymaniye Camii hangi şehirdedir?','İstanbul','Edirne','Van','Süleymaniye Camii İstanbul’dadır.'],
 ['Selimiye ve Süleymaniye’nin mimarı kimdir?','Mimar Sinan','Mehmet Âkif Ersoy','Osman Zeki Üngör','Her iki yapı da Mimar Sinan’ın eserlerindendir.'],
 ['Bir yapının mimarını bilmeyen öğrenci ne yapmalıdır?','Güvenilir kaynaktan araştırmalıdır.','Fotoğrafa bakıp isim uydurmalıdır.','Arkadaşının tahminini kesinleştirmelidir.','Tarihî bilgi kaynakla doğrulanmalıdır.']
],gap:['Selimiye Camii’nin bulunduğu şehrin adını yaz.','Edirne','Selimiye Camii Edirne’dedir.'],statement:['Yalnız fotoğrafa bakarak bir yapının mimarı her zaman kesin belirlenebilir.',false,'Mimar ve tarih gibi bilgiler güvenilir kaynakla doğrulanmalıdır.']});

// Bilişim: practical knowledge is tied to concrete tasks and privacy-respecting
// habits; no pupil needs an account, online service or paid AI tool.
add({ids:['topic-b1fb080855a13b72'],teaching:[
 'Bilişim teknolojileri, bilgiyi toplamak, işlemek, saklamak ve iletmek için kullanılan araç ve yöntemlerdir. Bilgisayar, tablet ve iletişim ağları örnektir.',
 'Donanım cihazın dokunulabilen parçalarıdır; yazılım bu parçaların ne yapacağını belirleyen programlardır. Klavye donanım, metin düzenleyici yazılımdır.',
 'Bir aracı sınıflandırırken markasına değil işlevine bakarız. Bilgi girişi, işleme ve çıktı farklı görevlerdir.'
],example:['Klavye ile metin düzenleyiciyi sınıflandır.','Klavyenin fiziksel parça olduğunu belirle.','Metin düzenleyicinin program olduğunu belirle.','Klavye donanım; metin düzenleyici yazılım.'],checks:[
 ['Hangisi donanımdır?','Klavye','Metin düzenleme programı','İşletim sistemi','Klavye fiziksel bir bilgisayar parçasıdır.'],
 ['Hangisi yazılımdır?','Çizim programı','Fare','Monitör','Çizim programı bilgisayarda çalışan bir yazılımdır.'],
 ['Klavye hangi görevi yapar?','Bilgi girişi','Kâğıda çıktı verme','Elektrik depolama','Klavye bilgisayara metin ve komut girmek için kullanılır.'],
 ['Bir cihazın markası değiştiğinde donanım tanımı da değişir mi?','Hayır, fiziksel parça olma özelliğine bakılır.','Evet, pahalıysa yazılım olur.','Evet, küçükse program olur.','Sınıflandırma marka ve fiyata değil kavrama dayanır.']
],gap:['Bilgisayarın fiziksel parçalarına verilen genel adı yaz.','donanım','Dokunulabilen fiziksel parçalar donanımdır.'],statement:['Bir çizim programı bilgisayarın donanımıdır.',false,'Program yazılımdır; fiziksel parçalar donanımdır.']});

add({ids:['topic-5cb0afefe76db11a'],teaching:[
 'Dijital araçlar öğrenme ve iletişimi kolaylaştırabilir; uzun ve düzensiz kullanım ise hareket, uyku ve dikkat düzenini etkileyebilir.',
 'Ekran kullanırken uygun oturuş, yeterli aydınlatma ve düzenli mola önemlidir. Molada ekranı başka bir ekranla değiştirmek yerine gözleri dinlendirmek ve hafifçe hareket etmek yararlıdır.',
 'Süre planı aile ve öğretmenle birlikte yapılır. Rahatsızlık hissedildiğinde kullanıma ara verilir ve bir yetişkine haber verilir.'
],example:['Ödev sırasında gözleri yorulan öğrenci ne yapabilir?','Ekrana bakmaya kısa ara verir.','Gözlerini dinlendirir ve çalışma düzenini bir yetişkinle gözden geçirir.','Mola verir; rahatsızlık sürerse bir yetişkine haber verir.'],checks:[
 ['Ekran molasında hangi etkinlik uygundur?','Ekrandan uzaklaşıp dinlenmek','Başka ekranda oyun açmak','Ekrana daha yakından bakmak','Gerçek mola, ekrana bakma yükünü azaltır.'],
 ['Dijital sağlık için hangi çalışma koşulu uygundur?','Uygun aydınlatma ve rahat oturuş','Karanlıkta ekrana çok yaklaşmak','Uzun süre hareketsiz kalmak','Çalışma ortamı ve duruş fiziksel rahatlığı etkiler.'],
 ['Ekran süresi planlanırken kiminle iş birliği yapılabilir?','Aile ve öğretmenle','Yalnız reklamlarla','Yalnız oyun puanıyla','Yetişkinlerle plan yapmak dengeli kullanım sağlar.'],
 ['Ödevde dijital araç kullanmak yararlıysa mola gereksiz midir?','Hayır, yararlı kullanımda da dinlenme gerekir.','Evet, ödevde hiç yorulunmaz.','Evet, ekran her zaman zararsızdır.','Araç yararlı olsa da insanın dinlenme ihtiyacı devam eder.']
],gap:['Ekran kullanımına dinlenmek için verilen araya ne denir?','mola','Mola, gözleri ve bedeni dinlendirmek için verilen aradır.'],statement:['Ekran molasında başka bir ekrana geçmek her zaman yeterli dinlenme sağlar.',false,'Gözleri dinlendirmek için ekrandan uzaklaşmak gerekir.']});

add({ids:['topic-717d8dedd327adc4'],teaching:[
 'Dijital vatandaşlık, çevrim içi ortamlarda hakları, sorumlulukları ve başkalarının güvenliğini gözetmektir. Saygılı iletişim dijital ortamda da geçerlidir.',
 'Birinin fotoğrafını veya kişisel bilgisini paylaşmadan önce izin gerekir. Alay etme, dışlama ve ısrarlı rahatsız etme dijital ortamda da zarar verir.',
 'Rahatsız edici bir ileti alındığında tartışmayı büyütmeden güvenilen yetişkine bildirilir. Başkasının hatalı davranışı, aynı davranışla karşılık vermeyi gerektirmez.'
],example:['Bir arkadaşının fotoğrafını sınıf grubuna göndermek istiyorsun.','Fotoğrafın başka birine ait olduğunu fark et.','Paylaşım için izin alınması gerektiğini belirle.','İzin almadan paylaşma.'],checks:[
 ['Arkadaşının fotoğrafını paylaşmadan önce ne yapılmalıdır?','İzin alınmalıdır.','Adı silinmeden herkesle paylaşılmalıdır.','Çok beğeni alacaksa izin atlanmalıdır.','Fotoğraf kişinin kişisel alanıyla ilgilidir.'],
 ['Saygılı dijital iletişim örneği hangisidir?','Farklı görüşe hakaret etmeden cevap vermek','Alaycı mesajlarla kişiyi dışlamak','Sürekli rahatsız edici ileti göndermek','Dijital ortamda da insanlar saygıyı hak eder.'],
 ['Rahatsız edici bir ileti alan öğrenci ne yapabilir?','Güvenilen yetişkine haber verebilir.','Aynı kişiye hakaret edebilir.','Kişisel bilgilerini gönderebilir.','Yetişkin desteği güvenli çözümü kolaylaştırır.'],
 ['“İnternette yazdıklarım kimseyi etkilemez.” düşüncesi neden yanlıştır?','Dijital söz ve paylaşımlar gerçek insanları etkiler.','Bütün iletiler anında unutulur.','Ekranda sorumluluk yoktur.','İletişimin aracı değişse de etkisi ve sorumluluğu sürer.']
],gap:['Başkasının fotoğrafını paylaşmadan önce alınması gereken şeyi yaz.','izin','Paylaşımda kişinin izni gözetilmelidir.'],statement:['Dijital ortamda başkalarının kişisel alanına saygı göstermek gerekir.',true,'Hak ve sorumluluklar dijital ortamda da önemlidir.']});

add({ids:['topic-6eb1d7db45a446b1'],teaching:[
 'Yapay zekâ, verilerdeki örüntülerden yararlanarak sınıflandırma, tahmin veya içerik üretme gibi görevler yapan bilgisayar sistemleri için kullanılan bir kavramdır.',
 'Bir görüntü tanıma sistemi örneklerden öğrenebilir; ancak insan gibi her şeyi anlamaz ve hata yapabilir. Verinin niteliği sonucu etkiler.',
 'Yapay zekâ çıktısı doğru bilgi garantisi değildir. Önemli bir bilgi güvenilir kaynakla kontrol edilir; kişisel veriler rastgele sistemlere gönderilmez.'
],example:['Bir sistem kedi fotoğrafını köpek diye sınıflandırıyor. Bu nasıl değerlendirilir?','Sistemin örüntülere göre tahmin yaptığını hatırla.','Tahminin hatalı olabileceğini kabul edip sonucu kontrol et.','Yapay zekâ hata yapabilir; çıktı doğrulanmalıdır.'],checks:[
 ['Yapay zekâ hangi görevde kullanılabilir?','Görüntüleri sınıflandırmada','Her bilgiyi kesin doğru bilmede','İnsanın bütün sorumluluğunu kaldırmada','Görüntü sınıflandırma yapay zekâ kullanım örneğidir.'],
 ['Yapay zekâ çıktısı için hangi bilgi doğrudur?','Hata içerebilir.','Her zaman kesin doğrudur.','Kaynağa hiç gerek bırakmaz.','Yapay zekâ sistemlerinin çıktıları doğrulanmalıdır.'],
 ['Bir sistemin öğrendiği örneklerin niteliği neyi etkiler?','Ürettiği sonuçları','Ekranın fiziksel ağırlığını','Elektrik kablosunun rengini','Eksik veya yanlı örnekler sonuçları etkileyebilir.'],
 ['Bir öğrenci yapay zekâdan aldığı tarihi ödevine yazacak. Önce ne yapmalıdır?','Güvenilir kaynakla doğrulamalıdır.','Sadece akıcı yazıldığı için doğru saymalıdır.','Kaynağı bilinmediği için isim uydurmalıdır.','Akıcı ifade doğruluk kanıtı değildir.']
],gap:['Bir sistemin geleceğe veya sınıfa ilişkin öngörüsüne verilen sözcüğü yaz: sınıflandırma veya ...','tahmin','Yapay zekâ sistemleri verilerden tahmin üretebilir.'],statement:['Yapay zekâ, her zaman hatasız cevap verir.',false,'Yapay zekâ çıktılarında yanlışlık olabilir.']});

add({ids:['topic-e4c7f9c1018cdc8e'],teaching:[
 'Bilgisayar sistemi donanım ve yazılımın birlikte çalışmasıyla görev yapar. İşletim sistemi, dosyaları ve programların çalışmasını yönetmeye yardımcı olur.',
 'Bir programı açmak, dosya oluşturmak ve dosyayı kaydetmek farklı işlemlerdir. Dosyayı yalnız açık tutmak, her zaman kaydedildiği anlamına gelmez.',
 'İşi bitirirken çalışmayı kaydetmek ve cihazı uygun yöntemle kapatmak veri kaybını önlemeye yardımcı olur. Bilinmeyen ayarlar yetişkin rehberliği olmadan değiştirilmez.'
],example:['Bir öğrenci yazısını tamamladı, bilgisayarı kapatacak. Hangi sırayı izler?','Dosyaya açıklayıcı ad vererek kaydeder.','Programı kapatıp cihazın uygun kapatma komutunu kullanır.','Önce kaydet, sonra uygun biçimde kapat.'],checks:[
 ['Programların ve dosyaların yönetilmesine hangi yazılım yardım eder?','İşletim sistemi','Klavye tuşu','Monitör ayağı','İşletim sistemi bilgisayarın temel işleyişini yönetir.'],
 ['Çalışmayı kaydetmek neden önemlidir?','Sonradan yeniden açabilmek için','Ekranı büyütmek için','Klavyeyi değiştirmek için','Kaydetme, çalışmanın dosya olarak korunmasını sağlar.'],
 ['Cihazı kapatmadan önce ne yapılmalıdır?','Açık çalışmalar kaydedilmelidir.','Bütün kablolar rastgele çekilmelidir.','Dosyalar gereksiz yere silinmelidir.','Kaydetme, veri kaybı olasılığını azaltır.'],
 ['Dosya ekranda açık görünüyor. Bu neyi tek başına kanıtlamaz?','Son değişikliklerin kaydedildiğini','Programın açık olduğunu','Çalışmanın görüntülendiğini','Açık görünmek ile diske kaydedilmek farklıdır.']
],gap:['Bilgisayarda sonradan açabilmek için çalışmayı hangi işlemle koruruz?','kaydetme','Kaydetme çalışmayı dosyada saklar.'],statement:['Dosyanın açık olması, son değişikliklerinin mutlaka kaydedildiğini gösterir.',false,'Bazı programlarda kaydetme işlemi ayrıca yapılmalıdır.']});

add({ids:['topic-393a4f81f417256f'],teaching:[
 'Dosya, bilgisayarda saklanan bir bilgi birimidir. Klasör ise ilgili dosyaları düzenlemeye yardımcı olan bir kapsayıcıdır.',
 'Açıklayıcı adlar ve düzenli klasörler dosyayı bulmayı kolaylaştırır. “Fen_Atiklar” gibi adlar, “Yeni1” gibi belirsiz adlardan daha açıklayıcı olabilir.',
 'Kopyalama aslı koruyarak ikinci örnek oluşturur; taşıma dosyanın yerini değiştirir. Silmeden önce dosyanın gerekli olup olmadığı kontrol edilir.'
],example:['Matematik ve fen dosyaları karıştı. Nasıl düzenlenebilir?','Ders adlarına göre ayrı klasörler oluştur.','İlgili dosyaları doğru klasöre taşı ve açıklayıcı ad kullan.','Derslere göre klasörleyip dosya adlarını anlaşılır yap.'],checks:[
 ['İlgili dosyaları düzenleyen kapsayıcı hangisidir?','Klasör','İmleç','Piksel','Klasör, dosyaları bir arada düzenlemeyi sağlar.'],
 ['Hangi dosya adı içeriği daha açık anlatır?','Fen_GeriDonusum','Yeni1','DosyaSonSon','Açıklayıcı ad aranan içeriği bulmayı kolaylaştırır.'],
 ['Kopyalama ile taşımanın farkı nedir?','Kopyalama ikinci örnek oluşturur, taşıma yeri değiştirir.','İkisi de her zaman siler.','Kopyalama yalnız ekranı büyütür.','Kopyalama ve taşıma farklı dosya işlemleridir.'],
 ['Bir dosyanın iki klasörde de bulunması isteniyor. Hangi işlem uygundur?','Kopyalama','Yalnız silme','Yalnız yeniden adlandırma','Kopyalama ilk dosyayı koruyarak ikinci örnek oluşturur.']
],gap:['Dosyaları bir arada düzenlemek için kullanılan kapsayıcının adını yaz.','klasör','Klasör ilgili dosyaları düzenler.'],statement:['Bir dosyayı silmeden önce gerekip gerekmediğini kontrol etmek yararlıdır.',true,'Dikkatli kontrol, gereksiz veri kaybını önler.']});

add({ids:['topic-b104eb59c9b263f7'],teaching:[
 'Görsel düzenleme programları çizim, kırpma, boyutlandırma ve renk değişikliği gibi işlemler yapar. Her araç farklı bir amaç taşır.',
 'Kırpma, resmin dışta kalan bölümlerini çıkarır; boyutlandırma resmin ölçülerini değiştirir. Oran korunmadan boyutlandırılan resim biçimce bozulabilir.',
 'Asıl dosyanın kopyası üzerinde çalışmak değişiklikleri geri almayı kolaylaştırır. Başkalarına ait görsellerin kullanım izni gözetilir.'
],example:['Bir fotoğrafın kenarında gereksiz boşluk var. Hangi araç seçilir?','Ölçü değiştirmek yerine kenardaki bölümü kaldırma amacı olduğunu belirle.','Kırpma aracını kullanıp asıl dosyanın kopyasını sakla.','Kırpma uygundur.'],checks:[
 ['Resmin kenarındaki gereksiz kısmı çıkarmak hangi işlemdir?','Kırpma','Ses yükseltme','Dosya taşıma','Kırpma dışta kalan bölümleri kaldırır.'],
 ['Resmin genişlik ve yüksekliğini değiştirmek hangi işlemdir?','Boyutlandırma','Klasörleme','E-posta gönderme','Boyutlandırma görselin ölçülerini değiştirir.'],
 ['Resmin oranı korunmazsa ne olabilir?','Biçim bozulabilir.','Kaynak otomatik doğrulanır.','Resim kendiliğinden ses olur.','Oransız değişiklik nesneleri basık veya uzamış gösterebilir.'],
 ['Özgün fotoğrafı korumak isteyen öğrenci nasıl çalışır?','Bir kopya üzerinde düzenleme yapar.','Özgün dosyayı hemen siler.','İzinsiz görselleri kendinin sayar.','Kopya üzerinde çalışmak özgün dosyayı korur.']
],gap:['Resmin kenarındaki gereksiz bölümü çıkarma işlemine ne denir?','kırpma','Kırpma dış bölümleri kaldırır.'],statement:['Kırpma ile boyutlandırma aynı işlemdir.',false,'Kırpma bölümü çıkarır; boyutlandırma ölçüyü değiştirir.']});

add({ids:['topic-8d69a2b6d525a266'],teaching:[
 'Bir görsel tasarıma başlamadan önce amaç, hedef kitle ve iletilecek mesaj belirlenir. Afişin kime seslendiği tasarım kararlarını etkiler.',
 'Taslak, bitmiş ürün değildir; yerleşimi ve mesajı denemek için yapılır. Başlık, görsel ve kısa açıklama arasındaki ilişki planlanır.',
 'Görsel ve yazı aynı amacı desteklemelidir. Çok sayıda ilgisiz öğe eklemek, ana mesajı görünmez hâle getirebilir.'
],example:['Okulda su tasarrufu afişi hazırlanacak. İlk plan ne olabilir?','Hedef kitlenin okul öğrencileri olduğunu belirle.','Kısa başlık ve suyu koruyan bir görsel için taslak çiz.','Amaç ve hedef kitleye uygun kısa bir taslak hazırlanır.'],checks:[
 ['Görsel tasarıma başlarken önce ne belirlenir?','Amaç ve hedef kitle','Yalnız dosya boyutu','Yalnız rastgele renk','Amaç ve hedef kitle tasarım kararlarına yön verir.'],
 ['Taslak ne için kullanılır?','Yerleşim ve mesajı denemek için','Bütün kaynakları silmek için','Dosyayı şifrelemek için','Taslak fikirleri geliştirmeye yarar.'],
 ['Bir su tasarrufu afişinde hangi görsel daha uygundur?','Kapanmış musluk','İlgisiz bir yarış arabası','Yalnız rastgele şekiller','Görsel ana mesajı desteklemelidir.'],
 ['Afişte başlık okunamıyorsa ilk hangi karar gözden geçirilebilir?','Yazı ile zemin arasındaki görünürlük','Kâğıdın sahibinin doğum günü','Bilgisayarın marka adı','Okunabilirlik mesajın anlaşılmasını etkiler.']
],gap:['Bitmiş üründen önce yerleşimi denemek için hazırlanan ilk çizime ne denir?','taslak','Taslak tasarımın deneme planıdır.'],statement:['Tasarımdaki bütün öğelerin ana mesajla ilgisiz olması anlaşılmayı kolaylaştırır.',false,'Öğelerin mesajı desteklemesi gerekir.']});

add({ids:['topic-5671d41092c44175'],teaching:[
 'Görsel ürün geliştirme, planı uygulama ve sonucu değerlendirme sürecidir. Amaç, yalnız çok araç kullanmak değil, anlaşılır bir ürün oluşturmaktır.',
 'Yazıların okunabilirliği, görsellerin görünürlüğü ve kaynak izinleri kontrol edilir. Ürün farklı ekran veya çıktı boyutunda incelenebilir.',
 'Geri bildirim, ürünün anlaşılmayan yönlerini fark etmeyi sağlar. Eleştiri kişiye değil ürüne yöneltilir; düzenleme yapıldıktan sonra dosya kaydedilir.'
],example:['Afişi gören arkadaşın küçük yazıları okuyamıyor. Ne yapılabilir?','Geri bildirimin okunabilirlikle ilgili olduğunu belirle.','Yazıyı büyütüp ürünü yeniden kontrol et.','Okunabilirliği artırıp yeni sürümü kaydet.'],checks:[
 ['Görsel ürün kontrolünde hangisine bakılır?','Yazının okunabilirliğine','Yalnız programın fiyatına','Yalnız dosyanın sahibine','Okunabilirlik ürünün amacına ulaşmasını etkiler.'],
 ['Yapıcı geri bildirim hangisidir?','“Başlık daha büyük olursa okunabilir.”','“Sen hiçbir şey yapamazsın.”','“Bütün emeğin değersiz.”','Yapıcı geri bildirim üründe geliştirilebilecek noktayı belirtir.'],
 ['Düzenleme sonrasında hangi işlem gerekir?','Dosyayı kaydetmek','Dosyayı rastgele silmek','Bütün izinleri unutmak','Kaydetme son değişiklikleri korur.'],
 ['Bir afiş ekranda iyi, çıktıda okunaksız görünüyor. Ne yapılmalıdır?','Kullanılacağı boyutta yeniden değerlendirilmelidir.','Ekrandaki görünüm tek ölçüt sayılmalıdır.','Sorun her zaman izleyicide aranmalıdır.','Ürün kullanım ortamına göre denetlenmelidir.']
],gap:['Ürünü geliştirmek amacıyla alınan değerlendirmeye ne denir?','geri bildirim','Geri bildirim geliştirme sürecine katkı sağlar.'],statement:['Geri bildirim, kişiyi küçük düşürmek için kullanılmalıdır.',false,'Geri bildirim ürünü geliştirmeye yönelmelidir.']});

add({ids:['topic-32410e04615afcec'],teaching:[
 'Kelime işlemci, metin yazmak ve düzenlemek için kullanılan yazılımdır. Yazı tipi, boyut, paragraf ve sayfa düzeni araçları içerir.',
 'Başlık ile gövde metnini görsel olarak ayırmak okumayı kolaylaştırır. Gereksiz biçim çeşitliliği yerine tutarlı bir düzen seçilir.',
 'Yazım denetimi yardımcı olabilir ancak her hatayı bulmaz. Anlamı ve noktalama işaretlerini öğrencinin yeniden okuması gerekir.'
],example:['Bir metnin başlığı paragraflarla karışıyor. Nasıl düzenlenebilir?','Başlığı ayrı satıra al.','Başlık biçimini tutarlı kullanıp gövde metnini sade bırak.','Başlık ve gövde metni ayırt edilir.'],checks:[
 ['Kelime işlemci hangi iş için uygundur?','Metin yazıp düzenlemek','Bilgisayar kasasını onarmak','Elektrik akımını ölçmek','Kelime işlemci metinle çalışır.'],
 ['Okumayı kolaylaştıran düzen hangisidir?','Tutarlı başlık ve paragraf düzeni','Her sözcüğü farklı biçimde yazma','Bütün metni boşluksuz yazma','Tutarlı düzen metnin yapısını görünür kılar.'],
 ['Yazım denetimi hakkında hangisi doğrudur?','Yardımcıdır ama son okuma gerekir.','Her anlam hatasını kesin bulur.','İnsan kontrolünü gereksiz kılar.','Otomatik araçlar bütün hataları belirleyemez.'],
 ['Bir öğrenci yalnız büyük harf kullanarak uzun bir metin yazdı. Ne önerilebilir?','Başlık ve gövde için okunabilir bir düzen kurması','Daha fazla biçimi rastgele eklemesi','Metni hiç okumadan göndermesi','Amaç gösterişli olmak değil anlaşılır metin hazırlamaktır.']
],gap:['Metin yazıp düzenlemeye yarayan yazılım türünü yaz.','kelime işlemci','Kelime işlemci metin belgeleri için kullanılır.'],statement:['Yazım denetimi bütün anlam hatalarını kesin olarak bulur.',false,'Metin insan tarafından da gözden geçirilmelidir.']});

add({ids:['topic-ce386b2cc2429e18'],teaching:[
 'Bir metin dosyası hazırlanırken amaç, başlık ve içerik sırası planlanır. Konuyla ilgili paragraflar bir araya getirilir.',
 'Kaynak kullanılan bilgilerde kaynak belirtilir. Başkasının yazısını kendi yazısı gibi sunmak doğru değildir; özgün ifadelerle çalışılır.',
 'Son kontrolde içerik, yazım, sayfa düzeni ve dosya adı gözden geçirilir. Kaydetme ile yazdırma aynı işlem değildir.'
],example:['Geri dönüşüm konusunda kısa rapor hazırlanacak.','Başlık, giriş ve örnekler için plan oluştur.','Yazdıktan sonra kaynak ve yazım kontrolü yaparak kaydet.','Planla, yaz, kontrol et, kaydet.'],checks:[
 ['Belge geliştirmede ilk adımlardan biri hangisidir?','Amaç ve içerik sırasını planlamak','Dosyayı başlamadan silmek','Kaynakları gizlemek','Plan, metnin düzenini kurar.'],
 ['Başkalarının bilgisinden yararlanırken ne yapılmalıdır?','Kaynak belirtilmelidir.','Kendi buluşu gibi gösterilmelidir.','Kaynak rastgele değiştirilmelidir.','Kaynak belirtmek emeğe saygı ve bilgi izlenebilirliği sağlar.'],
 ['Son kontrol hangi alanı kapsar?','İçerik, yazım ve düzen','Yalnız fare rengi','Yalnız masa yüksekliği','Belge kontrolü içerik ve biçimi birlikte kapsar.'],
 ['Belgeyi yazdıran öğrenci kaydetmeyi unuttu. Ne sonuç çıkarılır?','Kâğıt çıktısı, düzenlenebilir dosyanın kaydedildiğini kanıtlamaz.','Yazdırma her zaman dosyayı kaydeder.','Kaydetmeye hiçbir zaman gerek yoktur.','Yazdırma çıktı üretir; dosya kaydı ayrı işlemdir.']
],gap:['Başkalarının bilgisinden yararlanırken belirtilmesi gereken bilgiye ne denir?','kaynak','Kaynak, yararlanılan bilginin nereden geldiğini gösterir.'],statement:['Bir metni yazdırmak ile dosya olarak kaydetmek aynı işlemdir.',false,'Yazdırma kâğıt çıktısı, kaydetme dosya saklama işlemidir.']});

add({ids:['topic-97cec4dfc2604628'],teaching:[
 'Sunum programları bilgiyi slaytlar hâlinde düzenlemeye yardımcı olur. Her slaytta tek bir ana fikir olması izlemeyi kolaylaştırır.',
 'Kısa ifadeler, okunabilir yazı ve konuyla ilişkili görseller tercih edilir. Çok sayıda hareketli efekt, mesajın önüne geçebilir.',
 'Sunumu hazırladıktan sonra prova yapılır. Sunan kişi metni yalnız okumak yerine kendi ifadeleriyle açıklar ve kaynaklarını belirtir.'
],example:['Bir slaytta üç uzun paragraf var ve kimse okuyamıyor.','Ana fikri belirle.','Uzun paragrafları kısa maddelere ayır, ayrıntıyı sözlü açıkla.','Slaytı sadeleştirip okunabilir yap.'],checks:[
 ['Bir slaytı anlaşılır kılan yaklaşım hangisidir?','Tek ana fikir ve kısa ifadeler','Birbirinden ilgisiz on konu','Çok küçük yazıyla uzun metin','Ana fikir ve sade düzen takibi kolaylaştırır.'],
 ['Sunumdan önce hangi çalışma yararlıdır?','Prova yapmak','Dosyayı kontrol etmeden silmek','Bütün kaynakları kaldırmak','Prova anlatım ve süre düzenini gözden geçirmeyi sağlar.'],
 ['Görsel seçerken hangi ölçüt uygundur?','Konuyla ilişkili olması','Yalnız hareketli olması','Mümkün olduğunca karmaşık olması','Görsel mesajı desteklemelidir.'],
 ['Efektler izleyicinin konuyu takip etmesini zorlaştırıyor. Ne yapılmalıdır?','Gereksiz efektler azaltılmalıdır.','Daha çok efekt eklenmelidir.','Yazı daha da küçültülmelidir.','Tasarımın amacı dikkati ana mesaja yönlendirmektir.']
],gap:['Sunumdaki her bir sayfaya verilen adı yaz.','slayt','Sunum sayfaları slayt olarak adlandırılır.'],statement:['Bir sunumda çok sayıda efekt kullanmak her zaman daha iyi anlatım sağlar.',false,'Efektler gerektiğinde ve mesajı desteklediğinde kullanılmalıdır.']});

add({ids:['topic-71048a782540513a'],teaching:[
 'Bilgisayar ağı, cihazların veri paylaşmak için birbirine bağlanmasıdır. Bir okulda bilgisayarlar aynı yazıcıyı ağ üzerinden paylaşabilir.',
 'Ağda bilgisayar, bağlantı kablosu veya kablosuz erişim noktası gibi bileşenler bulunabilir. Her cihazın görevi aynı değildir.',
 'Ağa bağlı olmak bütün dosyaların herkese açık olması gerektiği anlamına gelmez. Paylaşım izinleri ve güvenlik kuralları korunur.'
],example:['Üç sınıf bilgisayarı tek yazıcıyı kullanıyor. Hangi yapı bunu sağlayabilir?','Cihazların bilgi paylaşımı için bağlandığını fark et.','Yazıcı paylaşımının ağın bir kullanımı olduğunu belirle.','Bilgisayar ağı.'],checks:[
 ['Bilgisayar ağı ne sağlar?','Cihazlar arasında veri ve kaynak paylaşımı','Bütün dosyaların zorunlu silinmesi','Her cihazın ekransız kalması','Ağ, cihazları paylaşım için bağlar.'],
 ['Ağ üzerinden hangi kaynak paylaşılabilir?','Yazıcı','Sandalyenin yüksekliği','Masanın ağırlığı','Yazıcı ağdaki cihazlarca kullanılabilir.'],
 ['Kablosuz erişim noktası neyle ilgilidir?','Ağ bağlantısıyla','Kâğıt kesmeyle','Boyama malzemesiyle','Erişim noktası kablosuz bağlantıda kullanılan bileşendir.'],
 ['Ağdaki herkesin bütün dosyaları görmesi gerekli midir?','Hayır, izinler ihtiyaçlara göre belirlenir.','Evet, gizlilik ortadan kalkar.','Evet, ağda sorumluluk olmaz.','Bağlantı ile erişim izni farklı kavramlardır.']
],gap:['Cihazların veri paylaşmak için bağlandığı yapıya ne denir?','ağ','Ağ, cihazlar arası bağlantı yapısıdır.'],statement:['Ağa bağlı olmak, her dosyayı herkesle paylaşmayı zorunlu kılar.',false,'Paylaşım izinleri ve gizlilik korunur.']});

add({ids:['topic-44398c514dc49333'],teaching:[
 'Yerel alan ağı, ev veya okul gibi sınırlı bir alandaki cihazları bağlar. Geniş alan ağları daha uzak yerlerdeki bağlantıları birleştirir.',
 'Cihazlar kablolu veya kablosuz bağlanabilir. Kablosuz bağlantıda sinyal gücü ve güvenli ağ seçimi önemlidir.',
 'Ağ adı, bağlantının güvenilir olduğunu tek başına kanıtlamaz. Bilinmeyen ağlara bağlanmadan önce yetişkin rehberliği istenir.'
],example:['Okuldaki birkaç bilgisayar aynı odada birbirine bağlandı. Bu nasıl sınıflandırılır?','Bağlantının sınırlı bir alanı kapsadığını belirle.','Yerel alan ağı tanımıyla eşleştir.','Yerel alan ağı.'],checks:[
 ['Ev veya okul içindeki sınırlı alan ağı hangisidir?','Yerel alan ağı','Bir metin dosyası','Bir resim katmanı','Yerel alan ağı sınırlı bir alanı kapsar.'],
 ['Cihazların bağlantı yöntemlerinden biri hangisidir?','Kablosuz bağlantı','Yazı puntosu','Gölgelendirme','Kablolu ve kablosuz yöntemlerle ağa bağlanılabilir.'],
 ['Kablosuz bağlantıda hangisi önemlidir?','Güvenilir ağ seçimi','Yalnız ağ adının güzel olması','Bütün şifreleri paylaşmak','Güvenlik yalnız bağlantının çalışmasından ayrı değerlendirilir.'],
 ['“Ücretsiz_Okul” adlı bilinmeyen ağ bulundu. Ne yapılmalıdır?','Adına güvenmek yerine yetkili yetişkine sorulmalıdır.','İsim güvenli diye kişisel bilgiler girilmelidir.','Bütün dosyalar paylaşılmalıdır.','Ağın adı güvenilirlik kanıtı değildir.']
],gap:['Kablosuz bağlantının karşıtı olan bağlantı yöntemini yaz.','kablolu','Ağ bağlantısı kablolu veya kablosuz olabilir.'],statement:['Bir ağın adının tanıdık görünmesi güvenli olduğunu kesin kanıtlar.',false,'Ağ güvenliği adından ibaret değildir.']});

add({ids:['topic-87833803b43e526c'],teaching:[
 'İnternette arama yaparken açık anahtar kelimeler kullanılır. “Geri dönüşüm nedir?” gibi belirli bir arama, çok belirsiz sözcüklerden daha yararlı olabilir.',
 'Bir kaynağın yazarı, tarihi, amacı ve başka güvenilir kaynaklarla uyumu incelenir. İlk sıradaki sonuç her zaman en doğru sonuç değildir.',
 'Bilgi ile reklamı ayırt etmek gerekir. Kaynak belirtilmeden aktarılan iddialar karşılaştırılır; kişisel bilgi gerektiren sayfalarda yetişkin desteği alınır.'
],example:['“Geri dönüşüm” araştırmasında iki farklı iddia gördün.','Kaynakların yazarını ve tarihini incele.','Güvenilir başka kaynaklarla karşılaştır.','İlk sonucu kopyalamak yerine kaynakları doğrula.'],checks:[
 ['Aramada hangi ifade daha belirli bir amaç taşır?','Kâğıt geri dönüşümü nasıl yapılır?','Şeyler','Her şey','Belirli anahtar kelimeler aramayı odaklar.'],
 ['Kaynak değerlendirirken hangisine bakılır?','Yazar ve yayın tarihi','Yalnız sayfanın rengi','Yalnız yazı büyüklüğü','Yazar ve tarih bilginin değerlendirilmesine yardımcı olur.'],
 ['İlk sıradaki sonuç için hangi yargı doğrudur?','Her zaman en doğru olmayabilir.','Kesinlikle tartışmasız doğrudur.','Kontrol edilmesi yasaktır.','Sıralama doğruluk garantisi değildir.'],
 ['Bir reklam bilgi yazısı gibi görünüyor. Ne yapılmalıdır?','Sayfanın amacı ve kaynakları incelenmelidir.','Reklam olduğu için bütün iddialar doğru sayılmalıdır.','Hiçbir kaynağa bakılmamalıdır.','Bilgi ile tanıtım amacı ayrılmalıdır.']
],gap:['Aramayı odaklamak için seçilen önemli sözcüklere ne denir?','anahtar kelimeler','Anahtar kelimeler arama amacını belirtir.'],statement:['Arama sonuçlarında ilk görünen sayfa daima en güvenilir kaynaktır.',false,'Her kaynak yazar, tarih, amaç ve doğrulama açısından değerlendirilir.']});

add({ids:['topic-89d1ec4c33fdba73'],teaching:[
 'Bilişim etiği, dijital araçları kullanırken doğru ve sorumlu davranışları düşünmektir. Başkalarının emeği, verisi ve kişisel alanı gözetilir.',
 'Başkasının metnini kendi üretimi gibi sunmak doğru değildir. Kaynak belirtmek ve kullanım iznine uymak emeğe saygının parçalarıdır.',
 'Bir işlem teknik olarak yapılabiliyor diye etik olmak zorunda değildir. Başkasının dosyasını izinsiz açabilmek, açma hakkı vermez.'
],example:['Açık unutulan bilgisayarda arkadaşının özel dosyası var.','Erişebilmenin izin anlamına gelmediğini fark et.','Dosyayı açmak yerine sahibine veya öğretmene haber ver.','İzinsiz dosyayı açma.'],checks:[
 ['Başkasının metnini kullanırken hangi davranış uygundur?','Kaynak ve kullanım iznine dikkat etmek','Kendi yazısı gibi sunmak','Yazar adını bilerek silmek','Emeğe saygı kaynak ve izinle ilgilidir.'],
 ['Bir dosyayı teknik olarak açabilmek neyi göstermez?','Açmaya izin verildiğini','Dosyanın erişilebilir olduğunu','Bir bilgisayarda bulunduğunu','Teknik imkân ile etik izin aynı değildir.'],
 ['Bilişim etiği hangi alanı kapsar?','Sorumlu dijital davranış','Yalnız cihaz fiyatları','Yalnız kablo uzunluğu','Etik, kullanımın insana ve topluma etkilerini düşünür.'],
 ['Bir arkadaşın hazırladığı sunumdan yararlanmak istiyorsun. Ne yaparsın?','İzin ve kaynak koşullarını gözetirim.','Sunumu kendi adıma sunarım.','Arkadaşının adını gizlerim.','İzin ve kaynak belirtme emeğe saygıyı korur.']
],gap:['Dijital ortamda doğru ve sorumlu davranışları inceleyen kavramı yaz: bilişim ...','etiği','Bilişim etiği dijital davranışların doğru ve sorumlu oluşuyla ilgilidir.'],statement:['Bir işlem yapılabiliyorsa mutlaka etik olarak da uygundur.',false,'Yapılabilirlik ile izin ve sorumluluk farklıdır.']});

add({ids:['topic-db349988d242c351'],teaching:[
 'Dijital gizlilik, kişisel bilgilerin kimlerle ve hangi amaçla paylaşıldığını kontrol etmektir. Adres, telefon ve parola korunması gereken bilgilerdendir.',
 'Güçlü parolalar kolay tahmin edilmemeli ve başkalarıyla paylaşılmamalıdır. Şüpheli bağlantılar kişisel bilgileri çalmaya yönelik olabilir.',
 'Bir ileti acele etmeni veya ödül için parola vermeni istiyorsa durup güvenilen yetişkine danış. Bir siteye girmek için gerekmeyen bilgi verilmez.'
],example:['“Ödül kazandın, parolanı gönder” iletisi geldi.','Ödül vaadinin parola istemeyi haklı kılmadığını fark et.','Bilgi paylaşmadan bir yetişkine haber ver.','Parolayı gönderme, iletiyi güvenilen yetişkinle değerlendir.'],checks:[
 ['Hangisi korunması gereken kişisel bilgidir?','Ev adresi','Bir kitabın genel konusu','Herkese açık okul tatili tarihi','Ev adresi kişinin özel yaşamıyla ilgilidir.'],
 ['Parola nasıl kullanılmalıdır?','Gizli tutulmalıdır.','Herkese gönderilmelidir.','Afişe yazılmalıdır.','Parola hesaba erişimi korur.'],
 ['Şüpheli ödül iletisi karşısında hangi davranış uygundur?','Bilgi paylaşmadan yetişkine danışmak','Hemen parola göndermek','Adresini gruba yazmak','Durup kontrol etmek bilgi kaybını önlemeye yardımcı olur.'],
 ['Bir uygulama ödev için ev adresini istiyor. Ne yapılmalıdır?','Gerekliliği sorgulanıp yetişkin desteği alınmalıdır.','İstenen her bilgi otomatik verilmelidir.','Parola da eklenmelidir.','Amaca gerekmeyen kişisel bilgi paylaşılmamalıdır.']
],gap:['Hesaba erişimi koruyan gizli karakter dizisine ne denir?','parola','Parola gizli tutulması gereken erişim bilgisidir.'],statement:['Bir ödül vaadi, parolanı paylaşmak için yeterli gerekçedir.',false,'Parola ödül için de paylaşılmamalıdır.']});

add({ids:['topic-cc70b6782e37245e'],teaching:[
 'Yapay zekâ, görüntü tanıma, dil işleme ve öneri sistemleri gibi farklı alanlarda kullanılır. Örneğin konuşmayı yazıya dönüştürme dil işleme alanıyla ilişkilidir.',
 'Görüntü sınıflandırma bir resimdeki örüntülere, öneri sistemi ise geçmiş seçimler gibi verilere dayanabilir. Bu sistemler insanın ihtiyacını her zaman doğru anlayamaz.',
 'Kullanım alanını değerlendirirken hangi verinin kullanıldığını ve yanlış bir sonucun kimi etkileyebileceğini düşünürüz.'
],example:['Bir uygulama konuşmayı yazıya dönüştürüyor. Hangi görev üzerinde çalışır?','Girdi türünün sesli dil olduğunu fark et.','Çıktının yazılı dil olduğunu belirle.','Dil işlemeyle ilgili bir görevdir.'],checks:[
 ['Konuşmayı yazıya dönüştürme hangi alanla ilişkilidir?','Dil işleme','Kâğıt katlama','Elektrik kablosu yapımı','Konuşma ve metin dil verileridir.'],
 ['Bir fotoğraftaki nesneyi sınıflandırma hangi kullanım örneğidir?','Görüntü tanıma','Dosya adını elle yazma','Monitörü temizleme','Görüntü tanıma görsel örüntüleri işler.'],
 ['Bir öneri sistemi hangi veriden yararlanabilir?','Geçmiş seçimlerden','Masanın fiziksel ağırlığından','Klavyenin tozundan','Öneri sistemleri geçmiş tercihler gibi örüntülere dayanabilir.'],
 ['Sistem hep aynı tür içerik öneriyor. Kullanıcı neyi bilmelidir?','Öneriler bütün seçenekleri temsil etmeyebilir.','Önerilenler evrendeki tek seçeneklerdir.','Sistem kişinin bütün ihtiyaçlarını kesin bilir.','Öneri sistemi verilerle sınırlıdır ve seçenekleri daraltabilir.']
],gap:['Konuşma ve metinle çalışan alanı tamamla: dil ...','işleme','Dil işleme, dil verileriyle ilgili görevleri kapsar.'],statement:['Bir öneri sistemi insanın bütün ihtiyaçlarını kesin olarak bilir.',false,'Öneriler sınırlı verilere dayanan tahminlerdir.']});

add({ids:['topic-a603b43457817246'],teaching:[
 'Yapay zekâ sistemlerini kullanırken gizlilik, doğruluk ve adalet soruları birlikte düşünülür. Bir çıktının akıcı olması güvenilir olduğunun kanıtı değildir.',
 'Kişisel fotoğraf, adres ve özel konuşmalar bilinmeyen sistemlere gönderilmez. Yaşa uygun kullanım koşulları yetişkinle kontrol edilir.',
 'Yanlı örneklerle çalışan bir sistem bazı kişileri veya durumları hatalı temsil edebilir. Önemli kararların sorumluluğu insanlardadır.'
],example:['Bir yapay zekâ ödev için gerçek ev adresini istiyor.','Ödevin amacı için adresin gerekli olup olmadığını sorgula.','Özel bilgiyi paylaşmadan yetişkine danış.','Kişisel adresi sisteme gönderme.'],checks:[
 ['Yapay zekâ aracına hangi bilgi rastgele verilmemelidir?','Ev adresi','Uydurma örnek karakter adı','Kişisel olmayan genel soru','Ev adresi kişisel bilgidir.'],
 ['Akıcı bir yapay zekâ yanıtı hakkında hangisi doğrudur?','Yine de doğrulanmalıdır.','Kesinlikle hatasızdır.','Kaynağa gerek bırakmaz.','Akıcılık doğru bilgi garantisi değildir.'],
 ['Eksik veya yanlı örnekler hangi sorunu oluşturabilir?','Hatalı temsil','Her durumda kusursuz sonuç','Sorumluluğun yok olması','Verideki sorunlar sonuçlara yansıyabilir.'],
 ['Bir sistem bir kişi hakkında olumsuz tahmin yaptı. Nasıl yaklaşılmalıdır?','Tahmin kesin hüküm sayılmamalı, insan denetimi ve kanıt aranmalıdır.','Kişi hemen suçlanmalıdır.','Her tahmin adil kabul edilmelidir.','Önemli kararlar hatalı tahminlere körü körüne bırakılmamalıdır.']
],gap:['Kişisel bilgilerin korunmasıyla ilgili kavramı yaz.','gizlilik','Gizlilik kişisel bilgilerin kontrolünü kapsar.'],statement:['Yapay zekâ çıktısını kontrol etme sorumluluğu tamamen ortadan kalkar.',false,'İnsan denetimi ve sorumluluğu önemini korur.']});

add({ids:['topic-2cdd1f833dd17900'],teaching:[
 'Problem belirleme, neyin çözülmesi gerektiğini açıkça ifade etmektir. Girdi, yapılacak işlemler ve beklenen çıktı belirlenir.',
 'Algoritma, bir işi gerçekleştirmek için düzenlenmiş açık ve sıralı adımlardır. “Bir şeyler yap” gibi belirsiz komutlar yerine uygulanabilir adımlar gerekir.',
 'Aynı problem için birden fazla çözüm yolu olabilir. Adımların sırası ve her durumun düşünülmesi çözümün çalışmasını etkiler.'
],example:['Bir sayının iki katını bulan algoritmayı kur.','Sayıyı girdi olarak al.','Sayıyı 2 ile çarp ve sonucu göster.','Girdi al → 2 ile çarp → sonucu göster.'],checks:[
 ['Bir işi çözmek için sıralı ve açık adımlara ne denir?','Algoritma','Doku','Kubbe','Algoritma çözüm adımlarının düzenidir.'],
 ['Algoritmada kullanılacak başlangıç bilgisi hangi kavramdır?','Girdi','Çıktı','Süsleme','Girdi işlenecek bilgidir.'],
 ['Hangi komut daha açıktır?','Sayıyı 2 ile çarp.','Bir şeyler yap.','Gerekeni hallet.','Açık komut uygulanabilir işlemi belirtir.'],
 ['Ayakkabı bağlama adımlarında bağcığı düğümlemeden önce giymek gibi sıra kararları neden önemlidir?','İşlem sırası sonucun doğru oluşmasını etkiler.','Sıra hiçbir zaman önemli değildir.','Algoritmanın adımı olamaz.','Adımların mantıklı sırası uygulanabilirliği sağlar.']
],gap:['Algoritmanın işlediği başlangıç bilgisine ne denir?','girdi','Girdi algoritmaya verilen bilgidir.'],statement:['Algoritmanın adımları açık ve uygulanabilir olmalıdır.',true,'Belirsiz adımlar güvenilir uygulamayı zorlaştırır.']});

add({ids:['topic-8279adfa5784a890'],teaching:[
 'Algoritma test etme, farklı girdilerle adımların beklenen sonucu verip vermediğini kontrol etmektir. Tek başarılı örnek her durumu kanıtlamaz.',
 'Hata bulunduğunda hangi adımın yanlış çalıştığı incelenir. Beklenen sonuçla gerçek sonuç karşılaştırılır ve gerekli düzenleme yapılır.',
 'Geri bildirim somut olmalıdır: “3 girdisinde 6 bekledim, 5 çıktı” gibi. Düzenlenen algoritma yeniden test edilir.'
],example:['İki kat algoritması 3 için 5 veriyor.','Beklenen sonucun 6 olduğunu hesapla.','Adımları incele; 2 ile çarpmak yerine 2 eklenmiş olabilir.','Hatayı düzeltip farklı girdilerle yeniden test et.'],checks:[
 ['Algoritmayı test etmek ne demektir?','Beklenen ve gerçek sonucu karşılaştırmak','Yalnız programı kapatmak','Bütün girdileri silmek','Test, davranışı beklenen sonuçla karşılaştırır.'],
 ['Somut geri bildirim hangisidir?','“3 için 6 bekledim, 5 çıktı.”','“Hiç güzel değil.”','“Bence garip.”','Girdi ve sonuç belirtmek hatayı bulmayı kolaylaştırır.'],
 ['Hata düzeltildikten sonra ne yapılmalıdır?','Yeniden test edilmelidir.','Hiç kontrol edilmemelidir.','Başka bütün dosyalar silinmelidir.','Düzeltme yeni veya kalan hatalar açısından kontrol edilir.'],
 ['Algoritma tek girdide doğru çalıştı. Hangi sonuç çıkarılabilir?','Diğer uygun girdilerle de test etmek gerekir.','Bütün durumlarda kesin doğrudur.','Artık adımlar önemli değildir.','Tek örnek tüm olası durumları temsil etmeyebilir.']
],gap:['Beklenen sonuçla gerçek sonucu karşılaştırma çalışmasına ne denir?','test','Test, algoritmanın davranışını kontrol eder.'],statement:['Bir algoritmanın tek örnekte çalışması, her durumda doğru çalıştığını kanıtlar.',false,'Farklı ve sınır durumlar da test edilmelidir.']});

add({ids:['topic-a738066b34ac1341'],teaching:[
 'Yazılımda komutlar belirli görevleri yapar. Sıralı yapı adımları sırayla çalıştırır; koşul ise bir durumun doğru veya yanlış olmasına göre seçim yapar.',
 'Döngü, aynı işlemi belirli kez veya bir koşula bağlı olarak tekrarlar. Değişken ise programda değeri saklanan adlandırılmış bir bilgidir.',
 'Doğru bileşeni seçmek programı anlaşılır yapar. Bir hareketi beş kez yapmak için beş ayrı komut yerine uygun bir tekrar yapısı kullanılabilir.'
],example:['Karakterin üç kez bir adım ilerlemesi isteniyor.','Tekrarlanan işlemi “bir adım ilerle” olarak belirle.','Üç tekrar içeren döngüyle uygula.','3 kez tekrarla: bir adım ilerle.'],checks:[
 ['Bir işlemi tekrarlayan yapı hangisidir?','Döngü','Klasör','Mihrap','Döngü aynı işlemi yeniden çalıştırır.'],
 ['Bir durum doğruysa farklı işlem yapmayı hangi yapı sağlar?','Koşul','Dosya uzantısı','Gölge','Koşul, duruma göre seçim yapılmasını sağlar.'],
 ['Programda adlandırılmış bilgi saklamak için ne kullanılır?','Değişken','Monitör ayağı','Fırça','Değişken bir değeri saklayan adlandırılmış alandır.'],
 ['“Puan 10’dan büyükse tebrik et” ifadesi hangi bileşeni gerektirir?','Koşul','Yalnız çizgi kalınlığı','Yalnız dosya kopyası','İfade bir karşılaştırmaya göre karar verir.']
],gap:['Aynı işlemi tekrar çalıştıran programlama yapısının adını yaz.','döngü','Döngü tekrar yapısıdır.'],statement:['Döngü, bir işlemi tekrar yapmak için kullanılabilir.',true,'Tekrar eden görevler döngüyle ifade edilebilir.']});

add({ids:['topic-c7fec790ddc978f8'],teaching:[
 'Blok tabanlı programlamada komutlar görsel bloklarla bir araya getirilir. Blokların sırası ve bağlantısı programın ne yapacağını belirler.',
 'Olay bloğu bir işlemi başlatabilir; hareket bloğu karakteri hareket ettirebilir. Tekrar ve koşul blokları daha düzenli davranış kurar.',
 'Önce küçük bir davranış programlanır, sonra test edilerek geliştirilir. Blok sayısının çok olması tek başına iyi program anlamına gelmez.'
],example:['Bir düğmeye basıldığında karakter iki adım ilerlesin.','Düğmeye basılma olayını başlangıç olarak seç.','Arkasına iki adım ilerleme komutunu bağla ve test et.','Olay → hareket komutu → test.'],checks:[
 ['Blok tabanlı programlamada program nasıl kurulur?','Görsel komut bloklarını birleştirerek','Yalnız ekranı temizleyerek','Kabloyu boyayarak','Bloklar programın komutlarını temsil eder.'],
 ['Bir tuşa basılmasıyla işlemi başlatan blok türü hangisidir?','Olay','Doku','Klasör','Olaylar program davranışının başlamasına neden olabilir.'],
 ['Blokların sırası neyi etkiler?','Programın davranışını','Monitörün ağırlığını','Masanın rengini','Komutların çalıştırılma sırası sonucu etkiler.'],
 ['Karakter beklenen yönde gitmiyor. Hangi yaklaşım uygundur?','Hareket ve yön bloklarını kontrol edip yeniden test etmek','Rastgele daha fazla blok eklemek','Test yapmayı bırakmak','Hatanın nedenine yönelik inceleme gerekir.']
],gap:['Bir tuşa basılması gibi programı başlatan duruma verilen kavramı yaz.','olay','Olay bloğu belirli durumlarda komutları başlatır.'],statement:['Çok blok içeren program her zaman daha doğru ve anlaşılırdır.',false,'Doğruluk ve açıklık blok sayısından daha önemlidir.']});

// Görsel sanatlarda bilgi soruları kavramı ölçer. Özgün ürünün güzelliği veya
// çocuğun yeteneği otomatik doğru/yanlış puanına dönüştürülmez.
add({ids:['topic-1bdc89a0d30f1fbe'],teaching:[
 'Resimleme, bir düşünceyi görselle anlatmaktır. Afiş, belirli bir mesajı izleyiciye ulaştırmak için yazı ve görseli birlikte kullanabilir.',
 'Afişte başlık, resim ve boş alan birbirini destekler. Ana mesajın kısa ve görünür olması, izleyicinin dikkatini doğru yere yönlendirir.',
 'Taslakta farklı yerleşimler denenebilir. Tek bir zorunlu güzel afiş yoktur; tasarım kararları mesajın anlaşılırlığı açısından açıklanır.'
],example:['Kütüphane haftası için afiş planla.','Ana mesajı “Birlikte okuyalım” gibi kısa bir ifadeyle belirle.','Kitap görselini ve başlığı okunabilir biçimde yerleştir.','Yazı ve resim aynı okuma mesajını destekler.'],checks:[
 ['Afişin temel amacı hangisidir?','Bir mesajı izleyiciye ulaştırmak','Yalnız kâğıdı doldurmak','Her zaman aynı resmi kopyalamak','Afişte görsel kararlar iletişim amacına hizmet eder.'],
 ['Okuma afişinde hangi görsel mesajı destekler?','Bir kitap görseli','Konuyla ilgisiz trafik levhası','Yalnız rastgele sayılar','Görselin konuyla ilişkisi mesajı güçlendirir.'],
 ['Afişte başlığın okunabilmesi neyle ilgilidir?','Yazı ile zemin arasındaki görünürlükle','Yalnız boya markasıyla','Yalnız kâğıdın fiyatıyla','Görünürlük ve boyut okunabilirliği etkiler.'],
 ['Bir taslakta çok öğe ana mesajı gizliyor. Ne denenebilir?','Gereksiz öğeleri azaltmak','Her boşluğa yeni görsel eklemek','Başlığı daha da küçültmek','Sadeleştirme dikkati mesaja yönlendirebilir.']
],gap:['Belirli bir mesajı yazı ve görselle duyuran tasarıma ne denir?','afiş','Afiş görsel iletişim amacı taşır.'],statement:['Afişte resim ile yazı aynı mesajı destekleyebilir.',true,'İki anlatım aracı birlikte anlam oluşturabilir.'],activity:activity('Okuma afişim',['Kâğıda iki küçük yerleşim taslağı çiz.','Kısa bir başlık ve kendi çizdiğin bir görsel kullan.','Bir arkadaşından ana mesajı söylemesini iste.'],'Mesajın anlaşılması için hangi tasarım kararını değiştirdin?')});

add({ids:['topic-547fcb1fdc6efb33'],teaching:[
 'Motif, bezemede kullanılan ve tekrar edebilen görsel birimdir. Selçuklu ve Osmanlı sanatında geometrik ve bitkisel düzenlemelere rastlanır.',
 'Geometrik motifte çizgi ve şekiller; bitkisel motifte yaprak ve çiçeklerden yola çıkan biçimler kullanılabilir. Bir motifi incelemek, bütün eserleri aynı saymak değildir.',
 'Geleneksel motiflerden esinlenerek özgün düzenleme yapılabilir. Kaynağı bilinen örnekler incelenir; yalnız benzerlikten kesin tarih veya usta adı çıkarılmaz.'
],example:['Bir bezemede aynı yıldız biçimi düzenli aralıklarla tekrarlanıyor.','Tekrarlanan birimi belirle.','Yıldız biçiminin geometrik özelliğini fark et.','Geometrik bir motifin tekrarı görülür.'],checks:[
 ['Bezemede kullanılan tekrar edebilir birime ne denir?','Motif','Perspektif','Rekat','Motif bezemenin görsel birimidir.'],
 ['Yıldız ve çokgenlerden oluşan düzenleme hangi gruba örnektir?','Geometrik','Yalnız sesli','Yalnız yazılı','Yıldız ve çokgenler geometrik biçimlerdir.'],
 ['Yapraklardan esinlenen motif hangi niteliktedir?','Bitkisel','Sayısal tablo','Ağ kablosu','Bitkisel motifler yaprak ve çiçek gibi biçimlerden yola çıkar.'],
 ['Bir motif geleneksel örneğe benziyor. Hangi bilgi yalnız benzerlikle kesinleşmez?','Eserin tarihi ve ustası','Şekillerin tekrar etmesi','Bir yaprak biçiminin görünmesi','Tarih ve sanatçı bilgisi kaynakla doğrulanmalıdır.']
],gap:['Bezemede tekrarlanabilen görsel birimin adını yaz.','motif','Motif süslemede kullanılan görsel birimdir.'],statement:['Bütün geleneksel motifler aynı biçimde olmak zorundadır.',false,'Geometrik ve bitkisel düzenlemelerde çeşitlilik vardır.'],activity:activity('Motiften düzenlemeye',['Bir yaprak veya çokgen biçimi çiz.','Bu birimi döndürerek ya da yan yana getirerek düzenle.','Hangi geleneksel örnekten esinlendiğini kaynak adıyla not et.'],'Tekrar ve boşluklar düzenini nasıl değiştirdi?')});

add({ids:['topic-32d51cc7395bf3f1'],teaching:[
 'Görsel denge, öğelerin bir düzen içinde uyumlu ağırlıklar oluşturmasıdır. Denge için iki tarafın birebir aynı olması gerekmez.',
 'Asimetrik dengede farklı büyüklük, renk veya konumdaki öğeler birbirini dengeler. Büyük açık bir alan ile küçük koyu bir öğe farklı görsel ağırlıklar oluşturabilir.',
 'Bir düzenlemeyi değerlendirirken gözün hangi öğelere yöneldiği gözlenir. Tek bir zorunlu yerleşim yerine farklı çözümler denenir.'
],example:['Sayfanın solunda büyük açık renkli şekil, sağında küçük koyu şekil var.','Öğelerin aynı olmadığını fark et.','Büyüklük ve koyuluğun görsel ağırlığa birlikte katkısını düşün.','Farklı öğelerle asimetrik denge kurulabilir.'],checks:[
 ['Asimetrik dengede iki tarafın durumu hangisidir?','Farklı öğelerle dengelenebilir.','Birebir aynı olmak zorundadır.','Hiç öğe bulunamaz.','Asimetri eş olmayan öğelerle denge kurulmasını sağlar.'],
 ['Görsel ağırlığı etkileyen özelliklerden biri hangisidir?','Renk koyuluğu','Kâğıdın sahibinin yaşı','Dosyanın oluşturulduğu gün','Büyüklük, konum ve koyuluk görsel ağırlığı etkileyebilir.'],
 ['Dengeyi incelemek için hangi soru yararlıdır?','Gözüm hangi öğelere yöneliyor?','Bu resmi kim kesin beğenmez?','Bütün şekiller neden aynı değil?','İzleyicinin dikkatinin dağılımı düzeni anlamaya yardım eder.'],
 ['İki tarafı farklı olan tasarım için hangi yargı doğrudur?','Yine de dengeli olabilir.','Kesinlikle hatalıdır.','Sanat çalışması sayılamaz.','Denge yalnız aynalama ile kurulmaz.']
],gap:['Eş olmayan öğelerle kurulan dengeye ne denir? Boşluğu doldur: ... denge.','asimetrik','Asimetrik denge farklı öğelerle kurulabilir.'],statement:['Denge yalnız iki tarafın birebir aynı olmasıyla kurulabilir.',false,'Asimetrik dengede farklı öğeler de dengelenebilir.'],activity:activity('Farklı şekillerle denge',['Bir sayfaya farklı boyutlarda üç şekil çiz.','Koyu ve açık alanları değiştirerek iki yerleşim dene.','Dikkatin hangi bölgeye yöneldiğini karşılaştır.'],'Aynı şekilleri kopyalamadan dengeyi nasıl kurdun?')});

add({ids:['topic-716c1a8075a9d05a'],teaching:[
 'Minyatür, tarihî el yazmalarında da görülen ayrıntılı resimleme geleneğidir. Bir olayın kişilerini, mekânlarını ve önemli ayrıntılarını birlikte anlatabilir.',
 'Minyatürde mekân ve büyüklükler her zaman fotoğraf gibi gösterilmez. Anlatılmak istenen olay ve figürün önemi görsel düzeni etkileyebilir.',
 'Bir minyatürden esinlenmek, onu birebir kopyalamak zorunda olmak değildir. Çağdaş bir olayı ayrıntılar ve farklı bakışlarla resmetmek için fikir alınabilir.'
],example:['Okul şenliğini minyatürden esinlenerek anlat.','Farklı etkinlikleri aynı sayfada göster.','Önemli ayrıntıları görünür kılan bir yerleşim kur.','Olayın çeşitli bölümleri bir anlatı düzeninde resmedilebilir.'],checks:[
 ['Minyatür geleneği hangi işleve de sahiptir?','Olayları resimleyerek anlatma','Yalnız ses kaydetme','Elektrik ölçme','Minyatür ayrıntılı resim anlatımıyla ilişkilidir.'],
 ['Minyatürde mekân her zaman nasıl olmak zorunda değildir?','Fotoğraf gibi','Anlatıyla ilişkili','Görsel öğeler içeren','Minyatürün kendine özgü mekân ve büyüklük düzeni olabilir.'],
 ['Minyatürden esinlenen öğrenci ne yapabilir?','Günlük bir olayı ayrıntılarıyla resmedebilir.','Yalnız tek bir ustanın çizgisini kopyalamak zorundadır.','Hiç yeni fikir kullanamaz.','Esinlenme özgün yorum yapmaya da açıktır.'],
 ['Bir figür ötekilerden büyük gösterilmiş. Önce hangi soru sorulabilir?','Anlatıda hangi önem vurgulanmış?','Resim neden fotoğraf değil?','Bütün figürler kesin eşit ölçüde olmalı mı?','Görsel büyüklük anlatım amacıyla ilişkili olabilir.']
],gap:['Tarihî el yazmalarında da görülen ayrıntılı resimleme geleneğinin adını yaz.','minyatür','Minyatür kendine özgü bir resimleme geleneğidir.'],statement:['Minyatürdeki bütün mekânlar fotoğrafın görünüş kurallarına birebir uymalıdır.',false,'Minyatür kendi anlatım ve düzenleme özelliklerine sahiptir.'],activity:activity('Şenliğin görsel öyküsü',['Okuldaki bir etkinliği seç.','Birden fazla küçük olayı aynı sayfada göster.','Önemli bulduğun ayrıntıları çizerek açıkla.'],'Hangi ayrıntı olayın anlaşılmasını sağladı?')});

add({ids:['topic-e73c9a030d58289a'],teaching:[
 'Espas, görsel öğeler arasındaki boşluk ve aralıklarla ilgilidir. Boş alan, bir tasarımın aktif parçasıdır; her yeri doldurmak zorunlu değildir.',
 'Vurgu, bir öğenin diğerlerinden daha çok dikkat çekmesidir. Hiyerarşi ise öğelerin önem sırasının büyüklük, konum, renk veya boşlukla görünür olmasıdır.',
 'Başlık ile açıklama arasında belirgin fark kurmak okuma sırasını kolaylaştırabilir. Tasarım kararını, izleyicinin neyi önce fark etmesini istediğimizle ilişkilendiririz.'
],example:['Afişin ana başlığı kayboluyor. Nasıl vurgu kurulabilir?','Başlığın çevresindeki kalabalığı azalt.','Başlığı uygun büyüklükte ve görünür konumda düzenle.','Boşluk ve büyüklükle başlık öne çıkarılabilir.'],checks:[
 ['Espas hangi özellikle ilgilidir?','Öğeler arasındaki boşluk','Yalnız boya fiyatı','Bir melodinin hızı','Espas görsel aralık ve boşluklarla ilgilidir.'],
 ['Bir öğenin öne çıkarılması hangi kavramdır?','Vurgu','Cüz','Döngü','Vurgu dikkati belirli öğeye yöneltir.'],
 ['Görsel önem sırasına ne denir?','Hiyerarşi','Rastlantı','Telaffuz','Hiyerarşi öğelerin hangi sırayla fark edildiğiyle ilgilidir.'],
 ['Bütün başlık ve açıklamalar aynı büyüklükte, aralıksız yazılmış. Ne zorlaşabilir?','Önem ve okuma sırasını ayırt etmek','Kâğıdın varlığını görmek','Renklerin bulunması','Farklılaşma ve boşluklar hiyerarşiyi görünür kılar.']
],gap:['Bir öğeyi öne çıkarıp dikkat çekmesini sağlamaya ne denir?','vurgu','Vurgu görsel dikkati yönlendirir.'],statement:['Bir tasarımda boş alanlar da anlamlı görev üstlenebilir.',true,'Boşluklar ayırma ve vurgulama işlevi görebilir.'],activity:activity('Başlığımı görünür yapıyorum',['Aynı başlık ve iki kısa cümleyle iki yerleşim çiz.','Birinde başlık çevresine boşluk bırak.','Hangisinde okuma sırasının daha açık olduğunu tartış.'],'Boşluk ve yazı boyutu dikkati nasıl etkiledi?')});

add({ids:['topic-1c21bed27acddad0'],teaching:[
 'Doku, bir yüzeyin pürüzlü, düz, çizgili veya lifli gibi özellikleriyle ilgilidir. Taş, yaprak ve ağaç kabuğu farklı doğal dokulara örnektir.',
 'Gerçek doku dokunarak da hissedilebilir; görsel doku çizgi ve lekelerle yüzey izlenimi oluşturur. Bir kâğıtta ağaç kabuğunu resmetmek gerçek kabuk üretmek değildir.',
 'Gözlem yaparken canlılara ve doğal alanlara zarar verilmez. Bilinmeyen bitki veya canlılara dokunmadan, güvenli nesneler yetişkin rehberliğinde incelenir.'
],example:['Pürüzlü ağaç kabuğunun görünüşünü kâğıtta anlat.','Çizgi ve koyu-açık lekeleri gözle.','Kabuktaki tekrarları farklı çizgilerle resmet.','Kâğıtta görsel doku oluşturulur.'],checks:[
 ['Hangisi doğal doku örneğidir?','Ağaç kabuğu','Plastik ambalaj','Metal cetvelin üretilmiş yüzeyi','Ağaç kabuğu doğada bulunan bir yüzeydir.'],
 ['Çizgilerle pürüzlülük izlenimi oluşturmak neye örnektir?','Görsel dokuya','Gerçek ağaç üretimine','Ses yüksekliğine','Görsel doku yüzey izlenimini resimle oluşturur.'],
 ['Doku hangi özellikle ilgilidir?','Yüzey özelliğiyle','Yalnız nesnenin adıyla','Yalnız kullanıcının yaşıyla','Doku yüzeyin algılanan niteliğidir.'],
 ['Doğadaki dokuyu incelemek isteyen öğrenci nasıl davranır?','Zarar vermeden güvenli gözlem yapar.','Ağaç kabuğunu zorla koparır.','Bilinmeyen bitkileri tadar.','Sanat gözlemi doğaya zarar vermeden yapılır.']
],gap:['Yüzeyin pürüzlü veya düz gibi özelliğine ne denir?','doku','Doku yüzey özelliklerini anlatır.'],statement:['Bir yüzeyi resmetmek için doğal nesneye zarar vermek gerekir.',false,'Dokuyu zarar vermeden gözlemleyip resmetmek mümkündür.'],activity:activity('Yaprağın çizgileri',['Yere düşmüş güvenli bir yaprağı gözle.','Ana ve yan damarları farklı çizgilerle çiz.','Canlı bitkilerden parça koparma.'],'Hangi çizgiler yaprağın doku izlenimini oluşturdu?')});

add({ids:['topic-d49b6bcb332d9493'],teaching:[
 'Işık yönü, yüzeydeki çıkıntı ve çukurların görünüşünü etkiler. Yandan gelen ışık bazı dokuları daha belirgin gösterebilir.',
 'Aynı nesne farklı aydınlatmada daha düz veya daha pürüzlü görünebilir. Görsel algı değişmiş olsa da nesnenin gerçek yüzeyi aynı kalabilir.',
 'Çizimde ışık alan ve gölgede kalan bölgeleri ayırt etmek doku etkisini güçlendirir. Gözleme dayalı kararlar verilir; tek bir zorunlu gölge biçimi yoktur.'
],example:['Buruşturulmuş kâğıdı önce önden, sonra yandan aydınlat.','Aynı nesne ve yüzeyi karşılaştır.','Işık yönü değişince gölgelerin nasıl değiştiğini gözle.','Işık, dokunun görünüşünü değiştirebilir.'],checks:[
 ['Yüzeyin görünüşünü etkileyen etmen hangisidir?','Işığın yönü','Yalnız nesnenin adı','Yalnız dosya adı','Işık yönü gölge ve ayrıntı algısını etkiler.'],
 ['Aynı yüzey yandan ışıkta daha pürüzlü görünebilir mi?','Evet, gölgeler ayrıntıyı belirginleştirebilir.','Hayır, ışığın hiçbir etkisi yoktur.','Yalnız nesne kırılırsa görünür.','Çıkıntıların oluşturduğu gölgeler yüzeyi belirginleştirebilir.'],
 ['Aydınlatma değişince ne aynı kalabilir?','Nesnenin gerçek yüzeyi','Her gölgenin yeri','Her parlak alanın görünüşü','Görsel algı değişse de fiziksel yüzey değişmeyebilir.'],
 ['İki çizimi karşılaştırmak için neyi sabit tutmak yararlıdır?','Nesneyi aynı tutup ışık yönünü değiştirmek','Her şeyi aynı anda değiştirmek','Nesneyi gözlemlememek','Tek etkeni değiştirerek ışığın etkisi daha açık görülür.']
],gap:['Bir yüzeyin dokusunu görünür kılmada yönü etkili olan şeyi yaz.','ışık','Işığın yönü doku algısını etkiler.'],statement:['Işık yönü değişince nesnenin gerçek dokusu mutlaka fiziksel olarak değişir.',false,'Görünüş değişebilir; gerçek yüzey aynı kalabilir.'],activity:activity('Işıkta doku',['Buruşturulmuş kâğıdı masaya koy.','Güvenli bir masa lambasının ışığını yetişkinle farklı yönden uygula.','Lambaya doğrudan bakmadan gölgeleri çiz.'],'Hangi aydınlatmada kırışıklıklar daha belirgindi?')});

add({ids:['topic-2e5bad71172377e2'],teaching:[
 'Ton, bir rengin veya gri değerin açıklık-koyuluk derecesidir. Tonlama, bu değerlerin düzenlenmesiyle hacim izlenimi oluşturabilir.',
 'Işık alan bölgeler çoğunlukla daha açık; gölgede kalanlar daha koyu gösterilir. Geçişler sert veya yumuşak olabilir; karar gözleme göre verilir.',
 'Karalamak yerine açık, orta ve koyu değerleri ayrı denemek kontrol sağlar. Kalemi çok bastırmak zorunlu değildir; katmanlı hafif çizgiler de koyuluk oluşturur.'
],example:['Bir küre çizimine hacim izlenimi ver.','Işığın geldiği yönü belirle.','Işık tarafını açık, karşı tarafı kademeli koyu göster.','Açık-koyu geçişi hacim izlenimi oluşturur.'],checks:[
 ['Ton hangi özellikle ilgilidir?','Açıklık ve koyulukla','Yalnız kâğıt genişliğiyle','Dosya uzantısıyla','Ton bir rengin açık-koyu değeridir.'],
 ['Hacim izlenimi hangi yolla desteklenebilir?','Açık-koyu geçişlerle','Bütün alanı aynı koyulukta zorunlu boyayarak','Işığı hiç düşünmeyerek','Ton farkları yüzeyin yönünü ve biçimini hissettirebilir.'],
 ['Işık alan bölüm çoğunlukla nasıl gösterilir?','Daha açık','Her zaman en koyu','Mutlaka kırmızı','Açıklık-koyuluk ışığın etkisini anlatır.'],
 ['Çizimde ton geçişi çok sert oldu. Hangi deneme yapılabilir?','Ara değerlerle yumuşak geçiş oluşturmak','Kâğıdı yırtmak','Her yeri aynı basınçla kapatmak','Ara tonlar geçişi yumuşatabilir.']
],gap:['Bir rengin açık veya koyu değerini anlatan kavramı yaz.','ton','Ton açıklık-koyuluk değeridir.'],statement:['Gölgelendirme yalnız kalemi çok bastırarak yapılabilir.',false,'Hafif çizgileri katmanlamak da koyu değer oluşturabilir.'],activity:activity('Beş tonlu şerit',['Kâğıdı beş küçük alana ayır.','Açıktan koyuya beş gri değer oluştur.','Sonra bu değerlerle basit bir yuvarlak biçimi gölgelendir.'],'Ara tonlar hacim izlenimine nasıl katkı verdi?')});

add({ids:['topic-4dba021785f1e0e3'],teaching:[
 'Doğal nesneler doğada oluşur; yapay nesneler insanlar tarafından üretilir. Her iki grupta da düz, pürüzlü, parlak veya lifli dokular bulunabilir.',
 'Bir taş doğal, bir kumaş parçası yapay nesne örneği olabilir. “Doğal olan mutlaka pürüzlüdür” gibi genellemeler doğru değildir.',
 'Karşılaştırmada nesnenin kaynağı ile yüzey özelliğini ayrı belirtiriz. Aynı yüzey niteliği farklı kaynaklı nesnelerde görülebilir.'
],example:['Düz bir taşla düz bir plastik kapağı karşılaştır.','Taşın doğal, kapağın üretilmiş olduğunu belirle.','İkisinin de düz yüzey gösterebildiğini gözle.','Kaynakları farklı olsa da yüzey özellikleri benzeyebilir.'],checks:[
 ['Hangisi doğal nesne örneğidir?','Taş','Plastik kapak','Üretilmiş kumaş','Taş doğada oluşur.'],
 ['Hangisi yapay nesne örneğidir?','Plastik şişe','Yaprak','Ağaç kabuğu','Plastik şişe insanlar tarafından üretilir.'],
 ['Doğal ve yapay nesneler için hangi ifade doğrudur?','Benzer yüzey özellikleri gösterebilirler.','Doğal olanların hepsi pürüzlüdür.','Yapay olanların dokusu yoktur.','Nesnenin kaynağı ile dokusu ayrı özelliklerdir.'],
 ['Bir öğrenci yalnız dokunarak “Bu kesin doğal” diyor. Hangi sorun vardır?','Doku tek başına kaynağı kesin göstermeyebilir.','Doku hiçbir zaman incelenemez.','Yapay nesne görülemez.','Benzer doku hem doğal hem yapay nesnelerde bulunabilir.']
],gap:['İnsanlar tarafından üretilen nesneleri anlatan sözcüğü yaz.','yapay','Yapay nesneler insan üretimidir.'],statement:['Bütün doğal nesneler mutlaka pürüzlüdür.',false,'Doğal nesneler düz veya pürüzlü olabilir.'],activity:activity('İki yüzey, iki kaynak',['Güvenli bir doğal nesne ile bir üretilmiş nesne seç.','Dokunmadan önce yüzeylerini çizgi ve lekelerle gözle.','Kaynaklarını ve dokularını iki ayrı başlıkla not et.'],'Kaynağı farklı ama dokusu benzer iki nesne buldun mu?')});

add({ids:['topic-980eccfcd273c775'],teaching:[
 'Natürmort, hareketsiz nesnelerin düzenlenip resmedilmesidir. Meyve, kap ve kitap gibi nesneler bir düzen içinde incelenebilir.',
 'İki renkle çalışmak, renk sayısını sınırlayarak biçim, ton ve yerleşime dikkat etmeyi sağlar. Aynı rengin açık-koyu değerleri kullanılabilir.',
 'Gözlemde nesnelerin birbirine göre büyüklüğü ve yerleşimi önemlidir. Yalnız iki renk kullanmak bütün nesneleri aynı görünüşte yapmak demek değildir.'
],example:['Bir kitap ve kupa iki renkle resmedilecek.','Nesnelerin yerleşimini hafif çizgilerle belirle.','İki rengin tonlarıyla biçim ve ışık farklarını göster.','Sınırlı renklerle farklı biçimler ve tonlar kurulabilir.'],checks:[
 ['Natürmortta ne resmedilir?','Düzenlenmiş hareketsiz nesneler','Yalnız koşu yarışı','Yalnız ses dalgası','Natürmort hareketsiz nesneleri konu alır.'],
 ['İki renkli çalışmada hangisi kullanılabilir?','Renklerin açık-koyu tonları','Mutlaka yirmi ayrı renk','Yalnız tek düz leke zorunluluğu','Renk sayısı sınırlı olsa da ton çeşitliliği olabilir.'],
 ['Nesneleri gözlerken hangi ilişki önemlidir?','Birbirine göre büyüklükleri','Nesneleri alan kişinin yaşı','Yalnız marka adları','Oran ve yerleşim düzenlemeyi anlamaya yardımcı olur.'],
 ['İki renkle farklı nesneler aynı görünmek zorunda mı?','Hayır, biçim ve tonlarla ayrılabilirler.','Evet, iki renkte biçim çizilemez.','Evet, bütün gölgeler silinmelidir.','Renk sınırı biçim ve ton anlatımını ortadan kaldırmaz.']
],gap:['Hareketsiz nesnelerin düzenlenip resmedildiği çalışma türünü yaz.','natürmort','Natürmort nesne düzenlemelerini konu alır.'],statement:['İki renk kullanmak, açık-koyu farklarının kullanılamayacağı anlamına gelir.',false,'Her rengin farklı tonlarıyla açık-koyu etkisi oluşturulabilir.'],activity:activity('İki renkle nesneler',['Bir kitap ve kırılmayacak bir nesne seç.','İki renk belirleyip nesnelerin yerleşimini çiz.','Açık-koyu tonlarla biçim farklarını dene.'],'Renkleri sınırlamak hangi ayrıntıya dikkatini artırdı?')});

add({ids:['topic-6ed7a79a80a3fedc'],teaching:[
 'Millî bayramlar, ortak tarih ve birlikte yaşama değerleri üzerinde düşünme fırsatıdır. Geleneksel çocuk oyunları da kültürel paylaşımın örneklerindendir.',
 'Görsel çalışmada bir kutlamanın renk, hareket ve ortak katılım özellikleri anlatılabilir. Bayramı resmetmenin tek bir zorunlu biçimi yoktur.',
 'Katılımı gösterirken farklı çocukları kapsamak ve herkesin saygınlığını korumak önemlidir. Oyunlarda güvenli alan ve adil katılım kuralları gözetilir.'
],example:['23 Nisan kutlamasında birlikte oyun oynayan çocukları resmet.','Ortak katılım ve neşe duygusunu anlatan bir an seç.','Farklı çocukları ve oyun alanını düzenle.','Kültürel paylaşım ve birlikte yaşama görsel olarak anlatılabilir.'],checks:[
 ['Geleneksel çocuk oyunları hangi açıdan incelenebilir?','Kültürel paylaşım','Yalnız dosya boyutu','Yalnız bireysel kazanç','Oyunlar kültürel aktarım ve birlikte yaşamla ilişkilidir.'],
 ['Kutlama resmi için hangi yaklaşım uygundur?','Farklı çocukların katılımını gözetmek','Bazı çocukları küçümsemek','Herkesin aynı görünmesini zorunlu tutmak','Kapsayıcı anlatım herkesin saygınlığını korur.'],
 ['Geleneksel oyun düzenlerken hangisi önemlidir?','Güvenli alan ve adil kurallar','Kalabalığı tehlikeli yere yönlendirmek','Kuralları yalnız bir kişiye uygulamak','Kültürel etkinlikte de güvenlik ve adalet gerekir.'],
 ['İki öğrencinin bayram çizimleri farklı. Ne söylenebilir?','Farklı görsel yorumlar aynı konuyu anlatabilir.','Yalnız biri mutlaka sanat sayılır.','İkisi de aynı kopya olmalıdır.','Sanatsal yorum farklı çözümlere açıktır.']
],gap:['23 Nisan, Ulusal Egemenlik ve Çocuk ... olarak kutlanır. Boşluğu tamamla.','Bayramı','23 Nisan Ulusal Egemenlik ve Çocuk Bayramı’dır.'],statement:['Aynı bayramı anlatan bütün çizimler birebir aynı olmak zorundadır.',false,'Öğrenciler aynı konuyu özgün biçimlerde anlatabilir.'],activity:activity('Birlikte kutluyoruz',['Bir bayram veya geleneksel oyun anını seç.','Katılımcıları ve ortamı kendi yorumunla çiz.','Hangi değeri anlatmak istediğini bir cümleyle açıkla.'],'Çiziminde birlikte yaşamı hangi ayrıntıyla gösterdin?')});

add({ids:['topic-68aa2407f8771664'],teaching:[
 'Müzeler, nesneleri ve bilgileri koruyup toplumla paylaşan kurumlardır. Eserlerin sergilendiği mekâna göre kapalı alan ve açık hava örnekleri görülebilir.',
 'Açık hava müzesinde yapılar veya kalıntılar dış mekânda sergilenebilir. Kapalı müzede ise uygun koruma koşulları olan salonlar kullanılabilir.',
 'Müze türünü belirlerken tek ölçütü açıkça söylemek gerekir: mekân, koleksiyonun konusu veya kurumun amacı farklı sınıflandırma ölçütleridir.'
],example:['Tarihî yapıların dış alanda sergilendiği müzeyi mekâna göre adlandır.','Ölçütün sergi konusu değil mekân olduğunu belirle.','Sergilemenin dış alanda yapıldığını fark et.','Açık hava müzesi.'],checks:[
 ['Mekâna göre sınıflandırmada hangi örnek uygundur?','Açık hava müzesi','Ritim müziği','Dosya klasörü','Açık hava ifadesi sergileme mekânını belirtir.'],
 ['Müzenin temel görevlerinden biri hangisidir?','Koruma ve bilgi paylaşımı','Eserleri rastgele yok etme','Kaynakları gizleme','Müzeler mirası korur ve toplumla paylaşır.'],
 ['Kapalı müze salonlarında ne gözetilir?','Uygun koruma koşulları','Eserlere sınırsız dokunma','Bütün etiketleri kaldırma','Eserin niteliğine göre koruma koşulları önemlidir.'],
 ['Bir müzeye hem arkeoloji hem açık hava denebilir mi?','Evet, biri konu, diğeri mekân ölçütünü anlatabilir.','Hayır, tek özellik bulunabilir.','Hayır, dış mekânda eser olamaz.','Farklı sınıflandırma ölçütleri birlikte kullanılabilir.']
],gap:['Dış mekânda sergileme yapan türü tamamla: açık hava ...','müzesi','Açık hava müzesi mekâna göre adlandırmadır.'],statement:['Müze türü belirlenirken hangi ölçüte bakıldığı açıklanmalıdır.',true,'Konu ve mekân gibi farklı ölçütler ayrı sınıflandırmalar oluşturur.'],activity:activity('Müze planım',['Kâğıda kapalı salon ve açık alan içeren basit bir plan çiz.','Hangi nesnenin hangi koşullarda korunacağını düşün.','Ziyaretçiler için bir koruma kuralı yaz.'],'Mekân seçimi koruma kararını nasıl etkiledi?')});

add({ids:['topic-867d3ee276a9c095'],teaching:[
 'Arkeoloji müzeleri, geçmiş topluluklardan kalan maddi buluntuları korur ve sergiler. Çömlek, alet, takı ve yapı parçaları geçmiş yaşam hakkında bilgi verebilir.',
 'Bir buluntunun bulunduğu yer ve bağlamı, ne işe yaradığını anlamada önemlidir. Eser etiketi nesnenin dönemi, malzemesi ve kaynağı hakkında bilgi sunabilir.',
 'Buluntulara zarar vermemek ve izinsiz dokunmamak gerekir. Eski görünen bir nesnenin yaşı yalnız görünüşten kesinleştirilmez.'
],example:['Müzede eski bir kap gördün. Geçmiş yaşamı anlamak için neye bakarsın?','Etiketteki dönem ve malzeme bilgisini oku.','Kabın kullanımına ilişkin açıklamayı incele.','Eser ve kaynak bilgilerini birlikte değerlendir.'],checks:[
 ['Arkeoloji müzesinde hangi nesne bulunabilir?','Geçmişten kalan çömlek','Yalnız güncel oyun puanı','Yalnız canlı konser sesi','Arkeoloji maddi geçmiş buluntularıyla ilgilenir.'],
 ['Eser etiketi ne sağlar?','Dönem ve malzeme gibi bilgiler','Eseri alma izni','Her soruya kesin kişisel yorum','Etiket nesnenin anlaşılmasına kaynak bilgisi ekler.'],
 ['Bir buluntunun bağlamı neden önemlidir?','Kullanımını anlamaya yardım eder.','Nesneyi otomatik yeni yapar.','Bütün kaynakları gereksiz kılar.','Bulunduğu yer ve ilişkiler yorum için önemlidir.'],
 ['Bir nesne çok eski görünüyor. Nasıl yaklaşılır?','Yaşı güvenilir inceleme ve kaynakla belirlenir.','Yaşına rastgele sayı verilir.','Görünüş bütün tarihi kesin kanıtlar.','Görsel izlenim tek başına tarih belirlemez.']
],gap:['Geçmiş topluluklardan kalan maddi buluntuları inceleyen alanın adını yaz.','arkeoloji','Arkeoloji geçmişin maddi izlerini inceler.'],statement:['Müzedeki eserleri korumak için ziyaret kurallarına uymak gerekir.',true,'Koruma ortak mirasın geleceğe aktarılmasını sağlar.'],activity:activity('Nesnenin hikâyesi',['Evdeki güvenli, sıradan bir nesneyi seç.','Adı, malzemesi ve kullanım amacı için örnek etiket hazırla.','Bilmediğin üretim tarihini uydurmak yerine “bilinmiyor” yaz.'],'Nesnenin geçmişi hakkında hangi bilgi eksikti?')});

// Müzik: concept checks support listening and making music; they do not assign
// an automatic grade to a pupil's voice, artistic taste or performance.
add({ids:['topic-af2e46b4c415b1ba'],teaching:[
 'İstiklâl Marşı, Türkiye’nin millî marşıdır. Sözleri Mehmet Âkif Ersoy’a, bugün kullanılan bestesi Osman Zeki Üngör’e aittir.',
 'Marşın söz yazarı ile bestecisi farklı görevler üstlenmiştir. Şiir metni sözcüklerden, beste ise bu metnin müzikle ifade edilmesinden oluşur.',
 'Dinleme ve söylemede anlamı düşünmek, toplu söyleyişin başlangıç ve bitişini izlemek önemlidir. Sesini zorlamadan, okulun tören düzenine uygun ve saygılı katılım gösterilir.'
],example:['İstiklâl Marşı’nın söz yazarı ve bestecisini iki sütunda göster.','Sözcükleri yazan kişiyi söz yazarı olarak belirle.','Müzik düzenini oluşturan kişiyi besteci olarak ayır.','Söz: Mehmet Âkif Ersoy; beste: Osman Zeki Üngör.'],checks:[
 ['İstiklâl Marşı’nın söz yazarı kimdir?','Mehmet Âkif Ersoy','Mimar Sinan','Osman Zeki Üngör','Mehmet Âkif Ersoy marşın şiir metnini yazmıştır.'],
 ['Bugün kullanılan İstiklâl Marşı bestesi kime aittir?','Osman Zeki Üngör','Mehmet Âkif Ersoy','Mimar Sinan','Osman Zeki Üngör marşın bestecisidir.'],
 ['Söz yazarı ile besteci arasındaki ayrım hangisidir?','Biri metni, diğeri müziği oluşturur.','İkisi zorunlu olarak aynı kişidir.','Biri yalnız resim çizer.','Metin ve beste farklı üretim alanlarıdır.'],
 ['Toplu söyleyişte sesini zorlayan öğrenciye ne önerilir?','Sesini zorlamadan öğretmen rehberliğine uyması','Diğerlerini bastıracak kadar bağırması','Rahatsızlığı önemsememesi','Ses sağlığı ve birlikte söyleme, yüksek ses yarışından daha önemlidir.']
],gap:['İstiklâl Marşı’nın söz yazarı Mehmet Âkif ...’dur. Soyadını yaz.','Ersoy','Marşın söz yazarı Mehmet Âkif Ersoy’dur.'],statement:['Bir eserin söz yazarı ile bestecisi farklı kişiler olabilir.',true,'Metin ve beste ayrı kişiler tarafından üretilebilir.'],activity:activity('Dinlerken izliyorum',['Öğretmeninin seçtiği güvenilir kayıttan marşı dinle.','Başlangıç ve bitişleri, seslerin birlikte hareketini fark et.','Sözlerin anlattığı ortak değeri bir cümleyle açıkla.'],'Birlikte söylemede dinlemenin rolü nedir?')});

add({ids:['topic-3138bfad381b6804','topic-24e61675d89c47dc'],teaching:[
 'Farklı müzik türleri ve eserler; ses rengi, tempo, ritim ve anlatım bakımından karşılaştırılabilir. Dinleme, ayrıntıları fark etme çalışmasıdır.',
 'Tempo müziğin hızı; ses rengi ise bir sesi başka sesten ayırt etmeye yardım eden özelliğidir. Aynı melodi farklı çalgılarla çalındığında ses rengi değişebilir.',
 'Bir türü sevmek kişisel tercihtir. “Ben bunu sevdim” ile “Bu eser hızlı” aynı tür yargı değildir; tercih ile gözleme dayalı niteliği ayırırız.'
],example:['Aynı melodiyi flüt ve piyanoda dinlediğinde hangi özellik değişebilir?','Melodinin aynı kalabildiğini fark et.','Çalgının oluşturduğu ses niteliğini karşılaştır.','Ses rengi değişebilir.'],checks:[
 ['Müziğin hızını anlatan kavram hangisidir?','Tempo','Klasör','Kubbe','Tempo müziğin hızıdır.'],
 ['Bir sesi başka sesten ayıran niteliğe ne denir?','Ses rengi','Kâğıt rengi','Ağ adı','Ses rengi çalgı veya ses kaynağını ayırt etmeye yardım eder.'],
 ['Hangi ifade kişisel tercih bildirir?','“Bu eseri sevdim.”','“Eser hızlı ilerliyor.”','“Kayıtta piyano duyuluyor.”','Sevme kişisel tercihtir; diğer ifadeler dinleme gözlemidir.'],
 ['Arkadaşın farklı tür müzik seviyor. Nasıl yaklaşılmalıdır?','Tercihine saygı duyup eserleri özellikleriyle konuşarak','Tercihini yanlış ilan ederek','Her türü aynı ses sayarak','Müzik tercihi kişiler arasında değişebilir.']
],gap:['Müziğin hızını anlatan kavramı yaz.','tempo','Tempo eserin hızlı veya yavaş ilerlemesiyle ilgilidir.'],statement:['Farklı türde müzik sevmek, öğrencinin bilgi sorusuna yanlış cevap verdiği anlamına gelir.',false,'Kişisel beğeni bilgi doğruluğu gibi puanlanamaz.'],activity:activity('İki eseri dinliyorum',['Öğretmenin seçtiği iki kısa eseri dinle.','Tempo ve duyduğun ses kaynakları hakkında not al.','Beğenini gözleminden ayrı bir cümlede yaz.'],'Tercihin ile duyduğun özellikleri nasıl ayırdın?')});

add({ids:['topic-0b4a4ace1d9ac4bc','topic-0e6fa07c6811bdc2'],teaching:[
 'Repertuvar, bir kişi veya topluluğun bildiği ve seslendirebildiği eserler bütünüdür. Ortak repertuvar, birlikte çalışılan eserlerden oluşur.',
 'Birlikte söylemede başlangıcı izlemek, birbirini dinlemek ve aynı hızda ilerlemek önemlidir. Amaç başkasını bastırmak değil ortak müzik oluşturmaktır.',
 'Eser seçerken yaşa, anlama ve ses sınırlarına uygunluk gözetilir. Çalışma bölümleri küçük parçalara ayrılıp tekrar denenebilir.'
],example:['Sınıf bir eseri birlikte söyleyecek. Hazırlık nasıl yapılır?','Herkesin çalışacağı ortak eseri belirle.','Başlangıç işareti, hız ve bölümleri birlikte prova et.','Birlikte dinleme ve prova ortak söyleyişi destekler.'],checks:[
 ['Bir topluluğun çalışıp seslendirdiği eserler bütününe ne denir?','Repertuvar','Doku','Algoritma','Repertuvar seslendirilebilen eserler bütünüdür.'],
 ['Ortak söyleyişte hangi davranış uygundur?','Diğerlerini dinlemek','Herkesten yüksek bağırmak','Başlangıç işaretini önemsememek','Dinleme birlikte müzik yapmanın temelidir.'],
 ['Eser seçerken hangi ölçüt önemlidir?','Yaşa ve ses sınırlarına uygunluk','Yalnız en yüksek sesi istemek','Yalnız en uzun eseri seçmek','Uygun eser, katılım ve ses sağlığını destekler.'],
 ['Topluluk farklı hızlarda ilerliyor. Hangi çalışma yararlıdır?','Ortak hızda kısa bölümlerle prova','Herkesin daha hızlı söylemesi','Dinlemeyi bırakmak','Küçük bölümlerde ortak hız çalışması uyumu destekler.']
],gap:['Bir topluluğun bildiği ve seslendirdiği eserler bütününün adını yaz.','repertuvar','Repertuvar eserler bütünüdür.'],statement:['Birlikte söylemede amaç diğerlerinin sesini bastırmaktır.',false,'Amaç birbirini dinleyerek ortak bir müzik oluşturmaktır.'],activity:activity('Ortak başlangıç',['Öğretmenin uygun gördüğü kısa ve tanıdık bir eser seçin.','Önce yalnız başlangıç ve bitiş işaretlerini çalışın.','Sesinizi zorlamadan küçük bir bölümü birlikte söyleyin.'],'Birbirinizi dinlemek uyumu nasıl etkiledi?')});

add({ids:['topic-7e8a4abfcbb48a58','topic-74362e15704a9ff3'],teaching:[
 'Belirli gün ve haftalarda seçilen eserler, o günün anlamıyla ilişki kurar. Eserin sözleri, anlatımı ve kullanım amacı birlikte düşünülür.',
 'Bir çevre etkinliğinde doğayı koruma konulu eser seçmek, etkinliğin mesajını destekleyebilir. Bir eserin yalnız adını bilmek uygunluğunu değerlendirmeye yetmez.',
 'Seçimde yaşa uygunluk, sözlerin anlaşılması ve topluluğun katılımı gözetilir. Birden fazla eser aynı etkinliğe farklı yönlerden katkı sunabilir.'
],example:['Çevre haftası etkinliği için eser seçilecek.','Etkinliğin doğayı koruma amacını belirle.','Eserin söz ve anlatımının bu amacı destekleyip desteklemediğini incele.','Etkinliğin anlamıyla ilişkili, yaşa uygun eser seçilir.'],checks:[
 ['Belirli gün için eser seçerken önce ne düşünülmelidir?','Günün anlamı ve etkinliğin amacı','Yalnız kaydın dosya adı','Yalnız çalgının fiyatı','Eser etkinliğin mesajını desteklemelidir.'],
 ['Çevre etkinliğine hangi konu doğrudan uygundur?','Doğayı koruma','Kişisel parola paylaşımı','İlgisiz ürün reklamı','Doğayı koruma çevre etkinliğiyle anlam ilişkisi kurar.'],
 ['Bir eserin uygunluğunu incelemek için hangisine bakılır?','Sözleri ve anlatımı','Yalnız başlığın uzunluğu','Yalnız kapağın rengi','Başlık tek başına içeriği tam göstermez.'],
 ['Aynı güne iki farklı eser seçildi. Hangi değerlendirme doğrudur?','İkisi de günün anlamını destekliyorsa uygun olabilir.','Aynı güne yalnız bir eser uygun olabilir.','Eserlerin anlamı hiç önemli değildir.','Bir konu farklı eserlerle ifade edilebilir.']
],gap:['Doğayı korumayı anlatan bir eser hangi haftayla doğrudan ilişkilendirilebilir? ... haftası.','çevre','Çevre haftası doğayı koruma bilincini destekler.'],statement:['Eser seçerken sözlerin yaşa uygunluğu dikkate alınmalıdır.',true,'İçerik ve katılım koşulları seçimde önemlidir.'],activity:activity('Etkinliğe eser seçiyorum',['Bir belirli gün veya hafta seç.','Öğretmenin sunduğu uygun eserlerin konularını karşılaştır.','Seçim gerekçeni söz, anlam ve katılım açısından açıkla.'],'Eserin etkinliğin anlamını hangi yönüyle desteklediğini söyle.')} );

add({ids:['topic-944d2d9de9936e8a','topic-d79b13f291ae434f'],teaching:[
 'Müzikte bedensel hareketler, düzenli vuruşu ve ritmi hissetmeye yardımcı olabilir. El çırpma ve hafif diz üstü dokunuşlar örneklerdir.',
 'Düzenli vuruş müziğin zaman akışını izlemeyi sağlar; ritim ise ses ve susların süre düzenidir. Her vuruşun aynı hareketle gösterilmesi zorunlu değildir.',
 'Hareketler güvenli ve erişilebilir seçilir. Oturarak veya yalnız el hareketiyle katılım da mümkündür; herkesin hareket biçimi aynı olmak zorunda değildir.'
],example:['Dört düzenli vuruşu güvenli hareketlerle göster.','İlk iki vuruşta hafifçe el çırp.','Son iki vuruşta elini dizine hafifçe dokundur; aynı hızda sürdür.','Farklı hareketlerle düzenli vuruş korunabilir.'],checks:[
 ['Bedensel hareketler müzikte neyi fark etmeye yardım eder?','Vuruş ve ritmi','Dosya uzantısını','Yapı yüksekliğini','Hareketler zaman düzenini bedensel olarak hissettirebilir.'],
 ['Ritim hangi özellikle ilgilidir?','Ses ve susların süre düzeniyle','Yalnız çalgının rengiyle','Yalnız şarkıcının adıyla','Ritim zaman içindeki süre ilişkileridir.'],
 ['Erişilebilir katılım örneği hangisidir?','Oturarak el hareketiyle katılmak','Herkesi aynı zor harekete zorlamak','Rahatsızlığı önemsememek','Farklı hareket biçimleriyle de ritim çalışılabilir.'],
 ['Bir öğrenci ayakta hareket edemiyor. Ne yapılabilir?','Oturarak veya uygun el hareketiyle katılım düzenlenebilir.','Etkinlikten bütünüyle dışlanmalıdır.','Her durumda zıplamaya zorlanmalıdır.','Etkinlik farklı bedensel gereksinimlere uyarlanabilir.']
],gap:['Ses ve susların süre düzenini anlatan kavramı yaz.','ritim','Ritim müziğin süre düzenidir.'],statement:['Ritim çalışmasına katılmak için herkesin ayakta zıplaması zorunludur.',false,'Oturarak ve uygun küçük hareketlerle de katılmak mümkündür.'],activity:activity('Oturarak dört vuruş',['Rahat ve güvenli bir oturuş seç.','Dört eşit vuruşta hafif el veya diz dokunuşları yap.','Öğretmen işaretinde birlikte başlayıp bitir.'],'Farklı hareketler yaparken aynı hızı nasıl korudun?')});

add({ids:['topic-6ebdc3de61172181'],teaching:[
 'Müzik yazısında semboller seslerin yüksekliği, süresi ve susları gibi özellikleri göstermeye yardım eder. Dizek beş çizgiden oluşur.',
 'Nota sesleri, sus işareti ise belirli süre sessizliği gösterir. Sus da müziğin zaman düzeninin parçasıdır; rastgele ara değildir.',
 'Sembolleri öğrenirken biçim, ad ve işlevi ayrı eşleştiririz. Bir sembolün adını bilmek ile müzikte doğru sürede uygulamak farklı çalışmalardır.'
],example:['Müzikte bir süre sessiz kalınması isteniyor. Hangi sembol türüne bakılır?','Ses üretme ile sessizlik görevini ayır.','Sessizliğin süresini belirten sus işaretini seç.','Sus işareti.'],checks:[
 ['Dizek kaç çizgiden oluşur?','5','3','10','Dizek beş çizgilidir.'],
 ['Müzikte belirli süre sessizliği hangi işaret gösterir?','Sus','Klasör','Mihrap','Sus işareti süreli sessizliği belirtir.'],
 ['Nota yazısı neye yardım eder?','Seslerin özelliklerini göstermeye','Çalgı kasasını onarmaya','Dosya şifrelemeye','Müzik yazısı ses ve süre düzenini görünür kılar.'],
 ['Bir öğrenci sus işaretinde beklemeden çalıyor. Hangi bilgi hatırlatılmalıdır?','Sessizliğin de belirtilen süresi vardır.','Suslar her zaman gereksizdir.','Her işaret yüksek ses ister.','Suslar müziğin ritmik düzeninin parçasıdır.']
],gap:['Beş çizgili müzik yazısı alanının adını yaz.','dizek','Dizek beş paralel çizgiden oluşur.'],statement:['Sus işareti, müzikte belli süre sessizliği gösterebilir.',true,'Sessizlik de müzikal süre düzenine katılır.'],activity:activity('Ses ve sessizlik dizim',['Dört kutu çiz ve ikisine “ses”, ikisine “sus” yaz.','Eşit aralıklarla kutuları izleyip ses olanlarda hafif el çırp.','Suslarda aynı süreyi sessizce bekle.'],'Sessizlik eklenince örüntü nasıl değişti?')});

add({ids:['topic-67cafa37ce48d4b0'],teaching:[
 'Güzel sanatlar; müzik, resim, heykel ve sahne sanatları gibi farklı anlatım alanlarını kapsar. Bu alanlar bazen bir eserde birlikte kullanılabilir.',
 'Müzik ses ve zamanla, resim renk ve çizgiyle anlatım kurabilir. Bir tiyatro gösterisinde metin, oyunculuk, görsel düzen ve müzik birlikte bulunabilir.',
 'Sanat kavramlarını öğrenirken kullanılan araç ile ortaya çıkan anlamı ayırırız. Farklı sanat alanları arasında kesin bir üstünlük sıralaması yapmak gerekmez.'
],example:['Bir tiyatro gösterisinde dekor ve müzik var. Hangi ilişki görülür?','Dekorun görsel anlatıma katkısını belirle.','Müziğin sesle duygu ve zaman etkisi kurduğunu fark et.','Farklı sanat alanları aynı gösteride birlikte çalışabilir.'],checks:[
 ['Müziğin temel anlatım araçlarından biri hangisidir?','Ses','Klasör','Şifre','Müzik ses ve zaman düzeninden yararlanır.'],
 ['Resim hangi araçlarla anlatım kurabilir?','Renk ve çizgi','Yalnız dosya adı','Yalnız parola','Resimde renk ve çizgi görsel anlatım araçlarıdır.'],
 ['Bir tiyatro gösterisinde hangi durum mümkündür?','Farklı sanat alanlarının birlikte kullanılması','Yalnız tek anlatım aracının zorunlu olması','Müziğin hiçbir zaman bulunamaması','Sahne eserleri farklı alanları birleştirebilir.'],
 ['Bir öğrenci resimle, diğeri müzikle anlatmayı seviyor. Ne söylenebilir?','Farklı sanat alanları farklı ifade olanakları sunar.','Birinin tercihi kesin yanlıştır.','Sanatın yalnız tek alanı vardır.','Anlatım yolları ve kişisel tercihler çeşitlidir.']
],gap:['Ses ve zaman düzeniyle anlatım kuran sanat alanını yaz.','müzik','Müzik ses ve zamanla ilişkilidir.'],statement:['Farklı sanat alanları aynı eserde birlikte kullanılabilir.',true,'Tiyatro gibi örnekler görsel, sözlü ve müzikal anlatımı birleştirebilir.'],activity:activity('Bir olayı iki yolla anlatıyorum',['Yağmurlu bir gün gibi basit bir konu seç.','Önce çizgi ve renklerle küçük bir resim yap.','Sonra güvenli hafif seslerle aynı konuyu anlatan bir örüntü kur.'],'İki anlatım aracı hangi farklı ayrıntıları öne çıkardı?')});

add({ids:['topic-c708909fd563cf34'],teaching:[
 'Atatürk, Cumhuriyet döneminde sanatın ve sanat eğitiminin gelişmesine önem vermiştir. Sanat kurumlarının ve eğitim olanaklarının geliştirilmesi bu anlayışla ilişkilidir.',
 'Bir kişinin sanata verdiği önemi incelerken güvenilir tarihî kaynaklardan yararlanılır. Kaynağı belirtilmeyen sözleri kesin alıntı olarak aktarmak doğru değildir.',
 'Sanat eğitimi, insanların ifade ve kültüre katılım olanaklarını geliştirebilir. Eserleri dinlemek, görmek ve sanatçı emeğine saygı göstermek bu katılımın parçalarıdır.'
],example:['Atatürk’e ait olduğu söylenen bir söz kaynaksız paylaşılıyor. Nasıl araştırılır?','Sözün aktarıldığı güvenilir tarihî kaynağı ara.','Kaynak bulunamazsa sözü kesin alıntı olarak yazma.','Tarihî sözler kaynakla doğrulanmalıdır.'],checks:[
 ['Atatürk’ün sanata verdiği önem hangi alanla da ilişkilidir?','Sanat eğitiminin gelişmesiyle','Sanat kurumlarının gereksiz sayılmasıyla','Kültüre katılımın yasaklanmasıyla','Sanat ve eğitim olanaklarının gelişmesi birlikte ele alınır.'],
 ['Tarihî bir söz aktarılırken hangisi önemlidir?','Güvenilir kaynak','Yalnız çok paylaşılmış olması','Yalnız süslü bir görsel','Yaygın paylaşım doğruluk kanıtı değildir.'],
 ['Sanatçı emeğine saygı örneği hangisidir?','Eserin sahibini belirtmek','Eseri kendi üretimi gibi sunmak','İzinsiz kopyayı kendine mal etmek','Kaynak ve sanatçı adı emeği görünür kılar.'],
 ['Bir alıntının kaynağı bulunamıyor. Nasıl aktarılmalıdır?','Kesin alıntı olarak kullanılmamalıdır.','Kaynak adı uydurulmalıdır.','Paylaşım sayısı kaynak sayılmalıdır.','Doğrulanamayan söz kesin tarihî bilgiye dönüştürülmez.']
],gap:['Sanat eserini üreten kişiye verilen genel adı yaz.','sanatçı','Sanatçı eser üreten kişidir.'],statement:['Çok paylaşılan her tarihî söz, kaynağa bakılmadan kesin doğru kabul edilir.',false,'Tarihî bilgi güvenilir kaynakla doğrulanmalıdır.'],activity:activity('Sanat kurumunu tanıyorum',['Öğretmenin sağladığı güvenilir kaynaktan bir sanat eğitim kurumunu incele.','Kurumun hangi sanat alanında çalıştığını not et.','Kaynakta olmayan tarih veya alıntıyı uydurma.'],'Bir sanat kurumunun eğitime katkısı ne olabilir?')});

add({ids:['topic-d30854a2e150816c'],teaching:[
 'Nefesli çalgılarda ses, hava sütununun titreşimiyle oluşur. Flüt, klarnet ve trompet farklı nefesli çalgı örnekleridir.',
 'Çalgıların ses rengi ve ses üretme düzeni farklı olabilir. Sınıflandırmada yalnız görünüş veya yapıldığı madde değil, sesin nasıl üretildiği önemlidir.',
 'Dinleme çalışması için çalgıyı çalmak zorunlu değildir. Paylaşılan ağızlıklar hijyen açısından dikkat gerektirir; uygulama öğretmen rehberliğinde yapılır.'
],example:['Flüt ile piyanoyu ses üretimine göre ayır.','Flütte hava sütununun titreştiğini fark et.','Piyanoda tuşlara basılınca tellere çekiçlerin vurduğunu öğren.','Flüt nefesli, piyano tuşlu bir çalgıdır.'],checks:[
 ['Hangisi nefesli çalgıdır?','Flüt','Piyano','Davul','Flütte hava sütununun titreşimi ses oluşturur.'],
 ['Nefesli çalgılarda ses hangi unsurla ilişkilidir?','Titreşen hava sütunuyla','Yalnız dosya adıyla','Yalnız dış boyayla','Havanın titreşimi nefesli çalgının ses üretimidir.'],
 ['Hangisi başka bir nefesli çalgı örneğidir?','Klarnet','Keman','Gitar','Klarnet nefesli çalgılar arasındadır.'],
 ['Çalgı sınıflandırırken yalnız dış görünüş yeterli midir?','Hayır, ses üretim biçimi de incelenir.','Evet, renginden kesin anlaşılır.','Evet, büyük olanlar hep aynıdır.','Çalgının çalışma biçimi sınıflandırmada önemlidir.']
],gap:['Flüt hangi çalgı grubundadır? ... çalgılar.','nefesli','Flüt nefesli çalgı örneğidir.'],statement:['Nefesli çalgıları tanımak için herkesin aynı ağızlığı paylaşması gerekir.',false,'Dinlemeyle de tanınabilir; hijyen ve öğretmen rehberliği önemlidir.'],activity:activity('Ses rengini dinliyorum',['Öğretmenin sunduğu flüt ve klarnet kayıtlarını kısa süre dinle.','Seslerin benzer ve farklı yönlerini sözcüklerle anlat.','Çalgı çalmadan da dinleme gözlemi yapabileceğini fark et.'],'İki nefesli çalgının ses rengini nasıl ayırt ettin?')});

add({ids:['topic-eceb9af249dfbe0e'],teaching:[
 'Tuşlu çalgılarda çalgıyı yönetmek için tuşlardan yararlanılır. Piyano, org ve elektronik klavye örneklerdir.',
 'Tuşlu olmak, bütün çalgılarda sesin aynı yolla oluştuğu anlamına gelmez. Akustik piyanoda çekiçler tellere vurur; elektronik klavyede ses elektronik olarak üretilebilir.',
 'Çalgıları karşılaştırırken kullanım aracı ile ses üretim biçimini ayrı düşünürüz. Ses düzeyi işitme sağlığını koruyacak biçimde ayarlanır.'
],example:['Piyano ile elektronik klavye neden aynı görünüp farklı ses üretebilir?','İkisinde de tuşların kullanıldığını belirle.','İçlerindeki ses üretim düzeninin farklı olduğunu karşılaştır.','Benzer kullanım aracı, farklı ses üretim düzeni olabilir.'],checks:[
 ['Hangisi tuşlu çalgı örneğidir?','Piyano','Flüt','Davul','Piyanoda tuşlarla çalgı yönetilir.'],
 ['Akustik piyanoda tuş basılınca ne olur?','Çekiçler tellere vurur.','Yalnız hava dışarı üflenir.','Kâğıt dosya açılır.','Piyanoda ses tellerin titreşimiyle oluşur.'],
 ['Elektronik klavyede ses nasıl üretilebilir?','Elektronik olarak','Yalnız suyla','Yalnız doğrudan üflemeyle','Elektronik klavye elektronik ses üretimi kullanabilir.'],
 ['İki çalgının da tuşlu olması neyi tek başına kanıtlamaz?','Seslerinin aynı mekanizmayla oluştuğunu','Tuşlarının kullanıldığını','Tuşlu sınıfına alınabildiğini','Tuş, yönetim aracıdır; iç mekanizma farklı olabilir.']
],gap:['Piyano hangi gruba örnektir? ... çalgılar.','tuşlu','Piyano tuşlu çalgı örneğidir.'],statement:['Bütün tuşlu çalgılar sesi aynı mekanizmayla üretir.',false,'Akustik piyano ile elektronik klavyenin ses üretimi farklı olabilir.'],activity:activity('Tuşlu çalgıları karşılaştırıyorum',['Öğretmenin sunduğu piyano ve elektronik klavye örneklerini dinle.','İkisini tuşlu yapan ortak özelliği yaz.','Ses üretimindeki bir farklılığı kendi cümlenle açıkla.'],'Kullanım aracı ile ses üretimi arasındaki fark nedir?')});

add({ids:['topic-9cd5e970ea0b21cb'],teaching:[
 'Popüler müzik, belirli bir dönemde geniş dinleyici çevresine ulaşan müziklerle ilişkilidir. Pop, rock gibi adlar farklı tür ve üslupları tanımada kullanılır.',
 'Türleri karşılaştırırken ritim, çalgılar, ses rengi ve anlatım özellikleri incelenir. Bir eserin türü hakkında yalnız tek çalgıya bakarak kesin karar vermek her zaman mümkün değildir.',
 'Popülerlik ile kişisel beğeni ve sanat değeri aynı kavram değildir. Arkadaşların farklı tercihleri olabilir; dinleme düzeyi işitme sağlığını korumalıdır.'
],example:['Bir eser çok dinleniyor ama sen sevmiyorsun. Nasıl ifade edilir?','Dinlenme yaygınlığını popülerlikle ilişkilendir.','Kendi beğeninin ayrı olduğunu söyle.','Bir eser popüler olabilir; herkesin onu sevmesi gerekmez.'],checks:[
 ['Popülerlik hangi durumla ilişkilidir?','Geniş dinleyiciye ulaşma','Herkesin zorunlu beğenmesi','Bütün eserlerin aynı olması','Popülerlik yaygın dinlenmeyle ilgilidir.'],
 ['Tür karşılaştırırken hangi özellik incelenebilir?','Ritim ve kullanılan çalgılar','Yalnız dosyanın adı','Yalnız dinleyicinin boyu','Müzikal özellikler karşılaştırma için veri sağlar.'],
 ['Bir eserin çok dinlenmesi neyi zorunlu kılmaz?','Herkesin onu sevmesini','Geniş çevreye ulaşmasını','Bazı kişilerin onu tanımasını','Kişisel beğeni yaygınlıktan farklıdır.'],
 ['Kulaklıkta ses rahatsız edici derecede yüksek. Ne yapılmalıdır?','Ses düzeyi azaltılıp güvenli dinleme gözetilmelidir.','Daha da açılmalıdır.','Rahatsızlık görmezden gelinmelidir.','İşitme sağlığı her müzik türünde korunmalıdır.']
],gap:['Belirli dönemde geniş dinleyici çevresine ulaşan müzik için kullanılan sözcüğü tamamla: ... müzik.','popüler','Popüler müzik geniş dinleyiciye ulaşmayla ilişkilidir.'],statement:['Popüler bir eseri herkesin beğenmesi zorunludur.',false,'Beğeni kişisel olabilir.'],activity:activity('Tercih ve gözlem',['Öğretmenin seçtiği yaşa uygun iki kısa örneği dinle.','Ritim ve ses kaynakları hakkında iki gözlem yaz.','Kendi beğenini ayrı bir cümlede ifade et.'],'Bir gözlemi kişisel beğeniden ayıran nedir?')});

// Additional subject seeds are inserted above this factory. Repeated curriculum
// headings intentionally share authored concepts, not claims of new problems.
// A visible word bank prevents equivalent everyday words (e.g. şifre/parola,
// porte/dizek) from becoming spelling traps in exact-answer short questions.
const fillWordBanks: Record<string, string[]> = {
 tevhit: ['kıyam', 'tevhit', 'mihrap'],
 'oturuşta': ['oturuşta', 'rükûda', 'kıyamda'],
 kaydetme: ['yazdırma', 'silme', 'kaydetme'],
 'geri bildirim': ['geri bildirim', 'kopyalama', 'biçimlendirme'],
 'kelime işlemci': ['sunum programı', 'kelime işlemci', 'işletim sistemi'],
 'anahtar kelimeler': ['dosya adları', 'kişisel bilgiler', 'anahtar kelimeler'],
 parola: ['klasör', 'parola', 'slayt'],
 gizlilik: ['gizlilik', 'döngü', 'tonlama'],
 test: ['girdi', 'kayıt', 'test'],
 vurgu: ['espas', 'vurgu', 'doku'],
 repertuvar: ['ritim', 'repertuvar', 'tempo'],
 dizek: ['dizek', 'tempo', 'ritim'],
};
function makeLessons(seed: Seed): LessonContent[] {
 return seed.ids.map(topicId => {
  const questions: LessonQuestion[] = seed.checks.map(([prompt, answer, wrong1, wrong2, explanation], index) => {
   const choices = [answer, wrong1, wrong2];
   const shift = index % choices.length;
   return { id: `gp-${topicId}-${index + 1}`, prompt, answer, choices: [...choices.slice(shift), ...choices.slice(0, shift)],
    kind: 'choice', difficulty: index === 0 ? 1 : index === 3 ? 4 : 2, explanation,
    hints: ['Önce kavramın anlamını, sonra sorudaki örneği düşün.'] };
  });
  const bank = fillWordBanks[seed.gap[1]];
  questions.push({id:`gp-${topicId}-5`,kind:'fill',prompt:seed.gap[0]+(bank?` Kavram havuzu: ${bank.join(' / ')}.`:''),answer:seed.gap[1],difficulty:2,explanation:seed.gap[2],hints:['Konu anlatımındaki anahtar kavramları gözden geçir.']});
  questions.push({id:`gp-${topicId}-6`,kind:'boolean',prompt:seed.statement[0],answer:seed.statement[1]?'Doğru':'Yanlış',choices:['Doğru','Yanlış'],difficulty:3,explanation:seed.statement[2],hints:['İfadenin her durumda geçerli olup olmadığını düşün.']});
  return {topicId,introduction:seed.teaching[0],sections:[{title:'Kavramları anlayalım',body:[seed.teaching[1]]},{title:'Örneklerle düşünelim',body:[seed.teaching[2]]}],
   workedExample:{prompt:seed.example[0],steps:[seed.example[1],seed.example[2]],answer:seed.example[3]},activity:seed.activity,questions};
 });
}
export const practicalLessons: LessonContent[] = seeds.flatMap(makeLessons);
