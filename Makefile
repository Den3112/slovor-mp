# Slovor Marketplace - Multi-Command Management Tool
# "The Joker" Build System

.PHONY: help build up down restart logs audit audit-quick fix lint verify shell clean

help:
	@echo "Slovor Marketplace - Management Commands"
	@echo "----------------------------------------"
	@echo "build        - Build Docker containers"
	@echo "up           - Start Docker containers"
	@echo "down         - Stop Docker containers"
	@echo "restart      - Restart Docker containers"
	@echo "logs         - Show Docker logs"
	@echo "audit        - Run full technical audit (squirrelscan)"
	@echo "audit-quick  - Run quick audit"
	@echo "fix          - Auto-format and fix linting"
	@echo "verify       - Run full verification (lint + tests + build)"
	@echo "shell        - Open shell in app container"
	@echo "clean        - Remove .next and node_modules"

build:
	docker compose -f docker/compose.yml build

up:
	docker compose -f docker/compose.yml up -d

down:
	docker compose -f docker/compose.yml down

restart:
	docker compose -f docker/compose.yml restart

logs:
	docker compose -f docker/compose.yml logs -f

audit:
	docker compose -f docker/compose.yml run --rm app npm run audit:full

audit-quick:
	docker compose -f docker/compose.yml run --rm app npm run audit:quick

lint:
	docker compose -f docker/compose.yml run --rm verify npm run lint

test:
	docker compose -f docker/compose.yml run --rm verify npm run test

verify:
	docker compose -f docker/compose.yml run --rm verify npm run verify

joker: build verify

shell:
	docker compose -f docker/compose.yml exec app sh

clean:
	docker compose -f docker/compose.yml run --rm app npm run clean
	rm -rf .next node_modules
