# 🚀 Deployment Commands

## Quick Start

### 1. Pull Latest Changes
```bash
git pull origin dev
```

### 2. Install Dependencies (if needed)
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## Database Commands

### Reset Database (if needed)
```bash
npm run db:reset
```

### Seed Categories
```bash
npm run db:seed:categories
```

### Seed Listings (10 per category)
```bash
npm run db:seed
```

## 🛠️ Full Reset & Restart

If you need to completely reset everything:

```bash
# 1. Pull latest code
git pull origin dev

# 2. Install dependencies
npm install

# 3. Reset database
npm run db:reset

# 4. Seed categories (25 categories)
npm run db:seed:categories

# 5. Seed listings (10 per category = 250 listings)
npm run db:seed

# 6. Start dev server
npm run dev
```

## ⚙️ Environment Variables

Make sure you have `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🐛 Troubleshooting

### If server won't start:
```bash
# Kill any process on port 3000
npx kill-port 3000

# Then restart
npm run dev
```

### If translations don't work:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### If images don't load:
Check that your `.env.local` has correct Supabase credentials and that the database is seeded.

## 📝 Notes

- **25 Categories** - All categories from the database
- **10 Listings per category** - 250 total listings
- **3 Languages** - Slovak (default), Czech, English
- **Responsive Design** - Mobile-first approach
- **Image Fallback** - Automatic fallback to placeholder if image fails

## 📊 Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```
