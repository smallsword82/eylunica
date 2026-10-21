import type { LessonContent, LessonQuestion } from '../content-types';

type Exercise = Omit<LessonQuestion, 'id'>;
const fill = (prompt: string, answer: string, explanation: string, difficulty: 1|2|3|4 = 2, hint = 'Verilenleri belirle; işlemini bir kez de tersinden kontrol et.'): Exercise => ({ kind: 'fill', prompt, answer, explanation, difficulty, hints: [hint] });
const choice = (prompt: string, choices: string[], answer: string, explanation: string, difficulty: 1|2|3|4 = 1, hint = 'Her seçeneği sorudaki koşulla karşılaştır.'): Exercise => ({ kind: 'choice', prompt, choices, answer, explanation, difficulty, hints: [hint] });
const truth = (prompt: string, correct: boolean, explanation: string, difficulty: 1|2|3|4 = 1): Exercise => ({ kind: 'boolean', prompt, choices: ['Doğru', 'Yanlış'], answer: correct ? 'Doğru' : 'Yanlış', explanation, difficulty, hints: ['Bir örnek veya karşı örnek bul.'] });
const section = (title: string, ...body: string[]) => ({ title, body });
function lesson(topicId: string, introduction: string, sections: LessonContent['sections'], workedExample: LessonContent['workedExample'], exercises: Exercise[], activity?: LessonContent['activity']): LessonContent {
 return { topicId, introduction, sections, workedExample, activity, questions: exercises.map((question, i) => ({ ...question, id: `gm-${topicId}-${i + 1}` })) };
}

