# Xiaomi TV Stick 4K (MiTV-AYFR0) temizleyici - cleanyourtv examples/xiaomi-mitv-ayfr0 listesi
# Hiçbir şey SİLİNMEZ: yalnızca "pm disable-user --user 0". Geri almak için: geri-yukle.bat
$ErrorActionPreference = "Continue"
$D = $PSScriptRoot
Set-Location $D
function Yaz($m, $r = "White") { Write-Host $m -ForegroundColor $r }

# 1) adb
$adb = (Get-Command adb -ErrorAction SilentlyContinue).Source
if (-not $adb) {
  $adb = Join-Path $D "platform-tools\adb.exe"
  if (-not (Test-Path $adb)) {
    Yaz "adb indiriliyor (Google platform-tools)..." Cyan
    Invoke-WebRequest "https://dl.google.com/android/repository/platform-tools-latest-windows.zip" -OutFile "$D\pt.zip"
    Expand-Archive "$D\pt.zip" -DestinationPath $D -Force; Remove-Item "$D\pt.zip"
  }
}
& $adb start-server | Out-Null

# 2) Bağlan
Yaz "`nStick'te: Ayarlar > Cihaz Tercihleri > Geliştirici seçenekleri > USB hata ayıklama AÇIK olmalı." Yellow
Yaz "IP adresini Ayarlar > Ağ ve İnternet > (Wi-Fi ağınız) ekranında görürsünüz." Yellow
$ip = Read-Host "Stick'in IP adresi (örnek 192.168.1.20, port yazmazsanız 5555)"
if ($ip -notmatch ":") { $ip = "$ip`:5555" }
$kod = Read-Host "Stick 'Kablosuz hata ayıklama' ile eşleştirme kodu istiyorsa kodu yazın, istemiyorsa Enter"
if ($kod) { $pp = Read-Host "Eşleştirme ekranındaki IP:PORT"; & $adb pair $pp $kod }
& $adb connect $ip
Yaz "TV ekranında 'USB hata ayıklamaya izin verilsin mi?' kutusu çıktıysa 'Her zaman izin ver' + Tamam deyin." Yellow
Read-Host "Onayladıktan sonra Enter"
& $adb connect $ip | Out-Null
$st = (& $adb -s $ip get-state 2>&1) -join ""
if ($st -notmatch "device") { Yaz "Bağlanılamadı: $st" Red; Read-Host "Çıkmak için Enter"; exit 1 }
function Sh { & $adb -s $ip shell @args 2>&1 | ForEach-Object { "$_".TrimEnd("`r") } }

$model = (Sh getprop ro.product.model) -join ""; $cihaz = (Sh getprop ro.product.device) -join ""
Yaz "Bağlandı: model=$model cihaz=$cihaz" Green
if ($model -notmatch "AYFR0" -and $cihaz -ne "soul") {
  Yaz "UYARI: Bu liste MiTV-AYFR0 (soul) için. Sizin cihaz farklı görünüyor." Red
  if ((Read-Host "Yine de devam edilsin mi? (e/h)") -ne "e") { exit 1 }
}

# 3) Yedek + ölçüm (hiçbir şeye dokunmadan)
$Y = Join-Path $D ("yedek-" + (Get-Date -Format "yyyyMMdd-HHmmss")); New-Item -ItemType Directory $Y | Out-Null
$yed = @{ "paketler-f"="pm list packages -f"; "paketler-kapali"="pm list packages -d"; "getprop"="getprop";
  "settings-global"="settings list global"; "settings-secure"="settings list secure"; "settings-system"="settings list system";
  "meminfo-once"="dumpsys meminfo"; "proc-meminfo-once"="cat /proc/meminfo" }
foreach ($k in $yed.Keys) { Sh ($yed[$k] -split " ") | Set-Content "$Y\$k.txt" -Encoding UTF8 }
$onceMB = [int](((Sh cat /proc/meminfo) | Select-String "MemAvailable") -replace "\D","") / 1024
Yaz "Yedek: $Y   Kullanılabilir RAM (önce): $([int]$onceMB) MB" Green

