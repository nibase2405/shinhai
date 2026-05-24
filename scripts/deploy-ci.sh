#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/shinhai"
LOG_FILE="/var/log/shinhai-deploy.log"
LOCK_FILE="/tmp/shinhai-deploy.lock"

cd "$APP_DIR"
exec 9>"$LOCK_FILE"
flock -w 600 9

rm -f "$LOG_FILE"

(
  set -euo pipefail
  bash scripts/deploy.sh
) > "$LOG_FILE" 2>&1 &

deploy_pid=$!

set +e
wait "$deploy_pid"
status=$?
set -e

if [ "$status" -eq 0 ]; then
  tail -n 120 "$LOG_FILE"
  exit 0
fi

tail -n 160 "$LOG_FILE" >&2 || true
exit "$status"
