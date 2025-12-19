# Slovor Marketplace

> **⚠️ ВАЖНО:** Перед началом работы обязательно прочтите [PRINCIPLES.md](./PRINCIPLES.md)!

Modern, type-safe marketplace application built with Next.js 16, Supabase, and TypeScript.

## 🔥 Core Principles

This project follows **8 mandatory principles** for clean code:

1. **Minimize code** - Small functions, small components
2. **Minimize connections** - Loose coupling
3. **One owner per responsibility** - Clear ownership
4. **Explicitness over magic** - No hidden logic
5. **Errors are part of design** - Not edge cases
6. **Code for humans** - Readability first
7. **Minimal global state** - Avoid chaos
8. **KISS** - Simple always wins

📖 **[Read full principles →](./PRINCIPLES.md)**  
🏗️ **[Architecture docs →](./ARCHITECTURE.md)**

## ✨ Features

- 🔍 Advanced search across all listings
- 🏷️ Organized categories with icons
- 🎨 Modern, responsive UI
- ⚡ Server-side rendering
- 📱 Mobile-first design
- 🔄 Real-time filters
- 🎯 100% TypeScript
- 🚀 Production ready

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, RSC)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp

# Install
npm install

# Setup env
cp .env.local.example .env.local
# Add your Supabase credentials

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
slovor-mp/
├── app/              # Pages (Next.js routes)
├── components/       # UI components
├── lib/              # Business logic, API
├── public/           # Static assets
├── PRINCIPLES.md     # 🔥 MANDATORY - Read first!
├── ARCHITECTURE.md   # Technical architecture
└── README.md         # This file
```

## 📖 Documentation

1. **[PRINCIPLES.md](./PRINCIPLES.md)** - 🔥 Read this FIRST! Mandatory coding principles
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture and patterns
3. **README.md** - This file (setup and overview)

## 🧰 Database Setup

Run in Supabase SQL Editor:

```sql
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
```

## ⚙️ Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📝 Scripts

```bash
npm run dev       # Development
npm run build     # Production build
npm start         # Start production
npm run lint      # Lint code
```

## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

## 🐛 Troubleshooting

**Build fails?**
- Check environment variables
- Verify Supabase connection
- Clear `.next` folder

**No data?**
- Check Supabase credentials
- Verify tables exist
- Check RLS policies

## 🤝 Contributing

**Before contributing:**
1. Read [PRINCIPLES.md](./PRINCIPLES.md) - MANDATORY
2. Follow checklist before commit
3. No code review without principles compliance

## 📄 License

Private project

## 👤 Author

**Den3112**  
GitHub: [@Den3112](https://github.com/Den3112)

---

**Status:** 🟢 Production Ready  
**Version:** 1.0.0  
**Built with:** ❤️ and **8 mandatory principles**
