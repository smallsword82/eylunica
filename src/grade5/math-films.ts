import {expr,type MathDiagram as D} from './math-diagrams.ts';
export type MathFilmScene={id:string;anchor:string;diagrams:D[];captions:string[]};
type SceneInput={anchor:string;diagram:D|D[];captions:string[]};
const scene=(anchor:string,diagram:D|D[],...captions:string[]):SceneInput=>({anchor,diagram,captions});
const rule=(...lines:string[]):D=>({kind:'rule',lines});
const frac=(num:number,den:number):D=>({kind:'fraction',num,den,copies:1,task:'fraction'});
const compare=(a:number,b:number,c:number,d:number):D=>({kind:'compare',left:[a,b],right:[c,d]});
const groups=(...g:string[]):D=>({kind:'number',groups:g,selected:0,task:'group'});
const selectedGroups=(selected:number,...g:string[]):D=>({kind:'number',groups:g,selected,task:'group'});
const place=(digits:string,selectedFromRight:number):D=>({kind:'place',digits,selectedFromRight});
const rect=(a:number,b:number,task:'area'|'perimeter'|'missing'|'extend'='area'):D=>({kind:'rectangle',a,b,task,unit:'cm'});
const flow=(input:number,...operations:[('+'|'−'|'×'|'÷'),number][]):D=>({kind:'flow',input,operations:operations.map(([op,value])=>({op,value}))});
const bag=(a:number,b:number,names:[string,string]=['Kırmızı','Mavi'],colors:[string,string]=['#f0a0b5','#8de2ee']):D=>({kind:'bag',a,b,names,colors,task:'likely'});
const sequence=(start:number,change:number,count=4,rule:'add'|'multiply'='add',targetIndex=count+1):D=>({kind:'sequence',start,change,count,rule,targetIndex});
const chart=(values:number[],labels=['Elma','Muz','Armut']):D=>({kind:'chart',values,labels,task:'total'});
const expression=(expression:Parameters<typeof expr>[1]):D=>({kind:'expression',expression});
const circlePair=(equilateral=false,unknownBase=false):D=>({kind:'circlePair',radius:4,equilateral,unknownBase});
const polygon=(sides:number):D=>({kind:'polygon',sides,edge:4,task:'features'});
const geometry=(variant:Extract<D,{kind:'geometry'}>['variant']):D=>({kind:'geometry',variant});
const raw:Record<string,{explain:SceneInput[];example:SceneInput[]}>={
 'topic-4add1fe377559e12':{
  explain:[
   scene('Nokta bir konumu',geometry('elements'),'Nokta yalnız bir konumu gösterir.','Doğru iki yönde sınırsız uzanır.','Doğru parçasının iki ucu vardır.','Işının bir başlangıcı, bir uzanma yönü vardır.'),
   scene('Cetvel, iki nokta',{kind:'segment',task:'distance',a:0,b:6,unit:'cm'},'Örnek: A cetvelin 0 çizgisinde.','B, 6 cm çizgisinde olsun.','İki noktayı düz kenarla birleştir.','AB uzunluğu 6 − 0 = 6 cm.'),
   scene('Pergelde merkez sabit',{kind:'compass',radius:4},'Örnek: pergelin açıklığı 4 cm.','Bir uç merkezde sabit kalır.','Öteki uç aynı açıklıkla döner.','Çemberdeki her nokta merkezden 4 cm uzakta.'),
   scene('Birbirini dik kesen',geometry('parallel'),'Soldaki doğrular paralel.','Ne kadar uzatılsa da kesişmezler.','Sağdaki doğrular dik kesişir.','Dik kesişmede köşe açısı 90° olur.'),
  ],example:[
   scene('',{kind:'segment',task:'distance',a:0,b:6,unit:'cm'},'Cetvelin 0 çizgisini bul.','A noktasını 0’a yerleştir.','Ölçüm A’dan başlayacak.','A başlangıç noktasıdır.'),
   scene('',{kind:'segment',task:'distance',a:0,b:6,unit:'cm'},'Cetvelin aynı kenarını izle.','6 cm işaretini bul.','Bu hizaya B noktasını koy.','A ve B aynı doğru üzerinde.'),
   scene('',{kind:'segment',task:'distance',a:0,b:6,unit:'cm'},'A ve B’yi düz çizgiyle birleştir.','İki uç arasını ölç.','6 − 0 = 6 cm.','AB doğru parçası 6 cm.'),
  ]},
 'topic-a0155915387c7658':{
  explain:[
   scene('Açının ortak başlangıç',geometry('angleTypes'),'Örnek: 45° dar açı.','90° dik açı.','120° geniş açı.','Açı, iki ışın arasındaki açıklıktır.'),
   scene('Doğru açı 180°',geometry('fullTurn'),'Bir çeyrek dönüş: 90°.','Yarım dönüş: 180°.','Üç çeyrek dönüş: 270°.','Tam dönüş: 360°.'),
   scene('İletkinin merkezini',rule('1. Köşeyi merkeze yerleştir','2. Bir ışını 0° çizgisine hizala','3. O 0’dan başlayan ölçeği izle','4. İkinci ışının çizgisini oku'),'Merkez ile köşe aynı noktada olmalı.','Başlangıç ışını 0° ile hizalanır.','Öteki taraftaki 0’ı karıştırma.','Derece, iki ışının açıklığını ölçer.'),
   scene('Kesişen iki doğrunun',geometry('crossing'),'Örnek: kesişen iki doğru.','Karşılıklı iki açı 65° ve 65°.','Komşu açı: 180 − 65 = 115°.','65° + 115° = 180° ile kontrol et.'),
  ],example:[0,1,2].map(step=>scene('',geometry('crossing'),...[
   ['Bir doğru, yarım dönüş oluşturur.','Doğru açı 180° olur.','Üstteki iki parça bu 180°’yi paylaşır.','Toplam değişmez: 180°.'],
   ['Bir parça 65°.','Diğer parçaya ? diyelim.','65° + ? = 180°.','İki parçayı birlikte düşün.'],
   ['Toplam 180°’den 65°’yi çıkar.','180 − 65 = 115°.','Bilinmeyen açı 115°.','Kontrol: 65 + 115 = 180.'],
  ][step]))},
 'topic-c89c9fdbb63ce0ad':{
  explain:[
   scene('En az üç doğru',[polygon(3),polygon(4),polygon(5),polygon(5)],'Üçgen: 3 düz kenar, 3 köşe.','Dörtgen: 4 düz kenar, 4 köşe.','Beşgen: 5 düz kenar, 5 köşe.','Kenarlar uç uca birleşir; sınır kapalıdır.'),
   scene('Çemberin düz kenarı',geometry('polygonCompare'),'Çember eğridir; düz kenarı yoktur.','Açık kırık çizgi kapalı değildir.','Çokgenin sınırı kapalı ve düz kenarlıdır.','Bu üç şekil aynı tür değildir.'),
   scene('Bir çemberin merkeziyle',{kind:'circle',radius:4,target:'diameter'},'Örnek: OB yarıçapı 4 cm.','A–O–B doğrusu merkezden geçiyor.','Çap iki yarıçaptan oluşur.','AB = 4 + 4 = 8 cm.'),
   scene('İki çemberin merkezleri',[circlePair(),circlePair(),circlePair(),circlePair(true)],'A ve B merkezli çemberler aynı yarıçapta.','C, iki çemberin ortak noktası.','AC ve BC eşit yarıçaplardır: ikizkenar.','AB de yarıçapa eşitse üç kenar eşit: eşkenar.'),
  ],example:[
   scene('',circlePair(false,true),'A merkezli çemberi izle.','C bu çember üzerinde.','Merkez A’dan C’ye uzaklık bir yarıçap.','AC = 4 cm.'),
   scene('',circlePair(false,true),'Şimdi B merkezli çemberi izle.','C bu çember üzerinde de bulunuyor.','BC de bir yarıçap.','BC = 4 cm.'),
   scene('',circlePair(false,true),'AC = 4 cm ve BC = 4 cm.','İki kenar eşit: ikizkenar üçgen.','AB uzunluğu verilmedi.','Üç kenarın da eşit olduğunu söyleyemeyiz.'),
  ]},
 'topic-a219ce03fcdfdad6':{
  explain:[
   scene('Sağdan başlayarak',[selectedGroups(3,'3','012','304','005'),selectedGroups(3,'3','012','304','005'),selectedGroups(1,'3','012','304','005'),selectedGroups(0,'3','012','304','005')],'Örnek sayıyı sağdan üçerli ayır.','Birler bölüğü en sağda.','Sonra binler ve milyonlar gelir.','Dördüncü bölük milyarlardır.'),
   scene('12 304 005',[selectedGroups(0,'12','304','005'),selectedGroups(1,'12','304','005'),selectedGroups(2,'12','304','005'),selectedGroups(0,'12','304','005')],'Milyonlar: 12.','Binler: 304.','Birler: 005, yani 5.','On iki milyon üç yüz dört bin beş.'),
   scene('Yazıyla verilen',[selectedGroups(0,'8','023','040'),selectedGroups(1,'8','023','040'),selectedGroups(2,'8','023','040'),selectedGroups(0,'8','023','040')],'Sekiz milyon → 8.','Yirmi üç bin → 023.','Kırk → 040.','8 | 023 | 040 → 8 023 040.'),
   scene('Basamak sayısı',rule('0012 ve 12 aynı doğal sayıdır','İçteki sıfırlar yeri korur: 1 002','Sondaki sıfır değeri değiştirir: 120','12 ile 120 aynı sayı değildir'),'Baştaki sıfırlar yeni basamak oluşturmaz.','İçteki sıfır, boş basamağı korur.','Sondaki sıfır sayının değerini değiştirir.','Sıfırları gelişigüzel silme.'),
  ],example:[
   scene('',groups('306','042','007'),'Üç yüz altı milyon deniyor.','Milyonlar bölüğü 306.','Soldaki bölüğe 306 yaz.','Henüz binler ve birleri atlama.'),
   scene('',{...groups('306','042','007'),selected:1} as D,'Kırk iki bin deniyor.','Binler bölüğü 42.','Aradaki bölük üç haneli olmalı.','42 yerine 042 yaz.'),
   scene('',{...groups('306','042','007'),selected:2} as D,'Birler bölüğünde yedi var.','Üç haneli bölük: 007.','Bölükleri sırasıyla birleştir.','306 042 007.'),
  ]},
 'topic-625a6bc82cb2ce2e':{
  explain:[
   scene('4 rakamının sayı',[place('4',0),place('40',1),place('4000',3),place('4000',3)],'Rakamın kendisi her yerde 4.','40 içinde 4 onlar basamağında: 40.','4 000 içinde 4 binler basamağında.','Rakam aynı, basamak değeri farklı.'),
   scene('Sağa doğru',rule('Birler: 1','Onlar: 10','Yüzler: 100','Sola her basamakta ×10'),'Birler birimi 1.','Bir basamak solda birim 10 olur.','Bir basamak daha solda birim 100.','Sağa giderken birim onda bire iner.'),
   scene('305 042',rule('305 042','300 000 + 5 000','+ 40 + 2','Sıfır basamakların katkısı 0'),'Yüz binlerdeki 3: 300 000.','Binlerdeki 5: 5 000.','Onlardaki 4: 40; birlerdeki 2: 2.','300 000 + 5 000 + 40 + 2.'),
   scene('Çözümleme toplamını',[selectedGroups(0,'7','020','006'),selectedGroups(1,'7','020','006'),selectedGroups(2,'7','020','006'),selectedGroups(0,'7','020','006')],'7 milyon → 7 000 000.','20 bin → 020 bölüğü.','6 → 006 bölüğü.','7 020 006; boş basamakları koru.'),
  ],example:[
   scene('',groups('8','306','205'),'Sayımız 8 306 205.','Sağdan üçerli ayır.','8 | 306 | 205.','İki rakamın yerini ayrı ayrı incele.'),
   scene('',place('8306205',5),'3 rakamını bul.','Sağdan altıncı: yüz binler.','Basamak birimi 100 000.','3 × 100 000 = 300 000.'),
   scene('',place('8306205',2),'2 rakamını bul.','Sağdan üçüncü: yüzler.','Basamak birimi 100.','2 × 100 = 200.'),
  ]},
 'topic-05bf7580a6ccbb59':{
  explain:[
   scene('Bir soruda',{kind:'subtract',whole:12,part:5,unit:'kalem'},'Örnek: büyük miktar 12, fark 5.','Küçük miktarı arıyoruz.','“Fazla” sözüne bakıp hemen toplama.','12 − 5 = 7 kalem.'),
   scene('Çözüm planını',flow(8,['×',24],['−',57]),'Örnek plan: 8 kutu, her kutuda 24 kalem.','Önce 8 × 24 = 192 kalem.','Sonra 57 kalemi çıkar.','Ara sonuçların birimini yaz.'),
   scene('Toplamayı çıkarma',{kind:'division',total:28,divisor:6},'Bölmede tam grupları bul.','Artanı kalan olarak ayır.','Bölen × bölüm + kalan ile denetle.','Kalan, bölenden küçük olmalı.'),
   scene('Kalanın yorumu',{kind:'bus',people:73,capacity:20},'73 kişi, araç başına en çok 20 kişi.','Üç araç yalnız 60 kişiyi taşır.','Kalan 13 kişiye bir araç daha gerekir.','Toplam 4 araç; 3 araç yetmez.'),
  ],example:[
   scene('',{kind:'groups',groups:8,each:24,task:'multiply',unit:'kalem'},'8 kutu var.','Her kutuda 24 kalem.','8 × 24 işlemini yap.','Başlangıçta 192 kalem.'),
   scene('',{kind:'subtract',whole:192,part:57,unit:'kalem'},'Başlangıç 192 kalem.','57 kalem dağıtılıyor.','192 − 57 = 135.','135 kalem kalır.'),
   scene('',expression(expr('+',135,57)),'Sonucu başlangıçla denetle.','Kalan + dağıtılan = başlangıç.','135 + 57 = 192.','İşlemler ve birimler tutarlı.'),
  ]},
 'topic-9087112a70441c7a':{
  explain:[
   scene('Dikdörtgende karşılıklı',rect(9,6,'perimeter'),'Örnek kenarlar: 9 cm ve 6 cm.','Karşılıklı kenarlar eşit.','Sınırı izle: 9 + 6 + 9 + 6.','Çevre 30 cm; alanla karıştırma.'),
   scene('Çevre ve bir',rule('Örnek çevre: 30 cm','Komşu iki kenar: 30 ÷ 2 = 15','Bir kenar 9 cm','Öteki kenar: 15 − 9 = 6 cm'),'Çevre iki aynı kenar toplamını içerir.','Önce 2’ye böl.','Komşu iki kenar toplamından 9’u çıkar.','Diğer kenar 6 cm.'),
   scene('Birim kareleri',rect(9,6),'9 sütun ve 6 satır.','Birim kareleri gruplayarak say.','9 × 6 = 54 birimkare.','Kenar cm ise alan cm² olur.'),
   scene('Alanı 24',[rect(1,24),rect(2,12),rect(3,8),rect(4,6)],'1 × 24: alan 24, çevre 50.','2 × 12: alan 24, çevre 28.','3 × 8: alan 24, çevre 22.','4 × 6: alan 24, çevre 20.'),
  ],example:[
   scene('',rule('Çevre: 30 cm','2 × (a + b) = 30','a + b = 30 ÷ 2','a + b = 15 cm'),'Çevrenin yarısını al.','30 ÷ 2 = 15.','İki komşu kenarın toplamı 15 cm.','Bir kenar 9 cm olarak verildi.'),
   scene('',rect(9,6),'Komşu kenarların toplamı 15 cm.','Bilinen kenar 9 cm.','15 − 9 = 6.','Diğer kenar 6 cm.'),
   scene('',rect(9,6),'Alan için iki kenarı çarp.','9 × 6 = 54 cm².','Çevre kontrolü: 2 × (9 + 6).','Çevre 30 cm; alan 54 cm².'),
  ]},
 'topic-6a97ba45a911803c':{
  explain:[
   scene('Payda bütünün',frac(3,4),'Örnek bütün 4 eş parça.','3 parça boyalı: pay 3.','Bütün 4 eş parça: payda 4.','Eş olmayan parçalarda yalnız saymak yetmez.'),
   scene('3/4',{...frac(3,4),representation:'numberLine'} as D,'0 ile 1 arası bir bütün.','Dört eş aralığa böl.','Üç eş parçayı seç.','3/4 aynı miktarı anlatır.'),
   scene('Pay ve paydayı',[frac(1,2),frac(2,4),frac(50,100),frac(50,100)],'1/2: bütünün yarısı.','Payı ve paydayı 2 ile çarp: 2/4.','50/100 de aynı miktar.','Parça sayısı değişti, miktar değişmedi.'),
   scene('Paydası 10',[frac(7,10),frac(7,10),{...frac(25,100),representation:'hundred'} as D,{...frac(25,100),representation:'hundred'} as D],'7/10 → 0,7.','Ondalık ve kesir aynı miktarı gösterir.','25/100 → 0,25.','25/100 aynı zamanda %25.'),
  ],example:[
   scene('',frac(6,8),'Çikolata 8 eş parça.','6 parça yenmiş.','Yenilen miktar 6/8.','Bütün değişmeden payı ve paydayı incele.'),
   scene('',[frac(6,8),frac(6,8),frac(3,4),frac(3,4)],'6/8 ile başla.','Payı ve paydayı 2’ye böl.','6 ÷ 2 = 3; 8 ÷ 2 = 4.','6/8 = 3/4.'),
   scene('',[frac(3,4),frac(3,4),frac(75,100),frac(75,100)],'3/4’ü yüz eş parçayla göster.','Payı ve paydayı 25 ile çarp.','3/4 = 75/100.','Yenilen miktar %75.'),
  ]},
 'topic-3f4d4b2a3773ed11':{
  explain:[
   scene('Paydalar eşitse',compare(5,8,3,8),'Bütünler aynı büyüklükte.','İki bütün de 8 eş parça.','5 boyalı parça, 3 parçadan fazla.','5/8 > 3/8.'),
   scene('Paylar eşitse',compare(2,3,2,7),'İki bütünde de 2 parça boyalı.','Üçe bölünen bütünün parçaları daha büyük.','Yediye bölünendeki parçalara bak.','2/3 > 2/7.'),
   scene('Paydaları farklı',[compare(2,3,3,4),compare(2,3,3,4),compare(8,12,9,12),compare(8,12,9,12)],'2/3 ile 3/4’ü karşılaştır.','Ortak payda 12.','2/3 = 8/12; 3/4 = 9/12.','8/12 < 9/12, yani 2/3 < 3/4.'),
   scene('0, 1/2',[compare(3,8,5,8),compare(3,8,5,8),compare(3,8,5,8),{...compare(1,2,1,2),differentWholes:true} as D],'3/8 yarımdan küçüktür.','5/8 yarımdan büyüktür.','Aynı bütünlerde 3/8 < 5/8.','Bütünler farklıysa eşit kesir, eşit gerçek miktar demek değildir.'),
  ],example:[
   scene('',[compare(3,5,7,10),compare(3,5,7,10),compare(6,10,7,10),compare(6,10,7,10)],'3/5 ile 7/10 verildi.','İlk kesrin pay ve paydasını 2 ile çarp.','3/5 = 6/10.','Boyalı miktar değişmedi.'),
   scene('',compare(6,10,7,10),'Bütünler aynı büyüklükte.','İkisi de 10 eş parça.','Parça büyüklükleri eşit.','Yalnız boyalı parça sayılarını karşılaştır.'),
   scene('',compare(6,10,7,10),'6 parça ile 7 parçayı karşılaştır.','6 < 7.','6/10 < 7/10.','Bu nedenle 3/5 < 7/10.'),
  ]},
 'topic-ff34a0063ebe46c6':{
  explain:[
   scene('“Sınıfımızda',chart([9,6,5]),'Örnek soru: sınıf hangi meyveyi seçiyor?','Katılımcı grubu bu sınıf.','Herkes yalnız bir tercih yapıyor.','Kategori: elma, muz veya armut.'),
   scene('Tarafsız sorular',rule('Bir öğrenci → bir tercih','Aynı öğrenciyi iki kez sayma','Tercih: kategorik veri','Boy uzunluğu: sayısal veri'),'Soruyu yönlendirmeden sor.','Bir kişiyi yalnız bir kez say.','Tercihler kategori olarak gruplanır.','Santimetreyle boy ölçmek farklı veri türüdür.'),
   scene('Her kategorideki',chart([9,6,5]),'Elma 9, muz 6, armut 5.','Sıklık, o kategorideki kişi sayısı.','Aynı sayılar sütun yüksekliğiyle gösterilir.','Eksen 0’dan başlar; birim kişi.'),
   scene('Tabloyu yorumlarken',chart([9,6,5]),'En sık tercih elma: 9 kişi.','En az tercih armut: 5 kişi.','Toplam 20 kişi.','Bu sonuç yalnız bu örnek sınıfı anlatır.'),
  ],example:[
   scene('',chart([9,6,5]),'Her öğrenci bir tercih yaptı.','Kategoriler: 9, 6 ve 5 kişi.','9 + 6 + 5 = 20.','Sınıfta 20 öğrenci var.'),
   scene('',chart([9,6,5]),'Sıklıkları karşılaştır.','9, 6 ve 5’ten büyük.','En yüksek sütun elma.','En sık tercih elma.'),
   scene('',chart([9,6,5]),'Araştırmaya katılan grup bu sınıf.','20 kişinin tercihi biliniyor.','Bütün okul hakkında veri yok.','Sonucu bu sınıfla sınırla.'),
  ]},
 'topic-d170313ab769758e':{
  explain:[
   scene('Başlık araştırmanın',chart([9,6,5],['Roman','Şiir','Öykü']),'Başlık: örnek sınıfın kitap tercihleri.','Yatay eksende kategori adları var.','Dikey ölçek kişi sayısını gösterir.','0 başlangıcı ve sayıları birlikte incele.'),
   scene('Veri kaynağı',chart([9,6,5],['Roman','Şiir','Öykü']),'Örnek anket yalnız bir sınıfta yapıldı.','Katılan kişi sayısı 20.','9 kişi roman seçti.','En çok tercih, herkesin tercihi demek değil.'),
   scene('Önce iddiayı',{kind:'chart',values:[9,6,5],labels:['Roman','Şiir','Öykü'],task:'allClaim'},'İddia: herkes romanı seçti.','Herkes demek 20 kişi demek.','Romanı seçen 9 kişi var.','9 ≠ 20; iddia desteklenmiyor.'),
   scene('İki ayrı ankette',rule('Örnek A: 20 kişiden 9’u roman','Örnek B: 40 kişiden 12’si roman','Katılımcı grupları ve sayıları farklı','Yalnız 12 > 9 demek yeterli değil'),'İki farklı anket düşün.','Birinde 20, diğerinde 40 kişi var.','Ham sayıların büyüklüğü tek başına yetmez.','Grupları ve toplamları da karşılaştır.'),
  ],example:[
   scene('',chart([9,6,5],['Roman','Şiir','Öykü']),'Ankette toplam 20 kişi var.','Herkes sözü tamamını ifade eder.','İddia 20 roman tercihi gerektirir.','Grafikteki roman sıklığını bul.'),
   scene('',{kind:'chart',values:[9,6,5],labels:['Roman','Şiir','Öykü'],task:'allClaim'},'Roman tercihi 9.','Toplam kişi sayısı 20.','9, 20’ye eşit değil.','Herkes roman seçmemiş.'),
   scene('',chart([9,6,5],['Roman','Şiir','Öykü']),'9 en büyük sıklık.','Roman en çok tercih edilen kategori.','Bu, diğer kategorilerin olmadığı anlamına gelmez.','Doğru cümle: bu ankette en çok roman seçildi.'),
  ]},
 'topic-5562bbd36f1b1115':{
  explain:[
   scene('8 + 4',rule('8 + 4 = 7 + 5','Sol taraf: 12','Sağ taraf: 12','Aynı miktar → eşitlik'),'Sol tarafı hesapla: 8 + 4.','Sağ tarafı hesapla: 7 + 5.','İkisinin değeri 12.','Eşittir, iki tarafın aynı miktarını anlatır.'),
   scene('Boş kutu',{kind:'balance',n:7,m:12,task:'unknownAdd'},'Örnek: 7 + ? = 19.','Boş kutu bilinmeyen sayıyı temsil eder.','İki taraf aynı miktarda olmalı.','19 − 7 = 12; yerine koyup kontrol et.'),
   scene('Bir eşitliğin',{kind:'balance',n:9,m:3,task:'bothAdd'},'Örnek başlangıç: 12 = 12.','İki tarafa da 3 ekle.','15 = 15; denge korunur.','Aynı işlem iki tarafta da uygulanmalı.'),
   scene('Yalnız bir tarafa',rule('Başlangıç: 12 = 12','Yalnız sola 3 ekle: 15 ve 12','15 ≠ 12','Bilinmeyeni yerine koyarak kontrol et'),'Başlangıç dengede.','Yalnız bir tarafı değiştir.','Değerler farklı oldu.','Eşitliği başlangıç denkleminde denetle.'),
  ],example:[
   scene('',rule('□ + 7 = 19','İki taraftan da 7 çıkar','□ + 7 − 7 = 19 − 7','İki tarafa aynı işlem'),'Denklem: □ + 7 = 19.','Eklenen 7’yi kaldırmak istiyoruz.','Her iki taraftan 7 çıkar.','Dengeyi koruyoruz.'),
   scene('',rule('□ + 7 − 7 = 19 − 7','Sol taraf: □','Sağ taraf: 12','□ = 12'),'Solda +7 ve −7 birbirini götürür.','Sağda 19 − 7 hesaplanır.','Sağ taraf 12.','Bilinmeyen 12.'),
   scene('',expression(expr('+',12,7)),'12’yi kutunun yerine koy.','12 + 7’yi hesapla.','19 elde edilir.','Başlangıçtaki sağ tarafla eşit: doğru.'),
  ]},
 'topic-61b7fdd3038e685f':{
  explain:[
   scene('Toplamada',rule('7 + 12','12 + 7','İki toplam da 19','Yer değişti, sonuç değişmedi'),'İlk sıra: 7 + 12.','Toplananların yerini değiştir.','12 + 7 de 19.','Çarpanların yer değişimi de çarpımı korur.'),
   scene('Birleşme özelliği',rule('(2 + 8) + 5','10 + 5 = 15','2 + (8 + 5)','2 + 13 = 15'),'Sayıların sırası 2, 8, 5.','Önce 2 ile 8’i grupla.','Sonra 8 ile 5’i grupla.','Yalnız parantez değişir; toplam 15 kalır.'),
   scene('Çarpma toplama',{kind:'property',n:6,m:10,extra:3,task:'distribute'},'6 × (10 + 3) örneğinde her iki parçayı çarp.','6 × 10 = 60.','6 × 3 = 18.','Toplam 60 + 18 = 78.'),
   scene('Çıkarmada',rule('12 nesneden 5 çıkar → 7','5 nesneden 12 çıkarmak','Doğal sayılarda tamamlanamaz','Çıkarmada yer değiştirme geçerli değil'),'12 − 5 işlemini düşün.','5 − 12 aynı işlem değildir.','Çıkarmada değişme özelliği yoktur.','Dağılırken parantezdeki her terimi çarp.'),
  ],example:[
   scene('',expression(expr('×',25,expr('×',4,4))),'16’yı 4 × 4 olarak ayır.','25 × 16 = 25 × (4 × 4).','Çarpanlar değişmedi.','Şimdi gruplamayı değiştirebiliriz.'),
   scene('',expression(expr('×',expr('×',25,4),4)),'Birleşme özelliğini kullan.','(25 × 4) × 4 yaz.','25 × 4 = 100.','İşlem 100 × 4 oldu.'),
   scene('',expression(expr('×',100,4)),'100 × 4 işlemini yap.','Sonuç 400.','İlk çarpanlar 25 ve 16 idi.','25 × 16 = 400.'),
  ]},
 'topic-c608a0ed9abefba6':{
  explain:[
   scene('Önce parantez',rule('1. Parantez içi','2. Çarpma ve bölme: soldan sağa','3. Toplama ve çıkarma: soldan sağa','Her adımda tek işlemi tamamla'),'Önce parantez.','Sonra çarpma ve bölme.','Sonra toplama ve çıkarma.','Aynı öncelikte soldan sağa git.'),
   scene('Çarpma ve bölme',expression(expr('×',expr('÷',24,3),2)),'Örnek: 24 ÷ 3 × 2.','Bölme ve çarpma aynı öncelikte.','Soldan başla: 24 ÷ 3 = 8.','Sonra 8 × 2 = 16.'),
   scene('“3 kutuda',[{kind:'boxContext',groups:3,inside:8,extra:5,extraInside:false},{kind:'boxContext',groups:3,inside:8,extra:5,extraInside:false},{kind:'boxContext',groups:3,inside:8,extra:5,extraInside:true},{kind:'boxContext',groups:3,inside:8,extra:5,extraInside:true}],'İlk durumda 5 nesne kutuların dışında.','3 × 8 + 5 = 29.','İkinci durumda her kutuda 8 + 5 var.','3 × (8 + 5) = 39; parantez anlamı değiştirir.'),
   scene('Her ara adımda',expression(expr('−',30,expr('×',4,expr('+',2,3)))),'Uzun ifadeyi küçük işlemlere ayır.','Parantezde 2 + 3 = 5.','Sonra 4 × 5 = 20.','En son 30 − 20 = 10.'),
  ],example:[
   scene('',expression(expr('−',30,expr('×',4,expr('+',2,3)))),'İfade: 30 − 4 × (2 + 3).','Önce parantezdeki toplama.','2 + 3 = 5.','İfade 30 − 4 × 5 olur.'),
   scene('',expression(expr('−',30,expr('×',4,5))),'Şimdi çarpma öncelikli.','4 × 5 = 20.','Çıkarma henüz yapılmaz.','İfade 30 − 20 olur.'),
   scene('',expression(expr('−',30,20)),'En son çıkarma.','30 − 20 = 10.','İşlem sırası korundu.','Sonuç 10.'),
  ]},
 'topic-70f412a50ce80c2f':{
  explain:[
   scene('4, 7, 10',[sequence(4,3),sequence(4,3),sequence(30,-5),{kind:'shapePattern'}],'4, 7, 10, 13: her adımda +3.','Sonraki terim 16.','30, 25, 20: her adımda −5.','Şekillerde bir tekrar bloğu da olabilir.'),
   scene('Ardışık farklar',sequence(2,2,4,'multiply'),'2, 4, 8, 16 örneğine bak.','Farklar 2, 4 ve 8; sabit değil.','Her terim 2 ile çarpılıyor.','Sonraki terim 32.'),
   scene('İlk terimi 5',sequence(5,4,3,'add',4),'İlk terim 5.','4. terime kadar 3 artış gerekir.','5 + 4 × (4 − 1).','4. terim 17.'),
   scene('Sonlu sayıda',rule('Yalnız 2, 4 verilirse…','+2 kuralıyla devam: 6','×2 kuralıyla devam: 8','Verilen kuralı kullanmalıyız'),'İlk iki terim tek başına yeterli olmayabilir.','Bir kural 2 eklemek olabilir.','Başka kural 2 ile çarpmak olabilir.','Bu çalışmada açıkça verilen kuralı izle.'),
  ],example:[
   scene('',sequence(6,5,7,'add',8),'İlk terim 6.','8. terime gidiyoruz.','İlk terimde artış yapılmaz.','Bu yüzden 7 artış gerekir.'),
   scene('',sequence(6,5,7,'add',8),'Her artış 5.','7 artış yapılacak.','7 × 5 = 35.','Toplam artış 35.'),
   scene('',sequence(6,5,7,'add',8),'Başlangıç 6 idi.','Toplam artışı ekle.','6 + 35 = 41.','8. terim 41.'),
  ]},
 'topic-735059132b26c64d':{
  explain:[
   scene('“Bir sayı al',flow(2,['+',4],['×',3]),'Girdi 2.','Önce 4 ekle: 6.','Sonra 3 ile çarp: 18.','İşlem sırası algoritmanın parçasıdır.'),
   scene('Adımlar herkesin',rule('“Biraz artır” açık değil','“5 ekle” ölçülebilir','Örnek: 2 + 5 = 7','Aynı girdi aynı yönergeyle aynı sonucu verir'),'Yönerge herkes için aynı anlamı taşımalı.','Biraz artır sözü belirsiz.','5 ekle sözü açık.','Girdi ve yapılacak işlem belli olsun.'),
   scene('Algoritmayı küçük',flow(3,['+',4],['×',3]),'Örnek deneme girdisi 3.','3 + 4 = 7.','7 × 3 = 21.','Ara sonuçları yazarak hatayı bulabilirsin.'),
   scene('Bölme içeren',rule('Bölen 0 mı? → işlem durur','Sıfıra bölme tanımsızdır','Tekrarda kaç adım yapılacağı belli olsun','Başla → uygula → denetle → bitir'),'Bölmeden önce böleni kontrol et.','Sıfıra bölme yapılamaz.','Tekrar varsa durma koşulu belli olmalı.','Algoritma sonlu ve açık adımlardan oluşur.'),
  ],example:[
   scene('',flow(5,['×',2],['+',6],['÷',4]),'Girdi 5.','İlk işlem 2 ile çarpmak.','5 × 2 = 10.','10 bir sonraki adımın girdisi.'),
   scene('',flow(10,['+',6],['÷',4]),'Önceki sonuç 10.','6 ekle.','10 + 6 = 16.','Sonraki adımda 16 kullanılacak.'),
   scene('',flow(16,['÷',4]),'Önceki sonuç 16.','4’e böl.','16 ÷ 4 = 4.','Algoritmanın çıktısı 4.'),
  ]},
 'topic-a606b079db4e39a1':{
  explain:[
   scene('“Sayı 10’dan',{kind:'conditional',input:10,test:'greaterTen'},'Girdi 10.','10, 10’dan büyük değildir.','Hayır yolunu seç: 3 ekle.','10 + 3 = 13; iki yol birden uygulanmaz.'),
   scene('Bir sayı ikiye',[{kind:'conditional',input:8,test:'even'},{kind:'conditional',input:8,test:'even'},{kind:'conditional',input:13,test:'even'},{kind:'conditional',input:13,test:'even'}],'8 çift: 2’ye bölündüğünde kalan 0.','Çift yolu seçilir.','13 tek: kalan 1.','Koşul, uygulanacak yolu belirler.'),
   scene('Tekrarlanan adımı',sequence(3,2,3,'add',4),'Örnek başlangıç 3.','Üç kez 2 ekle: 5, 7, 9.','3 işlem yapıldı.','Başlangıç dahil 4 değer yazıldı.'),
   scene('Algoritma yanlış',rule('Beklenen: 3 + 4 = 7; ×3 → 21','Yanlış sıra: 3 × 3 = 9; +4 → 13','İlk ayrılma: 7 yerine 9','Bir örneğin doğru çıkması her girdi için yetmez'),'Deneme girdisi 3 olsun.','Adımları beklenen sırayla izle.','Yanlış sırada ilk ara sonuç değişir.','Hatanın başladığı adımı bul.'),
  ],example:[
   scene('',{kind:'conditional',input:13,test:'even'},'13 çift mi? Hayır.','Tek sayıda 1 ekleme yolu uygulanır.','13 + 1 = 14.','13 için çıktı 14.'),
   scene('',{kind:'conditional',input:8,test:'even'},'8 çift mi? Evet.','Çift sayıda yarısını alma yolu uygulanır.','8 ÷ 2 = 4.','8 için çıktı 4.'),
   scene('',[{kind:'conditional',input:13,test:'even'},{kind:'conditional',input:13,test:'even'},{kind:'conditional',input:8,test:'even'},{kind:'conditional',input:8,test:'even'}],'Her girdide koşulu yeniden denetle.','13’te yalnız +1 yolu seçildi.','8’de yalnız ÷2 yolu seçildi.','İki işlem yolu birlikte uygulanmaz.'),
  ]},
 'topic-cebe00fd601642dc':{
  explain:[
   scene('Bir torbada yalnız',{...bag(4,0),task:'missingColor'} as D,'Örnek torbada yalnız 4 kırmızı top.','Kırmızı çekmek kesin.','Mavi top yok.','Mavi çekmek imkânsız; olasılığı 0.'),
   scene('Bir olayın',{kind:'coin'},'Adil parada iki yüz var.','Yazı ve tura eşit olası.','Yine de bir atışın sonucu bilinmez.','Daha olası veya eşit olası, kesin demek değil.'),
   scene('Hava tahmini',{kind:'weather'},'Tahmin yaparken bilgi kullanırız.','Bulut, mevsim ve gözlemler birer kanıt olabilir.','Yeni bilgi beklentiyi değiştirebilir.','Gerekçeli tahmin, kesin sonuç değildir.'),
   scene('Aynı olay',{kind:'coin',history:true},'Önceki atışlarda yazı gelmiş olsun.','Bu, sonraki atışın turasını kesin yapmaz.','Adil parada tek deneme yine belirsiz.','Tahminini hangi bilgiye dayandırdığını belirt.'),
  ],example:[
   scene('',bag(6,2,['Mavi','Sarı'],['#8de2ee','#ffda8d']),'Torbada 6 mavi, 2 sarı top.','Toplar aynı büyüklük ve biçimde.','Her topun seçilme şansı eşit kabul edilir.','Renk sayılarını karşılaştırabiliriz.'),
   scene('',bag(6,2,['Mavi','Sarı'],['#8de2ee','#ffda8d']),'Mavi 6, sarı 2.','6, 2’den büyük.','Mavi çekmek daha olası.','Sarı gelmesi yine de mümkündür.'),
   scene('',{...bag(6,2,['Mavi','Sarı'],['#8de2ee','#ffda8d']),task:'missingColor'} as D,'Torbada yeşil top yok.','Yeşil çekmek imkânsız.','Mavi daha olasıdır.','Ama mavi kesin değildir.'),
  ]},
 'topic-fa7dd03066ee7a50':{
  explain:[
   scene('Aynı büyüklükte',bag(4,2),'Örnek: 4 kırmızı, 2 mavi.','Her top aynı özellikte.','Kırmızı sayısı daha fazla.','Koşullar aynıysa kırmızı daha olası.'),
   scene('Çarkta eş',[{kind:'spinner',equal:true},{kind:'spinner',equal:true},{kind:'spinner',equal:false},{kind:'spinner',equal:false}],'Önce çarkın 6 eş bölgesine bak.','4 sarı ve 2 mavi eş bölge var.','Şimdi bölgelerin büyüklükleri farklı.','Eş olmayan bölgeleri yalnız sayarak karşılaştıramazsın.'),
   scene('4 kırmızı',[bag(4,2),bag(4,4),bag(4,4),bag(6,2)],'Başlangıç: 4 kırmızı, 2 mavi.','2 mavi eklersek 4 ve 4 olur.','İki renk eşit olası hale gelir.','Farklı durum: kırmızı eklemek mavi şansını sıfırlamaz.'),
   scene('Tahminin gerçekleşmemesi',bag(4,2),'Kırmızı daha olası.','Daha az olası mavi de gelebilir.','Tek sonuç önceki karşılaştırmayı geçersiz kılmaz.','Daha olası olmak, kesinlik değildir.'),
  ],example:[
   scene('',bag(5,2,['Siyah','Beyaz'],['#66566e','#f5effa']),'Başlangıçta 5 siyah top var.','Yalnız beyaz top eklenecek.','Siyah sayısı değişmez.','Hedef beyaz sayısı da 5 olsun.'),
   scene('',[bag(5,2,['Siyah','Beyaz'],['#66566e','#f5effa']),bag(5,3,['Siyah','Beyaz'],['#66566e','#f5effa']),bag(5,4,['Siyah','Beyaz'],['#66566e','#f5effa']),bag(5,5,['Siyah','Beyaz'],['#66566e','#f5effa'])],'Beyaz sayısı başlangıçta 2.','Bir beyaz ekle: 3.','Bir beyaz daha: 4.','Bir beyaz daha: 5; sayılar eşitlendi.'),
   scene('',bag(5,5,['Siyah','Beyaz'],['#66566e','#f5effa']),'Hedef 5 beyaz.','Başlangıçta 2 beyaz vardı.','5 − 2 = 3 beyaz eklendi.','Artık iki renk eşit olası.'),
  ]},
};
// Same preservation sample still gets its own actual 4 582 diagram.
raw['place-value']={explain:[scene('',place('4582',2),'4 582 sayısına bak.','5, yüzler basamağında.','Basamak birimi 100.','5 × 100 = 500.')],example:[scene('',place('4582',2),'Sayı 4 582.','Yüzlerdeki rakam 5.','5 × 100.','Basamak değeri 500.')]};
export const mathFilms:Record<string,{explain:MathFilmScene[];example:MathFilmScene[]}>=Object.fromEntries(Object.entries(raw).map(([topicId,sections])=>[topicId,Object.fromEntries(Object.entries(sections).map(([kind,scenes])=>[kind,scenes.map((s,i)=>({id:`${topicId}-${kind}-${i}`,anchor:s.anchor,diagrams:Array.isArray(s.diagram)?s.diagram:[s.diagram,s.diagram,s.diagram,s.diagram],captions:s.captions}))]))])) as Record<string,{explain:MathFilmScene[];example:MathFilmScene[]}>;
