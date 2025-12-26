# 🛒 Slovor Marketplace

> **Ukrainian classifieds marketplace** - Built with Next.js 15, React 19, Supabase, Tailwind CSS

**Live Demo:** [slovor-mp.vercel.app](https://slovor-mp.vercel.app)
**Dev Preview:** [slovor-mp-git-dev.vercel.app](https://slovor-mp-git-dev.vercel.app)

---

## 📚 Documentation

<br>

**Quick Links:**
- [📝 View All Documentation](https://github.com/Den3112/slovor-mp/blob/docs/INDEX.md)
- [🎯 Quick Start Guide](https://github.com/Den3112/slovor-mp/blob/docs/QUICK_START.md)
- [🔥 Coding Principles (MANDATORY)](https://github.com/Den3112/slovor-mp/blob/docs/PRINCIPLES.md)
- [🏛️ Architecture](https://github.com/Den3112/slovor-mp/blob/docs/ARCHITECTURE.md)
- [🛠️ Development Guide](https://github.com/Den3112/slovor-mp/blob/docs/DEVELOPMENT.md)

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp

# Switch to dev branch
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

```
slovor-mp/
├── main    → Production (stable, deployed)
├── dev     → Development (YOU ARE HERE)
└── docs    → All documentation
```

### Workflow
1. **Code on `dev`** - All feature development
2. **Merge to `main`** - When ready for production
3. **Read `docs`** - For all documentation needs

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Language:** TypeScript (strict mode)

---

## 💻 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
npm run format       # Format with Prettier
```

---

## 🔥 Before You Code

**MANDATORY:** Read [PRINCIPLES.md](https://github.com/Den3112/slovor-mp/blob/docs/PRINCIPLES.md) first!

8 coding principles that MUST be followed:
1. Component Isolation
2. Query Pattern
3. Error Handling
4. Explicit Configuration
5. Type Safety
6. Performance Optimization
7. Code Comments
8. Testing Approach

---

## 📜 Project Status

**Current Phase:** Beta Development

### ✅ Completed
- Project structure
- Supabase integration
- Homepage with categories
- Listings display
- Category pages
- RLS policies
- ISR implementation
- Strict TypeScript/ESLint

### 🚧 In Progress (dev branch)
- Environment validation
- Middleware preparation
- Performance optimizations

### 🔮 Next Up
- Authentication
- User dashboard
- Listing creation
- Image upload

---

## 🤝 Contributing

1. Read [DEVELOPMENT.md](./DEVELOPMENT.md)
2. Create feature branch from `dev`
3. Make changes
4. Test locally
5. Create PR to `dev`

---

## 🔗 Links

- **Production:** https://slovor-mp.vercel.app
- **Dev Preview:** https://slovor-mp-git-dev.vercel.app
- **Documentation:** https://github.com/Den3112/slovor-mp/blob/docs/INDEX.md
- **Issues:** https://github.com/Den3112/slovor-mp/issues

---

**Branch:** `dev` (Development)
**Last Updated:** December 25, 2025
**Maintained by:** [@Den3112](https://github.com/Den3112)
