# 🏗️ ARCHITECTURE AUDIT & STANDARDIZATION REPORT

> **DATE**: 2026-02-05
> **PROJECT**: Slovor Marketplace
> **STATUS**: Audit Complete

---

## 📊 EXECUTIVE SUMMARY

| Категория | Статус | Оценка |
|-----------|--------|--------|
| **Файловая структура** | ⚠️ Требует улучшений | 7/10 |
| **Naming conventions** | ⚠️ Несогласованность | 6/10 |
| **Component organization** | ⚠️ Дублирование | 6/10 |
| **API layer** | ✅ Хорошо | 8/10 |
| **State management** | ✅ Хорошо | 8/10 |
| **Type safety** | ⚠️ Неполное | 7/10 |
| **Route structure** | ⚠️ Избыточность | 6/10 |

---

## 🔴 КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### 1. ДУБЛИРОВАНИЕ МАРШРУТОВ

**Проблема**: Есть два способа создания объявлений:
```
/create-ad    ← Старый маршрут
/post         ← Новый маршрут
```

**Решение**: Оставить только `/post`, добавить redirect с `/create-ad`

```typescript
// next.config.ts
async redirects() {
  return [
    { source: '/create-ad', destination: '/post', permanent: true },
  ]
}
```

---

### 2. НЕСОГЛАСОВАННОСТЬ В DASHBOARD/ADMIN

**Проблема**: В `app/[locale]/(main)/admin/` есть папка `components/`:
```
/admin/components/    ← ❌ НЕПРАВИЛЬНО! Компоненты не должны быть в app/
```

**Стандарт Next.js**: Папка `app/` только для роутинга. Компоненты — в `components/`.

**Решение**: Переместить компоненты в:
```
/components/features/dashboard/admin/   ← ✅ Правильно
```

---

### 3. ДУБЛИРОВАНИЕ НАВИГАЦИИ

**Проблема**: Два файла для mobile навигации в разных местах:
```
/components/layout/admin-mobile-nav.tsx           ← Один файл
/components/features/dashboard/admin/admin-mobile-nav.tsx  ← Другой файл
```

**Решение**: Оставить только в `/components/layout/` как shared

---

### 4. НЕСОГЛАСОВАННЫЙ NAMING В COMPONENTS

**Проблема**: Смешение стилей именования:
```
home-cta.tsx        ← kebab-case ✅
homeCategories.tsx  ← camelCase ❌ (нет такого, но пример)
HomeView.tsx        ← PascalCase ❌ (должно быть home-view.tsx)
```

**Стандарт**: Все файлы компонентов — `kebab-case.tsx`

---

### 5. ОТСУТСТВИЕ BARREL EXPORTS

**Проблема**: Нет `index.ts` для группировки экспортов в папках компонентов:
```
/components/home/index.ts           ← НЕТ
/components/layout/index.ts         ← НЕТ
/components/ui/index.ts             ← НЕТ
```

**Стандарт**: Каждая папка компонентов должна иметь `index.ts`

---

### 6. ТИПЫ В НЕПРАВИЛЬНОМ МЕСТЕ

**Проблема**: Типы разбросаны:
```
/lib/types/            ← Общие типы
/lib/api/*.ts          ← Типы внутри API файлов
/components/...        ← Типы внутри компонентов
```

**Стандарт**: Централизованные типы в `/lib/types/`

---

## 🟡 ПРЕДУПРЕЖДЕНИЯ

### 1. ИЗБЫТОЧНЫЕ ПАПКИ В DASHBOARD

```
/dashboard/purchases/  ← Дублирует /dashboard/orders/
/dashboard/profile/    ← Должно быть в /dashboard/settings/
```

**Решение**:
- Объединить purchases → orders
- Объединить profile → settings (вкладка)

---

### 2. ОТСУТСТВИЕ МОДЕЛИ ДАННЫХ

**Проблема**: Нет единого файла схемы БД для frontend

