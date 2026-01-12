#!/bin/bash
# ===========================================
# Slovor Marketplace - Quick Setup Script
# Run this script after git clone
# ===========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║     Slovor Marketplace - Quick Setup      ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

cd "$PROJECT_ROOT"

# Step 1: Check for .env.local
echo -e "${YELLOW}[1/3]${NC} Checking environment configuration..."

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local already exists"
else
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✓${NC} Created .env.local from .env.example"
    else
        echo -e "${RED}✗${NC} Error: .env.example not found!"
        exit 1
    fi
fi

# Step 2: Check Docker
echo -e "${YELLOW}[2/3]${NC} Checking Docker installation..."

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker is installed"
else
    echo -e "${RED}✗${NC} Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose is available"
else
    echo -e "${RED}✗${NC} Docker Compose is not available"
    exit 1
fi

# Step 3: Display next steps
echo -e "${YELLOW}[3/3]${NC} Setup complete!"
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Ready to launch! 🚀             ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo ""
echo -e "  ${BLUE}Production:${NC}"
echo "    docker-compose up -d --build"
echo ""
echo -e "  ${BLUE}Development (with hot-reload):${NC}"
echo "    docker-compose --profile dev up dev"
echo ""
echo -e "  ${BLUE}View logs:${NC}"
echo "    docker-compose logs -f"
echo ""
echo -e "  ${BLUE}Health check:${NC}"
echo "    curl http://localhost:3000/api/health"
echo ""
