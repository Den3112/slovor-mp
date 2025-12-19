# 🤖 AI Development Guide for Slovor Marketplace

> **MANDATORY:** Read this before making ANY changes to the project.

---

## 📋 Project Overview

**Project:** Slovor Marketplace  
**Tech Stack:** Next.js 16 + Supabase + TypeScript + Tailwind CSS  
**Production:** https://slovor-mp.vercel.app  
**Preview:** https://slovor-mp-git-dev.vercel.app (when available)

---

## 🌳 Branch Structure

### Active Branches (ONLY THESE TWO)

```
main (production)    - Clean history, production code only
  ↓
dev (development)    - Active development, full history
```

### Documentation Branch (READ-ONLY)

```
docs                 - All documentation, principles, history
```

**⚠️ CRITICAL RULES:**

1. **NEVER create new branches** - Only use `main` and `dev`
2. **NEVER push docs to main/dev** - Documentation lives in `docs` branch
3. **NEVER modify docs branch** - It's reference only
4. **Delete any other branches immediately** - Only main, dev, docs allowed

---

## 📁 Repository Structure

### Main/Dev Branches (CODE ONLY)

```
slovor-mp/
├── .github/
│   └── AI_GUIDE.md          ← YOU ARE HERE (only this file)
├── app/                      ← Next.js pages (routes)
├── components/               ← React components
├── lib/
│   ├── supabase/            ← Database client & queries
│   └── types/               ← TypeScript types
├── public/                   ← Static assets
├── styles/                   ← CSS styles
├── utils/                    ← Utility functions
├── .env.example             ← Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md                ← Brief project overview ONLY
```

**✅ What SHOULD be in main/dev:**
- Source code (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`)
- Config files (`.json`, `.js` configs)
- `.env.example` and `.gitignore`
- `README.md` (brief, 50-100 lines max)
- This AI guide (`.github/AI_GUIDE.md`)

**❌ What should NOT be in main/dev:**
- ❌ `PRINCIPLES.md`
- ❌ `ARCHITECTURE.md`
- ❌ `PROJECT_CONTEXT.md`
- ❌ `DEVELOPMENT.md`
- ❌ `CHANGELOG.md`
- ❌ Any other `.md` files except README.md
- ❌ Cleanup scripts

### Docs Branch (DOCUMENTATION ONLY)

```
docs/
├── principles/
│   └── PRINCIPLES.md        ← 8 mandatory coding principles
├── architecture/
│   └── ARCHITECTURE.md      ← Technical architecture
├── guides/
│   ├── DEVELOPMENT.md       ← Git flow, Vercel setup
│   └── QUICK_START.md       ← Quick start guide
├── history/
│   ├── PROJECT_CONTEXT.md   ← Full project history
│   └── CHANGELOG.md         ← Version history
└── README.md                ← Documentation index
```

---

## 🎯 8 Mandatory Coding Principles

> **Location:** `docs/principles/PRINCIPLES.md`

Every code change MUST follow these:

1. **Minimize Code** - Small functions, small components
2. **Minimize Connections** - Loose coupling, props over state
3. **One Owner Per Responsibility** - Single source of truth
4. **Explicitness Over Magic** - No hidden logic
5. **Errors Are Part of Design** - Handle errors explicitly
6. **Code for Humans** - Readable > clever
7. **Minimal Global State** - Local state preferred
8. **KISS** - Simple solution wins

**Full details:** `git checkout docs && cat principles/PRINCIPLES.md`

---

## 🔄 Development Workflow

### Daily Development

```bash
# Always work on dev
git checkout dev
git pull origin dev

# Make changes following 8 principles

# Test
npm run build  # Must pass!
npm run lint

# Commit
git add .
git commit -m "feat: description in English"
git push origin dev
```

### Release to Production

```bash
# On GitHub:
# 1. Create PR: dev → main
# 2. Use "Squash and merge" (IMPORTANT!)
# 3. Main gets 1 clean commit
# 4. Vercel deploys to production
```

---

## 🚀 Quick Reference

### Adding Feature
1. Switch to dev
2. Read principles (docs branch)
3. Code following 8 principles
4. Test: `npm run build`
5. Push to dev
6. PR dev → main (squash merge)

### Reading Docs
```bash
git checkout docs
cat principles/PRINCIPLES.md
git checkout dev
```

### Cleaning Branches
```bash
# Delete any branch except main, dev, docs
git push origin --delete <branch-name>
```

---

## ❌ Common Mistakes

1. ❌ Creating new branches - Use dev only
2. ❌ Adding `.md` files to dev/main - Use docs branch
3. ❌ Client components everywhere - Server components first
4. ❌ Global state - Use props
5. ❌ Merging without squash - Always squash to main
6. ❌ Skipping `npm run build` - Always test

---

## ✅ Success Checklist

Before every change:

- [ ] Read this guide
- [ ] Know 8 principles
- [ ] On correct branch (dev)
- [ ] Simplest solution
- [ ] Build passes locally
- [ ] No docs in main/dev
- [ ] Clear commit message

---

## 📚 Documentation

| Topic | Location |
|-------|----------|
| This Guide | `.github/AI_GUIDE.md` (main/dev) |
| 8 Principles | `principles/PRINCIPLES.md` (docs) |
| Architecture | `architecture/ARCHITECTURE.md` (docs) |
| Git Flow | `guides/DEVELOPMENT.md` (docs) |
| History | `history/PROJECT_CONTEXT.md` (docs) |

---

## 🔗 Key Commands

```bash
# Daily work
git checkout dev
git pull origin dev
npm run build
git push origin dev

# Read docs
git checkout docs
cat principles/PRINCIPLES.md

# Clean branches
git push origin --delete <branch>
```

---

**Remember:** Simple, clean code following 8 principles. Docs live in `docs` branch.

**Questions?** Check `docs` branch.

**Good luck!** 🚀
