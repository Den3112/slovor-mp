# Architecture & Design Principles

This document describes the core architecture principles and coding guidelines for the Slovor Marketplace project.

## 8 Core Principles

### 1. One Responsibility

Each component, function, and module should have a single, well-defined responsibility.

**Example:**
```typescript
// ❌ Bad: Component does too many things
function ListingPage() {
  // Fetches data, handles state, renders UI, manages forms
}

// ✅ Good: Separated concerns
function ListingPage() {
  const data = useListingData() // Data fetching
  return <ListingView data={data} /> // UI rendering
}
```

### 2. Separation of Concerns

Separate different aspects of the application into distinct layers:

- **Presentation Layer**: Components (UI)
- **Business Logic Layer**: Hooks, utilities
- **Data Layer**: API calls, queries

**Project Structure:**
```
app/           # Pages (Next.js routes)
components/    # UI components
lib/           # Business logic, utilities, API
```

### 3. Centralized Data Fetching

All data fetching logic is centralized in `lib/supabase/queries.ts`.

**Example:**
```typescript
// ✅ Good: All API calls in one place
export const listingsApi = {
  getAll: async () => { /* ... */ },
  getById: async (id) => { /* ... */ },
  getFeatured: async () => { /* ... */ },
}
```

### 4. Server Components by Default

Use React Server Components (RSC) for all pages and components unless interactivity is required.

**When to use Client Components (`'use client'`):**
- Forms with state
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- React hooks (useState, useEffect)

**Example:**
```typescript
// ✅ Server Component (default)
export default async function HomePage() {
  const listings = await listingsApi.getAll()
  return <ListingGrid listings={listings} />
}

// ✅ Client Component (when needed)
'use client'
export function SearchBar() {
  const [search, setSearch] = useState('')
  return <input value={search} onChange={e => setSearch(e.target.value)} />
}
```

### 5. Graceful Error Handling

All API calls return a structured response with error handling:

```typescript
type ApiResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: string }

// Usage
const result = await listingsApi.getAll()
if (result.error) {
  return <ErrorState message={result.error} />
}
return <ListingGrid listings={result.data} />
```

### 6. Type Safety

Full TypeScript type coverage. No `any` types.

**Example:**
```typescript
// ✅ Good: Proper types
interface Listing {
  id: string
  title: string
  price: number
  currency: string
}

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  // ...
}
```

### 7. Component Composition

Build complex UIs from small, reusable components.

**Example:**
```typescript
// Small, focused components
function ListingCard({ listing }) { /* ... */ }
function ListingGrid({ listings }) {
  return listings.map(listing => <ListingCard listing={listing} />)
}

// Composed in pages
function HomePage() {
  return <ListingGrid listings={data} />
}
```

### 8. Performance Optimization

- Use Next.js Image component for images
- Implement loading states (Suspense, skeletons)
- ISR (Incremental Static Regeneration) with `revalidate`
- Client-side state only when necessary

**Example:**
```typescript
// ISR with 60-second revalidation
export const revalidate = 60

// Optimized images
import Image from 'next/image'
<Image src={url} width={800} height={600} alt="..." />
```

## File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `listing-card.tsx`)
- **Pages**: Next.js conventions (`page.tsx`, `layout.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatPrice.ts`)
- **Types**: `PascalCase` interfaces (e.g., `Listing`, `Category`)

## Code Style Guidelines

### Component Structure

```typescript
// 1. Imports
import Link from 'next/link'
import type { Listing } from '@/lib/supabase/queries'

// 2. Types/Interfaces
interface ListingCardProps {
  listing: Listing
}

// 3. Component
export function ListingCard({ listing }: ListingCardProps) {
  // 4. Hooks (if client component)
  // 5. Event handlers
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### API Response Pattern

```typescript
// Always wrap responses
export async function getSomething() {
  try {
    const { data, error } = await supabase.from('table').select()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}
```

### Import Order

1. External libraries (React, Next.js)
2. Internal components
3. Internal utilities/types
4. Styles

```typescript
import { useState } from 'react'
import Link from 'next/link'
import { ListingCard } from '@/components/listing/card'
import { formatPrice } from '@/lib/utils'
import type { Listing } from '@/lib/types'
```

## Project Conventions

### Data Flow

```
Page (RSC) → fetch data → pass props → Component
  ↓
Error boundary → ErrorState component
  ↓
Loading state → Skeleton/Suspense
```

### URL Structure

- Homepage: `/`
- All listings: `/listings`
- Listing detail: `/listings/[id]`
- Category: `/categories/[slug]`
- Search: `/listings?search=query`

### Component Organization

```
components/
├── category/        # Category-specific components
│   ├── card.tsx
│   └── grid.tsx
├── listing/         # Listing-specific components
│   ├── card.tsx
│   ├── grid.tsx
│   └── filters.tsx
├── layout/          # Layout components
│   ├── header.tsx
│   └── footer.tsx
└── ui/              # Generic UI components
    ├── error-state.tsx
    ├── empty-state.tsx
    └── loading-skeleton.tsx
```

## Testing Strategy (Future)

1. **Unit tests**: Components, utilities
2. **Integration tests**: API calls, data flows
3. **E2E tests**: Critical user journeys

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90

## Security Considerations

1. **Environment Variables**: Never commit `.env.local`
2. **API Keys**: Use Supabase RLS (Row Level Security)
3. **Input Validation**: Validate all user inputs
4. **XSS Protection**: Use React's built-in escaping

## Future Improvements

- [ ] Add unit tests (Jest, React Testing Library)
- [ ] Implement authentication (Supabase Auth)
- [ ] Add image uploads (Supabase Storage or Cloudinary)
- [ ] Real-time updates (Supabase Realtime)
- [ ] Analytics (Vercel Analytics)
- [ ] SEO optimization (metadata, sitemap)

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Best Practices](https://typescript-eslint.io/)
