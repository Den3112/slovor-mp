# ===========================================
# Multi-stage Dockerfile for Next.js
# Elite Optimization: BuildKit Cache, Minimal Production Image
# ===========================================

# Base image with Node.js Alpine for minimal size
FROM node:22-alpine AS base

# Install runtime dependencies ONLY
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Set environment variables for npm and Next.js
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false
ENV NEXT_TELEMETRY_DISABLED=1

# ===========================================
# Dependencies stage
# ===========================================
FROM base AS deps

# Install build-time dependencies ONLY for installation phase
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies using BuildKit cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund

# ===========================================
# Builder stage
# ===========================================
FROM base AS builder

# Build-time arguments for NEXT_PUBLIC variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Set them as environment variables for the build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Skip environment validation during build
ENV SKIP_ENV_VALIDATION=1

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application with cache mount for .next/cache
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ===========================================
# Production runner stage
# ===========================================
FROM base AS runner

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables for runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --spider -q http://localhost:3000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
