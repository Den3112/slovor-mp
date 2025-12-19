# 🧹 Clean Main Branch - Instructions

## 🎯 Goal

Create a **clean `main` branch** with only ONE production-ready commit, while keeping **full development history** in `dev` branch.

---

## 📝 Step-by-Step Instructions

### 1. Backup Everything (Safety First!)

```bash
# Create backup tag
git checkout main
git tag backup/before-cleanup-$(date +%Y%m%d)
git push origin --tags

# Verify backup exists
git tag | grep backup
```

### 2. Clean Main Branch

```bash
# Go to project directory
cd slovor-mp

# Fetch latest
git fetch origin

# Create orphan branch (no history)
git checkout --orphan main-clean

# Add all current files
git add .

# Create single clean commit
git commit -m "chore: production release v1.0.0

Production-ready marketplace application with:

## Features
- Next.js 16 with App Router and Server Components
- Supabase PostgreSQL database with type-safe queries
- TypeScript with 100% type coverage
- Tailwind CSS for styling
- Full documentation and coding principles

## Components
- Homepage with hero section and search
- Category browsing (8 categories)
- Listing cards with NEW/FEATURED badges
- Listing detail pages
- Search and filters
- Responsive design (mobile-first)
- Loading states and error handling

## Documentation
- PRINCIPLES.md - 8 mandatory coding principles
- ARCHITECTURE.md - Technical architecture
- PROJECT_CONTEXT.md - Full project context
- DEVELOPMENT.md - Git Flow and Vercel setup
- CHANGELOG.md - Version history

## Tech Stack
- Next.js 16.1.0
- React 18.2.0
- TypeScript 5.7.2
- Supabase 2.39.0
- Tailwind CSS 3.2.1

## Deployment
- Production: https://slovor-mp.vercel.app
- Preview (dev): https://slovor-mp-git-dev.vercel.app

## Status
✅ Production Ready
✅ Auto-deploy configured
✅ Full documentation
✅ Following 8 coding principles

For development history, see 'dev' branch."

# Replace old main with new clean main
git branch -D main
git branch -m main

# Force push to GitHub
git push origin main --force
```

### 3. Verify Everything Works

```bash
# Check main history (should be 1 commit)
git log --oneline
# Output: xxxxx chore: production release v1.0.0

# Check dev history (should be 13+ commits)
git checkout dev
git log --oneline | wc -l
# Output: 13 (or more)

# Verify both branches work
git checkout main
npm install
npm run build  # Must pass!

git checkout dev  
npm run build  # Must pass!
```

### 4. Update Documentation

```bash
# On dev branch
git checkout dev

# Update package.json version
# Change to: "version": "1.0.0"

git add package.json
git commit -m "chore: set version to 1.0.0"
git push origin dev
```

### 5. Sync Main Documentation

```bash
# Cherry-pick documentation update to main
git checkout main
git cherry-pick dev
git push origin main
```

---

## ✅ Expected Result

### Main Branch
```bash
$ git log --oneline main
xxxxxxx chore: production release v1.0.0

$ git log main --oneline | wc -l
1
```

### Dev Branch  
```bash
$ git log --oneline dev
21fb3fa docs: add instructions for cleaning main
e8a2353 docs: add Git Flow and Vercel setup
e1e5227 docs: add project context and changelog
b9d67c6 fix: wrap ListingFilters with Suspense
4199332 refactor: apply mandatory principles
...and more...

$ git log dev --oneline | wc -l
13 (or more)
```

---

## 🚨 Important Notes

### Before Running Commands:

1. **Commit all changes** on dev
   ```bash
   git checkout dev
   git add .
   git commit -m "save: current work"
   git push origin dev
   ```

2. **Close Vercel auto-deploy temporarily** (optional)
   - Go to Vercel → Settings → Git
   - Pause auto-deploy for main
   - Run cleanup
   - Re-enable auto-deploy

3. **Inform team** (if applicable)
   - "Cleaning main branch history"
   - "All history preserved in dev"
   - "Will force push main"

### After Cleanup:

1. **Vercel will auto-deploy** main
   - Check https://slovor-mp.vercel.app
   - Should work exactly the same

2. **Dev continues as normal**
   - All work on dev branch
   - Full history preserved

3. **Future merges use Squash**
   - When merging dev → main
   - Use "Squash and merge" on GitHub
   - Keeps main clean

---

## 🔄 Rollback (If Needed)

### If something goes wrong:

```bash
# Find backup tag
git tag | grep backup

# Restore main from backup
git checkout main
git reset --hard backup/before-cleanup-20251219
git push origin main --force
```

---

## 📊 Benefits

### Clean Main:
- ✅ Professional release history
- ✅ Easy to understand what's in production
- ✅ Clean git log for stakeholders
- ✅ Clear version history

### Full Dev History:
- ✅ Complete development context
- ✅ All fixes and experiments preserved
- ✅ Easy to trace bug origins
- ✅ Learning from past decisions

---

## 🛠️ Alternative: Manual Squash (Safer)

### If you prefer less aggressive approach:

```bash
# 1. Count commits
git checkout main
git log --oneline | wc -l
# Example: 13 commits

# 2. Interactive rebase
git rebase -i HEAD~13

# 3. In editor, change all except first to 'squash'
# pick e8a2353 ...
# squash e1e5227 ...
# squash b9d67c6 ...
# ...etc

# 4. Save, write combined commit message

# 5. Force push
git push origin main --force
```

---

## ❓ FAQ

**Q: Will this break Vercel?**
A: No, Vercel deploys code, not history. Same code = same result.

**Q: Can I undo this?**
A: Yes, use backup tag created in step 1.

**Q: What about open PRs?**
A: No PRs should exist when doing this. Merge or close them first.

**Q: Do I lose any code?**
A: No! All code is identical. Only commit history changes.

**Q: What about blame/history?**
A: Full history remains in dev branch. Use that for research.

---

## 🚀 Ready?

```bash
# Quick checklist:
[ ] All changes committed and pushed
[ ] Team informed (if applicable)
[ ] Backup tag created
[ ] Ready to run commands

# Go!
```

---

**Created:** December 19, 2025  
**Purpose:** One-time cleanup for production branch  
**Safe:** Yes, with backup tag  
**Recommended:** Yes, for clean production history
