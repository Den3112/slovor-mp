# ===========================================
# Multi-stage Dockerfile for Next.js
# Optimized for production with best practices
# ===========================================

# Base image with Node.js Alpine for minimal size
FROM node:22-alpine AS base

# Set environment variables for npm
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

# ===========================================
# Dependencies stage
# ===========================================
FROM base AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with legacy-peer-deps for better compatibility
RUN npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund

# ===========================================
# Builder stage
# ===========================================
FROM base AS builder

WORKDIR /app

# Build-time arguments for NEXT_PUBLIC variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Set them as environment variables for the build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# ===========================================
# Production runner stage
# ===========================================
FROM base AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

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

# Start the server
CMD ["node", "server.js"]
