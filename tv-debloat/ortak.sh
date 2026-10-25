#!/usr/bin/env bash
# Ortak yardımcılar. Diğer scriptler bunu `source` eder.
# TV adresi: TV_HOST ortam değişkeni ya da ilk argüman. Varsayılan sizin TV'niz.
TV_HOST="${TV_HOST:-192.168.1.17:36373}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG="$DIR/DEBLOAT-LOG.md"
KAPATILANLAR="$DIR/kapatilanlar.txt"
RESTORE_SH="$DIR/restore.sh"
RESTORE_PS1="$DIR/restore.ps1"
EKRAN="$DIR/ekran"
mkdir -p "$EKRAN"

tv() { adb -s "$TV_HOST" shell "$@"; }          # TEK komut, tek shell çağrısı
log() { printf '%s\n' "$*" | tee -a "$LOG"; }
zaman() { date '+%Y-%m-%d %H:%M:%S'; }

bagli_mi() {
  adb -s "$TV_HOST" get-state >/dev/null 2>&1 || {
    echo "TV'ye bağlı değil: adb connect $TV_HOST deneniyor..."
    adb connect "$TV_HOST" || return 1
    adb -s "$TV_HOST" get-state >/dev/null 2>&1 || {
      echo "Bağlanamadı. TV ekranında 'Bu bilgisayara izin verilsin mi?' kutusu varsa onaylayın."
      echo "Android 11+ ve ilk bağlantıysa: Ayarlar > Geliştirici > Kablosuz hata ayıklama > Eşleştirme koduyla eşleştir"
      echo "  adb pair 192.168.1.17:<eşleştirme portu> <kod>   sonra   adb connect $TV_HOST"
      return 1; }
  }
}

ekran_al() {  # ekran_al <isim>  -> ekran/<isim>.png
  local f="$EKRAN/$(date +%H%M%S)-$1.png"
  adb -s "$TV_HOST" exec-out screencap -p > "$f" && echo "Ekran görüntüsü: $f"
}

paket_durumu() {  # enabled / disabled / yok
  local p="$1"
  if tv pm list packages -d | tr -d '\r' | grep -qx "package:$p"; then echo disabled
  elif tv pm list packages | tr -d '\r' | grep -qx "package:$p"; then echo enabled
  else echo yok; fi
}

ram_olc() {  # ram_olc <etiket>  -> ölçüm dosyası + tek satır özet
  local f="$DIR/olcum-$1.txt"
  { echo "# $(zaman) $1"; tv cat /proc/meminfo; echo; tv dumpsys meminfo; } > "$f"
  local total free avail
  total=$(grep -m1 MemTotal "$f" | awk '{printf "%.0f",$2/1024}')
  free=$(grep -m1 '^MemFree' "$f" | awk '{printf "%.0f",$2/1024}')
  avail=$(grep -m1 MemAvailable "$f" | awk '{printf "%.0f",$2/1024}')
  echo "$1: Toplam ${total} MB, Boş ${free} MB, Kullanılabilir ${avail} MB  ($f)"
  echo "$1|$total|$free|$avail" >> "$DIR/olcum-ozet.txt"
}
