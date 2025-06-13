#!/bin/bash

log() {
  echo -e "\033[0;32m$1\033[0m" # Green
}

err() {
  echo -e "\033[0;31m$1\033[0m" # Red
}

check_status() {
  if [[ "$1" -ne 200 && "$1" -ne 201 ]]; then
    err "❌ Request failed with status code $1. Exiting."
    exit $1
  fi
}

# Register
log "Registering user..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name": "alice", "email": "alice@b.c", "password": "password1234", "role": "USER"}')
check_status "$STATUS"

# Login and extract token
log "\nLogging in and extracting token..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@b.c", "password": "password1234"}')

AUTH_TOKEN=$(echo "$LOGIN_RESPONSE" | head -n1 | jq -r .token)
STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
check_status "$STATUS"

if [[ -z "$AUTH_TOKEN" || "$AUTH_TOKEN" == "null" ]]; then
  err "❌ Failed to retrieve token. Exiting."
  exit 1
fi
log "✅ Token retrieved successfully."

# Generate recipe with AI
log "\nGenerating recipe with AI..."
AI_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8080/api/recipes/ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '["tomatoes", "beef", "pasta"]')

AI_BODY=$(echo "$AI_RESPONSE" | head -n1)
STATUS=$(echo "$AI_RESPONSE" | tail -n1)
check_status "$STATUS"

# WhoAmI to get user ID
log "\nGetting current user info..."
WHOAMI_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET http://localhost:8080/api/users/whoami \
  -H "Authorization: Bearer $AUTH_TOKEN")

USER_ID=$(echo "$WHOAMI_RESPONSE" | head -n1)
STATUS=$(echo "$WHOAMI_RESPONSE" | tail -n1)
check_status "$STATUS"

if [[ -z "$USER_ID" || "$USER_ID" == "null" ]]; then
  err "❌ Failed to retrieve user ID. Exiting."
  exit 1
fi
log "👤 User ID: $USER_ID"

# Save Recipe using AI response + user ID
log "\nSaving recipe..."
MODIFIED_RECIPE=$(echo "$AI_BODY" | jq --arg userId "$USER_ID" '. + {userId: $userId}')
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/recipes/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d "$MODIFIED_RECIPE")
check_status "$STATUS"

# Get Recipes for User and extract latest recipe ID
log "\nGetting all recipes for the user..."
RECIPES_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET http://localhost:8080/api/recipes/ \
  -H "Authorization: Bearer $AUTH_TOKEN")

RECIPES_BODY=$(echo "$RECIPES_RESPONSE" | head -n1)
STATUS=$(echo "$RECIPES_RESPONSE" | tail -n1)
check_status "$STATUS"

RECIPE_ID=$(echo "$RECIPES_BODY" | jq -r '.[-1].id')
if [[ -z "$RECIPE_ID" || "$RECIPE_ID" == "null" ]]; then
  err "❌ Failed to extract recipe ID. Exiting."
  exit 1
fi
log "🥘 Latest recipe ID: $RECIPE_ID"

# Get Recipe by ID
log "\nGetting recipe by ID..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8080/api/recipes/$RECIPE_ID \
  -H "Authorization: Bearer $AUTH_TOKEN")
check_status "$STATUS"

log "\n✅ All requests completed successfully."
