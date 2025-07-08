#!/bin/bash
set -euo pipefail

DIR=$(dirname $(realpath "$0"))
ROOT_DIR=$(realpath "$DIR/../..")

npx openapi-typescript $ROOT_DIR/api-specification/openapi_users.json -o $ROOT_DIR/client/src/api/users.ts
npx openapi-typescript $ROOT_DIR/api-specification/openapi_recipes.json -o $ROOT_DIR/client/src/api/recipes.ts
