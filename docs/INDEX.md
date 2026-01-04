# 📚 SLOVOR Marketplace - Documentation Index

Welcome to SLOVOR Marketplace documentation. Start here!

---

## 🚀 Getting Started

**New to the project?** Start here:

1. **[QUICK_START.md](./QUICK_START.md)** (5 minutes)
   - Prerequisites
   - Clone and setup
   - Run locally
   - Seed database

2. **[PRINCIPLES.md](./PRINCIPLES.md)** (10 minutes)
   - 8 core coding principles
   - KISS philosophy
   - Code examples
   - **MANDATORY reading!**

3. **[ROADMAP_INVESTOR.md](./ROADMAP_INVESTOR.md)** (NEW 🚀)
   - Strategic goals for "wow-effect"
   - Dashboard & Media plans
   - Search & Polish targets

---

## 📖 Documentation

### For Developers

- **[QUICK_START.md](./QUICK_START.md)**
  - Environment setup
  - Dependencies installation
  - First run

- **[DEVELOPMENT.md](./DEVELOPMENT.md)**
  - Branching strategy
  - Commit guidelines
  - Code style
  - Pull requests
  - Debugging
  - Common commands

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**
  - System overview
  - Technology stack
  - Project structure
  - Database schema
  - API design
  - Performance strategy

- **[PRINCIPLES.md](./PRINCIPLES.md)** 🔥 **MANDATORY**
  - 8 core principles
  - Code examples
  - Best practices
  - Quality checklist

---

## 🎯 Project Overview

### What is SLOVOR?
A modern marketplace platform for Slovakia. Like OLX or Avito, but built with modern tech.

### Key Features
- 🏠 Homepage with categories
- 🔍 Browse and filter listings
- 🌍 Multi-language support (EN, SK, CZ)
- ⚡ Fast performance (ISR, SSG, caching)
- 🔐 Secure database (RLS policies)

### Tech Stack
- Frontend: Next.js 15, React 18, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Deployment: Vercel

---

## 📊 Project Status

**Current Phase:** Beta Development

### ✅ Completed
- Project structure
- Supabase integration
- Homepage with categories
- Listings display
- Category pages with filtering
- Row-Level Security
- ISR implementation
- Strict TypeScript

### 🚧 In Progress
- Environment validation
- Middleware preparation

### 🔮 Planned
- User authentication
- User dashboard
- Create/edit listings
- Image upload
- Messaging system
- Content moderation

---

## 🔗 Links

### Environments
- **Production:** https://slovor-mp.vercel.app
- **Development:** https://slovor-mp-git-dev.vercel.app

### Repository
- **GitHub:** https://github.com/Den3112/slovor-mp
- **Issues:** https://github.com/Den3112/slovor-mp/issues
- **Discussions:** https://github.com/Den3112/slovor-mp/discussions

---

## 👥 Team

- **Maintainer:** [@Den3112](https://github.com/Den3112) - DeNiS

---

## 🏗️ Branching

```
main
  ↑ (Production - clean history)
  |
 dev
  ↑ (Development - full history)
  |
feature/*
  (Local work)
```

- **main:** Production code (deployed to slovor-mp.vercel.app)
- **dev:** Development (deployed to slovor-mp-git-dev.vercel.app)
- **docs:** This documentation

---

## 🛠️ Common Commands

```bash
# Setup
npm install                # Install dependencies
cp .env.example .env.local # Setup environment

# Development
npm run dev               # Start dev server
npm run build             # Build for production
npm run lint              # Check code quality
npm run type-check        # Check TypeScript

# Database
npm run db:seed           # Load test data
npm run db:reset          # Clear and re-seed

# Git
git checkout dev          # Switch to dev
git checkout -b feature/x # Create feature
git push origin dev       # Push changes
```

---

## 📋 Checklist: Before You Code

- [ ] Cloned repository
- [ ] Installed Node.js 18+
- [ ] Run `npm install`
- [ ] Setup `.env.local` with Supabase credentials
- [ ] Read `PRINCIPLES.md` (MANDATORY!)
- [ ] Read `DEVELOPMENT.md`
- [ ] Run `npm run dev` locally
- [ ] Ready to code! 🚀

---

## ❓ FAQs

### Q: Where do I start?
**A:** Read QUICK_START.md, then PRINCIPLES.md.

### Q: What are the 8 principles?
**A:** See PRINCIPLES.md. Spoiler: KISS (Keep It Simple, Stupid).

### Q: How do I deploy?
**A:** Push to `dev` for preview, `main` for production. Vercel auto-deploys.

### Q: Which branch should I work on?
**A:** Always `dev` for development. Only `main` for releases.

### Q: Where do I find bugs?
**A:** Check GitHub Issues or create one.

### Q: How do I ask questions?
**A:** GitHub Discussions or Issues.

---

## 🚀 Next Steps

1. **Clone** the repository
2. **Read** QUICK_START.md
3. **Read** PRINCIPLES.md (MANDATORY!)
4. **Run** `npm run dev`
5. **Code** something awesome!

---

**Happy coding! 🚀**

---

**Last Updated:** December 26, 2025
**Documentation Version:** 1.0
**Project Status:** Active Development
