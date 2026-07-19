#!/usr/bin/env bash
set -eu

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
nvm use 22

SRC="/mnt/c/Users/nasa/Documents/orammedia"
DEST="$HOME/orammedia-staging-build"

echo "WSL_PATH=$DEST"
echo "NODE=$(node -v)"

rsync -a \
  --exclude node_modules \
  --exclude .next \
  --exclude .open-next \
  --exclude .git \
  --exclude 'prisma/*.db*' \
  --exclude '*.db' \
  --exclude '*.db-journal' \
  --exclude exports/lighthouse \
  "$SRC/" "$DEST/"

cd "$DEST"
grep -n "CONTACT_EMAIL_MODE" wrangler.jsonc

if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  echo "INSTALL=npm ci"
  npm ci
else
  echo "INSTALL=skip"
fi

echo "BUILD_START"
npm run cf:build
echo "BUILD_DONE"

echo "DEPLOY_START"
npx wrangler deploy --env staging
echo "DEPLOY_DONE"
