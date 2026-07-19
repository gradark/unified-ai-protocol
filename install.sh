#!/usr/bin/env sh
# unified-ai-protocol installer (macOS/Linux wrapper).
# Usage: ./install.sh [--uninstall]
exec node "$(dirname "$0")/scripts/install.js" "$@"
