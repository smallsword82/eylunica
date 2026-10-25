#!/usr/bin/env bash
# b) Hiçbir şeye dokunmadan yedek al, RAM ölç, geri yükleme scriptlerini başlat.
set -u
source "$(dirname "$0")/ortak.sh"
bagli_mi || exit 1
Y="$DIR/yedek-$(date +%Y%m%d-%H%M%S)"; mkdir -p "$Y"
for c in "pm list packages -f" "pm list packages -d" "pm list packages -e" "getprop" \
         "settings list global" "settings list secure" "settings list system" "dumpsys meminfo" \
         "cmd package query-activities -a android.intent.action.MAIN -c android.intent.category.HOME" \
         "dumpsys wifi"; do
  f="$Y/$(echo "$c" | tr ' ' '_' | tr -c 'A-Za-z0-9_.\n' '-').txt"
  tv $c > "$f" 2>&1 && echo "yedek: $f ($(wc -l < "$f") satır)"
done
ram_olc once
# Geri yükleme scriptleri (sadece yoksa oluştur; varsa dokunma)
if [ ! -f "$RESTORE_SH" ]; then cat > "$RESTORE_SH" <<'R'
#!/usr/bin/env bash
# Kapatılan her paketi geri açar. Kullanım: TV_HOST=192.168.1.17:36373 ./restore.sh
TV_HOST="${TV_HOST:-192.168.1.17:36373}"
adb connect "$TV_HOST" >/dev/null
e() { echo "enable $1"; adb -s "$TV_HOST" shell pm enable --user 0 "$1"; }
# Ana ekranı Google TV'ye geri ver (FLauncher kurulduysa):
# adb -s "$TV_HOST" shell cmd package set-home-activity com.google.android.apps.tv.launcherx/.LauncherXActivity
adb -s "$TV_HOST" shell settings put global window_animation_scale 1.0
adb -s "$TV_HOST" shell settings put global transition_animation_scale 1.0
adb -s "$TV_HOST" shell settings put global animator_duration_scale 1.0
# --- kapatılan paketler (kapat.sh her kapatmada buraya bir satır ekler) ---
R
chmod +x "$RESTORE_SH"; fi
if [ ! -f "$RESTORE_PS1" ]; then cat > "$RESTORE_PS1" <<'R'
# Windows PowerShell: kapatılan her paketi geri açar.  .\restore.ps1
$TV = if ($env:TV_HOST) { $env:TV_HOST } else { "192.168.1.17:36373" }
adb connect $TV | Out-Null
function e($p) { Write-Host "enable $p"; adb -s $TV shell pm enable --user 0 $p }
adb -s $TV shell settings put global window_animation_scale 1.0
adb -s $TV shell settings put global transition_animation_scale 1.0
adb -s $TV shell settings put global animator_duration_scale 1.0
# --- kapatılan paketler ---
R
fi
touch "$KAPATILANLAR"
[ -f "$LOG" ] || printf '# TV Debloat Günlüğü\n\nTV: %s\n\n' "$TV_HOST" > "$LOG"
log "## $(zaman) Yedek alındı: $Y"
echo "TEK SATIR GERİ ALMA: cd $DIR && ./restore.sh"