export const mathLessons: LessonContent[] = [
 lesson('topic-4add1fe377559e12', 'Geometrik çizim, yalnız şekle benzetmek değil, araç kullanarak verilen koşulları sağlamaktır. Nokta, doğru, doğru parçası ve ışını ayırt ederek güvenilir çizimler yapabiliriz.', [
  section('Nokta, doğru parçası ve ışın', 'Nokta bir konumu gösterir; A, B gibi büyük harflerle adlandırılır. Doğru iki yönde sınırsız uzanır. Doğru parçasının iki ucu, ışının ise bir başlangıç noktası vardır.', 'Cetvel, iki nokta arasındaki doğru parçasını çizmeye ve uygun ölçeğiyle uzunluk ölçmeye yarar. Çizgi kalınlığı gerçek geometrik doğrunun bir özelliği değildir.'),
  section('Araçla koşul kurmak', 'Pergelde merkez sabit kalırken açıklık korunursa merkeze aynı uzaklıktaki noktalar çizilir. Çember çizerken pergelin açıklığı yarıçaptır.', 'Birbirini dik kesen doğruların oluşturduğu açılar 90° olur. Düzlemde birbirinden farklı paralel doğrular uzatılsa da kesişmez. Çizimin görünüşü yerine ölçü veya araçla kurulan koşulunu kontrol et.'),
 ], { prompt: 'Cetvelle 6 cm uzunluğunda AB doğru parçası nasıl çizilir?', steps: ['Cetvelin 0 işareti hizasında A noktasını belirle.', 'Aynı kenar üzerinde 6 cm işareti hizasına B noktasını koy.', 'A ve B noktalarını cetvelin düz kenarı boyunca birleştir; iki uç arasını yeniden ölç.'], answer: 'AB doğru parçası 6 cm uzunluğundadır.' }, [
  choice('İki uç noktası olan geometrik şekil hangisidir?', ['Doğru', 'Işın', 'Doğru parçası', 'Düzlem'], 'Doğru parçası', 'Doğru parçası iki uç noktası arasında sınırlıdır.'),
  truth('Bir ışın, başlangıç noktasından bir yönde sınırsız uzanır.', true, 'Işının bir başlangıcı vardır; gösterilen yönde sonu yoktur.'),
  choice('Çember çizmek için en uygun araç hangisidir?', ['Pergel', 'Terazi', 'İletki', 'Kronometre'], 'Pergel', 'Pergelin sabit açıklığı merkezden eşit uzaklıkları korur.'),
  fill('Cetvelde bir nokta 2 cm, diğeri 9 cm işaretindedir. Aralarındaki uzunluk kaç cm?', '7', '9 − 2 = 7 cm. Ölçmeye her zaman sıfırdan başlanmasa da fark alınır.'),
  fill('Bir çember çizilirken pergelin açıklığı 4 cm tutuluyor. Yarıçap kaç cm?', '4', 'Merkezdeki iğne ile çizim ucu arasındaki 4 cm uzaklık yarıçaptır.'),
  truth('Bir doğru cetvel üzerinde çizilen kısa çizgi kadar uzunluktadır.', false, 'Çizim doğrunun yalnız bir bölümünü gösterir; doğru iki yönde sınırsızdır.'),
  choice('Dik kesişen iki doğrunun oluşturduğu açılardan biri kaç derecedir?', ['30', '45', '90', '180'], '90', 'Diklik, kesişimde 90° açı oluşmasıdır.'),
  fill('Aynı doğru üzerinde AB = 3 cm, BC = 5 cm ve B, A ile C arasındadır. AC kaç cm?', '8', 'B arada olduğundan AC = AB + BC = 3 + 5 = 8 cm.', 3),
  fill('AB = 10 cm doğru parçasının orta noktası M ise AM kaç cm?', '5', 'Orta nokta parçayı eşit iki parçaya böler: 10 ÷ 2 = 5 cm.', 2),
  choice('Birbirinden farklı paralel iki doğru için doğru ifade hangisidir?', ['Mutlaka bir noktada kesişir.', 'Aynı düzlemde kesişmez.', 'Daima diktir.', 'Uzunlukları 5 cm olmalıdır.'], 'Aynı düzlemde kesişmez.', 'Paralellik düzlemde doğruların uzatılsa bile kesişmemesidir.', 3),
 ], { title: 'Çiz ve denetle', instructions: ['Cetvelle 5 cm ve 8 cm uzunluğunda iki doğru parçası çiz.', 'Bir kareli kâğıtta paralel ve dik iki doğru örneği çiz.', 'Her çizimin koşulunu hangi araçla kontrol ettiğini söyle.'], reflection: 'Çizimin doğru göründüğü için mi, ölçümle koşulu sağladığı için mi güveniyorsun?' }),

 lesson('topic-a0155915387c7658', 'Açı, aynı başlangıç noktasından çıkan iki ışının arasındaki açıklıktır. Kolların çizimde uzun veya kısa olması açının ölçüsünü değiştirmez; önemli olan açıklıktır.', [
  section('Açıyı tanıma', 'Açının ortak başlangıç noktasına köşe denir. Ölçü birimi derecedir ve ° ile gösterilir. 0° ile 90° arasındaki açı dar, 90° açı dik, 90° ile 180° arasındaki açı geniş açıdır.', 'Doğru açı 180°, tam açı 360° ölçüsündedir. Bir köşeyi çevreleyen bitişik açıların toplamı bir tam açı olur.'),
  section('İletkiyi yerleştirme', 'İletkinin merkezini açının köşesine koy. Sıfır çizgisini kollardan biriyle hizala. O koldaki 0° ile başlayan ölçeği izleyip diğer kolun geçtiği değeri oku.', 'Kesişen iki doğrunun karşılıklı, yani ters açıları eşittir. Bir doğru üzerinde yan yana bulunan komşu açıların toplamı 180° olur; bu bilgi ölçümü denetlemeyi sağlar.'),
 ], { prompt: 'Bir doğru üzerindeki komşu açılardan biri 65° ise diğeri kaç derecedir?', steps: ['Bir doğru açının ölçüsü 180° olur.', 'İki komşu açının toplamını 180° olarak düşün.', 'Bilinmeyen açıyı 180 − 65 işlemiyle bul.'], answer: 'Diğer açı 115° olur; 65 + 115 = 180.' }, [
  choice('42° ölçüsündeki açı hangi türdedir?', ['Dar açı', 'Dik açı', 'Geniş açı', 'Doğru açı'], 'Dar açı', '42°, 0° ile 90° arasındadır.'),
  fill('Bir dik açı kaç derecedir?', '90', 'Dik açının ölçüsü 90° olarak tanımlanır.', 1),
  truth('Açının kollarını uzatmak, açının ölçüsünü büyütür.', false, 'Kolların uzunluğu değişse de aralarındaki açıklık aynı kalır.'),
  choice('128° açının türü nedir?', ['Dar açı', 'Dik açı', 'Geniş açı', 'Tam açı'], 'Geniş açı', '128°, 90° ile 180° arasındadır.'),
  fill('Bir doğru üzerindeki iki komşu açının biri 48° ise diğeri kaç derecedir?', '132', 'Doğru açı 180°: 180 − 48 = 132°.'),
  fill('Bir dik açı 35° ve başka bir açı olarak ayrılıyor. Diğer açı kaç derece?', '55', 'Dik açı 90° olduğundan bilinen 35° çıkarılır: 90 − 35 = 55°.'),
  truth('İletkiyle ölçerken başlangıç kolunun hizalandığı sıfırdan okumaya başlanır.', true, 'İletkide iki yönlü ölçek vardır; doğru sıfırı seçmek gerekir.'),
  fill('Kesişen iki doğrunun oluşturduğu açılardan biri 72° ise karşısındaki ters açı kaç derece?', '72', 'Ters açılar eşittir; karşıdaki açı da 72° olur.', 3),
  fill('Bir nokta çevresindeki üç bitişik açı 90°, 120° ve x° ise x kaçtır?', '150', 'Tam açı 360°: x = 360 − 90 − 120 = 150°.', 3),
  fill('Bir doğru açı üç eşit açıya bölünüyor. Her biri kaç derece?', '60', '180 ÷ 3 = 60°. Üç açının toplamı yeniden 180° eder.', 4),
 ]),

 lesson('topic-c89c9fdbb63ce0ad', 'Çokgenler doğru parçalarıyla kapanan şekillerdir; çember ise bir merkeze eşit uzaklıktaki noktaların oluşturduğu eğridir. Kenar, köşe, merkez ve yarıçapı ayırt etmek şekilleri doğru sınıflandırmamızı sağlar.', [
  section('Çokgenlerin özellikleri', 'En az üç doğru parçası uç uca birleşerek kapalı bir sınır oluşturursa çokgen elde edilir. Üçgenin 3, dörtgenin 4, beşgenin 5 kenarı ve aynı sayıda köşesi vardır.', 'Çemberin düz kenarı ve köşesi yoktur; bu nedenle çokgen değildir. Açık bir kırık çizgi de kapalı olmadığı için çokgen değildir.'),
  section('Çemberden üçgen kurma', 'Bir çemberin merkeziyle üzerindeki herhangi bir nokta arasındaki uzaklık yarıçaptır. Merkezden geçen ve çemberde iki ucu olan doğru parçası çaptır; çap yarıçapın iki katıdır.', 'İki çemberin merkezleri A ve B, ortak noktalarından biri C olsun. AC ve BC, ilgili çemberlerin yarıçaplarıdır. Yarıçaplar eşitse AC = BC olur ve ABC üçgeni ikizkenardır. Her iki yarıçap AB uzunluğuna da eşitse eşkenar üçgen oluşur.'),
 ], { prompt: 'Merkezleri A ve B olan iki çemberin yarıçapları 4 cm; ortak noktalarından biri C. ABC üçgeninde hangi iki kenar kesin eşittir?', steps: ['C, A merkezli çember üzerindedir; AC = 4 cm.', 'C, B merkezli çember üzerindedir; BC = 4 cm.', 'AC ve BC eşit olduğundan üçgen ikizkenardır; AB uzunluğu ayrıca verilmemiştir.'], answer: 'AC = BC = 4 cm. AB için ek bilgi gerekir.' }, [
  choice('Hangisi çokgen değildir?', ['Üçgen', 'Dörtgen', 'Çember', 'Altıgen'], 'Çember', 'Çember eğri bir sınırdır; doğru parçalarından oluşmaz.'),
  fill('Bir beşgenin kaç köşesi vardır?', '5', 'Çokgende kenar ve köşe sayısı aynıdır.', 1),
  truth('Üç doğru parçasından oluşan her çizim mutlaka üçgendir.', false, 'Parçalar kapalı bir şekil oluşturmalıdır; açık veya aynı doğrultudaki parçalar yeterli değildir.'),
  fill('Yarıçapı 7 cm olan çemberin çapı kaç cm?', '14', 'Çap iki yarıçap uzunluğundadır: 2 × 7 = 14 cm.'),
  fill('Çapı 18 cm olan çemberin yarıçapı kaç cm?', '9', 'Yarıçap, çapın yarısıdır: 18 ÷ 2 = 9 cm.'),
  choice('Bir sekizgenin kaç kenarı vardır?', ['6', '7', '8', '9'], '8', 'Sekizgen, sekiz kenarlı çokgendir.'),
  truth('Aynı çemberin bütün yarıçapları eşit uzunluktadır.', true, 'Çember üzerindeki bütün noktalar merkeze aynı uzaklıktadır.'),
  fill('Eşit yarıçaplı iki çemberin merkezlerinden ortak C noktasına çizilen AC ve BC uzunlukları eşittir. AC = 6 cm ise BC kaç cm?', '6', 'Her iki parça eşit yarıçapı temsil eder.', 2),
  choice('Üç kenarı eşit uzunlukta olan üçgen hangisidir?', ['Eşkenar üçgen', 'Çeşitkenar üçgen', 'Her dörtgen', 'Her dik üçgen'], 'Eşkenar üçgen', 'Eşkenar üçgende üç kenar birbirine eşittir.'),
  fill('Kenarları 5 cm olan bir eşkenar üçgenin çevresi kaç cm?', '15', 'Üç kenar toplanır: 5 + 5 + 5 = 15 cm.', 3),
 ]),

 lesson('topic-a219ce03fcdfdad6', 'Büyük sayıları okurken rakamları tek tek söylemeyiz. Sağdan üçerli bölüklere ayırır; her bölüğü okuyup bin, milyon veya milyar adını ekleriz. Sıfırlar sayının yerini korur.', [
  section('Üçerli bölükler', 'Sağdan başlayarak birler, binler, milyonlar ve milyarlar bölükleri vardır. Her bölük yüzler-onlar-birler düzeniyle okunur.', '12 304 005 sayısı “on iki milyon üç yüz dört bin beş” diye okunur. Tamamı sıfır olan bölük okunmaz ama yazılırken üç sıfırla korunur.'),
  section('Okumayı yazıyla denetleme', 'Yazıyla verilen sayıyı önce bölüklere ayır. “Sekiz milyon yirmi üç bin kırk” ifadesinde bölükler 8 | 023 | 040 olur; sayı 8 023 040 yazılır.', 'Basamak sayısı ile rakamın değeri farklıdır. Baştaki sıfırlar doğal sayının basamak sayısını artırmaz; sayının içindeki ve sonundaki sıfırlar ise konumu korur.'),
 ], { prompt: '“Üç yüz altı milyon kırk iki bin yedi” sayısını rakamlarla yaz.', steps: ['Milyonlar bölüğü: 306.', 'Binler bölüğü: 042; üç haneli yazmak gerekir.', 'Birler bölüğü: 007. Bölükleri sırayla birleştir.'], answer: '306 042 007' }, [
  fill('“İki milyon beş bin sekiz” sayısını yalnız rakamlarla yaz.', '2005008', 'Bölükler 2 | 005 | 008 olur.'),
  choice('4 020 006 sayısı nasıl okunur?', ['Dört milyon yirmi bin altı', 'Dört milyon iki yüz bin altı', 'Dört bin yirmi altı', 'Kırk milyon iki bin altı'], 'Dört milyon yirmi bin altı', 'Bölükler 4 | 020 | 006 biçimindedir.'),
  fill('38 241 605 sayısının milyonlar bölüğündeki sayı kaçtır?', '38', 'Sağdan üçerli ayırınca 38 | 241 | 605 görülür.'),
  fill('6 708 012 sayısının binler bölüğündeki sayı kaçtır?', '708', 'Bölükler 6 | 708 | 012 olarak ayrılır.'),
  truth('On milyon sayısı 10 000 000 biçiminde yazılır.', true, '1’in sağında yedi sıfır bulunur.'),
  fill('“Dokuz yüz bin üç” sayısını yalnız rakamlarla yaz.', '900003', '900 bin + 3 = 900 003.'),
  fill('70 508 200 sayısı kaç basamaklıdır?', '8', '70 milyonluk sayı sekiz rakamla yazılır.', 1),
  choice('“Bir milyar iki milyon” sayısı hangisidir?', ['1 002 000 000', '1 200 000 000', '12 000 000', '1 000 002'], '1 002 000 000', 'Bölükler 1 | 002 | 000 | 000 olur.', 3),
  truth('5 000 031 sayısında binler bölüğü okunurken “sıfır bin” denir.', false, 'Tamamı sıfır olan bölük okunmaz: beş milyon otuz bir.'),
  fill('En büyük altı basamaklı doğal sayıdan 1 fazla olan sayı kaçtır? Yalnız rakamlarla yaz.', '1000000', '999 999 + 1 = 1 000 000; bir milyon yedi basamaklıdır.', 3),
 ]),

 lesson('topic-625a6bc82cb2ce2e', 'Bir rakam aynı kalsa bile yeri değişince değeri değişir. Çözümleme, sayıyı rakamların basamak değerlerinin toplamı olarak yazmaktır; bu yöntem büyük sayıları karşılaştırmayı ve işlemleri denetlemeyi kolaylaştırır.', [
  section('Rakamın değeri ve basamak değeri', '4 rakamının sayı değeri her yerde 4’tür. 4 000 içindeki basamak değeri 4 000, 40 içindeki basamak değeri 40 olur.', 'Sağa doğru her basamakta basamak birimi onda bire iner; sola doğru on katına çıkar. Birler, onlar, yüzler, binler, on binler ve yüz binler diye ilerler.'),
  section('Çözümleme ve sıfırın görevi', '305 042 = 300 000 + 5 000 + 40 + 2 olarak çözümlenir. Sıfır bulunan basamakların toplam katkısı sıfırdır; bunları yazmasak da sayıyı oluştururken yerlerini koruruz.', 'Çözümleme toplamını yeniden birleştirerek sonucu kontrol et. 7 milyon + 20 bin + 6 ifadesi 7 020 006 eder; boş basamakları atlamak başka bir sayı oluşturur.'),
 ], { prompt: '8 306 205 sayısındaki 3 ve 2 rakamlarının basamak değerlerini bul.', steps: ['Sağdan bölükleri ayır: 8 | 306 | 205.', '3, yüz binler basamağındadır: 3 × 100 000.', '2, yüzler basamağındadır: 2 × 100.'], answer: '3’ün basamak değeri 300 000; 2’nin basamak değeri 200’dür.' }, [
  fill('624 508 sayısında 2 rakamının basamak değeri kaçtır?', '20000', '2 on binler basamağındadır: 2 × 10 000.'),
  fill('3 706 214 sayısında 7 rakamının basamak değeri kaçtır?', '700000', '7 yüz binler basamağındadır.'),
  choice('900 000 + 4 000 + 60 + 5 toplamıyla hangi sayı çözümlenmiştir?', ['904 065', '940 065', '904 605', '900 465'], '904 065', 'Yüz binler 9, binler 4, onlar 6, birler 5; diğer basamaklar sıfırdır.'),
  truth('52 731 sayısındaki 7 rakamının sayı değeri 700’dür.', false, 'Sayı değeri 7; yüzler basamağındaki basamak değeri 700’dür.'),
  fill('8 888 sayısında en soldaki 8’in basamak değeri, en sağdaki 8’in değerinin kaç katıdır?', '1000', '8 000 ÷ 8 = 1 000; arada üç basamak vardır.', 3),
  fill('4 050 006 sayısında on binler basamağındaki rakam kaçtır?', '5', 'Bölükler 4 | 050 | 006: 5 on binler basamağındadır.'),
  truth('206 009 sayısının çözümlemesinde 6 000 bulunur.', true, '6, binler basamağındadır: 200 000 + 6 000 + 9.'),
  fill('3 000 000 + 80 000 + 400 + 2 toplamının oluşturduğu sayıyı rakamlarla yaz.', '3080402', 'Bölükleri 3 | 080 | 402 olarak birleştir.'),
  fill('1 111 sayısında yüzler basamağındaki 1’in basamak değeri kaçtır?', '100', 'Yüzler basamağının birimi 100’dür.', 1),
  fill('700 070 sayısındaki iki 7’nin basamak değerlerinin farkı kaçtır?', '699930', '700 000 − 70 = 699 930.', 4),
 ]),

 lesson('topic-05bf7580a6ccbb59', 'Problem çözmede önce sorulanı ve verilenleri belirleriz. Toplama birleştirmeyi, çıkarma kalan veya farkı, çarpma eşit grupları, bölme eşit paylaştırma ya da grup sayısını bulmayı modelleyebilir.', [
  section('İşlemden önce anlam', 'Bir soruda “fazla” sözcüğünü görmek her zaman toplama yapılacağı anlamına gelmez. Örneğin büyük miktar biliniyor, küçük miktar soruluyorsa farkı çıkarmak gerekir.', 'Çözüm planını küçük adımlara ayır; her ara sonucun ne anlama geldiğini birimiyle yaz. Gereksiz bilgileri işleme katma.'),
  section('Sonucu denetleme', 'Toplamayı çıkarma, çarpmayı bölme ile denetleyebilirsin. Bölmede bölen × bölüm + kalan = bölünen olmalı; kalan bölenden küçük olmalıdır.', 'Kalanın yorumu duruma bağlıdır: 73 kişiyi 20 kişilik araçlara yerleştirmek için 4 araç gerekir, çünkü kalan kişiler de bir araca ihtiyaç duyar. Tahmin ederek sonucun büyüklüğünün makul olup olmadığını da incele.'),
 ], { prompt: 'Bir okul 24’er kalem içeren 8 kutu alıyor; 57 kalem dağıtılıyor. Kaç kalem kalır?', steps: ['Önce toplam kalemi bul: 8 × 24 = 192.', 'Dağıtılan 57 kalemi toplamdan çıkar: 192 − 57 = 135.', 'Kontrol: 135 + 57 = 192.'], answer: '135 kalem kalır.' }, [
  fill('Bir kütüphanede 348 kitap vardı; 175 kitap daha geldi. Toplam kaç kitap olur?', '523', '348 + 175 = 523 kitap.', 1),
  fill('Bir mağaza 920 defterin 386’sını sattı. Kaç defter kaldı?', '534', '920 − 386 = 534 defter.'),
  fill('Her birinde 18 yumurta olan 7 kutuda toplam kaç yumurta vardır?', '126', 'Eşit gruplar çarpılır: 7 × 18 = 126.'),
  fill('216 kart 9 öğrenciye eşit paylaştırılıyor. Bir öğrenci kaç kart alır?', '24', 'Eşit paylaşım için toplamı kişi sayısına böl: 216 ÷ 9 = 24 kart.'),
  fill('Bir sinemada 12 sıra ve her sırada 16 koltuk var. 145 kişi oturursa kaç boş koltuk kalır?', '47', 'Toplam 12 × 16 = 192; boş koltuk 192 − 145 = 47.', 3),
  choice('73 öğrenci, en çok 20 öğrenci alan araçlarla taşınacak. En az kaç araç gerekir?', ['3', '4', '5', '20'], '4', 'Üç araç 60 kişi alır; kalan 13 kişi için dördüncü araç gerekir.', 3),
  truth('95 ÷ 8 işleminde bölüm 11, kalan 7 olabilir.', true, '8 × 11 + 7 = 95; ayrıca 7 < 8.'),
  fill('Bir kalem 14 TL, bir defter 26 TL. 3 kalem ve 2 defter toplam kaç TL?', '94', '3 × 14 + 2 × 26 = 42 + 52 = 94 TL.', 3),
  fill('Ece’nin 240 TL’si, Ali’den 65 TL fazladır. Ali’nin kaç TL’si vardır?', '175', 'Küçük miktar soruluyor: 240 − 65 = 175 TL.'),
  fill('Beş arkadaş 480 TL tutan alışverişi eşit ödüyor. Her biri 100 TL verirse her birine kaç TL para üstü düşer?', '4', 'Kişi başı ödeme 480 ÷ 5 = 96 TL; para üstü 100 − 96 = 4 TL.', 4),
 ]),

 lesson('topic-9087112a70441c7a', 'Çevre, bir şeklin etrafındaki sınırın uzunluğudur; alan, kapladığı yüzeyin ölçüsüdür. Aynı çevreye sahip dikdörtgenlerin alanları farklı olabilir, bu yüzden iki ölçüyü birbirine karıştırmayız.', [
  section('Çevreyi bulma', 'Dikdörtgende karşılıklı kenarlar eşittir. Uzun kenara a, kısa kenara b dersek çevre a + b + a + b = 2 × (a + b) olur.', 'Çevre ve bir kenar verilince önce çevreyi ikiye bölerek iki komşu kenarın toplamını bul. Bilinen kenarı çıkarınca öteki kenar elde edilir.'),
  section('Alan ve birimler', 'Birim kareleri satır ve sütun sayısıyla sayabiliriz: alan = a × b. Kenarlar cm ise çevre cm, alan cm² ile ifade edilir.', 'Alanı 24 cm² olan doğal sayı kenarlı dikdörtgenler 1 × 24, 2 × 12, 3 × 8, 4 × 6 olabilir. Bunların çevreleri aynı değildir. Sonucun hangi büyüklüğü ölçtüğünü mutlaka belirt.'),
 ], { prompt: 'Çevresi 30 cm olan dikdörtgenin bir kenarı 9 cm. Diğer kenarı ve alanı kaçtır?', steps: ['İki komşu kenarın toplamı 30 ÷ 2 = 15 cm.', 'Diğer kenar 15 − 9 = 6 cm.', 'Alan 9 × 6 = 54 cm²; kontrol için çevre 2 × (9 + 6) = 30 cm.'], answer: 'Diğer kenar 6 cm, alan 54 cm².' }, [
  fill('Kenarları 8 cm ve 3 cm olan dikdörtgenin çevresi kaç cm?', '22', 'Karşılıklı kenarlar eşittir; 8 + 3 + 8 + 3 = 2 × (8 + 3) = 22 cm.'),
  fill('Kenarları 7 m ve 4 m olan dikdörtgenin alanı kaç m²?', '28', 'Yüzey 7 sıra ve her sırada 4 birim kare içerir: 7 × 4 = 28 m².'),
  choice('Bir odanın tabanını kaplayan yüzey hangi büyüklükle ölçülür?', ['Alan', 'Çevre', 'Kütle', 'Açı'], 'Alan', 'Tabanın kapladığı yüzey, alanı ifade eder.'),
  truth('Çevresi aynı olan her dikdörtgenin alanı da aynıdır.', false, '2 × 8 ve 4 × 6 dikdörtgenlerinin çevresi 20, alanları 16 ve 24’tür.'),
  fill('Çevresi 40 cm olan dikdörtgenin bir kenarı 12 cm. Diğer kenar kaç cm?', '8', 'Komşu iki kenarın toplamı 40 ÷ 2 = 20 cm; diğer kenar 20 − 12 = 8 cm.'),
  fill('Alanı 48 cm² olan dikdörtgenin bir kenarı 6 cm. Diğer kenar kaç cm?', '8', 'Alan iki kenarın çarpımıdır. Bilinmeyen kenar 48 ÷ 6 = 8 cm olur.'),
  fill('Kenarları 5 cm ve 9 cm olan dikdörtgenin kısa kenarı 2 cm artıyor. Yeni alan kaç cm²?', '63', 'Kısa kenar 7 cm olur: 7 × 9 = 63 cm².', 3),
  fill('Uzunluğu 11 m ve genişliği 7 m olan bahçenin etrafına 2 m genişliğinde kapı bırakılarak çit çekiliyor. Kaç m çit gerekir?', '34', 'Çevre 2 × (11 + 7) = 36 m; kapı çıkarılır: 36 − 2 = 34 m.', 3),
  choice('Alanı 36 cm² olan aşağıdaki dikdörtgenlerden hangisinin çevresi en küçüktür?', ['1 cm × 36 cm', '2 cm × 18 cm', '3 cm × 12 cm', '6 cm × 6 cm'], '6 cm × 6 cm', 'Çevreler sırasıyla 74, 40, 30 ve 24 cm’dir.', 4),
  fill('Kenarları 6 cm ve 10 cm olan iki eş dikdörtgen, 10 cm’lik kenarları boyunca boşluksuz birleştiriliyor. Yeni dikdörtgenin çevresi kaç cm?', '44', 'Yeni kenarlar 12 cm ve 10 cm olur; çevre 2 × (12 + 10) = 44 cm.', 4),
 ]),

 lesson('topic-6a97ba45a911803c', 'Bir kesir, eş parçalara ayrılan bir bütünün kaç parçasını aldığımızı gösterebilir. Aynı miktarı şekil, sayı doğrusu, kesir, ondalık gösterim veya yüzdeyle anlatabiliriz; gösterim değişse de miktar korunur.', [
  section('Pay ve payda', 'Payda bütünün kaç eş parçaya bölündüğünü, pay bu parçalardan kaçının alındığını gösterir. Eş olmayan parçalarda yalnız parça saymak doğru kesri vermez.', '3/4, aynı büyüklükte dört parçanın üçünü anlatır. Sayı doğrusunda 0 ile 1 arası dört eş aralığa ayrılır; üçüncü işaret 3/4 olur.'),
  section('Denk gösterimler', 'Pay ve paydayı aynı pozitif sayıyla çarpmak veya ortak bölenle bölmek kesrin değerini değiştirmez. 1/2 = 2/4 = 50/100 olur.', 'Paydası 10 veya 100 olan kesirleri ondalık gösterime çevirebiliriz: 7/10 = 0,7; 25/100 = 0,25. Yüzde, yüz eş parçadan kaçını aldığımızı belirtir: 25/100 = %25.'),
 ], { prompt: 'Bir çikolatanın 8 eş parçasından 6’sı yeniyor. Yenilen miktarı iki farklı kesirle ve yüzdeyle göster.', steps: ['Yenilen miktar 6/8 olur.', 'Pay ve paydayı 2’ye böl: 6/8 = 3/4.', 'Paydayı 100 yap: 3/4 = 75/100; bu da %75’tir.'], answer: '6/8 = 3/4 = %75.' }, [
  choice('5/8 kesrinde bütünün kaç eş parçaya bölündüğünü hangi sayı gösterir?', ['3', '5', '8', '13'], '8', 'Payda 8’dir; bütündeki eş parça sayısını gösterir.'),
  fill('12 eş dilimli bir pastanın 5 dilimi yenmiştir. Yenilen kısmı a/b biçiminde yaz.', '5/12', 'Alınan parça 5, eş parçaların toplamı 12’dir.'),
  fill('1/2 = ?/10 eşitliğinde soru işareti yerine kaç gelir?', '5', 'Payda 2’den 10’a beş katına çıkmış; pay da 1 × 5 = 5 olur.'),
  fill('0,7 sayısını paydası 10 olan bir kesirle yaz.', '7/10', 'Virgülden sonraki ilk basamak onda birlerdir.'),
  choice('25/100 kesrinin yüzde gösterimi hangisidir?', ['%2,5', '%25', '%50', '%75'], '%25', 'Yüz parçanın 25’i, yüzde 25 demektir.'),
  truth('2/3 ve 4/6 aynı miktarı gösterir.', true, '2/3 kesrinin payı ve paydası 2 ile çarpılırsa 4/6 elde edilir.'),
  fill('Bir bütünün dört eş parçasından üçü boyalıdır. Boyalı kısmı yüzde işareti kullanarak yaz.', '%75', 'Payı ve paydayı 25 ile çarp: 3/4 = 75/100. Yüz parçanın 75’i, %75 demektir.', 3),
  fill('0 ile 1 arası 5 eş aralığa bölünmüş sayı doğrusunda sıfırdan sonraki ikinci işaret hangi kesirdir? a/b biçiminde yaz.', '2/5', 'Her aralık 1/5; iki aralık 2/5 olur.'),
  fill('3/5 = ?/100 eşitliğinde soru işareti yerine kaç gelir?', '60', 'Payda 20 ile çarpılır; pay da 3 × 20 = 60 olur.', 3),
  truth('Bir bütünün farklı büyüklükteki dört parçasından biri her zaman 1/4’tür.', false, 'Kesir modelinde parçaların eş büyüklükte olması gerekir.', 3),
 ]),

 lesson('topic-3f4d4b2a3773ed11', 'Kesirleri karşılaştırırken aynı büyüklükteki bütünleri düşünürüz. Payda, parçanın büyüklüğünü; pay, alınan parça sayısını etkiler. Yalnız rakamlardan birine bakarak karar vermek yanıltabilir.', [
  section('Ortak pay veya ortak payda', 'Paydalar eşitse parçaların büyüklüğü aynıdır; payı büyük olan kesir büyüktür. 5/8 > 3/8 olur.', 'Paylar eşitse bütün daha az parçaya bölündüğünde her parça daha büyüktür: 2/3 > 2/7. Bu kural aynı bütün için geçerlidir.'),
  section('Denk kesir ve referans kullanma', 'Paydaları farklı kesirleri denk kesirlere çevirerek karşılaştırabiliriz. 2/3 ile 3/4 için 8/12 ve 9/12 yazılır; 2/3 < 3/4 olur.', '0, 1/2 ve 1 gibi referansları kullanmak bazen daha kısadır. 3/8 yarımdan küçük, 5/8 yarımdan büyük olduğundan 3/8 < 5/8. Farklı büyüklükteki iki pastanın kesirleri aynı olsa bile yenilen gerçek miktar eşit olmak zorunda değildir.'),
 ], { prompt: '3/5 ile 7/10 kesirlerini karşılaştır.', steps: ['3/5 kesrini paydayı 10 yaparak yaz: 3/5 = 6/10.', '6/10 ile 7/10’da parça büyüklüğü aynı olur.', '6 < 7 olduğundan 6/10 < 7/10.'], answer: '3/5 < 7/10.' }, [
  choice('3/7 ile 5/7 kesirlerinden hangisi daha büyüktür?', ['3/7', '5/7'], '5/7', 'Paydalar eşit; 5 parça 3 parçadan fazladır.'),
  choice('2/5 ile 2/9 kesirlerinden hangisi daha büyüktür?', ['2/5', '2/9'], '2/5', 'Paylar eşit; beşte birlik parçalar dokuzda birliklerden büyüktür.'),
  fill('3/4 ile 5/8 arasına <, > veya = işaretinden uygun olanı yaz.', '>', '3/4 = 6/8; 6/8 > 5/8.'),
  fill('2/3 ile 4/6 arasına <, > veya = işaretinden uygun olanı yaz.', '=', 'Payı ve paydayı 2 ile çarpmak değeri değiştirmez.'),
  truth('Paydası büyük olan kesir her zaman daha büyüktür.', false, 'Örneğin 1/10, 1/2’den küçüktür.'),
  choice('Hangisi 1/2’den büyüktür?', ['2/7', '3/8', '5/8', '1/4'], '5/8', 'Sekizde yarım 4/8’dir; 5/8 bundan büyüktür.'),
  fill('0,6 ile 1/2 arasına <, > veya = işaretinden uygun olanı yaz.', '>', '0,6 = 6/10; 1/2 = 5/10.'),
  choice('Küçükten büyüğe doğru sıralama hangisidir?', ['1/4 < 1/3 < 1/2', '1/2 < 1/3 < 1/4', '1/3 < 1/4 < 1/2', '1/4 < 1/2 < 1/3'], '1/4 < 1/3 < 1/2', 'Birim kesirlerde payda büyüdükçe parça küçülür.', 3),
  fill('7/10 ile 2/3 arasına <, > veya = işaretinden uygun olanı yaz.', '>', 'Paydaları 30 yap: 21/30 > 20/30.', 3),
  truth('Küçük bir pastanın yarısı ile büyük bir pastanın yarısı aynı miktarda pasta olmak zorundadır.', false, 'Kesirler eşittir ama bütünler farklı büyüklükte olduğundan miktarlar farklı olabilir.', 4),
 ]),

 lesson('topic-ff34a0063ebe46c6', 'Kategorik veri, kişileri veya nesneleri türlerine göre gruplar: tercih edilen spor, ulaşım biçimi ya da kitap türü gibi. Araştırma sorusundan tabloya, tablodan karara uzanan bir süreç izleriz.', [
  section('Araştırma sorusu ve veri toplama', '“Sınıfımızda en çok hangi meyve tercih ediliyor?” sorusu kategorik veriyle cevaplanabilir. Sorunun kimler hakkında olduğu ve herkesin kaç tercih yapacağı açıkça belirtilmelidir.', 'Tarafsız sorular sor; aynı kişiyi iki kez sayma. Bir kişi tek tercih yapıyorsa sıklıkların toplamı katılımcı sayısını verir. “Boy uzunluğu kaç santimetre?” ise kategorik değil, sayısal veri toplar.'),
  section('Sıklık tablosu ve gösterim', 'Her kategorideki gözlem sayısına sıklık denir. Sütun grafiğinde kategori adları, sayıları gösteren eksen ve ölçek açık olmalıdır.', 'Tabloyu yorumlarken en sık ve en az görülen kategoriyi, toplamı ve farkları incele. Yalnız sınıfından topladığın verilerle bütün okulun veya ülkenin tercihini kesin söyleyemezsin.'),
 ], { prompt: 'Bir sınıfta meyve tercihleri elma 9, muz 6, armut 5 kişidir. Her öğrenci bir tercih yapmıştır. Kaç öğrenci vardır ve en sık tercih nedir?', steps: ['Toplamı bul: 9 + 6 + 5 = 20.', 'Sıklıkları karşılaştır: 9 en büyük sayıdır.', 'Kararı yalnız araştırmaya katılan sınıf için ifade et.'], answer: '20 öğrenci vardır; sınıfta en sık tercih edilen meyve elmadır.' }, [
  choice('Hangisi kategorik veri toplamaya uygundur?', ['Ayakkabının rengi', 'Boyun santimetre cinsinden ölçüsü', 'Koşu süresi', 'Çantanın kilogram cinsinden kütlesi'], 'Ayakkabının rengi', 'Renkler türlere ayırır; diğerleri sayısal ölçümlerdir.'),
  fill('Tek tercihli bir ankette yürüyüş 8, futbol 11, yüzme 6 kişi seçmiştir. Kaç kişi katılmıştır?', '25', '8 + 11 + 6 = 25 kişi.'),
  choice('Mavi 12, yeşil 7, sarı 9 oylu tek tercihli ankette en sık tercih hangisi?', ['Mavi', 'Yeşil', 'Sarı'], 'Mavi', '12 en yüksek sıklıktır.'),
  fill('Kedi 14, köpek 9, kuş 7 tercih edilmiştir. Kedi ile kuşun sıklıkları arasındaki fark kaçtır?', '7', 'İki kategori arasındaki fark çıkarma ile bulunur: 14 − 7 = 7 kişi.'),
  truth('Tek tercihli ankette aynı kişinin cevabını iki kez saymak sonucu değiştirebilir.', true, 'Aynı kişinin ağırlığı iki katına çıkar; sıklıklar yanlış oluşur.'),
  fill('Bir grafikte her kare 2 kişiyi gösteriyor. 6 karelik sütun kaç kişiyi temsil eder?', '12', 'Her kare 2 kişiyi gösterdiği için 6 kare 6 × 2 = 12 kişidir.'),
  choice('Tarafsız araştırma sorusu hangisidir?', ['Harika olan futbolu sen de sevmiyor musun?', 'En sevdiğin spor dalı hangisidir?', 'Herkes yüzme demeli, değil mi?', 'Basketbolu seçmek zorundasın.'], 'En sevdiğin spor dalı hangisidir?', 'Soruda belirli bir cevaba yönlendirme bulunmaz.', 2),
  fill('24 öğrencili sınıfta 9 kişi otobüsle, 8 kişi yürüyerek, kalanlar servisle geliyor. Servisle gelen kaç kişi var?', '7', 'Otobüs ve yürüyenleri toplamdan çıkar: 24 − 9 − 8 = 7 kişi.', 3),
  truth('Yalnız bir sınıfta yapılan kitap türü anketi, bütün ülkenin en sevdiği türü kesin gösterir.', false, 'Araştırmaya katılan grup bütün ülkeyi temsil etmeyebilir.', 3),
  fill('24 kişilik tek tercihli bir ankette A ve B kategorileri eşit oy, C kategorisi 6 oy aldı. A kategorisi kaç oy almıştır?', '9', 'A ve B toplam 24 − 6 = 18 oy almıştır. Eşit oldukları için her biri 18 ÷ 2 = 9 oy alır.', 4),
 ]),

 lesson('topic-d170313ab769758e', 'Başkalarının sunduğu tablo ve grafiklerde yalnız yüksek sütuna bakmak yetmez. Kimlerden veri toplandığını, soruyu, ölçeği ve sonuç cümlesinin veriyi aşıp aşmadığını denetleriz.', [
  section('Grafiğin anlattığı ve anlatmadığı', 'Başlık araştırmanın konusunu; eksen adları ve ölçek sayıların anlamını açıklar. Eşit aralıkların eşit büyüklükleri göstermesi gerekir. Sıfırdan başlamayan eksen farkları olduğundan büyük gösterebilir.', 'Veri kaynağı, katılımcı grubu ve araştırma zamanı verilmezse sonucu sınırlı yorumla. “En çok tercih” ifadesi “herkesin tercihi” demek değildir.'),
  section('Sonuç cümlesini sınama', 'Önce iddiayı açıkça yaz, sonra tablodaki sayılarla karşılaştır. Bir kategorinin diğerinden kaç kişi fazla olduğunu fark alarak kontrol et.', 'İki ayrı ankette aynı kategori sayısı farklı çıkabilir; katılımcı sayıları ve grupları farklıysa yalnız ham sayılara bakarak bir grubun daha çok sevdiğini söylemek yeterli olmayabilir.'),
 ], { prompt: '20 kişilik ankette roman 9, şiir 6, öykü 5 oy alıyor. “Herkes romanı seçti.” iddiası doğru mu?', steps: ['Herkes sözü 20 kişinin tamamını ifade eder.', 'Romanı seçen kişi sayısı 9’dur; 9, 20’ye eşit değildir.', 'Verinin desteklediği daha dar cümleyi kur.'], answer: 'İddia yanlıştır. Bu ankette en çok roman seçilmiştir; herkes roman seçmemiştir.' }, [
  truth('Bir grafikte en yüksek sütuna sahip kategori, katılımcıların tamamını temsil etmek zorundadır.', false, 'En yüksek sıklık, en çok tercih edileni gösterir; herkesi göstermek zorunda değildir.'),
  fill('Çizim 10, müzik 15, spor 20 kişi seçmiştir. Spor ile çizim arasındaki fark kaç kişidir?', '10', 'Spor sıklığından çizim sıklığını çıkar: 20 − 10 = 10 kişi.'),
  choice('Bir sütun grafiğinde sayıları anlamak için hangisi gerekir?', ['Yalnız sütun rengi', 'Eksen ölçeği', 'Sayfanın kalınlığı', 'Kalemin markası'], 'Eksen ölçeği', 'Sütunun yüksekliği ancak ölçekle sayıya çevrilir.'),
  fill('Sütun yüksekliği 4 aralık; her aralık 5 kişidir. Sıklık kaçtır?', '20', 'Dört aralığın her biri 5 kişi gösterir; sıklık 4 × 5 = 20 kişidir.'),
  choice('30 kişilik tek tercihli ankette çay 12, süt 10, ayran 8 oy aldı. Hangi sonuç desteklenir?', ['Herkes çay seçti.', 'En çok çay seçildi.', 'Ayran hiç seçilmedi.', 'Sütü 20 kişi seçti.'], 'En çok çay seçildi.', '12, 10 ve 8 arasında en yüksek sıklık 12’dir.'),
  truth('Araştırmanın hangi grupta yapıldığını bilmek, sonucun kimler için geçerli olabileceğini yorumlamaya yardım eder.', true, 'Örneklem bilgisi, genellemenin sınırını belirlemeye yardım eder.'),
  fill('Bir tabloda üç sıklık 13, 8 ve 9’dur. “Toplam 28 kişi” cümlesindeki toplam kaç olmalı?', '30', '13 + 8 + 9 = 30; 28 hatalıdır.'),
  choice('Grafik iki kategori için 21 ve 22 kişi gösteriyor. Hangisi doğrudur?', ['İkinci kategori bir kişi fazladır.', 'İkinci kategori iki kat fazladır.', 'Fark 10 kişidir.', 'İki kategori eşittir.'], 'İkinci kategori bir kişi fazladır.', '22 − 21 = 1; eksen görünüşü yerine sayılara bakılır.', 3),
  truth('Yalnız gönüllü basketbol kulübü üyelerine sorularak tüm okulun en sevdiği spor kesin belirlenebilir.', false, 'Katılımcıların zaten bir spor kulübünden seçilmesi yanlılık oluşturabilir.', 3),
  fill('40 kişilik tek tercihli ankette A 18, B 12, C 10 oy almıştır. A ve B’yi seçenlerin toplamı kaçtır?', '30', '18 + 12 = 30; her kişi tek tercih yaptığı için iki grup toplanabilir.', 4),
 ]),

 lesson('topic-5562bbd36f1b1115', 'Eşitlik, iki ifadenin aynı değeri gösterdiğini söyler. Bir terazinin dengesini düşün: İki tarafa da aynı işlemi yaparsan dengeyi koruyabilirsin.', [
  section('Eşittir işaretinin anlamı', '8 + 4 = 7 + 5 ifadesinde iki tarafın değeri 12’dir. Eşittir işareti yalnız “cevap geliyor” işareti değildir; iki tarafın aynı miktarı anlattığını gösterir.', 'Boş kutu veya soru işareti bilinmeyen sayıyı temsil edebilir. Amaç, iki tarafı eşit yapan değeri bulmaktır.'),
  section('Dengeyi koruma', 'Bir eşitliğin iki tarafına aynı sayı eklenir veya iki taraftan aynı sayı çıkarılırsa eşitlik sürer. İki taraf aynı sayıyla çarpılabilir; sıfırdan farklı aynı sayıya bölünebilir.', 'Yalnız bir tarafa işlem yapmak genellikle eşitliği bozar. Bulduğun bilinmeyeni başlangıçtaki kutunun yerine koyup iki tarafı ayrı ayrı hesaplayarak kontrol et.'),
 ], { prompt: '□ + 7 = 19 eşitliğini sağlayan sayı kaçtır?', steps: ['Her iki taraftan 7 çıkar: □ + 7 − 7 = 19 − 7.', 'Sol tarafta yalnız □ kalır; sağ taraf 12 olur.', 'Yerine koy: 12 + 7 = 19.'], answer: '□ = 12.' }, [
  fill('□ + 9 = 24 eşitliğinde □ kaçtır?', '15', 'İki taraftan 9 çıkarılır: 24 − 9 = 15.'),
  fill('□ − 8 = 17 eşitliğinde □ kaçtır?', '25', 'İki tarafa 8 eklenir: 17 + 8 = 25.'),
  fill('4 × □ = 36 eşitliğinde □ kaçtır?', '9', 'İki tarafı 4’e böl: 36 ÷ 4 = 9.'),
  fill('□ ÷ 5 = 7 eşitliğinde □ kaçtır?', '35', 'İki tarafı 5 ile çarp: 7 × 5 = 35.'),
  truth('Bir eşitliğin yalnız sol tarafına 3 eklemek her zaman eşitliği korur.', false, 'Dengeyi korumak için iki tarafa da aynı sayı eklenmelidir.'),
  choice('6 + 8 = □ + 5 eşitliğinde boşluğa hangi sayı gelir?', ['8', '9', '10', '14'], '9', 'Sol taraf 14; □ + 5 = 14 için □ = 9.'),
  truth('20 = 12 + 8 ifadesi doğru bir eşitliktir.', true, 'Sağ taraf 20, sol taraf 20’dir; sıra sonucu değiştirmez.'),
  fill('3 × □ + 2 = 20 eşitliğinde □ kaçtır?', '6', 'Önce iki taraftan 2 çıkar: 3 × □ = 18; sonra 3’e böl: □ = 6.', 3),
  fill('18 + 12 = 18 + □ eşitliğinde □ kaçtır?', '12', 'İki taraftan aynı 18 çıkarılırsa 12 = □ kalır.', 2),
  fill('5 eş kutu ve 10 boncuk toplam 45 boncuk ediyor. Bir kutudaki boncuk sayısı kaç?', '7', '5 kutu = 45 − 10 = 35; bir kutu = 35 ÷ 5 = 7.', 4),
 ]),

 lesson('topic-61b7fdd3038e685f', 'İşlem özellikleri, hesaplamayı anlamını bozmadan kolaylaştırır. Toplama ve çarpmada sıra veya gruplama değişebilir; ancak aynı değişiklik çıkarma ve bölmeye gelişigüzel uygulanamaz.', [
  section('Değişme ve birleşme', 'Toplamada a + b = b + a, çarpmada a × b = b × a olur. Buna değişme özelliği denir. 7 + 12 ile 12 + 7 aynı toplamdır.', 'Birleşme özelliği sayıları hangi ikiliden başlayarak gruplayacağımızı değiştirir: (2 + 8) + 5 = 2 + (8 + 5). Sayıların sırası değil, parantezin yeri değişir. Çarpmada da geçerlidir.'),
  section('Dağılma ve sınırlar', 'Çarpma toplama üzerine dağılır: 6 × (10 + 3) = 6 × 10 + 6 × 3. Çıkarma için de 6 × (10 − 3) = 6 × 10 − 6 × 3 olur.', 'Çıkarmada 12 − 5 ile 5 − 12 aynı değildir; bölmede de yer değiştirme genelde geçerli değildir. Dağılırken dışarıdaki sayıyı parantezdeki her terimle çarpmayı unutma.'),
 ], { prompt: '25 × 16 işlemini özellik kullanarak zihinden hesapla.', steps: ['16’yı 4 × 4 biçiminde ayır: 25 × (4 × 4).', 'Birleşme özelliğiyle (25 × 4) × 4 yaz.', '100 × 4 = 400.'], answer: '25 × 16 = 400.' }, [
  fill('8 + 17 = 17 + □ eşitliğinde □ kaçtır?', '8', 'Değişme özelliğinde toplananların yeri değişir.'),
  fill('4 × 23 = 23 × □ eşitliğinde □ kaçtır?', '4', 'Çarpanların yeri değişince çarpım değişmez.'),
  truth('Çıkarma işleminde değişme özelliği vardır.', false, '10 − 3 = 7 olur; 3 − 10 aynı sonucu vermez.'),
  fill('7 × (10 + 2) işleminin sonucu kaçtır?', '84', '7 × 10 + 7 × 2 = 70 + 14 = 84.'),
  fill('9 × 19 işlemini 9 × (20 − 1) ile hesapla. Sonuç kaç?', '171', 'Çıkarmaya dağılma özelliğiyle 9 × 20 − 9 × 1 = 180 − 9 = 171.'),
  choice('5 × (8 + 3) ifadesine eşit olan hangisidir?', ['5 × 8 + 3', '5 × 8 + 5 × 3', '5 + 8 × 3', '5 × 8 × 3'], '5 × 8 + 5 × 3', '5, parantezdeki iki terimle de çarpılmalıdır.'),
  fill('(18 + 32) + 47 toplamı kaçtır?', '97', 'Önce 18 + 32 = 50; sonra 50 + 47 = 97.'),
  fill('125 × 8 × 3 çarpımı kaçtır?', '3000', 'Önce 125 × 8 = 1 000; sonra 1 000 × 3 = 3 000.', 3),
  truth('2 × (6 + 4) = 2 × 6 + 4 eşitliği doğrudur.', false, 'Sol taraf 20, sağ taraf 16’dır; 4 de 2 ile çarpılmalıdır.', 3),
  fill('12 × 24 + 12 × 6 toplamı kaçtır?', '360', 'Ortak 12’yi kullan: 12 × (24 + 6) = 12 × 30 = 360.', 4),
 ]),

 lesson('topic-c608a0ed9abefba6', 'Aynı işlem dizisini herkesin aynı biçimde yorumlaması için işlem önceliği kullanılır. Parantezler hangi kısmın önce yapılacağını belirtir; çarpma ve bölme, toplama ve çıkarmadan önce gelir.', [
  section('İşlemlerin sırası', 'Önce parantez içindeki işlemleri yap. Sonra çarpma ve bölmeleri soldan sağa, son olarak toplama ve çıkarmaları soldan sağa hesapla.', 'Çarpma ve bölme aynı önceliktedir; çarpma her zaman bölmeden önce yapılmaz. Aynı şekilde toplama ile çıkarma arasında da üstünlük yoktur.'),
  section('Problemle anlam kurma', '“3 kutuda 8’er kalem ve masada 5 kalem” için 3 × 8 + 5 yazılır. “3 kutunun her birinde 8 kalem ve 5 boya” için 3 × (8 + 5) yazılır; parantez durumu değiştirir.', 'Her ara adımda yaptığın işlemi yerine tek sonuç yazarak ilerle. Parantezi kaldırmadan önce içindeki hesabı tamamla; uzun ifadeyi tek adımda zihinden yapmak yerine iz bırak.'),
 ], { prompt: '30 − 4 × (2 + 3) işleminin sonucu kaçtır?', steps: ['Parantez: 2 + 3 = 5.', 'Çarpma: 4 × 5 = 20.', 'Çıkarma: 30 − 20 = 10.'], answer: '10.' }, [
  fill('6 + 4 × 3 işleminin sonucu kaçtır?', '18', 'Önce 4 × 3 = 12, sonra 6 + 12 = 18.'),
  fill('(6 + 4) × 3 işleminin sonucu kaçtır?', '30', 'Önce parantez 10; sonra 10 × 3 = 30.'),
  fill('24 ÷ 6 × 2 işleminin sonucu kaçtır?', '8', 'Bölme ve çarpma soldan sağa: 24 ÷ 6 = 4; 4 × 2 = 8.'),
  fill('18 − 7 + 2 işleminin sonucu kaçtır?', '13', 'Aynı öncelikte soldan sağa: 18 − 7 = 11; 11 + 2 = 13.'),
  truth('Çarpma ve bölme birlikteyse, çarpma daima önce yapılır.', false, 'Aynı öncelikteki çarpma ve bölme soldan sağa yapılır.'),
  fill('40 − 18 ÷ 3 işleminin sonucu kaçtır?', '34', '18 ÷ 3 = 6; 40 − 6 = 34.'),
  choice('Her biri 12 TL olan 4 kalem ve bir adet 8 TL’lik silginin toplam fiyatı hangi ifadedir?', ['4 × 12 + 8', '4 × (12 + 8)', '4 + 12 × 8', '(4 + 12) × 8'], '4 × 12 + 8', 'Dört kalemin fiyatına yalnız bir silginin fiyatı eklenir.', 2),
  fill('3 × (14 − 6) + 5 işleminin sonucu kaçtır?', '29', '14 − 6 = 8; 3 × 8 = 24; 24 + 5 = 29.', 3),
  fill('60 ÷ (2 × 5) + 7 işleminin sonucu kaçtır?', '13', 'Parantez 10; 60 ÷ 10 = 6; 6 + 7 = 13.', 3),
  fill('50 − 2 × (9 + 6) + 4 işleminin sonucu kaçtır?', '24', 'Parantez 15, çarpım 30; 50 − 30 + 4 = 24.', 4),
 ]),

 lesson('topic-70f412a50ce80c2f', 'Örüntüde sayılar veya şekiller belirli bir kurala göre ilerler. Kuralı tahmin ederken birkaç ardışık adımı incelemeli; bulduğumuz kuralın bütün verilen adımları açıklayıp açıklamadığını sınamalıyız.', [
  section('Artış, azalış ve tekrar', '4, 7, 10, 13 örüntüsünde her adımda 3 eklenir. 30, 25, 20 örüntüsünde her adımda 5 çıkarılır. Şekiller ise “daire, kare, üçgen” gibi bir tekrar bloğu oluşturabilir.', 'Ardışık farklar sabit değilse çarpma veya değişen farkları düşün. 2, 4, 8, 16 dizisi iki katına çıkar; “her zaman aynı sayı eklenir” kuralı bu diziyi açıklamaz.'),
  section('Adım ile değer arasındaki ilişki', 'İlk terimi 5 ve artışı 4 olan örüntünün n. terimi 5 + 4 × (n − 1) ile bulunabilir. Çünkü ilk terime ulaşmak için hiç artış yapılmaz.', 'Sonlu sayıda terim birden çok kuralla sürdürülebilir. Bu çalışmalarda verilen “her adımda 3 ekle” gibi kuralı veya açıkça belirtilen en basit düzeni kullan; kural olmadan tek mümkün devam varmış gibi düşünme.'),
 ], { prompt: 'İlk terimi 6 olan örüntü her adımda 5 artıyor. 8. terimi bul.', steps: ['1. terim 6’dır; 8. terime kadar 7 artış yapılır.', 'Toplam artış 7 × 5 = 35.', 'Başlangıca ekle: 6 + 35 = 41.'], answer: '8. terim 41’dir.' }, [
  fill('3, 7, 11, 15, ... örüntüsü her adımda 4 artıyor. Sonraki terim kaç?', '19', 'Kural her adımda 4 artırıyor; son terime 4 ekle: 15 + 4 = 19.'),
  fill('40, 34, 28, ... örüntüsü her adımda 6 azalıyor. Sonraki terim kaç?', '22', 'Her adımda 6 azalma kuralını sürdür: 28 − 6 = 22.'),
  fill('2, 6, 18, ... örüntüsünde her terim 3 ile çarpılıyor. Sonraki terim kaç?', '54', 'Kural bir önceki terimi 3 ile çarpıyor: 18 × 3 = 54.'),
  choice('Daire, kare, üçgen bloğu sırayla tekrar ediyor. 8. şekil hangisidir?', ['Daire', 'Kare', 'Üçgen'], 'Kare', '6 şekil iki tam bloktur; 7 daire, 8 kare olur.'),
  fill('İlk terim 2, her adımda artış 5. Beşinci terim kaçtır?', '22', 'Dört artış yapılır: 2 + 4 × 5 = 22.'),
  truth('İlk terim 7 ve artış 3 ise 4. terim 7 + 4 × 3 olur.', false, 'Dördüncü terime üç artışla ulaşılır: 7 + 3 × 3 = 16.'),
  fill('Bir şekil örüntüsünün ilk adımında 4 çubuk var, her yeni adımda 3 çubuk ekleniyor. 6. adımda kaç çubuk vardır?', '19', '4 + 5 × 3 = 19 çubuk.', 3),
  fill('İlk terim 8, her adımda artış 2. Kaçıncı terim 26’dır?', '10', '26 − 8 = 18; 18 ÷ 2 = 9 artış, yani 10. terim.', 3),
  fill('1, 3, 6, 10, ... dizisinde sırasıyla 2, 3, 4, 5, ... ekleniyor. Sonraki terim kaç?', '15', 'Sonraki artış 5’tir: 10 + 5 = 15.', 3),
  fill('İlk gün 5 sayfa okuyan öğrenci, her gün bir önceki günden 2 sayfa fazla okuyor. İlk dört günde toplam kaç sayfa okur?', '32', 'Günlük sayfalar 5, 7, 9, 11; toplam 32 sayfadır.', 4),
 ]),

 lesson('topic-735059132b26c64d', 'Algoritma, bir işi çözmek için sıralanmış, açık ve sonlu adımlardır. Aritmetik algoritmalarında girdi sayısını alır, belirtilen işlemleri sırayla uygular ve çıktıyı kontrol ederiz.', [
  section('Girdi, işlem, çıktı', '“Bir sayı al, 4 ekle, sonucu 3 ile çarp, sonucu yaz” bir algoritmadır. Girdi 2 ise önce 6, sonra 18 elde edilir. İşlem sırasını değiştirmek başka bir çıktı verebilir.', 'Adımlar herkesin aynı biçimde anlayacağı kadar açık olmalı. “Biraz artır” yerine “5 ekle” gibi ölçülebilir yönerge kullan.'),
  section('Deneme ve hata bulma', 'Algoritmayı küçük girdilerle adım adım izle; her ara sonucu yaz. Beklenen sonuçla karşılaştırarak hatanın hangi adımda ortaya çıktığını bul.', 'Bölme içeren adımlarda sıfıra bölme gibi tanımsız işlemleri denetle. Bir tekrarlı işlem kullanılıyorsa kaç kez yineleneceği veya ne zaman duracağı belirtilmelidir.'),
 ], { prompt: 'Girdi 5. Önce 2 ile çarp, 6 ekle, 4’e böl. Çıktı kaçtır?', steps: ['5 × 2 = 10.', '10 + 6 = 16.', '16 ÷ 4 = 4.'], answer: 'Çıktı 4’tür.' }, [
  fill('Girdi 7. Önce 5 ekle, sonra 2 ile çarp. Çıktı kaçtır?', '24', 'İlk adımda 7 + 5 = 12; ikinci adımda 12 × 2 = 24 elde edilir.'),
  fill('Girdi 20. Önce 4 çıkar, sonra 4’e böl. Çıktı kaçtır?', '4', 'Önce 20 − 4 = 16, ardından 16 ÷ 4 = 4 bulunur.'),
  choice('Bir algoritmadaki başlangıç sayısına ne denir?', ['Girdi', 'Çıktı', 'Yarıçap', 'Sıklık'], 'Girdi', 'İşlemlerin başlaması için alınan veri girdidir.'),
  truth('“Sayını biraz büyüt” yönergesi her kişi için aynı kesin işlemi belirtir.', false, '“Biraz” belirsizdir; ne kadar ekleneceği veya neyle çarpılacağı yazılmalıdır.'),
  fill('Girdi 3. “2 ekle” adımı üç kez uygulanırsa çıktı kaç?', '9', 'Başlangıç 3’e üç ayrı adımda 2 eklenir: 3 → 5 → 7 → 9.'),
  fill('Önce 3 ile çarpıp sonra 1 ekleyen algoritmanın girdisi 8 ise çıktısı kaç?', '25', 'Önce girdi 3 ile çarpılır: 8 × 3 = 24; sonra 1 eklenir: 25.'),
  fill('Bir algoritma girdiye 6 ekliyor. Çıktı 19 ise girdi kaç?', '13', 'Ters işlemle 19 − 6 = 13 bulunur.', 3),
  choice('Hangi adım matematikte tanımsız bir işlem ister?', ['8 ekle', '3 ile çarp', '0’a böl', '2 çıkar'], '0’a böl', 'Sıfıra bölme tanımlı değildir.'),
  fill('Girdi 4. Önce 3 ekle, sonra 5 ile çarp. Aynı girdide önce 5 ile çarpıp sonra 3 ekleseydik iki çıktı arasındaki fark kaç olurdu?', '12', 'İlk çıktı 35; ikinci 23; fark 12’dir.', 4),
  fill('Girdi 10. “3 çıkar” adımı sonuç 4 olana kadar uygulanıyor. Kaç kez çıkarma yapılır?', '2', '10 → 7 → 4; iki çıkarma sonunda durma koşulu sağlanır.', 3),
 ]),

 lesson('topic-a606b079db4e39a1', 'Aynı algoritma farklı girdilerle denenerek güvenilirliği araştırılır. Koşul ve tekrar içeren adımlarda hangi yolun seçildiğini izlemek, yalnız sonuca değil çözümün nasıl üretildiğine de bakmamızı sağlar.', [
  section('Koşula göre işlem', '“Sayı 10’dan büyükse 3 çıkar; değilse 3 ekle” yönergesi iki yoldan yalnız birini seçer. Girdi 10, “10’dan büyük” koşulunu sağlamaz; eşitlik ile büyüklüğü ayır.', 'Bir sayı ikiye bölündüğünde kalan 0 ise çifttir. Böyle bir koşul farklı işlem yolları seçmekte kullanılabilir.'),
  section('Tekrarı izleme ve denetleme', 'Tekrarlanan adımı bir izleme tablosunda gösterebilirsin: başlangıç değeri, 1. adım, 2. adım gibi. Sayılan şeyin işlem sayısı mı yoksa yazılan değer sayısı mı olduğunu ayırt et.', 'Algoritma yanlış sonuç veriyorsa bir deneme girdisi seç ve ilk ayrılma noktasını bul. Sonucun rastlantıyla doğru çıkması bütün girdiler için doğru çalıştığını göstermez.'),
 ], { prompt: 'Algoritma: Girdi çiftse yarısını al; tekse 1 ekle. Girdi 13 ve girdi 8 için çıktıları bul.', steps: ['13 tek olduğundan 1 ekleme yolu seçilir: 13 + 1 = 14.', '8 çift olduğundan yarısını alma yolu seçilir: 8 ÷ 2 = 4.', 'Her girdide koşula uygun yalnız bir yol uygulanır.'], answer: '13 için çıktı 14; 8 için çıktı 4.' }, [
  fill('Sayı 10’dan büyükse 3 çıkar, değilse 3 ekle. Girdi 15 ise çıktı kaç?', '12', '15 > 10; 15 − 3 = 12.'),
  fill('Sayı 10’dan büyükse 3 çıkar, değilse 3 ekle. Girdi 10 ise çıktı kaç?', '13', '10, 10’dan büyük değildir; 10 + 3 = 13.'),
  fill('Çiftse 2’ye böl, tekse 1 ekle. Girdi 18 ise çıktı kaç?', '9', '18 çifttir; 18 ÷ 2 = 9.'),
  fill('Çiftse 2’ye böl, tekse 1 ekle. Girdi 7 ise çıktı kaç?', '8', '7 tek olduğundan 1 eklenir.'),
  truth('“10’dan büyük” koşulu 10 sayısında sağlanır.', false, 'Eşit olmak, büyük olmak değildir.'),
  fill('Başlangıç 2; her adımda 2 ile çarp. Üç adım sonunda sayı kaç olur?', '16', 'Üç çarpma adımı 2 → 4 → 8 → 16 biçiminde izlenir; çıktı 16’dır.'),
  fill('Başlangıç 1; her adımda 4 ekle. Sonuç 17 olunca dur. Kaç adım yapılır?', '4', '1 → 5 → 9 → 13 → 17; dört ekleme vardır.', 3),
  choice('Bir algoritmanın adımlarını denetlemek için en yararlı çalışma hangisidir?', ['Ara değerleri sırayla yazmak', 'Yalnız son sayıyı tahmin etmek', 'Girdiyi hiç kullanmamak', 'Hata görünce sonucu silmek'], 'Ara değerleri sırayla yazmak', 'Ara sonuçlar hatanın ilk oluştuğu adımı bulmaya yardım eder.'),
  fill('Bir işlem makinesi sayıyı 4 ile çarpıp 8 çıkarıyor. Çıktı 28 ise girdi kaç?', '9', 'Tersinden: 28 + 8 = 36; 36 ÷ 4 = 9.', 3),
  fill('Başlangıç 20. Sayı 5’ten büyük olduğu sürece 5 çıkarılıyor. Durulduğunda elde edilen sayı kaçtır?', '5', '20 → 15 → 10 → 5. 5, 5’ten büyük olmadığı için tekrar durur.', 4),
 ]),

 lesson('topic-cebe00fd601642dc', 'Olasılık, bir olayın gerçekleşmesine ilişkin beklentiyi ifade eder. Bu beklenti bir olayın kesin sonucunu önceden bilmek değildir. İmkânsız ile kesin arasında az ya da çok olası durumlar vardır.', [
  section('İmkânsız, mümkün, kesin', 'Bir torbada yalnız kırmızı toplar varsa mavi top çekmek imkânsız; kırmızı çekmek kesindir. İmkânsız olasılık 0, kesin olasılık 1 ile gösterilir; diğer olasılıklar bu aralıktadır.', 'Bir olayın gerçekleşmesi bekleniyor diye kesin olduğunu söyleme. Adil bir madeni parada yazı ve tura eşit olasıdır; yine de tek atışın sonucu önceden bilinmez.'),
  section('Bilgiye dayalı beklenti', 'Hava tahmini gibi durumlarda kişilerin beklentileri ellerindeki bilgiye göre değişebilir. Gerekçesiz bir tahmin yerine bulut, mevsim veya güvenilir tahmin bilgisi gibi kanıtlar kullanılır.', 'Aynı olay hakkında farklı beklentileri konuşurken hangi bilginin kullanıldığını belirt. Daha önce birkaç kez aynı sonuç çıkması sonraki denemede öteki sonucun kesin geleceği anlamına gelmez.'),
 ], { prompt: 'Bir torbada 6 mavi, 2 sarı top var. Torbaya bakmadan bir top çekiliyor. Hangi renk daha olasıdır? Yeşil çekilebilir mi?', steps: ['Aynı biçim ve büyüklükte toplar için her topun seçilme şansını eşit düşün.', 'Mavi toplar sarı toplardan daha çoktur; mavi çekmek daha olasıdır.', 'Yeşil top yoktur; yeşil çekmek imkânsızdır.'], answer: 'Mavi daha olasıdır; yeşil çekmek imkânsızdır. Mavi yine de kesin değildir.' }, [
  choice('Yalnız sarı toplu bir torbadan mavi top çekme olayı nasıldır?', ['İmkânsız', 'Kesin', 'Çok olası', 'Eşit olası'], 'İmkânsız', 'Torbada mavi top yoktur.'),
  fill('Kesin bir olayın olasılığı hangi sayıyla gösterilir?', '1', 'Kesinlik olasılık ölçeğinin 1 ucudur.', 1),
  fill('İmkânsız bir olayın olasılığı hangi sayıyla gösterilir?', '0', 'Gerçekleşemeyen olayın olasılığı 0’dır.', 1),
  truth('Bir olayın olasılığı 1’den büyük olabilir.', false, 'Olasılık 0 ile 1 arasındadır; uçlar dahildir.'),
  choice('Adil bir madeni parada yazı ve tura için hangisi doğrudur?', ['Eşit olasıdır.', 'Yazı kesindir.', 'Tura imkânsızdır.', 'Önceki atış neyse yenisi kesin aynıdır.'], 'Eşit olasıdır.', 'Adil para modelinde iki yüz aynı şansa sahiptir.'),
  truth('Bir torbada 9 kırmızı ve 1 beyaz top varsa kırmızı çekmek kesindir.', false, 'Kırmızı daha olasıdır; beyaz top da bulunduğundan kesin değildir.'),
  choice('Yağmur beklentisini gerekçelendiren en uygun bilgi hangisidir?', ['Güvenilir güncel hava tahmini', 'Kaleminin rengi', 'Defterin sayfa sayısı', 'Ayakkabının markası'], 'Güvenilir güncel hava tahmini', 'Tahminle ilgili kanıt, olaya ilişkin beklentiyi destekler.', 2),
  choice('Bir torbada 3 kırmızı ve 7 yeşil top vardır. Hangisini çekmek daha olasıdır?', ['Kırmızı', 'Yeşil', 'İkisi kesin', 'İkisi imkânsız'], 'Yeşil', 'Aynı tür 7 yeşil top, 3 kırmızıdan daha çoktur.'),
  truth('Adil para üç kez yazı geldiyse dördüncü atışın tura gelmesi kesindir.', false, 'Önceki sonuçlar dördüncü atışı zorunlu belirlemez; adil parada iki sonuç yine eşit olasıdır.', 3),
  choice('“Yarın yağmur yağması çok olası.” cümlesi ne söyler?', ['Yağmur beklenir ama kesin değildir.', 'Yağmur imkânsızdır.', 'Yağmur mutlaka yağacaktır.', 'Olasılık 1’den büyüktür.'], 'Yağmur beklenir ama kesin değildir.', 'Çok olası sözü kesinlikten farklıdır.', 4),
 ]),

 lesson('topic-fa7dd03066ee7a50', 'Olayları karşılaştırırken “daha olası”, “daha az olası” ve “eşit olası” ifadelerini gerekçeyle kullanırız. Bir olayı daha olası hâle getirmek için hangi koşulun değişmesi gerektiğini araştırabiliriz.', [
  section('Olasılıkları karşılaştırma', 'Aynı büyüklükte topların bulunduğu bir torbada bir rengin sayısı arttıkça, diğer koşullar aynı kalırken o rengi çekme beklentimiz artar. İki rengin sayısı eşitse çekilme şansları eşit olur.', 'Çarkta eş büyüklükteki bölgeler eşit şanslı kabul edilebilir. Renkli bölgelerin sayısı ancak bölgeler eşit büyüklükteyse doğrudan karşılaştırılır; büyük bir bölgeyi küçük bölgeyle yalnız sayarak karşılaştırma.'),
  section('Koşulu değiştirerek düşünme', '4 kırmızı, 2 mavi toplu torbaya 2 mavi top eklersek iki renk eşit sayıda olur. Kırmızı eklemek ise kırmızıyı daha olası yapar; mavi çekmeyi imkânsız yapmaz.', 'Tahminin gerçekleşmemesi, her zaman kötü bir gerekçe kullandığın anlamına gelmez. Daha az olası olaylar da gerçekleşebilir. Olayın sonucuyla önceden yapılan olasılık karşılaştırmasını ayırt et.'),
 ], { prompt: 'Torbada 5 siyah, 2 beyaz top var. Beyaz çekilmesini siyahla eşit olası yapmak için yalnız kaç beyaz top eklenmelidir?', steps: ['Siyah sayısı 5 olarak kalır.', 'Eşit olasılık için beyaz sayısının da 5 olması gerekir.', 'Eklenecek beyaz sayısı 5 − 2 = 3.'], answer: 'Aynı türden 3 beyaz top eklenmelidir.' }, [
  choice('Aynı tür 4 kırmızı ve 4 mavi toplu torbada hangi renk daha olasıdır?', ['İkisi eşit olası', 'Yalnız kırmızı', 'Yalnız mavi', 'İkisi imkânsız'], 'İkisi eşit olası', 'Renklerin sayıları eşit ve toplar aynı türdedir.'),
  fill('Torbada 7 kırmızı, 3 mavi top var. Yalnız mavi eklenerek iki renk eşit sayıda yapılacak. Kaç mavi eklenir?', '4', '7 − 3 = 4 mavi top gerekir.'),
  choice('Eş büyüklükte 6 bölmeli çarkın 4 bölmesi yeşil, 2 bölmesi sarıdır. Hangisi daha olası?', ['Yeşil', 'Sarı', 'İkisi imkânsız', 'Sarı kesin'], 'Yeşil', 'Yeşil eş büyüklükte daha çok bölgeyi kaplar.'),
  truth('Daha az olası bir olay hiç gerçekleşmez.', false, 'Daha az olası, imkânsız demek değildir.'),
  fill('3 kırmızı ve 5 mavi toplu torbadan yalnız mavi toplar çıkarılacak. Eşit olasılık için kaç mavi çıkarılır?', '2', '5 − 2 = 3 mavi kalır; iki renk 3’er olur.'),
  choice('Yalnız kırmızı toplu torbaya bir mavi top ekleniyor. Mavi çekme olayı nasıl değişir?', ['İmkânsızken mümkün olur.', 'Kesinken imkânsız olur.', 'Her zaman kesin olur.', 'Hâlâ imkânsızdır.'], 'İmkânsızken mümkün olur.', 'Mavi top artık torbada vardır; seçilme şansı sıfır değildir.'),
  truth('Bir çarkın renklerinin şansını yalnız bölme sayılarına bakarak her durumda karşılaştırabiliriz.', false, 'Bölmelerin büyüklükleri eşit değilse sayı tek başına yeterli değildir.', 3),
  fill('Eş büyüklükte 8 bölmeli çarkın 3 bölmesi turuncu, diğerleri mor. Mor bölme sayısı kaç?', '5', '8 − 3 = 5; mor daha geniş toplam bölge kaplar.'),
  choice('Torbada 2 yeşil ve 6 sarı top var. Yeşili daha olası yapan değişiklik hangisidir?', ['5 yeşil eklemek', '5 sarı eklemek', '1 yeşil çıkarmak', 'Yeşilleri tamamen çıkarmak'], '5 yeşil eklemek', '7 yeşil ve 6 sarı olunca yeşil daha olası olur.', 3),
  fill('Torbada 4 beyaz ve 9 siyah top var. Yalnız beyaz ekleyerek beyazı siyahtan daha olası yapmak için en az kaç beyaz gerekir?', '6', 'Beyaz sayısı 9’u aşmalı: en az 10 olur. 10 − 4 = 6 top eklenir.', 4),
 ]),
];
