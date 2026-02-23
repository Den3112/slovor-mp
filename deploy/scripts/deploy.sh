#!/bin/bash
# deploy.sh - Deploy the Slovor Marketplace in production mode

# Build and start services
docker compose -f compose.yml -f compose.production.yml up --build -d

# Check health
./deploy/scripts/health-check.sh
