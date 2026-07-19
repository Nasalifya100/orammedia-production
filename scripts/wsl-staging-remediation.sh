#!/usr/bin/env bash
# Staging remediation: D1 public-placeholder cleanup + cf:build:staging + deploy.
# Run interactively in Ubuntu WSL. Does not deploy production.
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
nvm use 22

ROOT="$HOME/orammedia-staging-build"
cd "$ROOT"

echo "=== Bundle preflight (will rebuild) ==="
echo "PWD=$(pwd)"
node -v

echo
echo "Enter Cloudflare API token (hidden; session-only). Do not paste into Cursor."
read -r -s -p "Cloudflare API token: " CLOUDFLARE_API_TOKEN
echo
export CLOUDFLARE_API_TOKEN

echo "=== whoami ==="
npx wrangler whoami

echo "=== D1 inspect + remediate public placeholders ==="
npx wrangler d1 execute orammedia-staging --remote --env staging \
  --file=scripts/staging-d1-public-placeholder-remediation.sql

echo "=== Build staging (bakes staging site URL) ==="
npm run cf:build:staging

echo "=== Deploy staging only ==="
npx wrangler deploy --env staging

echo
echo "DEPLOY DONE. Record Version ID from output above."
echo "Close this WSL terminal when finished so the token leaves memory."
unset CLOUDFLARE_API_TOKEN
