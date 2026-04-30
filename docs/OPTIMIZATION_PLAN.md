# 🚀 Slovor Marketplace: План оптимизации и улучшения

**Дата создания:** 2025-01-XX  
**Статус:** В работе  
**Приоритет:** Критический → Высокий → Средний → Низкий

---

## 📋 Содержание

1. [Обзор текущего состояния](#1-обзор-текущего-состояния)
2. [Критические проблемы (P0)](#2-критические-проблемы-p0)
3. [Архитектурные улучшения (P1)](#3-архитектурные-улучшения-p1)
4. [Оптимизация производительности (P2)](#4-оптимизация-производительности-p2)
5. [DevOps и CI/CD (P3)](#5-devops-и-cicd-p3)
6. [Документация и стандарты (P4)](#6-документация-и-стандарты-p4)
7. [Дорожная карта выполнения](#7-дорожная-карта-выполнения)
8. [Чеклист готовности](#8-чеклист-готовности)

---

## 1. Обзор текущего состояния

### Метрики проекта
- **TypeScript ошибок:** ~660
- **ESLint предупреждений:** Требует анализа
- **Покрытие тестами:** 0% (требуется настройка)
- **Размер bundle:** Требует анализа
- **Время сборки:** Требует замера

### Структура проекта
```
src/
├── app/              # Next.js App Router
├── widgets/          # Крупные блоки (смешана логика)
├── features/         # Бизнес-логика
├── entities/         # Доменные сущности
├── shared/           # Переиспользуемый код
│   ├── ui/           # UI компоненты
│   ├── lib/          # Утилиты
│   ├── hooks/        # Хуки
│   └── types/        # TypeScript типы
└── config/           # Конфигурация
```

---

## 2. Критические проблемы (P0)

### 2.1 TypeScript ошибки (~660 ошибок)

#### Категория A: Implicit `any` types (~150 ошибок)
**Проблема:** Параметры и переменные без явных типов снижают безопасность типов.

**План действий:**
- [ ] Пройтись по всем файлам с `implicit any`
- [ ] Создать недостающие интерфейсы в `shared/types/`
- [ ] Добавить дженерики для универсальных функций
- [ ] Использовать `unknown` вместо `any` где тип не определен

**Примеры исправлений:**
```typescript
// ❌ Было
function handleChatMessage(payload) {
  supabase.from('messages').insert(payload)
}

// ✅ Стало
interface ChatMessagePayload {
  room_id: string;
  content: string;
  sender_id: string;
  created_at?: string;
}

function handleChatMessage(payload: ChatMessagePayload) {
  return supabase.from('messages').insert(payload)
}
```

**Файлы для приоритетного исправления:**
1. `src/widgets/chat/model/useChat.ts`
2. `src/widgets/payment/model/usePayment.ts`
3. `src/features/auth/model/useAuth.ts`
4. `src/entities/user/model/userSlice.ts`
5. `src/shared/lib/api/supabaseClient.ts`

**Оценка времени:** 8-12 часов

---

#### Категория B: Supabase Client ошибки (~80 ошибок)
**Проблема:** Неправильная передача аргументов в методы Supabase.

**План действий:**
- [ ] Аудит всех вызовов `supabase.from().select/insert/update/delete`
- [ ] Создание типизированных обёрток для часто используемых запросов
- [ ] Добавление обработчиков ошибок для всех async операций
- [ ] Типизация ответов от Supabase

**Создание типизированного клиента:**
```typescript
// src/shared/lib/supabase/typedClient.ts
import { Database } from '@/shared/types/database.types'
import { createClient } from '@supabase/supabase-js'

export const typedSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Типизированные репозитории
export const userRepository = {
  findById: (id: string) => 
    typedSupabase.from('users').select('*').eq('id', id).single(),
  
  update: (id: string, data: Database['public']['Tables']['users']['Update']) =>
    typedSupabase.from('users').update(data).eq('id', id)
}
```

**Оценка времени:** 6-8 часов

---

#### Категория C: Null Safety (~120 ошибок)
**Проблема:** Отсутствие обработки потенциально null/undefined значений.

**План действий:**
- [ ] Внедрить optional chaining (`?.`) везде где возможно
- [ ] Использовать nullish coalescing (`??`) для дефолтных значений
- [ ] Добавить type guards для сложных проверок
- [ ] Настроить строгий режим в `tsconfig.json`

**Примеры:**
```typescript
// ❌ Было
const userName = session.user.name

// ✅ Стало
const userName = session?.user?.name ?? 'Гость'

// ❌ Было
if (data && data.length > 0) { }

// ✅ Стало
if (data?.length) { }
```

**Оценка времени:** 4-6 часов

---

#### Категория D: Missing Module Declarations (~40 ошибок)
**Проблема:** Отсутствуют типы для внешних библиотек.

**План действий:**
- [ ] Установить missing @types пакеты
- [ ] Создать кастомные declaration файлы если типов нет
- [ ] Обновить `tsconfig.json` для правильного разрешения типов

```bash
npm install --save-dev \
  @types/framer-motion \
  @types/lucide-react \
  @types/node \
  @types/react \
  @types/react-dom
```

```typescript
// src/shared/types/global.d.ts
declare module 'sonner' {
  export const toast: any
  export const Toaster: React.FC
}
```

**Оценка времени:** 2-3 часа

---

### 2.2 Конфигурация TypeScript

**Текущие проблемы:**
- Слишком строгие настройки блокируют разработку
- Отсутствует постепенная миграция

**План действий:**
- [ ] Временно ослабить настройки для MVP
- [ ] Создать план постепенного ужесточения
- [ ] Настроить path aliases для удобных импортов

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // Временно отключить для ускорения разработки
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noUncheckedIndexedAccess": false,
    
    // Path aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/shared/*": ["src/shared/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/widgets/*": ["src/widgets/*"]
    },
    
    // Строгость (постепенно включать)
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Оценка времени:** 1-2 часа

---

### 2.3 Зависимости и уязвимости

**План действий:**
- [ ] Аудит зависимостей через `npm audit`
- [ ] Обновить устаревшие пакеты
- [ ] Настроить автоматические обновления (Renovate/Dependabot)
- [ ] Зафиксировать версии критических зависимостей

```bash
# Аудит
npm audit --audit-level=high

# Обновление
npm update

# Проверка устаревших
npm outdated
```

**Оценка времени:** 2-3 часа

---

## 3. Архитектурные улучшения (P1)

### 3.1 Рефакторинг по FSD

**Проблема:** Смешение ответственности между слоями.

**План действий:**

#### Этап 1: Аудит текущей структуры
- [ ] Составить карту зависимостей между модулями
- [ ] Выявить нарушения границ слоев
- [ ] Документировать текущие антипаттерны

#### Этап 2: Перераспределение кода
- [ ] Извлечь бизнес-логику из widgets в features
- [ ] Вынести переиспользуемые UI компоненты в shared/ui
- [ ] Создать отдельные entity модули для доменных объектов
- [ ] Унифицировать структуру хуков

**Целевая структура:**
```
src/
├── app/                      # Роутинг и layout
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
│
├── features/                 # Бизнес-функции
│   ├── auth/
│   │   ├── model/
│   │   ├── ui/
│   │   └── index.ts
│   ├── payment/
│   ├── chat/
│   └── catalog/
│
├── entities/                 # Доменные сущности
│   ├── user/
│   ├── product/
│   ├── order/
│   └── review/
│
├── widgets/                  # Композиция страниц
│   ├── header/
│   ├── footer/
│   ├── product-card/
│   └── cart-widget/
│
└── shared/                   # Переиспользуемый код
    ├── ui/                   # Базовые UI компоненты
    ├── lib/                  # Утилиты
    ├── hooks/                # Общие хуки
    ├── types/                # TypeScript типы
    └── constants/            # Константы
```

**Оценка времени:** 12-16 часов

---

### 3.2 Управление состоянием

**Проблема:** Смешение разных подходов (Zustand, Context, local state).

**План действий:**
- [ ] Определить критерии выбора подхода к состоянию
- [ ] Централизовать глобальное состояние в Zustand
- [ ] Использовать Context только для тем и локали
- [ ] Документировать паттерны управления состоянием

**Гайдлайн:**
```markdown
## Когда использовать что:

### Zustand (глобальное состояние)
- Данные пользователя (профиль, настройки)
- Корзина покупок
- Активные фильтры каталога
- Состояние чата

### React Context
- Тема оформления (light/dark)
- Язык интерфейса
- Auth статус (только для чтения)

### Local State (useState/useReducer)
- Форма ввода
- Локальное UI состояние (модалки, табы)
- Временные данные
```

**Оценка времени:** 6-8 часов

---

### 3.3 API слой и обработка ошибок

**План действий:**
- [ ] Создать единый API клиент с интерцепторами
- [ ] Централизованная обработка ошибок
- [ ] Retry logic для временных сбоев
- [ ] Type-safe API responses

```typescript
// src/shared/lib/api/createApiClient.ts
import { SupabaseClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

interface ApiError {
  status: number
  message: string
  code?: string
}

export function createApiClient(supabase: SupabaseClient) {
  return {
    async query<T>(fn: () => Promise<{ data: T | null; error: any }>) {
      try {
        const { data, error } = await fn()
        
        if (error) {
          this.handleError(error)
          return null
        }
        
        return data
      } catch (e) {
        this.handleError(e)
        return null
      }
    },
    
    handleError(error: any) {
      const apiError: ApiError = {
        status: error.status || 500,
        message: error.message || 'Неизвестная ошибка',
        code: error.code
      }
      
      // Логирование
      console.error('[API Error]', apiError)
      
      // Пользовательское уведомление
      toast.error(apiError.message)
      
      // Специфичная обработка по кодам
      switch (apiError.status) {
        case 401:
          // Redirect to login
          break
        case 403:
          // Show access denied
          break
        case 429:
          // Rate limited
          break
      }
    }
  }
}
```

**Оценка времени:** 4-6 часов

---

## 4. Оптимизация производительности (P2)

### 4.1 Анализ и мониторинг

**План действий:**
- [ ] Настроить `@next/bundle-analyzer`
- [ ] Замерить Current Web Vitals
- [ ] Выявить bottleneck компоненты
- [ ] Настроить performance budget

```bash
npm install --save-dev @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // остальной конфиг
})
```

```bash
# Запуск анализа
ANALYZE=true npm run build
```

**Оценка времени:** 2-3 часа

---

### 4.2 Code Splitting и Lazy Loading

**План действий:**
- [ ] Dynamic imports для тяжелых компонентов
- [ ] Route-based code splitting
- [ ] Lazy loading изображений
- [ ] Предзагрузка критических ресурсов

```typescript
// Динамический импорт компонентов
import dynamic from 'next/dynamic'

const ChartWidget = dynamic(() => import('@/widgets/chart'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false // Если не нужен SSR
})

// В роутинге
const DashboardPage = dynamic(() => import('@/app/(dashboard)/page'), {
  loading: () => <DashboardSkeleton />
})
```

**Оценка времени:** 4-6 часов

---

### 4.3 Оптимизация изображений

**План действий:**
- [ ] Использовать `next/image` для всех изображений
- [ ] Настроить правильные размеры (`sizes` prop)
- [ ] Конвертировать в современные форматы (WebP/AVIF)
- [ ] Lazy loading для below-the-fold изображений

```tsx
// ❌ Было
<img src="/product.jpg" alt="Product" />

// ✅ Стало
import Image from 'next/image'

<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
  priority={true} // Для above-the-fold
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Оценка времени:** 3-4 часа

---

### 4.4 Кэширование и ревалидация

**План действий:**
- [ ] Настроить ISR для статических страниц
- [ ] Implement stale-while-revalidate паттерн
- [ ] Кэширование API запросов на клиенте
- [ ] Service Worker для offline режима

```typescript
// ISR для страниц
export const revalidate = 3600 // 1 час

// Кэширование в React Query / SWR
import useSWR from 'swr'

const { data, error } = useSWR('/api/products', fetcher, {
  refreshInterval: 60000, // 1 минута
  dedupingInterval: 2000,
  staleTime: 300000 // 5 минут
})
```

**Оценка времени:** 4-5 часов

---

### 4.5 Оптимизация рендеринга

**План действий:**
- [ ] Memoization компонентов (React.memo)
- [ ] useMemo/useCallback для тяжелых вычислений
- [ ] Virtualization для длинных списков
- [ ] Оптимизация re-renders

```typescript
import { memo, useMemo, useCallback } from 'react'

const ProductList = memo(({ products, onAddToCart }) => {
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price)
  }, [products])
  
  const handleAddToCart = useCallback((productId: string) => {
    onAddToCart(productId)
  }, [onAddToCart])
  
  return (
    <ul>
      {sortedProducts.map(product => (
        <ProductItem 
          key={product.id}
          product={product}
          onAdd={handleAddToCart}
        />
      ))}
    </ul>
  )
})
```

**Оценка времени:** 6-8 часов

---

## 5. DevOps и CI/CD (P3)

### 5.1 Pre-commit хуки

**План действий:**
- [ ] Настроить Husky
- [ ] Настроить lint-staged
- [ ] Добавить pre-commit проверки
- [ ] Автоматическое форматирование

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// .lintstagedrc.json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "git add"
  ],
  "*.{json,md,css,scss}": ["prettier --write"],
  "*.{ts,tsx,js,jsx}": ["jest --findRelatedTests --passWithNoTests"]
}
```

**Оценка времени:** 2-3 часа

---

### 5.2 CI/CD Pipeline

**План действий:**
- [ ] Настроить GitHub Actions workflow
- [ ] Добавить этапы: lint → test → build → deploy
- [ ] Parallel execution тестов
- [ ] Caching зависимостей

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        
  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next
```

**Оценка времени:** 4-6 часов

---

### 5.3 Docker контейнеризация

**План действий:**
- [ ] Multi-stage build для уменьшения размера
- [ ] Non-root пользователь
- [ ] Health checks
- [ ] Optimized layer caching

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
```

**Оценка времени:** 3-4 часа

---

### 5.4 Мониторинг и логирование

**План действий:**
- [ ] Настроить Sentry для error tracking
- [ ] Добавить performance monitoring
- [ ] Централизованное логирование
- [ ] Alerting для критических ошибок

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.2, // 20% транзакций
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    new Sentry.Replay()
  ]
})
```

**Оценка времени:** 3-4 часа

---

## 6. Документация и стандарты (P4)

### 6.1 Внутренняя документация

**План действий:**
- [ ] Создать README с инструкциями по запуску
- [ ] Document architecture decisions (ADR)
- [ ] Гайды по добавлению фич
- [ ] API документация для shared библиотек

**Структура документации:**
```
docs/
├── README.md                    # Общая информация
├── getting-started.md           # Быстрый старт
├── architecture/
│   ├── overview.md              # Архитектурный обзор
│   ├── fsd-patterns.md          # FSD паттерны
│   └── adr/                     # Architecture Decision Records
│       ├── adr-001-fsd.md
│       └── adr-002-state-mgmt.md
├── guides/
│   ├── adding-feature.md        # Как добавить фичу
│   ├── testing-guide.md         # Тестирование
│   └── deployment.md            # Деплой
├── api/
│   ├── shared-ui.md             # UI компоненты
│   └── utils.md                 # Утилиты
└── conventions/
    ├── code-style.md            # Стиль кода
    ├── git-workflow.md          # Git процесс
    └── naming.md                # Именование
```

**Оценка времени:** 8-10 часов

---

### 6.2 Стандарты кода

**План действий:**
- [ ] Настроить ESLint правила
- [ ] Настроить Prettier конфигурацию
- [ ] Создать шаблоны компонентов
- [ ] Code review checklist

```javascript
// eslint.config.mjs
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      
      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always']
    }
  }
)
```

**Оценка времени:** 3-4 часа

---

### 6.3 Тестирование

**План действий:**
- [ ] Настроить Jest + React Testing Library
- [ ] Настроить Cypress для E2E
- [ ] Покрытие критических путей > 70%
- [ ] CI интеграция тестов

**Стратегия тестирования:**
```
Тестовая пирамида:

        /\
       /  \      E2E (Cypress) - 10%
      /----\     
     /      \    Integration - 20%
    /--------\   
   /          \  Unit (Jest) - 70%
  /------------\ 
