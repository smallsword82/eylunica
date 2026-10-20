#!/usr/bin/env bash
# Linux x86_64 cloud onboarding. No application credentials or services required.
set -euo pipefail
cd /workspace/manifestakademi
source scripts/cloud-env.sh
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
if [ ! -x /workspace/jdk-21/bin/javac ]; then
  ritma_tmp=$(mktemp -d /tmp/ritma-jdk.XXXXXX)
  curl --fail --location --retry 2 'https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.9%2B10/OpenJDK21U-jdk_x64_linux_hotspot_21.0.9_10.tar.gz' -o "$ritma_tmp/jdk.tar.gz"
  curl --fail --location --retry 2 'https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.9%2B10/OpenJDK21U-jdk_x64_linux_hotspot_21.0.9_10.tar.gz.sha256.txt' -o "$ritma_tmp/jdk.sha256"
  python3 - "$ritma_tmp" <<'PY'
import pathlib,hashlib,sys
p=pathlib.Path(sys.argv[1]);expected=(p/'jdk.sha256').read_text().split()[0]
assert hashlib.sha256((p/'jdk.tar.gz').read_bytes()).hexdigest()==expected,'JDK checksum mismatch'
PY
  mkdir -p /workspace/jdk-21
  tar -xzf "$ritma_tmp/jdk.tar.gz" -C /workspace/jdk-21 --strip-components=1
fi
source scripts/cloud-env.sh
if [ ! -x "$ANDROID_HOME/cmdline-tools/19.0/bin/sdkmanager" ]; then
  ritma_sdk_tmp=$(mktemp -d /tmp/ritma-sdk.XXXXXX)
  curl --fail --location --retry 2 https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip -o "$ritma_sdk_tmp/tools.zip"
  printf '5fdcc763663eefb86a5b8879697aa6088b041e70  %s/tools.zip\n' "$ritma_sdk_tmp" | sha1sum --check -
  unzip -q "$ritma_sdk_tmp/tools.zip" -d "$ritma_sdk_tmp/unpacked"
  mkdir -p "$ANDROID_HOME/cmdline-tools"
  mv "$ritma_sdk_tmp/unpacked/cmdline-tools" "$ANDROID_HOME/cmdline-tools/19.0"
fi
# Input is bounded; SDK manager's exit status is preserved (no yes|pipe masking).
ritma_license_input=$(mktemp /tmp/ritma-licenses.XXXXXX)
for ritma_i in {1..100}; do printf 'y\n'; done > "$ritma_license_input"
"$ANDROID_HOME/cmdline-tools/19.0/bin/sdkmanager" --sdk_root="$ANDROID_HOME" 'platforms;android-35' 'build-tools;34.0.0' 'build-tools;35.0.0' 'platform-tools' < "$ritma_license_input"
npm run android:sync
