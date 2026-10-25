#!/usr/bin/env bash
# 4. kural: parti sonrası TV'de kontrol. Tuşlara basar, her adımda ekran görüntüsü alır.
set -u
source "$(dirname "$0")/ortak.sh"
bagli_mi || exit 1
k() { tv input keyevent "$1"; sleep "${2:-2}"; }
k KEYCODE_HOME 4;        ekran_al 1-anaekran
k KEYCODE_DPAD_DOWN 1; k KEYCODE_DPAD_RIGHT 1; ekran_al 2-yon-tuslari
k KEYCODE_BACK 2;        ekran_al 3-geri
k KEYCODE_TV_INPUT 3;    ekran_al 4-girisler   # stick'te Girişler menüsü olmayabilir, boş gelmesi normal
k KEYCODE_HOME 3
tv monkey -p com.netflix.ninja -c android.intent.category.LEANBACK_LAUNCHER 1 >/dev/null 2>&1; sleep 8; ekran_al 5-netflix
k KEYCODE_HOME 3
tv monkey -p com.google.android.youtube.tv -c android.intent.category.LEANBACK_LAUNCHER 1 >/dev/null 2>&1; sleep 8; ekran_al 6-youtube
k KEYCODE_HOME 3
echo "Şu an ön planda:"; tv dumpsys activity activities | tr -d '\r' | grep -m1 -E 'topResumedActivity|mResumedActivity'
echo "Wi-Fi ağ sahibi (setupwraith görünüyorsa önce ağı unutup yeniden bağlan):"; tv dumpsys wifi | tr -d '\r' | grep -o 'cname=[^ ]*' | sort -u
echo "Ekran görüntülerine bakın: $EKRAN"
