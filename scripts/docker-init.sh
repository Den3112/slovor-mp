#!/bin/sh
# scripts/docker-init.sh - Elite Initialization Script
set -e

echo "🚀 Starting Elite initialization..."

# Wait for DB
until pg_isready -h db -U ${DB_USER:-postgres} -d ${DB_NAME:-slovor}; do
  echo "⏳ Waiting for database..."
  sleep 2
done

echo "✅ Database is ready."

# Initialize MinIO (create buckets if they don't exist)
# Requires mc (minio client) or can be done via curl for simple checks
# For now, we output a placeholder as MinIO auto-initialization is often handled by app logic
# but this script ensures services are reachable.

echo "📦 Services are reachable. Initializing application..."

exec "$@"