**Решение**: Создать `/lib/types/database.types.ts` из Supabase

---

### 3. СЛИШКОМ БОЛЬШИЕ ФАЙЛЫ

| Файл | Размер | Рекомендация |
|------|--------|--------------|
| `listings-view.tsx` (admin) | 28KB | Разбить на sub-components |
| `listings-view.tsx` (user) | 23KB | Разбить на sub-components |
| `wallet-view.tsx` | 18KB | Разбить на sub-components |
| `overview-view.tsx` (user) | 18KB | Разбить на sub-components |

**Стандарт**: Компонент < 500 строк, идеально < 300 строк

---

## ✅ ЧТО СДЕЛАНО ПРАВИЛЬНО

1. **Route Groups**: Правильное использование `(main)`, `(auth)`
2. **API Layer**: Централизованный в `/lib/api/`
3. **Hooks**: Правильно организованы в `/lib/hooks/`
4. **UI Components**: Правильно в `/components/ui/`
5. **Feature Components**: Правильное разделение user/admin
6. **Supabase Integration**: Правильно в `/lib/supabase/`
7. **i18n**: Правильная структура с `[locale]`
8. **Constants**: Правильно в `/lib/constants/`

---

## 🎯 ПЛАН СТАНДАРТИЗАЦИИ

### PHASE 1: ROUTE CLEANUP (30 min)

```bash
# 1. Удалить дубликаты
rm -rf app/[locale]/(main)/create-ad

# 2. Удалить папку components из admin
# Компоненты уже есть в /components/features/dashboard/admin/
rm -rf app/[locale]/(main)/admin/components

# 3. Добавить редиректы в next.config.ts
```

### PHASE 2: COMPONENT ORGANIZATION (1 hour)

```
# Создать barrel exports
/components/ui/index.ts
/components/layout/index.ts
/components/home/index.ts
/components/features/index.ts
/components/listing/index.ts
/components/search/index.ts
```

### PHASE 3: TYPE CENTRALIZATION (45 min)

```typescript
// /lib/types/index.ts - обновить с полным экспортом
export * from './database'
export * from './api'
export * from './components'
export * from './forms'
```

### PHASE 4: REFACTORING LARGE FILES (In Progress)

Разбить большие view-компоненты на sub-components:

```
/components/features/dashboard/user/
  listings-view/
    index.tsx           ← Main export
    listings-table.tsx  ← Table component
    listings-filters.tsx
    listings-actions.tsx
    listings-empty.tsx
```

---

## 📁 ЭТАЛОННАЯ СТРУКТУРА (BEST PRACTICES)

```
slovor-mp/
├── app/                          # Next.js App Router
│   ├── [locale]/
│   │   ├── (main)/              # Main layout group
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── layout.tsx       # Main layout
│   │   │   ├── dashboard/       # User dashboard
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── listings/
│   │   │   │   ├── orders/
│   │   │   │   ├── wallet/
│   │   │   │   ├── reviews/
│   │   │   │   └── settings/
│   │   │   ├── admin/           # Admin panel
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/
│   │   │   │   ├── listings/
│   │   │   │   ├── moderation/
│   │   │   │   ├── reports/
│   │   │   │   └── analytics/
│   │   │   ├── listings/        # Listing pages
│   │   │   ├── search/
│   │   │   ├── post/            # Create listing
│   │   │   ├── messages/
│   │   │   └── favorites/
│   │   ├── (auth)/              # Auth layout group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   └── layout.tsx           # Root locale layout
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   ├── listings/
│   │   ├── users/
│   │   └── webhooks/
│   ├── globals.css
│   └── providers.tsx
│
├── components/                   # All components
│   ├── ui/                      # Primitive UI (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── index.ts             # Barrel export
│   ├── layout/                  # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   ├── mega-menu.tsx
│   │   ├── mobile-drawer.tsx
│   │   └── index.ts
│   ├── home/                    # Homepage components
│   │   ├── hero.tsx
│   │   ├── categories-grid.tsx
│   │   ├── featured-listings.tsx
│   │   └── index.ts
│   ├── listing/                 # Listing components
│   │   ├── listing-card.tsx
│   │   ├── listing-gallery.tsx
│   │   ├── listing-form/
│   │   └── index.ts
│   ├── features/                # Feature-specific
│   │   ├── dashboard/
│   │   │   ├── user/            # User dashboard views
│   │   │   ├── admin/           # Admin dashboard views
│   │   │   └── shared/          # Shared between both
│   │   └── checkout/
│   └── providers/               # Context providers
│
├── lib/                         # Utilities & business logic
│   ├── api/                     # API client functions
│   │   ├── listings.ts
│   │   ├── users.ts
│   │   └── index.ts
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-listings.ts
│   │   └── index.ts
│   ├── types/                   # TypeScript types
│   │   ├── database.types.ts    # From Supabase
│   │   ├── api.types.ts
│   │   └── index.ts
│   ├── constants/               # Constants
│   ├── utils/                   # Utility functions
│   ├── supabase/                # Supabase client
│   └── i18n/                    # Internationalization
│
├── public/                      # Static assets
├── supabase/                    # Supabase config & migrations
├── e2e/                         # E2E tests
├── __tests__/                   # Unit tests
└── docs/                        # Documentation
```

