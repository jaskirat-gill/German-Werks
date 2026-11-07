#!/usr/bin/env bash
# Deploy latest master on the droplet. Run as: bash /var/www/germanwerks/deploy.sh
# Skip the slow on-droplet build by shipping a locally built .next first (see CLAUDE.md) and running with SKIP_BUILD=1.
set -euo pipefail
cd /var/www/germanwerks
git pull origin master
pnpm install --frozen-lockfile
if [ "${SKIP_BUILD:-0}" != "1" ]; then
  pnpm run build
fi
pm2 startOrRestart ecosystem.config.cjs --update-env
pm2 save
echo "Deployed $(git log --oneline -1)"
