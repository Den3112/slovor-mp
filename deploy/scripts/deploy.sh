#!/bin/bash
# deploy.sh - Deploy the Slovor Marketplace in production mode

# Pre-flight checks
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    exit 1
fi

# Required variables
REQUIRED_VARS=("DATABASE_URL" "NEXT_PUBLIC_SUPABASE_URL" "ADMIN_EMAILS")
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" .env; then
        echo "Error: $var is missing in .env"
        exit 1
    fi
done

# Build and start services
docker compose -f compose.yml -f compose.production.yml up --build -d

# Check health
./deploy/scripts/health-check.sh
