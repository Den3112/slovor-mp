# Slovor Marketplace

> **⚠️ ВАЖНО:** Перед началом работы обязательно прочтите:
> 1. [PRINCIPLES.md](./PRINCIPLES.md) - 🔥 ОБЯЗАТЕЛЬНЮ
> 2. [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) - Полный контекст
> 3. [DEVELOPMENT.md](./DEVELOPMENT.md) - Git Flow и Vercel

> **🧹 ПЕРВЫЙ РАЗ?** Сделай чистку main: [QUICK_START.md](./QUICK_START.md)

Modern, type-safe marketplace application built with Next.js 16, Supabase, and TypeScript.

---

## 🧹 Clean Main Branch (First Time Setup)

**Если это твой первый раз после setup, сделай чистку:**

```bash
# Quick way
cd slovor-mp
git checkout dev
chmod +x scripts/clean-main-branch.sh
./scripts/clean-main-branch.sh
```

**Результат:**
- `main` → 1 чистый production commit
- `dev` → вся история разработки (14+ commits)

📖 **[Полная инструкция →](./CLEAN_MAIN_BRANCH.md)**

---

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
📚 **[Project context →](./PROJECT_CONTEXT.md)**  
🔧 **[Development guide →](./DEVELOPMENT.md)**

---

## 🌳 Git Flow

```
main (production)  →  https://slovor-mp.vercel.app (CLEAN HISTORY)
  ↓
dev (development)  →  https://slovor-mp-git-dev.vercel.app (FULL HISTORY)
  ↓
feature/* (local)  →  Local development
```

**Daily Work:**
```bash
# Always work on dev
git checkout dev
git pull origin dev
# ... make changes ...
git push origin dev  # Auto-deploys to Preview

# Release to production (via PR)
# GitHub: dev → main (Squash and merge)
```

📖 **[Full Git Flow guide →](./DEVELOPMENT.md)**

---

## ✨ Features

- 🔍 Advanced search across all listings
- 🏷️ Organized categories with icons
- 🎨 Modern, responsive UI
- ⚡ Server-side rendering
- 📱 Mobile-first design
- 🔄 Real-time filters
- 🎯 100% TypeScript
- 🚀 Production ready

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, RSC)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel (auto-deploy)

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Setup Database

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

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. (First Time) Clean Main Branch

```bash
git checkout dev
chmod +x scripts/clean-main-branch.sh
./scripts/clean-main-branch.sh
```

This creates clean production history. See [QUICK_START.md](./QUICK_START.md)

---

## 📁 Project Structure

```
slovor-mp/
├── app/                # Pages (Next.js routes)
├── components/         # UI components
├── lib/                # Business logic, API
├── public/             # Static assets
├── scripts/            # Utility scripts
├── PRINCIPLES.md       # 🔥 MANDATORY - Read first!
├── PROJECT_CONTEXT.md  # Full project context
├── DEVELOPMENT.md      # Git Flow, Vercel setup
├── CLEAN_MAIN_BRANCH.md # Branch cleanup guide
├── QUICK_START.md      # Quick cleanup instructions
├── ARCHITECTURE.md     # Technical architecture
├── CHANGELOG.md        # Version history
└── README.md           # This file
```

---

## 📖 Documentation

| File | Purpose | Priority |
|------|---------|----------|
| [PRINCIPLES.md](./PRINCIPLES.md) | 🔥 Mandatory coding principles | **HIGH** |
| [QUICK_START.md](./QUICK_START.md) | Clean main branch (first time) | **HIGH** |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Git Flow, Vercel, workflows | **HIGH** |
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | Full project context | **MEDIUM** |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture | **MEDIUM** |
| [CLEAN_MAIN_BRANCH.md](./CLEAN_MAIN_BRANCH.md) | Detailed cleanup guide | **LOW** |
| [CHANGELOG.md](./CHANGELOG.md) | Version history | **LOW** |
| [README.md](./README.md) | This file (overview) | **LOW** |

**For new developers:** Read in this order!

---

## 📝 Scripts

```bash
npm run dev       # Development server
npm run build     # Production build (must pass!)
npm start         # Start production server
npm run lint      # Lint code

# Utility scripts
./scripts/clean-main-branch.sh  # Clean main branch (first time)
```

---

## 🚀 Deployment

### Vercel Setup

1. **Connect GitHub repository**
2. **Set branches:**
   - Production: `main` → slovor-mp.vercel.app
   - Preview: `dev` → slovor-mp-git-dev.vercel.app
3. **Add environment variables**
4. **Deploy!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

📖 **[Detailed setup guide →](./DEVELOPMENT.md)**

---

## ✅ Pre-Commit Checklist

### Before pushing to `dev`:

- [ ] Code follows 8 principles
- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] Tested locally

### Before merging to `main`:

- [ ] Tested on dev environment
- [ ] No critical bugs
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Use "Squash and merge"

---

## 🐛 Troubleshooting

**Build fails?**
- Check environment variables
- Run `npm run build` locally
- Clear `.next` folder

**No data showing?**
- Verify Supabase credentials
- Check database tables exist
- Check RLS policies

**Deployment issues?**
- See [DEVELOPMENT.md](./DEVELOPMENT.md) troubleshooting section

**Need to clean main branch?**
- See [QUICK_START.md](./QUICK_START.md)

---

## 🤝 Contributing

**Before contributing:**

1. ✅ Read [PRINCIPLES.md](./PRINCIPLES.md) - MANDATORY
2. ✅ Read [DEVELOPMENT.md](./DEVELOPMENT.md) - Git Flow
3. ✅ Follow pre-commit checklist
4. ✅ Create PR from `dev` to `main` (Squash merge!)

---

## 📊 Current Status

**Version:** 1.0.0  
**Status:** 🟢 Production Ready  

**Branches:**
- **main:** Clean history (1 commit after cleanup)
- **dev:** Full history (14+ commits)

**Environments:**
- **Production:** https://slovor-mp.vercel.app (✅ Live)
- **Development:** https://slovor-mp-git-dev.vercel.app (✅ Live)

---

## 📄 License

Private project

---

## 👤 Author

**Den3112**  
GitHub: [@Den3112](https://github.com/Den3112)

---

**Built with:** ❤️ and **8 mandatory principles**  
**Branch strategy:** Clean `main` + Full `dev` history
