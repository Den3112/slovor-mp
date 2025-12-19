# 🔧 Development Guide - Slovor Marketplace

## 🌳 Git Flow Strategy

### Branch Structure

```
main (production)    → Vercel Production (CLEAN, squashed history)
  ↓
dev (development)    → Vercel Preview (FULL history, active development)
  ↓
feature/* (optional) → Local development
```

### Branch Philosophy

#### `main` Branch - Production
- 🔒 **Protected** - production ready code only
- ✅ Auto-deploys to **Vercel Production**
- 🧹 **Clean history** - squashed commits, no noise
- 🚨 Never commit directly to main
- ✅ Only merge from `dev` via Pull Request
- 📄 URL: https://slovor-mp.vercel.app
- 📊 Contains: Clean, release-only commits

#### `dev` Branch - Development
- 🛠️ **Active development** - all work happens here
- ✅ Auto-deploys to **Vercel Preview**
- 📜 **Full history** - all commits, fixes, experiments
- ✅ Can commit directly for quick fixes
- ✅ Merge features here first
- 📄 URL: https://slovor-mp-git-dev.vercel.app
- 📊 Contains: Complete development history

#### Why Two Different Histories?

**`main`** - Clean release history:
```
* v1.0.0 - Initial production release
* v1.1.0 - Add authentication feature
* v1.2.0 - Add messaging system
```

**`dev`** - Full development history:
```
* feat: add login page
* fix: resolve TypeScript errors
* refactor: simplify auth flow
* fix: correct validation bug
* style: improve login design
* feat: add registration
```

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

### Daily Development

```bash
# 1. Always work on dev branch
git checkout dev
git pull origin dev

# 2. Make changes
# ... edit files ...

# 3. Test locally
npm run dev
npm run build  # Must pass!

# 4. Commit with descriptive message
git add .
git commit -m "feat: add user profile page"
git push origin dev

# 5. Vercel auto-deploys to Preview
# Check: https://slovor-mp-git-dev-den3112.vercel.app
```

### Feature Branch (Optional)

```bash
# 1. Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/messaging-system

# 2. Develop feature
# ... work work work ...
git add .
git commit -m "feat: add chat UI"
git commit -m "feat: add realtime messages"

# 3. Keep updated with dev
git checkout dev
git pull origin dev
git checkout feature/messaging-system
git merge dev

# 4. When ready, merge to dev
git checkout dev
git merge feature/messaging-system
git push origin dev

# 5. Delete feature branch
git branch -d feature/messaging-system
```

### Release to Production

```bash
# 1. Ensure dev is stable and tested
# Visit: https://slovor-mp-git-dev-den3112.vercel.app
# ✅ Everything works perfectly?

# 2. Create Pull Request on GitHub
# From: dev
# To: main
# Title: "Release v1.1.0: Add authentication"
# Description: List all features, fixes

# 3. Review checklist:
# ✅ All features tested
# ✅ No critical bugs
# ✅ CHANGELOG.md updated
# ✅ Version bumped in package.json
# ✅ Documentation updated

# 4. Merge PR with "Squash and merge"
# This creates ONE clean commit in main
# Vercel auto-deploys to Production

# 5. Verify production
# Visit: https://slovor-mp.vercel.app

# 6. Tag release
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release v1.1.0: Authentication"
git push origin v1.1.0

# 7. Continue development on dev
git checkout dev
```

---

## ✅ Pre-Commit Checklist

### Before `git push` to `dev`:

- [ ] Code follows 8 principles (see PRINCIPLES.md)
- [ ] `npm run build` passes without errors
- [ ] No TypeScript errors
- [ ] No console.log() left in code
- [ ] Tested locally (`npm run dev`)
- [ ] Commit message is descriptive

### Before merging `dev` → `main`:

- [ ] All features tested on dev environment
- [ ] No known critical bugs
- [ ] Database migrations completed (if any)
- [ ] Environment variables synced
- [ ] Version bumped in package.json
- [ ] CHANGELOG.md updated with all changes
- [ ] Created release notes
- [ ] All tests pass (when tests exist)

---

## 🔄 Common Commands

### Switch Between Branches

```bash
# Go to development (default for work)
git checkout dev

# Go to production (only for checking)
git checkout main

# Create new feature
git checkout dev
git checkout -b feature/add-favorites
```

### Sync with Remote

```bash
# Pull latest from dev (do this often!)
git checkout dev
git pull origin dev

# Pull latest from main (rare)
git checkout main
git pull origin main
```

### Fix Conflicts

```bash
# If merge conflict occurs:
git status  # See conflicted files
# Edit files, resolve <<<<<<< markers
git add .
git commit -m "fix: resolve merge conflicts"
```

