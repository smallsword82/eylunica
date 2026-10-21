import type { LessonContent, LessonQuestion } from '../content-types';

type Item = Omit<LessonQuestion, 'id'>;
type Concept = Omit<LessonContent, 'topicId' | 'questions'> & { topicIds: string[]; questions: Item[] };
const choose = (prompt: string, choices: string[], answer: string, explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 1): Item =>
 ({ kind: 'choice', prompt, choices, answer, explanation, hints: [hint], difficulty });
const truth = (prompt: string, answer: boolean, explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 1): Item =>
 ({ kind: 'boolean', prompt, choices: ['Doğru', 'Yanlış'], answer: answer ? 'Doğru' : 'Yanlış', explanation, hints: [hint], difficulty });
const fill = (prompt: string, answer: string, explanation: string, hint: string, difficulty: 1 | 2 | 3 | 4 = 2): Item =>
 ({ kind: 'fill', prompt, answer, explanation, hints: [hint], difficulty });

// Original learning material. Local emergency directions and real-time alerts
// must come from responsible adults and authorized institutions.
const concepts: Concept[] = [
 {
  topicIds: ['topic-7a80e2df0baea9c6'],
  introduction: 'Afet bilincinde tehlike, risk ve afet sözcüklerini ayırt etmek gerekir. Bu kavramlar aynı anlamda kullanılmaz.',
  sections: [
   { title: 'Tehlike ve risk', body: ['Tehlike, zarar verme potansiyeli olan bir olay veya durumdur. Sabitlenmemiş ağır bir dolabın devrilme ihtimali buna örnektir.', 'Risk, tehlikenin gerçekleşme olasılığı ve oluşabilecek kayıplarla ilgilidir. Tehlike bölgesinde insan ve yapıların bulunması, yapıların dayanıklılığı ve hazırlık düzeyi sonucu etkiler.'] },
   { title: 'Her olay afet değildir', body: ['Afet, toplumda ciddi kayıplara ve yaşamın aksamasına neden olan, etkilenen toplumun kendi kaynaklarıyla baş etmesini aşabilen durumdur.', 'Bir doğa olayının yaşanması tek başına her zaman afet olduğu anlamına gelmez. Hazırlık ve güvenli yapılaşma, aynı tehlikenin neden olabileceği zararları azaltabilir.'] },
  ],
  workedExample: { prompt: 'Aynı büyüklükte iki dolaptan biri uygun biçimde sabitlenmiş, diğeri sabitlenmemiş. Bu fark neden önemlidir?', steps: ['Her iki dolap da ağır eşya olabilir.', 'Uygun sabitleme devrilme tehlikesine karşı bir önlemdir.', 'Önlemin yetişkinlerce alınması yaralanma riskini azaltmaya yardım eder.'], answer: 'Tehlikeyi tanıyıp uygun önlem almak riski azaltabilir.' },
  activity: { title: 'Tehlike ve önlem kartı', instructions: ['Kâğıda “tehlike”, “olası zarar” ve “yetişkinle alınacak önlem” başlıkları çiz.', 'Yalnız gözlemlediğin bir ev eşyasını örnek olarak yaz; eşyayı hareket ettirme.', 'Önlem fikrini bir yetişkinle değerlendir.'], reflection: 'Bir önlem tehlikenin kendisini mi, verebileceği zararı mı azaltıyor?' },
  questions: [
   choose('Zarar verme potansiyeli olan olay veya duruma ne denir?', ['Tehlike', 'Kutlama', 'Geri dönüşüm', 'Tahminin kesinliği'], 'Tehlike', 'Tehlike, zarar doğurma potansiyelini ifade eder.', 'Zarar henüz oluşmamış olabilir.'),
   truth('Her doğa olayı mutlaka afettir.', false, 'Afet, ciddi etkiler ve baş etme kapasitesiyle ilgilidir; her olay aynı sonucu oluşturmaz.', 'Kimlerin ve nelerin etkilendiğini düşün.'),
   fill('Tehlikenin gerçekleşme olasılığı ve olası kayıplarla ilgili kavram nedir?', 'risk', 'Risk, tehlike karşısında ortaya çıkabilecek zararlarla ilgilidir.', 'Tehlikenin sonucunu ve olasılığını birlikte düşün.'),
   choose('Sabitlenmemiş ağır bir dolap için uygun davranış hangisidir?', ['Yetişkine bildirip uygun sabitleme istemek', 'Dolabı tek başına itmek', 'Üzerine tırmanmak', 'Önüne ağır eşya yığmak'], 'Yetişkine bildirip uygun sabitleme istemek', 'Ağır eşyanın güvenliği bir yetişkinin uygun yöntemle alacağı önlemlerle sağlanır.', 'Çocuğun ağır eşyayı hareket ettirmediği seçeneği bul.', 2),
   choose('İki yerde benzer bir tehlikenin farklı zararlara yol açması neyi gösterir?', ['Hazırlık ve dayanıklılık gibi etkenlerin önemli olduğunu', 'Bütün önlemlerin gereksiz olduğunu', 'Riskin yalnız renge bağlı olduğunu', 'Tehlikenin her yerde kesin aynı sonucu verdiğini'], 'Hazırlık ve dayanıklılık gibi etkenlerin önemli olduğunu', 'Maruz kalan insanlar, yapılar ve hazırlıklar kayıpları etkiler.', 'Tehlike dışında hangi koşullar farklı olabilir?', 3),
   choose('“Depremi durduramıyorsak hazırlığın yararı yoktur.” düşüncesine hangi yanıt uygundur?', ['Hazırlık, tehlike durdurulamasa da zararları azaltabilir.', 'Her hazırlık depremi kesin önler.', 'Afetlerde önlem almak yasaktır.', 'Risk yalnız olaydan sonra düşünülebilir.'], 'Hazırlık, tehlike durdurulamasa da zararları azaltabilir.', 'Tehlikenin oluşması ile tehlikenin vereceği zarar aynı şey değildir.', 'Olayı önlemek ile zararı azaltmayı ayır.', 4),
  ],
 },
 {
  topicIds: ['topic-5a94b09ba42fc10f'],
  introduction: 'Afetler insanların yaşamını, çevreyi, yapıları ve hizmetleri etkileyebilir. Olayların kaynaklarını bilmek hazırlık gereksinimlerini anlamaya yardım eder.',
  sections: [
   { title: 'Kaynaklarına göre düşün', body: ['Deprem, sel ve heyelan gibi tehlikeler doğa olaylarıyla ilişkilidir. Sanayi kazası veya tehlikeli madde sızıntısı gibi olaylar insan etkinliklerinden kaynaklanabilir.', 'Bazı olaylarda birden çok etken vardır. Örneğin bir yangın insan ihmaliyle de doğal etkenlerle de başlayabilir; yalnız olayın adına bakarak neden kesinleştirilmez.'] },
   { title: 'Etkiler birbirine bağlanabilir', body: ['Bir olay ulaşımı, suyu, elektriği veya haberleşmeyi aksatabilir. Okul ve sağlık hizmetleri de etkilenebilir.', 'Afetleri anlamanın amacı korkutmak değil, güvenilir bilgiyle önlem almaktır. Yerel tehlikeler ve okul planları sorumlu yetişkinler ile yetkili kurumların bilgisine göre ele alınır.'] },
  ],
  workedExample: { prompt: 'Bir selde yol kapanıyor, okula ulaşım aksıyor. Etki yalnız suyun kapladığı yerle sınırlı mıdır?', steps: ['Su doğrudan bulunduğu alana zarar verebilir.', 'Yolun kapanması ulaşımı etkiler.', 'Ulaşım aksaması eğitim ve yardım hizmetlerini de etkileyebilir.'], answer: 'Hayır; doğrudan ve dolaylı etkiler birlikte değerlendirilir.' },
  activity: { title: 'Etki ağı', instructions: ['Kâğıdın ortasına “yolun kapanması” yaz.', 'Ulaşım, okul ve sağlık hizmetlerine uzanan oklar çiz.', 'Bunların örnek bir düşünme çalışması olduğunu, yerel durumun ayrıca öğrenileceğini belirt.'], reflection: 'Bir hizmetin aksaması başka hangi hizmeti etkileyebilir?' },
  questions: [
   choose('Hangisi insan etkinliğiyle ilişkili bir tehlikeye örnektir?', ['Sanayi tesisinde kimyasal sızıntı', 'Yer kabuğundaki hareket', 'Ay’ın evresi', 'Mevsimlerin sırayla gelmesi'], 'Sanayi tesisinde kimyasal sızıntı', 'Sanayi faaliyetleriyle ilişkili sızıntılar insan kaynaklı tehlikeler arasında değerlendirilir.', 'Üretim etkinliğiyle bağlantılı olayı seç.'),
   truth('Bir yangının nedeni yalnız “yangın” sözcüğünden kesin olarak anlaşılır.', false, 'Yangınların doğal veya insan kaynaklı farklı nedenleri olabilir; kanıt gerekir.', 'Bir olayın adıyla nedenini ayır.'),
   fill('Yerin sarsılmasıyla ilişkili doğa olayına ne denir?', 'deprem', 'Deprem yer kabuğundaki hareketler sonucu oluşan sarsıntıdır.', 'Yer sarsıntısının adını yaz.'),
   choose('Bir afette hangi hizmet etkilenebilir?', ['Ulaşım ve haberleşme', 'Yalnız gökyüzünün rengi', 'Yalnız takvimin adı', 'Hiçbir toplumsal hizmet'], 'Ulaşım ve haberleşme', 'Afetler altyapıyı ve günlük hizmetlerin işleyişini aksatabilir.', 'Yollar ve bağlantı hatlarını düşün.', 2),
   choose('Sel nedeniyle yolun kapanıp öğrencilerin okula ulaşamaması hangi ilişkiyi gösterir?', ['Bir etkinin başka hizmetleri de etkileyebileceğini', 'Selin eğitimle hiçbir ilişkisi olmadığını', 'Bütün sellerin aynı büyüklükte olduğunu', 'Yol kapandığında riskin yok olduğunu'], 'Bir etkinin başka hizmetleri de etkileyebileceğini', 'Ulaşım aksaması eğitim hizmetine erişimi de etkileyebilir.', 'Neden-sonuç zincirini izle.', 3),
   choose('“Bütün afetler aynı hazırlığı gerektirir.” ifadesi nasıl değerlendirilir?', ['Yanlıştır; tehlike ve yerel plana göre hazırlıklar değişebilir.', 'Doğrudur; yerel bilgi gereksizdir.', 'Doğrudur; kurumlar yalnız bir tür olayla ilgilenir.', 'Yanlıştır; hiçbir olaya hazırlanılmaz.'], 'Yanlıştır; tehlike ve yerel plana göre hazırlıklar değişebilir.', 'Ortak hazırlıklar olsa da uygun davranış olayın türü ve yerel güvenlik planıyla ilişkilidir.', 'Farklı tehlikelerin farklı özelliklerini düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-0feda96a15da5a47'],
  introduction: 'Afet bilinci yalnız bir olayın adını bilmek değildir. Tehlikeleri tanımak, hazırlığa katılmak ve güvenilir yönergelere uymak bu bilincin parçalarıdır.',
  sections: [
   { title: 'Önceden hazırlan', body: ['Aile ve okul planında kiminle, nerede ve nasıl iletişim kurulacağı önceden konuşulur. Acil durumda kullanılabilecek temel ihtiyaçlar yetişkinlerle planlanır.', 'Tatbikatlar gerçek bir tehlike oluşturmadan planı öğrenmek içindir. Bir tatbikatta okulun öğretmenleri tarafından verilen yönerge izlenir.'] },
   { title: 'Bilgiyi doğru kullan', body: ['Kaynağı belli olmayan korkutucu mesajlar paylaşılmaz. Resmî kurumların duyuruları ve sorumlu yetişkinlerin açıklamaları esas alınır.', 'Çocuklar tehlikeli bir yere yardım etmek amacıyla girmez. Kendini riske atmadan yetişkine haber vermek ve güvenli yerde yönergeyi beklemek de sorumlu davranıştır.'] },
  ],
  workedExample: { prompt: 'Sosyal medyada kaynağı bilinmeyen “hemen bu yola gidin” mesajı görüyorsun. Ne yapmalısın?', steps: ['Mesajı doğru kabul edip yola çıkma.', 'Mesajı bir yetişkine göster.', 'Yetkili kurumların güncel duyurularının doğrulanmasını bekle.'], answer: 'Doğrulanmamış mesaj yerine yetişkin ve yetkili kaynak desteğine başvurulur.' },
  activity: { title: 'Aile iletişim kartı taslağı', instructions: ['Bir yetişkinle hangi iletişim bilgilerinin gerekli olduğunu konuş.', 'Gerçek kişisel bilgileri uygulamaya yazmadan boş bir kart şablonu çiz.', 'Kartın kimde ve nerede saklanacağını ailece kararlaştır.'], reflection: 'Kişisel acil durum bilgileri neden herkese açık paylaşılmaz?' },
  questions: [
   choose('Afet bilincine uygun davranış hangisidir?', ['Okulun hazırlık planını öğrenmek', 'Korkutucu mesajları doğrulamadan yaymak', 'Tehlikeli alana merak için gitmek', 'Tatbikatı önemsememek'], 'Okulun hazırlık planını öğrenmek', 'Önceden planı bilmek hazırlığın önemli parçasıdır.', 'Olay olmadan önce öğrenilebilecek davranışı seç.'),
   truth('Tatbikatlar planı güvenli biçimde öğrenmeye yardımcı olabilir.', true, 'Tatbikat gerçek tehlike oluşturmadan hazırlığı pekiştirir.', 'Tatbikatın öğrenme amacını düşün.'),
   fill('Kaynağı bilinmeyen bilgiyi paylaşmadan önce onu ne yapmak gerekir? “Doğrulamak” veya “saklamak” yaz.', 'doğrulamak', 'Yanlış bilgi yaymamak için güvenilir kaynaklardan kontrol gerekir.', 'Bilginin doğru olup olmadığını kontrol etme fiilini seç.'),
   choose('Acil durum iletişim planı kimlerle hazırlanır?', ['Sorumlu yetişkinlerle', 'Yalnız tanımadığın internet kişileriyle', 'Hiç kimseyle', 'Yalnız rastgele yorumlarla'], 'Sorumlu yetişkinlerle', 'Aile ve okul planı, sorumlu yetişkinlerin rehberliğiyle hazırlanır.', 'Günlük sorumluluğunu paylaşan güvenilir kişileri düşün.', 2),
   choose('Bir çocuk yardım etmek için hasarlı yapıya girmek istiyor. Ne önerilmelidir?', ['Girmeden yetişkin ve yetkililere haber vermesi', 'Daha hızlı içeri girmesi', 'Arkadaşlarını da çağırması', 'Güvenlik şeridini kaldırması'], 'Girmeden yetişkin ve yetkililere haber vermesi', 'Yardım isteği kişiyi yeni bir tehlikeye sokmamalıdır; güvenli bildirim önemlidir.', 'Kendi güvenliğini koruyan seçeneği bul.', 3),
   choose('Bir mesaj çok paylaşılıyor ama kaynağı belli değil. Güvenilirliğine nasıl karar verilir?', ['Paylaşım sayısına göre değil, yetkili ve güncel kaynakla karşılaştırarak', 'Çok paylaşıldığı için kesin doğrudur diyerek', 'En korkutucu ifadeyi seçerek', 'Hiçbir yetişkine söylemeyerek'], 'Paylaşım sayısına göre değil, yetkili ve güncel kaynakla karşılaştırarak', 'Yaygınlık tek başına doğruluk kanıtı değildir.', 'Kaynak, tarih ve yetkili açıklamasını düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-1673512cc5203adf'],
  introduction: 'İnsanların üretim, ulaşım ve enerji kullanımıyla ilgili bazı olaylar tehlike oluşturabilir. Büyük sanayi kazaları ve tehlikeli madde sızıntıları insan kaynaklı afetlere dönüşebilir.',
  sections: [
   { title: 'Türleri tanı', body: ['Sanayi kazası, tehlikeli madde sızıntısı ve büyük ulaşım kazaları insan faaliyetleriyle ilişkili örneklerdir. Her küçük kaza afet düzeyine ulaşmaz.', 'Yangınların bazıları ihmal veya teknik arızayla başlayabilir; bazıları doğal etkenlere bağlı olabilir. Neden araştırılmadan bütün yangınlara aynı kaynak etiketi verilmez.'] },
   { title: 'Güvenli uzaklık ve bildirim', body: ['Bilinmeyen madde, duman veya hasarlı tesis görülürse yaklaşıp inceleme yapılmaz. Çocuklar sorumlu yetişkine haber verir ve yetkili yönergesini izler.', 'Uyarı işaretleri ve güvenlik sınırları insanların tehlikeli bölgeye girmesini önlemeye yardım eder. Bunlar oyun malzemesi olarak kullanılmaz.'] },
  ],
  workedExample: { prompt: 'Bir sanayi alanında bilinmeyen sıvının sızdığı görülüyor. Öğrenci hangi görevi üstlenebilir?', steps: ['Sıvıya dokunmaz ve koklayarak tanımaya çalışmaz.', 'Alana yaklaşmadan bir yetişkine bildirir.', 'Yetkili kişilerin yönlendirmesine uyar.'], answer: 'Güvenli bildirim yapar; tehlikeli maddeyi kendi başına incelemez.' },
  activity: { title: 'Olay ve kaynak kartları', instructions: ['Sanayi sızıntısı, deprem ve ulaşım kazası başlıklı kartlar çiz.', 'Her kartta olayın hangi etkinlikle ilişkili olduğunu yaz.', 'Yangın için “nedeni araştırılmalı” notu ekle.'], reflection: 'Bir olayın türünü bilmek neden olayın kesin nedenini bildiğin anlamına gelmez?' },
  questions: [
   choose('Hangisi insan etkinliğiyle doğrudan ilişkili olay örneğidir?', ['Sanayi tesisindeki tehlikeli madde sızıntısı', 'Ay’ın Dünya çevresinde dolanması', 'Yer kabuğu hareketi', 'Gelgitin astronomik etkisi'], 'Sanayi tesisindeki tehlikeli madde sızıntısı', 'Sanayi tesisi insan faaliyetinin parçasıdır ve sızıntı teknolojik tehlike oluşturabilir.', 'Üretim etkinliğini içeren seçeneği bul.'),
   truth('Bütün küçük kazalar mutlaka afet sayılır.', false, 'Afet, etkilerin büyüklüğü ve toplumun baş etme kapasitesiyle ilgilidir.', 'Bir olayın ölçeği ve sonuçlarını düşün.'),
   fill('Üretim yapılan tesislerde oluşan büyük kazalara hangi tür kaza denir? “Sanayi” veya “gökbilim” yaz.', 'sanayi', 'Sanayi kazaları üretim ve tesis faaliyetleriyle ilişkilidir.', 'Üretim tesisinin alanını düşün.'),
   choose('Bilinmeyen sızıntıyla karşılaşan çocuğun güvenli davranışı hangisidir?', ['Yaklaşmadan yetişkine bildirmek', 'Eliyle örnek almak', 'Kokusunu yakından kontrol etmek', 'Sızıntıyı başka kaba aktarmak'], 'Yaklaşmadan yetişkine bildirmek', 'Tehlikeli maddeye temas etmeden bildirim yapılmalıdır.', 'Maddeyi incelemeyi gerektirmeyen seçeneği bul.', 2),
   choose('Uyarı levhası ve güvenlik şeridinin amacı nedir?', ['Tehlikeli bölgeye kontrolsüz girişi önlemeye yardım etmek', 'Meraklıları içeri çağırmak', 'Her tehlikeyi görünmez yapmak', 'Çocuklara oyuncak sağlamak'], 'Tehlikeli bölgeye kontrolsüz girişi önlemeye yardım etmek', 'Uyarılar güvenlik sınırlarını belirtir ve bunlara uyulmalıdır.', 'Levhada neden uyarı bulunduğunu düşün.', 3),
   choose('Bir yangının yalnız fotoğrafını görerek “kesin insan kaynaklıdır” denebilir mi?', ['Hayır; neden için güvenilir araştırma bilgisi gerekir.', 'Evet; bütün yangınlar aynı nedenle başlar.', 'Evet; fotoğraftaki renk yeterlidir.', 'Hayır; yangınlar hiçbir zaman insan etkinliğiyle ilişkili değildir.'], 'Hayır; neden için güvenilir araştırma bilgisi gerekir.', 'Yangın farklı nedenlerle başlayabilir; tek görüntü nedeni kesinleştirmez.', 'Görünen sonuç ile nedenin kanıtını ayır.', 4),
  ],
 },
 {
  topicIds: ['topic-4e7f6e478c3fbcab'],
  introduction: 'İnsan kaynaklı afetlerde teknik arıza, bakım eksikliği, ihmal veya yanlış kullanım gibi etkenler rol oynayabilir. Tek bir neden varsaymak yerine kanıta dayalı inceleme gerekir.',
  sections: [
   { title: 'Neden zincirini incele', body: ['Uygun bakım yapılmayan bir sistem arızalanabilir. Güvenlik kuralının ihlali ve riskin zamanında bildirilmemesi de zarar olasılığını artırabilir.', 'Kazanın nedeni yetkili uzmanlarca incelenir. Söylentilerle bir kişiyi veya grubu suçlamak doğru değildir.'] },
   { title: 'Sonuçları geniş düşün', body: ['Bir büyük kazada insanlar yaralanabilir, çevre kirlenebilir ve üretim durabilir. Su, hava ve toprağa yayılan zararlar farklı canlıları etkileyebilir.', 'Güvenlik eğitimi, bakım ve denetim, birçok tehlikeye karşı önleyici çalışmalardır. Çocuklar arızalı araçları tamir etmek yerine yetişkine haber verir.'] },
  ],
  workedExample: { prompt: 'Bir cihaz sık sık arıza işareti veriyor ama kullanılmaya devam ediliyor. Hangi iki önlem düşünülmelidir?', steps: ['Arıza belirtisi bir yetişkine bildirilir.', 'Cihaz çocuk tarafından açılıp tamir edilmeye çalışılmaz.', 'Yetkili bakım ve güvenlik kontrolü yapılmadan kullanıma devam edilmemesi değerlendirilir.'], answer: 'Zamanında bildirim ve yetkili bakım, olası zararları azaltmaya yardım eder.' },
  activity: { title: 'Neden–önlem tablosu', instructions: ['“Bakım eksikliği” için bir neden kutusu çiz.', 'Yanına “yetkili bakım ve kontrol” önlemini ekle.', 'Gerçek bir cihazı açmadan kâğıt üzerinde neden–sonuç okları çiz.'], reflection: 'Bir sorunu erken bildirmek sonuçlar büyümeden hangi farkı yaratabilir?' },
  questions: [
   choose('Hangi durum kaza riskini artırabilir?', ['Bakım eksikliğinin görmezden gelinmesi', 'Yetkili bakım yapılması', 'Güvenlik kuralına uyulması', 'Arızanın yetişkine bildirilmesi'], 'Bakım eksikliğinin görmezden gelinmesi', 'Bakım yapılmayan sistemlerde arıza ve zarar olasılığı artabilir.', 'Önleyici çalışmanın yapılmadığı durumu bul.'),
   truth('Büyük bir sanayi kazası yalnız tesisin içini etkileyebilir; çevreyi asla etkilemez.', false, 'Hava, su ve toprak kirliliği çevreye yayılabilir.', 'Kirleticilerin çevreye taşınmasını düşün.'),
   fill('Bir kazanın nedenini söylerken söylenti yerine hangi tür bilgi gerekir? “Kanıt” veya “beğeni” yaz.', 'kanıt', 'Güvenilir neden açıklaması kanıta dayanır.', 'Doğrulanabilir bilgi seç.'),
   choose('Arızalı elektrikli araç gören çocuk ne yapmalıdır?', ['Yetişkine bildirmelidir.', 'Aracı açıp kablolara dokunmalıdır.', 'Aracı suyla yıkamalıdır.', 'Daha fazla çalıştırmalıdır.'], 'Yetişkine bildirmelidir.', 'Cihazın onarımı yetkili kişilerin işidir; çocuk tehlikeye yaklaşmamalıdır.', 'Tamir işlemi gerektirmeyen seçeneği seç.', 2),
   choose('Bir sızıntı nedeniyle üretim duruyor ve dere kirleniyor. Kaç tür etki düşünülmelidir?', ['Hem ekonomik hem çevresel etkiler', 'Yalnız tabelanın rengi', 'Yalnız takvim değişimi', 'Hiçbir sonuç'], 'Hem ekonomik hem çevresel etkiler', 'Üretimin durması ekonomik, derenin kirlenmesi çevresel etkidir.', 'İki ayrı sonucu sınıflandır.', 3),
   choose('“Kazanın fotoğrafında bir kişi görünüyor; bütün sorumluluk kesin onundur.” yorumu neden sorunludur?', ['Fotoğraf tek başına neden ve sorumluluğu kanıtlamaz.', 'Fotoğraflar her zaman bütün nedenleri kanıtlar.', 'Uzman incelemesi hiçbir işe yaramaz.', 'Söylenti kanıttan daha güvenilirdir.'], 'Fotoğraf tek başına neden ve sorumluluğu kanıtlamaz.', 'Neden ve sorumluluk için yetkili inceleme ve kanıt gerekir.', 'Bir kişinin görüntüde bulunmasıyla neden olması arasındaki farkı düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-092256f2ac173ae8', 'topic-bf02746725863900'],
  introduction: 'İnsan kaynaklı tehlikelere karşı hazırlık, güvenli tasarım ve kurallara uymayla başlar. Çocukların görevi tehlikeli araçları onarmak değil güvenli davranmak ve yetişkine bildirmektir.',
  sections: [
   { title: 'Olaydan önce önlem', body: ['Yetkili bakım, iş güvenliği eğitimi, uygun depolama ve denetim riskleri azaltabilir. Uyarı levhaları ve kullanım yönergeleri dikkate alınır.', 'Ev ve okulda arızalı araçlar bir yetişkine bildirilir. Prizler, elektrik panoları ve bilinmeyen maddeler üzerinde deneme yapılmaz.'] },
   { title: 'Güvenli bildirim', body: ['Duman, bilinmeyen koku veya sızıntı gibi işaretlerde çocuklar kaynağı aramak için içeri girmez. Sorumlu yetişkin ve yetkililerin yönergeleri izlenir.', 'Acil yardım gerektiren gerçek tehlikelerde 112 kullanılır. Tatbikat veya merak amacıyla bu numara aranmaz; gereksiz aramalar gerçek yardımı geciktirebilir.'] },
  ],
  workedExample: { prompt: 'Okuldaki bir araçtan duman geldiği fark ediliyor. Öğrenci nasıl yardımcı olabilir?', steps: ['Araca dokunmaz veya kapağını açmaz.', 'Öğretmene hemen haber verir.', 'Okulun güvenlik yönergesini izler ve müdahaleyi yetkililere bırakır.'], answer: 'Temas etmeden bildirim ve güvenli yönergeye uyma.' },
  activity: { title: 'Güvenlik afişi', instructions: ['Bir afişe “Dokunma, yetişkine bildir, yönergeyi izle” sırasını yaz.', 'Özel bir yer için tahliye yolu uydurmadan genel bir bildirim simgesi çiz.', 'Afişini öğretmeninle değerlendir.'], reflection: 'Bir çocuk için güvenli yardım ile tehlikeli müdahale arasındaki fark nedir?' },
  questions: [
   choose('Risk azaltmaya hangi çalışma katkı sağlar?', ['Yetkili bakım ve denetim', 'Arızaları saklamak', 'Uyarı levhalarını kaldırmak', 'Bilinmeyen maddeleri karıştırmak'], 'Yetkili bakım ve denetim', 'Bakım ve denetim, sorunların olay büyümeden fark edilmesine yardım eder.', 'Önceden yapılan güvenlik çalışmasını seç.'),
   truth('Çocuklar arızalı elektrik panosunu açarak kontrol etmelidir.', false, 'Elektrik panosuna müdahale tehlikelidir; yetişkine ve yetkili kişilere bildirilir.', 'Uzmanlık gerektiren işi düşün.'),
   fill('Türkiye’de gerçek bir acil yardım gereksiniminde kullanılan ortak çağrı numarası kaçtır? Yalnız sayı yaz.', '112', '112 gerçek acil durumlar içindir; alıştırma için aranmaz.', 'Üç basamaklı ortak acil çağrı numarasını düşün.'),
   choose('Tatbikatta 112 ile ilgili hangi davranış doğrudur?', ['Gerçek arama yapmadan rol kartıyla çalışmak', 'Meraktan arayıp kapatmak', 'Sahte ihbarda bulunmak', 'Hattı oyun için meşgul etmek'], 'Gerçek arama yapmadan rol kartıyla çalışmak', 'Eğitim sırasında gerçek acil çağrı hattı gereksiz yere aranmaz.', 'Gerçek yardımı geciktirmeyen yöntemi seç.', 2),
   choose('Bir cihazdan duman geldiğinde öğrenci önce ne yapmalıdır?', ['Dokunmadan öğretmene bildirmelidir.', 'Cihazı sökmelidir.', 'Kabloyu eliyle çekmelidir.', 'Dumanın kaynağını burnuyla aramalıdır.'], 'Dokunmadan öğretmene bildirmelidir.', 'Tehlikeli kaynağa müdahale etmeden güvenli bildirim yapılır.', 'Temas gerektirmeyen seçeneği bul.', 3),
   choose('“Uyarı levhası varsa, yetişkin olmadan içeriyi gezmek güvenlidir.” yorumu neden yanlıştır?', ['Uyarı bir tehlikeye dikkat çeker; içeri girme izni anlamına gelmez.', 'Levha bütün tehlikeleri ortadan kaldırır.', 'Levhalar yalnız süstür.', 'Tehlike yalnız levha yokken olur.'], 'Uyarı bir tehlikeye dikkat çeker; içeri girme izni anlamına gelmez.', 'Güvenlik sınırı ve yetkili yönergesi korunmalıdır.', 'Bilgilendirme ile izin vermeyi ayır.', 4),
  ],
 },
 {
  topicIds: ['topic-f554450153b26fd1'],
  introduction: 'Deprem, sel, heyelan, çığ ve kuraklık doğa olaylarıyla ilişkili tehlikelerdir. İnsanların yerleşimi, yapılaşması ve hazırlığı, bu olayların afete dönüşmesinde etkili olabilir.',
  sections: [
   { title: 'Olayları ayırt et', body: ['Deprem yer kabuğundaki hareketlerle ilişkilidir. Sel suyun normal sınırlarını aşarak alanları kaplaması, heyelan toprak veya kaya kütlesinin yamaç boyunca hareketidir.', 'Çığ, kar kütlesinin yamaçtan hareket etmesiyle ilişkilidir. Kuraklık uzun süreli yağış yetersizliği ve su açığıyla gelişebilir.'] },
   { title: 'Doğa olayı ve insan etkisi', body: ['Her yer aynı tehlikelere aynı ölçüde açık değildir. Yer şekilleri, iklim koşulları ve jeolojik özellikler farklı olabilir.', 'Arazinin yanlış kullanımı ve önlemsiz yapılaşma zararları artırabilir. Yerel tehlikeleri bilmek için yetkili kurumların güncel bilgileri ve okul planı esas alınır.'] },
  ],
  workedExample: { prompt: 'Yağıştan sonra eğimli arazide toprak kütlesi aşağı doğru kayıyor. Bu olayı hangi kavram açıklar?', steps: ['Hareket eden şey toprak veya kaya kütlesidir.', 'Hareket bir yamaç boyunca gerçekleşmektedir.', 'Bu özellikler heyelan kavramına uygundur.'], answer: 'Heyelan.' },
  activity: { title: 'Doğa olayı eşleştirmesi', instructions: ['Deprem, sel, heyelan, çığ ve kuraklık adlarını yaz.', 'Yanlarına temel ayırt edici özelliklerini ekle.', 'Gerçek tehlike alanına gitmeden kitap çizimleriyle çalış.'], reflection: 'Olayın adını doğru koymak uygun bilgi kaynağını bulmaya nasıl yardım eder?' },
  questions: [
   choose('Toprak veya kaya kütlesinin yamaçtan kaymasına ne denir?', ['Heyelan', 'Ay tutulması', 'Gelgit', 'Buharlaşma'], 'Heyelan', 'Heyelan yamaç malzemesinin aşağı yönde hareketidir.', 'Hareket eden madde toprak veya kayadır.'),
   truth('Bütün yerlerde aynı doğa tehlikesi aynı düzeyde görülür.', false, 'Yer şekilleri, iklim ve jeolojik özellikler tehlike türlerini ve düzeyini etkiler.', 'Dağlık alan ile düz ovayı karşılaştır.'),
   fill('Kar kütlesinin bir yamaçtan aşağı hareket etmesiyle ilgili olayın adı nedir?', 'çığ', 'Çığ, kar kütlesinin eğim boyunca hareketidir.', 'Kar ve eğimli dağ koşullarını düşün.'),
   choose('Uzun süreli su açığıyla ilişkili olay hangisidir?', ['Kuraklık', 'Şimşek', 'Volkanik kayaç', 'Güneş tutulması'], 'Kuraklık', 'Kuraklık, yağış yetersizliği ve uzun süreli su açığıyla ilişkilidir.', 'Bir anlık olay yerine uzun süreyi düşün.', 2),
   choose('Sel ile heyelan arasındaki temel fark nedir?', ['Selde su, heyelanda toprak veya kaya kütlesinin hareketi öne çıkar.', 'İkisinde de yalnız kar hareket eder.', 'Sel yalnız uzayda olur.', 'Heyelanda hiç hareket olmaz.'], 'Selde su, heyelanda toprak veya kaya kütlesinin hareketi öne çıkar.', 'Olaylar hareket eden madde ve süreç bakımından ayrılır.', 'Hangi malzemenin hareket ettiğini karşılaştır.', 3),
   choose('“Doğa kaynaklıysa insan önlemlerinin hiçbir yararı olmaz.” düşüncesi için hangisi uygundur?', ['Yanlıştır; güvenli yapılaşma ve hazırlık kayıpları azaltabilir.', 'Doğrudur; risk azaltılamaz.', 'Doğrudur; bütün doğa olayları aynı zararı verir.', 'Yanlıştır; önlem bütün doğa olaylarını durdurur.'], 'Yanlıştır; güvenli yapılaşma ve hazırlık kayıpları azaltabilir.', 'Olayı durduramamak, zararlarını azaltamayacağımız anlamına gelmez.', 'Olayın kaynağı ile sonuçlarının büyüklüğünü ayır.', 4),
  ],
 },
 {
  topicIds: ['topic-1db20ab2d2177e0c'],
  introduction: 'Bir doğa olayının nedenini ve oluşturduğu sonucu ayırt etmek, yanlış açıklamalardan kaçınmayı sağlar. Her doğa olayı aynı süreçle oluşmaz.',
  sections: [
   { title: 'Farklı süreçler', body: ['Depremler yer kabuğundaki hareketlerle ilişkilidir. Yoğun yağış ve suyun birikmesi sel riskini artırabilir; eğim, zemin ve su koşulları heyelanı etkileyebilir.', 'Tek bir yağmur veya sıcak gün, uzun dönemli iklim değişikliği için tek başına kanıt sayılmaz. İklim ile yer kabuğu hareketleri aynı süreç değildir.'] },
   { title: 'Zararın büyüklüğü', body: ['Olayın şiddeti yanında insanların nerede yaşadığı, yapıların dayanıklılığı ve hazırlık düzeyi de sonuçları etkiler.', 'Doğrudan etkiler yaralanma ve yapı hasarı olabilir. Su, eğitim, sağlık ve ulaşım hizmetlerinin aksaması ise etkilerin daha geniş alana yayılmasına neden olabilir.'] },
  ],
  workedExample: { prompt: 'Yoğun yağıştan sonra suyun biriktiği bir alan taşkına uğruyor. Neden ile sonucu nasıl ayırırsın?', steps: ['Yoğun yağış olayın oluşumunda rol oynayan etkendir.', 'Suyun alana yayılması taşkın olayıdır.', 'Yolların kapanması veya yapıların zarar görmesi sonuçlardır.'], answer: 'Oluşuma etki eden neden ile yaşanan zarar ve aksama ayrı yazılır.' },
  activity: { title: 'Neden–olay–sonuç zinciri', instructions: ['“Yoğun yağış”, “su baskını” ve “ulaşımın aksaması” için üç kutu çiz.', 'Kutuları mantıklı sırayla birleştir.', 'Başka yerel sonuçlar uydurmadan yalnız verilen örneği yorumla.'], reflection: 'Aynı olayın farklı yerlerde farklı zarara yol açmasını hangi koşullar açıklayabilir?' },
  questions: [
   choose('Depremin oluşumu en doğrudan hangi süreçle ilişkilidir?', ['Yer kabuğu hareketleriyle', 'Defter sayfalarının sayısıyla', 'Her sıcak günle', 'Ayakkabı rengiyle'], 'Yer kabuğu hareketleriyle', 'Deprem jeolojik süreçlerle ilişkilidir.', 'Yerin yapısındaki hareketi düşün.'),
   truth('Bir doğa olayının zararı yalnız olayın adıyla belirlenir.', false, 'Yer, yapı dayanıklılığı ve hazırlık gibi birçok etken sonucu etkiler.', 'Aynı olayın farklı koşullarda etkisini düşün.'),
   fill('Yoğun yağıştan sonra suyun alanları kaplamasıyla ilgili olayın adı nedir? “Sel” veya “çığ” yaz.', 'sel', 'Sel, suyun normal sınırlarını aşarak alanları kaplamasıyla ilişkilidir.', 'Su ile kar kütlesi hareketini ayır.'),
   choose('Heyelanı etkileyebilen koşullardan biri hangisidir?', ['Eğim ve zeminin su durumu', 'Defterin kapağı', 'Güneş gözlüğünün rengi', 'Günün adı'], 'Eğim ve zeminin su durumu', 'Eğimli arazi ve zemin koşulları yamaç hareketlerini etkileyebilir.', 'Toprağın yamaçta duruşunu düşün.', 2),
   choose('Bir selde yolun kapanması hangi örnektir?', ['Olayın bir sonucu', 'Yağışın birimi', 'Selin mutlaka tek nedeni', 'Deprem ölçüm aracı'], 'Olayın bir sonucu', 'Yolun kapanması olayın günlük yaşam üzerindeki etkisidir.', 'Önce mi oluşuyor, olaydan sonra mı etkileniyor?', 3),
   choose('İki yerde benzer yağış var ama birinde zarar daha büyük. Hangi inceleme anlamlıdır?', ['Su yolları, yerleşim ve hazırlık koşullarını karşılaştırmak', 'Yalnız yer adlarının harflerini saymak', 'Bütün farkları yok saymak', 'Kanıtsız tek bir kişiyi suçlamak'], 'Su yolları, yerleşim ve hazırlık koşullarını karşılaştırmak', 'Kayıpları çevre, altyapı, yerleşim ve hazırlık düzeyi birlikte etkileyebilir.', 'Sonucu etkileyebilecek gerçek koşullara bak.', 4),
  ],
 },
 {
  topicIds: ['topic-8075de52676dd66a', 'topic-a2722addddf03e31'],
  introduction: 'Doğa tehlikelerine karşı önlem, yerel riskleri tanımak ve sorumlu yetişkinlerle plan yapmakla başlar. Her olay için tek bir rastgele davranış kuralı kullanılmaz.',
  sections: [
   { title: 'Hazırlığı önceden yap', body: ['Okulun ve ailenin acil durum planı öğrenilir. Toplanma bilgisi ve iletişim düzeni yetkili kaynaklarla ve sorumlu yetişkinlerle doğrulanır.', 'Evde ağır eşyaların güvenliği ve temel ihtiyaç planı yetişkinlerce değerlendirilir. Çocuklar dolap sabitleme veya yapı incelemesi gibi işleri tek başına yapmaz.'] },
   { title: 'Olay sırasında güvenilir yönerge', body: ['Sel suyu, hasarlı yapı ve kapatılmış alanlar merak için gezilmez. Su, elektrik ve gizli engeller gibi tehlikeler bulunabilir.', 'Bir olayın türüne ve bulunulan yere göre farklı yönergeler gerekir. Yetkililerin güncel uyarısı ve okulun yetişkinlerce yönetilen planı izlenir; sosyal medya söylentisine göre güzergâh belirlenmez.'] },
  ],
  workedExample: { prompt: 'Okul tatbikatı öncesi bir arkadaşın internetten bulduğu rastgele çıkış yolunu öneriyor. Nasıl değerlendirilir?', steps: ['İnternetteki çizimin okuluna ait olup olmadığı bilinmeyebilir.', 'Okulun kendi güncel planı öğretmenden öğrenilir.', 'Tatbikatta sorumlu öğretmenin yönlendirmesine uyulur.'], answer: 'Yerel ve doğrulanmış okul planı kullanılır.' },
  activity: { title: 'Hazırlık soruları', instructions: ['Öğretmenine sorabileceğin üç hazırlık sorusu yaz.', 'Örnek: “Okulumuzun güncel toplanma bilgisi nereden öğrenilir?”', 'Gerçek güzergâh veya adresi uygulamaya kaydetmeden planın kimden doğrulanacağını belirt.'], reflection: 'Bir başka okulun planı neden senin okulunda doğrudan uygulanamaz?' },
  questions: [
   choose('Okulun acil durum planı kimden öğrenilmelidir?', ['Sorumlu öğretmen ve okul yönetiminden', 'Rastgele oyun yorumundan', 'Kaynağı belirsiz mesajdan', 'Yalnız eski bir söylentiden'], 'Sorumlu öğretmen ve okul yönetiminden', 'Yerel, güncel ve yetkili plan okulun sorumlu kişilerinden öğrenilir.', 'Kendi okulundan sorumlu kişileri düşün.'),
   truth('Sel suyu çocukların merak için yürüyerek inceleyebileceği güvenli bir alandır.', false, 'Sel suyunda akıntı, gizli engel ve elektrik gibi tehlikeler bulunabilir.', 'Suyun altında görünmeyenleri düşün.'),
   fill('Kaynağı bilinmeyen afet mesajı uygulanmadan önce ne yapılmalıdır? “Doğrulanmalı” veya “yayılmalı” yaz.', 'doğrulanmalı', 'Güncel yetkili kaynakla doğrulama yanlış yönlendirmeyi azaltır.', 'Önce bilginin doğru olup olmadığını öğren.'),
   choose('Ağır dolabın güvenli sabitlenmesi kimin gözetiminde yapılmalıdır?', ['Sorumlu yetişkin ve uygun uzman desteğiyle', 'Çocukların tek başına itmesiyle', 'Dolabın üstüne çıkılarak', 'İnternetteki her yoruma göre'], 'Sorumlu yetişkin ve uygun uzman desteğiyle', 'Ağır eşyalara müdahale uygun bilgi, araç ve yetişkin sorumluluğu gerektirir.', 'Ağır eşyayı çocuğun hareket ettirmediği yolu seç.', 2),
   choose('Bir başka okulun tahliye çizimini kendi okulunda kullanmak neden uygun olmayabilir?', ['Bina ve yerel plan farklı olabilir.', 'Bütün binalar aynıdır.', 'Planların güncel olması önemsizdir.', 'Yetkililere sormak gereksizdir.'], 'Bina ve yerel plan farklı olabilir.', 'Uygun yönerge bulunduğun binaya ve güncel plana göre belirlenir.', 'Yerel koşulları düşün.', 3),
   choose('Bir arkadaşın kapatılmış hasarlı alana gidip fotoğraf çekmek istiyor. Hangi yaklaşım uygundur?', ['Girmemek ve sorumlu yetişkine haber vermek', 'Güvenlik şeridini kaldırmak', 'Daha çok kişiyi çağırmak', 'Yalnız kısa süre girmek'], 'Girmemek ve sorumlu yetişkine haber vermek', 'Kısıtlı alanda görünmeyen tehlikeler olabilir; kısa kalmak riski ortadan kaldırmaz.', 'Yetkili sınırını koruyan seçeneği seç.', 4),
  ],
 },
 {
  topicIds: ['topic-c14b30a4cc984bf4', 'topic-679d114505546b9b'],
  introduction: 'İklim bir yerin uzun yıllar boyunca gözlenen hava koşullarının genel özellikleridir. İklim değişikliği bu uzun dönemli özelliklerdeki değişimdir.',
  sections: [
   { title: 'Hava durumu ile iklim', body: ['Bugünün yağmurlu veya sıcak olması hava durumudur. İklimi anlamak için uzun yılların ölçümleri ve eğilimleri birlikte incelenir.', 'Tek bir sıcak veya soğuk gün, küresel iklim eğilimini tek başına kanıtlamaz ya da çürütmez. Bilim insanları çok sayıda ölçümü karşılaştırır.'] },
   { title: 'Sera gazları ve çözüm', body: ['Sera gazları Dünya’nın ısı dengesini etkiler. İnsanların fosil yakıt kullanımı ve bazı arazi kullanımları sera gazı miktarını artırarak güncel küresel ısınmaya katkı sağlar.', 'Enerjiyi verimli kullanmak, gereksiz tüketimi azaltmak ve doğayı korumak önemlidir. İklim sorunlarının çözümünde ailelerin yanında kurumların, şehirlerin ve ülkelerin ortak çalışması gerekir.'] },
  ],
  workedExample: { prompt: 'Bir kişi “Bugün soğuk; o hâlde iklim değişikliği yok.” diyor. Bu düşünce nasıl kontrol edilir?', steps: ['Bugünkü sıcaklık kısa süreli hava durumudur.', 'İklim için uzun dönemli ve geniş alanlı veriler gerekir.', 'Tek bir gün yerine yılların ölçümleri ve eğilimleri karşılaştırılır.'], answer: 'Bir soğuk gün uzun dönemli küresel iklim değişikliğini çürütmez.' },
  activity: { title: 'Zaman ölçeği kartları', instructions: ['“Bugün yağmur var” ve “uzun yılların sıcaklık ortalaması” cümlelerini ayrı kartlara yaz.', 'Kartları hava durumu ve iklim başlıklarına yerleştir.', 'Evde enerji tasarrufu için güvenli bir alışkanlık öner; elektrikli araçları sökme.'], reflection: 'Uzun dönemli bir sorunu incelerken neden tek günlük veri yeterli değildir?' },
  questions: [
   choose('“Bugün hava yağmurlu.” ifadesi hangisini anlatır?', ['Hava durumunu', 'Uzun dönemli iklimi tek başına', 'Depremin kesin zamanını', 'Kayaç türünü'], 'Hava durumunu', 'Bugüne ait kısa süreli koşul hava durumudur.', 'İfadenin zaman aralığına bak.'),
   truth('Tek bir soğuk gün küresel iklim değişikliğinin olmadığını kanıtlar.', false, 'İklim eğilimleri çok sayıda uzun dönemli ölçümle değerlendirilir.', 'Bir gün ile uzun yılları ayır.'),
   fill('Uzun yılların hava koşullarının genel özelliklerini anlatan kavram nedir?', 'iklim', 'İklim uzun dönemli genel koşullarla ilgilidir.', 'Hava durumundan daha uzun süreyi anlatan kavramı yaz.'),
   choose('İnsan etkinliklerinden hangisi sera gazı artışına katkı sağlayabilir?', ['Fosil yakıtların kullanılması', 'Boş defter sayfasını yeniden kullanmak', 'Gereksiz tüketimi azaltmak', 'Enerjiyi verimli kullanmak'], 'Fosil yakıtların kullanılması', 'Fosil yakıtların yakılması sera gazı salımlarına katkı sağlar.', 'Yakıt tüketimiyle ilgili seçeneği bul.', 2),
   choose('İklim değişikliğini araştırırken hangi veri daha uygundur?', ['Uzun yıllara ait çok sayıda ölçüm', 'Yalnız bugünkü bir fotoğraf', 'Bir kişinin bir günlük hissi', 'Bir şarkının süresi'], 'Uzun yıllara ait çok sayıda ölçüm', 'İklim eğilimleri uzun süreli ve güvenilir verilerle incelenir.', 'Zaman ölçeğini ve veri sayısını düşün.', 3),
   choose('“İklim sorununu bir çocuk tek başına çözmelidir.” düşüncesi nasıl düzeltilir?', ['Bireysel katkı önemlidir; kurumlar ve ülkeler de birlikte sorumluluk alır.', 'Bütün sorumluluk yalnız çocuğundur.', 'Hiç kimsenin katkısı olamaz.', 'Bilimsel ölçüme gerek yoktur.'], 'Bireysel katkı önemlidir; kurumlar ve ülkeler de birlikte sorumluluk alır.', 'Sorun çok düzeyli ortak çalışma gerektirir; sorumluluk tek bir çocuğa yüklenmez.', 'Birey, şehir ve ülke ölçeklerini birlikte düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-ca04707edbb3f7c0'],
  introduction: 'İklim değişikliği bazı aşırı hava olaylarının olasılığını veya şiddetini etkileyebilir. Her afetin nedeni iklim değildir; olaylar bilimsel süreçleriyle değerlendirilir.',
  sections: [
   { title: 'İlişkili riskler', body: ['Artan sıcaklıklar sıcak hava dalgalarını etkileyebilir. Bazı bölgelerde şiddetli yağış, su baskını ve kuraklık risklerinde değişimler görülebilir.', 'Kurak ve sıcak koşullar bazı yangınların yayılmasına elverişli ortam oluşturabilir; bu, her yangının ilk nedeninin aynı olduğu anlamına gelmez.'] },
   { title: 'Her olay için kanıt gerekir', body: ['İklim değişikliğinin belirli bir olay üzerindeki etkisini değerlendirmek uzmanların veri ve modellerle yaptığı çalışmaları gerektirir.', 'Deprem gibi yer kabuğu hareketleriyle ilgili olaylar “hava sıcak olduğu için oldu” diye açıklanmaz. Risk azaltma hem iklime uyumu hem de farklı tehlikelere uygun hazırlığı içerir.'] },
  ],
  workedExample: { prompt: 'Bir bölgede uzun dönemli sıcaklık artışı ve kuraklık riski inceleniyor. Aynı bilgi bir depremin nedenini de açıklar mı?', steps: ['Sıcaklık ve kuraklık iklimle ilişkili süreçlerdir.', 'Deprem yer kabuğunun hareketiyle ilişkilidir.', 'Farklı süreçleri tek nedene bağlamadan ayrı kanıtlarla incelemek gerekir.'], answer: 'Hayır; deprem ile iklimle ilişkili riskler farklı süreçlerle değerlendirilir.' },
  activity: { title: 'İlişkiyi ayırt et', instructions: ['Sıcak hava dalgası, kuraklık ve deprem için kartlar oluştur.', 'İklimle ilişkili süreçleri jeolojik süreçlerden ayır.', 'Her olayın yerel ayrıntısı için uzman kaynak gerektiğini not et.'], reflection: 'İki olayın aynı gün olması, birinin diğerine neden olduğunu gösterir mi?' },
  questions: [
   choose('Hangisi iklimle ilişkili risklerden biridir?', ['Sıcak hava dalgası', 'Hücrenin çekirdeği', 'Ay’ın evreleri', 'Defterin sayfa sayısı'], 'Sıcak hava dalgası', 'Sıcak hava dalgaları iklim koşulları ve eğilimleriyle ilişkilidir.', 'Uzun süreli aşırı sıcaklıkları düşün.'),
   truth('Bütün depremlerin nedeni havanın sıcak olmasıdır.', false, 'Depremler yer kabuğu hareketleriyle ilişkilidir; hava sıcaklığı genel bir deprem açıklaması değildir.', 'Jeolojik süreç ile hava koşulunu ayır.'),
   fill('Uzun süreli yağış yetersizliği ve su açığıyla ilişkili riskin adı nedir?', 'kuraklık', 'Kuraklık su yetersizliğinin zaman içinde gelişmesiyle ilişkilidir.', 'Su kaynaklarının uzun süre azalmasını düşün.'),
   choose('Sıcak ve kurak koşullar yangınlar için hangi etkiyi oluşturabilir?', ['Yayılmaya elverişli koşulları artırabilir.', 'Her yangının ilk nedenini kesin açıklar.', 'Bütün yangınları anında söndürür.', 'Yangın ile hiçbir koşulda ilişkili değildir.'], 'Yayılmaya elverişli koşulları artırabilir.', 'Yangının başlamasıyla yayılmasını etkileyen koşullar ayrı değerlendirilir.', 'Başlangıç nedeni ile yayılma koşulunu ayır.', 2),
   choose('Belirli bir selde iklim değişikliğinin etkisini değerlendirmek için ne gerekir?', ['Uzmanların veri ve model incelemesi', 'Yalnız bir söylenti', 'Tek bir kişinin tahmini', 'Görüntünün beğeni sayısı'], 'Uzmanların veri ve model incelemesi', 'Tek bir olayın nedenleri ve iklim etkisi bilimsel inceleme gerektirir.', 'Kanıt ve uzmanlık içeren seçeneği bul.', 3),
   choose('Aynı gün hem sıcak hava hem deprem yaşanmış. En bilimsel yorum hangisidir?', ['Aynı zamanda olmaları tek başına neden-sonuç kanıtı değildir.', 'Sıcaklık kesin deprem oluşturmuştur.', 'Deprem kesin bütün iklimi değiştirmiştir.', 'Kanıta artık gerek yoktur.'], 'Aynı zamanda olmaları tek başına neden-sonuç kanıtı değildir.', 'Birlikte görülme, farklı süreçler arasında nedensellik kurmak için yeterli değildir.', 'Zaman birlikteliği ile neden ilişkisini ayır.', 4),
  ],
 },
 {
  topicIds: ['topic-1c085d0abc8174ff'],
  introduction: 'İlk yardım, sağlık ekibi gelene kadar eğitimli kişilerin uygun bilgiyle yaptığı ilaçsız uygulamalardır. Bu ders, çocuklara tıbbi işlem yaptırmak için değil güvenli yardım istemeyi öğretmek içindir.',
  sections: [
   { title: 'Önce güvenlik ve haber verme', body: ['Bir olayda önce kendi güvenliğini koru. Dumanlı, elektrik tehlikesi olan veya hasarlı alana girmek yeni yaralanmalara neden olabilir.', 'Sorumlu bir yetişkine haber ver. Gerçek acil durumda 112’den yardım istenir; konum ve olay bilgisi sakin ve doğru aktarılır, çağrı görevlisinin yönlendirmesi izlenir.'] },
   { title: 'Bilmediğin işlemi yapma', body: ['Yaralıyı merak için hareket ettirme, yiyecek, içecek veya ilaç verme. Tıbbi işlemler ve ilk yardım uygulamaları eğitimli kişilere bırakılır.', 'Çocuklardan nabız ölçme, suni solunum veya ilaç uygulaması gibi işlemler beklenmez. Güvenli mesafede kalıp doğru kişiye haber vermek önemli bir katkıdır.'] },
  ],
  workedExample: { prompt: 'Bir arkadaşın düşmüş ve yerde ağrı nedeniyle hareket etmek istemiyor. Çocuk olarak hangi katkıyı yaparsın?', steps: ['Yeni bir tehlike olmadığından emin olmak için çevreye dikkat et ve kendini riske atma.', 'Arkadaşını çekiştirme veya kaldırmaya çalışma.', 'Öğretmene ya da sorumlu yetişkine hemen haber ver; gerçek acil yardım gerekiyorsa 112 desteği sağlanır.'], answer: 'Güvenliği koruyup yetişkine haber vermek; bilmediğin bir müdahaleyi yapmamak.' },
  activity: { title: 'Yardım isteme rol kartı', instructions: ['Tamamen hayalî bir olay için kâğıda yer, olay ve yetişkine bildirim başlıkları yaz.', 'Telefon kullanmadan öğretmenle yardım isteme cümlesi çalış.', 'Gerçek 112 araması yapılmayacağını açıkça belirt; kişisel adresini paylaşma.'], reflection: 'Yardım çağrısında sakin ve doğru bilgi vermek neden önemlidir?' },
  questions: [
   choose('Yaralanma gören bir çocuk için uygun ilk katkı hangisidir?', ['Kendi güvenliğini koruyup yetişkine haber vermek', 'Yaralıya rastgele ilaç vermek', 'Yaralıyı çekerek kaldırmak', 'Tehlikeli alana koşmak'], 'Kendi güvenliğini koruyup yetişkine haber vermek', 'Yeni bir yaralanma oluşturmadan güvenilir yardım istenmelidir.', 'Güvenlik ve bildirim içeren seçeneği bul.'),
   truth('Yaralıya ne olduğu bilinmeden yiyecek, içecek veya ilaç verilmelidir.', false, 'Bu uygulamalar zarar verebilir; müdahale eğitimli ve yetkili kişilere bırakılır.', 'Bilmediğin bir işlemin riskini düşün.'),
   fill('Türkiye’de gerçek bir acil yardım gereksiniminde hangi ortak numara aranır? Yalnız sayı yaz.', '112', '112 acil yardım çağrıları içindir; rol çalışmasında gerçekten aranmaz.', 'Ortak acil çağrı numarasını yaz.'),
   choose('Yardım isteme rol çalışması nasıl yapılmalıdır?', ['Gerçek arama olmadan öğretmenle canlandırılarak', '112 tekrar tekrar aranarak', 'Sahte ihbar verilerek', 'Bir yaralı gerçekten hareket ettirilerek'], 'Gerçek arama olmadan öğretmenle canlandırılarak', 'Eğitim için gerçek acil çağrı hattı meşgul edilmez ve kimse tehlikeye sokulmaz.', 'Gerçek acil hizmeti kullanmadan öğrenme yolunu seç.', 2),
   choose('Ağrı nedeniyle yerde kalan arkadaşını neden çekerek kaldırmamalısın?', ['Bilgisiz hareket ettirme yaralanmayı artırabilir.', 'Bildirim yapmak yasaktır.', 'Yetişkinler yardım edemez.', 'Yaralı herkesin hemen koşması gerekir.'], 'Bilgisiz hareket ettirme yaralanmayı artırabilir.', 'Uygun değerlendirme ve müdahale eğitimli kişilerin sorumluluğudur.', 'Durumu bilmeden hareket ettirmenin etkisini düşün.', 3),
   choose('“Herkesten önce müdahale edersem her zaman en iyi yardımı yapmış olurum.” düşüncesi nasıl düzeltilir?', ['Uygun yardım, güvenlik ve eğitim sınırları içinde davranmayı gerektirir.', 'Hız varsa bilgiye gerek yoktur.', 'İlaç vermek her durumda güvenlidir.', 'Kendini tehlikeye atmak her zaman zorunludur.'], 'Uygun yardım, güvenlik ve eğitim sınırları içinde davranmayı gerektirir.', 'Yardım etme isteği tek başına tıbbi bilgi veya güvenlik sağlamaz.', 'İyi niyet ile doğru uygulama arasındaki farkı düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-f0db619ac47d8d71'],
  introduction: 'Afet ve acil durumlarda farklı kurumlar farklı görevlerle birlikte çalışır. Kurumların görevini bilmek doğru bilgi ve yardım kanalına ulaşmayı kolaylaştırır.',
  sections: [
   { title: 'Kurumların iş birliği', body: ['AFAD, afet ve acil durumlarla ilgili risk azaltma, hazırlık ve müdahale çalışmalarında koordinasyon görevleri yürütür. Belediyeler, sağlık ve diğer kamu kurumları da sorumluluk alır.', 'İtfaiye yangınla mücadele ve ilgili kurtarma görevlerinde; sağlık ekipleri tıbbi değerlendirme ve sağlık hizmetinde çalışır. Kızılay insani yardım, beslenme ve barınma gibi alanlarda katkı sağlayabilir.'] },
   { title: 'Doğru kanal', body: ['112 gerçek acil durum çağrılarını uygun birimlere yönlendiren ortak çağrı numarasıdır. Kurumların internet duyuruları için kaynağın resmî ve güncel olduğu kontrol edilir.', 'Her kurum her işi tek başına yapmaz. Koordinasyon, farklı ekiplerin görevlerini birbirini tamamlayacak biçimde yürütmesini sağlar.'] },
  ],
  workedExample: { prompt: 'Bir olayda yangın söndürme, sağlık hizmeti ve barınma desteği gerekiyor. Neden birden fazla ekip çalışır?', steps: ['Yangınla mücadele özel araç ve eğitim gerektirir.', 'Sağlık değerlendirmesi sağlık ekibinin uzmanlığıdır.', 'Barınma ve temel ihtiyaç desteği başka kurumların katkısını gerektirebilir.', 'Bu görevler koordinasyonla birlikte yürütülür.'], answer: 'Farklı uzmanlıklar ve görevler koordinasyonla birbirini tamamlar.' },
  activity: { title: 'Görev eşleştirmesi', instructions: ['AFAD, itfaiye, sağlık ekibi ve Kızılay için dört kart oluştur.', 'Her karta bir örnek görev yaz.', 'Kurumları aramadan, ders kitabı ve öğretmen açıklamasıyla eşleştirmeyi kontrol et.'], reflection: 'İş birliği olması, kurumların bütün görevlerinin aynı olduğu anlamına gelir mi?' },
  questions: [
   choose('Afet çalışmalarında koordinasyon görevleri bulunan kurum hangisidir?', ['AFAD', 'Bir oyun kulübü', 'Bir kırtasiye', 'Rastgele yorum hesabı'], 'AFAD', 'AFAD afet ve acil durumlarla ilgili koordinasyon görevleri yürütür.', 'Afet ve acil durum yönetimiyle ilgili kurumu düşün.'),
   truth('Sağlık ekibi ile itfaiyenin bütün görevleri tamamen aynıdır.', false, 'Ekipler iş birliği yapsa da uzmanlık ve sorumlulukları farklıdır.', 'Tıbbi bakım ile yangın söndürmeyi ayır.'),
   fill('Yangınla mücadelede görevli belediye birimi genel olarak hangi adla bilinir?', 'itfaiye', 'İtfaiye yangınla mücadele ve ilgili kurtarma görevlerinde çalışır.', 'Yangın söndürme araçlarını kullanan ekibi düşün.'),
   choose('Kızılay hangi alanda katkı sağlayabilir?', ['İnsani yardım ve temel ihtiyaç desteği', 'Depremin kesin gününü söylemek', 'Bütün okullara ders notu vermek', 'Her binayı tek başına tasarlamak'], 'İnsani yardım ve temel ihtiyaç desteği', 'Kızılay insani yardım alanında çalışmalar yürütür.', 'Beslenme ve barınma desteğini düşün.', 2),
   choose('112’nin gerçek acil durumdaki temel işlevi nedir?', ['Çağrıyı uygun acil birimlere yönlendirmeye yardım etmek', 'Oyun sorularını cevaplamak', 'Her gün hava tahmini vermek', 'Sosyal medya hesabı açmak'], 'Çağrıyı uygun acil birimlere yönlendirmeye yardım etmek', 'Ortak çağrı sistemi acil yardım gereksiniminin uygun birimlere iletilmesini sağlar.', 'Acil yardım ile genel bilgi hattını ayır.', 3),
   choose('Bir olayda birçok ekip çalışması neyi gösterir?', ['Farklı uzmanlıkların koordinasyon gerektirdiğini', 'Hiçbir ekibin görevi olmadığını', 'Bütün ekiplerin aynı araca sahip olduğunu', 'Bilgi paylaşmanın gereksiz olduğunu'], 'Farklı uzmanlıkların koordinasyon gerektirdiğini', 'Ortak amaç için görevlerin uyumlu yürütülmesi gerekir.', 'Birlikte çalışmayı aynı işi yapmakla karıştırma.', 4),
  ],
 },
 {
  topicIds: ['topic-b18070615ebf07e2'],
  introduction: 'Afet yönetimi yalnız olay yaşandıktan sonra yardım etmek değildir. Risk azaltma, hazırlık, müdahale ve iyileştirme birbirini tamamlayan çalışmalardır.',
  sections: [
   { title: 'Olaydan önce', body: ['Risk azaltma, tehlikenin verebileceği zararı azaltmaya yönelik çalışmalardır. Güvenli yapılaşma ve uygun eşya sabitleme buna örnek olabilir.', 'Hazırlık; plan, eğitim, tatbikat ve temel ihtiyaçların düzenlenmesini kapsar. Okul ve aile planları sorumlu yetişkinlerle oluşturulur.'] },
   { title: 'Olay sırasında ve sonra', body: ['Müdahale, olayın hemen ardından can güvenliği ve acil ihtiyaçlara yönelik yetkili çalışmalardır. Çocuklar tehlikeli kurtarma görevine girmez.', 'İyileştirme; hizmetlerin ve günlük yaşamın yeniden kurulmasını, güvenliğin artırılmasını ve yaşananlardan öğrenmeyi içerir. Süreç yalnız hasarı eski hâline getirmekle sınırlı değildir.'] },
  ],
  workedExample: { prompt: 'Okulda tatbikat yapmak, olay sonrası sağlık hizmeti sunmak ve hasarlı binayı güvenli biçimde yenilemek hangi çalışmalara örnektir?', steps: ['Tatbikat hazırlık çalışmasıdır.', 'Acil sağlık hizmeti müdahale kapsamındadır.', 'Güvenli yenileme iyileştirme çalışmasına örnektir.'], answer: 'Hazırlık, müdahale ve iyileştirme.' },
  activity: { title: 'Yönetim döngüsü', instructions: ['Dört kutuya risk azaltma, hazırlık, müdahale ve iyileştirme yaz.', 'Her kutuya yetişkinler ve yetkili kurumların yürütebileceği bir örnek ekle.', 'Öğrenilen derslerin yeni hazırlıklara katkısını bir okla göster.'], reflection: 'Olay sonrası öğrenilenler, bir sonraki hazırlığı nasıl değiştirir?' },
  questions: [
   choose('Okul tatbikatı hangi çalışmaya örnektir?', ['Hazırlık', 'Rastgele söylenti', 'Gereksiz tüketim', 'Bilgisiz tıbbi işlem'], 'Hazırlık', 'Tatbikat, olaydan önce planın öğrenilmesine ve denenmesine yardım eder.', 'Olaydan önce yapılan eğitim çalışmasını düşün.'),
   truth('Afet yönetimi yalnız olaydan sonraki ilk saatten ibarettir.', false, 'Olay öncesi risk azaltma ve hazırlık ile sonrası müdahale ve iyileştirme de yönetimin parçalarıdır.', 'Dört çalışma başlığını hatırla.'),
   fill('Günlük yaşamın ve hizmetlerin güvenli biçimde yeniden kurulması hangi çalışmadır?', 'iyileştirme', 'İyileştirme olaydan sonra hizmet ve yaşamın yeniden düzenlenmesini kapsar.', 'Olaydan sonraki toparlanma sürecini düşün.'),
   choose('Ağır eşyaların yetişkinlerce uygun sabitlenmesi hangi amaca hizmet eder?', ['Riski azaltmaya', 'Tehlikeyi büyütmeye', 'Bilgiyi gizlemeye', 'Haberleşmeyi kesmeye'], 'Riski azaltmaya', 'Uygun sabitleme olası devrilme zararını azaltmaya yardımcı olur.', 'Olay öncesi zararı azaltma amacını düşün.', 2),
   choose('Yetkili ekiplerin olay sonrası acil sağlık desteği sunması hangi çalışmadır?', ['Müdahale', 'Takvim hazırlama', 'Yalnız hava gözlemi', 'Reklam yapma'], 'Müdahale', 'Acil ihtiyaçlara olayın hemen sonrasında verilen yetkili yanıt müdahaledir.', 'Acil yanıtın adını bul.', 3),
   choose('Bir tatbikatta sorun fark edilince en yararlı yaklaşım hangisidir?', ['Sorunu değerlendirip planı sorumlu kişilerle geliştirmek', 'Sorunu saklamak', 'Tatbikatları tamamen gereksiz saymak', 'Çocukları tehlikeli denemeye yönlendirmek'], 'Sorunu değerlendirip planı sorumlu kişilerle geliştirmek', 'Tatbikat öğrenme ve geliştirme fırsatıdır; eksikler güvenli biçimde giderilir.', 'Bilgiyi yeni hazırlığa dönüştüren seçeneği seç.', 4),
  ],
 },
 {
  topicIds: ['topic-c259c3b05891fc23'],
  introduction: 'İnsan kaynaklı tehlikeler sanayi, depolama, enerji ve ulaşım faaliyetlerinin bulunduğu yerlerle ilişkili olabilir. Bir yerin yalnız adına bakarak güvenli veya tehlikeli olduğuna karar verilmez.',
  sections: [
   { title: 'Etkinlik ile yeri ilişkilendir', body: ['Sanayi alanlarında üretim araçları ve kullanılan maddeler; ulaşım alanlarında yoğun hareket ve taşınan yükler önemlidir. Güvenli çalışma kuralları bu özelliklere göre planlanır.', 'Ev ve okulda da arızalı araç veya uygun olmayan depolama gibi riskler bulunabilir. Tehlikeyi görmek için uzak bir tesise gitmek gerekmez.'] },
   { title: 'Denetim ve güvenlik sınırı', body: ['Bir tesisin güvenliğini uzmanların denetimi, uygun planlama ve kurallara uyum etkiler. “Bütün tesisler aynı derecede tehlikelidir” diye genelleme yapılmaz.', 'Çocuklar sanayi alanına veya yasak bölgeye gözlem için girmez; harita, kitap ve öğretmen açıklaması üzerinden öğrenir.'] },
  ],
  workedExample: { prompt: 'Bir öğrenci iki tesisin yalnız fotoğrafına bakarak birinin kesin güvensiz olduğunu söylüyor. Hangi bilgiler eksiktir?', steps: ['Fotoğraf, bakım ve denetim kayıtlarını göstermez.', 'Kullanılan maddeler ve güvenlik planı bilinmeyebilir.', 'Yetkili incelemesi olmadan kesin güvenlik hükmü verilmez.'], answer: 'Yalnız görünüş değil, yetkili değerlendirmesi ve çalışma koşulları gerekir.' },
  activity: { title: 'Faaliyet ve önlem çizelgesi', instructions: ['Sanayi, ulaşım ve okul başlıkları oluştur.', 'Her başlık için genel bir güvenlik gereksinimi yaz.', 'Gerçek tesis adresi paylaşmadan ve alana gitmeden kâğıt üzerinde çalış.'], reflection: 'Bir tehlikeyi tanımak için tehlikeli yere bizzat gitmek gerekli midir?' },
  questions: [
   choose('Sanayi kazaları en doğrudan hangi faaliyet alanıyla ilişkilidir?', ['Üretim tesisleriyle', 'Ay’ın evreleriyle', 'Yıldızların doğmasıyla', 'Gökkuşağının rengiyle'], 'Üretim tesisleriyle', 'Sanayi, üretim faaliyetleri ve bu faaliyetlerde kullanılan sistemlerle ilgilidir.', 'Üretim sözcüğünün alanını düşün.'),
   truth('İnsan kaynaklı riskler yalnız çok uzak fabrikalarda bulunabilir.', false, 'Ev, okul ve ulaşım gibi yakın çevrelerde de insan etkinliğiyle ilgili riskler bulunabilir.', 'Arızalı bir ev aracını düşün.'),
   fill('Bir güvenlik sınırı çocuğu içeri davet mi eder, tehlikeye karşı uyarır mı? “Uyarır” veya “davet eder” yaz.', 'uyarır', 'Güvenlik sınırı yetkisiz yaklaşmayı önlemek için kullanılır.', 'Sınırın koruma amacını düşün.'),
   choose('Bir tesisi incelemek isteyen öğrenci hangi yolu kullanmalıdır?', ['Öğretmen eşliğinde kitap ve uygun bilgi kaynaklarıyla öğrenmek', 'Yasak bölgeye gizlice girmek', 'Güvenlik çitini aşmak', 'Bilinmeyen depoyu açmak'], 'Öğretmen eşliğinde kitap ve uygun bilgi kaynaklarıyla öğrenmek', 'Tehlikeli alana girmeden öğrenme sağlanabilir.', 'Güvenli bilgi edinme yolunu seç.', 2),
   choose('Bir yerin güvenliğini değerlendirirken hangisi önemlidir?', ['Denetim, bakım ve çalışma koşulları', 'Yalnız tabelanın rengi', 'Sadece tesis adının uzunluğu', 'Fotoğrafın beğeni sayısı'], 'Denetim, bakım ve çalışma koşulları', 'Güvenlik, görünüşten daha kapsamlı teknik ve yönetsel bilgi gerektirir.', 'Görünüş dışındaki gerçek güvenlik etkenlerini bul.', 3),
   choose('“Bütün fabrikalar aynı risklere sahiptir.” düşüncesi neden eksiktir?', ['Faaliyetler, maddeler ve güvenlik koşulları farklı olabilir.', 'Fabrikalarda hiçbir faaliyet yoktur.', 'Bütün binaların içinde aynı araç vardır.', 'Denetim sonuçları hiçbir zaman önemli değildir.'], 'Faaliyetler, maddeler ve güvenlik koşulları farklı olabilir.', 'Yerlerin özellikleri ve koruma önlemleri ayrı değerlendirilir.', 'Bir üretim yerini diğerinden ayıran koşulları düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-2457267009f51d80'],
  introduction: 'İnsan kaynaklı büyük olayların zararları yalnız kırılan eşyalardan ibaret değildir. İnsan sağlığı, çevre, ekonomi ve hizmetlere erişim birlikte etkilenebilir.',
  sections: [
   { title: 'Doğrudan ve dolaylı zarar', body: ['Yaralanma ve bir yapının hasar görmesi doğrudan etkiler olabilir. Ulaşımın, üretimin veya okul hizmetinin aksaması ise daha geniş sonuçlar doğurabilir.', 'Bir kirletici hava, su veya toprak yoluyla canlılara zarar verebilir. Zararın niteliği için uzman ölçümü ve inceleme gerekir.'] },
   { title: 'Dayanışmayı güvenli kur', body: ['İnsanların kendilerini üzgün veya kaygılı hissetmesi anlaşılabilir; çocuklar duygularını güvendikleri yetişkinlerle paylaşabilir.', 'Yardım isteği tehlikeli alana girmeyi gerektirmez. İhtiyaç duyulan destek, yetişkin ve yetkili kuruluşların yönlendirmesiyle sağlanır; doğrulanmamış yardım çağrıları yayılmaz.'] },
  ],
  workedExample: { prompt: 'Bir sızıntıda dere kirleniyor ve balıkçılık bir süre duruyor. Hangi zarar alanları vardır?', steps: ['Derenin kirlenmesi çevresel etkidir.', 'Canlıların etkilenmesi ekolojik ve sağlıkla ilişkili sonuçlar doğurabilir.', 'Balıkçılığın durması geçim ve ekonomik faaliyetleri etkiler.'], answer: 'Çevresel ve ekonomik etkiler birbiriyle bağlantılıdır.' },
  activity: { title: 'Zarar alanlarını sınıflandır', instructions: ['İnsan, çevre, ekonomi ve hizmetler için dört sütun çiz.', 'Hayalî bir olay için verilen “yol kapandı” ve “su kirlendi” kartlarını yerleştir.', 'Kimseyi suçlayan veya gerçek kişisel bilgi içeren örnek kullanma.'], reflection: 'Bir çevresel zarar neden insanların günlük yaşamını da etkiler?' },
  questions: [
   choose('Bir sızıntıda derenin kirlenmesi hangi tür etkidir?', ['Çevresel', 'Yalnız takvimle ilgili', 'Yalnız dil bilgisiyle ilgili', 'Hiçbir zararla ilgili değil'], 'Çevresel', 'Su ve canlıların etkilenmesi çevresel zarar kapsamındadır.', 'Doğal çevrede neyin değiştiğine bak.'),
   truth('Bir büyük kazanın yalnız ekonomik etkisi olabilir; insan ve çevre etkilenemez.', false, 'Kazalar insan sağlığını, çevreyi ve hizmetleri de etkileyebilir.', 'Farklı zarar alanlarını birlikte düşün.'),
   fill('Olay nedeniyle ulaşım ve okul hizmetinin durması günlük yaşamda ne oluşturur? “Aksama” veya “kutlama” yaz.', 'aksama', 'Hizmetlerin kesintiye uğraması günlük yaşamı aksatır.', 'Hizmetin olağan biçimde devam edip etmediğini düşün.'),
   choose('Olaydan sonra kaygılanan çocuk için uygun destek hangisidir?', ['Güvendiği yetişkinle duygularını paylaşmak', 'Duygularını saklamaya zorlanmak', 'Sürekli korkutucu görüntü izlemek', 'Tek başına tehlikeli yere gitmek'], 'Güvendiği yetişkinle duygularını paylaşmak', 'Güvenilir yetişkin desteği duygularla baş etmeye yardım eder.', 'Güvenli sosyal desteği düşün.', 2),
   choose('Su kirliliği nedeniyle bir işin durması hangi ilişkiyi gösterir?', ['Çevresel zararın ekonomik etki de doğurabileceğini', 'Çevre ile geçimin asla ilişkili olmadığını', 'Suyun artık madde olmadığını', 'Bütün işlerin aynı nedenle durduğunu'], 'Çevresel zararın ekonomik etki de doğurabileceğini', 'Çevre koşulları, insanların geçim ve üretim faaliyetlerini etkileyebilir.', 'Zarar alanları arasındaki bağlantıyı izle.', 3),
   choose('“Yardım etmek için hasarlı tesise girmeliyim.” düşüncesi nasıl düzeltilir?', ['Güvenli yardım, yetkili ve yetişkin yönlendirmesiyle yapılır.', 'İyi niyet bütün tehlikeyi yok eder.', 'Çocuklar kurtarma görevini tek başına üstlenmelidir.', 'Güvenlik sınırı yardım edenler için geçersizdir.'], 'Güvenli yardım, yetkili ve yetişkin yönlendirmesiyle yapılır.', 'Yeni mağduriyet oluşturmamak için güvenlik ve görev sınırları korunur.', 'Yardım etmek ile tehlikeye girmeyi ayır.', 4),
  ],
 },
 {
  topicIds: ['topic-232cdbb11f57eef8'],
  introduction: 'Doğa tehlikelerinin oluşum yerleri jeolojik yapı, yer şekilleri, yağış, kar ve su koşullarıyla ilişkili olabilir. Harita ve yerel risk bilgileri yetkili kaynaklarla değerlendirilir.',
  sections: [
   { title: 'Yer özelliklerini göz önünde tut', body: ['Eğimli ve uygun zemin koşullarındaki yamaçlar heyelanla; yoğun kar bulunan dik yamaçlar çığla ilişkili olabilir. Dere yatakları ve suyun birikebildiği alanlar taşkından etkilenebilir.', 'Deprem tehlikesi jeolojik özelliklerle ilişkilidir. Bir yerin yalnız o günkü havasına bakılarak deprem zamanı veya kesin güvenliği söylenemez.'] },
   { title: 'Harita bilgi verir; kesin olay zamanı vermez', body: ['Tehlike haritaları farklı alanların özelliklerini anlamaya yardım eder. Haritadaki bilgi bir olayın kesin gün ve saatini söylemek değildir.', 'Çocuklar riskli yamaç veya dere yatağına araştırma için gitmez; öğretmen ve yetkili kurumların kaynaklarıyla öğrenir. Yerel yerleşim kararları uzmanların işidir.'] },
  ],
  workedExample: { prompt: 'Bir çizimde dik ve karla kaplı yamaç, diğerinde dere yatağı var. Hangi farklı tehlikeler düşünülür?', steps: ['Yoğun kar ve dik yamaç çığ koşullarıyla ilişkili olabilir.', 'Dere yatağı taşkınla ilişkili olabilir.', 'Kesin yerel değerlendirme için yetkili bilgi gerekir.'], answer: 'Çığ ve taşkın gibi farklı tehlikeler yer özellikleriyle ilişkilendirilir.' },
  activity: { title: 'Hayalî arazi çizimi', instructions: ['Kâğıda bir yamaç ve bir dere çiz.', 'Çığ ve taşkın sözcüklerini uygun özelliklerle eşleştir.', 'Bu çizimin gerçek yer için güvenlik kararı vermediğini not et.'], reflection: 'Basit bir çizim ile uzmanların yerel risk haritası arasında hangi farklar vardır?' },
  questions: [
   choose('Yoğun kar ve dik yamaç hangi tehlikeyle ilişkilendirilebilir?', ['Çığ', 'Ay evresi', 'Hücre bölümü', 'Ampulün yanması'], 'Çığ', 'Kar kütlesinin eğim boyunca hareketi çığdır.', 'Hareket edebilecek karı düşün.'),
   truth('Bir tehlike haritası depremin kesin gün ve saatini verir.', false, 'Tehlike haritası risk değerlendirmesine bilgi sağlar; kesin olay zamanını bildirmez.', 'Olası tehlike ile kesin zaman tahminini ayır.'),
   fill('Suyun doğal akış yolu ve çevresiyle ilgili kavramı tamamla: dere ___.', 'yatağı', 'Dere yatağı suyun doğal akış alanıdır ve taşkın değerlendirmesinde önemlidir.', 'Derenin izlediği alanın adını düşün.'),
   choose('Bir bölgenin deprem tehlikesi en doğrudan hangi bilgiyle ilişkilidir?', ['Jeolojik özellikler', 'Bugünkü kıyafet rengi', 'Bir kişinin doğum günü', 'Sınıf defterinin boyu'], 'Jeolojik özellikler', 'Deprem yer kabuğu süreçleriyle ilgili olduğu için jeolojik bilgi önemlidir.', 'Yerin yapısıyla ilgili bilgiyi seç.', 2),
   choose('Riskli yamaç hakkında bilgi edinmek isteyen çocuk için hangi yol uygundur?', ['Öğretmenle yetkili bilgi kaynaklarını incelemek', 'Yamaca tek başına gidip kazmak', 'Güvenlik şeridini geçmek', 'Düşen taşları yakalamaya çalışmak'], 'Öğretmenle yetkili bilgi kaynaklarını incelemek', 'Öğrenme, tehlikeli alana girilmeden uygun kaynaklarla yapılmalıdır.', 'Güvenli bilgi edinmeyi seç.', 3),
   choose('Hayalî bir haritada derenin yanına bir ev çizilmiş. “Kesin güvenlidir.” denebilir mi?', ['Hayır; gerçek yer için uzman ve yerel bilgi gerekir.', 'Evet; çizimde tehlike hiç olmaz.', 'Evet; her dere aynı koşuldadır.', 'Hayır; bütün evler her zaman aynı risktedir.'], 'Hayır; gerçek yer için uzman ve yerel bilgi gerekir.', 'Basit model yerel zemin, yapı ve taşkın koşullarını bütünüyle göstermez.', 'Modelin sınırlarını düşün.', 4),
  ],
 },
 {
  topicIds: ['topic-c921d7fdac0867e3'],
  introduction: 'Doğa kaynaklı afetlerin zararları olayın büyüklüğü yanında yerleşim, yapı dayanıklılığı, altyapı ve hazırlık düzeyine bağlıdır. İnsanların gereksinimleri farklı olabilir.',
  sections: [
   { title: 'Birden çok etki alanı', body: ['İnsanlar yaralanabilir, evler ve yollar hasar görebilir. Temiz su, elektrik, sağlık ve eğitim hizmetleri aksayabilir.', 'Çevrede toprak, su ve canlı yaşamı etkilenebilir. Geçim kaynaklarının zarar görmesi ve günlük düzenin bozulması toparlanmayı zorlaştırabilir.'] },
   { title: 'Kapsayıcı destek', body: ['Yaşlılar, engelliler, küçük çocuklar veya özel desteğe ihtiyaç duyan kişiler için planlarda farklı erişim gereksinimleri dikkate alınır.', 'Afetten etkilenen kişiler suçlanmaz ve görüntüleri izinsiz paylaşılmaz. Çocuklar güvendikleri yetişkinlerle duygularını paylaşabilir; yardım çalışmaları yetkililerle güvenli biçimde yürütülür.'] },
  ],
  workedExample: { prompt: 'Bir olayda aynı mahallede bazı kişiler merdivenleri kullanamıyor. Plan yalnız herkesin aynı biçimde hareket edeceğini varsayarsa ne eksik kalır?', steps: ['İnsanların hareket ve erişim gereksinimleri farklı olabilir.', 'Tek bir yöntem herkesin güvenliğini sağlamayabilir.', 'Kapsayıcı plan, uygun desteği yetkili ve sorumlu kişilerle önceden düzenler.'], answer: 'Farklı erişim gereksinimleri plana dahil edilmelidir.' },
  activity: { title: 'Hizmet gereksinimi kartları', instructions: ['Temiz su, sağlık, ulaşım ve eğitim başlıkları yaz.', 'Bir hizmet aksarsa günlük yaşamda neyin etkilenebileceğini belirt.', 'Gerçek kişilerin görüntü veya özel bilgilerini kullanma.'], reflection: 'Herkese aynı yardımı sunmak, her gereksinimi karşılamak anlamına gelir mi?' },
  questions: [
   choose('Afet sonrası hangi hizmetin aksaması sağlık riskini artırabilir?', ['Temiz suya erişim', 'Defter kapağının değişmesi', 'Takvim adının değişmesi', 'Sınıf renginin farklı olması'], 'Temiz suya erişim', 'Temiz su yaşam ve sağlık için temel gereksinimdir.', 'Günlük temel ihtiyacı düşün.'),
   truth('Bir afet herkesi aynı biçimde ve aynı düzeyde etkiler.', false, 'Yer, yapı, hazırlık ve kişisel gereksinimler farklı etkiler oluşturabilir.', 'İnsanların koşullarının farklı olabileceğini düşün.'),
   fill('Günlük yaşam için içilebilir ve güvenli suya ne tür su denir? “Temiz” veya “kirli” yaz.', 'temiz', 'Temiz suya erişim temel ihtiyaçlardan biridir.', 'Sağlık açısından güvenli olanı seç.'),
   choose('Kapsayıcı bir plan hangi konuyu dikkate alır?', ['Farklı erişim ve destek gereksinimlerini', 'Yalnız en hızlı koşan kişileri', 'Yalnız resimlerin rengini', 'Kimsenin ihtiyacını sormamayı'], 'Farklı erişim ve destek gereksinimlerini', 'Herkesin güvenliği için farklı gereksinimler planlanmalıdır.', 'Herkesin aynı yöntemle hareket edemeyebileceğini düşün.', 2),
   choose('Afetten etkilenen bir kişinin özel görüntüsünü izinsiz paylaşmak neden uygun değildir?', ['Mahremiyetine ve saygınlığına zarar verebilir.', 'Her zaman zorunlu bir yardım biçimidir.', 'İzin yalnız oyunlarda gerekir.', 'Etkilenen kişilerin hakları yoktur.'], 'Mahremiyetine ve saygınlığına zarar verebilir.', 'Yardım çalışmasında da kişilerin hakları ve özel yaşamı korunur.', 'Yardım ile özel bilgiyi yaymayı ayır.', 3),
   choose('“Hazırlıklı yerlerde hiç zarar olmaz; zarar görenler suçludur.” düşüncesi nasıl değerlendirilir?', ['Yanlıştır; hazırlık riski azaltabilir ama bütün zararı yok etmez ve mağdurlar suçlanmaz.', 'Doğrudur; her zararın tek nedeni kişinin kendisidir.', 'Doğrudur; hazırlık bütün doğa olaylarını engeller.', 'Yanlıştır; hiçbir önlemin yararı yoktur.'], 'Yanlıştır; hazırlık riski azaltabilir ama bütün zararı yok etmez ve mağdurlar suçlanmaz.', 'Risk çok sayıda etkenle ilişkilidir; dayanışma ve doğru bilgi gerekir.', 'Risk azaltma ile kesin zarar görmeme garantisini ayır.', 4),
  ],
 },
 {
  topicIds: ['topic-395fa7708da99121'],
  introduction: 'İklim değişikliği tek bir ülkenin sınırlarıyla sınırlı değildir. Bilimsel bilgi, ulusal politikalar, yerel uygulamalar ve uluslararası iş birliği birbirini tamamlar.',
  sections: [
   { title: 'Farklı görevler', body: ['Türkiye’de Çevre, Şehircilik ve İklim Değişikliği Bakanlığı iklimle ilgili kamu çalışmalarında görev alır. Belediyeler ulaşım, atık ve enerji verimliliği gibi alanlarda yerel katkı sağlayabilir.', 'Birleşmiş Milletler İklim Değişikliği Çerçeve Sözleşmesi ülkelerin iklim alanında iş birliği çerçevelerindendir. IPCC, bilimsel araştırmaları değerlendirip raporlar hazırlayan bir kuruldur; acil kurtarma ekibi değildir.'] },
   { title: 'Bilim ile uygulamayı ayırt et', body: ['Bilimsel değerlendirme iklimin nedenleri, etkileri ve çözüm seçenekleri hakkında kanıt sunar. Kamu kurumları ve ülkeler bu bilgiyle politikalar ve uygulamalar geliştirebilir.', 'Çocuklar okul ve aileyle güvenli tasarruf alışkanlıklarına katılabilir. Ülke düzeyindeki sorumluluklar tek bir çocuğa yüklenmez; yanlış veya güncel olmayan kurum bilgileri yetkili kaynaklardan kontrol edilir.'] },
  ],
  workedExample: { prompt: 'Bir rapor kurulu ile bir belediyenin iklim çalışmaları aynı görev midir?', steps: ['Bilimsel kurul mevcut araştırmaları değerlendirerek bilgi sunabilir.', 'Belediye yerel ulaşım veya atık yönetimi uygulaması yapabilir.', 'Bilgi üretimi ve uygulama farklı ama tamamlayıcı rollerdir.'], answer: 'Hayır; bilimsel değerlendirme ile yerel uygulama birbirini tamamlayan farklı görevlerdir.' },
  activity: { title: 'Görev ölçekleri', instructions: ['Okul, belediye, ülke ve uluslararası iş birliği başlıklı dört kutu çiz.', 'Her kutuya uygun bir iklim çalışması örneği yerleştir.', 'Kurum adlarını ders kaynağıyla kontrol et; hiçbir kurumu alıştırma için arama.'], reflection: 'Bir okulun tasarruf çalışması ile ülkelerin ortak iklim politikaları nasıl birbirini tamamlar?' },
  questions: [
   choose('IPCC’nin temel rolü hangisidir?', ['İklimle ilgili bilimsel araştırmaları değerlendirmek', 'Her yangına ilk araçla gitmek', 'Her okulun sınav notunu vermek', 'Bütün depremlerin kesin gününü söylemek'], 'İklimle ilgili bilimsel araştırmaları değerlendirmek', 'IPCC bilimsel değerlendirme raporları hazırlayan bir kuruldur.', 'Bilimsel rapor hazırlama rolünü seç.'),
   truth('İklim sorunları yalnız bir ülkenin sınırları içinde etkili olabilir.', false, 'İklim sistemi ve sera gazlarının etkileri sınırlarla sınırlı değildir.', 'Atmosferin ülkeler arasında kesilmediğini düşün.'),
   fill('Şehir düzeyinde ulaşım ve atık yönetimi gibi hizmetleri yürüten yerel yönetim genel olarak hangi adla bilinir?', 'belediye', 'Belediyeler yerel hizmetlerle iklim çalışmalarına katkı sağlayabilir.', 'Şehrin yerel yönetimini düşün.'),
   choose('Hangisi uluslararası iklim iş birliğiyle ilişkilidir?', ['BM İklim Değişikliği Çerçeve Sözleşmesi', 'Bir sınıfın yoklama kâğıdı', 'Bir oyunun puan tablosu', 'Bir topun rengi'], 'BM İklim Değişikliği Çerçeve Sözleşmesi', 'Bu çerçeve ülkelerin iklim alanındaki ortak çalışmalarına ilişkindir.', 'Birden fazla ülkenin katılımını düşün.', 2),
   choose('Bilimsel kurul ile belediyenin rolleri için hangisi doğrudur?', ['Araştırma değerlendirmesi ve yerel uygulama birbirini tamamlayabilir.', 'İkisi de yalnız okul notu verir.', 'Bilimsel bilgi uygulamaya hiçbir katkı sağlayamaz.', 'Bütün görevleri aynıdır.'], 'Araştırma değerlendirmesi ve yerel uygulama birbirini tamamlayabilir.', 'Kanıt sunmak ile yerel hizmet uygulamak farklı ama bağlantılı rollerdir.', 'Bilgi ile uygulama ilişkisini düşün.', 3),
   choose('“Okulda tasarruf yapılıyorsa ülke ve kurumların başka çalışmasına gerek yoktur.” düşüncesi nasıl değerlendirilir?', ['Yanlıştır; bireysel ve kurumsal çalışmalar birlikte gerekir.', 'Doğrudur; bütün sorumluluk çocuklardadır.', 'Doğrudur; uluslararası iş birliği gereksizdir.', 'Yanlıştır; okulun hiçbir katkısı olamaz.'], 'Yanlıştır; bireysel ve kurumsal çalışmalar birlikte gerekir.', 'İklim değişikliği farklı ölçeklerde ortak sorumluluk ve uygulama gerektirir.', 'Bir örneğin bütün çözümün yerini tutup tutmadığını düşün.', 4),
  ],
 },
];

export const disasterLessons: LessonContent[] = concepts.flatMap(({ topicIds, questions, ...lesson }) =>
 topicIds.map(topicId => ({ ...lesson, topicId,
  questions: questions.map((question, index) => ({ ...question, id: `gad-${topicId}-${index + 1}` })),
 })),
);
