# 🚀 Quick Start - Clean Main Branch

## 🎯 Goal

Create clean `main` with 1 commit, keep full history in `dev`.

---

## ⚡ Quick Commands

### Option 1: Automated Script (Recommended)

```bash
# 1. Go to project
cd slovor-mp

# 2. Switch to dev
git checkout dev
git pull origin dev

# 3. Run script
chmod +x scripts/clean-main-branch.sh
./scripts/clean-main-branch.sh

# 4. Follow prompts
# Done!
```

### Option 2: Manual Commands

```bash
# 1. Backup
git checkout main
git tag backup/before-cleanup-$(date +%Y%m%d)
git push origin --tags

# 2. Create clean branch
git checkout --orphan main-clean
git add .
git commit -m "chore: production release v1.0.0

Production-ready marketplace.

For full history, see 'dev' branch."

# 3. Replace main
git branch -D main
git branch -m main
git push origin main --force

# 4. Back to dev
git checkout dev

# Done!
```

---

## ✅ Verify

```bash
# Check main (should be 1)
git log --oneline main | wc -l

# Check dev (should be 14+)
git log --oneline dev | wc -l

# Test build
git checkout main
npm run build  # Must pass!

git checkout dev
npm run build  # Must pass!
```

---

## 🔄 Rollback (If Needed)

```bash
# Find backup
git tag | grep backup

# Restore
git checkout main
git reset --hard backup/before-cleanup-YYYYMMDD
git push origin main --force
```

---

## 📚 Full Instructions

See [CLEAN_MAIN_BRANCH.md](./CLEAN_MAIN_BRANCH.md)

---

**Ready?** Run the script! 🚀
