# 🔥 ОБЯЗАТЕЛЬНЫЕ ПРИНЦИПЫ РАЗРАБОТКИ

> **ВНИМАНИЕ:** Эти принципы являются **ОБЯЗАТЕЛЬНЫМИ** для всей разработки.  
> Любой код, нарушающий эти правила, должен быть отклонён на ревью.

---

## 1️⃣ Минимизируй код

**Правило:** Маленькие классы, маленькие функции, маленькие файлы.

### ✅ Правильно:

```typescript
// One function, one responsibility, < 20 lines
export async function getListings() {
  const { data, error } = await supabase.from('listings').select()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}
```

### ❌ Неправильно:

```typescript
// 200+ lines, multiple responsibilities
export async function getListingsAndCategoriesAndUsersAndFilterAndSort() {
  // ... 200 lines of spaghetti
}
```

### Правила:
- **Функция:** max 30 строк
- **Компонент:** max 150 строк
- **Файл:** max 300 строк

---

## 2️⃣ Минимизируй связи

**Правило:** Объекты не должны знать друг о друге напрямую.

### ✅ Правильно:

```typescript
// Component only knows about interface
interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  return <div>{listing.title}</div>
}
```

### ❌ Неправильно:

```typescript
// Component imports API directly
import { supabase } from '@/lib/supabase'

export function ListingCard() {
  const data = supabase.from('listings').select() // ❌ Direct coupling
}
```

### Правила:
- Используй **props** для передачи данных
- Используй **interfaces** для контрактов
- Избегай прямых импортов API в компонентах

---

## 3️⃣ Одна ответственность — один владелец

**Правило:** Каждая часть логики имеет ровно одного владельца.

### ✅ Правильно:

```typescript
// Data fetching ONLY in lib/supabase/queries.ts
export const listingsApi = {
  getAll: async () => { /* ... */ },
  getById: async (id: string) => { /* ... */ },
}
```

### ❌ Неправильно:

```typescript
// Data fetching scattered everywhere
// in component A
const data = await fetch('/api/listings')

// in component B  
const data = await supabase.from('listings').select()

// in component C
const data = await axios.get('/listings')
```

### Правила:
- Все API вызовы → `lib/supabase/queries.ts`
- Вся типизация → `lib/types/`
- Все утилиты → `lib/utils/`

---

## 4️⃣ Явность важнее магии

**Правило:** Код должен быть предсказуемым. Никакой скрытой логики.

### ✅ Правильно:

```typescript
// Explicit data fetching
export default async function HomePage() {
  const listings = await listingsApi.getAll()
  return <ListingGrid listings={listings.data} />
}
```

### ❌ Неправильно:

```typescript
// Magic auto-fetching hook
export function HomePage() {
  const listings = useAutoMagicFetch() // ❌ What does this do?
  return <ListingGrid listings={listings} />
}
```

### Правила:
- Явно указывай, откуда данные
- Избегай auto-imports, auto-scans
- Не используй декораторы для скрытой логики

---

## 5️⃣ Ошибки — часть дизайна

**Правило:** Обработка ошибок не "потом", а **сейчас**.

### ✅ Правильно:

```typescript
type ApiResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: string }

export async function getListings(): Promise<ApiResponse<Listing[]>> {
  try {
    const { data, error } = await supabase.from('listings').select()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}
```

### ❌ Неправильно:

```typescript
export async function getListings() {
  const data = await supabase.from('listings').select() // ❌ No error handling
  return data
}
```

### Правила:
- Всегда возвращай `{ data, error }` из API
- Всегда проверяй `error` перед использованием `data`
- Показывай `<ErrorState />` при ошибках

---

## 6️⃣ Код для людей, не компилятора

**Правило:** Читаемость > производительность (в 99.9% случаев).

### ✅ Правильно:

