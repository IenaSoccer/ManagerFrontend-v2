#!/usr/bin/env bash
set -Eeuo pipefail

: "${SSH_HOST:?Missing SSH_HOST secret}"
: "${SSH_USER:?Missing USERNAME secret}"
: "${SSH_KEY:?Missing SSH_PRIVATE_KEY secret}"
: "${SSH_KNOWN_HOSTS:?Missing SSH_KNOWN_HOSTS secret}"
: "${DEPLOY_PATH:?Missing DEPLOY_PATH secret}"

[[ "$SSH_HOST" =~ ^[A-Za-z0-9.-]+$ ]]
[[ "$SSH_PORT" =~ ^[0-9]{1,5}$ ]]
(( 10#$SSH_PORT >= 1 && 10#$SSH_PORT <= 65535 ))
[[ "$SSH_USER" =~ ^[A-Za-z_][A-Za-z0-9_-]*$ ]]
[[ "$DEPLOY_PATH" =~ ^/[A-Za-z0-9._/-]+$ && "$DEPLOY_PATH" != *".."* && "$DEPLOY_PATH" != / ]]
[[ "$RELEASE_ID" =~ ^[0-9a-f]{40}-[0-9]+$ ]]

ssh_dir="$(mktemp -d "$RUNNER_TEMP/ssh-deploy.XXXXXX")"
cleanup() {
  rm -f -- "$ssh_dir/deploy_key" "$ssh_dir/known_hosts" "$ssh_dir/config"
  rmdir -- "$ssh_dir"
}
trap cleanup EXIT
umask 077

printf '%s\n' "$SSH_KEY" | tr -d '\r' > "$ssh_dir/deploy_key"
printf '%s\n' "$SSH_KNOWN_HOSTS" | tr -d '\r' |
  awk '$1 !~ /^#/ && NF >= 3 && $2 ~ /^(ssh-|ecdsa-|sk-)/ {
    print "ienavps-manager", $2, $3
  }' > "$ssh_dir/known_hosts"
unset SSH_KEY SSH_KNOWN_HOSTS

ssh-keygen -y -P '' -f "$ssh_dir/deploy_key" >/dev/null
ssh-keygen -F ienavps-manager -f "$ssh_dir/known_hosts" >/dev/null

cat > "$ssh_dir/config" <<SSH_CONFIG
Host ienavps-manager
  HostName $SSH_HOST
  Port $SSH_PORT
  User $SSH_USER
  IdentityFile "$ssh_dir/deploy_key"
  UserKnownHostsFile "$ssh_dir/known_hosts"
  HostKeyAlias ienavps-manager
  IdentitiesOnly yes
  BatchMode yes
  StrictHostKeyChecking yes
  ConnectTimeout 15
  LogLevel ERROR
SSH_CONFIG

archive="$RUNNER_TEMP/release.tgz"
checksum="$(sha256sum "$archive" | awk '{print $1}')"
ssh -F "$ssh_dir/config" ienavps-manager \
  "mkdir -p -- '$DEPLOY_PATH/incoming' '$DEPLOY_PATH/releases'"
scp -F "$ssh_dir/config" "$archive" \
  "ienavps-manager:$DEPLOY_PATH/incoming/$RELEASE_ID.tgz"
ssh -F "$ssh_dir/config" ienavps-manager bash -s -- \
  "$DEPLOY_PATH" "$RELEASE_ID" "$checksum" < deploy/activate-release.sh
