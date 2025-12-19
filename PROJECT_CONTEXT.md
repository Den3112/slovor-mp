# 📚 Project Context - Slovor Marketplace

> **Purpose:** This document provides full context for AI assistants and developers joining the project.  
> Read this FIRST before making any changes.

---

## 🎯 Project Vision

**Slovor Marketplace** — современная платформа для покупки и продажи товаров и услуг.

### Mission
Создать простой, понятный и быстрый маркетплейс, где каждый может:
- Разместить объявление за 2 минуты
- Найти нужный товар за 30 секунд
- Связаться с продавцом одним кликом

### Core Values
1. **Простота** — никаких сложных форм и лишних шагов
2. **Скорость** — всё работает мгновенно
3. **Прозрачность** — пользователь всегда знает, что происходит
4. **Качество кода** — следуем 8 принципам (см. PRINCIPLES.md)

---

## 🏗️ Architecture Philosophy

### Core Principles (MANDATORY)
Весь код **ОБЯЗАТЕЛЬНО** следует 8 принципам из [PRINCIPLES.md](./PRINCIPLES.md):

1. **Минимизируй код** — маленькие функции и компоненты
2. **Минимизируй связи** — loose coupling
3. **Один владелец** — clear ownership
4. **Явность > магия** — explicit is better than implicit
5. **Ошибки — часть дизайна** — not edge cases
6. **Код для людей** — readability first
7. **Минимум глобального состояния** — avoid chaos
8. **KISS** — simple always wins

### Tech Stack Rationale

**Next.js 16**
- ✅ Server Components — less JavaScript to client
- ✅ App Router — modern routing
- ✅ Built-in optimization — images, fonts, etc.

**Supabase**
- ✅ PostgreSQL — reliable, powerful
- ✅ Realtime — для будущего чата
- ✅ Auth — встроенная авторизация
- ✅ Storage — для картинок

**TypeScript**
- ✅ Type safety — меньше багов
- ✅ Better DX — автокомплит
- ✅ Self-documenting — типы как документация

**Tailwind CSS**
- ✅ Utility-first — быстрая разработка
- ✅ No CSS files — всё в компонентах
- ✅ Responsive — mobile-first

---

## 📖 Project History

### Phase 1: Initial Setup (Dec 19, 2025)

**Задача:** Создать MVP маркетплейса с просмотром объявлений

**Ключевые моменты:**
- Начали с Next.js 16 + Supabase
- Создали базовую структуру БД (categories, listings)
- Настроили Vercel deployment

**Проблемы и решения:**

1. **TypeScript errors** (`ce9955c`)
   - Проблема: Отсутствовал `@/*` alias
   - Решение: Добавлен paths в tsconfig.json

2. **Missing components** (`ce9955c`, `54798e7`)
   - Проблема: Не хватало header, footer, error-state
   - Решение: Созданы все UI компоненты

3. **SharedModal conflicts** (`54798e7`)
   - Проблема: Старый файл из примера
   - Решение: Удалён

4. **API signature mismatch** (`cac599b`)
   - Проблема: Неправильные аргументы в getAll()
   - Решение: Изменён на объект опций

5. **Client state in listings** (`4199332`)
   - Проблема: Использование useState вместо RSC
   - Решение: Переделан на Server Component

6. **useSearchParams without Suspense** (`b9d67c6`)
   - Проблема: Next.js требует Suspense boundary
   - Решение: Обёрнут в <Suspense>

**Результат:** ✅ Production-ready MVP

---

## 🗂️ Project Structure Explained

### Why this structure?

```
slovor-mp/
├── app/              # Pages (Next.js App Router)
│   ├── page.tsx      # Homepage — entry point
│   ├── layout.tsx    # Root layout — header/footer wrapper
│   ├── listings/     # All listings and detail pages
│   └── categories/   # Category pages
│
├── components/       # UI Components
│   ├── category/     # Category-specific (card, grid)
│   ├── listing/      # Listing-specific (card, grid, filters)
│   ├── layout/       # Layout components (header, footer)
│   └── ui/           # Generic UI (error, empty, breadcrumbs)
│
├── lib/              # Business Logic
│   └── supabase/     # Database queries (THE ONLY PLACE)
│       ├── client.ts # Supabase client initialization
│       └── queries.ts # ALL API calls here
│
└── docs/             # Documentation
    ├── PRINCIPLES.md      # 🔥 MANDATORY - Read first!
    ├── ARCHITECTURE.md    # Technical details
    ├── PROJECT_CONTEXT.md # This file
    └── CHANGELOG.md       # All changes log
```

### Component Organization Rules

1. **Domain-based folders** — `category/`, `listing/` (не `cards/`, `grids/`)
2. **One component per file** — легче найти и изменить
3. **Co-located helpers** — helper функции рядом с компонентом
4. **Generic UI separate** — переиспользуемое в `ui/`

---

## 🔑 Key Design Decisions

### 1. Server Components by Default

**Почему:** Меньше JS на клиенте = быстрее загрузка

```typescript
// ✅ Default: Server Component
export default async function Page() {
  const data = await api.getData()
  return <Component data={data} />
}

// ⚠️ Only when needed: Client Component
'use client'
export function InteractiveForm() {
  const [state, setState] = useState()
  return <form>...</form>
}
```

### 2. Centralized API Calls

**Почему:** Один источник правды, легко менять

```typescript
// ✅ All API calls in lib/supabase/queries.ts
export const listingsApi = {
  getAll: async () => { /* ... */ },
  getById: async (id) => { /* ... */ },
}

// ❌ NO direct API calls in components
// Bad: const data = await supabase.from('listings').select()
```

