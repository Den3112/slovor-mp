# 🏛️ Architecture

Technical architecture and decisions for SLOVOR Marketplace.

---

## High-Level Overview

```
┌───────────────────────────────┐
│          User Browser (Client)          │
└───────────────────────────────┘
                ↑
        HTTP/HTTPS Requests
                ↑
┌───────────────────────────────┐
│   Next.js 15 App Router (Server)      │
│  - Rendering (SSR, SSG, ISR)          │
│  - API Routes (/api/*)                │
│  - Middleware (Auth, Logging)         │
└───────────────────────────────┘
                ↑
        HTTPS API Calls
                ↑
┌───────────────────────────────┐
│      Supabase (PostgreSQL)            │
│  - Database (lists, categories, etc)  │
│  - Authentication (future)            │
│  - Storage (future image uploads)     │
│  - Row-Level Security (RLS)           │
└───────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15.1.3 (React 18)
- **Language:** TypeScript 5.7 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **Components:** Radix UI, Headless UI
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Backend
- **Server:** Next.js API Routes
- **Database:** Supabase (PostgreSQL 15)
- **Authentication:** Supabase Auth (future)
- **Storage:** Supabase Storage (future)

### Deployment
- **Frontend/Backend:** Vercel (Node.js runtime)
- **Database:** Supabase Cloud
- **DNS:** Vercel (default)
- **CDN:** Vercel Edge Network

### Development
- **Package Manager:** npm
- **Version Control:** Git
- **Code Quality:** ESLint, TypeScript, Prettier
- **Testing:** Jest (when needed)

---

## Project Structure

### Root Files
```
package.json           # Dependencies and scripts
tsconfig.json          # TypeScript configuration (strict mode)
next.config.ts         # Next.js configuration
tailwind.config.ts     # Tailwind CSS configuration
.eslintrc.json         # ESLint rules
.prettierrc.json       # Code formatting rules
.env.local             # Environment variables (local)
.env.example           # Environment template
.gitignore             # Git ignore rules
```

### App Directory (`/app`)
Next.js 15 App Router - pages and API routes.

```
app/
├─ page.tsx                 # Homepage (/)
├─ layout.tsx               # Root layout
├─ globals.css              # Global styles
├─ (pages)/
│  ├─ categories/
│  │  └─ [slug]/
│  │     └─ page.tsx      # Category page (/categories/[slug])
│  └─ listings/
│     ├─ page.tsx         # Listings page (/listings)
│     └─ [id]/
│        └─ page.tsx       # Listing detail (/listings/[id])
├─ api/
│  ├─ listings/
│  │  ├─ route.ts        # GET /api/listings
│  │  └─ [id]/
│  │     └─ route.ts     # GET /api/listings/[id]
│  └─ categories/
│     └─ route.ts        # GET /api/categories
├─ middleware.ts            # Request middleware
└─ error.tsx                 # Error boundary
```

### Components (`/components`)
React components organized by feature.

```
components/
├─ common/                  # Shared, reusable components
│  ├─ Button.tsx
│  ├─ Input.tsx
│  ├─ Modal.tsx
│  └─ LoadingSpinner.tsx
├─ layout/                  # Page layout components
│  ├─ Header.tsx
│  ├─ Footer.tsx
│  ├─ Navigation.tsx
│  └─ LanguageSwitcher.tsx
├─ listings/                # Listing-specific components
│  ├─ ListingCard.tsx
│  ├─ ListingGrid.tsx
│  ├─ ListingDetail.tsx
│  └─ ListingFilters.tsx
├─ categories/              # Category-specific components
│  ├─ CategoryCard.tsx
│  ├─ CategoryGrid.tsx
│  └─ CategoryHero.tsx
└─ index.ts                 # Barrel export (optional)
```

### Library (`/lib`)
Shared utilities, API clients, types.

```
lib/
├─ supabase.ts              # Supabase client instance
├─ types.ts                 # TypeScript types and interfaces
├─ constants.ts             # App constants
├─ utils.ts                 # Helper functions
├─ hooks.ts                 # Custom React hooks
├─ api/
│  ├─ listings.ts           # Listing queries
│  ├─ categories.ts         # Category queries
│  └─ index.ts              # API barrel export
└─ errors.ts                 # Error handling
```

### Database (`/supabase`)
Database migrations and schema definitions.

```
supabase/
├─ migrations/
│  ├─ 20231201_create_listings_table.sql
│  ├─ 20231201_create_categories_table.sql
│  ├─ 20231201_create_rls_policies.sql
│  └─ ...
└─ schema.sql                # Current database schema
```

### Configuration (`/config`)
Application configuration files.

```
config/
├─ categories.ts            # Category list and config
├─ languages.ts             # Supported languages
├─ navigation.ts            # Navigation menu structure
└─ seo.ts                   # SEO metadata
```

### Styles (`/styles`)
Global CSS files.

```
styles/
├─ globals.css              # Global styles (Tailwind imports)
├─ variables.css            # CSS variables
└─ animations.css            # Animation definitions
```

### Public (`/public`)
Static assets served by CDN.

```
public/
├─ images/
│  ├─ logo.svg
│  ├─ hero.jpg
│  └─ categories/
├─ icons/
│  └─ flags/
├─ favicon.ico
└─ manifest.json
```

---

## Data Flow

### Server-Side Rendering (SSR)
```
User Request
    ↑
