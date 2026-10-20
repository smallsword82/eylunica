#!/usr/bin/env bash
# Source this file in the managed cloud machine; it contains no credentials.
export ANDROID_HOME=/workspace/android-sdk
export ANDROID_USER_HOME=/workspace/android-home/.android
export GRADLE_USER_HOME=/workspace/gradle-cache
if [ -x /workspace/jdk-21/bin/javac ]; then
  export JAVA_HOME=/workspace/jdk-21
  export PATH="$JAVA_HOME/bin:$PATH"
fi
mkdir -p "$ANDROID_USER_HOME/cache" "$GRADLE_USER_HOME"
# Java does not consume HTTPS_PROXY automatically. Keep the inherited proxy route
# and platform CA trust; only hostname/port are copied, never authentication.
if [ -n "${HTTPS_PROXY:-}" ]; then
  ritma_proxy_properties="$(python3 - <<'PY'
import os,urllib.parse
p=urllib.parse.urlparse(os.environ['HTTPS_PROXY'])
if p.hostname:
 print(f'-Dhttps.proxyHost={p.hostname} -Dhttps.proxyPort={p.port or 8080} -Dhttp.proxyHost={p.hostname} -Dhttp.proxyPort={p.port or 8080}')
PY
)"
  export JAVA_TOOL_OPTIONS="${JAVA_TOOL_OPTIONS:-} $ritma_proxy_properties"
  unset ritma_proxy_properties
fi
export JAVA_TOOL_OPTIONS="${JAVA_TOOL_OPTIONS:-} -Duser.home=/workspace/android-home"
if [ -f /etc/ssl/certs/java/cacerts ]; then
  export JAVA_TOOL_OPTIONS="$JAVA_TOOL_OPTIONS -Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts"
fi
