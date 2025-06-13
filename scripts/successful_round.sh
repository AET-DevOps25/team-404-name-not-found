#!/bin/bash

set -e

# --- Logging helpers ---
log() {
  echo -e "\033[0;32m$1\033[0m"
}

err() {
  echo -e "\033[0;31m$1\033[0m" >&2
}

check_status() {
  if [[ "$1" -ne 200 && "$1" -ne 201 ]]; then
    err "❌ Request failed with status code $1. Exiting."
    exit "$1"
  fi
}

# --- Configurable protocol and port ---
PROTOCOL="${PROTOCOL:-http}"
PORT="${PORT:-8080}"

# Validate protocol
if [[ "$PROTOCOL" != "http" && "$PROTOCOL" != "https" ]]; then
  err "❌ Invalid protocol: $PROTOCOL. Must be 'http' or 'https'."
  exit 1
fi

# Validate port
if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
  err "❌ Invalid port: $PORT. Must be a number."
  exit 1
fi

BASE_URL="$PROTOCOL://localhost:$PORT"
EXTRA_HEADER=""
[[ "$PROTOCOL" == "https" ]] && EXTRA_HEADER="-H \"Host: fridge.localhost\""

# --- Register user ---
log "Registering user..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/users/register" \
  -H "Content-Type: application/json" $EXTRA_HEADER \
  -d '{"name": "alice", "email": "alice@b.c", "password": "password1234", "role": "USER"}')
check_status "$STATUS"

# --- Login and extract token ---
log "\nLogging in and extracting token..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/users/login" \
  -H "Content-Type: application/json" $EXTRA_HEADER \
  -d '{"email": "alice@b.c", "password": "password1234"}')

AUTH_TOKEN=$(echo "$LOGIN_RESPONSE" | head -n1 | jq -r .token)
STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
check_status "$STATUS"

if [[ -z "$AUTH_TOKEN" || "$AUTH_TOKEN" == "null" ]]; then
  err "❌ Failed to retrieve token. Exiting."
  exit 1
fi
log "✅ Token retrieved successfully."

# --- Generate recipe with AI ---
log "\nGenerating recipe with AI..."
AI_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/recipes/ai" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" $EXTRA_HEADER \
  -d '["tomatoes", "beef", "pasta"]')

AI_BODY=$(echo "$AI_RESPONSE" | head -n1)
STATUS=$(echo "$AI_RESPONSE" | tail -n1)
check_status "$STATUS"

# --- Get user ID ---
log "\nGetting current user info..."
WHOAMI_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/users/whoami" \
  -H "Authorization: Bearer $AUTH_TOKEN" $EXTRA_HEADER)

USER_ID=$(echo "$WHOAMI_RESPONSE" | head -n1)
STATUS=$(echo "$WHOAMI_RESPONSE" | tail -n1)
check_status "$STATUS"

if [[ -z "$USER_ID" || "$USER_ID" == "null" ]]; then
  err "❌ Failed to retrieve user ID. Exiting."
  exit 1
fi
log "👤 User ID: $USER_ID"

# --- Save recipe ---
log "\nSaving recipe..."
MODIFIED_RECIPE=$(echo "$AI_BODY" | jq --arg userId "$USER_ID" '. + {userId: $userId}')
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/recipes/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" $EXTRA_HEADER \
  -d "$MODIFIED_RECIPE")
check_status "$STATUS"

# --- Get all recipes ---
log "\nGetting all recipes for the user..."
RECIPES_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/recipes/" \
  -H "Authorization: Bearer $AUTH_TOKEN" $EXTRA_HEADER)

RECIPES_BODY=$(echo "$RECIPES_RESPONSE" | head -n1)
STATUS=$(echo "$RECIPES_RESPONSE" | tail -n1)
check_status "$STATUS"

RECIPE_ID=$(echo "$RECIPES_BODY" | jq -r '.[-1].id')
if [[ -z "$RECIPE_ID" || "$RECIPE_ID" == "null" ]]; then
  err "❌ Failed to extract recipe ID. Exiting."
  exit 1
fi
log "🥘 Latest recipe ID: $RECIPE_ID"

# --- Get recipe by ID ---
log "\nGetting recipe by ID..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/recipes/$RECIPE_ID" \
  -H "Authorization: Bearer $AUTH_TOKEN" $EXTRA_HEADER)
check_status "$STATUS"

log "\n✅ All requests completed successfully."
