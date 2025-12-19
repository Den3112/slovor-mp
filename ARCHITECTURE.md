# Architecture & Design

> **ВАЖНО:** Прежде чем читать этот документ, ознакомься с [PRINCIPLES.md](./PRINCIPLES.md).  
> Все архитектурные решения следуют из этих принципов.

## Обзор

Slovor Marketplace построен на **8 обязательных принципах** простоты и явности.

## Слои приложения

```
┌─────────────────────────────────────┐
│   app/          (Pages, Routes)    │  ← Presentation Layer
└─────────────────────────────────────┘
              ↓ props
┌─────────────────────────────────────┐
│   components/   (UI Components)    │  ← View Layer
└─────────────────────────────────────┘
              ↓ calls
┌─────────────────────────────────────┐
│   lib/          (Business Logic)   │  ← Data Layer
└─────────────────────────────────────┘
              ↓ queries
┌─────────────────────────────────────┐
│   Supabase      (Database)         │  ← Storage Layer
└─────────────────────────────────────┘
```

### Правила слоёв:

1. **Pages** (`app/`) — только рендеринг, никакой логики
2. **Components** (`components/`) — получают данные через props
3. **API** (`lib/`) — единственное место для запросов к БД
4. **Database** — Supabase, прямой доступ запрещён

## Структура проекта

```
slovor-mp/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Homepage (RSC)
│   ├── layout.tsx           # Root layout
│   ├── not-found.tsx        # 404 page
│   ├── listings/
│   │   ├── page.tsx         # All listings
│   │   └── [id]/
│   │       └── page.tsx     # Listing detail
│   └── categories/
│       └── [slug]/
│           └── page.tsx     # Category page
│
├── components/               # UI Components
│   ├── category/
│   │   ├── card.tsx         # CategoryCard (display)
│   │   └── grid.tsx         # CategoryGrid (layout)
│   ├── listing/
│   │   ├── card.tsx         # ListingCard (display)
│   │   ├── grid.tsx         # ListingGrid (layout)
│   │   └── filters.tsx      # ListingFilters (client)
│   ├── layout/
│   │   ├── header.tsx       # Header (navigation)
│   │   └── footer.tsx       # Footer
│   └── ui/
│       ├── error-state.tsx  # Error display
│       ├── empty-state.tsx  # Empty placeholder
│       ├── breadcrumbs.tsx  # Navigation
│       ├── search-bar.tsx   # Search (client)
│       └── loading-skeleton.tsx  # Loading states
│
├── lib/                      # Business Logic
│   ├── supabase/
│   │   ├── client.ts        # Supabase client
│   │   └── queries.ts       # ALL API calls
│   └── types/
│       └── database.ts      # Type definitions
│
├── public/                   # Static assets
│
├── PRINCIPLES.md            # 🔥 ОБЯЗАТЕЛЬНЫЕ ПРИНЦИПЫ
├── ARCHITECTURE.md          # This file
└── README.md                # User documentation
```

## Принципы в коде

### 1. Минимизируй код

**Примеры:**

```typescript
// ✅ Короткий компонент (12 строк)
export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div>
        <h3>{listing.title}</h3>
        <p>{listing.price} {listing.currency}</p>
      </div>
    </Link>
  )
}

// ✅ Короткая функция (8 строк)
export async function getListings() {
  try {
    const { data, error } = await supabase.from('listings').select()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}
```

### 2. Минимизируй связи

**API изолирован в одном файле:**

```typescript
// lib/supabase/queries.ts — ЕДИНСТВЕННОЕ место для DB запросов
export const listingsApi = {
  getAll: async () => { /* ... */ },
  getById: async (id: string) => { /* ... */ },
  getFeatured: async (limit: number) => { /* ... */ },
}

export const categoriesApi = {
  getAll: async () => { /* ... */ },
  getBySlug: async (slug: string) => { /* ... */ },
}
```

**Компоненты получают данные через props:**

```typescript
// ✅ No direct DB access
export function ListingGrid({ listings }: { listings: Listing[] }) {
  return <div>{listings.map(l => <ListingCard listing={l} />)}</div>
}
```

### 3. Один владелец ответственности