# 4) Geri yükleme dosyaları
$R = Join-Path $D "geri-yukle.ps1"
if (-not (Test-Path $R)) {
  @"
`$adb = "$adb"; `$ip = Read-Host "Stick IP:PORT (önceki: $ip)"; if (-not `$ip) { `$ip = "$ip" }
& `$adb connect `$ip
function e(`$p) { Write-Host "geri aç: `$p"; & `$adb -s `$ip shell pm enable --user 0 `$p }
"@ | Set-Content $R -Encoding UTF8
}
$K = Join-Path $D "kapatilanlar.txt"; $L = Join-Path $D "GUNLUK.md"
Add-Content $L "`n## $(Get-Date -Format 'yyyy-MM-dd HH:mm') $model / $ip"

function Kapat($p, $neden) {
  $var = (Sh pm list packages $p) -contains "package:$p"
  if (-not $var) { Yaz "  yok      $p" DarkGray; return }
  if ((Sh pm list packages -d $p) -contains "package:$p") { Yaz "  zaten kapalı $p" DarkGray; return }
  $out = (Sh pm disable-user --user 0 $p) -join " "
  if ((Sh pm list packages -d $p) -contains "package:$p") {
    Add-Content $K $p; Add-Content $R "e $p"
    Add-Content $L "- kapatıldı: $p ($neden) - geri al: adb shell pm enable --user 0 $p"
    Yaz "  KAPATILDI $p  ($neden)" Green
  } else { Yaz "  BAŞARISIZ $p : $out" Red; Add-Content $L "- başarısız: $p : $out" }
}
function Kontrol($ad) {
  Sh input keyevent KEYCODE_HOME | Out-Null; Start-Sleep 4
  Sh screencap -p /sdcard/kontrol.png | Out-Null
  & $adb -s $ip pull /sdcard/kontrol.png "$Y\$ad.png" | Out-Null
  Yaz "  Ekran görüntüsü: $Y\$ad.png  (ana ekran geliyor mu bakın)" Cyan
}

$partiler = [ordered]@{
 "1 Telemetri ve reklam takibi" = @(
  @("com.miui.tv.analytics","Xiaomi kullanım analitiği"), @("com.xiaomi.statistic","Xiaomi istatistik gönderici"),
  @("com.google.android.feedback","Google geri bildirim gönderici"), @("com.android.tv.feedbackconsent","geri bildirim onay ekranı"),
  @("com.google.android.partnersetup","üretici-Google atıf takibi"), @("com.android.adservices.api","Privacy Sandbox reklam API'si"),
  @("com.android.ondevicepersonalization.services","cihaz üstü reklam kişiselleştirme"),
  @("com.android.federatedcompute.services","reklam modeli için federated learning"))
 "2 Health Connect ve eşitleme" = @(
  @("com.android.healthconnect.controller","Health Connect"), @("com.android.health.connect.backuprestore","Health Connect yedeği"),
  @("com.android.providers.contacts","kişiler deposu"), @("com.google.android.syncadapters.calendar","takvim eşitleme"))
 "3 PatchWall, içerik şeritleri, otomatik kurulumlar" = @(
  @("com.mitv.tvhome.atv","PatchWall içerik şeritleri"), @("com.mitv.tvhome.michannel","Mi kanal önerileri"),
  @("com.mitv.tvhome.mitvplus","Mi TV+ reklamlı kanallar"), @("com.xm.webcontent","Xiaomi web içerik/promosyon"),
  @("android.autoinstalls.config.soc.amlogic","izinsiz otomatik uygulama kurulumu"),
  @("android.autoinstalls.config.xiaomi.mibox3","izinsiz otomatik uygulama kurulumu"),
  @("android.autoinstalls.config.xioami.mibox3","aynısının yazım hatalı kopyası"))
 "4 Önceden yüklenmiş uygulamalar" = @(
  @("com.google.android.youtube.tvmusic","YouTube Music"), @("com.google.android.play.games","Play Games"),
  @("com.google.android.marvin.talkback","ekran okuyucu"), @("com.mitv.videoplayer","Mi video oynatıcı"),
  @("com.xiaomi.mimusic2","Mi müzik"), @("com.android.printspooler","yazıcı servisi"),
  @("com.google.android.backdrop","Ambient ekran koruyucu (Mi ekran koruyucu kalır)"))
}
foreach ($ad in $partiler.Keys) {
  Yaz "`n=== Parti $ad ===" Cyan
  foreach ($x in $partiler[$ad]) { Kapat $x[0] $x[1] }
  Kontrol ("parti-" + $ad.Substring(0,1))
  if ((Read-Host "TV'de ana ekran ve kumanda normal mi? (e = devam, h = bu partiyi geri al ve dur)") -eq "h") {
    foreach ($x in $partiler[$ad]) { Sh pm enable --user 0 $x[0] | Out-Null }
    Yaz "Son parti geri açıldı. Durduruldu." Yellow; exit 1 }
}

# 5) cleanyourtv listesinde olan ama size bağlı olanlar: tek tek sorulur
Yaz "`n=== Size bağlı olanlar (orijinal listede kapatılıyor) ===" Cyan
foreach ($x in @(@("com.netflix.ninja","Netflix"), @("com.netflix.tokenmanager","Netflix oturum yardımcısı"),
                 @("com.amazon.amazonvideo.livingroom","Prime Video"),
                 @("com.xiaomi.mitv.updateservice","Xiaomi sistem güncellemesi (kapatmanız önerilmez)"))) {
  if ((Read-Host "$($x[1]) kapatılsın mı? (e/h)") -eq "e") { Kapat $x[0] $x[1] }
}

# 6) Hızlandırma
Sh settings put global window_animation_scale 0.5 | Out-Null
Sh settings put global transition_animation_scale 0.5 | Out-Null
Sh settings put global animator_duration_scale 0.5 | Out-Null
Add-Content $R "& `$adb -s `$ip shell settings put global window_animation_scale 1.0"
Add-Content $R "& `$adb -s `$ip shell settings put global transition_animation_scale 1.0"
Add-Content $R "& `$adb -s `$ip shell settings put global animator_duration_scale 1.0"
Sh pm trim-caches 999G | Out-Null
Yaz "`nAnimasyonlar 0.5, önbellek temizlendi. Yeniden başlatılıyor..." Cyan
& $adb -s $ip reboot; Start-Sleep 75
for ($i=0; $i -lt 20; $i++) { & $adb connect $ip | Out-Null; if (((& $adb -s $ip get-state 2>&1) -join "") -match "device") { break }; Start-Sleep 5 }
Start-Sleep 20; Kontrol "yeniden-baslatma-sonrasi"
Sh dumpsys meminfo | Set-Content "$Y\meminfo-sonra.txt" -Encoding UTF8
$sonraMB = [int](((Sh cat /proc/meminfo) | Select-String "MemAvailable") -replace "\D","") / 1024
$tablo = "| | Kullanılabilir RAM |`n|---|---|`n| Önce | $([int]$onceMB) MB |`n| Sonra | $([int]$sonraMB) MB |"
Add-Content $L "`n$tablo"; Yaz "`n$tablo" Green
Yaz "`nBitti. Kapatılanlar: $K   Geri almak: geri-yukle.bat" Green
Yaz "İş bitince Geliştirici seçeneklerinden USB hata ayıklamayı kapatın." Yellow
Read-Host "Kapatmak için Enter"
