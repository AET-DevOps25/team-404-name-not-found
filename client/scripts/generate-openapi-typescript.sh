#!/bin/bash
set -euo pipefail

DIR=$(dirname $(realpath "$0"))
ROOT_DIR=$(realpath "$DIR/../..")

SERVICES="users recipes images ingredients"

# create for loop: for service in [users, recipes, images, ingredients]
for service in $SERVICES; do
    echo "Generating OpenApi Typescript for service $service"
    npx openapi-typescript "$ROOT_DIR/server/$service/openapi.json" -o "$ROOT_DIR/client/src/api/$service.ts"
done

