# 🎯 Quick Start Guide

Get SLOVOR Marketplace running in 5 minutes.

---

## Prerequisites

- **Node.js** >= 18.0.0 ([download](https://nodejs.org))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** ([download](https://git-scm.com))
- **Supabase account** ([create free](https://supabase.com))

---

## 1. Clone Repository

```bash
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp
```

---

## 2. Switch to Development Branch

```bash
git checkout dev
```

---

## 3. Install Dependencies

```bash
npm install
```

This installs all required packages from `package.json`.

---

## 4. Setup Environment Variables

Create `.env.local` file in project root:

```bash
cp .env.local .env.local.backup  # Backup if needed
```

Edit `.env.local` and add your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Getting Supabase Credentials:

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to **Settings** > **API**
3. Copy `Project URL` and `anon key`
4. Paste into `.env.local`

---

## 5. Start Development Server

```bash
npm run dev
```

Output will show:
```
> slovor-mp@1.0.0 dev
> next dev

  ▶ Next.js 15.1.3
  ▶ Local:        http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Seed Database (Optional)

To populate the database with test data:

```bash
npm run db:seed
```

This creates sample listings and categories.

---

## ✅ You're Ready!

You now have:
- ✅ Development server running
- ✅ Database connected
- ✅ Sample data loaded (if you seeded)
- ✅ Ready to code!

---

## Common Commands

```bash
# Linting and type checking (DO THIS BEFORE COMMITTING)
npm run lint        # Check for code issues
npm run type-check  # Check TypeScript types
npm run format      # Auto-format code

# Database
npm run db:info     # Show database info
npm run db:clear    # Delete all listings
npm run db:reset    # Clear and re-seed

# Production
npm run build       # Build for production
npm run start       # Start production server
```

---

## File Structure

```
app/
  ├─ (pages)      # Homepage, listings, categories
  ├─ api/         # API routes
  └─ layout.tsx   # Root layout

components/
  ├─ common/      # Shared components
  ├─ layout/      # Header, footer
  ├─ listings/    # Listing components
  └─ categories/  # Category components

lib/
  ├─ supabase.ts # Database client
  └─ api/        # API queries
```

---

## Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes**
   - Edit files in `components/`, `app/`, `lib/`
   - Server auto-reloads

3. **Test locally**
   ```bash
   npm run lint
   npm run type-check
   npm run dev
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

5. **Create Pull Request** to `dev` branch

---

## Troubleshooting

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Supabase connection error
- Check `.env.local` has correct credentials
- Make sure Supabase project is active
- Restart dev server: `Ctrl+C` then `npm run dev`

### Node modules issues
```bash
# Clean install
npm run clean
npm install
npm run dev
```

### TypeScript errors
```bash
# Check types
npm run type-check

# Fix common issues
npm run lint:fix
```

---

## Next Steps

1. **Read PRINCIPLES.md** - Understand coding standards
2. **Read DEVELOPMENT.md** - Learn development workflow
3. **Read ARCHITECTURE.md** - Understand project structure
4. **Start coding!** - Pick an issue or create a feature

---

## Questions?

- Check [GitHub Issues](https://github.com/Den3112/slovor-mp/issues)
- Start a [Discussion](https://github.com/Den3112/slovor-mp/discussions)
- Read other documentation files

---

**Happy coding! 🚀**
