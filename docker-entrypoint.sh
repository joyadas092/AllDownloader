#!/bin/sh
#
# Starts the PO token provider alongside the web app.
#
# YouTube will not serve its DASH (video-only) formats without a proof-of-origin
# token. Without a provider running, extraction still succeeds and progressive
# formats still download, but every DASH quality dies partway through with
# "HTTP Error 403: Forbidden" -- which reads like a broken link rather than a
# missing token, so it is worth being loud when this fails.
#
# The provider listens on 127.0.0.1:4416, which is where the yt-dlp plugin looks
# by default. It is bound to loopback and never exposed outside the container.

set -u

POT_LOG=/tmp/pot-provider.log

if [ -f /opt/pot/build/main.js ]; then
  node /opt/pot/build/main.js --port 4416 >"$POT_LOG" 2>&1 &

  # yt-dlp queries the provider on the first download, so a slow start would
  # surface as a mysterious one-off 403. Wait briefly for it to answer.
  i=0
  while [ "$i" -lt 30 ]; do
    if curl -sf -o /dev/null "http://127.0.0.1:4416/ping"; then
      echo "[pot] provider ready on 127.0.0.1:4416"
      break
    fi
    i=$((i + 1))
    sleep 1
  done

  if [ "$i" -ge 30 ]; then
    echo "[pot] WARNING: provider did not become ready in 30s; YouTube DASH downloads will 403"
    tail -n 20 "$POT_LOG" 2>/dev/null || true
  fi
else
  echo "[pot] WARNING: provider not present in image; YouTube DASH downloads will 403"
fi

# The app is the container's reason to exist: hand it PID 1 so signals and exit
# codes belong to it, not to this script. A dead provider degrades YouTube but
# must never take the site down.
exec npm start
