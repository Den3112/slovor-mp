# 🌍 Multilingual Setup Guide

## ✅ What's New

### 1. Category-Specific Images
- **Electronics**: iPhone, laptops, cameras
- **Clothing**: Fashion, shoes, jackets
- **Vehicles**: Cars, motorcycles
- **Real Estate**: Houses, apartments
- And 21 more categories!

### 2. Multilingual Listings
- **English** (default)
- **Slovak** (slovenčina)
- **Czech** (čeština)

## 🚀 Quick Start

### Step 1: Add Translation Columns

Open **Supabase SQL Editor** and run:

```sql
-- Add multilingual support for listings
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS title_sk TEXT,
  ADD COLUMN IF NOT EXISTS title_cs TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_sk TEXT,
  ADD COLUMN IF NOT EXISTS description_cs TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Copy existing title/description to English columns
UPDATE listings 
SET 
  title_en = title,
  description_en = description
WHERE title_en IS NULL;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_listings_title_en ON listings(title_en);
CREATE INDEX IF NOT EXISTS idx_listings_title_sk ON listings(title_sk);
CREATE INDEX IF NOT EXISTS idx_listings_title_cs ON listings(title_cs);
```

### Step 2: Seed Realistic Data

```bash
# Get latest code
git pull origin dev

# Reset categories and seed realistic listings
npm run db:full-reset

# Start dev server
npm run dev
```

## 📸 Category-Specific Content

### Electronics
- **Products**: iPhone 13 Pro, MacBook Air M2, Sony Headphones
- **Images**: Laptops, smartphones, cameras, headphones

### Clothing
- **Products**: Nike Air Max, Levi's Jeans, North Face Jacket
- **Images**: Fashion, shoes, jackets, dresses

### Vehicles
- **Products**: BMW 320d, Audi A4, VW Golf GTI
- **Images**: Cars, motorcycles, trucks

### Real Estate
- **Products**: 2-Bedroom Apartment, Modern Villa
- **Images**: Houses, apartments, buildings

### And 21 More Categories!
Each with specific products and relevant images from Unsplash.

## 🌐 Language Support

### Change Default Language

Edit `scripts/seed-with-real-images.js`:

```javascript
const locale = 'en'; // Change to 'sk' or 'cs'
```

Then run:
```bash
npm run db:seed
```

### Supported Languages

1. **English (en)** - Default
   - title_en, description_en
   
2. **Slovak (sk)**
   - title_sk, description_sk
   
3. **Czech (cs)**
   - title_cs, description_cs

## 💡 Examples

### Electronics Category

**English**:
- Title: "iPhone 13 Pro"
- Description: "High-quality iPhone 13 Pro in excellent condition..."
- Images: iPhone photos from Unsplash

**Slovak**:
- Title: "iPhone 13 Pro"
- Description: "Vysokokvalitný iPhone 13 Pro v perfektnom stave..."
- Images: Same iPhone photos

**Czech**:
- Title: "iPhone 13 Pro"
- Description: "Vysokokvalitní iPhone 13 Pro v perfektním stavu..."
- Images: Same iPhone photos

## ⚙️ Technical Details

### Database Schema

```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  title_sk TEXT,
  title_cs TEXT,
  title_en TEXT,
  description_sk TEXT,
  description_cs TEXT,
  description_en TEXT,
  images TEXT[],
  -- ... other fields
);
```

### Image Sources

- **Provider**: Unsplash
- **Format**: `https://source.unsplash.com/1200x900/?{keyword}&sig={seed}`
- **Keywords**: Category-specific (e.g., "laptop", "car", "house")

## 📊 Results

 After running `npm run db:full-reset`:

- **25 Categories** (Electronics, Clothing, Vehicles, etc.)
- **250 Listings** (10 per category)
- **750 Images** (3 per listing, category-specific)
- **Multilingual** (English by default)

## 🐛 Troubleshooting

### Images not loading?
- Check internet connection (Unsplash requires internet)
- Try different category slug
- Verify images array is not null

### Translations not showing?
- Run SQL migration first (Step 1)
- Check locale in seed script
- Verify database has translation columns

## ✅ Verify Setup

```bash
# Check database
npm run db:info

# Should show:
# - 25 categories
# - 250 listings
# - Each listing has category-relevant title
```

---

**Ready!** Open [http://localhost:3000](http://localhost:3000) and see realistic, category-specific listings! 🎉
