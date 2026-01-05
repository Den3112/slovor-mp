# Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slovor-mp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**

   Run the migrations in Supabase SQL Editor in this order:
   - `supabase/migrations/20250102_create_profiles.sql`
   - `supabase/migrations/20250101_add_listing_localization.sql`
   - `supabase/migrations/20250104_create_favorites.sql`

5. **Seed the Database** (optional)
   ```bash
   node scripts/seed-with-real-images.js
   ```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run start` | Start production server |

## Useful Dev Scripts

| Script | Description |
|--------|-------------|
| `node scripts/seed-with-real-images.js` | Seed database with sample data |
| `node scripts/clear-listings.js` | Clear all listings from database |
| `node scripts/db-info.js` | Show database statistics |
