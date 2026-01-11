# Docker Setup Guide

This document describes how to run Slovor Marketplace using Docker.

## Quick Start

### Production

```bash
# Build and run
docker-compose --env-file .env.local up --build

# Run in background
docker-compose --env-file .env.local up -d --build

# Stop
docker-compose down
```

### Development (with hot-reload)

```bash
docker-compose --profile dev up dev
```

## Files Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage production build |
| `Dockerfile.dev` | Development with hot-reload |
| `docker-compose.yml` | Container orchestration |
| `.dockerignore` | Build context optimization |

## Configuration

### Environment Variables

Create `.env.local` with required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Health Check

The container exposes a health endpoint:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-11T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

## Docker Features

- **Multi-stage build**: Minimal production image (~150MB)
- **Node 20 Alpine**: Lightweight base image
- **Non-root user**: Runs as `nextjs` user for security
- **Health checks**: Automatic container monitoring
- **Resource limits**: CPU and memory constraints
- **Log rotation**: JSON logging with size limits
- **Security**: `no-new-privileges` enabled

## Commands

```bash
# View logs
docker-compose logs -f

# Check container status
docker-compose ps

# Rebuild without cache
docker-compose build --no-cache

# Enter container shell
docker exec -it slovor-mp-web sh
```

## Troubleshooting

### Container shows "unhealthy"
- Check logs: `docker-compose logs web`
- Verify `.env.local` has all required variables

### Build fails
- Ensure Docker daemon is running
- Check disk space
- Try `docker system prune` to clean up
