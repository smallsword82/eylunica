import type { Activity } from "../learning-engine";
export const readingSkills = [
  "Ana fikir",
  "Yardımcı fikir",
  "Neden-sonuç",
  "Çıkarım",
  "Olay sıralama",
  "Kelime anlamı",
] as const;
export type Story = {
  id: string;
  title: string;
  level: number;
  grade: string;
  sentences: string[];
  questions: Activity[];
};
type QuestionSpec = [
  prompt: string,
  choices: string[],
  evidence: number[],
  explanation: string,
];
function story(
  id: string,
  title: string,
  level: number,
  sentences: string[],
  specs: QuestionSpec[],
): Story {
  return {
    id,
    title,
    level,
    grade:
      level === 1
        ? "7–9 yaş · kısa metin"
        : level === 2
          ? "4. sınıf · gelişen okur"
          : "5. sınıf ve üzeri · derin okur",
    sentences,
    questions: specs.map(([prompt, answers, evidence, explanation], i) => {
      const answer = i % 4,
        choices = [...answers];
      const correct = choices.shift()!;
      choices.splice(answer, 0, correct);
      return {
        id: `${id}-${i}`,
        title,
        skill: readingSkills[i],
        prompt,
        choices,
        answer,
        evidence,
        sentences,
        hint: `${readingSkills[i]} için metne dön. Özellikle ${evidence.map((n) => n + 1).join(" ve ")}. cümleyi incele.`,
        explanation,
      };
    }),
  };
}
export const stories: Story[] = [
  story(
    "fener",
    "Renkli Fener",
    1,
    [
      "Mina, okul konseri için kâğıttan bir fener yaptı.",
      "Rüzgâr çıkınca fenerin ince sapı koptu.",
      "Lidya, sapı daha kalın bir iple bağlamayı önerdi.",
      "İkisi birlikte çalışınca fener yeniden sahneye asıldı.",
      "Mina, dayanıklı bir şeyin kolayca bozulmadığını o gün öğrendi.",
    ],
    [
      [
        "Bu hikâyenin ana düşüncesi nedir?",
        [
          "Birlikte çözüm bulmak bir işi kolaylaştırır.",
          "Her fener aynı renkte olmalıdır.",
          "Konserler yalnızca açık havada olur.",
          "Bir şey bozulunca onu bırakmalıyız.",
        ],
        [3],
        "İki arkadaş birlikte çalışınca feneri yeniden astı. Metnin bütünü yardımlaşarak sorun çözmeyi anlatıyor.",
      ],
      [
        "Lidya hangi malzemeyi önerdi?",
        ["Kalın ip", "Cam bardak", "İnce kâğıt", "Tahta kutu"],
        [2],
        "Üçüncü cümlede önerinin kalın ip olduğu açıkça söyleniyor.",
      ],
      [
        "Fenerin sapı neden koptu?",
        [
          "Rüzgâr çıktığı ve sap ince olduğu için",
          "Işık söndüğü için",
          "Mina uyuduğu için",
          "Fener çok küçük olduğu için",
        ],
        [1],
        "İkinci cümle rüzgâr ile ince sapın kopması arasındaki bağlantıyı kuruyor.",
      ],
      [
        "Mina ve Lidya için hangisini söyleyebiliriz?",
        [
          "Sorunu görünce çözüm aradılar.",
          "Feneri hemen çöpe attılar.",
          "Konserden vazgeçtiler.",
          "Hiç konuşmadılar.",
        ],
        [2, 3],
        "Öneri getirip birlikte çalışmaları, vazgeçmek yerine çözüm aradıklarını gösterir.",
      ],
      [
        "Hangisi diğerlerinden önce oldu?",
        [
          "Mina fener yaptı.",
          "Kalın ip bağlandı.",
          "Fener yeniden asıldı.",
          "Mina dayanıklılığı öğrendi.",
        ],
        [0],
        "Önce fener yapıldı, sonra sorun çıktı ve çözüm bulundu.",
      ],
      [
        "“Dayanıklı” bu metinde ne anlama gelir?",
        [
          "Kolayca bozulmayan",
          "Çok hızlı koşan",
          "Daima kırmızı olan",
          "Yüksek ses çıkaran",
        ],
        [4],
        "Son cümle, dayanıklı kelimesinin anlamını doğrudan açıklıyor.",
      ],
    ],
  ),
  story(
    "tohum",
    "Kayıp Tohum Kutusu",
    1,
    [
      "Arya ile Derin, okul bahçesine çiçek ekmek için bir kutu tohum getirdi.",
      "Kutuyu bankta bulamayınca önce çevreyi dikkatle incelediler.",
      "Toprağın üzerindeki küçük izler kulübeye kadar gidiyordu.",
      "Kutuyu, yağmurdan korumak için kulübeye taşıyan görevli onlara seslendi.",
      "Çocuklar izleri takip ederek kutuya ulaştı ve görevliye teşekkür etti.",
      "Arya, dikkatle bakmanın aramakta çok işe yaradığını söyledi.",
    ],
    [
      [
        "Metin en çok neyi anlatıyor?",
        [
          "Dikkatli gözlemle kayıp bir şeyi bulmayı",
          "Çiçeklerin yalnızca yazın açtığını",
          "Bütün kutuların aynı olduğunu",
          "Yağmurda hiç yürünmediğini",
        ],
        [4, 5],
        "Çocuklar çevreyi gözleyip izleri takip ederek kutuyu buluyor.",
      ],
      [
        "İzler nereye gidiyordu?",
        ["Kulübeye", "Sahneye", "Sınıfa", "Otobüse"],
        [2],
        "Üçüncü cümle izlerin kulübeye ulaştığını söylüyor.",
      ],
      [
        "Görevli kutuyu neden taşıdı?",
        [
          "Yağmurdan korumak için",
          "Kutuyu saklamak için",
          "Konser bileti yapmak için",
          "İzleri silmek için",
        ],
        [3],
        "Görevlinin amacı dördüncü cümlede açıklanıyor.",
      ],
      [
        "Görevlinin çocuklara yaklaşımı nasıldı?",
        [
          "Yardımseverdi.",
          "Onları engellemek istedi.",
          "Tohumları istemedi.",
          "Kutuyu kaybettiğini gizledi.",
        ],
        [3, 4],
        "Kutuyu koruması ve çocuklara seslenmesi yardım ettiğini düşündürür.",
      ],
      [
        "Çocuklar izleri takip etmeden önce ne yaptı?",
        [
          "Çevreyi incelediler.",
          "Tohumları ektiler.",
          "Görevliye teşekkür ettiler.",
          "Kutuyu boyadılar.",
        ],
        [1],
        "Önce çevreyi incelediler; bunun ardından izleri fark ettiler.",
      ],
      [
        "“İncelemek” burada ne demektir?",
        [
          "Dikkatle bakıp araştırmak",
          "Bir şeyi boyamak",
          "Yüksek sesle konuşmak",
          "Hızla uzaklaşmak",
        ],
        [1],
        "Çevreye dikkatle bakarak ipucu aradıkları için incelemek araştırmaktır.",
      ],
    ],
  ),
  story(
    "prova",
    "Sessiz Provanın Sırrı",
    2,
    [
      "RİTMA, okul kütüphanesinin yanındaki salonda konser hazırlığı yapıyordu.",
      "Mina ritim tutmak için masaya vurunca yan odadaki okurların başlarını kaldırdığını fark etti.",
      "Elya, prova yapmakla başkalarının sessizlik ihtiyacını birlikte düşünmeleri gerektiğini söyledi.",
      "Derin, ritimleri ses çıkarmadan renkli kartlarla göstermeyi önerdi.",
      "Önce mavi kart kaldırılacak, ardından sarı, en son yeşil kart gösterilecekti.",
      "İlk denemede herkes aynı anda kart kaldırdı ve sıra karıştı.",
      "Lidya, her karttan önce birbirlerine bakmalarını önerince grup uyum sağladı.",
      "Kütüphanede okuyanlar çalışmalarına devam ederken RİTMA da provasını tamamladı.",
      "Elya, iyi bir çözümün yalnız kendi işimizi değil, çevremizdeki insanların ihtiyacını da gözettiğini günlüğüne yazdı.",
    ],
    [
      [
        "Metnin ana fikri nedir?",
        [
          "Başkalarının ihtiyaçlarını gözeterek de işimizi tamamlayabiliriz.",
          "Prova yapmak için her zaman masa gerekir.",
          "Kütüphanelerde renkli kart bulunmaz.",
          "Başarılı olmak için hep yüksek ses gerekir.",
        ],
        [8],
        "Günlükteki sonuç cümlesi, bütün olayları başkalarını gözeten bir çözüm fikrinde birleştiriyor.",
      ],
      [
        "Kartların doğru sırası hangisidir?",
        [
          "Mavi, sarı, yeşil",
          "Yeşil, mavi, sarı",
          "Sarı, yeşil, mavi",
          "Mavi, yeşil, sarı",
        ],
        [4],
        "Beşinci cümlede renkler “önce, ardından, en son” sözleriyle sıralanıyor.",
      ],
      [
        "RİTMA neden ses çıkarmayan bir yöntem aradı?",
        [
          "Kütüphanedeki okurları rahatsız etmemek için",
          "Kartları kaybettiği için",
          "Salonda masa olmadığı için",
          "Konserden vazgeçtiği için",
        ],
        [1, 2],
        "Okurların başlarını kaldırması Mina’ya sesi fark ettirdi; Elya da sessizlik ihtiyacını hatırlattı.",
      ],
      [
        "Lidya’nın önerisinden ne çıkarılabilir?",
        [
          "Birbirini izlemek birlikte çalışmayı kolaylaştırabilir.",
          "Kartların rengi önemli değildir.",
          "Herkesin yalnız çalışması gerekir.",
          "Okurların hepsi provaya katılmıştır.",
        ],
        [6],
        "Birbirlerine bakmaya başladıktan sonra uyum sağlamaları bu çıkarımı destekler.",
      ],
      [
        "Hangi olay kartlı yöntem önerildikten sonra, uyum sağlanmadan önce gerçekleşti?",
        [
          "İlk denemede kartların sırası karıştı.",
          "Mina masaya vurdu.",
          "Okurlar başlarını kaldırdı.",
          "Elya günlüğüne sonuç yazdı.",
        ],
        [5],
        "Altıncı cümledeki karışıklık, öneri ile başarılı düzenleme arasındaki olaydır.",
      ],
      [
        "“Gözetmek” bu metinde hangi anlamda kullanılmıştır?",
        [
          "Dikkate alıp korumaya çalışmak",
          "Gizlice birini takip etmek",
          "Bir eşyayı renklendirmek",
          "Bir işi ertelemek",
        ],
        [8],
        "Elya insanların ihtiyaçlarını dikkate almaktan söz ediyor; gizlice izlemekten değil.",
      ],
    ],
  ),
  story(
    "kutuphane",
    "Kitabın İçindeki İz",
    2,
    [
      "Zeyna, konser afişi için okulun eski fotoğraflarını araştırıyordu.",
      "Bir kitapta yarısı görünen bir fotoğraf ve üzerinde “bahar” yazan küçük bir not buldu.",
      "Fotoğraftaki ağaç yapraksızdı; buna bakıp görüntünün kışın çekildiğini düşündü.",
      "Arya, tek bir ayrıntının kesin karar vermek için yetmeyebileceğini hatırlattı.",
      "İkisi fotoğrafın arkasını dikkatle çevirince mart ayına ait bir tarih gördü.",
      "Bahçıvan, bahçedeki bazı ağaçların mart sonunda yapraklandığını anlattı.",
      "Zeyna ilk tahminini değiştirdi ve fotoğrafın erken ilkbaharda çekilmiş olabileceğini yazdı.",
      "Tarihi, notu ve bahçıvanın açıklamasını birlikte değerlendirince daha güçlü bir sonuca ulaştılar.",
      "Afişin altına kesin bilmedikleri ayrıntıları eklemek yerine, yalnızca kanıtı olan bilgileri yazdılar.",
    ],
    [
      [
        "Hikâyenin ana düşüncesi nedir?",
        [
          "Birden fazla kanıtı birlikte değerlendirmek daha güvenilir sonuç verir.",
          "Bütün fotoğraflar kışın çekilir.",
          "Bir tahmin asla değiştirilemez.",
          "Eski kitaplar afiş yapımında kullanılamaz.",
        ],
        [7, 8],
        "Son iki cümle bilgileri birleştirmeyi ve kanıtsız ayrıntılardan kaçınmayı vurgular.",
      ],
      [
        "Fotoğrafın arkasında ne vardı?",
        [
          "Mart ayına ait bir tarih",
          "Bir bilet numarası",
          "Bir şarkı sözü",
          "Okulun telefon numarası",
        ],
        [4],
        "Beşinci cümlede arka yüzdeki bilgi açıkça belirtilir.",
      ],
      [
        "Zeyna ilk başta neden kış mevsimini düşündü?",
        [
          "Ağaç yapraksız göründüğü için",
          "Notta kış yazdığı için",
          "Fotoğrafta kar yağdığı için",
          "Bahçıvan öyle dediği için",
        ],
        [2],
        "İlk tahminin dayanağı üçüncü cümledeki yapraksız ağaçtır.",
      ],
      [
        "Arya için hangisi söylenebilir?",
        [
          "Kesin karar vermeden önce başka bilgi aramayı önemsiyor.",
          "Bütün notların yanlış olduğunu düşünüyor.",
          "Afiş yapılmasını istemiyor.",
          "Fotoğrafın tarihini önceden biliyor.",
        ],
        [3],
        "Tek ayrıntının yetmeyebileceğini söylemesi, daha fazla kanıt aradığını gösterir.",
      ],
      [
        "Zeyna’nın tahminini değiştirmesinden hemen önce hangi bilgi edinildi?",
        [
          "Bazı ağaçların mart sonunda yapraklandığı",
          "Afişin nerede asılacağı",
          "Fotoğrafın kim tarafından çekildiği",
          "Kitabın kaç sayfa olduğu",
        ],
        [5],
        "Bahçıvanın açıklaması altıncı cümlede, tahminin değişmesi yedinci cümlede yer alır.",
      ],
      [
        "“Değerlendirmek” burada hangi anlama gelir?",
        [
          "Bilgileri düşünüp anlamlandırmak",
          "Bir şeyi satın almak",
          "Bir kitabı rafa koymak",
          "Bir fotoğrafı kesmek",
        ],
        [7],
        "Bilgileri birlikte düşünerek sonuca ulaştıkları için sözcük anlamlandırmayı anlatır.",
      ],
    ],
  ),
  story(
    "yagmur",
    "Yağmur İçin İki Plan",
    3,
    [
      "RİTMA okul bahçesindeki konser için iki haftadır hazırlanıyordu.",
      "Hava raporunda yağmur olasılığı görünce Elya hazırlık toplantısında yedek bir plan önerdi.",
      "Bazıları planın gereksiz olduğunu, çünkü o anda gökyüzünün açık göründüğünü söyledi.",
      "Lidya, o anki hava ile akşamki olasılığın aynı şey olmadığını hatırlattı.",
      "Grup, bahçe için hazırlanan hafif süsleri salona kolay taşınacak biçimde kutulara ayırdı.",
      "Salon daha küçük olduğundan Derin geçiş yolunu boş bırakacak bir yerleşim çizdi.",
      "Mina, davetlilere yer değişikliğini duyurmak için iki ayrı afiş hazırladı; yalnızca kullanılacak afiş asılacaktı.",
      "Öğleden sonra yağmur başladı ve ekip hazırladığı sırayla kutuları salona taşıdı.",
      "Geçiş yolunu kapatan büyük bir kutu fark edilince Arya onu ayrılan depoya götürdü.",
      "Davetliler doğru afişi izleyerek salona ulaştı, girişte bir karışıklık yaşanmadı.",
      "Yağmurun başlayıp başlamayacağını yönetememişlerdi, ama olasılığı düşünmek hazırlıklarını yönetmelerini sağlamıştı.",
      "Konser sonunda Elya, yedek planın kötü bir şey beklemek değil, değişiklik olduğunda seçenek sahibi olmak anlamına geldiğini yazdı.",
    ],
    [
      [
        "Paragrafın ana fikrini en iyi hangi cümle anlatır?",
        [
          "Olasılıkları düşünerek hazırlanmak değişikliklere uyum sağlamayı kolaylaştırır.",
          "Yedek plan yapılınca yağmur kesinlikle yağar.",
          "Her konser küçük bir salonda yapılmalıdır.",
          "Bir planı değiştirmek daima başarısızlıktır.",
        ],
        [10, 11],
        "Sonuç bölümünde kontrol edilemeyen olaylar karşısında hazırlıklı olmanın değeri vurgulanır.",
      ],
      [
        "Geçiş yolunun açık kalması için yapılanlardan biri hangisidir?",
        [
          "Yerleşim çizilmesi ve büyük kutunun depoya alınması",
          "İki afişin aynı anda asılması",
          "Süslerin bahçede bırakılması",
          "Salonun kapısının kapatılması",
        ],
        [5, 8],
        "Altıncı ve dokuzuncu cümleler geçiş yolunu koruyan iki somut önlemi verir.",
      ],
      [
        "Mina neden iki ayrı afiş hazırladı?",
        [
          "Yer değişirse davetlilere doğru yeri duyurabilmek için",
          "İki konser aynı anda yapılacağı için",
          "Salonun daha büyük olduğunu kanıtlamak için",
          "Yağmur raporunu değiştirmek için",
        ],
        [6],
        "Afişler iki olası yer için hazırlanıyor ve yalnızca kullanılacak olan asılıyor.",
      ],
      [
        "Grubun çalışma biçiminden hangisi çıkarılabilir?",
        [
          "İşleri paylaşmış ve olası aksaklıklara önceden hazırlanmışlar.",
          "Yağmurun saatini kesin biliyorlarmış.",
          "Bahçede konser vermek istemiyorlarmış.",
          "Davetlilerden yardım istemek yasakmış.",
        ],
        [4, 5, 6],
        "Kutulama, yerleşim ve afiş görevlerinin paylaşılması bu çıkarımı destekler; hava saatine dair kesin bilgi yoktur.",
      ],
      [
        "Hangisi yağmur başladıktan sonra gerçekleşti?",
        [
          "Arya geçişteki kutuyu depoya taşıdı.",
          "Elya ilk yedek plan önerisini yaptı.",
          "Mina iki afiş hazırladı.",
          "Derin ilk yerleşim çizimini yaptı.",
        ],
        [7, 8],
        "Sekizinci cümlede yağmur başlar, dokuzuncuda Arya kutuyu taşır.",
      ],
      [
        "“Olasılık” metinde hangi anlamdadır?",
        [
          "Gerçekleşebilecek ama kesin olmayan durum",
          "Daha önce kesin gerçekleşmiş olay",
          "Herkesin aynı anda söylediği söz",
          "Değiştirilemeyen bir kural",
        ],
        [1, 3],
        "Rapor bir ihtimal bildirir; Lidya da şu anki durumun akşamı kesinleştirmediğini belirtir.",
      ],
    ],
  ),
  story(
    "saat",
    "Saatin Gösterdiği Sır",
    3,
    [
      "Konserden önce Elya, eski prova defterindeki bir notun hangi güne ait olduğunu anlamaya çalışıyordu.",
      "Notta “Gölge bahçe duvarına ulaştığında prova bitti” yazıyordu; tarih kısmı silinmişti.",
      "Mina, uzun gölgenin her zaman akşamı gösterdiğini düşünerek provanın geç bittiğini söyledi.",
      "Zeyna aynı yerde sabah da uzun gölge olabileceğini, bu yüzden başka bir ipucuna ihtiyaç duyduklarını belirtti.",
      "Defterin arasından çıkan davetiyede o günkü provanın öğleden sonra başlayacağı yazılıydı.",
      "Lidya bu bilginin sabah olasılığını zayıflattığını, fakat bitiş saatini tek başına vermediğini açıkladı.",
      "Derin bir sonraki sayfada, provadan sonra okulun saat kulesinin dört kez çaldığına ilişkin bir cümle buldu.",
      "Arya, kule saatinin düzgün çalışıp çalışmadığının da bilinmesi gerektiğini söyledi.",
      "Görevli o gün saatin kontrol edildiğini ve doğru çalıştığını hatırladı.",
      "Grup bütün bilgileri birleştirerek provanın öğleden sonra dörde yakın bitmiş olabileceği sonucuna ulaştı.",
      "Elya deftere “kesin olarak” yerine “eldeki bilgilere göre” yazarak sonucun dayanağını görünür tuttu.",
      "Eksik bir kaydı tamamlamaya çalışırken tek bir belirtiyi kesin kanıt saymamayı da öğrenmişlerdi.",
    ],
    [
      [
        "Metnin ana düşüncesi hangisidir?",
        [
          "Sonuç çıkarırken kanıtları birlikte tartmalı ve kesinlik sınırını belirtmeliyiz.",
          "Uzun gölge yalnızca akşam oluşur.",
          "Her defterin arasından davetiye çıkar.",
          "Saat kuleleri daima bozuk çalışır.",
        ],
        [10, 11],
        "Son iki cümle, kanıtları tartmayı ve sonucun ne kadar kesin olduğunu belirtmeyi öne çıkarır.",
      ],
      [
        "Sabah olasılığını zayıflatan bilgi hangisidir?",
        [
          "Davetiyede provanın öğleden sonra başlayacağının yazması",
          "Gölgenin uzun olması",
          "Defterin eski olması",
          "Tarihin silinmesi",
        ],
        [4, 5],
        "Prova öğleden sonra başlayacaksa sabah bitmiş olması beklenmez; yine de bitiş saati buradan çıkmaz.",
      ],
      [
        "Arya neden saatin düzgün çalışmasını sordu?",
        [
          "Dört vuruşun zaman için güvenilir bir ipucu olup olmadığını anlamak için",
          "Saatin rengini öğrenmek için",
          "Provanın hiç yapılmadığını kanıtlamak için",
          "Davetiyeyi değiştirmek için",
        ],
        [6, 7],
        "Saat vuruşuna dayanan çıkarım, saatin doğru çalışması koşuluna bağlıdır.",
      ],
      [
        "Elya’nın “eldeki bilgilere göre” sözü neyi gösterir?",
        [
          "Yeni bir kanıt gelirse sonucun gözden geçirilebileceğini",
          "Hiçbir bilgiye güvenilemeyeceğini",
          "Saatin kesinlikle bozuk olduğunu",
          "Defterin yeniden yazılacağını",
        ],
        [10],
        "Bu ifade, sonucun mevcut kanıtlara dayandığını ve sınırsız kesinlik taşımadığını gösterir.",
      ],
      [
        "Saatin kontrol edildiği öğrenilmeden önce ne oldu?",
        [
          "Derin dört vuruşla ilgili cümleyi buldu.",
          "Elya sonucu deftere yazdı.",
          "Grup sonuca ulaştı.",
          "Defter tamamlandı.",
        ],
        [6, 8],
        "Derin’in bulgusu yedinci, görevlinin doğrulaması dokuzuncu cümlededir.",
      ],
      [
        "“Dayanak” sözcüğü burada ne demektir?",
        [
          "Bir düşünceyi destekleyen bilgi veya gerekçe",
          "Bir duvarın rengi",
          "Sahnenin yüksekliği",
          "Bir eşyanın fiyatı",
        ],
        [10],
        "Sonucun dayanağı, onu destekleyen kanıt ve gerekçelerdir.",
      ],
    ],
  ),
];
export function chooseStory(
  level: number,
  seen: Record<string, number>,
): Story {
  const pool = stories.filter(
    (s) => s.level === Math.max(1, Math.min(3, level)),
  );
  return [...pool].sort(
    (a, b) =>
      a.questions.reduce((n, q) => n + (seen[q.id] || 0), 0) -
      b.questions.reduce((n, q) => n + (seen[q.id] || 0), 0),
  )[0];
}
export function checkReading(
  task: Activity,
  answer: number,
  evidence: number,
): boolean {
  return answer === task.answer && !!task.evidence?.includes(evidence);
}
