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
🌍 **[Environment setup →](./ENVIRONMENTS.md)**

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

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

🔧 **[Full environment setup guide →](./ENVIRONMENTS.md)**

## 📁 Project Structure

```
slovor-mp/
├── app/              # Pages (Next.js routes)
├── components/       # UI components
├── lib/              # Business logic, API
├── public/           # Static assets
├── PRINCIPLES.md     # 🔥 MANDATORY - Read first!
├── ARCHITECTURE.md   # Technical architecture
├── ENVIRONMENTS.md   # Environment configuration
├── PROJECT_CONTEXT.md # Full project context
└── README.md         # This file
```

## 📖 Documentation

### For Developers
1. **[PRINCIPLES.md](./PRINCIPLES.md)** - 🔥 Read this FIRST! Mandatory coding principles
2. **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** - Full project context for AI/devs
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture and patterns
4. **[ENVIRONMENTS.md](./ENVIRONMENTS.md)** - Environment configuration guide
5. **[CHANGELOG.md](./CHANGELOG.md)** - All changes log

### Quick Links
- 🎯 [Core Principles](./PRINCIPLES.md) - How we write code
- 🏗️ [Architecture](./ARCHITECTURE.md) - How we structure code
- 🌍 [Environments](./ENVIRONMENTS.md) - How we deploy code
- 📚 [Context](./PROJECT_CONTEXT.md) - Why we built this

## 🧰 Database Setup

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
  ('Sports & Hobbies', 'sports-hobbies', '⚽'),
  ('Services', 'services', '🔧'),
  ('Jobs', 'jobs', '💼');
```

## ⚙️ Environment Variables

### Local Development

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEBUG_MODE=true
```

### Vercel (Production/Preview)

Add in Vercel Dashboard → Settings → Environment Variables:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Select appropriate environment:
- ☑️ Production (main branch)
- ☑️ Preview (PR branches)

🔐 **[Full security guide →](./ENVIRONMENTS.md#security-best-practices)**

## 📝 Scripts

```bash
npm run dev       # Development server (localhost:3000)
npm run build     # Production build (test before deploy)
npm start         # Start production server
npm run lint      # Lint code (check for errors)
```

## 🚀 Deployment

### Automatic (Recommended)

```bash
# Push to main branch
git push origin main
# Vercel auto-deploys to production
```

### Manual (Vercel CLI)

```bash
# Install CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

📦 **[Full deployment guide →](./ENVIRONMENTS.md#deployment-flow)**

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working

1. Check `.env.local` exists and has correct values
2. Restart dev server (`npm run dev`)
3. Verify Vercel environment variables are set

### Database Connection Issues

1. Verify Supabase URL is correct
2. Check anon key matches the project
3. Ensure database tables exist (run SQL setup)

🔧 **[Full troubleshooting guide →](./ENVIRONMENTS.md#troubleshooting)**

## 🤝 Contributing

**Before contributing:**

1. ✅ Read [PRINCIPLES.md](./PRINCIPLES.md) - MANDATORY
2. ✅ Read [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) - Understanding
3. ✅ Follow checklist before commit (in PRINCIPLES.md)
4. ✅ Update [CHANGELOG.md](./CHANGELOG.md) with your changes

**Pull Request checklist:**
- [ ] Code follows 8 principles
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] CHANGELOG.md updated
- [ ] Tests added (when available)

## 📄 License

Private project

## 👤 Author

**Den3112**  
GitHub: [@Den3112](https://github.com/Den3112)

## 🙏 Acknowledgments

- Next.js team for amazing framework
- Supabase for backend infrastructure
- Vercel for hosting platform

---

**Status:** 🟢 Production Ready  
**Version:** 1.0.0  
**Built with:** ❤️ and **8 mandatory principles**

---

### 🔗 Quick Links

- 🌐 [Live Site](https://slovor-mp.vercel.app)
- 📚 [Documentation](./PROJECT_CONTEXT.md)
- 🐛 [Issues](https://github.com/Den3112/slovor-mp/issues)
- 💬 [Discussions](https://github.com/Den3112/slovor-mp/discussions)
