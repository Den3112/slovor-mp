# Slovor Marketplace

> **Modern marketplace application** built with Next.js 16, Supabase, and TypeScript.

---

## 🚀 Quick Start

```bash
# Install
npm install

# Setup environment
cp .env.example .env.local
# Add Supabase credentials

# Run
npm run dev
# Open http://localhost:3000
```

---

## 📚 Documentation

**All documentation is in `docs` branch:**

```bash
git checkout docs
cat principles/PRINCIPLES.md  # Read principles (MANDATORY)
cat architecture/ARCHITECTURE.md
git checkout dev
```

**Or:** [View docs on GitHub](https://github.com/Den3112/slovor-mp/tree/docs)

---

## 🤖 For AI/Developers

**Read first:** [`.github/AI_GUIDE.md`](./.github/AI_GUIDE.md)

**Key points:**
- Only `main` and `dev` branches
- Follow 8 mandatory principles
- Documentation in `docs` branch
- No `.md` files except this README

---

## 🛠️ Tech Stack

- Next.js 16 (App Router, RSC)
- Supabase (PostgreSQL)
- TypeScript
- Tailwind CSS
- Vercel

---

## 💻 Scripts

```bash
npm run dev     # Development
npm run build   # Production build (must pass!)
npm start       # Start production
npm run lint    # Lint code
```

---

## 🌳 Branches

```
main (production)  → https://slovor-mp.vercel.app
  ↓
dev (development)  → https://slovor-mp-git-dev.vercel.app

docs (reference)   → All documentation (read-only)
```

**Workflow:**
1. Work on `dev`
2. Push to `dev` → preview deploy
3. PR `dev` → `main` (Squash merge)

---

## 📁 Structure

```
slovor-mp/
├── .github/        # AI guide
├── app/            # Pages
├── components/     # UI
├── lib/            # Logic, API, types
├── public/         # Assets
├── styles/         # CSS
└── utils/          # Utilities
```

---

## ✅ Contributing

1. Read [AI Guide](./.github/AI_GUIDE.md)
2. Read principles (in `docs` branch)
3. Test: `npm run build`
4. Work on `dev` only
5. Follow TypeScript best practices

---

## 🔗 Links

- Production: https://slovor-mp.vercel.app
- Preview: https://slovor-mp-git-dev.vercel.app
- Repository: https://github.com/Den3112/slovor-mp
- Docs: [docs branch](https://github.com/Den3112/slovor-mp/tree/docs)

---

**Built with ❤️ following 8 principles**
