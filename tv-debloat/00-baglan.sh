#!/usr/bin/env bash
# a) adb kurulu mu? değilse kur, sonra TV'ye bağlan.
set -u
source "$(dirname "$0")/ortak.sh"
OS="$(uname -s 2>/dev/null || echo Windows)"
echo "İşletim sistemi: $OS"
if ! command -v adb >/dev/null 2>&1; then
  case "$OS" in
    Darwin) echo "adb yok, Homebrew ile kuruluyor"; brew install android-platform-tools ;;
    Linux)  echo "adb yok, apt ile kuruluyor"; sudo apt-get update && sudo apt-get install -y adb ;;
    *) echo "Windows: https://dl.google.com/android/repository/platform-tools-latest-windows.zip indirin,"
       echo "açın ve klasörü PATH'e ekleyin (ya da bu scriptleri o klasörün içinden çalıştırın)."; exit 1 ;;
  esac
fi
adb version | head -1
adb start-server
echo "Bağlanıyor: $TV_HOST"
adb connect "$TV_HOST"
adb devices -l
if ! bagli_mi; then exit 1; fi
echo
echo "Bağlı. TV kimliği:"
tv getprop ro.product.brand; tv getprop ro.product.model; tv getprop ro.product.device
tv getprop ro.build.version.release; tv getprop ro.build.fingerprint
echo
echo "SORU: TV'nin USB portlarına ne takılı? (hoparlör, disk, klavye...) USB hata ayıklama açıkken bazı"
echo "cihazlar bu portların gücünü keser. İş bitince USB hata ayıklamayı kapatmanız gerekebilir."