```

**Конфигурация:**
```json
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/stories/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

**Оценка времени:** 20-30 часов

---

## 7. Дорожная карта выполнения

### Фаза 1: Критические исправления (Неделя 1-2)
**Цель:** Устранить блокирующие проблемы

| День | Задача | Оценка | Статус |
|------|--------|--------|--------|
| 1-2 | Исправить implicit any (~150 ошибок) | 8ч | ⏳ |
| 3 | Настроить Supabase typed client | 6ч | ⏳ |
| 4 | Null safety fixes | 4ч | ⏳ |
| 5 | Missing module declarations | 3ч | ⏳ |
| 6-7 | Ослабить TS config для MVP | 2ч | ⏳ |
| 8-9 | Dependency audit & updates | 3ч | ⏳ |
| 10 | Buffer & code review | 4ч | ⏳ |

**Итого:** ~30 часов

---

### Фаза 2: Архитектурный рефакторинг (Неделя 3-4)
**Цель:** Привести к соответствию FSD

| День | Задача | Оценка | Статус |
|------|--------|--------|--------|
| 1-2 | Аудит текущей структуры | 6ч | ⏳ |
| 3-5 | Перераспределение widgets → features | 12ч | ⏳ |
| 6-7 | State management refactoring | 8ч | ⏳ |
| 8-9 | API layer unification | 6ч | ⏳ |
| 10 | Buffer & testing | 4ч | ⏳ |