---

## ⚡ QUICK FIXES (DO FIRST)

### 1. Добавить redirects в next.config.ts

```typescript
async redirects() {
  return [
    // Cleanup old routes
    { source: '/create-ad', destination: '/post', permanent: true },
    { source: '/profile', destination: '/dashboard', permanent: true },
    { source: '/profile/:path*', destination: '/dashboard/:path*', permanent: true },
    { source: '/dashboard/purchases', destination: '/dashboard/orders', permanent: true },
  ]
}
```

### 2. Удалить избыточные папки

```bash
# Если /create-ad ещё существует
rm -rf app/[locale]/(main)/create-ad

# Если /admin/components существует
rm -rf app/[locale]/(main)/admin/components
```

### 3. Создать barrel exports

```typescript
// components/ui/index.ts
export * from './button'
export * from './card'
export * from './input'
// ... etc

// components/layout/index.ts
export * from './header'
export * from './footer'
export * from './sidebar'
// ... etc
```

---

## 📌 ДЛЯ ОБНОВЛЕНИЯ MASTERPLAN

Добавить в план раздел "Architecture Standards":

1. **File Naming**: All component files use `kebab-case.tsx`
2. **Barrel Exports**: Each component folder must have `index.ts`
3. **Component Size**: Max 500 lines per component, split if larger
4. **Route Structure**: No components in `app/` folder, only routing
5. **Types**: All shared types in `/lib/types/`
6. **No Duplicates**: Single source of truth for each feature

---

---

## ✅ REFACORING COMPLETED (2026-02-05)

На основе данного аудита были проведены следующие работы:

1. **Рефакторинг Dashboard Views**:
   - `UserListingsView`, `AdminListingsView`, `AdminUsersView` и `AdminCategoriesView` были разделены на модульные подкомпоненты.
   - Все компоненты перенесены в структуру `view-name/index.tsx`.
   - Удалены избыточные файлы и консолидирована логика.

2. **Стандартизация стилей**:
   - Удалены `font-black`, `backdrop-blur` и избыточные тени.
   - Внедрена повсеместная `font-bold` и `rounded-xl`.
   - Улучшена плотность данных (Data-Dense) в таблицах и карточках модерации.

3. **Barrel Exports**:
   - Добавлены `index.ts` во все ключевые папки компонентов (`features`, `dashboard`, `search` и т.д.).
   - Ликвидированы ошибки импорта и обеспечена чистота архитектуры.

4. **Next.config Updates**:
   - Добавлены недостающие редиректы для `/profile` и `/dashboard/purchases`.

**STATUS: Verified & standard adhered.**

---

**END OF AUDIT REPORT**