### 3. Structured Error Responses

**Почему:** Ошибки — не исключение, а норма

```typescript
type ApiResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: string }

// Usage
const result = await api.getData()
if (result.error) {
  return <ErrorState message={result.error} />
}
return <Component data={result.data} />
```

### 4. Props Down, Not Global State

**Почему:** Явные зависимости, легче тестировать

```typescript
// ✅ Explicit props
function Page() {
  return <Grid listings={data} />
}

function Grid({ listings }) {
  return listings.map(l => <Card listing={l} />)
}

// ❌ No global store
// Bad: const listings = useGlobalStore()
```

---

## 🎨 UI/UX Guidelines

### Design System

**Colors:**
- Primary: Blue-600 (#2563eb)
- Success: Green-500 (#22c55e)
- Warning: Yellow-500 (#eab308)
- Error: Red-600 (#dc2626)
- Neutral: Gray-900 to Gray-100

**Typography:**
- Headings: font-bold
- Body: font-normal
- Small: text-sm
- Large: text-lg, text-xl

**Spacing:**
- Section gap: mb-8 (32px)
- Component gap: gap-6 (24px)
- Inner padding: p-4 (16px)

**Responsive Breakpoints:**
- Mobile: default
- Tablet: md: (768px)
- Desktop: lg: (1024px)

### Component Patterns

**Card:**
```typescript
<div className="border rounded-xl p-4 hover:shadow-lg transition-all">
  {/* content */}
</div>
```

**Grid:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>
```

**Button:**
```typescript
<button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
  Action
</button>
```

---

## 🗄️ Database Schema

### Current Tables

**categories**
```sql
id          UUID PRIMARY KEY
name        TEXT NOT NULL
slug        TEXT UNIQUE NOT NULL
icon        TEXT
listing_count INTEGER DEFAULT 0
created_at  TIMESTAMPTZ DEFAULT NOW()
```

**listings**
```sql
id          UUID PRIMARY KEY
title       TEXT NOT NULL
description TEXT
price       NUMERIC(10,2) NOT NULL
currency    TEXT DEFAULT 'EUR'
image_url   TEXT
category_id UUID REFERENCES categories(id)
location    TEXT
user_id     UUID
created_at  TIMESTAMPTZ DEFAULT NOW()
updated_at  TIMESTAMPTZ DEFAULT NOW()
```

### Future Tables (Planned)

**users** (via Supabase Auth)
```sql
id          UUID PRIMARY KEY
email       TEXT UNIQUE
full_name   TEXT
avatar_url  TEXT
created_at  TIMESTAMPTZ
```

**messages**
```sql
id          UUID PRIMARY KEY
listing_id  UUID REFERENCES listings(id)
sender_id   UUID REFERENCES users(id)
receiver_id UUID REFERENCES users(id)
message     TEXT
created_at  TIMESTAMPTZ
```

**favorites**
```sql
user_id     UUID REFERENCES users(id)
listing_id  UUID REFERENCES listings(id)
created_at  TIMESTAMPTZ
PRIMARY KEY (user_id, listing_id)
```

---

## 🔄 Development Workflow

### Before Starting Work

1. ✅ Read [PRINCIPLES.md](./PRINCIPLES.md)
2. ✅ Read this file (PROJECT_CONTEXT.md)
3. ✅ Check [CHANGELOG.md](./CHANGELOG.md) for latest changes
4. ✅ Pull latest from `main`

### Making Changes

1. **Create branch** (optional for solo dev)
   ```bash
   git checkout -b feature/add-auth
   ```

2. **Make changes following principles**
   - Check PRINCIPLES.md checklist
   - Keep functions < 30 lines
   - Keep components < 150 lines

3. **Test locally**
   ```bash
   npm run dev
   npm run build  # Must pass!
   ```

4. **Commit with clear message**
   ```bash
   git commit -m "feat: add user authentication"
   ```

5. **Push and auto-deploy**
   ```bash
   git push origin main
   # Vercel auto-deploys
   ```

### Commit Message Format

```
type: short description

[optional body]

[optional footer]
```

**Types:**
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `refactor:` — code refactoring
- `test:` — adding tests
- `chore:` — maintenance

---

## 🐛 Known Issues

См. [CHANGELOG.md](./CHANGELOG.md) секцию "Known Issues"

---

## 📚 Learning Resources

### For New Developers

1. **Next.js 16**
   - [Official Docs](https://nextjs.org/docs)
   - [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

2. **Supabase**
   - [Getting Started](https://supabase.com/docs)
   - [JavaScript Client](https://supabase.com/docs/reference/javascript)

3. **TypeScript**
   - [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

4. **Tailwind CSS**
   - [Docs](https://tailwindcss.com/docs)

### Project-Specific

1. **Read in order:**
   - PRINCIPLES.md (mandatory!)
   - PROJECT_CONTEXT.md (this file)
   - ARCHITECTURE.md (technical details)
   - README.md (setup instructions)

---

## 💬 Communication Guidelines

### When Working with AI Assistant

**Always provide:**
- "Прочитай PROJECT_CONTEXT.md и PRINCIPLES.md"
- Clear goal: "Добавь аутентификацию"
- Expected result: "Пользователь может логиниться через email"

**AI will:**
- Follow 8 principles automatically
- Ask clarifying questions
- Provide checklist before committing
- Update CHANGELOG.md

---

## 🎯 Next Steps

См. последнюю секцию в [CHANGELOG.md](./CHANGELOG.md)

---

**Last Updated:** December 19, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
