#!/usr/bin/env bash
# Compile le site pour GitHub Pages et le publie sur la branche gh-pages.
# Usage : ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

BASE_PATH=/lavage-des-fontaines \
SITE_URL=https://arthurcapridigitalisation-oss.github.io \
  ./node_modules/.bin/astro build

touch dist/.nojekyll  # sinon GitHub ignore le dossier _astro

remote=$(git remote get-url origin)
tmp=$(mktemp -d)
cp -R dist/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Déploiement $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$remote" gh-pages
echo "Publié : https://arthurcapridigitalisation-oss.github.io/lavage-des-fontaines/"
