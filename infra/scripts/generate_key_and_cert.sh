#!/bin/bash
set -euo pipefail

DIR=$(dirname "$(realpath $0)")

DOMAIN="fridge.localhost"
KEY_FILE="$DIR/../nginx/${DOMAIN}.key"
CERT_FILE="$DIR/../nginx/${DOMAIN}.crt"
DAYS_VALID=365

echo "Generating TLS certificate for $DOMAIN..."

# Generate private key
openssl genrsa -out "$KEY_FILE" 2048

# Generate certificate signing request (CSR)
openssl req -new -key "$KEY_FILE" -out "${DOMAIN}.csr" \
  -subj "/CN=${DOMAIN}"

# Create a config file for the extensions
cat > "${DOMAIN}.ext" <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${DOMAIN}
EOF

# Generate self-signed certificate
openssl x509 -req -in "${DOMAIN}.csr" -signkey "$KEY_FILE" -out "$CERT_FILE" \
  -days "$DAYS_VALID" -extfile "${DOMAIN}.ext"

# Clean up
rm "${DOMAIN}.csr" "${DOMAIN}.ext"

echo "✔ Certificate generated:"
echo "  - $CERT_FILE"
echo "  - $KEY_FILE"

# Generate public/private key pair for JWT
JWT_PRIVATE_KEY_FILE="$DIR/../fridge/private.pem"
JWT_PUBLIC_KEY_FILE="$DIR/../fridge/public.pem"

openssl genpkey -algorithm RSA -out "$JWT_PRIVATE_KEY_FILE" -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in "$JWT_PRIVATE_KEY_FILE" -out "$JWT_PUBLIC_KEY_FILE"

echo "✔ JWT public/private key pair generated:"
echo "  - $JWT_PRIVATE_KEY_FILE"
echo "  - $JWT_PUBLIC_KEY_FILE"
