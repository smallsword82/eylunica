#!/usr/bin/env bash
# Paketleri kapatır. Kullanım: ./kapat.sh "neden" paket1 paket2 ... (en fazla 10)
# Her pm komutu AYRI shell çağrısıdır. Silmez; yalnızca pm disable-user --user 0.
set -u
source "$(dirname "$0")/ortak.sh"
NEDEN="$1"; shift
[ $# -gt 10 ] && { echo "Bir partide en fazla 10 paket."; exit 1; }
bagli_mi || exit 1
DOKUNULMAZ="com.android.vending com.google.android.gms com.google.android.gsf com.android.location.fused \
 com.google.android.tv.remote.service com.google.android.tv.dfuservice com.google.android.inputmethod.latin \
 com.android.tv.settings com.android.systemui android com.android.bluetooth com.sdt.mecoolrcupair com.sdt.ota \
 com.google.android.apps.mediashell com.android.providers.settings com.android.providers.tv"
log ""; log "## $(zaman) Parti: $NEDEN"
for p in "$@"; do
  case " $DOKUNULMAZ " in *" $p "*) log "- ATLANDI (dokunulmaz): $p"; continue;; esac
  if [ "$p" = com.google.android.tungsten.setupwraith ] && tv dumpsys wifi | grep -q "cname=$p"; then
    log "- ATLANDI: $p şu an kayıtlı Wi-Fi ağının sahibi; kapatınca Wi-Fi düşer. Önce TV'de ağı unutup yeniden bağlanın."; continue; fi
  d=$(paket_durumu "$p")
  case "$d" in
    yok)      log "- YOK: $p (bu TV'de kurulu değil)"; continue;;
    disabled) log "- ZATEN KAPALI: $p"; continue;;
  esac
  out=$(tv pm disable-user --user 0 "$p" 2>&1 | tr -d '\r')
  if [ "$(paket_durumu "$p")" = disabled ]; then
    echo "$p" >> "$KAPATILANLAR"
    echo "e $p" >> "$RESTORE_SH"; echo "e $p" >> "$RESTORE_PS1"
    log "- KAPATILDI: \`$p\` — geri al: \`adb shell pm enable --user 0 $p\`"
  else
    log "- BAŞARISIZ: $p -> $out"
  fi
done
echo; echo "Şimdi kontrol: ./kontrol.sh   |   Son partiyi geri al: tail -n $# $KAPATILANLAR | xargs -n1 adb -s $TV_HOST shell pm enable --user 0"
