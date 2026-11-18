#!/usr/bin/env bash
set -Eeuo pipefail

deploy_path="$1"
release_id="$2"
checksum="$3"

[[ "$deploy_path" =~ ^/[A-Za-z0-9._/-]+$ && "$deploy_path" != *".."* && "$deploy_path" != / ]]
[[ "$release_id" =~ ^[0-9a-f]{40}-[0-9]+$ ]]

archive="$deploy_path/incoming/$release_id.tgz"
releases="$deploy_path/releases"
release="$releases/$release_id"
current="$deploy_path/release"
previous="$deploy_path/previous"

test -f "$archive"
test "$(sha256sum "$archive" | awk '{print $1}')" = "$checksum"
test ! -e "$release"
mkdir -- "$release"
tar -xzf "$archive" -C "$release"
rm -f -- "$archive"
test -f "$release/dist/spa/index.html"
test -f "$release/dist/spa/deployment.json"

if [[ -L "$current" ]]; then
  old="$(readlink -f "$current")"
  test -d "$old"
  ln -sfn "$old" "$previous"
elif [[ -d "$current" ]]; then
  legacy="$releases/legacy-$(date -u +%Y%m%dT%H%M%SZ)"
  mv -- "$current" "$legacy"
  ln -sfn "$legacy" "$previous"
elif [[ -e "$current" ]]; then
  exit 1
fi

next="$deploy_path/.release-$release_id"
rm -f -- "$next"
ln -s "$release" "$next"
mv -Tf -- "$next" "$current"

current_target="$(readlink -f "$current")"
previous_target="$(readlink -f "$previous" 2>/dev/null || true)"
find "$releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' |
  sort -rn | tail -n +6 | cut -d' ' -f2- |
  while IFS= read -r stale; do
    stale="$(readlink -f "$stale")"
    test "$stale" = "$current_target" || test "$stale" = "$previous_target" || rm -rf -- "$stale"
  done || true
