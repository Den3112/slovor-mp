#!/bin/bash

# ===========================================
# Docker Management Script for Slovor MP
# ===========================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Slovor Marketplace Docker Manager${NC}"

case "$1" in
  "dev")
    echo -e "${GREEN}Starting Development environment...${NC}"
    docker-compose --profile dev up --build
    ;;
  "prod")
    echo -e "${GREEN}Starting Production environment...${NC}"
    docker-compose up --build -d
    ;;
  "verify")
    echo -e "${GREEN}Running Verification (Lint, Types, Build)...${NC}"
    docker-compose --profile verify run --rm verify
    ;;
  "seed")
    echo -e "${GREEN}Seeding Database...${NC}"
    docker-compose --profile dev run --rm dev npm run db:reset
    ;;
  "shell")
    echo -e "${GREEN}Opening shell in dev container...${NC}"
    docker-compose --profile dev run --rm dev sh
    ;;
  "stop")
    echo -e "${GREEN}Stopping all containers...${NC}"
    docker-compose --profile dev --profile verify down
    ;;
  "clean")
    echo -e "${GREEN}Cleaning up Docker volumes and images...${NC}"
    docker-compose down -v --rmi local
    docker system prune -f
    ;;
  *)
    echo "Usage: ./scripts/docker.sh {dev|prod|verify|stop|clean}"
    exit 1
    ;;
esac
