#!/usr/bin/env bash
set -euo pipefail

APP_NAME="shinhai"
APP_DIR="/var/www/shinhai"
PNPM_VERSION="${PNPM_VERSION:-10.18.3}"

cd "$APP_DIR"

corepack enable
corepack prepare "pnpm@${PNPM_VERSION}" --activate

pnpm install --frozen-lockfile
pnpm build

if pm2 describe "$APP_NAME" > /dev/null; then
  pm2 reload "$APP_NAME" --update-env
else
  pm2 start ecosystem.config.cjs --only "$APP_NAME"
fi

pm2 save
