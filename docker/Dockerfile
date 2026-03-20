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

# Build the app (output: standalone)
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

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone output — this is the self-contained server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create cache directory for Next.js image optimization
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
