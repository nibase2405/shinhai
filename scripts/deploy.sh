#!/usr/bin/env bash
set -euo pipefail

APP_NAME="shinhai"
APP_DIR="/var/www/shinhai"
PNPM_VERSION="${PNPM_VERSION:-10.18.3}"
LOCK_FILE="/tmp/shinhai-deploy.lock"
NEXT_BUILD_LOCK="$APP_DIR/.next/lock"
NEXT_BUILD_LOCK_WAIT_SECONDS="${NEXT_BUILD_LOCK_WAIT_SECONDS:-1200}"
NEXT_BUILD_RETRY_SECONDS="${NEXT_BUILD_RETRY_SECONDS:-15}"
NEXT_BUILD_RETRY_LIMIT="${NEXT_BUILD_RETRY_LIMIT:-3}"

cd "$APP_DIR"
exec 9>"$LOCK_FILE"
flock -w 600 9

wait_for_next_build_lock() {
  mkdir -p "$APP_DIR/.next"

  local waited=0
  while ! flock -n "$NEXT_BUILD_LOCK" true; do
    if [ "$waited" -ge "$NEXT_BUILD_LOCK_WAIT_SECONDS" ]; then
      echo "Timed out waiting for Next.js build lock at $NEXT_BUILD_LOCK" >&2
      return 1
    fi

    echo "Waiting for existing Next.js build lock..."
    sleep 10
    waited=$((waited + 10))
  done
}

run_next_build() {
  local attempt=1
  local build_log="/tmp/shinhai-next-build.log"

  while true; do
    wait_for_next_build_lock

    if pnpm build 2>&1 | tee "$build_log"; then
      return 0
    fi

    if ! grep -q "Another next build process is already running" "$build_log"; then
      return 1
    fi

    if [ "$attempt" -ge "$NEXT_BUILD_RETRY_LIMIT" ]; then
      return 1
    fi

    echo "Next.js build lock was still active; retrying in ${NEXT_BUILD_RETRY_SECONDS}s..."
    sleep "$NEXT_BUILD_RETRY_SECONDS"
    attempt=$((attempt + 1))
  done
}

corepack enable
corepack prepare "pnpm@${PNPM_VERSION}" --activate

pnpm install --frozen-lockfile
run_next_build

pm2 delete "$APP_NAME" > /dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --only "$APP_NAME"

pm2 save
echo "Deploy finished for $(git rev-parse --short HEAD)"
