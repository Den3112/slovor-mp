#!/bin/bash
# update.sh - Update the services with zero downtime (if possible with current config)

docker compose -f compose.yml -f compose.production.yml pull
docker compose -f compose.yml -f compose.production.yml up -d --remove-orphans
