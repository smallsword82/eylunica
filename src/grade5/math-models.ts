export type MathModel='construction'|'angle'|'polygon'|'reading'|'place'|'operations'|'area'|'fraction'|'fractionCompare'|'data'|'equality'|'properties'|'precedence'|'pattern'|'algorithm'|'chance';
export const mathModels:Record<string,MathModel>={
 'topic-4add1fe377559e12':'construction','topic-a0155915387c7658':'angle','topic-c89c9fdbb63ce0ad':'polygon','topic-a219ce03fcdfdad6':'reading','topic-625a6bc82cb2ce2e':'place','place-value':'place','topic-05bf7580a6ccbb59':'operations','topic-9087112a70441c7a':'area','topic-6a97ba45a911803c':'fraction','topic-3f4d4b2a3773ed11':'fractionCompare','topic-ff34a0063ebe46c6':'data','topic-d170313ab769758e':'data','topic-5562bbd36f1b1115':'equality','topic-61b7fdd3038e685f':'properties','topic-c608a0ed9abefba6':'precedence','topic-70f412a50ce80c2f':'pattern','topic-735059132b26c64d':'algorithm','topic-a606b079db4e39a1':'algorithm','topic-cebe00fd601642dc':'chance','topic-fa7dd03066ee7a50':'chance',
};
export const modelCopy:Record<MathModel,{title:string;prompt:string;rule:string}>={
 construction:{title:'Çizginin izini sür',prompt:'Cetvel üzerinde iki nokta seç. Aralarındaki uzaklık nasıl değişiyor?',rule:'Doğru parçasının iki ucu vardır. Uzunluğu bulmak için büyük ölçümden küçüğünü çıkarırız.'},
 angle:{title:'Işınları hareket ettir',prompt:'Açıklığı değiştir; açıyı iletkiyle ölç.',rule:'Açı, ışınların uzunluğuna değil aralarındaki açıklığa bağlıdır.'},
 polygon:{title:'Şekil atölyesi',prompt:'Kenar sayısını değiştir. Köşeleri say, şeklin adını keşfet.',rule:'Çokgenler doğru parçalarından oluşan kapalı şekillerdir. Çemberin kenarı ve köşesi yoktur.'},
 reading:{title:'Sayıların bölüklerini keşfet',prompt:'Milyonlar bölüğünü değiştir. Sayı nasıl okunuyor?',rule:'Sağdan başlayarak üçer basamaklı bölükler oluştururuz: birler, binler, milyonlar.'},
 place:{title:'Rakamın gizli değeri',prompt:'4 582 sayısında bir rakama dokun. Yerinin değerini nasıl değiştirdiğini gör.',rule:'Basamak değeri, rakam ile bulunduğu basamağın birim değerinin çarpımıdır.'},
 operations:{title:'Kutuların içindeki problem',prompt:'Her kutuda aynı sayıda kalem var. Kutu sayısını değiştir; toplamı bul.',rule:'Eşit grupların toplamı çarpmayla bulunur. Gruplara geri ayırmak bölmedir.'},
 area:{title:'Kendi bahçeni tasarla',prompt:'Bahçenin kenarlarını değiştir. Çit uzunluğu ve kaplanan yer nasıl değişiyor?',rule:'Çevre sınırın uzunluğudur: 2 × (uzunluk + genişlik). Alan iç bölgedir: uzunluk × genişlik.'},
 fraction:{title:'Bir bütünü paylaş',prompt:'Bütünü eş parçalara ayır. Parçalara dokunarak bir kesir oluştur.',rule:'Payda eş parça sayısını, pay seçilen parça sayısını gösterir.'},
 fractionCompare:{title:'Hangi paylaşım daha büyük?',prompt:'Eş büyüklükteki iki bütünün boyalı parçalarını karşılaştır.',rule:'Paydalar eşitse daha çok eş parçası boyalı olan kesir daha büyüktür.'},
 data:{title:'Sınıfın tercihlerini keşfet',prompt:'Örnek sınıfta hangi meyve tercih ediliyor? Oy ekle, sütunların değişimini izle.',rule:'Kategorik veriler gruplara ayrılır. Sütun yüksekliği o gruptaki kişi sayısını gösterir.'},
 equality:{title:'Dengeyi koru',prompt:'Terazinin iki tarafına aynı sayıyı ekle. Eşitlik korunuyor mu?',rule:'Bir eşitliğin iki tarafına aynı sayı eklenirse iki tarafın eşitliği korunur.'},
 properties:{title:'Grupları başka türlü say',prompt:'Kareleri iki renge ayır. İki farklı işlem aynı toplamı veriyor mu?',rule:'Dağılma özelliği: a × (b + c) = a × b + a × c.'},
 precedence:{title:'İşlem yolunu takip et',prompt:'Çarpımın önüne bir toplama ekledik. Hangi işlem önce yapılmalı?',rule:'Parantez yoksa çarpma ve bölme, toplama ve çıkarmadan önce yapılır. Aynı öncelikte soldan sağa ilerleriz.'},
 pattern:{title:'Sayıların ritmini yakala',prompt:'Artış miktarını değiştir. Bir sonraki adımda ne olacağını tahmin et.',rule:'Bu örüntüde her adımda sabit bir sayı eklenir. İlk terim ve artış miktarı kuralı belirler.'},
 algorithm:{title:'Robotun işlem rotası',prompt:'Robot bir bütçeyi adım adım paylaştırıyor. Her adımın sonucunu izle.',rule:'Algoritma, bir işi sonlu ve sıralı adımlarla çözme yoludur. Her adım açık olmalıdır.'},
 chance:{title:'Tahmin laboratuvarı',prompt:'Çantadaki renkli taşları değiştir. Hangi renk hakkında daha güçlü bir tahmin yaparsın?',rule:'Aynı özellikteki taşlar iyi karıştırılmışsa sayıca fazla olan renk daha olasıdır. Bir tahmin, tek çekilişin sonucunu garanti etmez.'},
};
export const numberWords=['bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'];