**Итого:** ~36 часов

---

### Фаза 3: Производительность (Неделя 5)
**Цель:** Улучшить метрики производительности

| День | Задача | Оценка | Статус |
|------|--------|--------|--------|
| 1 | Bundle analysis & metrics | 3ч | ⏳ |
| 2-3 | Code splitting & lazy loading | 6ч | ⏳ |
| 4 | Image optimization | 4ч | ⏳ |
| 5 | Caching strategy | 5ч | ⏳ |
| 6-7 | Render optimization | 8ч | ⏳ |

**Итого:** ~26 часов

---

### Фаза 4: DevOps и автоматизация (Неделя 6)
**Цель:** Автоматизировать процессы

| День | Задача | Оценка | Статус |
|------|--------|--------|--------|
| 1-2 | Husky & lint-staged | 3ч | ⏳ |
| 3-4 | GitHub Actions CI/CD | 6ч | ⏳ |
| 5-6 | Docker containerization | 4ч | ⏳ |
| 7 | Monitoring & logging | 4ч | ⏳ |

**Итого:** ~17 часов

---

### Фаза 5: Тестирование и документация (Неделя 7-8)
**Цель:** Обеспечить качество и документирование

| День | Задача | Оценка | Статус |
|------|--------|--------|--------|
| 1-2 | Jest setup & unit tests | 10ч | ⏳ |
| 3-4 | Integration tests | 8ч | ⏳ |
| 5-6 | E2E tests (Cypress) | 10ч | ⏳ |
| 7-8 | Documentation writing | 10ч | ⏳ |
| 9-10 | Final review & polish | 8ч | ⏳ |

