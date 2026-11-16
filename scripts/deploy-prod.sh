#!/usr/bin/env bash
set -euo pipefail
HOST=root@129.212.166.116
cd "$(dirname "$0")/.."

git fetch -q origin
[ "$(git rev-parse --abbrev-ref HEAD)" = "master" ] || { echo "Deploy from master only."; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "Commit or stash your changes first."; exit 1; }
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/master)" ] || { echo "Local master differs from origin/master: push or pull first."; exit 1; }

PAYLOAD_PUBLIC_SERVER_URL=https://germanwerks.ca pnpm build
rsync -az --delete --exclude cache .next/ "$HOST:/var/www/germanwerks/.next/"
ssh "$HOST" 'SKIP_BUILD=1 bash /var/www/germanwerks/deploy.sh'
curl -fsS -o /dev/null -w "germanwerks.ca %{http_code}\n" https://germanwerks.ca/
