#!/bin/bash
# logs.sh - View web service logs

docker compose -f compose.yml -f compose.production.yml logs -f web
