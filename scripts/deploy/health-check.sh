#!/bin/bash
# health-check.sh - Check if the web service is healthy

echo "Checking health of slovor-mp-web..."
HEALTH=$(docker inspect --format='{{json .State.Health.Status}}' slovor-mp-web)

if [ "$HEALTH" == "\"healthy\"" ]; then
  echo "✅ Service is healthy!"
else
  echo "❌ Service health is: $HEALTH"
  exit 1
fi
