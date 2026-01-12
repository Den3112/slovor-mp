# 🛒 Slovor Marketplace

> **Premium Slovakian Classifieds Marketplace** - Built with Next.js 15, React 19, Supabase, Tailwind CSS. Featuring "Avant-Garde" UI/UX.

**Live Demo:** [slovor-mp.vercel.app](https://slovor-mp.vercel.app)
**Dev Preview:** [slovor-mp-git-dev.vercel.app](https://slovor-mp-git-dev.vercel.app)

---

## 📚 Project Documentation

All documentation has been moved to the **`docs` branch** for better organization.

**Quick Access:**

- [📖 **Browse All Documentation**](https://github.com/Den3112/slovor-mp/tree/docs) (Switch to `docs` branch)
- 🚀 **Investor Roadmap** - See `docs/project/ROADMAP_INVESTOR.md` in `docs` branch
- 🎯 **Quick Start Guide** - See `docs/guides/QUICK_START.md` in `docs` branch
- 🔥 **Coding Principles** - See `docs/architecture/PRINCIPLES.md` in `docs` branch

To access documentation locally:
```bash
git checkout docs
```


---

## 🚀 Quick Start (Developers)

### Option 1: Docker (Recommended) 🐳

```bash
# Clone and run (works out of the box!)
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp

# Run setup script (optional - creates .env.local)
./scripts/setup.sh      # Unix/Mac
# or
.\scripts\setup.ps1     # Windows PowerShell

# Start the app
docker-compose up -d --build
```

Open [http://localhost:3000](http://localhost:3000)

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp

# Switch to development branch
git checkout dev

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev

# Run verification (Lint, Types, Build)
npm run verify

# Run Tests
npm test
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌳 Branch Structure

- **`main`** → Production-ready, stable code (deployed to production).
- **`dev`** → Active development branch. All feature branches merge here first.
- **`docs`** → **Documentation only**. Contains all project documentation, guides, and architecture docs.


---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS, Framer Motion
- **Database:** Supabase (Auth, Database, Storage)
- **Deployment:** Vercel
- **Language:** TypeScript (Strict)

---

## 📜 Project Status

**Current Phase:** Beta Development / Investor-Ready Polish

### ✅ Completed

- Full "Avant-Garde" Design System
- Supabase Integration & RLS Policies
- Multi-language Framework (EN/SK)
- Category & Listing Discovery Flow
- Successfull Vercel Deployment

### 🚧 In Focus (See Roadmap in `docs` branch)


- Premium User Dashboard
- Advanced Media Management (File Uploads)
- Smart Search & discovery interactions

---

## 🤝 Contributing

1. Read the Setup Guide in the `docs` branch (`docs/guides/SETUP.md`).
2. Create a feature branch from `dev`.
3. Ensure type safety and linting passes.
4. Create a PR to `dev`.


---

**Last Updated:** 2026-01-05
**Maintained by:** [@Den3112](https://github.com/Den3112)
