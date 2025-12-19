# 🔧 Development Guide - Slovor Marketplace

## 🌳 Git Flow Strategy

### Branch Structure

```
main (production)    →  Vercel Production
  ↓
dev (development)    →  Vercel Preview
  ↓
feature/* (optional) →  Local development
```

### Branch Rules

#### `main` Branch
- 🔒 **Protected** - production ready code only
- ✅ Auto-deploys to **Vercel Production**
- 🚨 Never commit directly to main
- ✅ Only merge from `dev` via Pull Request
- 📄 URL: https://slovor-mp.vercel.app

#### `dev` Branch  
- 🛠️ **Development** - active development
- ✅ Auto-deploys to **Vercel Preview**
- ✅ Can commit directly for quick fixes
- ✅ Merge features here first
- 📄 URL: https://slovor-mp-dev.vercel.app (or similar)

#### `feature/*` Branches (Optional)
- 👤 Personal feature branches
- 💻 Local development only
- ✅ Merge to `dev` when ready

---

## 🚀 Vercel Setup

### 1. Configure Vercel Project

Go to Vercel Dashboard → Your Project → Settings → Git

#### Production Branch
```
Branch: main
Environment: Production
URL: slovor-mp.vercel.app
```

#### Preview Branch (Development)
```
Branch: dev
Environment: Preview
URL: slovor-mp-git-dev-den3112.vercel.app
```

### 2. Environment Variables

**Both environments need:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Optional: Different databases per environment**

```env
# Production (main)
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co

# Development (dev)
NEXT_PUBLIC_SUPABASE_URL=https://dev.supabase.co
```

---

## 💻 Development Workflow

### Scenario 1: Quick Fix/Small Feature

```bash
# 1. Switch to dev branch
git checkout dev

# 2. Pull latest
git pull origin dev

# 3. Make changes
# ... edit files ...

# 4. Test locally
npm run dev
npm run build  # Must pass!

# 5. Commit and push
git add .
git commit -m "feat: add search functionality"
git push origin dev

# 6. Vercel auto-deploys to Preview URL
# Check: https://slovor-mp-git-dev-den3112.vercel.app
```

### Scenario 2: Large Feature (with feature branch)

```bash
# 1. Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/user-auth

# 2. Develop feature
# ... work work work ...
git add .
git commit -m "feat: add login page"

# 3. Keep feature branch updated
git checkout dev
git pull origin dev
git checkout feature/user-auth
git merge dev  # Resolve conflicts if any

# 4. When ready, merge to dev
git checkout dev
git merge feature/user-auth
git push origin dev

# 5. Delete feature branch
git branch -d feature/user-auth
```

### Scenario 3: Deploy to Production

```bash
# 1. Test on dev environment
# Visit: https://slovor-mp-git-dev-den3112.vercel.app
# ✅ Everything works?

# 2. Create Pull Request
# GitHub: dev → main
# Add description, checklist

# 3. Review and merge PR
# Vercel auto-deploys to Production

# 4. Verify production
# Visit: https://slovor-mp.vercel.app

# 5. Tag release (optional)
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release v1.1.0: Add authentication"
git push origin v1.1.0
```

---

## ✅ Pre-Commit Checklist

### Before `git push` to `dev`:

- [ ] Code follows 8 principles (see PRINCIPLES.md)
- [ ] `npm run build` passes without errors
- [ ] No TypeScript errors
- [ ] No console.log() left in code
- [ ] Tested locally (`npm run dev`)
- [ ] Updated CHANGELOG.md if needed

### Before merging `dev` → `main`:

- [ ] All features tested on dev environment
- [ ] No known critical bugs
- [ ] Database migrations completed (if any)
- [ ] Environment variables synced
- [ ] Updated version in package.json
- [ ] Updated CHANGELOG.md
- [ ] Created release notes

---

## 🔄 Common Commands

### Switch Between Branches

```bash
# Go to development
git checkout dev

# Go to production
git checkout main

# Create new feature
git checkout -b feature/add-chat
```

### Sync with Remote

```bash
# Pull latest from dev
git checkout dev
git pull origin dev

# Pull latest from main
git checkout main
git pull origin main
```

### Fix Conflicts

```bash
# If merge conflict occurs:
git status  # See conflicted files
# Edit files, resolve conflicts
git add .
git commit -m "fix: resolve merge conflicts"
```

### Undo Changes

```bash
# Undo uncommitted changes
git checkout -- file.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## 🎯 Vercel Deployment URLs

### Production (main branch)
- **Main:** https://slovor-mp.vercel.app
- **Alternative:** https://slovor-mp-den3112.vercel.app

### Preview (dev branch)
- **Dev:** https://slovor-mp-git-dev-den3112.vercel.app
- **Feature branches:** https://slovor-mp-git-feature-name-den3112.vercel.app

### How to Find URLs

1. Go to Vercel Dashboard
2. Click your project
3. See "Deployments" tab
4. Each deployment has unique URL

---

## 🔐 Branch Protection (Recommended)

### Protect `main` branch on GitHub:

1. Go to GitHub → Settings → Branches
2. Add rule for `main`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass (Vercel build)
   - ✅ Require branches to be up to date
   - ❌ Do not allow force pushes
   - ❌ Do not allow deletions

---

## 💡 Tips & Best Practices

### 1. Commit Messages

Use conventional commits:

```bash
feat: add user authentication
fix: resolve search bug
docs: update README
refactor: simplify listing API
test: add unit tests for auth
chore: update dependencies
```

### 2. Small, Frequent Commits

✅ **Good:**
```bash
git commit -m "feat: add login form"
git commit -m "feat: add validation to login"
git commit -m "style: improve login page design"
```

❌ **Bad:**
```bash
git commit -m "add everything for auth feature"
```

### 3. Pull Before Push

**Always** pull latest before pushing:

```bash
git pull origin dev
git push origin dev
```

### 4. Test Before Merge

**Never** merge to main without testing on dev environment first!

---

## 🐛 Troubleshooting

### Vercel Build Fails

```bash
# Test build locally first
npm run build

# If passes locally but fails on Vercel:
# 1. Check environment variables
# 2. Check Node.js version (should match local)
# 3. Clear Vercel cache (Deployments → Redeploy)
```

### Merge Conflicts

```bash
# Update your branch with latest dev
git checkout dev
git pull origin dev
git checkout your-feature-branch
git merge dev

# Resolve conflicts in files
# Then:
git add .
git commit -m "fix: resolve conflicts with dev"
```

### Branch Out of Sync

```bash
# Force sync with remote (careful!)
git fetch origin
git reset --hard origin/dev
```

---

## 📊 Monitoring Deployments

### Check Deployment Status

1. **Vercel Dashboard** - see all deployments
2. **GitHub Actions** - if CI/CD configured
3. **Git commit** - Vercel bot comments with preview URL

### Rollback if Needed

1. Go to Vercel → Deployments
2. Find previous working deployment
3. Click "Promote to Production"

OR

```bash
# Revert last commit
git revert HEAD
git push origin main
```

---

## 📝 Summary

| Branch | Purpose | Auto-Deploy | URL |
|--------|---------|-------------|-----|
| `main` | Production | ✅ Yes | slovor-mp.vercel.app |
| `dev` | Development | ✅ Yes | slovor-mp-git-dev-*.vercel.app |
| `feature/*` | Features | ✅ Yes (Preview) | slovor-mp-git-feature-*.vercel.app |

**Workflow:**
```
Local → feature/* → dev → main → Production
```

---

**Last Updated:** December 19, 2025  
**Next:** Follow this workflow for all future development!
