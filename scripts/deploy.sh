#!/usr/bin/env bash
set -euo pipefail

APP_NAME="shinhai"
APP_DIR="/var/www/shinhai"
PNPM_VERSION="${PNPM_VERSION:-10.18.3}"
LOCK_FILE="/tmp/shinhai-deploy.lock"

cd "$APP_DIR"
exec 9>"$LOCK_FILE"
flock -w 600 9

corepack enable
corepack prepare "pnpm@${PNPM_VERSION}" --activate

pnpm install --frozen-lockfile
pnpm build

pm2 delete "$APP_NAME" > /dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --only "$APP_NAME"

pm2 save