### Undo Changes

```bash
# Undo uncommitted changes in file
git checkout -- file.tsx

# Undo ALL uncommitted changes
git reset --hard HEAD

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

## 🔐 Branch Protection Setup

### Protect `main` branch on GitHub:

1. Go to: https://github.com/Den3112/slovor-mp/settings/branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Settings:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ❌ Do not allow bypassing the above settings
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
style: improve button design
perf: optimize image loading
```

### 2. Small, Frequent Commits

✅ **Good:**
```bash
git commit -m "feat: add login form"
git commit -m "feat: add form validation"
git commit -m "style: improve form design"
git commit -m "fix: correct email validation"
```

❌ **Bad:**
```bash
git commit -m "add everything for auth"
git commit -m "wip"
git commit -m "fix"
```

### 3. Pull Before Push

**Always** pull latest before pushing:

```bash
git pull origin dev
# Resolve conflicts if any
git push origin dev
```

### 4. Test Before Merge to Main

**Never** merge to main without:
- ✅ Testing on dev environment
- ✅ Review from another developer (if team)
- ✅ All checks passing

### 5. Keep Dev Clean Too

Even though dev has full history:
- Don't commit commented code
- Don't commit console.log()
- Don't commit temporary files
- Use .gitignore properly

---

## 🐛 Troubleshooting

### Vercel Build Fails

```bash
# 1. Test build locally first
npm run build

# 2. If passes locally but fails on Vercel:
# Check environment variables in Vercel
# Check Node.js version matches local
# Clear Vercel cache: Deployments → Redeploy
```

### Merge Conflicts

```bash
# Update your branch with latest dev
git checkout dev
git pull origin dev
git checkout your-feature-branch
git merge dev

# Resolve conflicts in files:
# Open file, find <<<<<<< markers
# Choose correct code
# Remove conflict markers

git add .
git commit -m "fix: resolve conflicts with dev"
```

### Branch Out of Sync

```bash
# Check status
git status
git fetch origin

# See differences
git log origin/dev..dev

# Force sync with remote (careful!)
git reset --hard origin/dev
```

### Accidentally Committed to Main

```bash
# If not pushed yet:
git checkout dev
git cherry-pick <commit-hash>
git checkout main
git reset --hard HEAD~1

# If already pushed (need force push):
# DON'T DO THIS if others are using main!
```

---

## 📊 Monitoring Deployments

### Check Deployment Status

1. **Vercel Dashboard**
   - See all deployments
   - Build logs
   - Preview URLs

2. **GitHub**
   - Vercel bot comments on PRs
   - Deployment checks in PR status

3. **Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   vercel --version
   vercel ls
   ```

### Rollback if Needed

**Option 1: Via Vercel Dashboard**
1. Go to Vercel → Deployments
2. Find previous working deployment
3. Click "Promote to Production"

**Option 2: Via Git Revert**
```bash
git revert <bad-commit-hash>
git push origin main
```

---

## 📋 Summary

| Branch | Purpose | History | Auto-Deploy | URL |
|--------|---------|---------|-------------|-----|
| `main` | Production | Clean (squashed) | ✅ Yes | slovor-mp.vercel.app |
| `dev` | Development | Full (all commits) | ✅ Yes | slovor-mp-git-dev.vercel.app |
| `feature/*` | Features | Local only | ✅ Yes (Preview) | slovor-mp-git-feature-*.vercel.app |

**Workflow:**
```
Local → feature/* → dev (full history) → main (clean) → Production
```

**Key Rule:**
- Work on `dev` daily
- Merge to `main` for releases only
- Use "Squash and merge" for clean main history

---

## 🎓 Example: Complete Feature Workflow

```bash
# Day 1: Start feature
git checkout dev
git pull origin dev
git checkout -b feature/user-profile
# ... work ...
git commit -m "feat: add profile page"
git push origin feature/user-profile  # Creates preview

# Day 2: Continue
git commit -m "feat: add avatar upload"
git commit -m "fix: validation errors"
git push origin feature/user-profile

# Day 3: Merge to dev
git checkout dev
git pull origin dev
git merge feature/user-profile
git push origin dev  # Deploys to dev environment

# Test on dev URL for a few days
# Add more fixes if needed

# Week later: Ready for production
# GitHub: Create PR (dev → main)
# Title: "Release v1.1.0: User profiles"
# Body: List all changes
# Squash and merge → Creates 1 commit in main
# Vercel deploys to production

# Tag release
git checkout main
git pull origin main
git tag v1.1.0
git push origin v1.1.0

# Back to dev for next feature
git checkout dev
```

---

**Last Updated:** December 19, 2025  
**Status:** Active workflow, follow this for all development!
