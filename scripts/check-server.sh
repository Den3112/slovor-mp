#!/bin/bash

# Port to check
PORT=3000
MAX_RETRIES=30
RETRY_INTERVAL=2

echo "Checking if server is running on localhost:$PORT..."

for ((i=1; i<=MAX_RETRIES; i++))
do
  if curl -s -f "http://localhost:$PORT/en/auth/login" > /dev/null; then
    echo "Server is UP and reachable!"
    exit 0
  fi

  echo "Retry $i/$MAX_RETRIES: Server not ready yet, waiting ${RETRY_INTERVAL}s..."
  sleep $RETRY_INTERVAL
done

echo "Error: Server failed to start on localhost:$PORT after $((MAX_RETRIES * RETRY_INTERVAL))s"
exit 1
