import type {MathDiagram as D} from './math-diagrams';
export type CoachTask={prompt:string;hint:string;success:string;initial:number;target:number;min:number;max:number;buttons:[string,string];diagram:(value:number)=>D;readout:(value:number)=>string};
export type MathCoachPlan={together:CoachTask;try:CoachTask};
const task=(prompt:string,hint:string,success:string,initial:number,target:number,min:number,max:number,buttons:[string,string],diagram:CoachTask['diagram'],readout:CoachTask['readout']):CoachTask=>({prompt,hint,success,initial,target,min,max,buttons,diagram,readout});
const segment=(v:number):D=>({kind:'segment',task:'distance',a:0,b:v,unit:'cm'});
const polygon=(v:number):D=>({kind:'polygon',task:'features',sides:v,edge:2});
const place=(v:number):D=>({kind:'place',digits:'4582',selectedFromRight:v});
const fraction=(v:number):D=>({kind:'fraction',task:'fraction',den:4,num:v,copies:1});
const bags=(v:number):D=>({kind:'bag',task:'likely',a:4,b:v,names:['Sarı','Mor'],colors:['#ffda8d','#c3a2f2']});
const count=(name:string)=>(v:number)=>`${name}: ${v}`;
const places=['Birler: 2 × 1 = 2','Onlar: 8 × 10 = 80','Yüzler: 5 × 100 = 500','Binler: 4 × 1000 = 4000'];
const placePlan:MathCoachPlan={
 together:task('Yüzler basamağını bulalım. Sola ilerleyerek beş rakamını seç.','Birlerden başla. Sola iki kez dokun: onlar, sonra yüzler.','Beş yüzler basamağında. Beş yüzlük, beş yüz eder.',0,2,0,3,['Sağa git','Sola git'],place,v=>places[v]),
 try:task('Şimdi binler basamağındaki dört rakamını sen seç.','Sola doğru ilerle. Dört rakamı binler basamağında.','Dört binlik, dört bin eder. Rakamın yeri değerini değiştirdi.',1,3,0,3,['Sağa git','Sola git'],place,v=>places[v]),
};
/** Each topic has its own concrete manipulation and a separate independent goal. */
export const mathCoachPlans:Record<string,MathCoachPlan>={
 'topic-4add1fe377559e12':{
 together:task('A sıfırda kalsın. B noktasını dört santimetreye taşı.','Uzat düğmesi B noktasını bir santimetre sağa taşır. Dörde ulaş.','İki uç arasındaki doğru parçası dört santimetre oldu.',2,4,1,8,['Kısalt','Uzat'],segment,v=>`AB: ${v} cm`),
 try:task('Şimdi doğru parçasını üç santimetre yap.','B noktasını sola taşımak için Kısalt düğmesine dokun.','Sıfır ile üç arasındaki uzaklık üç santimetredir.',6,3,1,8,['Kısalt','Uzat'],segment,v=>`AB: ${v} cm`),
 },
 'topic-c89c9fdbb63ce0ad':{
 together:task('Üçgene bir kenar ekle. Dört kenarlı kapalı bir şekil oluştur.','Kenar ekle düğmesine bir kez dokun. Kenarlar ve köşeler birlikte değişir.','Dört düz kenarı ve dört köşesi olan kapalı şekil bir dörtgendir.',3,4,3,8,['Kenar azalt','Kenar ekle'],polygon,v=>`${v} kenar · ${v} köşe`),
 try:task('Şimdi altı kenarlı bir çokgen oluştur.','Kenar sayısını altıya getir. Şeklin kapalı kaldığına bak.','Altıgenin altı düz kenarı ve altı köşesi vardır.',4,6,3,8,['Kenar azalt','Kenar ekle'],polygon,v=>`${v} kenar · ${v} köşe`),
 },
 'topic-a219ce03fcdfdad6':{
 together:task('Bölükler sağdan üçerli ayrılır. Binler bölüğünü seç.','Birler en sağda. Sola ilerle düğmesiyle binlere ulaş.','Yüz yirmi üç bölüğü binleri gösterir: yüz yirmi üç bin.',2,1,0,2,['Sola ilerle','Sağa ilerle'],v=>({kind:'number',task:'group',groups:['4','123','582'],selected:v}),v=>['Milyonlar: 4','Binler: 123','Birler: 582'][v]),
 try:task('Bu kez milyonlar bölüğünü sen seç.','En soldaki dört, milyonlar bölüğündedir.','Milyonlar bölüğünde dört var. Değeri dört milyondur.',2,0,0,2,['Sola ilerle','Sağa ilerle'],v=>({kind:'number',task:'groupValue',groups:['4','123','582'],selected:v}),v=>['Milyonlar: 4','Binler: 123','Birler: 582'][v]),
 },
 'topic-625a6bc82cb2ce2e':placePlan,
 'place-value':placePlan,
 'topic-05bf7580a6ccbb59':{
 together:task('Her kutuda üç kalem var. Kutu ekleyerek toplamı on iki kalem yap.','Dört kutunun her birinde üç kalem olursa on iki kalem olur.','Dört eş grup, her grupta üç kalem: dört çarpı üç, on iki.',2,4,1,6,['Kutu çıkar','Kutu ekle'],v=>({kind:'groups',groups:v,each:3,task:'multiply',unit:'kalem'}),v=>`${v} × 3 = ${v*3} kalem`),
 try:task('Her kutuda dört kalem var. Toplam yirmi kalem olacak şekilde kutu sayısını ayarla.','Kaç tane dörtlü grup yirmi eder? Kutuları ekleyerek dene.','Beş kutuda dörder kalem, toplam yirmi kalem eder.',2,5,1,6,['Kutu çıkar','Kutu ekle'],v=>({kind:'groups',groups:v,each:4,task:'multiply',unit:'kalem'}),v=>`${v} × 4 = ${v*4} kalem`),
 },
 'topic-9087112a70441c7a':{
 together:task('Bahçenin bir kenarı üç birim. Diğerini dört yap; on iki birim kareyi gör.','Uzat düğmesiyle yatay kenarı dörde getir. Kareleri satır satır say.','Üç satırda dörder kare var. Alan on iki birim karedir.',2,4,1,7,['Kısalt','Uzat'],v=>({kind:'rectangle',task:'area',a:v,b:3,unit:'birim'}),v=>`${v} × 3 = ${v*3} birim²`),
 try:task('Diğer kenar yine üç birim. Alanı on beş birim kare yap.','Üç satırın her birinde kaç kare olmalı? Kenarı beşe getir.','Beş çarpı üç, on beş. Alan iç bölgedeki birim kareleri sayar.',2,5,1,7,['Kısalt','Uzat'],v=>({kind:'rectangle',task:'area',a:v,b:3,unit:'birim'}),v=>`${v} × 3 = ${v*3} birim²`),
 },
 'topic-6a97ba45a911803c':{
 together:task('Bütün dört eş parçaya ayrıldı. Üç parçasını boya.','Parça boya düğmesine dokun. Pay üç, payda dört olsun.','Dört eş parçanın üçü boyalı. Kesrimiz dörtte üç.',1,3,0,4,['Boyayı sil','Parça boya'],fraction,v=>`${v}/4 · ${v} boyalı parça`),
 try:task('Şimdi aynı bütünün dörtte ikisini boyalı bırak.','Boyalı parçaları ikiye indir. Eş parça sayısı dört kalır.','Dörtte iki, iki eş parçanın boyalı olduğunu gösterir. Bu, bütünün yarısıdır.',4,2,0,4,['Boyayı sil','Parça boya'],fraction,v=>`${v}/4 · ${v} boyalı parça`),
 },
 'topic-3f4d4b2a3773ed11':{
 together:task('İki bütün eş büyüklükte. İkinciyi de dörtte üç yaparak paylaşımları eşitle.','Alttaki boyalı parçaları üçe getir. İki pay da üç olsun.','Aynı büyüklükte bütünlerde dörtte üç ile dörtte üç eşittir.',1,3,0,4,['Alttan sil','Alta boya'],v=>({kind:'compare',left:[3,4],right:[v,4]}),v=>`Üst: 3/4 · Alt: ${v}/4`),
 try:task('Şimdi alt kesri dörtte iki yap. Üstteki dörtte üç daha büyük kalsın.','Alttaki payı ikiye getir. Paydalar eşitken payları karşılaştır.','Dörtte üç, dörtte ikiden büyüktür; çünkü eş parçalardan daha fazlası boyalıdır.',4,2,0,4,['Alttan sil','Alta boya'],v=>({kind:'compare',left:[3,4],right:[v,4]}),v=>`Üst: 3/4 · Alt: ${v}/4`),
 },
 'topic-ff34a0063ebe46c6':{
 together:task('Sınıfın meyve oylarını incele. Armut oyunu beşe getir.','Armuta oy ekle. Mor sütun her yeni oyda bir kişi yükselir.','Armut sütunu beş kişiyi gösteriyor. Sütun yüksekliği sıklığı verir.',2,5,0,7,['Armut oyu sil','Armuta oy ekle'],v=>({kind:'chart',task:'total',values:[4,v,3],labels:['Elma','Armut','Muz']}),v=>`Armut: ${v} kişi`),
 try:task('Bir oy yanlış yazılmış. Armutun oyunu dörde düzelt.','Armut sütununu dört kişiye getir. Elma ile yükseklikleri eşit olsun.','Elma ve armut dörder oy aldı. Eşit sütunlar eşit sıklığı gösterir.',6,4,0,7,['Armut oyu sil','Armuta oy ekle'],v=>({kind:'chart',task:'total',values:[4,v,3],labels:['Elma','Armut','Muz']}),v=>`Armut: ${v} kişi`),
 },
 'topic-d170313ab769758e':{
 together:task('Kitap tercihleri grafiğinde öykü oylarını altıya getir. Öykü en çok seçilen olsun.','Öyküye oy ekle. Diğer sütunların üç ve dört olduğuna bak.','Altı oy, üçten ve dörtten fazladır. Öykü en çok seçilendir; herkes seçti diyemeyiz.',2,6,0,7,['Öykü oyu sil','Öyküye oy ekle'],v=>({kind:'chart',task:'allClaim',values:[v,3,4],labels:['Öykü','Şiir','Masal']}),v=>`Öykü: ${v} · Şiir: 3 · Masal: 4`),
 try:task('Öykü ve masal eşit seçilmiş olsun. Öykü oylarını dörde getir.','Masal dört oy aldı. Öykü sütununu onunla aynı yüksekliğe getir.','İki tür dörder oy aldı. Bu grafikten herkesin aynı türü seçtiği sonucu çıkmaz.',6,4,0,7,['Öykü oyu sil','Öyküye oy ekle'],v=>({kind:'chart',task:'allClaim',values:[v,3,4],labels:['Öykü','Şiir','Masal']}),v=>`Öykü: ${v} · Şiir: 3 · Masal: 4`),
 },
 'topic-5562bbd36f1b1115':{
 together:task('İki tarafta da altı var. Her iki tarafa ikişer ekle.','İkisine ekle düğmesi iki tarafı da birer artırır. Eklenen miktarı ikiye getir.','Altıya iki ekledik: iki taraf da sekiz oldu. Eşitlik korundu.',0,2,0,5,['İkisinden çıkar','İkisine ekle'],v=>({kind:'balance',task:'bothAdd',n:6-v,m:v}),v=>`6 + ${v} = 6 + ${v} · İki taraf da ${6+v}`),
 try:task('İki tarafa da toplam dört eklenmiş olsun. Dengeyi koru.','Eklenen miktarı dörde getir. Aynı işlemi iki tarafta yapıyoruz.','Altıya dört ekledik. Her iki taraf da on; terazi hâlâ dengede.',1,4,0,5,['İkisinden çıkar','İkisine ekle'],v=>({kind:'balance',task:'bothAdd',n:6-v,m:v}),v=>`6 + ${v} = 6 + ${v} · İki taraf da ${6+v}`),
 },
 'topic-61b7fdd3038e685f':{
 together:task('Üç satırlık karelere bak. Altın renkli bölümü iki sütuna getir.','Altın sütun ekle. Üç çarpı dört ile üç çarpı ikiyi ayrı ayrı say.','Üç çarpı altı, üç çarpı dört artı üç çarpı ikiyle aynıdır. Toplam on sekiz.',1,2,0,4,['Altın sütun sil','Altın sütun ekle'],v=>({kind:'property',task:'distribute',n:3,m:4,extra:v}),v=>`3 × (4 + ${v}) = 12 + ${3*v}`),
 try:task('Bu kez altın bölümü üç sütun yap. İki bölgenin toplamını incele.','Altın bölge üç sütun olunca dokuz kare içerir. Mavi bölgede on iki kare var.','On iki artı dokuz, yirmi bir eder. Üç çarpı yedi de yirmi birdir.',1,3,0,4,['Altın sütun sil','Altın sütun ekle'],v=>({kind:'property',task:'distribute',n:3,m:4,extra:v}),v=>`3 × (4 + ${v}) = 12 + ${3*v}`),
 },
 'topic-c608a0ed9abefba6':{
 together:task('İki artı üç çarpı dörtte önce çarpma yapılır. Gösterimde çarpma sonucuna ilerle.','Sonraki adım düğmesine bir kez dokun. Üç çarpı dört, on iki olur.','Toplama bekledi; önce çarpma yapıldı. Şimdi iki artı on iki kaldı.',0,1,0,2,['Önceki adım','Sonraki adım'],v=>({kind:'rule',lines:['2 + 3 × 4',v>=1?'2 + 12':'Önce çarpmayı yap',v>=2?'Sonuç: 14':'Sonra toplamayı yap']}),v=>['İlk ifade: 2 + 3 × 4','Çarpma yapıldı: 2 + 12','Toplama yapıldı: 14'][v]),
 try:task('Beş artı iki çarpı üç işlemini doğru sırayla sonuca ulaştır.','Önce iki çarpı üç, altı. Sonra beş artı altı. İki adımı da ilerlet.','Önce çarpma, sonra toplama yaptın. Sonuç on bir.',0,2,0,2,['Önceki adım','Sonraki adım'],v=>({kind:'rule',lines:['5 + 2 × 3',v>=1?'5 + 6':'Önce çarpmayı yap',v>=2?'Sonuç: 11':'Sonra toplamayı yap']}),v=>['İlk ifade: 5 + 2 × 3','Çarpma yapıldı: 5 + 6','Toplama yapıldı: 11'][v]),
 },
 'topic-70f412a50ce80c2f':{
 together:task('Örüntü ikiden başlıyor. Artışı üç yap: iki, beş, sekiz.','Artışı artır düğmesiyle her adımda eklenen miktarı üçe getir.','İkiden başlayıp üçer ekledik. İki, beş, sekiz, on bir, on dört.',1,3,1,5,['Artışı azalt','Artışı artır'],v=>({kind:'sequence',start:2,change:v,count:4,targetIndex:5,rule:'add'}),v=>`Her adımda +${v}`),
 try:task('Bu kez dörtten başlayan örüntüyü ikişer artır.','Artış miktarı iki olmalı. Dört, altı, sekiz diye kontrol et.','Dört, altı, sekiz, on, on iki. Her terimde iki ekledin.',4,2,1,5,['Artışı azalt','Artışı artır'],v=>({kind:'sequence',start:4,change:v,count:4,targetIndex:5,rule:'add'}),v=>`Her adımda +${v}`),
 },
 'topic-735059132b26c64d':{
 together:task('Robot dörtten başlıyor. Önce üç ekleme adımını uygula.','İlerle düğmesine bir kez dokun. İlk işlem dört artı üçtür.','İlk adımın sonucu yedi. Sonraki işlem bu yedi üzerinde yapılır.',0,1,0,2,['Geri al','İlerle'],v=>({kind:'flow',input:4,operations:([{op:'+',value:3},{op:'×',value:2}] as const).slice(0,v)}),v=>['Girdi: 4','4 + 3 = 7','7 × 2 = 14'][v]),
 try:task('Robot bu kez altıdan başlıyor. Önce iki ekle, sonra ikiyle çarp. İki adımı da tamamla.','İlerle düğmesiyle sırayı takip et: önce altı artı iki, sonra sekiz çarpı iki.','Sırayı korudun. Altı artı iki, sekiz; sekiz çarpı iki, on altı.',0,2,0,2,['Geri al','İlerle'],v=>({kind:'flow',input:6,operations:([{op:'+',value:2},{op:'×',value:2}] as const).slice(0,v)}),v=>['Girdi: 6','6 + 2 = 8','8 × 2 = 16'][v]),
 },
 'topic-a606b079db4e39a1':{
 together:task('Kuralımız: sayı çiftse ikiye böl, tekse bir ekle. Girdiyi sekiz yap; izlenen yolu gör.','Girdiyi artırarak sekize getir. Sekiz çift olduğu için Evet yolu seçilir.','Sekiz çift. İkiye bölününce çıktı dört olur. Yalnız Evet yolu izlendi.',6,8,5,12,['Girdiyi azalt','Girdiyi artır'],v=>({kind:'conditional',test:'even',input:v}),v=>`Girdi: ${v} · ${v%2===0?'Çift → ÷ 2':'Tek → + 1'}`),
 try:task('Şimdi girdiyi dokuz yap. Bu kez hangi yolun seçildiğini incele.','Dokuz tek. Girdiyi dokuza getirince Hayır yolu seçilir.','Dokuz tek olduğundan bir ekledik. Çıktı on oldu. Koşul seçilen yolu değiştirdi.',6,9,5,12,['Girdiyi azalt','Girdiyi artır'],v=>({kind:'conditional',test:'even',input:v}),v=>`Girdi: ${v} · ${v%2===0?'Çift → ÷ 2':'Tek → + 1'}`),
 },
 'topic-cebe00fd601642dc':{
 together:task('Torbada dört sarı taş var. Morları da dört yap; renklerin şansını eşitle.','Mor taş ekle. Her renkten dört taş olduğunda sayılar eşittir.','Taşların özellikleri aynıysa ve iyi karıştırılmışsa renkler eşit olasıdır.',1,4,0,7,['Mor taş çıkar','Mor taş ekle'],bags,v=>`Sarı: 4 · Mor: ${v}`),
 try:task('Şimdi mor taşları ikiye indir. Sarı çekmek daha olası olsun.','Mor taş çıkar düğmesiyle sayıyı ikiye getir. Sarılar dört kalıyor.','Dört sarı, iki mor var. Sarı daha olasıdır; ama kesin sarı çıkar diyemeyiz.',5,2,0,7,['Mor taş çıkar','Mor taş ekle'],bags,v=>`Sarı: 4 · Mor: ${v}`),
 },
 'topic-fa7dd03066ee7a50':{
 together:task('Renklerin olasılıklarını karşılaştıralım. Morları altı yap; mor daha olası olsun.','Sarılar dört tane. Morları altıya çıkar; altı dörtten büyüktür.','Altı mor, dört sarı var. Mor daha olası; bu, tek çekilişin sonucunu garanti etmez.',3,6,0,7,['Mor taş çıkar','Mor taş ekle'],bags,v=>`Sarı: 4 · Mor: ${v}`),
 try:task('Şimdi iki rengin seçilme şansını eşitle. Mor taş sayısını kendin bul.','Sarılar dört tane. Eşit şans için mor taş sayısı da dört olmalı.','Her renkten dört taş var. Özellikleri aynı ve iyi karışmışsa renkler eşit olasıdır.',7,4,0,7,['Mor taş çıkar','Mor taş ekle'],bags,v=>`Sarı: 4 · Mor: ${v}`),
 },
};
export const coachTaskComplete=(task:CoachTask,value:number,interacted:boolean)=>interacted&&value===task.target;
export const mathCoachTexts=Object.values(mathCoachPlans).flatMap(plan=>[plan.together,plan.try].flatMap(t=>[t.prompt,t.hint,t.success]));
