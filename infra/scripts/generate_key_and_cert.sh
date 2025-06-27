#!/bin/bash
set -euo pipefail

DOMAIN="example.localhost"
KEY_FILE="${DOMAIN}.key"
CERT_FILE="${DOMAIN}.crt"
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
