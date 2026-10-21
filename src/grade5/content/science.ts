import type { LessonContent, LessonQuestion } from '../content-types';

type Item = Omit<LessonQuestion, 'id'>;
type Concept = Omit<LessonContent, 'topicId' | 'questions'> & { topicIds: string[]; questions: Item[] };
const choice = (prompt: string, choices: string[], answer: string, explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 1): Item =>
 ({ kind: 'choice', prompt, choices, answer, explanation, hints: [hint], difficulty });
const truth = (prompt: string, answer: boolean, explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 1): Item =>
 ({ kind: 'boolean', prompt, choices: ['Doğru', 'Yanlış'], answer: answer ? 'Doğru' : 'Yanlış', explanation, hints: [hint], difficulty });
const fill = (prompt: string, answer: string, explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 2): Item =>
 ({ kind: 'fill', prompt, answer, explanation, hints: [hint], difficulty });

// Original Eylunica material. The topic identifiers refer to the preserved
// curriculum catalog; these explanations and questions are not MEB exam items.
const concepts: Concept[] = [
 {
  topicIds: ['topic-c69a98f52ba4ecb3'],
  introduction: 'Laboratuvarda merak kadar dikkat de önemlidir. Bir deneyin amacı, kullanılan araçlar ve güvenlik kuralları anlaşılmadan işe başlanmaz.',
  sections: [
   { title: 'Deney öncesinde', body: ['Öğretmenin yönergesini oku ve anlamadığın adımı sor. Çalışma alanını düzenle; gerekiyorsa koruyucu gözlük kullan, uzun saçları topla.', 'Kimyasal maddeler tadılmaz. Etiketsiz kap kullanılmaz; öğretmenin yönlendirmesi olmadan maddeye dokunulmaz veya madde koklanmaz.'] },
   { title: 'Bir sorun olduğunda', body: ['Kırık camı elinle toplama. Dökülme, yaralanma veya araç arızasını hemen öğretmene bildir; arkadaşlarını tehlikeli bölgeden uzak tut.', 'Deney bittikten sonra araçları yönergeye göre bırak, ellerini yıka ve masayı düzenle. Evde priz, alev veya bilinmeyen maddelerle deney yapma.'] },
  ],
  workedExample: { prompt: 'Masada etiketsiz bir sıvı ve çatlamış bir cam kap gördün. Ne yapmalısın?', steps: ['Sıvıyı tatma, koklama veya başka kaba aktarma.', 'Çatlamış kaba dokunma ve arkadaşlarını uyar.', 'İki durumu da öğretmene bildir, güvenli yönergeyi bekle.'], answer: 'Deneyi durdurmak ve öğretmene haber vermek güvenli seçimdir.' },
  activity: { title: 'Güvenli masa planı', instructions: ['Bir kâğıda çalışma masasını çiz.', 'Çanta, defter ve deney araçları için ayrı yerler belirle.', 'Bir dökülme olduğunda uygulanacak üç güvenli adımı yaz.'], reflection: 'Hangi düzenleme kazayla bir araca çarpma olasılığını azaltır?' },
  questions: [
   choice('Etiketsiz bir sıvı ile karşılaşırsan ilk güvenli davranış hangisidir?', ['Tadına bakmak', 'Öğretmene haber vermek', 'Başka sıvıyla karıştırmak', 'Çöpe dökmek'], 'Öğretmene haber vermek', 'İçeriği bilinmeyen maddeyle işlem yapılmaz; öğretmen yönlendirmesi gerekir.', 'Maddenin ne olduğunu bilmiyorsun.'),
   truth('Kırılan camı çıplak elle toplamak güvenlidir.', false, 'Kırık cam kesebilir; bölgeyi koruyup öğretmene bildirmek gerekir.', 'Camın keskin kenarlarını düşün.'),
   fill('Deney sırasında anlaşılmayan bir adım için kime danışılır? Tek sözcük yaz.', 'öğretmene', 'Deneyi yöneten öğretmenden açıklama alınır.', 'Deneyi yöneten kişiyi düşün.'),
   choice('Deney öncesi hangi hazırlık uygundur?', ['Yönergeyi okumadan başlamak', 'Uzun saçları toplamak', 'Malzemeleri masanın kenarına dizmek', 'Bilinmeyen maddeyi koklamak'], 'Uzun saçları toplamak', 'Saçların araçlara veya maddelere temas etmesi engellenir.', 'Temas ve takılma riskini azaltan seçeneği bul.', 2),
   choice('Arkadaşın sıvı dökülen masaya dokunmak istiyor. Ne önerirsin?', ['Sıvıyı eliyle silmesini', 'Öğretmene bildirilene kadar uzak durmasını', 'Bir sıvı daha eklemesini', 'Koklayarak tanımasını'], 'Öğretmene bildirilene kadar uzak durmasını', 'İçeriği bilinmeyen döküntüye temas edilmemeli ve öğretmen bilgilendirilmelidir.', 'Önce güvenliği sağla.', 3),
   choice('Bir ekip deneyi çok hızlı bitirmiş fakat yönergeyi okumamış. Başarıyı değerlendirirken neye öncelik verilir?', ['Yalnız bitirme süresine', 'Güvenli ve yönergeye uygun çalışmaya', 'En fazla malzeme kullanmaya', 'Masayı dolu bırakmaya'], 'Güvenli ve yönergeye uygun çalışmaya', 'Hız, güvenli ve doğru yöntemin yerini tutmaz.', 'Bir deneyin güvenilir olması için nasıl yapılması gerekir?', 4),
  ],
 },
 {
  topicIds: ['topic-7e5324bf5f149562'],
  introduction: 'Güneş, Dünya’ya en yakın yıldızdır. Kendi ışığını ve enerjisini üretir; Dünya’daki yaşam için temel bir enerji kaynağıdır.',
  sections: [
   { title: 'Güneş nasıl bir gök cismidir?', body: ['Güneş yaklaşık küreseldir ve çok sıcak gazlardan oluşur. Dünya’dan çok büyüktür; gökyüzünde küçük görünmesinin nedeni bize çok uzakta olmasıdır.', 'Güneş’in görünen yüzeyinde çevresine göre daha serin bölgeler koyu lekeler olarak gözlenebilir. Koyu görünmek soğuk olmak anlamına gelmez.'] },
   { title: 'Dönme hareketi ve güvenli bilgi toplama', body: ['Güneş kendi ekseni çevresinde döner. Bilim insanları güneş lekelerinin konum değişimini inceleyerek dönme hareketi hakkında bilgi edinir.', 'Güneş’e çıplak gözle, dürbünle veya sıradan teleskopla bakılmaz. Fotoğraf, güvenilir bilimsel görüntü ve güvenli modeller üzerinden inceleme yapılır.'] },
  ],
  workedExample: { prompt: 'Güneş ve bir ampulün ortak özelliği nedir; Güneş’i Ay’dan ayıran özellik hangisidir?', steps: ['Ampul ve Güneş ışık kaynağıdır.', 'Ay kendi ışığını üretmez; Güneş ışığını yansıtır.', 'Bu nedenle Güneş bir yıldız, Ay ise Dünya’nın doğal uydusudur.'], answer: 'Güneş kendi ışığını üretir; Ay Güneş’ten aldığı ışığı yansıtır.' },
  activity: { title: 'Görüntülerle Güneş araştırması', instructions: ['Ders kitabındaki iki güneş görüntüsünü incele.', 'Küresel biçimi ve görünen lekelerle ilgili gözlemlerini yaz.', 'Gözlem ile görüntüden öğrenemediğin bilgiyi ayrı cümlelerle belirt.'], reflection: 'Bir fotoğraf Güneş’in gerçek büyüklüğünü tek başına gösterir mi?' },
  questions: [
   choice('Güneş hangi gök cismi türüdür?', ['Gezegen', 'Yıldız', 'Uydu', 'Kuyruklu yıldız'], 'Yıldız', 'Güneş kendi ışığını üreten bir yıldızdır.', 'Kendi ışığını üretmesine dikkat et.'),
   truth('Güneş yalnız Dünya çevresinde dolaşan bir uydudur.', false, 'Güneş yıldızdır; Dünya Güneş çevresinde dolanır.', 'Dünya’nın doğal uydusu Ay’dır.'),
   fill('Güneş’in kendi ekseni çevresindeki hareketine ne denir? Tek sözcük yaz.', 'dönme', 'Bir cismin kendi ekseni çevresindeki hareketi dönmedir.', 'Dolanma ile kendi ekseni çevresinde hareketi ayır.'),
   choice('Güneş gökyüzünde neden gerçek boyutuna göre küçük görünür?', ['Dünya’dan küçük olduğu için', 'Çok uzakta olduğu için', 'Işık üretmediği için', 'Küp biçiminde olduğu için'], 'Çok uzakta olduğu için', 'Uzak cisimlerin görünür boyutu küçük olabilir; Güneş Dünya’dan çok büyüktür.', 'Uzak bir ağacın görünüşünü düşün.', 2),
   choice('Güneş lekelerinin günler içindeki yer değişimi hangi bilgiye kanıt sağlar?', ['Güneş’in dönmesine', 'Ay’ın ışık üretmesine', 'Dünya’nın düz olmasına', 'Güneş’in soğuk olmasına'], 'Güneş’in dönmesine', 'Lekelerin konum değişimleri Güneş’in ekseni çevresinde döndüğünü incelemek için kullanılır.', 'Bir topun üzerindeki işaret dönerken ne olur?', 3),
   choice('Bir öğrenci Güneş’i incelemek istiyor. Hangi yöntem güvenlidir?', ['Dürbünle doğrudan bakmak', 'Güneş’e uzun süre bakmak', 'Ders kitabındaki bilimsel görüntüleri karşılaştırmak', 'Sıradan güneş gözlüğüyle teleskoptan bakmak'], 'Ders kitabındaki bilimsel görüntüleri karşılaştırmak', 'Doğrudan bakış gözlere zarar verebilir; güvenilir görüntüler üzerinden bilgi toplanabilir.', 'Doğrudan Güneş’e bakmayı gerektirmeyen yolu bul.', 4),
  ],
 },
 {
  topicIds: ['topic-55b0812fbc9fd348'],
  introduction: 'Ay, Dünya’nın doğal uydusudur. Kayalık yüzeyindeki çukurlara krater denir. Ay kendi ışığını üretmez; Güneş ışığını yansıtır.',
  sections: [
   { title: 'Ay’ın hareketleri', body: ['Ay kendi ekseni çevresinde döner ve Dünya çevresinde dolanır. Bu iki hareketin süreleri yaklaşık eşit olduğundan Dünya’dan Ay’ın hep yaklaşık aynı yüzü görülür.', 'Ay, Dünya ile birlikte Güneş çevresindeki yolculuğa da katılır. Ay’ın Dünya çevresindeki bir turu ile evrelerin yeniden aynı görünmesi için geçen süre tam aynı değildir.'] },
   { title: 'Evrelerin nedeni', body: ['Güneş Ay’ın her zaman yaklaşık yarısını aydınlatır. Dünya’dan bu aydınlık yarının farklı bölümlerini görmemiz evreleri oluşturur.', 'Başlıca evreler yeni ay, ilk dördün, dolunay ve son dördündür. Evreler Ay’ın biçim değiştirmesi veya Dünya’nın gölgesinin her ay Ay’a düşmesi sonucu oluşmaz.'] },
  ],
  workedExample: { prompt: 'Ay bazen yarım daire, bazen dolu daire gibi görünür. Gerçekte şekli değişir mi?', steps: ['Ay’ın biçimi yaklaşık küresel olarak kalır.', 'Güneş’in aydınlattığı bölümün Dünya’dan görülen kısmı değişir.', 'Görünen değişim evredir; Ay’ın parçalanması veya küçülmesi değildir.'], answer: 'Ay’ın gerçek biçimi değişmez; aydınlık bölümün görünen kısmı değişir.' },
  activity: { title: 'Evre çizelgesi', instructions: ['Kitaptaki yeni ay, ilk dördün, dolunay ve son dördün çizimlerini incele.', 'Dört evreyi sırasıyla çiz ve adlarını yaz.', 'Her çizimin aynı büyüklükteki Ay’ı temsil etmesine dikkat et.'], reflection: 'Çizimde karanlık kalan bölüm neden yok olmuş sayılmaz?' },
  questions: [
   choice('Ay’ın kendi ışığı olmadığı hâlde görünmesinin nedeni nedir?', ['Güneş ışığını yansıtması', 'Sürekli yanması', 'Bir yıldız olması', 'Dünya’dan elektrik alması'], 'Güneş ışığını yansıtması', 'Ay, yüzeyine gelen Güneş ışığını yansıtır.', 'Ay’a ışık hangi kaynaktan ulaşır?'),
   truth('Ay’ın evrelerinde Ay’ın gerçek küresel biçimi değişir.', false, 'Görünen aydınlık bölüm değişir; Ay’ın biçimi yaklaşık küresel kalır.', 'Görünüş ile gerçek biçimi ayır.'),
   fill('Ay’ın aydınlık yüzünün Dünya’dan dolu daire gibi görüldüğü ana evre hangisidir?', 'dolunay', 'Dolunayda aydınlık yarının Dünya’ya dönük kısmı dolu daire görünümündedir.', 'Adında dolu anlamı olan evreyi düşün.'),
   choice('Yeni aydan sonraki ana evre hangisidir?', ['Son dördün', 'İlk dördün', 'Dolunaydan sonra yeni ay', 'Ay tutulması'], 'İlk dördün', 'Ana evre sırası yeni ay, ilk dördün, dolunay, son dördündür.', 'Dördünlerin adındaki sırayı kullan.', 2),
   choice('Dünya’dan Ay’ın yaklaşık aynı yüzünü görmemiz neyle açıklanır?', ['Ay’ın hiç dönmemesiyle', 'Dönme ve Dünya çevresinde dolanma sürelerinin yaklaşık eşitliğiyle', 'Ay’ın düz olmasıyla', 'Dünya’nın durmasıyla'], 'Dönme ve Dünya çevresinde dolanma sürelerinin yaklaşık eşitliğiyle', 'Ay bir tur dolanırken kendi ekseni çevresinde de yaklaşık bir tur döner.', 'İki hareketin sürelerini karşılaştır.', 3),
   choice('“Ay’ın her evresi Dünya’nın gölgesinden oluşur.” diyen arkadaşına hangi açıklama uygundur?', ['Evet, Ay her hafta tutulur.', 'Evreler, Ay’ın aydınlık yarısının farklı kısımlarını görmemizle oluşur.', 'Ay her gece ışık üretir.', 'Ay’ın yarısı her ay kopar.'], 'Evreler, Ay’ın aydınlık yarısının farklı kısımlarını görmemizle oluşur.', 'Evreler konumlara bağlı görünüş değişimidir; tutulma farklı bir olaydır.', 'Her ay gerçekleşen evreyi tutulmayla karıştırma.', 4),
  ],
 },
 {
  topicIds: ['topic-7e58bf568a744020'],
  introduction: 'Güneş, Dünya ve Ay’ın büyüklükleri ve hareketleri birbirinden farklıdır. Bir model, bu ilişkileri basitleştirerek anlamamızı sağlar.',
  sections: [
   { title: 'Büyüklük ve konum', body: ['Bu üç gök cismi arasında en büyük Güneş, sonra Dünya, sonra Ay gelir. Güneş yıldız, Dünya gezegen, Ay doğal uydudur.', 'Modelde kullanılan topların boyutları ve aralarındaki uzaklıklar her zaman aynı ölçekte olmayabilir. Modelin hangi ilişkiyi temsil ettiği belirtilmelidir.'] },
   { title: 'Dönme ve dolanma', body: ['Dünya kendi ekseni çevresinde döner ve Güneş çevresinde dolanır. Dünya’nın dönmesi yaklaşık bir gün, Güneş çevresinde dolanması yaklaşık bir yıl sürer.', 'Ay Dünya çevresinde dolanırken Dünya ile birlikte Güneş çevresinde hareket eder. Kendi ekseni çevresindeki hareket dönme, başka bir cisim çevresindeki hareket dolanmadır.'] },
  ],
  workedExample: { prompt: 'Bir büyük top, bir orta top ve bir küçük topla Güneş–Dünya–Ay modeli yapacaksın. Görevleri nasıl verirsin?', steps: ['En büyük top Güneş’i temsil eder.', 'Orta top Dünya’yı, küçük top Ay’ı temsil eder.', 'Dünya topunu Güneş çevresinde; Ay topunu Dünya çevresinde hareket ettir.', 'Top boylarıyla uzaklıkların gerçek oranlarda olmadığını model notuna yaz.'], answer: 'Büyüklük sırası Güneş > Dünya > Ay; Ay Dünya çevresinde, Dünya Güneş çevresinde dolanır.' },
  activity: { title: 'Kâğıt üzerinde hareket modeli', instructions: ['Üç farklı büyüklükte daire çiz ve adlarını yaz.', 'Dolanma yollarını oklarla göster.', 'Dünya’nın kendi ekseni çevresindeki dönmesini farklı bir okla belirt.'], reflection: 'Modelinde gerçek uzaklıkları mı, hareket ilişkisini mi gösterdin?' },
  questions: [
   choice('Güneş, Dünya ve Ay’ın büyükten küçüğe sırası hangisidir?', ['Ay–Dünya–Güneş', 'Güneş–Dünya–Ay', 'Dünya–Ay–Güneş', 'Güneş–Ay–Dünya'], 'Güneş–Dünya–Ay', 'Güneş en büyük, Ay en küçüktür.', 'Ay Dünya’nın uydusudur.'),
   truth('Dünya kendi ekseni çevresinde de hareket eder.', true, 'Bu hareket dönmedir ve yaklaşık bir gün sürer.', 'Dönme ile dolanma ayrı hareketlerdir.'),
   fill('Dünya’nın Güneş çevresinde yaklaşık bir tam dolanma süresine ne denir? Bir sözcük yaz.', 'yıl', 'Bir yıl Dünya’nın Güneş çevresindeki yaklaşık bir turudur.', 'Takvimde on iki ayı düşün.'),
   choice('Ay hangi cismin doğal uydusudur?', ['Dünya’nın', 'Mars’ın', 'Jüpiter’in', 'Venüs’ün'], 'Dünya’nın', 'Ay Dünya’nın çevresinde dolanan doğal uydusudur.', 'Ay’ın çevresinde dolandığı gezegeni bul.', 2),
   choice('Modelde Dünya’nın Güneş çevresinde çizilen okları neyi gösterir?', ['Dünya’nın erimesini', 'Dolanma hareketini', 'Yalnız kendi ekseninde dönmesini', 'Ay’ın ışık üretmesini'], 'Dolanma hareketini', 'Bir cismin başka bir cisim çevresindeki hareketi dolanmadır.', 'Ok hangi cismin çevresindedir?', 3),
   choice('Bir modelde Güneş topu büyük ama Dünya’ya çok yakın çizilmiş. Hangi yorum bilimsel olur?', ['Model her uzaklığı kesin doğru gösterir.', 'Model büyüklük sırasını gösterebilir; uzaklık ölçeği ayrıca belirtilmelidir.', 'Güneş gerçekte Dünya’ya değmektedir.', 'Modeller hiçbir şeyi açıklayamaz.'], 'Model büyüklük sırasını gösterebilir; uzaklık ölçeği ayrıca belirtilmelidir.', 'Modeller belirli ilişkileri temsil eder; bütün özellikleri aynı ölçekte olmak zorunda değildir.', 'Modelin temsil ettiği ve etmediği özellikleri ayır.', 4),
  ],
 },
 {
  topicIds: ['topic-deb6379d1b9f00ce'],
  introduction: 'Kuvvet itme veya çekme olarak düşünülebilir. Bir cismin hareketini, yönünü, hızını veya şeklini değiştirebilir.',
  sections: [
   { title: 'Kuvveti nasıl tanırız?', body: ['Bir kapıyı itmek, bir çekmeceyi çekmek ve esnek bir yayı uzatmak kuvvet uygulamaya örnektir. Her kuvvet hareket oluşturmak zorunda değildir.', 'Kuvvetin büyüklüğü vardır. Bir cismi daha güçlü çekmek, uygun bir yayda daha fazla uzamaya neden olabilir.'] },
   { title: 'Dinamometre ve ölçüm', body: ['Kuvvet dinamometreyle ölçülür. Kuvvet birimi newtondur ve N simgesiyle yazılır. Dinamometre, esnek yayın uygulanan kuvvetle uzamasından yararlanır.', 'Ölçümden önce aracın sıfırı ve ölçebileceği en büyük değer kontrol edilir. Sınırından büyük kuvvet uygulamak aracı bozabilir.'] },
  ],
  workedExample: { prompt: 'Bir dinamometrede 0 ile 10 N arası beş eşit aralığa bölünmüş. Gösterge 0’dan sonraki üçüncü çizgideyse kuvvet kaç N olur?', steps: ['Her aralık 10 ÷ 5 = 2 N’dir.', 'Üç aralık 3 × 2 = 6 N eder.', 'Sonucu birimiyle yaz.'], answer: '6 N' },
  activity: { title: 'Ölçek okuma', instructions: ['Kâğıda 0, 2, 4, 6, 8 ve 10 N işaretli bir ölçek çiz.', 'Arkadaşının seçtiği çizgiyi okuyup değeri yaz.', '10 N sınırını aşan bir kuvvetin bu araçla neden ölçülmeyeceğini açıkla.'], reflection: 'Ölçeği okumak için çizgi sayısını mı, çizgiler arasındaki aralık sayısını mı kullanırsın?' },
  questions: [
   choice('Kuvvet hangi araçla ölçülür?', ['Termometre', 'Dinamometre', 'Saat', 'Dereceli silindir'], 'Dinamometre', 'Dinamometre kuvvetin büyüklüğünü ölçer.', 'Yaylı ölçme aracını düşün.'),
   truth('Kuvvet birimi newtondur.', true, 'Newton N simgesiyle gösterilir.', 'Kuvvet birimi ile kütle birimini ayır.'),
   fill('0–20 N ölçeği 10 eşit aralığa ayrılmışsa bir aralık kaç N’dir? Yalnız sayı yaz.', '2', '20 ÷ 10 = 2 N bulunur.', 'Toplam değeri aralık sayısına böl.'),
   choice('Kuvvet bir süngere uygulandığında hangisini değiştirebilir?', ['Yalnız rengini', 'Şeklini', 'Maddenin kimliğini kesin olarak', 'Hiçbir özelliğini'], 'Şeklini', 'Süngeri sıkmak şeklini değiştirir.', 'Sünger sıkıldığında ne olur?', 2),
   choice('En fazla 10 N ölçen dinamometreyle hangi kuvvet ölçülebilir?', ['8 N', '12 N', '20 N', '30 N'], '8 N', '8 N aracın sınırı içindedir; diğerleri sınırı aşar.', 'Ölçüm aralığını kontrol et.', 3),
   choice('Bir yay 2 N’de 1 birim, 4 N’de 2 birim uzuyor. Esneklik sınırı aşılmadığında 6 N için ne beklersin?', ['Hiç uzamamasını', '3 birim uzamasını', 'Aynı kalmasını', 'Kuvvetin yok olmasını'], '3 birim uzamasını', 'Verilen modelde kuvvet her 2 N arttığında uzama 1 birim artar.', 'Ölçümlerdeki düzeni sürdür.', 4),
  ],
 },
 {
  topicIds: ['topic-90db078102164f3c'],
  introduction: 'Kütle ve ağırlık günlük konuşmada karıştırılabilir. Kütle madde miktarıyla, ağırlık ise gök cisminin uyguladığı çekim kuvvetiyle ilgilidir.',
  sections: [
   { title: 'Kütle', body: ['Kütle, cismin madde miktarının bir ölçüsüdür. Gram ve kilogram yaygın kütle birimleridir. Eşit kollu teraziyle kütle karşılaştırılabilir.', 'Bir çantayı Dünya’dan Ay’a götürdüğümüzde çantadan madde eksilmezse kütlesi değişmez.'] },
   { title: 'Ağırlık', body: ['Ağırlık bir çekim kuvvetidir. Dinamometreyle ölçülür ve birimi newtondur. Aynı cismin ağırlığı farklı gök cisimlerinde değişebilir.', 'Ay’ın yüzeyindeki çekim Dünya’nınkinden daha zayıftır. Bu yüzden aynı cismin Ay’daki ağırlığı daha az, kütlesi ise aynıdır.'] },
  ],
  workedExample: { prompt: 'Dünya’da kütlesi 6 kg olan bir çanta Ay’a götürülürse kütlesine ve ağırlığına ne olur?', steps: ['Çantanın içindeki madde miktarı değişmiyor.', 'Bu nedenle kütlesi 6 kg kalır.', 'Ay’ın çekimi daha zayıf olduğundan çantanın ağırlığı azalır.'], answer: 'Kütle 6 kg olarak kalır; ağırlık azalır.' },
  activity: { title: 'Kavram kartları', instructions: ['Kâğıda kütle ve ağırlık başlıklı iki sütun çiz.', 'Gram, kilogram, newton, terazi ve dinamometre sözcüklerini uygun sütuna yaz.', 'Dünya’dan Ay’a giden bir cisim için değişen özelliği işaretle.'], reflection: '“Kütlem 40 N” cümlesinde hangi kavramlar karışmış?' },
  questions: [
   choice('Hangisi kütle birimidir?', ['Newton', 'Kilogram', 'Saniye', 'Derece Celsius'], 'Kilogram', 'Kilogram kütleyi, newton kuvveti belirtir.', 'Madde miktarı için kullanılan birimi bul.'),
   truth('Ağırlık bir kuvvettir.', true, 'Ağırlık, gök cisminin cisme uyguladığı çekim kuvvetidir.', 'Dinamometrenin neyi ölçtüğünü düşün.'),
   fill('Ağırlık ölçümünde kullanılan yaylı aracın adı nedir?', 'dinamometre', 'Ağırlık bir kuvvet olduğu için dinamometreyle ölçülür.', 'Kuvvet ölçme aracını hatırla.'),
   choice('Bir taş Dünya’dan Ay’a taşınırsa hangisi değişmeden kalır?', ['Kütlesi', 'Ağırlığı kesinlikle artar', 'Üzerindeki çekim kuvveti', 'Bulunduğu yer'], 'Kütlesi', 'Madde miktarı değişmediğinden kütlesi aynı kalır.', 'Taştan madde eksiliyor mu?', 2),
   choice('“Bu cismin ağırlığı 12 kg’dır.” cümlesi nasıl düzeltilir?', ['Ağırlık yerine kütle denir.', 'Kilogram yerine saniye denir.', 'Kütle hiç ölçülemez denir.', 'Ağırlık ile kütle tamamen aynıdır denir.'], 'Ağırlık yerine kütle denir.', 'Kilogram kütle birimidir; ağırlık newton ile ifade edilir.', 'Verilen birim hangi büyüklüğe ait?', 3),
   choice('Aynı cisme farklı gök cisimlerinde iki farklı ağırlık ölçülüyor. En uygun açıklama nedir?', ['Madde miktarı mutlaka değişmiştir.', 'Gök cisimlerinin çekim etkileri farklıdır.', 'Dinamometre kütleyi gramla ölçmüştür.', 'Cisim artık madde değildir.'], 'Gök cisimlerinin çekim etkileri farklıdır.', 'Ağırlık çekime bağlıdır; kütle aynı kalırken ağırlık değişebilir.', 'Değişen ortamın çekim etkisini düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-cb9c84d286b6327c'],
  introduction: 'Sürtünme, temas eden yüzeyler arasındaki hareketi veya hareket etme eğilimini zorlaştıran kuvvettir. Günlük yaşamda hem yararlı hem de istenmeyen etkileri vardır.',
  sections: [
   { title: 'Yüzeylerin etkisi', body: ['Aynı cisim ve koşullarda pürüzlü bir yüzey çoğu zaman harekete daha çok direnç gösterir. Buz gibi kaygan yüzeylerde yürümek zorlaşabilir.', 'Hava ve su da hareket eden cisimlere direnç uygular. Paraşüt geniş yüzeyiyle hava direncinden yararlanır.'] },
   { title: 'Sürtünmeyi artırma ve azaltma', body: ['Ayakkabı tabanındaki desenler ve araç frenleri sürtünmeden yararlanır. Yürürken yere tutunabilmemizde sürtünme önemlidir.', 'Bazı makine parçalarının yağlanması istenmeyen sürtünme ve aşınmayı azaltır. Bir deneyde yüzeyin etkisini karşılaştırırken cisim ve başlangıç koşulları aynı tutulur.'] },
  ],
  workedExample: { prompt: 'Aynı oyuncak araba aynı başlangıç koşuluyla halıda 20 cm, düz kartonda 60 cm ilerliyor. Ne çıkarılabilir?', steps: ['Araba ve başlangıç koşulu aynıdır; değişen yüzeydir.', 'Halıdaki araba daha kısa yol almıştır.', 'Bu deney koşullarında halının harekete daha fazla direnç gösterdiği sonucuna ulaşılır.'], answer: 'Bu deneyde halı yüzeyindeki sürtünme etkisi daha fazladır.' },
  activity: { title: 'Yüzeyleri karşılaştır', instructions: ['Bir silgi kutusunu masa üzerinde ve bir bez üzerinde parmağınla yavaşça kaydır.', 'Hangi yüzeyde hareketi sürdürmenin daha zor olduğunu not et.', 'Denemede aynı kutuyu ve benzer hareketi kullandığını belirt.'], reflection: 'İki denemede farklı kutular kullanılsaydı sonuca güvenmek neden zorlaşırdı?' },
  questions: [
   choice('Hangi olay sürtünmenin yararlı etkisine örnektir?', ['Frenin aracı yavaşlatması', 'Makine parçalarının aşınması', 'Ayakkabının eskimesi', 'Bir parçanın gereksiz ısınması'], 'Frenin aracı yavaşlatması', 'Frenlerde sürtünme hareketi yavaşlatmaya yardımcı olur.', 'Güvenli durmayı düşün.'),
   truth('Hava da hareket eden cisimlere direnç uygulayabilir.', true, 'Hava direnci bir sürtünme etkisidir.', 'Paraşütü düşün.'),
   fill('Geniş yüzeyiyle hava direncinden yararlanıp düşüşü yavaşlatan aracın adı nedir?', 'paraşüt', 'Paraşüt hava direncini artırarak düşüşü yavaşlatır.', 'Yavaş iniş için açılan geniş kumaşı düşün.'),
   choice('Makine parçasını yağlamak çoğunlukla hangi amaçla yapılır?', ['Sürtünmeyi azaltmak', 'Kütleyi yok etmek', 'Çekim kuvvetini kaldırmak', 'Yüzeyi mutlaka pürüzlendirmek'], 'Sürtünmeyi azaltmak', 'Yağlama temas yüzeyleri arasındaki istenmeyen sürtünmeyi azaltabilir.', 'Kolay kayan yüzeyleri düşün.', 2),
   choice('İki yüzeydeki sürtünmeyi karşılaştıran deneyde hangisi aynı tutulmalıdır?', ['Kullanılan cisim', 'Yüzeyin türü', 'Deneyin sonucu', 'İlerleme mesafesi'], 'Kullanılan cisim', 'Yüzey değişirken cisim ve başlangıç koşulları aynı tutulmalıdır.', 'Deneyde yalnız araştırılan etken değişsin.', 3),
   choice('Bir öğrenci “Sürtünme tamamen yok olsa yürümek kolaylaşır.” diyor. En uygun yanıt hangisidir?', ['Evet, ayakların yere tutunmasına gerek yoktur.', 'Hayır; yere tutunmak için de sürtünme gerekir.', 'Sürtünme yalnız suda olur.', 'Sürtünme yalnız cisimleri hızlandırır.'], 'Hayır; yere tutunmak için de sürtünme gerekir.', 'Ayağın geriye kaymadan ilerleyebilmesinde yüzeyle sürtünme önemlidir.', 'Buz üstünde yürümeyi düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-76e426764ab43c6f'],
  introduction: 'Hücre, canlıların temel yapı ve işlev birimidir. Birçok hücre çok küçük olduğundan ayrıntılarını görmek için mikroskop kullanılır.',
  sections: [
   { title: 'Temel kısımlar ve organeller', body: ['Bitki ve hayvan hücrelerinde hücre zarı, sitoplazma ve genellikle çekirdek bulunur. Zar madde geçişini düzenler; sitoplazma birçok yaşamsal olayın gerçekleştiği bölümdür.', 'Çekirdek hücrenin yönetiminde rol alır. Mitokondri enerjiyle ilgili süreçlerde görev yapar. Kofullar bazı maddelerin depolanmasında görev alır.'] },
   { title: 'Bitki hücresi ve canlıdaki düzen', body: ['Bitki hücrelerinde hücre zarının dışında hücre duvarı vardır. Fotosentez yapan yeşil bitki hücrelerinde kloroplast bulunur; her bitki hücresinde kloroplast bulunmak zorunda değildir.', 'Benzer görevli hücreler dokuları, dokular organları, organlar sistemleri oluşturur. Sistemler birlikte organizmanın yaşamını sürdürür.'] },
  ],
  workedExample: { prompt: 'Bir hücre modelinde zarın dışında duvar ve içeride kloroplastlar var. Bu model hangi hücreye uygundur?', steps: ['Hücre duvarı bitki hücrelerinde bulunur.', 'Kloroplastlar fotosentez yapan bitki hücreleriyle ilişkilidir.', 'Model bu özellikleri taşıyan bir bitki hücresini temsil eder.'], answer: 'Fotosentez yapan bir bitki hücresi.' },
  activity: { title: 'Hücre modeli çizimi', instructions: ['Bir bitki, bir hayvan hücresi çizimi yap.', 'İkisinde ortak bulunan zar, sitoplazma ve çekirdeği etiketle.', 'Bitki çiziminde duvarı ve fotosentez yapan hücre için kloroplastları göster.'], reflection: 'Modelindeki renklerin gerçek hücre renkleriyle aynı olması şart mı?' },
  questions: [
   choice('Canlıların temel yapı ve işlev birimi hangisidir?', ['Hücre', 'Gezegen', 'Kayaç', 'Ampul'], 'Hücre', 'Canlıların yaşamsal yapısının temelinde hücreler vardır.', 'Mikroskopla incelenen temel birimi düşün.'),
   truth('Hayvan hücrelerinde hücre duvarı bulunur.', false, 'Hücre duvarı bitki hücrelerinin özelliklerindendir; hayvan hücrelerinde yoktur.', 'Zar ile duvar aynı yapı değildir.'),
   fill('Hücrenin yönetiminde rol alan temel kısmın adı nedir?', 'çekirdek', 'Çekirdek hücrenin faaliyetlerinin yönetiminde görev alır.', 'Hücrenin yönetim merkezi olarak anlatılır.'),
   choice('Hücre zarının temel görevlerinden biri hangisidir?', ['Madde geçişini düzenlemek', 'Her hücrede fotosentez yapmak', 'Kemiği hareket ettirmek', 'Güneş ışığı üretmek'], 'Madde geçişini düzenlemek', 'Hücre zarı hücre ile çevre arasındaki madde geçişinde rol alır.', 'Hücrenin sınırını düşün.', 2),
   choice('Küçükten büyüğe doğru yapı sırası hangisidir?', ['Organ–hücre–doku–sistem', 'Hücre–doku–organ–sistem–organizma', 'Organizma–hücre–sistem–doku', 'Doku–sistem–hücre–organ'], 'Hücre–doku–organ–sistem–organizma', 'Benzer görevli hücreler doku; dokular organ; organlar sistem oluşturur.', 'En küçük yapıdan başla.', 3),
   choice('“Bir bitkinin bütün hücrelerinde mutlaka kloroplast vardır.” ifadesi için hangisi uygundur?', ['Doğrudur; kök hücreleri de mutlaka yeşildir.', 'Yanlıştır; örneğin birçok kök hücresi fotosentez yapmaz.', 'Doğrudur; hayvanlarda da hücre duvarı vardır.', 'Yanlıştır; hiçbir bitki hücresi kloroplast taşımaz.'], 'Yanlıştır; örneğin birçok kök hücresi fotosentez yapmaz.', 'Kloroplast fotosentezle ilişkilidir; her bitki hücresi fotosentez yapmaz.', 'Toprağın altındaki kök ile yeşil yaprağı karşılaştır.', 4),
  ],
 },
 {
  topicIds: ['topic-d5e13f401f560cec'],
  introduction: 'Destek ve hareket sistemi vücudumuza şekil verir, bazı organları korur ve hareket etmemize yardımcı olur. Kemikler, eklemler ve kaslar birlikte çalışır.',
  sections: [
   { title: 'Birlikte çalışan yapılar', body: ['İskelet kemiklerden oluşur. Kafatası beyni, göğüs kafesi kalp ve akciğerleri korumaya yardımcı olur. Kemiklerin birleştiği yerler eklemlerdir.', 'Kaslar kasılıp gevşeyerek kemiklerle birlikte hareketi sağlar. Her eklem aynı miktarda hareket etmez; örneğin kafatası kemikleri arasındaki eklemlerle dirsek farklıdır.'] },
   { title: 'Sistemin sağlığı', body: ['Dengeli beslenmek, yaşa uygun hareket etmek ve doğru duruş alışkanlığı kazanmak önemlidir. Çantayı gereksiz ağırlıkla doldurmamak ve iki askıyı kullanmak yükü dengeler.', 'Ani veya zorlayıcı hareketler, yüksekten atlama ve başkasının bedenini zorlamak güvenli değildir. Ağrı, düşme veya yaralanmada etkinlik bırakılır ve bir yetişkinden yardım istenir.'] },
  ],
  workedExample: { prompt: 'Bir öğrenci dirseğini büküyor. Kemik, eklem ve kasın görevini açıkla.', steps: ['Kol kemikleri destek sağlar.', 'Dirsek eklemi kemikler arasında harekete olanak verir.', 'Kasların kasılması ve gevşemesiyle kol bükülür veya açılır.'], answer: 'Hareket, kemiklerin, eklemin ve kasların birlikte çalışmasının sonucudur.' },
  activity: { title: 'Günlük duruş kontrolü', instructions: ['Oturduğun yerde sırtının ve ayaklarının konumuna dikkat et.', 'Çantandaki gereksiz eşyaları bir yetişkinle belirle.', 'Zorlayıcı hareket yapmadan dirseğinin hangi yönde hareket ettiğini gözlemle.'], reflection: 'Bir yapı tek başına bütün hareketi gerçekleştirebilir mi?' },
  questions: [
   choice('Kemiklerin birleştiği yerlere ne denir?', ['Eklem', 'Deri', 'Damar', 'Koful'], 'Eklem', 'Eklemler kemiklerin bir araya geldiği bölgelerdir.', 'Dirseğin birleşme yerini düşün.'),
   truth('Kaslar, kemikler ve eklemler hareket sırasında birlikte çalışır.', true, 'Hareket destek ve hareket sistemi yapılarının iş birliğiyle gerçekleşir.', 'Kolunu bükerken hangi yapılar görevlidir?'),
   fill('Beyni koruyan kemik yapının adı nedir?', 'kafatası', 'Kafatası beyni dış etkilerden korumaya yardımcı olur.', 'Başındaki kemik yapıyı düşün.'),
   choice('Destek ve hareket sistemini korumak için hangisi uygundur?', ['Çantayı gereksiz ağırlıkla doldurmak', 'Dengeli beslenmek ve yaşa uygun hareket etmek', 'Ağrıya rağmen zorlamaya devam etmek', 'Her zaman tek omuzda ağır çanta taşımak'], 'Dengeli beslenmek ve yaşa uygun hareket etmek', 'Beslenme ve güvenli hareket destek ve hareket sisteminin sağlığına katkı sağlar.', 'Vücudu destekleyen alışkanlığı seç.', 2),
   choice('Kafatası ve dirsekteki eklemler için hangi karşılaştırma doğrudur?', ['Hepsi aynı miktarda hareket eder.', 'Hareket yetenekleri farklıdır.', 'Dirsekte hiç eklem yoktur.', 'Kafatası yalnız kaslardan oluşur.'], 'Hareket yetenekleri farklıdır.', 'Eklemler vücutta farklı hareket özellikleri gösterir.', 'Baş kemikleri ile kolunun hareketini karşılaştır.', 3),
   choice('Bir öğrenci oyunda düştükten sonra kolunda ağrı hissediyor. En uygun davranış hangisidir?', ['Kolu daha çok zorlamak', 'Oyunu bırakıp yetişkinden yardım istemek', 'Arkadaşına kolunu sertçe çektirmek', 'Ağrıyı saklayıp devam etmek'], 'Oyunu bırakıp yetişkinden yardım istemek', 'Ağrı veya yaralanmada hareketi zorlamamak ve yetişkin desteği almak gerekir.', 'Yeni bir zorlanmanın önüne geç.', 4),
  ],
 },
 {
  topicIds: ['topic-695c2c09776797cc'],
  introduction: 'Bir ışık kaynağından çıkan ışık, aynı saydam ortamda doğrusal yollar izler. Bu yolları çizimlerde ışın adı verilen oklarla gösteririz.',
  sections: [
   { title: 'Işın modeli', body: ['Işın çizgisindeki ok ışığın yayılma yönünü gösterir. Bir ampulden ışık yalnız bir yöne değil farklı yönlere yayılabilir.', 'El feneri ışığı bir yöne yoğunlaştırır. Işığın doğrusal yayılması, önüne opak bir engel konduğunda arkasında ışık alamayan bölge oluşmasını açıklamaya yardım eder.'] },
   { title: 'Gözlem ve yorum', body: ['Üç kartondaki delikler aynı doğrultudayken bir kaynağın ışığı deliklerden geçebilir. Bir karton yana kaydırılırsa geçiş engellenebilir.', 'Bu düzenek ışığın aynı ortamda doğrusal yayıldığına kanıt sunar. Gözlem yaparken ışık doğrudan göze tutulmaz; lazer veya güçlü ışık kullanılmaz.'] },
  ],
  workedExample: { prompt: 'Aynı doğrultudaki üç delikten ışık geçerken ortadaki karton kaydırılınca neden geçmez?', steps: ['İlk durumda delikler ışığın doğrusal yolundadır.', 'Karton kayınca ışığın doğrusal yoluna opak bölüm gelir.', 'Işık, kartonu dolaşıp diğer deliğe yönelmediği için geçiş kesilir.'], answer: 'Deliklerin doğrultusu bozulduğu için karton ışığın yolunu engeller.' },
  activity: { title: 'Işın çizimi', instructions: ['Bir ampul resmi çiz.', 'Ampulden farklı yönlere giden düz çizgiler ekle.', 'Her çizgiye kaynaktan dışarıyı gösteren ok koy; bir opak engelde çizgiyi sonlandır.'], reflection: 'Okların hepsini ampule doğru çizmek neyi yanlış temsil eder?' },
  questions: [
   choice('Işık aynı saydam ortamda nasıl bir yol izler?', ['Doğrusal', 'Her zaman dairesel', 'Yalnız zikzak', 'Yalnız aşağı doğru'], 'Doğrusal', 'Işığın yolu ışın modelinde düz çizgilerle gösterilir.', 'Işın çizimini hatırla.'),
   truth('Bir ampulden çıkan ışık farklı yönlere yayılabilir.', true, 'Işık kaynağı çevresindeki farklı yönleri aydınlatabilir.', 'Odanın ortasındaki ampulü düşün.'),
   fill('Işığın yolunu ve yönünü gösteren oklu çizgiye ne denir?', 'ışın', 'Işın, ışığın yayılmasını temsil eden çizim modelidir.', 'Işık çiziminin adını yaz.'),
   choice('Işın üzerindeki ok neyi belirtir?', ['Işığın yayılma yönünü', 'Cismin kütlesini', 'Ortamın sıcaklığını', 'Işığın renginin adını'], 'Işığın yayılma yönünü', 'Ok, ışığın kaynaktan hangi yöne gittiğini gösterir.', 'Okların yön gösterme işlevini düşün.', 2),
   choice('Delikli karton deneyinde ortadaki karton yana kayınca ışığın geçmemesi neyi destekler?', ['Işığın doğrusal yayılmasını', 'Işığın hiç hareket etmemesini', 'Kartonun saydam olmasını', 'Kaynağın her zaman sönmesini'], 'Işığın doğrusal yayılmasını', 'Delikler aynı çizgi üzerinde olmayınca opak karton ışığın yolunu keser.', 'Deliklerin aynı hizada olup olmadığına bak.', 3),
   choice('Bir öğrenci düzeneği incelerken güçlü lazeri arkadaşının gözüne tutmak istiyor. Hangi karar uygundur?', ['Daha yakından bakmak', 'Bunu yapmayıp güvenli çizim veya öğretmen düzeneği kullanmak', 'Işığı göze daha uzun tutmak', 'Gözlük olmadan Güneş’e bakmak'], 'Bunu yapmayıp güvenli çizim veya öğretmen düzeneği kullanmak', 'Güçlü ışığın göze yöneltilmesi zararlıdır; öğrenme güvenli modellerle yapılmalıdır.', 'Göz güvenliğini sağlayan seçeneği seç.', 4),
  ],
 },
 {
  topicIds: ['topic-840c75d946d83152'],
  introduction: 'Maddeler ışığı geçirme durumlarına göre saydam, yarı saydam ve opak olarak sınıflandırılabilir. Bu özellik günlük eşya seçimlerini etkiler.',
  sections: [
   { title: 'Üç grubu ayırt et', body: ['Saydam maddeler ışığı büyük ölçüde geçirir; arkalarındaki cisimler seçilebilir. Temiz pencere camı buna örnektir.', 'Yarı saydam maddeler ışığın bir bölümünü geçirir fakat arkadaki cisimlerin ayrıntıları net görülmez. Buzlu cam ve yağlı kâğıt örnek olabilir. Opak maddeler ışığı geçirmez; tahta ve karton bu gruptadır.'] },
   { title: 'Bir özelliği amaca göre kullan', body: ['Pencerede dışarıyı görmek için saydam cam kullanılır. Mahremiyet sağlanırken aydınlık da istenirse yarı saydam malzemeden yararlanılabilir.', 'Sınıflandırma yalnız renge göre yapılmaz. Aynı malzemenin kalınlığı, yüzeyi ve yapısı ışık geçişini etkileyebilir.'] },
  ],
  workedExample: { prompt: 'Gün ışığı alan ama arkasındaki kişinin ayrıntısını göstermeyen bir bölme isteniyor. Hangi tür malzeme seçilir?', steps: ['Tamamen opak bir malzeme ışığı engeller.', 'Saydam malzeme arkayı net gösterebilir.', 'Yarı saydam malzeme ışığın bir bölümünü geçirir ve ayrıntıları gizler.'], answer: 'Yarı saydam bir malzeme.' },
  activity: { title: 'Malzeme kartları', instructions: ['Karton, temiz cam ve buzlu cam için üç kart hazırla.', 'Her birini saydam, yarı saydam veya opak grubuna yerleştir.', 'Kırılabilir camla deney yapmak yerine kitap görüntülerini kullan.'], reflection: 'Malzemenin rengini bilmek, ışığı geçirdiğine kesin karar vermek için yeterli mi?' },
  questions: [
   choice('Temiz pencere camı hangi gruba örnektir?', ['Saydam', 'Opak', 'Her durumda ışık kaynağı', 'Mıknatıs'], 'Saydam', 'Temiz pencere camı ışığı geçirir ve arka taraf görülebilir.', 'Pencereden dışarıyı görebildiğini düşün.'),
   truth('Opak maddeler ışığı geçirir ve arkalarını net gösterir.', false, 'Opak maddeler ışığı geçirmez.', 'Tahta bir kapının arkasını görebilir misin?'),
   fill('Işığın bir bölümünü geçirip arkayı net göstermeyen maddeye hangi ad verilir?', 'yarı saydam', 'Yarı saydam maddeler ışığın bir bölümünü geçirir ve ayrıntıyı dağıtır.', 'Saydam ile opak arasındaki grubu düşün.'),
   choice('Hangisi opak bir cisimdir?', ['Tahta levha', 'Temiz cam', 'Berrak su', 'Şeffaf dosya'], 'Tahta levha', 'Tahta levha ışığı geçirmez.', 'Arkasını göremediğin cismi bul.', 2),
   choice('Buzlu cam ile temiz cam arasındaki temel fark hangisidir?', ['İkisinin de mutlaka ışık üretmesi', 'Arkalarındaki ayrıntıyı gösterme durumlarının farklı olması', 'Buzlu camın her zaman erimesi', 'Temiz camın opak olması'], 'Arkalarındaki ayrıntıyı gösterme durumlarının farklı olması', 'Buzlu cam yarı saydam, temiz cam saydam davranır.', 'Görüntünün netliğini karşılaştır.', 3),
   choice('Bir kutunun içinde karanlık alan oluşturmak için duvarlarda hangi özellik istenir?', ['Işığı geçirmemesi', 'Arkayı net göstermesi', 'Tam saydam olması', 'Işık kaynağı olması'], 'Işığı geçirmemesi', 'Opak duvarlar dışarıdan gelen ışığın içeri geçmesini engeller.', 'Karanlık için ışığın yoluna ne yapılmalı?', 4),
  ],
 },
 {
  topicIds: ['topic-8572b4aacb341f25', 'topic-efb3d89b013634a7'],
  introduction: 'Işığın önüne opak bir cisim konulduğunda cismin arkasında kaynaktan ışık alamayan bir bölge oluşur. Ekran üzerindeki bu karanlık bölge tam gölge olarak gözlenebilir.',
  sections: [
   { title: 'Gölge oluşması için', body: ['Bir ışık kaynağı, opak bir cisim ve gölgenin görülebileceği ekran kullanılır. Işık doğrusal yayıldığı için opak engelin arkasına doğrudan ulaşamaz.', 'Gölge cismin birebir renkli görüntüsü değildir; ışık almayan bölgedir. Saydam cisim ile opak cismin ışığı engellemesi aynı değildir.'] },
   { title: 'Boyutu etkileyen konum', body: ['Küçük bir ışık kaynağı ve sabit ekran kullanılırsa cismi kaynağa yaklaştırmak gölgeyi genellikle büyütür. Cismi ekrana yaklaştırmak gölgeyi küçültür.', 'Adil karşılaştırmada her seferinde yalnız bir uzaklık değiştirilir. Kaynak, cisim ve ekran arasındaki doğrultu korunur.'] },
  ],
  workedExample: { prompt: 'El feneri ve duvar sabitken kartonu el fenerine yaklaştırıyorsun. Gölge için ne beklersin?', steps: ['Işık kaynağı ve ekranın yerleri sabittir.', 'Opak kartonun kaynağa uzaklığı azalır.', 'Işınların karton tarafından engellenen bölgesi ekranda daha geniş olabilir.'], answer: 'Bu düzende karton kaynağa yaklaştıkça gölgesi büyür.' },
  activity: { title: 'Kâğıt üzerinde gölge modeli', instructions: ['Bir ışık kaynağı noktası, opak bir cisim ve ekran çiz.', 'Kaynaktan cismin üst ve alt kenarına değen düz ışınlar çiz.', 'Işınları ekrana uzatıp aradaki ışık alamayan bölgeyi tara.'], reflection: 'Cismin yerini değiştirirken ekranı da değiştirirsen hangi etkenin sonucu oluşturduğunu anlayabilir misin?' },
  questions: [
   choice('Belirgin tam gölge oluşturmak için hangi cisim uygundur?', ['Opak karton', 'Temiz pencere camı', 'Işık kaynağı olmayan boşluk', 'Saydam dosya'], 'Opak karton', 'Opak karton ışığın geçişini engeller.', 'Işığı geçirmeyen malzemeyi seç.'),
   truth('Tam gölge, cismin arkasında kaynaktan ışık alamayan bölgedir.', true, 'Opak cisim doğrudan ışığı engellediğinde bu karanlık bölge oluşur.', 'Gölgenin neden karanlık olduğunu düşün.'),
   fill('Işığı geçirmeyen maddelere ne denir? Tek sözcük yaz.', 'opak', 'Opak maddeler ışığı geçirmez ve belirgin gölge oluşturabilir.', 'Tahta ve kartonun grubunu hatırla.'),
   choice('Işık kaynağı ve ekran sabitken cisim kaynağa yaklaştırılırsa gölge genellikle nasıl değişir?', ['Büyür', 'Kesinlikle kaybolur', 'Işık kaynağına dönüşür', 'Renkli bir fotoğraf olur'], 'Büyür', 'Bu düzende kaynağa yakın cisim ekranda daha geniş bir bölgeyi engeller.', 'El fenerine yakın elinin duvardaki gölgesini düşün.', 2),
   choice('Gölge boyutuna cisim konumunun etkisi araştırılıyor. Hangisi sabit tutulmalıdır?', ['Işık kaynağı ve ekranın konumu', 'Cismin kaynağa uzaklığı', 'Gölgenin boyutu', 'Araştırılan etken'], 'Işık kaynağı ve ekranın konumu', 'Yalnız cismin konumu değiştirilirse etki daha doğru karşılaştırılır.', 'Bir deneyde tek değişkeni değiştir.', 3),
   choice('Bir öğrenci cismin üzerindeki yazının gölgede okunmadığını görüyor. Bunun nedeni nedir?', ['Gölge cismin renkli görüntüsü değil, ışık alamayan bölgedir.', 'Yazı gölgenin içinde yok olmuştur.', 'Karton mutlaka saydamdır.', 'Işık yalnız eğri yolda gider.'], 'Gölge cismin renkli görüntüsü değil, ışık alamayan bölgedir.', 'Gölge, cismin yüzey ayrıntılarını değil ışığın engellendiği alanı temsil eder.', 'Gölge ile fotoğraf arasındaki farkı düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-22428e1e56e47e77', 'topic-0f252e08694f2229'],
  introduction: 'Maddeler çok küçük taneciklerden oluşur. Tanecikler arasında boşluk vardır ve tanecikler hareket eder. Bu özellikler maddenin hâllerini anlamamıza yardım eder.',
  sections: [
   { title: 'Katı, sıvı ve gaz modeli', body: ['Katı tanecikleri birbirine yakın ve daha düzenli yerleşmiştir; bulundukları yerde titreşim hareketi yapar. Katıların belirli şekli ve hacmi vardır.', 'Sıvı tanecikleri birbirine yakın olmasına rağmen birbirlerinin yanından kayabilir. Sıvılar kabın şeklini alır. Gaz tanecikleri arasındaki boşluk genellikle çok daha fazladır; gazlar bulundukları kabı doldurur.'] },
   { title: 'Sıkıştırılma ve tanecik hareketi', body: ['Gazların kolay sıkıştırılmasının nedeni tanecikleri arasındaki büyük boşluklardır. Sıkıştırılırken taneciklerin kendileri küçülmez; aralarındaki boşluk azalır.', 'Tanecik modellerindeki yuvarlaklar büyütülmüş temsillerdir. Katı tanecikleri de hareketlidir; “katı hareket etmez” ifadesi tanecikler için doğru değildir.'] },
  ],
  workedExample: { prompt: 'Kapalı bir kapta gaz sıkıştırılıyor. Tanecik sayısı aynıysa ne değişir?', steps: ['Kapta yeni tanecik oluşmaz ve tanecikler yok olmaz.', 'Taneciklerin kendi büyüklükleri küçülmüş sayılmaz.', 'Tanecikler arasındaki boşluk azalır ve gaz daha küçük hacme sığar.'], answer: 'Tanecikler arasındaki boşluk azalır.' },
  activity: { title: 'Tanecik çizimleri', instructions: ['Üç eşit kutuya katı, sıvı ve gaz için tanecik modelleri çiz.', 'Katı ve sıvıda tanecikleri yakın; gazda daha uzak göster.', 'Gazı daha küçük bir kutuda, aynı sayıda tanecikle yeniden çiz.'], reflection: 'Gaz sıkışınca çizimde hangi uzaklık değişti?' },
  questions: [
   choice('Hangi hâlde tanecikler arasındaki boşluk genellikle en fazladır?', ['Gaz', 'Sıvı', 'Katı', 'Hepsinde mutlaka aynıdır'], 'Gaz', 'Gaz tanecikleri birbirinden daha uzak bulunur.', 'Kolay sıkıştırılan hâli düşün.'),
   truth('Katı maddelerin tanecikleri hiç hareket etmez.', false, 'Katı tanecikleri bulundukları yerde titreşim yapar.', 'Yer değiştirmemek, hiç hareket etmemek demek midir?'),
   fill('Gaz sıkıştırıldığında tanecikler arasındaki boşluk artar mı azalır mı?', 'azalır', 'Sıkıştırma tanecikler arasındaki boşluğu azaltır.', 'Aynı taneciklerin daha küçük hacme sığmasını düşün.'),
   choice('Hangi madde hâli bulunduğu kabın tamamına yayılır?', ['Gaz', 'Sabit biçimli taş', 'Metal kaşık', 'Tahta blok'], 'Gaz', 'Gazlar tanecik hareketi ve boşlukları nedeniyle bulundukları kabı doldurur.', 'Odadaki havayı düşün.', 2),
   choice('Su bardağa aktarılınca şekli değişirken hangi açıklama uygundur?', ['Su tanecikleri yok olur.', 'Sıvı tanecikleri birbirlerinin yanından kayabilir.', 'Su mutlaka gaz olur.', 'Tanecikler tamamen durur.'], 'Sıvı tanecikleri birbirlerinin yanından kayabilir.', 'Bu hareketlilik sıvıların kabın biçimini almasını sağlar.', 'Sıvı ile katı arasındaki düzen farkını düşün.', 3),
   choice('Bir modelde gaz sıkıştırılırken tanecikler daha küçük çizilmiş. Model nasıl düzeltilir?', ['Tanecikler aynı boyda, aralarındaki boşluk daha az çizilir.', 'Tanecik sayısı sıfırlanır.', 'Tanecikler tamamen hareketsiz çizilir.', 'Her tanecik yeni bir maddeye dönüştürülür.'], 'Tanecikler aynı boyda, aralarındaki boşluk daha az çizilir.', 'Sıkıştırılma taneciklerin küçülmesiyle değil aralarındaki boşluğun azalmasıyla modellenir.', 'Değişen tanecik boyu mu, tanecikler arası uzaklık mı?', 4),
  ],
 },
 {
  topicIds: ['topic-9e13f887b386f110'],
  introduction: 'Sıcaklık ile ısı aynı şey değildir. Sıcaklık termometreyle ölçülen bir büyüklüktür; ısı ise sıcaklık farkı nedeniyle aktarılan enerjidir.',
  sections: [
   { title: 'İki kavramı ayırt et', body: ['Sıcaklık için günlük yaşamda derece Celsius (°C) kullanılır. “Suyun sıcaklığı 25 °C” ifadesi bir sıcaklık ölçümüdür.', 'Isı bir enerji aktarımıdır; joule veya kalori gibi birimlerle ifade edilir. “Isısı 25 °C” demek bu iki kavramı karıştırır.'] },
   { title: 'Isı alışverişi', body: ['Temas eden ve sıcaklıkları farklı olan maddeler arasında, yüksek sıcaklıktakinden düşük sıcaklıktakine doğru ısı aktarılır.', 'Çevreyle enerji alışverişi ihmal edilirse ısı alışverişi sıcaklıklar eşitleninceye kadar sürer. Eşit kütlede aynı sıvının karışımı, uygun koşullarda başlangıç sıcaklıklarının ortasına yakın bir değere ulaşabilir; her karışımın sıcaklığı yalnız ortalama alınarak bulunmaz.'] },
  ],
  workedExample: { prompt: 'Yalıtılmış kabul edilen kapta eşit kütlede 20 °C ve 40 °C su karıştırılıyor. Isı hangi yönde aktarılır?', steps: ['40 °C suyun sıcaklığı daha yüksektir.', 'Isı 40 °C sudan 20 °C suya aktarılır.', 'Eşit kütlede aynı sıvı için, ideal koşulda son sıcaklık 30 °C olur.'], answer: 'Isı sıcak sudan soğuk suya aktarılır; verilen ideal koşulda 30 °C’de denge beklenir.' },
  activity: { title: 'Sıcaklık verisini yorumla', instructions: ['Deney yapmadan 20 °C, 30 °C ve 40 °C sıcaklık kartları hazırla.', 'Hangi iki kart arasında temas olsa ısı aktarımının yönünü okla çiz.', 'Aynı sıcaklıktaki kartlar için net ısı aktarımı olup olmadığını belirt.'], reflection: 'Sıcaklık birimini kullanarak ısı miktarını bildirmek neden yanlıştır?' },
  questions: [
   choice('Sıcaklık hangi araçla ölçülür?', ['Termometre', 'Dinamometre', 'Eşit kollu terazi', 'Cetvel'], 'Termometre', 'Termometre sıcaklık ölçer.', '°C değerini gösteren aracı düşün.'),
   truth('Isı ve sıcaklık aynı kavramın iki adıdır.', false, 'Isı enerji aktarımı, sıcaklık ise termometreyle ölçülen farklı bir büyüklüktür.', 'Birimlerinin de farklı olduğunu hatırla.'),
   fill('20 °C ve 40 °C maddeler temas ettiğinde ısı, sıcaklığı yüksek olandan hangi sıcaklıktakine aktarılır? “Düşük” veya “yüksek” yaz.', 'düşük', 'Isı yüksek sıcaklıktan düşük sıcaklığa doğru aktarılır.', 'Sıcak bir içeceğin soğumasını düşün.'),
   choice('Hangi ifade doğrudur?', ['Suyun sıcaklığı 25 °C’dir.', 'Suyun ısısı 25 °C’dir.', 'Sıcaklık kilogramla ölçülür.', 'Termometre ağırlık ölçer.'], 'Suyun sıcaklığı 25 °C’dir.', 'Derece Celsius sıcaklık birimidir.', 'Ölçülen büyüklük ile birimi eşleştir.', 2),
   choice('Çevreyle alışveriş olmayan iki madde arasında net ısı alışverişi ne zaman sona erer?', ['Sıcaklıkları eşitlenince', 'Kütleleri mutlaka eşit olunca', 'Renkleri aynı olunca', 'Biri mutlaka buharlaşınca'], 'Sıcaklıkları eşitlenince', 'Sıcaklık farkı kalmadığında net ısı aktarımı olmaz.', 'Isı aktarımının nedenini hatırla.', 3),
   choice('İdeal yalıtılmış kapta eşit kütlede 20 °C ve 40 °C su karışırsa hangi son sıcaklık beklenir?', ['10 °C', '30 °C', '50 °C', '60 °C'], '30 °C', 'Verilen eşit kütlede aynı sıvı ve ideal yalıtım koşullarında ortadaki değer 30 °C’dir.', '(20 + 40) ÷ 2 işlemini kullan; bunun özel koşullarını unutma.', 4),
  ],
 },
 {
  topicIds: ['topic-ff867552a5acdf4a'],
  introduction: 'Bir madde ısı alarak veya ısı vererek hâl değiştirebilir. Hâl değişiminde maddenin taneciklerinin düzeni ve hareketi değişir; her değişimde yeni bir madde oluşmaz.',
  sections: [
   { title: 'Isı alan değişimler', body: ['Katıdan sıvıya geçiş erime, sıvıdan gaza geçiş buharlaşmadır. Buzun erimesi ve ıslak çamaşırın kuruması örnektir.', 'Buharlaşma sıvının yüzeyinde farklı sıcaklıklarda gerçekleşebilir. Kaynama ise uygun basınçta belirli bir sıcaklıkta sıvının her yerinde kabarcıklarla gerçekleşir.'] },
   { title: 'Isı veren değişimler', body: ['Sıvıdan katıya geçiş donma, gazdan sıvıya geçiş yoğuşmadır. Soğuk bir kabın dışındaki su damlacıkları, havadaki su buharının yoğuşmasıyla oluşabilir.', 'Bazı maddelerde katıdan doğrudan gaza süblimleşme, gazdan doğrudan katıya kırağılaşma görülebilir. Her hâl değişimi için güvenli resim ve gözlem kayıtları kullanılabilir; kaynar suyla deney yapılmaz.'] },
  ],
  workedExample: { prompt: 'Soğuk bir su şişesinin dış yüzeyinde damlalar görülüyor. Şişe delik değilse damlalar nereden gelir?', steps: ['Havada görünmeyen su buharı bulunabilir.', 'Su buharı soğuk yüzeyin yakınında ısı verir.', 'Gaz hâlindeki su sıvı damlalara dönüşür.'], answer: 'Havadaki su buharı yoğuşarak damlaları oluşturur.' },
  activity: { title: 'Hâl değişimi okları', instructions: ['Katı, sıvı ve gaz başlıklı üç kutu çiz.', 'Aralarındaki okları erime, donma, buharlaşma ve yoğuşma diye adlandır.', 'Her ok için günlük yaşamdan bir örnek yaz.'], reflection: 'Çamaşırların kuruması için suyun mutlaka kaynaması gerekir mi?' },
  questions: [
   choice('Buzun sıvı suya dönüşmesi hangi değişimdir?', ['Erime', 'Donma', 'Yoğuşma', 'Kırağılaşma'], 'Erime', 'Katıdan sıvıya geçiş erimedir.', 'Buz katı, su sıvıdır.'),
   truth('Buharlaşma yalnız kaynama sıcaklığında gerçekleşir.', false, 'Buharlaşma sıvı yüzeyinde farklı sıcaklıklarda olabilir.', 'Oda sıcaklığında kuruyan çamaşırı düşün.'),
   fill('Gaz hâlindeki suyun sıvı damlalara dönüşmesine ne denir?', 'yoğuşma', 'Gazdan sıvıya geçiş yoğuşmadır.', 'Soğuk camda oluşan damlaları düşün.'),
   choice('Hangisi maddenin ısı verdiği bir değişimdir?', ['Suyun donması', 'Buzun erimesi', 'Suyun buharlaşması', 'Katının süblimleşmesi'], 'Suyun donması', 'Donarken madde çevresine ısı verir.', 'Sıvıdan katıya geçişi bul.', 2),
   choice('Soğuk şişenin dışında oluşan damlaların kaynağı çoğunlukla nedir?', ['Havadaki su buharı', 'Şişenin plastik hâlinin suya dönüşmesi', 'Şişenin ışık üretmesi', 'Havanın tamamen yok olması'], 'Havadaki su buharı', 'Su buharı soğuk yüzeyde yoğuşur.', 'Şişenin dışındaki ortamda su hangi hâlde bulunabilir?', 3),
   choice('Bir öğrenci “Su kaynamadığı için ıslak mendil kuruyamaz.” diyor. Hangi kanıt bu düşünceyi düzeltir?', ['Oda sıcaklığında mendilin zamanla kuruması', 'Taşın şeklini koruması', 'Ampulün ışık vermesi', 'Mıknatısın demiri çekmesi'], 'Oda sıcaklığında mendilin zamanla kuruması', 'Bu gözlem, kaynama olmadan da buharlaşma gerçekleşebildiğini gösterir.', 'Buharlaşma ile kaynamayı ayıran bir gözlem seç.', 4),
  ],
 },
 {
  topicIds: ['topic-9defa90f5ced4832'],
  introduction: 'Maddeler ısıyı aynı hızla iletmez. Isıyı iyi ileten malzemeler bazı işlerde yararlı olurken, ısı geçişini azaltan malzemeler yalıtımda kullanılır.',
  sections: [
   { title: 'İletken ve yalıtkan', body: ['Metaller ısıyı çoğu zaman iyi iletir. Bu nedenle pişirme kaplarının gövdelerinde metal kullanılabilir. Tahta, plastik ve yün gibi malzemeler metallerden daha zayıf iletkendir.', 'Isı yalıtkanı “ısıyı hiç geçirmez” demek değildir; ısı aktarımını azaltır veya yavaşlatır. Kapların saplarında uygun yalıtkan malzeme kullanılması elin korunmasına yardımcı olur.'] },
   { title: 'Yalıtım ve enerji', body: ['Binalarda ısı yalıtımı kışın içeriden dışarıya, yazın dışarıdan içeriye istenmeyen ısı geçişini azaltır. Böylece ısıtma ve soğutma için daha az enerji gerekebilir.', 'Yalıtım deneyinde eş kaplar, eş miktarda su ve aynı başlangıç sıcaklığı kullanılmalıdır. Kapların yalnız sarıldığı malzeme değiştirilerek sıcaklık değişimleri karşılaştırılır.'] },
  ],
  workedExample: { prompt: 'Bir tencerenin gövdesi metal, tutma sapı uygun bir yalıtkan malzemeden yapılmış. Bu seçimler neden farklı?', steps: ['Gövdenin ısıyı yiyeceğe aktarması istenir.', 'Sapta ise ele ulaşan ısı aktarımının azaltılması istenir.', 'İletken ve yalıtkan malzemeler farklı görevlerde kullanılır.'], answer: 'Metal gövde ısıyı iletir; yalıtkan sap ele ısı geçişini azaltır.' },
  activity: { title: 'Yalıtım tasarımı', instructions: ['Bir kutunun sıcaklığını daha uzun süre korumak için kâğıt üzerinde tasarım yap.', 'Dış duvar, kapak ve hava boşluğu gibi parçaları çiz.', 'Sıcak su veya elektrik kullanmadan, seçtiğin malzemenin görevini açıkla.'], reflection: 'Bir yalıtkan, hem sıcak hem soğuk içeriğin sıcaklık değişimini yavaşlatabilir mi?' },
  questions: [
   choice('Hangi malzeme genellikle ısıyı iyi iletir?', ['Metal', 'Yün', 'Tahta', 'Hava içeren köpük'], 'Metal', 'Metaller birçok yalıtım malzemesine göre iyi ısı iletkenidir.', 'Tencere gövdesini düşün.'),
   truth('Isı yalıtımı, istenmeyen ısı geçişini azaltmaya yardım eder.', true, 'Yalıtım ısı aktarımını yavaşlatarak enerji tasarrufuna katkı sağlar.', 'Yalıtımlı bir evin sıcaklığını düşün.'),
   fill('“Isı ___, ısı geçişini azaltan uygulamadır.” Boşluğa uygun sözcüğü yaz.', 'yalıtımı', 'Isı yalıtımı, ısı geçişini azaltan uygulamalardır.', 'Yalıtkan malzemenin kullanıldığı uygulamanın adını tamamla.'),
   choice('Tencere sapının uygun bir yalıtkandan yapılmasının amacı nedir?', ['Ele ısı aktarımını azaltmak', 'Suyu kesinlikle dondurmak', 'Isı üretmek', 'Tencerenin kütlesini yok etmek'], 'Ele ısı aktarımını azaltmak', 'Sapta düşük ısı iletimi, eli korumaya yardımcı olur; yine de sıcak eşyalara yetişkin desteği olmadan dokunulmaz.', 'Sapı tutan eli düşün.', 2),
   choice('Farklı yalıtım malzemeleri karşılaştırılırken hangi özellik aynı tutulmalıdır?', ['Suyun başlangıç sıcaklığı', 'Sarılacak malzemenin türü', 'Araştırılan malzeme', 'Sonuç sıcaklığı'], 'Suyun başlangıç sıcaklığı', 'Başlangıç koşulları aynı olursa malzemenin etkisi karşılaştırılabilir.', 'Adil deney için başlangıçları eşitle.', 3),
   choice('“Yalıtım yalnız kışın işe yarar.” ifadesi için hangisi uygundur?', ['Doğrudur, yazın ısı aktarımı olmaz.', 'Yanlıştır; yazın dışarıdan içeriye ısı geçişini de azaltır.', 'Doğrudur, yalıtım sürekli ısı üretir.', 'Yanlıştır; yalıtım bütün ısıyı yok eder.'], 'Yanlıştır; yazın dışarıdan içeriye ısı geçişini de azaltır.', 'Yalıtım sıcaklık farkından doğan aktarımı iki yönde de yavaşlatabilir.', 'Sıcak dış ortamdan daha serin eve aktarılan ısıyı düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-69b9626166ee3111', 'topic-80d6d54eafa04e87'],
  introduction: 'Elektrik devresi, elektrik enerjisinin kullanılmasını sağlayan bağlantılardan oluşur. Şemalar devreyi ortak sembollerle sade biçimde anlatır.',
  sections: [
   { title: 'Devre elemanları', body: ['Pil enerji kaynağıdır; ampul elektrik enerjisini ışığa dönüştürür. Bağlantı kabloları devre yolunu oluşturur. Anahtar yolu açıp kapatır.', 'Basit devrede ampulün ışık vermesi için uygun bağlantılarla kapalı bir yol oluşturulmalıdır. Açık anahtar veya kopuk kablo devreyi kesebilir.'] },
   { title: 'Sembolle gösterme', body: ['Pil sembolünde uzun ve kısa paralel çizgiler, ampul sembolünde içinde çapraz çizgi bulunan daire yaygın olarak kullanılır. Kablolar çizgilerle gösterilir.', 'Şemayı gerçek parçaların resmi gibi çizmek yerine sembolleri bağlantı sırasına göre yerleştiririz. Pil yuvası ve duy gibi yardımcı parçalar ayrı devre işlevi taşımadıkları için basit şemada ayrıca gösterilmeyebilir. Yalnız öğretmen gözetiminde düşük gerilimli pil düzenekleri kullanılır; prizlere bağlanılmaz.'] },
  ],
  workedExample: { prompt: 'Bir pil, bir ampul ve açık anahtarlı devrede ampul yanmıyor. Pilin dolu olduğu biliniyorsa önce ne incelenir?', steps: ['Devrede enerjinin aktarılabilmesi için kapalı yol gerekir.', 'Açık anahtar bu yolu kesmektedir.', 'Öğretmen gözetimindeki uygun pil devresinde anahtar kapatıldığında yol tamamlanabilir.'], answer: 'Açık anahtar nedeniyle kesilen devre yolu kontrol edilir.' },
  activity: { title: 'Kâğıt üzerinde devre şeması', instructions: ['Pil, ampul ve anahtar sembollerini çiz.', 'Sembolleri kablo çizgileriyle kapalı bir yol oluşturacak biçimde birleştir.', 'İkinci çizimde anahtarı açık göster ve farkı açıkla; gerçek elektrik bağlantısı kurma.'], reflection: 'Şemadaki bağlantı çizgisi koparsa ampulün yanması neden beklenmez?' },
  questions: [
   choice('Basit devrede enerji kaynağı hangi elemandır?', ['Pil', 'Ampulün camı', 'Yalnız kablo', 'Duyun rengi'], 'Pil', 'Pil devreye enerji sağlar.', 'Enerjiyi sağlayan elemanı bul.'),
   truth('Açık anahtar devredeki kesintisiz yolu tamamlar.', false, 'Açık anahtar yolu keser; kapalı anahtar uygun bağlantıda yolu tamamlar.', 'Açık ile kapalı devreyi ayır.'),
   fill('Devre yolunu açıp kapatan elemana ne denir?', 'anahtar', 'Anahtar bağlantı yolunu açıp kapatır.', 'Elektrikteki aç-kapa elemanını düşün.'),
   choice('Ampulün ışık vermesi için hangi koşul gereklidir?', ['Uygun kapalı bir devre yolu', 'Mutlaka kopuk bir kablo', 'Yalnız resmin güzel çizilmesi', 'Pilin devreden çıkarılması'], 'Uygun kapalı bir devre yolu', 'Enerji aktarımı için uygun, kesintisiz bağlantı gerekir.', 'Yolun tamamlanıp tamamlanmadığını düşün.', 2),
   choice('Devre şemasında ortak semboller kullanmanın yararı nedir?', ['Bağlantıları anlaşılır ve sade göstermek', 'Elektrik enerjisini yok etmek', 'Pilin kütlesini değiştirmek', 'Bütün devreleri prizle çalıştırmak'], 'Bağlantıları anlaşılır ve sade göstermek', 'Semboller devre elemanlarını ve bağlantıları ortak bir dille temsil eder.', 'Bir şemayı başkasının da okuyabilmesini düşün.', 3),
   choice('Bir çocuk çizdiği devreyi denemek istiyor. Güvenli seçim hangisidir?', ['Öğretmen gözetiminde uygun düşük gerilimli pil düzeneği kullanmak', 'Kabloları prize sokmak', 'Evdeki elektrik panosunu açmak', 'Islak elle prize dokunmak'], 'Öğretmen gözetiminde uygun düşük gerilimli pil düzeneği kullanmak', 'Şebeke elektriği tehlikelidir; öğrenme için uygun pil düzenekleri yetişkin gözetiminde kullanılmalıdır.', 'Priz içermeyen ve gözetimli seçeneği bul.', 4),
  ],
 },
 {
  topicIds: ['topic-bbd8a3b79e21002c'],
  introduction: 'Bir ampulün parlaklığı devrenin özelliklerinden etkilenebilir. Hangi etkenin nasıl sonuç doğurduğunu anlamak için değişkenler dikkatle kontrol edilir.',
  sections: [
   { title: 'Pil ve ampul sayısı', body: ['Özdeş ve uygun piller aynı yönde seri bağlandığında, ampulün sınırları aşılmıyorsa tek ampulün parlaklığı genellikle artar.', 'Aynı pil ve özdeş ampullerle kurulan seri devrede ampul sayısı arttığında ampuller genellikle daha sönük yanar. Bu çıkarım bütün bağlantı biçimlerine gelişigüzel uygulanmaz.'] },
   { title: 'Adil bir deney', body: ['Pil sayısının etkisi araştırılıyorsa ampul sayısı ve türü ile bağlantı biçimi aynı tutulur. Yalnız pil sayısı değiştirilir.', 'Değiştirilen etken bağımsız değişken, gözlenen parlaklık bağımlı değişkendir. Aynı tutulan etkenler kontrol değişkenleridir. Kısa devre yapılmaz; uygun araçlar öğretmen gözetiminde kullanılır.'] },
  ],
  workedExample: { prompt: 'A düzeneğinde bir pil ve bir ampul, B düzeneğinde iki uygun özdeş pil ve aynı ampul var. Bağlantı seri ve piller aynı yönde. Hangi etken araştırılıyor?', steps: ['İki düzeneğin ampulü ve bağlantı biçimi aynı.', 'Pil sayısı birden ikiye değişiyor.', 'Bu nedenle pil sayısının ampul parlaklığına etkisi araştırılıyor.'], answer: 'Bağımsız değişken pil sayısı; bağımlı değişken ampul parlaklığıdır.' },
  activity: { title: 'Deney planı çiz', instructions: ['Bir ve iki pilli iki devrenin şemasını kâğıda çiz.', 'İkisinde aynı ampul ve bağlantı biçimini kullandığını belirt.', 'Tahminini yaz; gerçek bağlantıyı öğretmen gözetimi olmadan kurma.'], reflection: 'Aynı anda hem pil hem ampul sayısı değişirse sonucun nedenini kesin söyleyebilir misin?' },
  questions: [
   choice('Pil sayısının parlaklığa etkisi araştırılırken hangisi değiştirilir?', ['Pil sayısı', 'Hem pil hem ampul türü', 'Bütün bağlantı biçimleri', 'Ampulün rengi ve sayısı birlikte'], 'Pil sayısı', 'Araştırılan etken pil sayısı olduğundan yalnız bu etken değiştirilmelidir.', 'Soruda araştırılan etkene odaklan.'),
   truth('Adil bir deneyde bütün değişkenleri aynı anda değiştirmek gerekir.', false, 'Tek etken değiştirilip diğer koşullar kontrol edilir.', 'Sonucun hangi etkenden kaynaklandığını anlayabilmek gerekir.'),
   fill('Pil sayısı değiştirilen bir deneyde gözlenen ampul parlaklığı bağımlı mı bağımsız mı değişkendir?', 'bağımlı', 'Parlaklık ölçülen veya gözlenen sonuçtur; bağımlı değişkendir.', 'Değiştirilenle gözlenen sonucu ayır.'),
   choice('Uygun özdeş piller aynı yönde seri bağlanıp sayısı artırıldığında, ampul sınırı aşılmıyorsa ne beklenir?', ['Ampulün genellikle daha parlak yanması', 'Pilin tamamen yok olması', 'Ampulün mutlaka kütlesinin artması', 'Kablonun ışığa dönüşmesi'], 'Ampulün genellikle daha parlak yanması', 'Verilen uygun seri devre koşullarında pil sayısı arttıkça parlaklık artabilir.', 'Devreye sağlanan enerji koşulunu düşün.', 2),
   choice('Aynı pille seri devrede özdeş ampul sayısı artırılırsa genellikle ne olur?', ['Ampuller daha sönük yanar.', 'Bütün bağlantılarda kesinlikle daha parlak yanar.', 'Pil sayısı kendiliğinden artar.', 'Devre artık elektrik içermez.'], 'Ampuller daha sönük yanar.', 'Aynı pil ile seri bağlanan ampul sayısı arttığında parlaklık genellikle azalır.', 'Soruda seri bağlantı koşuluna dikkat et.', 3),
   choice('A düzeneğinde bir pil-bir ampul, B’de iki pil-üç ampul var. “Fark yalnız pil sayısındandır.” denebilir mi?', ['Hayır; hem pil hem ampul sayısı değişmiştir.', 'Evet; ampul sayısı hiçbir zaman etkili olmaz.', 'Evet; bütün deneyler aynı sonucu verir.', 'Hayır; piller enerji kaynağı değildir.'], 'Hayır; hem pil hem ampul sayısı değişmiştir.', 'İki değişken birlikte değiştiği için yalnız pil sayısının etkisi ayrılamaz.', 'Düzeneklerde kaç farklı özellik değişmiş?', 4),
  ],
 },
 {
  topicIds: ['topic-c9fdd8c01a6fbc70'],
  introduction: 'Atıkları doğru yönetmek kaynakları korumaya yardımcı olur. Önce gereksiz tüketimi azaltmak, sonra yeniden kullanmak ve uygun atıkları geri dönüşüme ayırmak gerekir.',
  sections: [
   { title: 'Atıkları ayır', body: ['Kâğıt, karton, uygun plastik, cam ve metal atıklar yerel toplama kurallarına göre ayrı toplanabilir. Kirli veya karışık atıklar geri dönüşümü zorlaştırabilir.', 'Atık pil, elektronik eşya, ilaç ve kesici atıklar sıradan geri dönüşüm kutusuna rastgele atılmaz. Bunlar için yetkili toplama noktaları ve bir yetişkinin desteği kullanılır.'] },
   { title: 'Azalt, yeniden kullan, geri dönüştür', body: ['İhtiyaç kadar almak atığın daha oluşmadan azalmasını sağlar. Kullanılabilir bir kavanozu uygun ve güvenli amaçla yeniden kullanmak, ürünü hemen atmamaktır.', 'Geri dönüşüm atık malzemenin yeni ürüne dönüşmesidir. Her atık aynı yöntemle değerlendirilemez; bulunduğun yerdeki belediye ve okul toplama kuralları dikkate alınır.'] },
  ],
  workedExample: { prompt: 'Bir sınıfta 20 kullanılabilir defterin arka sayfaları boş. Yeni müsvedde kâğıdı almak yerine ne yapılabilir?', steps: ['Önce mevcut sayfaların güvenli ve kullanılabilir olduğunu kontrol et.', 'Boş sayfaları müsvedde için değerlendir.', 'Artık kullanılamayan temiz kâğıtları uygun kâğıt toplama kutusuna ayır.'], answer: 'Önce yeniden kullanmak yeni kaynak tüketimini azaltır; sonra uygun kâğıtlar geri dönüşüme ayrılır.' },
  activity: { title: 'Sınıfın atık planı', instructions: ['Bir gün içinde çıkan atıkları yalnız gözlemleyip türlerini kaydet; çöpleri elinle ayıklama.', 'Hangilerinin daha oluşmadan azaltılabileceğini yaz.', 'Okulun toplama kurallarına göre kâğıt ve özel atık noktalarını bir yetişkinle öğren.'], reflection: 'Geri dönüşüm kutusuna daha çok atık atmak mı, gereksiz atığı hiç oluşturmamak mı önce gelir?' },
  questions: [
   choice('Atık oluşumunu önlemede öncelikli davranış hangisidir?', ['İhtiyaç kadar tüketmek', 'Her gün daha çok ambalaj almak', 'Kullanılabilir eşyayı hemen atmak', 'Atıkları doğaya bırakmak'], 'İhtiyaç kadar tüketmek', 'Tüketimi azaltmak atığın oluşmasını önlemeye yardım eder.', 'Atık oluşmadan önce yapılabilecek davranışı seç.'),
   truth('Atık piller sıradan kâğıt geri dönüşüm kutusuna atılmalıdır.', false, 'Atık piller özel toplama noktalarına bir yetişkinin desteğiyle ulaştırılır.', 'Pil ile kâğıdın toplama koşulları aynı değildir.'),
   fill('Atık malzemelerin işlenerek yeni ürünlere dönüştürülmesine ne denir?', 'geri dönüşüm', 'Geri dönüşüm, atık malzemeyi yeniden üretimde değerlendirmektir.', 'Atığın yeni ürüne dönmesini anlatan iki sözcüğü yaz.'),
   choice('Boş defter sayfalarını müsvedde olarak kullanmak hangi davranıştır?', ['Yeniden kullanma', 'Gereksiz tüketimi artırma', 'Tehlikeli atığı karıştırma', 'Işık üretme'], 'Yeniden kullanma', 'Malzeme yeni bir işlemle ürüne dönüşmeden tekrar kullanılmış olur.', 'Aynı sayfaları başka amaçla kullanıyorsun.', 2),
   choice('Geri dönüşüm kutularına karışık ve çok kirli atıklar atılması neye yol açabilir?', ['Ayırma ve geri dönüşümü zorlaştırmaya', 'Bütün atıkların kendiliğinden yok olmasına', 'Kaynakların sınırsız olmasına', 'Her atığın aynı biçimde işlenmesine'], 'Ayırma ve geri dönüşümü zorlaştırmaya', 'Uygun ayırma ve yerel toplama kurallarına uymak geri dönüşümün işlerliğini artırır.', 'Malzemelerin sonradan ayrılmasını düşün.', 3),
   choice('Bir öğrenci kırık camı geri dönüşüme katkı için eliyle toplamak istiyor. Hangi yönlendirme uygundur?', ['Dokunmadan yetişkine haber vermek', 'Camları çıplak elle taşımak', 'Kırık camla oynamak', 'Camı kâğıtların arasına gizlemek'], 'Dokunmadan yetişkine haber vermek', 'Kaynakları korumak güvenlikten vazgeçmeyi gerektirmez; kesici atıklar uygun yöntemle yetişkinlerce yönetilir.', 'Hem çevreyi hem kendini koruyan davranışı seç.', 4),
  ],
 },
];

export const scienceLessons: LessonContent[] = concepts.flatMap(({ topicIds, questions, ...lesson }) =>
 topicIds.map(topicId => ({
  ...lesson,
  topicId,
  questions: questions.map((question, index) => ({ ...question, id: `gf-${topicId}-${index + 1}` })),
 })),
);
