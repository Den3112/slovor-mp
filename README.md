# 🛒 Slovor Marketplace

> **Premium Slovakian Classifieds Marketplace** - Built with Next.js 15, React 19, Supabase, Tailwind CSS. Featuring "Avant-Garde" UI/UX.

**Live Demo:** [slovor-mp.vercel.app](https://slovor-mp.vercel.app)
**Dev Preview:** [slovor-mp-git-dev.vercel.app](https://slovor-mp-git-dev.vercel.app)

---

## 📚 Project Documentation

Our documentation is located in the **`docs/` directory** to keep the project organized.

**Quick Access:**

- [🚀 **Investor Roadmap**](docs/project/ROADMAP_INVESTOR.md) (Current Focus)
- [📝 Documentation Index](docs/INDEX.md)
- [🎯 Quick Start Guide](docs/guides/QUICK_START.md)
- [🔥 Coding Principles (MANDATORY)](docs/architecture/PRINCIPLES.md)
- [🏛️ Architecture](docs/architecture/ARCHITECTURE.md)

---

## 🚀 Quick Start (Developers)

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
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌳 Branch Structure

- **`main`** → Production-ready, stable code (deployed).
- **`dev`** → Active development branch. Feature branches merge here.
- **`docs`** → All project documentation and roadmaps.

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

### 🚧 In Focus (See [Roadmap](docs/project/ROADMAP.md))

- Premium User Dashboard
- Advanced Media Management (File Uploads)
- Smart Search & discovery interactions

---

## 🤝 Contributing

1. Read [Setup Guide](docs/guides/SETUP.md).
2. Create a feature branch from `dev`.
3. Ensure type safety and linting passes.
4. Create a PR to `dev`.

---

**Last Updated:** 2026-01-05
**Maintained by:** [@Den3112](https://github.com/Den3112)
