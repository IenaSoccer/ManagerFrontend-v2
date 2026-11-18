#!/usr/bin/env bash
set -Eeuo pipefail

npm run build
test -f dist/spa/index.html
printf '{"commit":"%s","run_id":"%s"}\n' "$GITHUB_SHA" "$GITHUB_RUN_ID" \
  > dist/spa/deployment.json
tar -czf "$RUNNER_TEMP/release.tgz" dist/spa
