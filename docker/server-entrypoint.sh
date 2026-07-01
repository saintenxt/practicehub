#!/bin/sh
set -e

ensure_json_file() {
  file="$1"

  if [ ! -e "$file" ] || [ ! -s "$file" ]; then
    printf '[]\n' > "$file"
  fi

  chown node:node "$file"
  chmod 664 "$file"
}

mkdir -p /app/server/uploads

ensure_json_file /app/server/userdata.json
ensure_json_file /app/server/matches.json
ensure_json_file /app/server/messagedata.json

chown -R node:node /app/server/uploads
chmod -R u+rwX,g+rwX /app/server/uploads

exec su-exec node "$@"