| Ответственность | Владелец | Файл |
|----------------|----------|------|
| DB queries | `listingsApi` | `lib/supabase/queries.ts` |
| Listing display | `ListingCard` | `components/listing/card.tsx` |
| Listing layout | `ListingGrid` | `components/listing/grid.tsx` |
| Error display | `ErrorState` | `components/ui/error-state.tsx` |
| Search | `SearchBar` | `components/ui/search-bar.tsx` |

### 4. Явность важнее магии

```typescript
// ✅ Explicit: clear what happens
export default async function HomePage() {
  const categoriesRes = await categoriesApi.getAll()
  const listingsRes = await listingsApi.getFeatured(6)
  
  return (
    <div>
      <CategoryGrid categories={categoriesRes.data} />
      <ListingGrid listings={listingsRes.data} />
    </div>
  )
}

// ❌ Magic: where does data come from?
export default function HomePage() {
  const { categories, listings } = useData() // ???
  return <div>...</div>
}
```

### 5. Ошибки — часть дизайна

**Все API вызовы возвращают структурированный ответ:**

```typescript
type ApiResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: string }

// Usage in page:
const result = await listingsApi.getAll()
if (result.error) {
  return <ErrorState message={result.error} />
}
return <ListingGrid listings={result.data} />
```

### 6. Код для людей

```typescript
// ✅ Readable names
interface ListingCardProps {
  listing: Listing
  featured?: boolean
}

function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString()} ${currency}`
}

const isListingNew = (createdAt: string): boolean => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return new Date(createdAt).getTime() > sevenDaysAgo
}

// ❌ Cryptic
function fmt(p: number, c: string) { return `${p} ${c}` }
const isNew = (d: string) => Date.now() - new Date(d).getTime() < 604800000
```

### 7. Минимум глобального состояния

**✅ Server Components — no state:**

```typescript
export default async function CategoryPage({ params }: Props) {
  const category = await categoriesApi.getBySlug(params.slug)
  const listings = await listingsApi.getAll({ category: params.slug })
  
  return (
    <div>
      <h1>{category.data.name}</h1>
      <ListingGrid listings={listings.data} />
    </div>
  )
}
```

**✅ Client Components — local state only:**

```typescript
'use client'
export function SearchBar() {
  const [search, setSearch] = useState('') // Local only
  return <input value={search} onChange={e => setSearch(e.target.value)} />
}
```

### 8. KISS

```typescript
// ✅ Simple function
export function formatPrice(price: number, currency: string) {
  return `${price.toLocaleString()} ${currency}`
}

// ❌ Over-engineered
class PriceFormatter {
  constructor(
    private config: FormatterConfig,
    private locale: LocaleProvider,
    private currency: CurrencyManager
  ) {}
  
  format(amount: MoneyValue): FormattedString {
    // 50 lines of abstraction
  }
}
```

## Component Patterns

### Server Component (default)

```typescript
// No 'use client' directive
export default async function Page() {
  const data = await api.getData()
  return <Component data={data} />
}
```

### Client Component (when needed)

```typescript
'use client'
export function InteractiveComponent() {
  const [state, setState] = useState()
  return <button onClick={() => setState(...)}>Click</button>
}
```

## Data Flow

```
1. User visits /listings
   ↓
2. app/listings/page.tsx (Server Component)
   ↓
3. Calls listingsApi.getAll()
   ↓
4. lib/supabase/queries.ts
   ↓
5. Returns { data, error }
   ↓
6. Page checks error
   ↓
7. Passes data to <ListingGrid />
   ↓
8. <ListingGrid /> renders <ListingCard /> for each item
```

## Error Handling Strategy

```typescript
// Level 1: API function
async function getListings() {
  try {
    const { data, error } = await supabase.from('listings').select()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}

// Level 2: Page component
const result = await listingsApi.getAll()
if (result.error) {
  return <ErrorState message={result.error} />
}

// Level 3: UI component
export function ErrorState({ message }: { message: string }) {
  return <div className="error">{message}</div>
}
```

## Performance Strategy

- **ISR**: `export const revalidate = 60` on static pages
- **Images**: Always use `next/image`
- **Loading**: Suspense + skeleton components
- **RSC**: Server Components by default = less JS

## Security

- Environment variables for credentials
- No API keys in client code
- Supabase RLS for row-level security
- Input validation on all forms

## Testing Strategy (future)

- Unit: API functions, utilities
- Integration: Component + API
- E2E: Critical user flows

---

**Remember:** Simple is better than complex. Explicit is better than implicit.
