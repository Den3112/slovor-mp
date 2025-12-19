# Slovor Marketplace

Next.js marketplace application with Supabase backend and Cloudinary image optimization.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Images:** Cloudinary
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **TypeScript:** Full type safety

## Project Structure

```
slovor-mp/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── listings/          # Listings pages
│   └── categories/        # Category pages
├── components/            # React components
│   ├── category/         # Category components
│   ├── listing/          # Listing components
│   ├── layout/           # Layout components (header, footer)
│   └── ui/               # UI components (error states, etc.)
├── lib/                  # Libraries and utilities
│   └── supabase/        # Supabase client and queries
├── styles/              # Global styles
└── public/              # Static assets
```

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Supabase Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  listing_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create listings table
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

-- Insert sample categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Electronics', 'electronics', '📱'),
  ('Vehicles', 'vehicles', '🚗'),
  ('Real Estate', 'real-estate', '🏠'),
  ('Fashion', 'fashion', '👗'),
  ('Home & Garden', 'home-garden', '🛋️'),
  ('Sports', 'sports', '⚽'),
  ('Books', 'books', '📚'),
  ('Pets', 'pets', '🐶');

-- Insert sample listings (optional)
INSERT INTO listings (title, description, price, category_id, location, image_url)
SELECT 
  'Sample Listing ' || generate_series,
  'This is a sample listing description',
  (RANDOM() * 1000)::NUMERIC(10,2),
  (SELECT id FROM categories ORDER BY RANDOM() LIMIT 1),
  'Bratislava, Slovakia',
  'https://via.placeholder.com/400x300'
FROM generate_series(1, 20);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Option 1: Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Features

- ✅ Server-side rendering (SSR)
- ✅ Supabase PostgreSQL database
- ✅ Category browsing
- ✅ Listing search and filtering
- ✅ Responsive design (mobile-first)
- ✅ Image optimization with Next.js Image
- ✅ TypeScript type safety
- ✅ Error handling
- ✅ SEO optimized

## Current Status

**Version:** 0.1.0  
**Status:** Production Ready  
**Last Updated:** December 19, 2025

### Recent Changes

- ✅ Added Supabase integration
- ✅ Created all missing components
- ✅ Fixed build errors
- ✅ Ready for Vercel deployment

## Troubleshooting

### Build Fails on Vercel

1. Check environment variables are set correctly
2. Ensure Supabase database is accessible
3. Verify `.env.local.example` matches your `.env.local`

### No Data Showing

1. Check Supabase credentials
2. Verify database tables exist
3. Check Supabase RLS policies (disable for testing)

## License

Private project

## Author

Den3112
