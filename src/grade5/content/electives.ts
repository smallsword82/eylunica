import official from '../official-curriculum.json' with { type: 'json' };
import type { LessonContent, LessonQuestion } from '../content-types.ts';

// Original introductory material. Elective modules beyond these topics remain
// visible as unfinished; this pack does not claim complete elective coverage.
type Draft = Omit<LessonContent, 'questions'> & { questions: Omit<LessonQuestion, 'id'>[] };
const choice = (prompt: string, answer: string, other: string[], explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 2): Omit<LessonQuestion, 'id'> =>
 ({ kind: 'choice', prompt, answer, choices: [answer, ...other], explanation, hints: [hint], difficulty });
const boolean = (prompt: string, answer: boolean, explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 1): Omit<LessonQuestion, 'id'> =>
 ({ kind: 'boolean', prompt, answer: answer ? 'Doğru' : 'Yanlış', choices: ['Doğru', 'Yanlış'], explanation, hints: [hint], difficulty });
const fill = (prompt: string, answer: string, explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 2): Omit<LessonQuestion, 'id'> =>
 ({ kind: 'fill', prompt, answer, explanation, hints: [hint], difficulty });

const drafts: Draft[] = [
 {
  topicId: 'topic-ab5bba7d69026a02',
  introduction: 'Şehir yalnız binalardan oluşmaz. İnsanların yaşadığı, çalıştığı, öğrendiği ve ortak hizmetlerden yararlandığı bir yerleşim alanıdır. Doğal çevre ve insanların kurduğu yapılar şehir yaşamını birlikte biçimlendirir.',
  sections: [
   { title: 'Doğal ve beşerî unsurlar', body: ['Akarsu, ova, kıyı ve iklim doğal çevrenin parçalarıdır. Yol, konut, köprü, okul ve hastane ise insanların oluşturduğu beşerî unsurlardır.', 'Yerleşme için suya ulaşma, ulaşım ve geçim olanakları önemlidir. Aynı doğal koşullara sahip yerler, insanların kararları nedeniyle farklı biçimde gelişebilir.'] },
   { title: 'Şehri birlikte yaşatmak', body: ['Bir okulun işe yaraması için yalnız binası değil, öğretmeni, öğrencisi ve ulaşımı da gerekir. Şehirde yapılar, hizmetler ve toplumsal ilişkiler birbirini tamamlar.', 'Şehri incelerken gözlemlediğimiz bilgiyi yorumumuzdan ayırırız: “Burada park var” gözlemdir; “Park herkes için yeterlidir” demek için kullanıcıların ihtiyaçlarına ilişkin ek bilgi gerekir.'] },
  ],
  workedExample: { prompt: 'Bir mahallenin yanından akarsu geçiyor; mahallede köprü ve sağlık ocağı bulunuyor. Unsurları ayır.', steps: ['Akarsu doğada oluşur; doğal unsur olarak yaz.', 'Köprü ile sağlık ocağı insanlarca yapılır; beşerî unsur olarak yaz.', 'Sağlık ocağının yalnız yapı değil, sağlık hizmetinin yürütüldüğü yer olduğunu belirt.'], answer: 'Akarsu doğal; köprü ve sağlık ocağı beşerî unsurdur.' },
  activity: { title: 'Mahalle krokisi', instructions: ['Dışarı çıkmadan hatırladığın ya da güvendiğin bir yetişkinle gözlemlediğin çevrenin basit krokisini çiz.', 'Doğal unsurlara mavi, beşerî unsurlara başka bir işaret koy.', 'Ev adresi gibi özel bilgileri çizimine ekleme.'], reflection: 'Bir unsur ortadan kalkarsa günlük yaşam nasıl etkilenir?' },
  questions: [
   choice('Bir şehirde aşağıdakilerden hangisi doğal unsurdur?', 'Akarsu', ['Köprü', 'Otogar'], 'Akarsu doğal süreçlerle oluşur; diğerleri insan yapımıdır.', 'İnsan yapımı olmayanı düşün.', 1),
   choice('Okul, yol ve hastane hangi grupta yer alır?', 'Beşerî unsurlar', ['Doğal unsurlar', 'Hava olayları'], 'Bu yapılar insanlarca oluşturulur.', 'Bu yapıları kimin oluşturduğunu düşün.'),
   boolean('Bir şehri tanımak için yalnız binalarını saymak yeterlidir.', false, 'İnsanlar, hizmetler, doğal çevre ve ilişkiler de incelenmelidir.', 'Binalarda hangi etkinliklerin yapıldığını düşün.'),
   choice('Yeni mahallenin ulaşım ihtiyacını araştırmak için hangi bilgi daha yararlıdır?', 'İnsanların okula ve işe giderken kullandığı yollar', ['Binaların yalnız boya renkleri', 'Bir kişinin sevdiği çiçek'], 'Günlük yolculuklara ilişkin bilgi ulaşım ihtiyacına doğrudan bağlıdır.', 'Araştırma sorusuyla ilgili veriyi seç.', 3),
   choice('“Mahallede iki park var.” ifadesi hangi tür bilgidir?', 'Sayılabilir gözlem', ['Herkesin görüşü', 'Geleceğe ilişkin kesin sonuç'], 'Parklar gözlenerek sayılabilir; bu bilgi tek başına herkesin memnuniyetini göstermez.', 'İfadede neyin ölçülebildiğine bak.'),
   choice('Şehrin su kaynağı azalınca hangi sonuç beklenebilir?', 'Su kullanımının planlanması önem kazanır.', ['Ulaşım ihtiyacı kesinlikle biter.', 'Bütün doğal unsurlar insan yapımı olur.'], 'Su azalması ortak kaynağın dikkatli yönetilmesini gerektirir.', 'Değişimle doğrudan ilişkili sonucu ara.', 4),
  ],
 },
 {
  topicId: 'topic-5f6ab3d4c916085d',
  introduction: 'Ahlak, davranışlarımızı dürüstlük, adalet, sorumluluk ve başkalarına saygı gibi ölçütlerle düşünmemize yardım eder. Bir davranışı değerlendirirken yalnız kendi kazancımıza değil, başkalarının haklarına da bakarız.',
  sections: [
   { title: 'Değer, davranış ve sorumluluk', body: ['Dürüstlük bir değerdir; bulduğun eşyanın sahibini aramak bu değeri davranışa dönüştürebilir. Sorumluluk, üstlendiğin görevi yerine getirmek ve sonuçlarını düşünmektir.', 'Bir davranışın çok kişi tarafından yapılması onu kendiliğinden adil yapmaz. Değerlendirmede zarar vermeme, haklara saygı ve tutarlılık önemlidir.'] },
   { title: 'Ahlaki düşüncenin kaynakları', body: ['Aile, kültür, din, eğitim ve düşünerek sorgulama insanların ahlaki görüşlerini etkileyebilir. Farklı görüşleri dinlerken kişileri aşağılamadan gerekçeleri tartışırız.', 'Karar verirken “Kim etkileniyor?”, “Haksızlık var mı?” ve “Aynı davranış bana yapılsa ne düşünürdüm?” sorularını sorabiliriz.'] },
  ],
  workedExample: { prompt: 'Sınıf oyunu için yalnız yakın arkadaşlarını takıma almak isteyen bir öğrenciye nasıl yaklaşılır?', steps: ['Oyundan dışlanan öğrencilerin de katılım hakkı olduğunu fark et.', 'Öğrenciyi etiketlemek yerine takım seçme yöntemini tartış.', 'Sırayla seçme ya da dengeli kura gibi adil bir yol öner.'], answer: 'Davranışı adalet açısından değerlendirip herkesin katılımına imkân veren bir yöntem öneririz.' },
  activity: { title: 'Kararın gerekçesi', instructions: ['Okulda karşılaşılabilecek hayalî bir paylaşım sorunu yaz.', 'İki çözüm ve bu çözümlerden kimlerin etkileneceğini belirt.', 'Gerçek arkadaşlarının isimlerini kullanma.'], reflection: 'Bir çözümü yalnız işine geldiği için mi, adil olduğu için mi seçtin?' },
  questions: [
   choice('Bulduğu kalemi sahibine ulaştırmaya çalışmak en doğrudan hangi değerle ilgilidir?', 'Dürüstlük', ['Gösteriş', 'Savurganlık'], 'Başkasına ait eşyayı sahiplenmemek dürüst bir davranıştır.', 'Eşyanın kime ait olduğunu düşün.', 1),
   boolean('Bir davranışı çoğunluğun yapması, o davranışın mutlaka adil olduğunu gösterir.', false, 'Çoğunluğun seçimi başkalarının haklarını ihlal edebilir.', 'Dışarıda kalanların durumuna da bak.'),
   choice('Adil karar verirken hangi soru daha uygundur?', 'Bu karardan kimler etkileniyor?', ['Beni kim alkışlayacak?', 'Kimse görmezse ne kazanırım?'], 'Etkilenenleri düşünmek hak ve sorumlulukları fark ettirir.', 'Yalnız kendini ilgilendirmeyen seçeneği bul.'),
   choice('Verilen bir görevi zamanında yapmak hangi kavrama örnektir?', 'Sorumluluk', ['İsraf', 'Önyargı'], 'Üstlenilen görevi yerine getirmek sorumluluktur.', 'Görev ile davranış arasındaki bağı düşün.'),
   choice('Ahlaki görüşlerimizin oluşmasında hangisi etkili olabilir?', 'Aile ve eğitim', ['Yalnız ayakkabı numarası', 'Yalnız saç uzunluğu'], 'Aile, eğitim, kültür ve diğer kaynaklar değerler üzerinde etkili olabilir.', 'Değerlerin öğrenilmesiyle ilgili seçeneği ara.'),
   choice('Bir arkadaşın haksız davrandığında hangi yaklaşım daha yapıcıdır?', 'Kişiye hakaret etmeden davranışın etkisini ve çözümü konuşmak', ['Onu herkesin önünde küçük düşürmek', 'Aynı haksızlığı başka birine yapmak'], 'Davranışa ve çözüme odaklanmak saygılı değerlendirme sağlar.', 'Yeni bir haksızlık oluşturmayan yolu seç.', 4),
  ],
 },
 {
  topicId: 'topic-dc41f206b3891356',
  introduction: 'Nezaket, başkalarını dikkate alan saygılı davranıştır. Görgü kuralları ortak ortamda iletişimi kolaylaştırır; bazı ayrıntıları kültüre ve ortama göre değişebilir. Saygı göstermek, istemediğin bir davranışı kabul etmek zorunda olmak değildir.',
  sections: [
   { title: 'İletişimi kolaylaştıran sözler', body: ['Bir şey isterken “Lütfen”, yardım aldığında “Teşekkür ederim”, yanlışlıkla rahatsız ettiğinde “Özür dilerim” diyebilirsin.', 'Nezaket yalnız sözcük değildir. Söz kesmeden dinlemek, sırayı beklemek ve ortak alanı temiz bırakmak da başkalarını düşünmektir.'] },
   { title: 'Saygı ve kişisel sınırlar', body: ['Birine yardım önermeden önce yardıma ihtiyacı olup olmadığını sorarız. Herkesin rahatlık ve kişisel alan ihtiyacı aynı değildir.', 'Kibarca “Hayır, istemiyorum” demek mümkündür. Seni rahatsız eden bir davranış varsa güvenilir bir yetişkinden destek isteyebilirsin.'] },
  ],
  workedExample: { prompt: 'Bir arkadaşının defterini kullanmak istiyorsun. Nasıl istersin?', steps: ['Defterin ona ait olduğunu fark et.', 'Kullanmadan önce izin iste.', 'İstemiyorsa kararına saygı göster; verirse zamanında geri götür.'], answer: '“Defterine kısa süre bakabilir miyim, lütfen?” diye izin isteriz.' },
  activity: { title: 'Kibarca söyle', instructions: ['İzin isteme, teşekkür etme ve kibarca reddetme için birer cümle yaz.', 'Bir cümleyi farklı bir tonda söylemenin anlamı nasıl etkilediğini düşün.'], reflection: 'Kullandığın sözcükler ile ses tonun aynı saygıyı taşıyor mu?' },
  questions: [
   choice('Bir arkadaşının eşyasını kullanmadan önce ne yapmalısın?', 'İzin istemeliyim.', ['Habersiz almalıyım.', 'İzin vermiyorsa zorlamalıyım.'], 'Eşyayı kullanmak için sahibinin izni gerekir.', 'Eşyanın sahibinin kararına bak.', 1),
   choice('Yardım aldıktan sonra hangi söz uygundur?', 'Teşekkür ederim.', ['Sıra sende değil.', 'Zaten yapmak zorundaydın.'], 'Teşekkür etmek yapılan yardımı fark ettiğini gösterir.', 'Yardım edene karşılığı düşün.', 1),
   boolean('Kibar olmak, istemediğimiz her isteği kabul etmek demektir.', false, 'Kişisel sınırlarımızı saygılı bir biçimde koruyabiliriz.', 'Saygı ile zorunlu kabulü ayır.'),
   choice('Bir kişi konuşurken hangi davranış dinlediğini gösterir?', 'Sözünü bitirmesini beklemek', ['Sürekli sözünü kesmek', 'Onun yerine karar vermek'], 'Söz hakkına saygı dinlemenin parçasıdır.', 'Karşındakine söz hakkı tanı.'),
   choice('Kalabalık bir yerde yanlışlıkla birine çarptığında hangi tepki uygundur?', 'Özür dileyip iyi olup olmadığını sormak', ['Hiçbir şey olmamış gibi itmeye devam etmek', 'Onunla alay etmek'], 'Özür ve durumunu sormak davranışının etkisini önemsediğini gösterir.', 'Verdiğin rahatsızlığı gideren yolu seç.', 3),
   choice('“Şimdi konuşmak istemiyorum, daha sonra konuşabilir miyiz?” sözü ne gösterir?', 'Saygılı biçimde sınır belirtmeyi', ['Her durumda kabalığı', 'Karşıdakinin söz hakkını tamamen kaldırmayı'], 'İstek ve zaman ihtiyacı karşıdakini aşağılamadan ifade edilmiştir.', 'Cümlede hakaret olup olmadığına bak.', 4),
  ],
 },
 {
  topicId: 'topic-b81188630f0b26ab',
  introduction: 'Halk oyunları; hareket, müzik, ritim ve topluluk ilişkisini bir araya getiren kültürel etkinliklerdir. Oyunların biçimi ve adları yörelere göre değişebilir. Bir oyunu öğrenirken yöresini ve kaynağını da araştırırız.',
  sections: [
   { title: 'Ritim, adım ve yöre', body: ['Ritim, seslerin ve hareketlerin zaman içinde düzenlenmesidir. Adım, oyundaki hareket birimlerinden biridir. Aynı ritme farklı hareketler eşlik edebilir.', 'Yöre, belirli kültürel ve coğrafi özellikleri paylaşan çevreyi anlatır. Bir oyunun farklı yörelerde değişik çeşitleri bulunabilir.'] },
   { title: 'Birlikte ve güvenle hareket', body: ['Grup oyununda başkalarının alanına dikkat eder, başlangıç ve durma işaretini izleriz. Adımı öğrenirken önce yavaş çalışmak uyumu kolaylaştırır.', 'Hareket etkinlikleri öğretmen veya yetişkin rehberliğinde, kaygan olmayan boş bir alanda yapılır. Ayakta hareket sana uygun değilse ritme oturarak el veya parmak hareketiyle katılabilirsin.'] },
  ],
  workedExample: { prompt: 'Grup “bir-iki, bir-iki” diye sayıyor. Uyum nasıl sağlanır?', steps: ['Önce sayımı dinle ve düzenli vuruşu fark et.', 'Öğretmenin uygun gördüğü basit hareketi yavaş uygula.', 'Hızlı hareket etmeye çalışmak yerine ortak sayımı izle.'], answer: 'Aynı sayım düzenine ve güvenli alana dikkat etmek grup uyumunu artırır.' },
  activity: { title: 'Oturarak ritim', instructions: ['Rahatça otur ve dört eşit vuruş say.', 'İlk vuruşta avucuna hafifçe dokun, diğerlerini sessiz say.', 'İstersen yalnız parmağınla masaya hafifçe vurarak katıl.'], reflection: 'Vuruşlar eşit aralıklı olduğunda birlikte hareket etmek nasıl değişti?' },
  questions: [
   choice('Halk oyunlarında “ritim” neyi anlatır?', 'Ses ve hareketlerin zaman düzenini', ['Yalnız kıyafet rengini', 'Bir şehrin nüfusunu'], 'Ritim zaman içindeki düzenle ilgilidir.', 'Düzenli sayımı düşün.', 1),
   choice('Bir oyunun yöresini araştırmak hangi bilgiyi anlamaya yardım eder?', 'Oyunun kültürel çevresini', ['Bütün oyuncuların yaşını kesin olarak', 'Oyunun tek bir doğru kostüm rengi olduğunu'], 'Yöre bilgisi oyunun yaşatıldığı kültürel çevreyi gösterir.', 'Kültürle ilgili seçeneği seç.'),
   boolean('Halk oyunlarında aynı oyunun yörelere göre farklı çeşitleri bulunabilir.', true, 'Oyunlar aktarıldıkları çevrelere göre çeşitlenebilir.', 'Kültürün farklı çevrelerde yaşayabildiğini düşün.'),
   choice('Yeni bir adımı öğrenirken hangi yol daha uygundur?', 'Yavaş ve kontrollü çalışmak', ['Diğerlerine çarparak hızlanmak', 'Kaygan alanda denemek'], 'Kontrollü çalışma hareketi anlamayı ve güvenliği destekler.', 'Önce doğruluk ve güvenliği düşün.'),
   choice('Ayakta hareketin uygun olmadığı bir öğrenci ritme nasıl katılabilir?', 'Oturarak hafif el hareketleriyle', ['Kesinlikle etkinlik dışında kalmalıdır.', 'Zorlayıcı sıçramalar yaparak'], 'Ritim etkinliği farklı hareket olanaklarına uyarlanabilir.', 'Katılımı mümkün kılan seçeneği ara.', 3),
   choice('Bir grup oyunda sürekli hızlanıp ortak sayımdan ayrılıyor. Önce neyi gözden geçirmeli?', 'Ortak ritmi dinleyip dinlemediğini', ['Diğer grubun defter sayısını', 'Okulun bina yüksekliğini'], 'Uyum sorununun doğrudan nedeni ortak ritmi izlememek olabilir.', 'Sorunla ilgili veriyi seç.', 4),
  ],
 },
 {
  topicId: 'topic-6b40aa37346513d4',
  introduction: 'Kur’an-ı Kerim dersi, İslam inancında kutsal kitap kabul edilen Kur’an’ı tanıma, okuma ve anlamını öğrenme çalışmaları içerir. Okuma adabı, çalışmaya özen göstermeyi ve başkalarını rahatsız etmemeyi de kapsar.',
  sections: [
   { title: 'Okumak ve anlamak', body: ['Harfleri ve sesleri öğrenmek okuma çalışmasının parçasıdır. Anlamı öğrenmek için güvenilir açıklamalardan ve öğretmenin yönlendirmesinden yararlanılır.', 'Bir sözcüğü okumakta zorlandığında acele etmek yerine öğretmenden örnek istemek ve küçük bölümlerle çalışmak yardımcı olabilir. Buradaki metin sesli okuma ve telaffuz öğretiminin yerini tutmaz.'] },
   { title: 'Özenli çalışma ortamı', body: ['Çalışma yerini düzenlemek, metni özenle kullanmak ve okuyana sözünü kesmeden kulak vermek uygun çalışma davranışlarıdır.', 'Anlamadığın bir konuyu saygılı biçimde sorabilirsin. Bir arkadaşın zorlanıyorsa onunla alay etmek yerine destekleyici davranılır.'] },
  ],
  workedExample: { prompt: 'Bir öğrenci bilmediği bir harfi görüp duraksıyor. Nasıl ilerleyebilir?', steps: ['Bilmediği yeri işaret eder.', 'Öğretmenden doğru seslendirmeyi dinler.', 'Küçük bir bölümü tekrar edip geri bildirim ister.'], answer: 'Bilmediğini sormak ve örneği dikkatle dinlemek öğrenmeyi destekler.' },
  activity: { title: 'Çalışma planım', instructions: ['Öğretmenin verdiği kısa okuma çalışması için sessiz bir ortam hazırla.', 'Zorlandığın noktaları kişisel notuna yaz.', 'Notlarını öğretmeninle görüş; ses kaydı veya özel bilgi paylaşman gerekmez.'], reflection: 'Küçük bölümlerle çalışmak öğrenmene nasıl yardımcı oldu?' },
  questions: [
   choice('Kur’an-ı Kerim hangi dinin kutsal kitabıdır?', 'İslam', ['Budizm', 'Hinduizm'], 'İslam inancında Kur’an-ı Kerim kutsal kitaptır.', 'Dersin ele aldığı inancı düşün.', 1),
   choice('Bilinmeyen bir harfin okunuşunu öğrenmek için hangi yol uygundur?', 'Öğretmenin örnek seslendirmesini dinlemek', ['Rastgele bir ses uydurmak', 'Sormaktan vazgeçmek'], 'Doğru örnek ve geri bildirim okuma öğrenimini destekler.', 'Doğru ses modeline ulaşan yolu seç.'),
   boolean('Anlamadığımız bir konuyu saygılı biçimde sormak öğrenmenin parçasıdır.', true, 'Soru sormak eksik bilgiyi tamamlamaya yardım eder.', 'Sorunun öğrenmeye katkısını düşün.'),
   choice('Okumakta zorlanan arkadaşımıza hangi davranış destek olur?', 'Onu dikkatle dinleyip alay etmemek', ['Hatasını eğlence konusu yapmak', 'Sözünü sürekli kesmek'], 'Saygılı ortam öğrencinin rahatça çalışmasına yardım eder.', 'Öğrenme ortamını güvenli yapan davranışı bul.'),
   choice('Bir metni seslendirmeyi öğrenmek ve anlamını öğrenmek arasındaki ilişki nasıldır?', 'Birbirini destekleyen farklı çalışmalardır.', ['Tamamen aynı beceridir.', 'Anlam için hiçbir kaynağa bakılamaz.'], 'Okuma becerisi seslendirmeyi; anlam çalışması metnin ne anlattığını ele alır.', 'Ses ile anlamı ayır.', 3),
   choice('Bu yazılı ders, doğru telaffuzu öğrenmek için neyle tamamlanmalıdır?', 'Öğretmenin sesli örneği ve geri bildirimiyle', ['Yalnız hızlı okumayla', 'Bilmediğimiz sesleri tahmin etmekle'], 'Telaffuz için sesli model ve düzeltme gerekir.', 'Bir sesin doğruluğunun nasıl denetleneceğini düşün.', 4),
  ],
 },
 {
  topicId: 'topic-13cfcb12a836a832',
  introduction: 'Kültür, bir topluluğun dil, sanat, gelenek, bilgi ve yaşam biçimlerinin oluşturduğu bütündür. Medeniyet kavramı, toplumların zaman içinde geliştirdiği bilgi, kurum, teknoloji ve ortak yaşam birikimini anlatmak için kullanılır.',
  sections: [
   { title: 'Günlük yaşamda kültür', body: ['Bir ninni, yemek hazırlama geleneği, el sanatı veya bayramlaşma biçimi kültürün parçası olabilir. Kültür yalnız eski eşyalardan oluşmaz; yaşayan davranışları ve yeni üretimleri de içerir.', 'Aynı toplum içinde farklı kültürel uygulamalar bulunabilir. Farklılığı küçümsemek yerine anlamaya çalışmak birlikte yaşamayı destekler.'] },
   { title: 'Birikim ve etkileşim', body: ['Yazının kullanılması, bilimsel araştırma, şehirlerin yönetimi ve ortak kurumlar medeniyet birikimiyle ilişkilendirilebilir. Bu birikime çok sayıda toplum katkıda bulunmuştur.', 'Toplumlar ticaret, göç ve iletişim yoluyla birbirinden öğrenir. Kültür ile medeniyet birbirini etkiler; biri diğerinden bütünüyle kopuk değildir.'] },
  ],
  workedExample: { prompt: 'Bir müzede tarihî yazı araçları ve yerel dokumalar sergileniyor. Ne öğrenebiliriz?', steps: ['Dokumaları üretim, desen ve kullanım gelenekleri açısından incele.', 'Yazı araçlarını bilgiyi kaydetme ve aktarma açısından düşün.', 'Eşyaları yalnız görünüşleriyle değil, toplum yaşamındaki görevleriyle ilişkilendir.'], answer: 'Eşyalar hem kültürel uygulamalar hem de ortak bilgi birikimi hakkında ipuçları verir.' },
  activity: { title: 'Kültür örneği', instructions: ['Çevrende bilinen bir sözlü anlatı veya el sanatını seç.', 'Kimden öğrendiğini ve hangi amaçla kullanıldığını yaz.', 'Belirli bir geleneği bütün insanların uyguladığını varsayma.'], reflection: 'Bu kültür ögesinin aktarılması için neler yapılabilir?' },
  questions: [
   choice('Aşağıdakilerden hangisi kültür ögesidir?', 'Bir toplulukta söylenen ninni', ['Bir taşın kütlesi', 'Bir gezegenin yörüngesi'], 'Ninni dil ve sözlü aktarım yoluyla yaşatılan kültürel bir üründür.', 'İnsanların üretip aktardığı örneği seç.', 1),
   boolean('Kültür yalnız eski eşyalardan oluşur.', false, 'Dil, davranış, sanat ve yaşayan gelenekler de kültürdür.', 'Somut olmayan örnekleri düşün.'),
   choice('Toplumların birbirinden öğrenmesini hangi durum kolaylaştırabilir?', 'Ticaret ve iletişim', ['Bütün ilişkilerin kesilmesi', 'Bilginin hiç paylaşılmaması'], 'Karşılaşma ve iletişim kültürel etkileşime ortam oluşturur.', 'Bilginin karşı tarafa nasıl ulaşacağını düşün.'),
   choice('Tarihî bir yazı aracını incelerken hangi soru medeniyet birikimiyle daha yakından ilgilidir?', 'Bilginin kaydedilmesine nasıl katkı sağlamış?', ['Yanındaki duvar kaç kez boyanmış?', 'Müzeyi gezenlerin ayakkabısı ne renk?'], 'Yazı aracı bilgi aktarımının tarihsel gelişimi hakkında ipucu verir.', 'Eşyanın toplumsal görevini düşün.', 3),
   choice('Kültürel bir uygulamayı araştırırken hangi ifade daha dikkatlidir?', 'Bazı topluluklarda bu gelenek yaşatılır.', ['Bunu istisnasız herkes yapar.', 'Farklı yapanların kültürü yoktur.'], 'Kültürel uygulamaların çeşitliliğini kabul eden ifade daha doğrudur.', 'Aşırı genelleme yapmayanı seç.'),
   choice('Kültür ile medeniyet için hangi ilişki daha uygundur?', 'Karşılıklı etkileşim ve birikim', ['Her durumda tam ayrılık', 'Birinin diğerini zorunlu olarak yok etmesi'], 'Kültürel üretimler ve ortak kurumlar birbirini etkileyebilir.', 'Toplumların birlikte geliştirdiği bilgiyi düşün.', 4),
  ],
 },
 {
  topicId: 'topic-ed0ec468a4e70158',
  introduction: 'Masal, olağanüstü olay ve kişilere yer verebilen bir anlatı türüdür. Zamanı ve yeri çoğu zaman belirsizdir. Masalı tarihî olayın kanıtı gibi değil, olay örgüsü ve iletisi olan bir kurmaca olarak okuruz.',
  sections: [
   { title: 'Masal dünyasının ipuçları', body: ['“Bir varmış, bir yokmuş” gibi kalıplaşmış başlangıçlar görülebilir. Konuşan hayvanlar, olağanüstü yardımcılar ve gerçek yaşamda mümkün olmayan olaylar masalda yer alabilir.', 'Masalda bir sorun, sorunu çözmeye çalışan kişiler ve sonunda ortaya çıkan bir sonuç bulunur. Başlangıç, gelişme ve sonuç ilişkisini izlemek anlamayı kolaylaştırır.'] },
   { title: 'İleti ile olayın farkı', body: ['Olay, karakterin ne yaptığıdır. İleti, anlatının düşündürdüğü daha genel anlamdır. Bir karakterin yardımla başarıya ulaşması, dayanışmanın önemini düşündürebilir.', 'İletiyi belirlerken yalnız bir sözcüğe değil, olayların bütününe bakılır. Aynı masal farklı okurlara birden fazla düşünceyi çağrıştırabilir.'] },
  ],
  workedExample: { prompt: '“Bir varmış bir yokmuş. Konuşan bir kuş, yolunu kaybeden çocuğa evinin yolunu göstermiş.” Metinde masal özelliği nedir?', steps: ['Başlangıçtaki kalıplaşmış ifadeyi bul.', 'Kuşun konuşmasının olağanüstü olduğunu fark et.', 'Yol bulma olayını masalın kurmaca dünyası içinde değerlendir.'], answer: 'Kalıplaşmış başlangıç ve konuşan kuş masal özellikleridir.' },
  activity: { title: 'Kısa masal taslağı', instructions: ['Hayalî bir kişi ve küçük bir sorun seç.', 'Olağanüstü bir yardımcı ekle.', 'Sorunun çözümünü üç cümlede anlat; gerçek bir olay olduğunu ileri sürme.'], reflection: 'Anlatındaki olay ile okuyucuya düşündürmek istediğin ileti aynı şey mi?' },
  questions: [
   choice('Hangi olay masalda görülebilen olağanüstü bir duruma örnektir?', 'Bir ağacın insanla konuşması', ['Bir çocuğun kitap okuması', 'Yağmurun yağması'], 'Konuşan ağaç gerçek yaşamın dışında bir olaydır.', 'Gerçek yaşamda mümkün olmayanı bul.', 1),
   choice('“Bir varmış, bir yokmuş” ifadesi en çok hangi anlatı türünün başlangıcında görülür?', 'Masal', ['Hava raporu', 'Deney tutanağı'], 'Bu kalıp masal anlatımında sık kullanılan başlangıçtır.', 'Hayalî anlatıyı düşün.', 1),
   boolean('Bir masalda geçen her olay, tarihî bir olayın kanıtıdır.', false, 'Masal kurmaca ve olağanüstü olaylara yer verebilir.', 'Kurmaca ile tarihsel belgeyi ayır.'),
   choice('Bir masalın iletisini bulmak için en uygun yol hangisidir?', 'Olayların bütününün ne düşündürdüğüne bakmak', ['Yalnız ilk sözcüğü saymak', 'Sadece sayfa numarasını okumak'], 'İleti, olayların ilişkisi ve sonucu üzerinden yorumlanır.', 'Bütündeki anlamı düşün.', 3),
   choice('Masalda “sorun” hangi soruyla bulunabilir?', 'Kahraman hangi güçlükle karşılaşıyor?', ['Kitabın kapağı kaç santimetre?', 'Yazarın kalemi hangi renk?'], 'Sorun, olay örgüsünü harekete geçiren güçlükle ilgilidir.', 'Olayın ilerlemesini sağlayan durumu ara.'),
   choice('Yardım isteyen kahramanın arkadaşlarıyla çözüm bulduğu masal en doğrudan hangi düşünceyi destekler?', 'Dayanışma çözümü kolaylaştırabilir.', ['Hiç kimse başkasını dinlememelidir.', 'Bütün sorunlar tek başına çözülmelidir.'], 'Birlikte hareket etme ile çözüm arasında bağ kurulmuştur.', 'Olayın sonucuna katkı yapan davranışı bul.', 4),
  ],
 },
 {
  topicId: 'topic-dcb29d8e4c20a79e',
  introduction: 'Akıcı okuma, sözcükleri doğru tanıyarak uygun hız ve anlamlı duraklamalarla okumaktır. En hızlı okuyan kişi her zaman en iyi anlayan kişi değildir. Amaç anlamı izleyerek rahat okumaktır.',
  sections: [
   { title: 'Doğruluk, hız ve ifade', body: ['Anlamını veya okunuşunu bilmediğin sözcükte kısa süre durup inceleyebilirsin. Noktalama işaretleri duraklamaya ve cümlenin anlamına yardım eder.', 'Sesli okumada vurgu ve tonlama, soru ile bildirimi ayırt etmeyi kolaylaştırır. Sessiz okumada da cümlenin anlamlı parçalarını izleriz.'] },
   { title: 'Kısa ve düzenli çalışma', body: ['Kısa bir paragrafı önce anlamaya çalışarak oku, zorlandığın sözcükleri belirle, sonra bir kez daha oku. İkinci okumada yalnız hıza değil doğruluğa da bak.', 'Bir paragrafın ardından onu tek cümlede anlatabiliyorsan anlamı takip edip etmediğini denetleyebilirsin. Okuma yarışı yapmak gerekmez.'] },
  ],
  workedExample: { prompt: '“Ada, kapıyı açar mısın?” cümlesi nasıl okunmalı?', steps: ['Virgülde hitabın ayrıldığını fark et.', 'Soru işaretini gör ve soru tonunu koru.', 'Sözcükleri atlamadan cümleyi bir bütün olarak oku.'], answer: 'Hitabı ve soru anlamını koruyan, uygun duraklamalı okuma kullanılır.' },
  activity: { title: 'Anlayarak ikinci okuma', instructions: ['Kısa bir metni kendi hızında oku.', 'Zorlandığın en fazla üç sözcüğü incele.', 'Metni bir kez daha okuyup ana olayını bir cümlede anlat.'], reflection: 'İkinci okumada yalnız hızın mı, anlaman da mı değişti?' },
  questions: [
   choice('Akıcı okumanın temel amacı nedir?', 'Anlamı koruyarak doğru ve rahat okumak', ['Mümkün olan en hızlı sesi çıkarmak', 'Noktalama işaretlerini yok saymak'], 'Doğruluk, uygun hız ve anlam akıcılığın parçalarıdır.', 'Okuma ile anlamayı birlikte düşün.', 1),
   boolean('Bir metni hızlı okumak, onu mutlaka anladığımız anlamına gelir.', false, 'Hız tek başına anlama göstergesi değildir.', 'Okuduktan sonra anlatabilmeyi düşün.'),
   choice('Bilmediğin bir sözcüğe rastladığında hangi yol uygundur?', 'Sözcüğü inceleyip anlamını araştırmak', ['Sözcüğü her zaman atlamak', 'Yerine rastgele başka sözcük koymak'], 'Sözcüğün anlamı cümlenin anlaşılmasına katkı sağlar.', 'Anlam kaybını önleyen yolu seç.'),
   choice('Soru işareti, sesli okumada öncelikle neye yardım eder?', 'Soru anlamını tonlamaya yansıtmak', ['Sözcük sayısını azaltmaya', 'Bütün cümleyi bağırarak okumaya'], 'Noktalama işareti anlam ve tonlamayı yönlendirir.', 'İşaretin cümleye kattığı anlamı düşün.'),
   choice('Okuduğunu anlayıp anlamadığını denetlemek için hangisi uygundur?', 'Paragrafı kendi sözlerinle özetlemek', ['Yalnız süreye bakmak', 'Kitabı daha uzağa koymak'], 'Özet, temel anlamı takip edip etmediğini gösterebilir.', 'Anlamın yeniden ifade edildiği seçeneği bul.', 3),
   choice('İkinci okumada daha az hata yaptın ama süren değişmedi. Ne söylenebilir?', 'Doğruluk gelişmiş olabilir.', ['Hiçbir gelişme olmamıştır.', 'Metin artık mutlaka ezberlenmiştir.'], 'Akıcılıkta doğruluk da önemlidir; yalnız süre değişimini ölçmeyiz.', 'Hız dışındaki ölçütü düşün.', 4),
  ],
 },
 {
  topicId: 'topic-80de04a6643164ad',
  introduction: 'Drama, bir durumu veya yaşantıyı rol alma ve canlandırma yoluyla araştırmadır. Gerçek bir sorunu güvenli bir kurmaca içinde farklı kişilerin gözünden düşünmemize yardımcı olabilir. Katılmak için profesyonel oyuncu olmak gerekmez.',
  sections: [
   { title: 'Rol, mekân ve grup', body: ['Rol, canlandırmada üstlenilen kişidir; rolü üstlenen kişiyle aynı değildir. Bir öğrenci kütüphaneci rolünü oynayabilir, fakat bu onun gerçek mesleği olduğu anlamına gelmez.', 'Mekânı önceden tanımak ve hareket alanını belirlemek güvenlik sağlar. Grup üyeleri söz hakkına, kişisel alana ve katılmak istememe hakkına saygı gösterir.'] },
   { title: 'Drama ve tiyatro', body: ['Tiyatroda seyirciye sunulan bir gösteri hazırlanabilir. Drama çalışmalarında ise öğrenme, deneme ve süreci düşünme öne çıkar; her çalışmanın gösteriye dönüşmesi gerekmez.', 'Canlandırma bittikten sonra “Rolüm ne hissetti?”, “Hangi çözüm işe yaradı?” gibi sorularla çalışmayı değerlendiririz. Gerçek kişilerin özel yaşantıları izinsiz canlandırılmaz.'] },
  ],
  workedExample: { prompt: 'Kütüphanede aynı kitabı isteyen iki okur için kısa bir drama nasıl kurulur?', steps: ['Okur ve kütüphaneci rollerini gönüllü olarak paylaş.', 'Kitap isteme sorununu gerçek kişilere benzetmeden canlandır.', 'Sırayla ödünç alma gibi farklı çözümleri tartış.'], answer: 'Kurmaca rollerle sorunu farklı bakış açılarından inceleriz.' },
  activity: { title: 'Düşünce canlandırması', instructions: ['İstersen tek başına iki hayalî karakterin konuşmasını yaz.', 'Karakterlerin aynı sorun için farklı öneriler sunmasını sağla.', 'Canlandırmayı paylaşmak zorunda değilsin.'], reflection: 'Rolün düşüncesiyle kendi düşüncen arasında fark var mıydı?' },
  questions: [
   choice('Dramada “rol” neyi ifade eder?', 'Canlandırmada üstlenilen kişiyi', ['Öğrencinin gerçek kimliğinin değişmesini', 'Sınıfın kapı numarasını'], 'Rol kurmaca durum içindeki görev veya kişidir.', 'Gerçek kişi ile canlandırmayı ayır.', 1),
   boolean('Her drama çalışması mutlaka seyirciye gösterilmelidir.', false, 'Drama öğrenme ve deneme süreci olarak yapılabilir.', 'Gösteri ile öğrenme sürecini ayır.'),
   choice('Drama başlamadan önce hangisi uygundur?', 'Alanı ve ortak kuralları belirlemek', ['Birbirini iterek yer açmak', 'Katılmak istemeyeni zorlamak'], 'Önceden belirlenen sınırlar güvenliği ve saygıyı destekler.', 'Güvenli katılıma bak.'),
   choice('Bir öğrencinin kötü davranan bir kişiyi canlandırması ne gösterir?', 'Bir rolü araştırdığını', ['Gerçekte mutlaka aynı davranışı yaptığını', 'Kendi kimliğini kaybettiğini'], 'Rol davranışı kişisel özelliklerin doğrudan kanıtı değildir.', 'Kurmaca ile gerçek kişiyi ayır.', 3),
   choice('Çalışma sonunda hangi soru değerlendirmeye uygundur?', 'Farklı çözüm önerileri durumu nasıl değiştirdi?', ['Kim daha pahalı kıyafet giydi?', 'Kim hiç konuşmamalı?'], 'Çözümlerin etkisini incelemek öğrenmeyi destekler.', 'Süreçten öğrenmeye odaklan.'),
   choice('Gerçek bir arkadaşının özel sorununu izin almadan canlandırmak neden uygun değildir?', 'Mahremiyetini ve güvenini zedeleyebilir.', ['Her drama gerçek kişilere ait olmak zorundadır.', 'Kurmaca sorun üretmek imkânsızdır.'], 'Güvenli kurmaca, kişilerin özel bilgilerini izinsiz kullanmaz.', 'Paylaşılan bilginin kime ait olduğuna bak.', 4),
  ],
 },
 {
  topicId: 'topic-314c01fa485615f2',
  introduction: 'Geleneksel oyunlar, kuşaklar arasında öğrenilip aktarılabilen oyunlardır. Kuralları yöreye veya gruba göre küçük farklılıklar gösterebilir. Oynamadan önce kullanılan kuralları birlikte açıklamak anlaşmazlığı azaltır.',
  sections: [
   { title: 'Oyun ve kültürel aktarım', body: ['Saklambaç, seksek ve mendil kapmaca gibi oyunlar farklı çevrelerde tanınabilir. Aynı oyunun adı ya da oynanış ayrıntıları değişebilir.', 'Bir oyunu araştırırken adını, oynandığı yeri, kullanılan araçları ve kurallarını not ederiz. Tek kişinin anlattığını bütün yörelerdeki tek biçim saymayız.'] },
   { title: 'Adil ve güvenli oyun', body: ['Oyuncu seçimi, sıra ve kazanma koşulu önceden anlaşılmalıdır. Oyunun kurallarını gizlice değiştirmek adil değildir.', 'Öğretmen veya yetişkinle güvenli alan belirlenir. Trafiğe açık yerlerde, merdivenlerde veya kaygan zeminde koşmalı oyun oynanmaz; etkinlik farklı hareket olanaklarına göre uyarlanabilir.'] },
  ],
  workedExample: { prompt: 'İki öğrenci seksekte farklı sıra kuralları biliyor. Ne yapılabilir?', steps: ['Her iki kuralı kesmeden dinle.', 'Bu turda kullanılacak kuralı birlikte belirle.', 'Herkesin aynı kuralı anladığını kontrol et.'], answer: 'Farklı biçimleri kabul edip o tur için ortak ve açık bir kural seçeriz.' },
  activity: { title: 'Oyun kartı', instructions: ['Bildiğin bir oyunun adını ve araçlarını yaz.', 'Kurallarını üç maddeyle anlat.', 'Güvenli alan ve katılım için bir uyarlama ekle.'], reflection: 'Oyunu hiç bilmeyen biri kartını okuyarak başlayabilir mi?' },
  questions: [
   choice('Geleneksel oyunların aktarılması nasıl gerçekleşebilir?', 'Büyüklerden ve arkadaşlardan öğrenerek', ['Yalnız ücretli uygulamayla', 'Kurallar hiç paylaşılmadan'], 'Oyunlar gözlem, anlatma ve birlikte oynama yoluyla aktarılabilir.', 'Bir oyunu nasıl öğrendiğini düşün.', 1),
   boolean('Aynı geleneksel oyunun her yerde kuralları tamamen aynı olmak zorundadır.', false, 'Yöre ve gruplara göre çeşitler bulunabilir.', 'Farklı çevrelerdeki anlatımları düşün.'),
   choice('Bir oyuna başlamadan önce hangi bilgi ortaklaştırılmalıdır?', 'Sıra ve kazanma koşulları', ['Oyuncuların özel şifreleri', 'Ev adresleri'], 'Oyunla ilgili kurallar açık olduğunda adalet sağlanır.', 'Oyunun yürütülmesi için gerekli bilgiyi seç.'),
   choice('Koşmalı oyun için hangi yer uygun değildir?', 'Trafiğe açık yol', ['Yetişkinin uygun gördüğü boş oyun alanı', 'Tehlikelerden arındırılmış okul bahçesi'], 'Trafiğe açık yerde araçlarla çarpışma riski vardır.', 'Araçların bulunduğu alanı düşün.'),
   choice('Oyuncu kaybetmemek için kuralı gizlice değiştirirse hangi sorun ortaya çıkar?', 'Adil oyun bozulur.', ['Oyun otomatik olarak daha güvenli olur.', 'Herkesin söz hakkı artar.'], 'Ortak kurala aykırı avantaj elde etmek adil değildir.', 'Kurala herkesin aynı biçimde uyup uymadığına bak.', 3),
   choice('Oyunun bir hareketi bazı öğrenciler için uygun değilse hangi çözüm kapsayıcıdır?', 'Ortak kararla güvenli bir uyarlama yapmak', ['Bu öğrencileri her zaman dışlamak', 'Riskli hareketi zorunlu tutmak'], 'Uyarlama güvenli ve adil katılımı destekler.', 'Hem katılımı hem güvenliği gözet.', 4),
  ],
 },
 {
  topicId: 'topic-494cfff6e5b37fc4',
  introduction: 'Satranç iki oyuncunun sırayla hamle yaptığı bir strateji oyunudur. Amaç rakip şahı kurallara uygun biçimde mat etmektir. Oyunda düşünme, olası hamleleri karşılaştırma ve kararın sonucunu değerlendirme önemlidir.',
  sections: [
   { title: 'Tahta, taşlar ve sıra', body: ['Satranç tahtası 8 satır ve 8 sütundan oluşur; toplam 64 kare vardır. Her oyuncu oyuna 16 taşla başlar. İlk hamleyi beyaz yapar.', 'Tahtayı yerleştirirken oyuncunun sağ alt köşesi açık renk olmalıdır. Taşların hareket biçimleri farklıdır; hamle sırasında yalnız istediğimiz gibi hareket ettiremeyiz.'] },
   { title: 'Şah, mat ve düşünme alışkanlığı', body: ['Şah tehdit altındaysa buna şah çekme denir. Oyuncu şahını tehdit altında bırakan bir hamle yapamaz. Şah çekilmişken hiçbir yasal kurtuluş yoksa mat olur.', 'Rakibin düşünme süresine saygı gösterilir. Satrançta yalnız kendi planını değil, rakibin ne yapabileceğini de düşünürüz.'] },
  ],
  workedExample: { prompt: 'Bir tahtada 8 sıra ve her sırada 8 kare var. Kare sayısı nedir?', steps: ['Her sıradaki 8 kareyi belirle.', '8 sırayı çarpma ile say: 8 × 8.', 'Toplam 64 kare bulunduğunu yaz.'], answer: 'Satranç tahtasında 64 kare vardır.' },
  activity: { title: 'Kâğıt tahtam', instructions: ['Kâğıda 8 satır ve 8 sütunlu bir tablo çiz.', 'Komşu kareleri dönüşümlü renklendir.', 'Sağ alt köşeyi açık renk bırakarak tahtanı yerleştir.'], reflection: 'Hamle yapmadan önce kendi şahının güvenliğini nasıl kontrol edersin?' },
  questions: [
   fill('Satranç tahtasında toplam kaç kare vardır? Sayıyla yaz.', '64', '8 satır × 8 sütun = 64 kare.', '8 ile 8’i çarp.', 1),
   choice('Satrançta ilk hamleyi hangi taraf yapar?', 'Beyaz', ['Siyah', 'Her zaman yaşı büyük oyuncu'], 'Standart satrançta beyaz başlar.', 'Taşların renklerine ilişkin kuralı hatırla.', 1),
   choice('Bir oyuncu standart oyuna kaç taşla başlar?', '16', ['8', '32'], 'Her oyuncunun başlangıçta 16 taşı vardır; iki tarafın toplamı 32’dir.', 'Tek oyuncunun taşlarını düşün.'),
   boolean('Oyuncu kendi şahını tehdit altında bırakan bir hamle yapabilir.', false, 'Kendi şahını şah altında bırakmak yasal değildir.', 'Şah güvenliği kuralını hatırla.'),
   choice('Şah tehdit altındayken yasal kurtuluş hamlesi yoksa durumun adı nedir?', 'Mat', ['Açılış', 'Tahta çevirme'], 'Matta şah çekilmiştir ve tehditten kurtulmanın yasal yolu kalmamıştır.', 'Şah çekilmiş olmasına dikkat et.', 3),
   choice('Bir hamleyi seçerken hangi düşünce daha yararlıdır?', 'Rakibim bu hamleden sonra ne yapabilir?', ['Rakibin hamleleri hiç önemli değil.', 'Taşları kuralsız hareket ettirebilirim.'], 'Rakibin olası yanıtını düşünmek planın sonucunu değerlendirmeye yardım eder.', 'Kararın karşı tarafta doğuracağı yanıtı düşün.', 4),
  ],
 },
 {
  topicId: 'topic-e758a7b8a19a5b99',
  introduction: 'Klasik tangram, yedi geometrik parçanın bir araya getirilmesiyle şekiller oluşturulan bir bulmacadır. Parçalar döndürülebilir ve yerleri değiştirilebilir; çözümlerde parçalar üst üste bindirilmez.',
  sections: [
   { title: 'Yedi parçayı tanı', body: ['Klasik takımda beş üçgen, bir kare ve bir paralelkenar bulunur. Üçgenlerin büyüklükleri aynı değildir: iki büyük, bir orta ve iki küçük üçgen vardır.', 'Bir parçayı döndürmek ya da başka yere taşımak şeklini ve alanını değiştirmez. Yalnız konumu veya yönü değişir.'] },
   { title: 'Deneme ve kontrol', body: ['Hedef şeklin uzun kenarlarına, köşelerine ve boşluklarına bakarak parça yerleştirebilirsin. İlk deneme işe yaramazsa bir parçanın yönünü değiştirmek yeni olanak sunabilir.', 'Standart bütün-takım çalışmasında yedi parçanın tamamı kullanılır. Son kontrolde üst üste binme veya hedef dışına taşma olup olmadığına bakılır.'] },
  ],
  workedExample: { prompt: 'Bir öğrenci bir tangram çözümünde beş üçgeni ve kareyi kullanmış. Klasik takımdan hangi parça kaldı?', steps: ['Takımda beş üçgen, bir kare ve bir paralelkenar olduğunu hatırla.', 'Kullanılan beş üçgeni ve kareyi çıkar.', 'Geriye paralelkenarın kaldığını belirle.'], answer: 'Paralelkenar kaldı.' },
  activity: { title: 'Şekil denemesi', instructions: ['Hazır tangram parçaları varsa düz bir yüzeyde kullan; yoksa parçaların adlarını çizerek incele.', 'Bir şekil oluşturup parçaların üst üste binmediğini denetle.', 'Makas gerekiyorsa yetişkin yardımı al.'], reflection: 'Bir parçayı döndürdüğünde şekli mi, yönü mü değişti?' },
  questions: [
   fill('Klasik tangram takımı kaç parçadan oluşur? Sayıyla yaz.', '7', 'Beş üçgen, bir kare ve bir paralelkenar toplam yedi parçadır.', '5 + 1 + 1 işlemini yap.', 1),
   choice('Klasik tangram takımında hangi parça bulunmaz?', 'Daire', ['Üçgen', 'Kare'], 'Klasik takım üçgenler, kare ve paralelkenardan oluşur.', 'Kenarları eğri olan seçeneği düşün.'),
   boolean('Tangram parçasını döndürmek onun alanını değiştirir.', false, 'Döndürme yönü değiştirir; parçanın kapladığı alanı değiştirmez.', 'Parçadan bir şey kesilip kesilmediğine bak.'),
   choice('Standart bir tangram çözümünde parçalar nasıl yerleştirilir?', 'Üst üste gelmeden', ['Hepsi aynı noktada üst üste', 'Parçalar kesilerek'], 'Tangramda amaç verilen parçaları kesmeden ve üst üste bindirmeden birleştirmektir.', 'Parçaları koruyan kuralı hatırla.'),
   choice('Beş üçgen ve bir kare kullanıldıysa klasik takımdan hangi parça kalır?', 'Paralelkenar', ['İkinci kare', 'Altıgen'], 'Klasik takımın kalan tek parçası paralelkenardır.', 'Takımın üç parça grubunu hatırla.', 3),
   choice('Bir parça hedefteki boşluğa sığmadığında hangi işlem denenebilir?', 'Parçayı döndürüp yeniden yerleştirmek', ['Parçanın alanının kendiliğinden küçülmesini beklemek', 'Kuralı söylemeden başka parça eklemek'], 'Yön değiştirme, aynı parçayı farklı konuma uygun hâle getirebilir.', 'Parçayı değiştirmeden konumunu değiştirmeyi düşün.', 4),
  ],
 },
 {
  topicId: 'topic-db8beb1cc4f3b26a',
  introduction: 'Hz. Muhammed’in yaşamını öğrenirken doğduğu çevrenin coğrafyasını ve toplumsal hayatını da tanırız. İslam tarihi anlatımlarına göre Mekke’de doğmuştur. Mekke, Arap Yarımadası’nda yer alır.',
  sections: [
   { title: 'Mekke ve çevresi', body: ['Mekke, Kâbe’nin bulunduğu şehirdir. Hz. Muhammed’in doğduğu dönemin çevresini incelerken ticaret yolları, ziyaretler ve aile ilişkileri gibi konular ele alınır.', 'Bir şehrin coğrafyası, insanların yaşam biçimini etkileyebilir. Ancak aynı şehirde yaşayan herkesin aynı işi yaptığını veya aynı düşündüğünü varsaymayız.'] },
   { title: 'Geçmişi kaynakla öğrenmek', body: ['Bir kişinin yaşamını anlatan bilgileri kaynaklarıyla birlikte inceleriz. Günümüz yaşam biçimini olduğu gibi geçmişe taşımak doğru olmaz.', 'Ders kitabında geçen bir olayı okurken olayın geçtiği yer, zaman ve kişiler ayrı not edilebilir. Bilmediğimiz ayrıntıları hayal edip tarihî bilgi olarak sunmayız.'] },
  ],
  workedExample: { prompt: 'Bir öğrenci “Hz. Muhammed’in doğduğu şehir hangisidir?” sorusunu araştırıyor. Nasıl not alır?', steps: ['Ders kitabındaki ilgili bölümü bul.', 'Şehir adı olan Mekke’yi not et.', 'Mekke’nin Arap Yarımadası’nda bulunduğunu haritada incele.'], answer: 'Doğduğu şehir Mekke’dir; şehir ile daha geniş coğrafi bölge birbirinden ayrılır.' },
  activity: { title: 'Yer ve kaynak notu', instructions: ['Öğretmenin yönlendirdiği haritada Arap Yarımadası’nı bul.', 'Mekke ile Medine’yi ayrı işaretlerle göster.', 'Bilgi aldığın kitabın adını not et.'], reflection: 'Bir şehir adı ile yarımada adı arasındaki fark nedir?' },
  questions: [
   choice('Hz. Muhammed’in doğduğu şehir hangisidir?', 'Mekke', ['Ankara', 'Bursa'], 'İslam tarihi anlatımlarında doğduğu şehir Mekke olarak belirtilir.', 'Kâbe’nin bulunduğu şehri düşün.', 1),
   choice('Mekke hangi coğrafi bölgede yer alır?', 'Arap Yarımadası', ['İskandinav Yarımadası', 'Balkan Yarımadası'], 'Mekke Arap Yarımadası’nda bulunur.', 'Orta Doğu haritasındaki yarımadayı düşün.'),
   boolean('Mekke ve Medine aynı şehrin iki farklı adıdır.', false, 'Mekke ile Medine ayrı şehirlerdir.', 'Haritada iki ayrı yer işareti olup olmadığına bak.'),
   choice('Mekke’de bulunan önemli yapı hangisidir?', 'Kâbe', ['Galata Kulesi', 'Anıtkabir'], 'Kâbe Mekke’de bulunur.', 'Dersin ele aldığı şehrin yapısını düşün.'),
   choice('Geçmiş bir dönemi incelerken hangi yaklaşım daha doğrudur?', 'Bilgiyi kaynağı ve dönemin koşullarıyla değerlendirmek', ['Bugünkü bütün alışkanlıkları geçmişte de var saymak', 'Bilmediğimiz ayrıntıyı gerçekmiş gibi eklemek'], 'Dönemin koşulları ve kaynak bilgisi tarihsel değerlendirmeyi destekler.', 'Geçmişle bugünü otomatik eşitleme.', 3),
   choice('Bir metinde olayın yeri belirtilmemişse nasıl not alınmalıdır?', 'Yer bilgisi belirtilmedi diye yazılmalıdır.', ['Rastgele bir şehir seçilmelidir.', 'En sevdiğimiz şehir kesin kabul edilmelidir.'], 'Kaynağın vermediği bilgi kesinleştirilmez.', 'Bilinenle bilinmeyeni ayır.', 4),
  ],
 },
 {
  topicId: 'topic-12ce9831a7a24aad',
  introduction: 'Bilgiye gözlem yaparak, soru sorarak, okuyarak ve uygun araçlarla ölçerek ulaşabiliriz. Kullanacağımız yol araştırma sorusuna bağlıdır. Her soru için aynı yöntem yeterli olmaz.',
  sections: [
   { title: 'Soruya uygun yöntem', body: ['“Bahçede kaç ağaç var?” sorusu sayarak gözlemle yanıtlanabilir. “Ağaçların türleri neler?” sorusu için gözlemin yanında güvenilir bir rehber veya uzmana ihtiyaç olabilir.', 'Bir iddia ile onu destekleyen kanıtı ayırırız. “Bence daha uzun” görüşünü ölçümle kontrol etmek mümkündür.'] },
   { title: 'Not almak ve karşılaştırmak', body: ['Bilginin nereden geldiğini ve ne zaman toplandığını yazmak, daha sonra kontrol etmeyi kolaylaştırır. Başka bir kaynağın da aynı bilgiyi destekleyip desteklemediğine bakarız.', 'Çocuklarla araştırmada özel bilgiler toplanmaz ve canlılara zarar verilmez. Görüşme yapılacaksa öğretmen veya güvenilir yetişkin rehberliği gerekir.'] },
  ],
  workedExample: { prompt: 'Sınıftaki kalemlerin uzunluğu hakkında nasıl bilgi toplanır?', steps: ['Hangi kalemlerin ölçüleceğini belirle.', 'Aynı cetvel ve birimle uzunlukları ölç.', 'Sonuçları kalem adları yerine A, B, C kodlarıyla tabloya yaz.'], answer: 'Araştırma sorusuna uygun ölçüm yapıp karşılaştırılabilir kayıt tutarız.' },
  activity: { title: 'Araştırma sorusu kartı', instructions: ['Kişisel bilgi gerektirmeyen bir araştırma sorusu yaz.', 'Soruyu gözlemle mi, okuyarak mı, ölçerek mi yanıtlayacağını seç.', 'Kullanacağın birimi veya kaynak türünü belirt.'], reflection: 'Seçtiğin yöntem sorunun hangi bölümünü yanıtlayabilir?' },
  questions: [
   choice('“Sınıfta kaç pencere var?” sorusu için en uygun ilk yöntem hangisidir?', 'Pencereleri saymak', ['Rastgele tahminde ısrar etmek', 'Sınıftaki herkesin doğum tarihini toplamak'], 'Sayı bilgisi doğrudan gözlemle elde edilebilir.', 'İstenen bilgi miktarla ilgilidir.', 1),
   choice('İki nesnenin uzunluğunu karşılaştırırken hangi araç uygundur?', 'Cetvel', ['Termometre', 'Pusula'], 'Cetvel uzunluk ölçer.', 'Ölçmek istediğin büyüklüğü düşün.', 1),
   boolean('Araştırma yöntemini seçerken araştırma sorusunu dikkate almak gerekir.', true, 'Yöntemin soruyu yanıtlayabilecek türde veri sağlaması gerekir.', 'Soru ile veri arasındaki bağı düşün.'),
   choice('Kaynak ve tarih notu tutmanın yararı nedir?', 'Bilginin sonradan kontrol edilebilmesi', ['Bilgiyi otomatik olarak değişmez kılmak', 'Araştırma sorusunu gereksiz hâle getirmek'], 'Kaynak notu yeniden inceleme ve karşılaştırma sağlar.', 'Bir iddiayı tekrar nasıl bulacağını düşün.'),
   choice('“Bu ip daha uzundur” iddiasını kontrol etmek için ne yapılabilir?', 'İpleri aynı birimle ölçmek', ['İplerin renklerini karşılaştırmak', 'En sevilen rengi seçmek'], 'Uzunluk iddiası uzunluk verisiyle sınanır.', 'İddiayla aynı büyüklüğü ölç.', 3),
   choice('Bir proje için arkadaşlarının ev adresini toplamayı düşünüyorsun. Güvenli ilk adım nedir?', 'Öğretmene danışıp özel bilgi gerektirmeyen yöntem seçmek', ['Adresleri herkesin göreceği yerde paylaşmak', 'İzin almadan liste oluşturmak'], 'Araştırma kişisel verileri korumalı ve gereksiz veri toplamamalıdır.', 'Soruyu özel bilgi olmadan yanıtlamayı düşün.', 4),
  ],
 },
 {
  topicId: 'topic-1cb5f2c78c8858b8',
  introduction: 'Robotik, algılama, kontrol ve eylem bileşenlerini bir araya getiren sistemleri inceler. Bir robot çevresinden veri alabilir, bir programa göre karar verebilir ve motor gibi çıkışlarla hareket edebilir. Her robot insana benzemek zorunda değildir.',
  sections: [
   { title: 'Girdi, kontrol ve çıktı', body: ['Sensör, ışık ya da uzaklık gibi bir büyüklük hakkında veri sağlar. Denetleyici bu veriyi programdaki kurala göre işler. Motor veya ışık gibi bir çıkış sonuç üretir.', 'Robotun ne yapacağı tasarlanan programa ve donanımına bağlıdır. Robotlar her durumda kendiliğinden doğru karar veren canlılar değildir.'] },
   { title: 'Önce kâğıtta tasarla', body: ['Bir sistemin görevini “Bir engele çok yaklaşınca dur” gibi açık bir cümleyle yazabiliriz. Ardından hangi girdiye ve çıktıya ihtiyaç olduğunu belirleriz.', 'Elektronik düzenekler öğretmen rehberliğinde, uygun düşük gerilimli eğitim kitleriyle kurulur. Priz elektriği veya açık kablolarla deneme yapılmaz. Bu dersteki kâğıt etkinliği için elektronik kit gerekmez.'] },
  ],
  workedExample: { prompt: 'Engeli algılayınca duran hayalî robotun parçalarının görevleri nedir?', steps: ['Uzaklık sensörü engelin yakınlığı hakkında veri sağlar.', 'Denetleyici ölçümü programdaki eşikle karşılaştırır.', 'Motorun durması robotun hareketini keser.'], answer: 'Sensör girdiyi sağlar, denetleyici kuralı işler, motor çıkış üretir.' },
  activity: { title: 'Kâğıttan robot sistemi', instructions: ['Bir robot görevi hayal et.', 'Sensör, denetleyici ve çıkış için üç kutu çiz.', 'Kutuları veri akışını gösteren oklarla birleştir; fiziksel devre kurman gerekmez.'], reflection: 'Sensör veri vermezse robotun görevinde ne değişebilir?' },
  questions: [
   choice('Bir robotta çevreden veri alan parça genel olarak hangisidir?', 'Sensör', ['Tekerlek deseni', 'Dekoratif etiket'], 'Sensör çevredeki bir büyüklüğü algılayarak veri sağlar.', 'Ölçüm yapan parçayı düşün.', 1),
   choice('Robotun motoru hangi bölümün örneğidir?', 'Çıkış/eyleyici', ['Girdi sensörü', 'Kâğıt kaynakça'], 'Motor sisteme fiziksel eylem kazandırır.', 'Hareketin üretildiği yeri bul.'),
   boolean('Bütün robotlar insan biçiminde olmak zorundadır.', false, 'Robotlar görevlerine göre farklı biçimlerde tasarlanır.', 'Robot süpürge gibi örnekleri düşün.'),
   choice('Sensör bilgisini programdaki kuralla karşılaştıran bölüm hangisidir?', 'Denetleyici', ['Yalnız dış kapak', 'Yalnız tekerlek'], 'Denetleyici girdiyi işleyerek çıkışa yönelik komut üretir.', 'Kararın işlendiği bölümü düşün.'),
   choice('Robot tasarımına başlarken hangi ifade daha açık bir görevdir?', 'Engel belirlenen uzaklıktan yakınsa dur.', ['Her zaman bir şeyler yap.', 'Bazen istediğin gibi davran.'], 'Koşul ve eylem belirgin olduğunda görev sınanabilir.', 'Ne zaman ve ne yapılacağını birlikte ara.', 3),
   choice('Bu derste bir robotun veri akışını güvenle incelemek için hangisi yeterlidir?', 'Kâğıtta girdi-kontrol-çıktı şeması çizmek', ['Priz kablolarını açmak', 'Bilinmeyen gerilimleri denemek'], 'Kâğıt modeli elektronik risk olmadan sistem mantığını inceletir.', 'Amaç için en güvenli modeli seç.', 4),
  ],
 },
 {
  topicId: 'topic-6bc2f83382629491',
  introduction: 'Spor etkinliğine başlamadan önce ortamın, kullanılan aracın ve hareketin katılımcıya uygunluğu kontrol edilir. Güvenlik yalnız kazadan sonra tepki vermek değildir; riskleri önceden azaltmayı da içerir.',
  sections: [
   { title: 'Alan ve araç kontrolü', body: ['Islak zemin, yerdeki çanta veya kırık araç takılma ve çarpışma riski oluşturabilir. Spor alanı öğretmen veya sorumlu yetişkinle kontrol edilir; tehlikeli araca dokunmadan haber verilir.', 'Oyun için belirlenen sınırlar herkesçe bilinmelidir. Araçlar uygun amaçla kullanılmalı ve atış yönünde başka biri olmadığından emin olunmalıdır.'] },
   { title: 'Bedenin verdiği işaretler', body: ['Hareketin yoğunluğu ve biçimi kişiye uygun seçilir. Acı, baş dönmesi veya belirgin rahatsızlık olduğunda etkinlik durdurulur ve yetişkine haber verilir.', 'Herkes aynı hareketi aynı biçimde yapmak zorunda değildir. Öğretmen etkinliği farklı gereksinimlere göre uyarlayabilir; güvenlik için dışlamak yerine uygun katılım yolu aranır.'] },
  ],
  workedExample: { prompt: 'Oyun alanında yerde bir çanta ve su birikintisi gördün. Ne yaparsın?', steps: ['Oyuna hemen başlamayıp durumu öğretmene bildir.', 'Alan uygun şekilde düzenlenene ve zemin güvenli olana kadar bekle.', 'Oyun sınırlarını yeniden gözden geçir.'], answer: 'Risk giderilmeden oyuna başlanmaz.' },
  activity: { title: 'Güvenli alan kontrol listesi', instructions: ['Bir kâğıda “zemin”, “engel”, “araç”, “sınır” başlıklarını yaz.', 'Hayalî bir spor alanı için her başlığın altına bir kontrol sorusu ekle.', 'Gerçek alanda risk görürsen müdahale etmek yerine öğretmene bildir.'], reflection: 'Bir riskin fark edilmesi ile onun güvenle giderilmesi neden farklı şeylerdir?' },
  questions: [
   choice('Oyun alanındaki su birikintisi öncelikle hangi riski artırır?', 'Kayma', ['Kaynakça eksikliği', 'Taşların renk değiştirmesi'], 'Islak zemin kaymaya yol açabilir.', 'Zeminle ayak arasındaki ilişkiyi düşün.', 1),
   choice('Kırık bir spor aracı gördüğünde ne yapmalısın?', 'Kullanmadan öğretmene bildirmeliyim.', ['Denemek için daha sert vurmalıyım.', 'Kırık kısmı herkesten saklamalıyım.'], 'Arızalı araç kullanılmamalı, sorumlu yetişkine bildirilmelidir.', 'Riski artırmayan yolu seç.'),
   boolean('Hareket sırasında baş dönmesi olursa devam etmek zorunludur.', false, 'Etkinlik durdurulup sorumlu yetişkine haber verilmelidir.', 'Bedenin rahatsızlık işaretini dikkate al.'),
   choice('Oyun alanının sınırlarını bilmek neden önemlidir?', 'Çarpışma ve uygun olmayan alana çıkma riskini azaltır.', ['Bütün kuralları kaldırır.', 'Herkesin aynı bedensel özelliğe sahip olmasını sağlar.'], 'Sınırlar hareketin güvenli alanda kalmasına yardım eder.', 'Oyunun nerede yürütüldüğünü düşün.'),
   choice('Bir hareket bir katılımcı için uygun değilse ne yapılabilir?', 'Öğretmenle güvenli bir uyarlama seçilebilir.', ['Katılımcı her koşulda zorlanmalıdır.', 'Rahatsızlık önemsenmemelidir.'], 'Uygun uyarlama güvenli katılımı destekler.', 'Katılım ve güvenliği birlikte koru.', 3),
   choice('Bir riskin ortadan kaldırıldığından emin değilsen ne yapmalısın?', 'Sorumlu yetişkinin kontrolünü beklemeliyim.', ['Riskin olmadığını varsayarak başlamalıyım.', 'Arkadaşımı önce denemeye zorlamalıyım.'], 'Belirsiz riski başkasına aktarmak yerine güvenli kontrol gerekir.', 'Belirsizliğin güvenlik kararına etkisini düşün.', 4),
  ],
 },
 {
  topicId: 'topic-7e7e8cedd88d34d5',
  introduction: 'Kendini ifade etmek, düşünce, duygu ve ihtiyaçlarını anlaşılabilir biçimde paylaşmaktır. Konuşma, yazma, çizim ve uygun destek araçları ifade yolları olabilir. Herkesin iletişim biçimi aynı olmak zorunda değildir.',
  sections: [
   { title: 'Duygu ve ihtiyacı ayır', body: ['“Üzgünüm” bir duygu bildirir; “Sözümü tamamlamak istiyorum” bir ihtiyacı anlatır. İkisini birlikte söylemek karşıdakinin durumu anlamasını kolaylaştırabilir.', '“Sen hep böylesin” gibi genellemeler yerine belirli bir durumu anlatmak daha açıklayıcıdır: “Konuşmam yarım kaldığında zorlanıyorum.”'] },
   { title: 'Dinlemek ve sınır belirtmek', body: ['İletişim yalnız konuşmak değildir; karşıdakini dinlemek ve anladığını kontrol etmek de gerekir. Anlamadığında açıklama isteyebilirsin.', 'Kendini ifade ederken özel bilgilerini paylaşmak zorunda değilsin. Rahatsız eden bir durumda “Bunu istemiyorum” demek ve güvenilir yetişkinden destek almak uygundur.'] },
  ],
  workedExample: { prompt: 'Bir grup çalışmasında sözün sürekli kesiliyor. İhtiyacını nasıl anlatabilirsin?', steps: ['Belirli durumu anlat: “Konuşurken sözüm kesildiğinde…”', 'Etkisini ifade et: “…düşüncemi tamamlayamıyorum.”', 'İsteğini açıkça söyle: “Önce bitirmemi bekleyebilir misiniz?”'], answer: 'Durumu, etkisini ve ihtiyacını suçlayıcı genelleme yapmadan ifade edebilirsin.' },
  activity: { title: 'Üç parçalı mesaj', instructions: ['Hayalî bir anlaşmazlık seç.', 'Durum, duygu ve istek için birer cümle yaz.', 'İstersen yazmak yerine çizim veya konuşma kartı kullan.'], reflection: 'İsteğin karşındakinin anlayabileceği kadar açık mı?' },
  questions: [
   choice('Aşağıdakilerden hangisi bir duyguyu ifade eder?', 'Üzgünüm.', ['Defteri masaya koy.', 'Saat üçte başla.'], 'Üzgün olmak bir duygudur; diğer ifadeler yönergedir.', 'İç yaşantıyı anlatan sözü bul.', 1),
   choice('İhtiyacı açıkça anlatan ifade hangisidir?', 'Düşüncemi bitirebilmek için biraz süreye ihtiyacım var.', ['Sen her zaman kötüsün.', 'Hiçbir şey söylemeyeceğim.'], 'İfade hem durumu hem ihtiyacı belirginleştirir.', 'Yapılabilir ve açık isteği seç.'),
   boolean('Kendini ifade etmek yalnız sesli konuşarak mümkündür.', false, 'Yazı, çizim ve destek araçları da ifade yolu olabilir.', 'Farklı iletişim yollarını düşün.'),
   choice('Karşındaki kişinin ne demek istediğini anlamadığında ne yapabilirsin?', 'Açıklamasını isteyebilirim.', ['Mutlaka alay etmeliyim.', 'Bilmediğim hâlde kesin anladım demeliyim.'], 'Açıklama istemek yanlış anlamayı azaltabilir.', 'Anlamı kontrol eden yolu bul.'),
   choice('Bir davranış seni rahatsız ediyorsa hangi ifade sınırını saygılı biçimde belirtir?', 'Bunu istemiyorum, lütfen dur.', ['Bütün haklarından vazgeç.', 'Ne olursa olsun kabul etmeliyim.'], 'Kendi sınırını açık ve saygılı söylemek mümkündür.', 'Rıza ve saygıyı birlikte düşün.', 3),
   choice('“Sen hep sözümü kesersin” yerine hangi ifade daha somuttur?', 'Bugünkü çalışmada iki kez sözüm yarım kaldı.', ['Sen her şeyi bozarsın.', 'Hiç kimse beni asla dinlemez.'], 'Belirli olayı anlatmak, geniş ve suçlayıcı genellemeden daha somuttur.', 'Zamanı ve olayı belirli olanı seç.', 4),
  ],
 },
 {
  topicId: 'topic-9823a48c5899c1ec',
  introduction: 'Aile; bakım, sevgi, dayanışma ve sorumluluk ilişkilerinin yaşanabildiği önemli toplumsal ortamlardan biridir. Ailelerin yapısı ve günlük yaşam düzeni farklı olabilir. Bu farklılıklar kimseyi daha az değerli yapmaz.',
  sections: [
   { title: 'Dayanışma ve öğrenme', body: ['İnsanlar aile ve yakın çevrelerinde iletişim, paylaşma ve yardımlaşma örnekleri görebilir. Öğrenme yalnız anlatılanlarla değil, gözlenen davranışlarla da gerçekleşir.', 'Aile bireyleri birbirinin ihtiyaçlarını dinleyerek ortak yaşamı kolaylaştırabilir. Çocukların bakım ve güvenlik ihtiyaçları yetişkinlerin sorumluluğundadır.'] },
   { title: 'Yaşa uygun sorumluluk', body: ['Bir çocuk kendi kitaplarını düzenlemek gibi yaşına uygun katkılar sunabilir. Tehlikeli işlerde çalışmak, yetişkin yükünü taşımak ya da bir başkasının güvenliğinden tek başına sorumlu olmak çocuk görevi değildir.', 'Sorun yaşadığında güvenilir bir yetişkin, öğretmen veya okul rehberlik hizmetinden destek isteyebilirsin. Kişisel aile bilgilerini sınıfta paylaşmak zorunda değilsin.'] },
  ],
  workedExample: { prompt: 'Evde ortak kullanılan masa sürekli dağınık kalıyor. Yaşa uygun çözüm nasıl düşünülebilir?', steps: ['Masayı kullananların ihtiyaçlarını dinle.', 'Herkesin kendi araçlarını toplaması gibi açık görev belirle.', 'Tehlikeli temizlik işlerini bir yetişkine bırak.'], answer: 'Ortak ihtiyaçlar konuşulup güvenli ve yaşa uygun görevler paylaşılabilir.' },
  activity: { title: 'Hayalî dayanışma planı', instructions: ['Gerçek aile bilgilerin yerine hayalî bir ev düzeni çiz.', 'Kitap toplama veya bitkiye su verme gibi iki güvenli görev öner.', 'Hangi işlerin yetişkin sorumluluğu olduğunu ayrıca belirt.'], reflection: 'Görev paylaşımında yaş ve güvenlik neden dikkate alınmalı?' },
  questions: [
   choice('Aile içinde dayanışmaya hangi davranış örnek olabilir?', 'İhtiyacı olanı dinleyip uygun destek sunmak', ['Herkesi tek başına bırakmak', 'Farklılıklarla alay etmek'], 'Dayanışma karşılıklı ihtiyaçları dikkate alır.', 'Birlikte yaşamı kolaylaştıran seçeneği ara.', 1),
   boolean('Bütün ailelerin yapısı ve günlük yaşamı tamamen aynıdır.', false, 'Aile yapıları ve yaşam düzenleri farklı olabilir.', 'Farklı yaşam örneklerini düşün.'),
   choice('Bir çocuk için yaşa uygun sorumluluk örneği hangisidir?', 'Kendi kitaplarını düzenlemek', ['Açık elektrik kablosunu onarmak', 'Yetişkinlerin bütün bakım görevini üstlenmek'], 'Kitaplarını düzenlemek güvenli ve yaşa uygun bir katkıdır.', 'Tehlike ve yetişkin yükü içermeyeni bul.'),
   choice('Çocukların bakım ve güvenliğini sağlamak öncelikle kimin sorumluluğudur?', 'Bakımından sorumlu yetişkinlerin', ['Yalnız çocuğun kendisinin', 'Rastgele bir sınıf arkadaşının'], 'Çocuğun temel bakım ve güvenliği yetişkin sorumluluğudur.', 'Çocuğa yetişkin yükü yüklemeyen seçeneği seç.'),
   choice('Bir kişinin ailesi diğerlerinden farklıysa hangi yaklaşım uygundur?', 'Farklılığı saygıyla karşılamak', ['Onu daha az değerli görmek', 'Özel bilgilerini zorla anlattırmak'], 'Farklılık kişilerin değerini değiştirmez ve mahremiyete saygı gerekir.', 'Saygı ile mahremiyeti düşün.', 3),
   choice('Bir çocuk evdeki bir durum nedeniyle kendini güvende hissetmiyorsa ne yapabilir?', 'Güvenilir yetişkin veya öğretmenden destek isteyebilir.', ['Her sorunu tek başına çözmek zorundadır.', 'Yardım istemesi her zaman yanlıştır.'], 'Güvenlik ihtiyacında destek istemek uygun bir yoldur.', 'Güvenliği sağlayacak desteği düşün.', 4),
  ],
 },
 {
  topicId: 'topic-4f82c04adf064ba7',
  introduction: 'Yazmaya başlamadan önce amaç, okur ve konu belirlemek fikirlerini düzenlemeyi kolaylaştırır. Hazırlık, ilk anda kusursuz cümleler kurmak değildir; önce ne söylemek istediğini keşfetmektir.',
  sections: [
   { title: 'Amaç ve okur', body: ['Bilgi vermek, bir olayı anlatmak veya bir öneriyi gerekçelendirmek farklı yazma amaçlarıdır. Kime yazdığımız, hangi sözcükleri ve ayrıntıları seçeceğimizi etkiler.', '“Çevre” çok geniş bir konu olabilir. “Okul bahçesinde atıkları azaltmak için üç öneri” gibi sınırlı bir konu yazıyı planlamayı kolaylaştırır.'] },
   { title: 'Fikir toplama ve taslak', body: ['Kısa notlar, sorular ve zihin haritası fikir toplamaya yardım edebilir. İlk notların tamamını son yazıya almak zorunda değilsin.', 'İlgili fikirleri bir araya getirerek başlangıç, gelişme ve sonuç için küçük bir plan oluşturabilirsin. Daha sonra yazdığını okuyup eksik veya gereksiz ayrıntıları düzenlersin.'] },
  ],
  workedExample: { prompt: 'Okul panosu için kitap değişim etkinliğini tanıtan yazıya nasıl hazırlanılır?', steps: ['Amacı belirle: etkinlik hakkında bilgi vermek.', 'Okuru belirle: okul öğrencileri.', 'Gerekli bilgileri sırala: ne yapılacak, nerede, ne zaman ve katılım nasıl olacak.'], answer: 'Amaç ve okura uygun gerekli bilgileri toplayıp kısa plan hazırlanır.' },
  activity: { title: 'Yazı hazırlık kartı', instructions: ['Hayalî bir okul etkinliği seç.', '“Amacım”, “Okurum”, “Üç önemli bilgim” başlıklarını doldur.', 'Gerçek kişilerin iletişim veya adres bilgilerini kullanma.'], reflection: 'Hangi ayrıntılar okurun ihtiyacını karşılıyor, hangileri konu dışında kalıyor?' },
  questions: [
   choice('Yazmaya hazırlıkta hangi ikiliyi belirlemek yararlıdır?', 'Amaç ve okur', ['Yalnız kalemin markası ve fiyatı', 'Yalnız kâğıdın ağırlığı'], 'Amaç ve okur içerik ile anlatım seçimini yönlendirir.', 'Yazının kime ve neden yazıldığını düşün.', 1),
   choice('Hangisi daha sınırlı ve yazılabilir bir konudur?', 'Okul bahçesindeki atıkları azaltmak için üç öneri', ['Dünyadaki her şey', 'Bütün zamanlar'], 'Sınırlandırılmış konu düşünceleri düzenlemeyi kolaylaştırır.', 'Kapsamı daha belirgin seçeneği bul.'),
   boolean('Hazırlık sırasında yazdığımız bütün fikirleri son yazıya almak zorundayız.', false, 'Son yazı için amaçla ilgili fikirler seçilip düzenlenebilir.', 'Fikir toplamakla son metni ayır.'),
   choice('Bilgilendirici bir etkinlik duyurusunda hangi bilgi daha gereklidir?', 'Etkinliğin nerede ve ne zaman yapılacağı', ['Yazarın özel şifresi', 'Konuyla ilgisiz alışveriş listesi'], 'Okur katılım için yer ve zaman bilgisine ihtiyaç duyar.', 'Okurun karar vermesine yarayanı düşün.'),
   choice('Bir zihin haritası yazmaya nasıl yardım edebilir?', 'Fikirler arasındaki ilişkileri görmeyi sağlar.', ['Düzenleme ihtiyacını sonsuza dek kaldırır.', 'Her cümlenin mutlaka doğru olmasını garanti eder.'], 'Zihin haritası bir planlama aracıdır; son metin yine gözden geçirilir.', 'Aracın gerçek katkısını abartmadan seç.', 3),
   choice('Taslağındaki bir paragraf konunun dışına çıkıyorsa ne yapabilirsin?', 'Amaca uygunluğunu değerlendirip çıkarabilir veya yeniden yazabilirim.', ['Yazdığım her şeyi değiştirmeden tutmalıyım.', 'Okuru suçlamalıyım.'], 'Düzenleme sırasında metnin amacıyla ilgili olmayan bölümler gözden geçirilir.', 'Yazmayı tek seferlik değil süreç olarak düşün.', 4),
  ],
 },
];

const knownTopics = new Set(official.topics.map(topic => topic.id));
export const electiveLessons: LessonContent[] = drafts.map(lesson => {
 if (!knownTopics.has(lesson.topicId)) throw Error(`Seçmeli ders konusu kaynak kaydında yok: ${lesson.topicId}`);
 return { ...lesson, questions: lesson.questions.map((question, index) => {
  const choices = question.kind === 'choice' && question.choices
   ? [...question.choices.slice(index % question.choices.length), ...question.choices.slice(0, index % question.choices.length)]
   : question.choices;
  return { ...question, choices, id: `ge-${lesson.topicId}-${index + 1}` };
 }) };
});
