# Architecture: Layered Modular Monolith (Next.js 16)

## Overview
The project follows a Layered Architecture adapted for Next.js 16 App Router, with modular feature boundaries. It prioritizes performance (Edge runtime), security (Supabase RLS), and maintainability.

## Decision Rationale
- **Project type**: Marketplace (Classifieds)
- **Tech stack**: Next.js 16, Supabase, Tailwind 4
- **Key factor**: High UI complexity and the need for strict data security through RLS.

## Folder Structure
```
app/
├── [locale]/             # Presentation Layer: localized routes/pages
├── api/                  # Presentation Layer: backend endpoints (mostly Edge)
components/
├── features/             # Business & UI Layer: domain-specific modules
│   ├── dashboard/        # Customer/Admin CRM
│   ├── listing/          # Discovery & Detail pages
│   └── search/           # Filter & Search logic
├── ui/                   # Design System: reusable base components
lib/
├── types/                # Domain Layer: TypeScript definitions
├── utils/                # Service Layer: shared logic, helpers
├── hooks/                # Service Layer: reusable React hooks
supabase/
├── migrations/           # Data Layer: schema and RLS policies
```

## Dependency Rules
- **Inner Layer**: `lib/types` and `lib/utils` should have minimal dependencies.
- **Outer Layer**: `app/` and `components/features/` consume everything else.

- ✅ `app/` -> `components/` -> `lib/` -> `supabase/`
- ✅ `components/features/` -> `components/ui/`
- ❌ `lib/` -> `components/` (Circular dependency)
- ❌ `components/ui/` -> `components/features/`

## Key Principles
1. **Feature Encapsulation**: Components within `components/features/` should stay within their domain (e.g., `dashboard` code stays in `dashboard`).
2. **Database First Security**: All logic must assume Supabase RLS is the primary security gate.
3. **Optimistic UI**: Use Framer Motion and local state for "Pro Max" snappy feel.
4. **Localization First**: All UI text must be wrapped in i18n hooks/components.

## Code Examples

### Standard Page Pattern
```tsx
// app/[locale]/listings/page.tsx
export default async function Page({ params }) {
  const { locale } = await params;
  // Use server components for data fetching
  const listings = await getListings();
  return <ListingGrid listings={listings} />;
}
```

### Business Component Pattern
```tsx
// components/features/listing/listing-card.tsx
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

export function ListingCard({ listing }) {
  const { t } = useTranslation();
  return <Card>{/* Animated UI with Framer Motion */}</Card>;
}
```

## Anti-Patterns
- ❌ **Inline SQL**: Never use raw SQL in components; use Supabase client with RLS.
- ❌ **Hardcoded Strings**: Never use plain text for user-facing content (use i18next).
- ❌ **Legacy Classes**: Avoid `rounded-lg` or ad-hoc Tailwind colors; use the Design System tokens.