Next.js Server
    ↑
Fetch data from Supabase
    ↑
Render React component
    ↑
Send HTML to browser
    ↑
Hydrate with JavaScript
    ↑
Interactive page
```

### Static Site Generation (SSG)
```
Build time:
  ↑
  Generate static pages
    ↑
  Fetch data once
    ↑
  Create HTML files
    ↑
  Deploy to CDN

Request time:
  ↑
  Serve cached HTML
    ↑
  No database query needed
    ↑
  Ultra-fast response
```

### Incremental Static Regeneration (ISR)
```
Request comes in
    ↑
Serve cached page
    ↑
In background: regenerate page
    ↑
If revalidate time passed: fetch fresh data
    ↑
Update cache
    ↑
Next request gets new page
```

---

## Database Schema

### Core Tables

**listings**
```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**categories**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Security: Row-Level Security (RLS)

Database policies control who can access what:

```sql
-- Allow public read-only access to listings
CREATE POLICY "Allow public read listings"
  ON listings FOR SELECT
  USING (true);

-- Only creators can update their listings (future)
CREATE POLICY "Allow update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## API Design

### Query Pattern
All data queries follow consistent pattern:

```typescript
// lib/api/listings.ts
export async function getListings(): Promise<Listing[]> {
  // 1. Validate input
  // 2. Query database
  // 3. Handle errors gracefully
  // 4. Return typed result
}
```

### Request/Response
```
GET /api/listings
Response: { listings: Listing[], count: number }

GET /api/listings/[id]
Response: { listing: Listing }

GET /api/categories
Response: { categories: Category[] }
```

### Error Handling
- Return meaningful error messages
- HTTP status codes (200, 400, 404, 500)
- Never expose sensitive database details
- Log errors server-side

---

## Performance Strategy

### Caching Layers
```
Browser Cache (HTTP headers)
    ↑
Vercel Edge Cache (CDN)
    ↑
ISR / Static HTML
    ↑
Supabase Cache (query results)
    ↑
PostgreSQL Database
```

### Image Optimization
- Use Next.js Image component
- Automatic format selection (WebP, AVIF)
- Responsive sizes
- Lazy loading

### Code Splitting
- Automatic by Next.js
- Lazy load heavy components
- Keep main bundle small

---

## Security

### Input Validation
- Server-side validation for all user input
- Type checking with TypeScript
- Sanitize before storing

### Authentication (Future)
- Supabase Auth for user management
- JWT tokens for API requests
- Secure session handling

### Environment Variables
- Public variables prefixed with `NEXT_PUBLIC_`
- Secret variables stay on server
- Never commit `.env.local`

### HTTPS
- Enforced by Vercel (production)
- Supabase enforces SSL/TLS
- All API requests encrypted

---

## Deployment

### Vercel

**Production (main branch)**
- Auto-deploy on push to main
- URL: slovor-mp.vercel.app
- Environment: Production

**Preview (dev branch)**
- Auto-deploy on push to dev
- URL: slovor-mp-git-dev.vercel.app
- Environment: Preview

### Build Process
```bash
1. Clone repository
2. Run npm install
3. Run npm run build
4. Deploy to Vercel Edge Network
5. Configure environment variables
6. Auto-start on incoming requests
```

### Monitoring
- Vercel Analytics
- Error tracking (can add Sentry)
- Performance monitoring (Web Vitals)

---

## Scalability

### Current
- Suitable for 100K+ monthly listings
- Handles 10K+ concurrent users
- Database indexed for quick queries

### Future Improvements
- Add Redis cache layer
- Search indexing (Elasticsearch)
- Image CDN (Cloudinary)
- Message queue (Bull, RabbitMQ)
- Monitoring dashboard (New Relic, DataDog)

---

## Key Decisions

### Why Next.js?
- Server-side rendering (SSR, SSG, ISR)
- File-based routing (simpler than manual routing)
- Built-in API routes
- Vercel first-class support
- Great TypeScript support

### Why Supabase?
- PostgreSQL (powerful, reliable)
- Built-in Row-Level Security
- Real-time capabilities (future)
- Generous free tier
- Open source option available

### Why Vercel?
- Native Next.js support
- Global CDN
- Automatic deployments
- Preview URLs for testing
- Great developer experience

### Why Tailwind CSS?
- Utility-first (fast development)
- Responsive design built-in
- Smaller bundle than frameworks
- Easy customization
- Great TypeScript support

---

## Architecture Evolution

As the project grows:

1. **Phase 1 (Current)** - Core listings and categories
2. **Phase 2** - User authentication and profiles
3. **Phase 3** - Messaging between users
4. **Phase 4** - Advanced search and recommendations
5. **Phase 5** - Mobile apps, analytics, etc

---

**Architecture Version:** 1.0  
**Last Updated:** December 26, 2025  
**Status:** Stable, ready for feature development
