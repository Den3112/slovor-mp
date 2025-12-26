# 🛠️ Development Guide

Best practices and workflow for contributing to SLOVOR Marketplace.

---

## Before You Code

**MANDATORY:** Read [PRINCIPLES.md](./PRINCIPLES.md) first!

These 8 principles are not optional. They guide all development decisions.

---

## Development Setup

See [QUICK_START.md](./QUICK_START.md) for initial setup.

Once setup:

```bash
git checkout dev              # Always work from dev
npm run dev                   # Start dev server
```

---

## Branching Strategy

### Main Branches
- **main** - Production (stable, deployed to slovor-mp.vercel.app)
- **dev** - Development (active work, deployed to slovor-mp-git-dev.vercel.app)
- **docs** - Documentation

### Feature Branches
Create from `dev`, name clearly:

```bash
git checkout dev
git checkout -b feature/user-auth
git checkout -b fix/category-filter  
git checkout -b refactor/api-simplify
```

**Branch naming:**
- `feature/` - New feature
- `fix/` - Bug fix
- `refactor/` - Code improvement
- `perf/` - Performance improvement

---

## Commit Messages

Write clear, descriptive commits:

```bash
# Good
git commit -m "feat: add user authentication with Supabase"
git commit -m "fix: category filter not updating listings"
git commit -m "refactor: simplify listing API"

# Bad
git commit -m "update"
git commit -m "fix stuff"
```

**Format:**
```
<type>: <description>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code reorganization
- `perf:` - Performance improvement
- `docs:` - Documentation
- `test:` - Test additions
- `chore:` - Build, deps, etc

---

## Code Style

### TypeScript
Always use strict mode. No `any`.

```typescript
// Bad
function processList(data: any): any { }

// Good
interface Listing {
  id: string;
  title: string;
  price: number;
}

function processListings(data: Listing[]): Listing[] { }
```

### Components
Small, focused, with clear props.

```typescript
interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  return (
    <div onClick={onClick}>
      <h3>{listing.title}</h3>
      <p>€{listing.price}</p>
    </div>
  );
}
```

### API Functions
Error handling from the start.

```typescript
export async function getListings(): Promise<Listing[]> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .limit(50);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return [];
  }
}
```

### Naming
Clear and descriptive.

```typescript
// Bad
const x = 10;
const fn = (a) => a * 2;
const tmp = [1, 2, 3];

// Good
const maxListingsPerPage = 10;
const doubleValue = (value: number) => value * 2;
const listingIds = [1, 2, 3];
```

---

## File Organization

```
app/
  ├─ (pages)           # Homepage, listings, categories
  ├─ api/              # API routes
  ├─ layout.tsx        # Root layout
  └─ page.tsx           # Homepage

components/
  ├─ common/           # Shared components (Button, Input, etc)
  ├─ layout/           # Header, footer, nav
  ├─ listings/         # Listing-specific components
  └─ categories/       # Category-specific components

lib/
  ├─ supabase.ts       # Database client
  ├─ types.ts          # TypeScript types
  └─ api/              # API query functions

public/
  └─ assets/           # Images, icons

styles/
  └─ globals.css       # Global styles
```

---

## Pre-Commit Checklist

Before committing:

```bash
# 1. Check for linting issues
npm run lint

# 2. Fix linting issues
npm run lint:fix

# 3. Check TypeScript types
npm run type-check

# 4. Format code
npm run format

# 5. Test locally
npm run dev
```

**All must pass!**

---

## Pull Request Workflow

1. **Create PR on GitHub** from feature branch to `dev`
   ```
   Title: feat: add user authentication
   
   Description:
   - Added Supabase Auth integration
   - Created login/signup pages
   - Added protected routes
   ```

2. **Ensure checks pass**
   - npm run build ✅
   - npm run lint ✅
   - npm run type-check ✅

3. **Review and merge**
   - Squash and merge (keeps history clean)
   - Delete feature branch after merge

4. **Vercel auto-deploys** to dev environment

---

## Releasing to Production

When code on `dev` is stable and tested:

1. **Create PR** from `dev` to `main`
   - Title: `Release v1.1.0: Description`
   - List all features and fixes

2. **Final checks**
   - ✅ All features tested on dev
   - ✅ No critical bugs
   - ✅ Documentation updated
   - ✅ Version bumped in package.json

3. **Merge** with "Squash and merge"
   - Vercel auto-deploys to production
   - Clean commit history in main

4. **Tag release** (optional but recommended)
   ```bash
   git checkout main
   git pull origin main
   git tag v1.1.0
   git push origin v1.1.0
   ```

---

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Check code issues
npm run lint:fix     # Auto-fix issues
npm run type-check   # Check TypeScript
npm run format       # Format code
```

### Database
```bash
npm run db:info      # Show database info
npm run db:seed      # Seed with test data
npm run db:clear     # Clear all data
npm run db:reset     # Clear and re-seed
```

### Git
```bash
git checkout dev            # Switch to dev
git pull origin dev         # Get latest
git checkout -b feature/x   # New feature
git push origin feature/x   # Push changes
```

---

## Debugging

### Browser DevTools
```bash
# Open in browser
http://localhost:3000

# Press F12 for DevTools
# Check Console for errors
# Check Network tab for API calls
```

### Server Logs
```bash
# Errors show in terminal when running
npm run dev
```

### Type Errors
```bash
npm run type-check  # See all TypeScript errors
```

### Database Issues
```bash
npm run db:info     # Check what's in database
```

---

## Performance Tips

### Image Optimization
Always use Next.js Image:

```typescript
import Image from 'next/image';

// Bad - slow
<img src={url} />

// Good - optimized
<Image 
  src={url} 
  alt="description"
  width={300}
  height={200}
  priority={false}
/>
```

### ISR (Static Page Caching)
Regenerate static pages periodically:

```typescript
// Regenerate every 60 seconds
export const revalidate = 60;

export default async function Page() {
  const listings = await getListings();
  return <div>{/* render */}</div>;
}
```

### Code Splitting
Import heavy components dynamically:

```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/Chart'),
  { loading: () => <div>Loading...</div> }
);
```

---

## Troubleshooting

### Changes not showing
1. Hard refresh: Ctrl+Shift+R
2. Restart dev: Ctrl+C, npm run dev
3. Clear cache: rm -rf .next

### Build fails
```bash
npm run build  # Test locally first
npm run lint:fix
npm run type-check
```

### Database connection error
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Restart dev server

### Git conflicts
```bash
# Update your branch
git fetch origin
git merge origin/dev

# Resolve conflicts in editor
# Find <<<<<<< and >>>>>>> markers
# Keep correct code

git add .
git commit -m "fix: resolve merge conflicts"
```

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## Questions?

1. Check [PRINCIPLES.md](./PRINCIPLES.md) - Coding standards
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) - Project structure
3. Search [GitHub Issues](https://github.com/Den3112/slovor-mp/issues)
4. Ask in [Discussions](https://github.com/Den3112/slovor-mp/discussions)

---

**Happy developing! 🚀**
