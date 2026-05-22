#!/bin/sh
# This script ensures that the necessary instance plugin file exists.
# If it doesn't, it creates a default one.

set -e

PLUGIN_FILE="instance/plugin.ts"

if [ -f "$PLUGIN_FILE" ]; then
	exit 0
fi

mkdir -p "$(dirname "$PLUGIN_FILE")"

cat > "$PLUGIN_FILE" <<'EOF'
export default function createPlugin() {
  return () => {};
}
EOF
