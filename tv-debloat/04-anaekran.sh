#!/usr/bin/env bash
# FLauncher'ı varsayılan ana ekran yap; ancak sonra eski ana ekranı kapat.
set -u
source "$(dirname "$0")/ortak.sh"
bagli_mi || exit 1
FL=me.efesser.flauncher
if [ "$(paket_durumu $FL)" = yok ]; then
  echo "Önce TV'de Play Store'dan FLauncher'ı kurun (ya da: adb install -r flauncher.apk;"
  echo "Android 14'te takılırsa: adb push flauncher.apk /data/local/tmp/ && adb shell pm install -r /data/local/tmp/flauncher.apk)"; exit 1; fi
echo "Ana ekran adayları:"; tv cmd package query-activities -a android.intent.action.MAIN -c android.intent.category.HOME | tr -d '\r' | grep -E 'name=|packageName=' 
ACT=$(tv cmd package query-activities -a android.intent.action.MAIN -c android.intent.category.HOME | tr -d '\r' | grep -A3 "packageName=$FL" | grep -m1 'name=' | sed 's/.*name=//')
tv cmd package set-home-activity "$FL/$ACT"; log "- set-home-activity $FL/$ACT"
tv input keyevent KEYCODE_HOME; sleep 4; ekran_al anaekran-flauncher
echo "Ekran görüntüsünde FLauncher ızgarası görünüyor mu? Görünmüyorsa TV'de Ana ekran tuşuna basıp FLauncher'ı 'Her zaman' seçin."
read -r -p "FLauncher ana ekran oldu mu? (e/h) " c; [ "$c" = e ] || exit 1
# Önce setupwraith kontrolü (Wi-Fi sahibi mi?), sonra eski ana ekran
"$DIR/kapat.sh" "Google TV kurulum sihirbazı: ana ekranı geri almasın (Wi-Fi sahibiyse atlanır)" com.google.android.tungsten.setupwraith
"$DIR/kapat.sh" "Google TV eski ana ekranı (reklam/öneri şeritleri)" com.google.android.apps.tv.launcherx
adb -s "$TV_HOST" reboot; sleep 90; until bagli_mi 2>/dev/null; do sleep 5; done; sleep 20
tv input keyevent KEYCODE_HOME; sleep 4; ekran_al anaekran-reboot-sonrasi
echo "Yeniden başlatma sonrası ana ekran FLauncher mı? Değilse: ./kapat.sh ... setupwraith tekrar deneyin."
