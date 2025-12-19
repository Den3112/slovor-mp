# Slovor Marketplace

Modern, type-safe marketplace application built with Next.js 16, Supabase, and TypeScript.

## 🎯 Overview

Slovor is a full-featured marketplace platform for buying and selling goods and services. Built with modern web technologies following best practices and clean architecture principles.

## ✨ Features

- 🔍 **Advanced Search** - Real-time search across all listings
- 🏷️ **Category Browsing** - Organized categories with icons
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Performance** - Server-side rendering and optimized images
- 📱 **Mobile-First** - Fully responsive design
- 🔄 **Real-time Filters** - Price range and sorting
- 🎯 **Type-Safe** - Full TypeScript coverage
- 🚀 **Production Ready** - Deployed on Vercel

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel
- **Images:** Next.js Image Optimization

## 📚 Architecture

This project follows **8 core principles** for clean, maintainable code:

1. **One Responsibility** - Each component has a single purpose
2. **Separation of Concerns** - Clear layer boundaries
3. **Centralized Data Fetching** - All API calls in `lib/supabase/queries.ts`
4. **Server Components by Default** - Client components only when needed
5. **Graceful Error Handling** - Structured error responses
6. **Type Safety** - Full TypeScript, no `any`
7. **Component Composition** - Small, reusable components
8. **Performance Optimization** - ISR, Image optimization, loading states

📖 **[Read full architecture documentation →](./ARCHITECTURE.md)**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Setup

Create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Database Setup

Run this SQL in Supabase SQL Editor:

```sql
-- Create tables
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  listing_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  image_url TEXT,
  category_id UUID REFERENCES categories(id),
  location TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_created ON listings(created_at DESC);

-- Insert sample data
INSERT INTO categories (name, slug, icon) VALUES
  ('Electronics', 'electronics', '📱'),
  ('Vehicles', 'vehicles', '🚗'),
  ('Real Estate', 'real-estate', '🏠'),
  ('Fashion', 'fashion', '👗'),
  ('Home & Garden', 'home-garden', '🛋️'),
  ('Sports & Hobbies', 'sports-hobbies', '⚽'),
  ('Services', 'services', '🔧'),
  ('Jobs', 'jobs', '💼');
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
slovor-mp/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── not-found.tsx      # 404 page
│   ├── listings/          # Listings pages
│   │   ├── page.tsx       # All listings
│   │   └── [id]/         # Listing detail
│   └── categories/        # Category pages
│       └── [slug]/       # Category detail
├── components/            # React components
│   ├── category/         # Category components
│   ├── listing/          # Listing components
│   ├── layout/           # Header, Footer
│   └── ui/               # Reusable UI components
├── lib/                  # Business logic
│   └── supabase/        # Database queries
├── public/              # Static assets
└── ARCHITECTURE.md      # Architecture docs
```

## 🎨 Component Library

### UI Components

- `SearchBar` - Hero search with routing
- `ErrorState` - Error display component
- `EmptyState` - No results placeholder
- `Breadcrumbs` - Navigation breadcrumbs
- `LoadingSkeleton` - Loading placeholders

### Domain Components

- `ListingCard` - Listing display with badges
- `ListingGrid` - Responsive listing grid
- `ListingFilters` - Price and sort filters
- `CategoryCard` - Category display
- `CategoryGrid` - Category grid layout

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Den3112/slovor-mp)

1. Push to GitHub
2. Import repository to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build production
npm run build

# Start production server
npm start
```

## 📊 Performance

- ✅ Server-Side Rendering (SSR)
- ✅ Incremental Static Regeneration (ISR)
- ✅ Image Optimization
- ✅ Code Splitting
- ✅ Loading States

## 🔐 Security

- Environment variables for sensitive data
- Supabase RLS (Row Level Security) ready
- Input validation
- XSS protection via React

## 🧪 Testing (Planned)

- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Playwright

## 📝 Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm start         # Start production
npm run lint      # Lint code
npm run type-check # TypeScript check
```

## 🐛 Troubleshooting

### Build Fails

1. Check environment variables are set
2. Verify Supabase connection
3. Clear `.next` folder and rebuild

### No Data Showing

1. Verify Supabase credentials
2. Check database tables exist
3. Disable Supabase RLS for testing

### TypeScript Errors

```bash
npm run type-check
```

## 🤝 Contributing

Contributions are welcome! Please read [ARCHITECTURE.md](./ARCHITECTURE.md) first.

## 📄 License

Private project

## 👤 Author

**Den3112**

- GitHub: [@Den3112](https://github.com/Den3112)

## 🙏 Acknowledgments

- Next.js team for amazing framework
- Supabase for backend infrastructure
- Vercel for hosting platform

---

**Status:** 🟢 Production Ready  
**Version:** 1.0.0  
**Last Updated:** December 19, 2025
