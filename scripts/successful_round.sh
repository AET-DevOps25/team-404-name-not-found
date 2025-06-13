#!/bin/bash

set -e

log() { echo -e "\033[0;32m$1\033[0m"; }
err() { echo -e "\033[0;31m$1\033[0m" >&2; }

check_status() {
  if [[ "$1" -ne 200 && "$1" -ne 201 ]]; then
    err "❌ Request failed with status code $1. Exiting."
    exit "$1"
  fi
}

PROTOCOL="${PROTOCOL:-http}"
PORT="${PORT:-8080}"

if [[ "$PROTOCOL" != "http" && "$PROTOCOL" != "https" ]]; then
  err "❌ Invalid protocol: $PROTOCOL. Must be 'http' or 'https'."
  exit 1
fi

if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
  err "❌ Invalid port: $PORT. Must be numeric."
  exit 1
fi

# Set base URL and curl options
if [[ "$PROTOCOL" == "https" ]]; then
  BASE_URL="https://fridge.localhost:$PORT"
  CURL_RESOLVE="--resolve fridge.localhost:$PORT:127.0.0.1"
else
  BASE_URL="http://localhost:$PORT"
  CURL_RESOLVE=""
fi

# ------------------ BEGIN REQUESTS ------------------

log "Registering user..."
STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/users/register" \
  $CURL_RESOLVE -H "Content-Type: application/json" \
  -d '{"name": "alice", "email": "alice@b.c", "password": "password1234", "role": "USER"}')
check_status "$STATUS"

log "\nLogging in and extracting token..."
LOGIN_RESPONSE=$(curl -k -s -w "\n%{http_code}" -X POST "$BASE_URL/api/users/login" \
  $CURL_RESOLVE -H "Content-Type: application/json" \
  -d '{"email": "alice@b.c", "password": "password1234"}')

AUTH_TOKEN=$(echo "$LOGIN_RESPONSE" | head -n1 | jq -r .token)
STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
check_status "$STATUS"

if [[ -z "$AUTH_TOKEN" || "$AUTH_TOKEN" == "null" ]]; then
  err "❌ Failed to retrieve token. Exiting."
  exit 1
fi
log "✅ Token retrieved successfully."

log "\nGenerating recipe with AI..."
AI_RESPONSE=$(curl -k -s -w "\n%{http_code}" -X POST "$BASE_URL/api/recipes/ai" \
  $CURL_RESOLVE -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '["tomatoes", "beef", "pasta"]')

AI_BODY=$(echo "$AI_RESPONSE" | head -n1)
STATUS=$(echo "$AI_RESPONSE" | tail -n1)
check_status "$STATUS"

log "\nGetting current user info..."
WHOAMI_RESPONSE=$(curl -k -s -w "\n%{http_code}" -X GET "$BASE_URL/api/users/whoami" \
  $CURL_RESOLVE -H "Authorization: Bearer $AUTH_TOKEN")

USER_ID=$(echo "$WHOAMI_RESPONSE" | head -n1)
STATUS=$(echo "$WHOAMI_RESPONSE" | tail -n1)
check_status "$STATUS"

if [[ -z "$USER_ID" || "$USER_ID" == "null" ]]; then
  err "❌ Failed to retrieve user ID. Exiting."
  exit 1
fi
log "👤 User ID: $USER_ID"

log "\nSaving recipe..."
MODIFIED_RECIPE=$(echo "$AI_BODY" | jq --arg userId "$USER_ID" '. + {userId: $userId}')
STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/recipes/" \
  $CURL_RESOLVE -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d "$MODIFIED_RECIPE")
check_status "$STATUS"

log "\nGetting all recipes for the user..."
RECIPES_RESPONSE=$(curl -k -s -w "\n%{http_code}" -X GET "$BASE_URL/api/recipes/" \
  $CURL_RESOLVE -H "Authorization: Bearer $AUTH_TOKEN")

RECIPES_BODY=$(echo "$RECIPES_RESPONSE" | head -n1)
STATUS=$(echo "$RECIPES_RESPONSE" | tail -n1)
check_status "$STATUS"

RECIPE_ID=$(echo "$RECIPES_BODY" | jq -r '.[-1].id')
if [[ -z "$RECIPE_ID" || "$RECIPE_ID" == "null" ]]; then
  err "❌ Failed to extract recipe ID. Exiting."
  exit 1
fi
log "🥘 Latest recipe ID: $RECIPE_ID"

log "\nGetting recipe by ID..."
STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/recipes/$RECIPE_ID" \
  $CURL_RESOLVE -H "Authorization: Bearer $AUTH_TOKEN")
check_status "$STATUS"

log "\n✅ All requests completed successfully."
