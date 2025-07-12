#!/bin/sh

set -euo pipefail

echo "Starting entrypoint script..."
echo "Substituting environment variables in index.html.template..."
envsubst < /index.html.template > /usr/share/nginx/html/index.html

exec "$@"
