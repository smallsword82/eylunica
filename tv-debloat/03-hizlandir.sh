#!/usr/bin/env bash
# e) animasyon 0.5  f) trim-caches  g) yeniden başlat, kontrol, ölçüm, önce/sonra tablosu
set -u
source "$(dirname "$0")/ortak.sh"
bagli_mi || exit 1
tv settings put global window_animation_scale 0.5
tv settings put global transition_animation_scale 0.5
tv settings put global animator_duration_scale 0.5
log "- Animasyon ölçekleri 0.5 yapıldı (geri: restore.sh 1.0'a alır)"
tv pm trim-caches 999G; log "- pm trim-caches 999G çalıştırıldı"
echo "Yeniden başlatılıyor, ~90 sn bekleniyor..."; adb -s "$TV_HOST" reboot; sleep 90
until bagli_mi 2>/dev/null; do sleep 5; done; sleep 20
"$DIR/kontrol.sh"
ram_olc sonra
echo; echo "| Ölçüm | Toplam MB | Boş MB | Kullanılabilir MB |"; echo "|---|---|---|---|"
awk -F'|' '{printf "| %s | %s | %s | %s |\n",$1,$2,$3,$4}' "$DIR/olcum-ozet.txt" | tee -a "$LOG"
