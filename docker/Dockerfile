# ===========================================
# Multi-stage Dockerfile for Slovor Marketplace
# Stage 1: deps — install dependencies
# Stage 2: builder — build the Next.js app
# Stage 3: runner — production runtime
# ===========================================

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
ENV NEXT_PRIVATE_SKIP_TURBOPACK=1

# ===========================================
# Dependencies
# ===========================================
FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# ===========================================
# Builder — compile the Next.js application
# ===========================================
FROM base AS builder

# Build-time args for NEXT_PUBLIC_* vars (embedded by Next.js at build)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Force remove any potentially leaked Next.js build cache from host
RUN rm -rf .next node_modules/.cache

# Build the app (output: standard build for stability)
RUN npm run build

# ===========================================
# Runner — minimal production image
# ===========================================
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application and dependencies
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/env.ts ./src/lib/env.ts

# Create cache directory for Next.js image optimization
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

USER nextjs

EXPOSE 3000

ENV PORT=3000
# Use next start instead of standalone server.js to avoid manifests singleton bugs in Next.js 16
CMD ["./node_modules/.bin/next", "start"]
