# ===========================================
# Оптимизированный Dockerfile для Slovor Marketplace
# Использует Next.js Standalone для минимального веса образа
# ===========================================

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Отключаем телеметрию для ускорения сборки
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

# --- Этап 1: Установка зависимостей ---
FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
# Используем ci для стабильности, отключаем ненужные проверки
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# --- Этап 2: Сборка приложения ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные среды для сборки (публичные)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Сборка Next.js (создаст .next/standalone и .next/static)
RUN npm run build

# --- Этап 3: Финальный образ (Runner) ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Безопасность: запуск от не-root пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем только необходимые файлы из standalone билда
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Важно: Копируем остальные артефакты, если они нужны (обычно standalone их включает)
# В Next.js 16 standalone сервер уже содержит необходимые node_modules внутри себя.

USER nextjs
EXPOSE 3000

# Запуск через сервер.js (создается в standalone моде)
CMD ["node", "server.js"]