**Итого:** ~46 часов

---

### Сводная таблица

| Фаза | Длительность | Часы | Приоритет |
|------|-------------|------|-----------|
| 1. Критические исправления | 2 недели | 30ч | 🔴 P0 |
| 2. Архитектурный рефакторинг | 2 недели | 36ч | 🟡 P1 |
| 3. Производительность | 1 неделя | 26ч | 🟢 P2 |
| 4. DevOps | 1 неделя | 17ч | 🔵 P3 |
| 5. Тестирование и доки | 2 недели | 46ч | 🟣 P4 |
| **ВСЕГО** | **8 недель** | **155ч** | |

---

## 8. Чеклист готовности

### Перед началом каждой фазы
- [ ] Создан бранч для фазы
- [ ] План утвержден командой
- [ ] Оценены риски
- [ ] Подготовлен rollback план

### Критерии завершения фазы 1 (P0)
- [ ] TypeScript ошибок < 100
- [ ] Сборка проходит без ошибок
- [ ] Основные типы определены
- [ ] Supabase client типизирован

### Критерии завершения фазы 2 (P1)
- [ ] FSD структура соблюдается
- [ ] Нет нарушений границ слоев
- [ ] State management унифицирован
- [ ] API слой централизован

### Критерии завершения фазы 3 (P2)
- [ ] Bundle size < 500KB (initial)
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

