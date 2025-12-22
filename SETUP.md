# 🚀 Quick Setup Guide

## 📝 Prerequisites

1. Supabase project set up
2. `.env.local` file configured
3. Categories already in database (check Supabase dashboard)

## ⚡ Quick Start

### Step 1: Pull Latest Code
```bash
git pull origin dev
```

### Step 2: Clear Next.js Cache
```bash
rm -rf .next
```

### Step 3: Seed Database with Listings
```bash
npm run db:seed
```

This will:
- Create **10 listings per category**
- Generate **250 total listings** (for all 25 categories)
- Use **English language** by default
- Add **3 images per listing** (750 total images)

### Step 4: Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) ✅

---

## 🔄 Reseed Database

If you need to clear old listings and reseed:

### Option A: Via Supabase Dashboard (Recommended)
1. Go to Supabase dashboard
2. Navigate to **Table Editor** → **listings**
3. Click **Delete all rows**
4. Run: `npm run db:seed`

### Option B: Via SQL Query
1. Go to Supabase **SQL Editor**
2. Run:
```sql
DELETE FROM listings;
```
3. Run: `npm run db:seed`

---

## 🌍 Change Seed Language

To generate listings in Slovak or Czech:

1. Open `scripts/seed-with-real-images.js`
2. Find line: `const locale = 'en'`
3. Change to:
   - `'sk'` for Slovak
   - `'cs'` for Czech
4. Run: `npm run db:seed`

---

## 🛠️ Troubleshooting

### Port 3000 already in use
```bash
npx kill-port 3000
npm run dev
```

### Translations not working
```bash
rm -rf .next
npm run dev
```

### Images not loading
- Check `.env.local` has correct Supabase URL
- Verify Supabase storage bucket exists
- Check browser console for errors

---

## 📊 Project Structure

- **25 Categories** (Elektronika, Oblečenie, Dom a záhrada, etc.)
- **3 Languages** (English 🇬🇧, Slovenčina 🇸🇰, Čeština 🇨🇿)
- **10 Listings per category** = 250 total
- **3 Images per listing** = 750 total images

---

## ✅ Verify Setup

After running `npm run dev`, check:

1. ✅ Homepage loads
2. ✅ Categories visible (25 categories)
3. ✅ Listings visible in each category (10 per category)
4. ✅ Language switcher works (English/Slovak/Czech)
5. ✅ Images load correctly

---

## 📝 Environment Variables

Make sure `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these from: Supabase Dashboard → Project Settings → API