```typescript
interface ListingCardProps {
  listing: Listing
  featured?: boolean
}

export function ListingCard({ listing, featured }: ListingCardProps) {
  const isNew = isListingNew(listing.created_at)
  const formattedPrice = formatPrice(listing.price, listing.currency)
  
  return (
    <div className="listing-card">
      <h3>{listing.title}</h3>
      <p>{formattedPrice}</p>
    </div>
  )
}
```

### ❌ Неправильно:

```typescript
// Unreadable, clever code
export const LC = ({ l, f }: any) => (
  <div className="lc">
    <h3>{l.t}</h3>
    <p>{l.p}{l.c}</p>
  </div>
)
```

### Правила:
- Полные, понятные имена переменных
- Избегай сокращений (кроме общепринятых: `id`, `url`)
- Никаких хаков и трюков

---

## 7️⃣ Минимум глобального состояния

**Правило:** Глобальное состояние = хаос. Избегай его.

### ✅ Правильно:

```typescript
// Props down, explicit
export default function HomePage() {
  return <ListingGrid listings={data} />
}

function ListingGrid({ listings }) {
  return <div>{listings.map(l => <ListingCard listing={l} />)}</div>
}
```

### ❌ Неправильно:

```typescript
// Global store for everything
import { globalStore } from '@/store'

export function ListingCard() {
  const listing = globalStore.listings[0] // ❌ Hidden dependency
}
```

### Правила:
- Используй **props** для передачи данных
- Локальный `useState` только в Client Components
- Глобальное состояние — только для auth, theme

---

## 8️⃣ KISS — без компромиссов

**Правило:** Простое решение всегда лучше.

### ✅ Правильно:

```typescript
// Simple, straightforward
export function formatPrice(price: number, currency: string) {
  return `${price.toLocaleString()} ${currency}`
}
```

### ❌ Неправильно:

```typescript
// Over-engineered
class PriceFormatterFactory {
  createFormatter(config: FormatterConfig) {
    return new CurrencyFormatter(
      new LocaleProvider(new ConfigManager())
    )
  }
}
```

### Правила:
- Если можно проще — делай проще
- Избегай паттернов ради паттернов
- Не добавляй абстракции "на будущее"

---

## 📋 Чеклист перед коммитом

- [ ] Функции < 30 строк?
- [ ] Компоненты < 150 строк?
- [ ] Нет прямых связей между модулями?
- [ ] Обработаны все ошибки?
- [ ] Имена переменных понятны?
- [ ] Нет глобального состояния?
- [ ] Решение максимально простое?
- [ ] Код читается как книга?

---

## 🚫 Запрещённые практики

1. ❌ `any` в TypeScript
2. ❌ Fetch/API вызовы в компонентах
3. ❌ Функции > 50 строк
4. ❌ Глобальные переменные
5. ❌ Магические строки/числа без констант
6. ❌ Игнорирование ошибок
7. ❌ Сокращённые имена (`usr`, `lst`, `btn`)
8. ❌ Закомментированный код в main branch

---

## ✅ Рекомендуемые практики

1. ✅ Server Components по умолчанию
2. ✅ Props для передачи данных
3. ✅ `{ data, error }` для API ответов
4. ✅ Один файл = одна ответственность
5. ✅ Явные импорты
6. ✅ Типизация всего
7. ✅ Понятные имена
8. ✅ Обработка ошибок везде

---

## 🎯 Примеры из проекта

### Правильная структура файла:

```typescript
// components/listing/card.tsx
import Link from 'next/link'
import type { Listing } from '@/lib/supabase/queries'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
}

export function ListingCard({ listing, featured }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <h3>{listing.title}</h3>
      <p>{listing.price} {listing.currency}</p>
    </Link>
  )
}
```

### Правильная структура API:

```typescript
// lib/supabase/queries.ts
export const listingsApi = {
  async getAll(): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase.from('listings').select()
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }
}
```

---

**Помни:** Эти принципы не ограничивают — они **освобождают** от хаоса и технического долга.