### Критерии завершения фазы 4 (P3)
- [ ] Pre-commit хуки работают
- [ ] CI pipeline зеленый
- [ ] Docker образ < 200MB
- [ ] Monitoring настроен

### Критерии завершения фазы 5 (P4)
- [ ] Coverage > 70%
- [ ] E2E тесты проходят
- [ ] Документация актуальна
- [ ] Onboarding гайд готов

---

## Приложения

### Приложение A: Список файлов для приоритетного исправления

```
src/widgets/chat/model/useChat.ts
src/widgets/payment/model/usePayment.ts
src/features/auth/model/useAuth.ts
src/entities/user/model/userSlice.ts
src/shared/lib/api/supabaseClient.ts
src/app/(dashboard)/page.tsx
src/features/catalog/model/useCatalog.ts
src/entities/product/model/productSlice.ts
src/widgets/cart/model/useCart.ts
src/shared/hooks/useDebounce.ts
```

### Приложение B: Шаблоны коммитов

```
feat: добавлена новая функция
fix: исправлена ошибка
refactor: рефакторинг кода
perf: улучшение производительности
test: добавлены тесты
docs: обновлена документация
chore: технические изменения
```

### Приложение C: Полезные команды

```bash
# Анализ TypeScript ошибок
npx tsc --noEmit --explainFiles

# Поиск implicit any
npx tsc --noEmit | grep "implicit any"

# Анализ зависимостей
npm ls --depth=0
npm outdated
npm audit

# Performance
npm run analyze
npx lighthouse http://localhost:3000

# Тесты
npm run test
npm run test:coverage
npm run test:e2e
```

---

## Контакты и ответственные

| Роль | Ответственный | Контакты |
|------|--------------|----------|
| Tech Lead | TBD | TBD |
| Frontend Dev | TBD | TBD |
| DevOps Engineer | TBD | TBD |
| QA Engineer | TBD | TBD |

---

**Статус документа:** ✅ Утвержден  
**Последнее обновление:** 2025-01-XX  
**Следующий ревью:** После завершения Фазы 1
