#!/bin/bash
# Complete repository restructure script
# This organizes docs, cleans branches, and sets up AI guide

set -e

echo "🧹 Starting repository restructure..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Clean up old branches
echo "${YELLOW}Step 1: Cleaning up branches${NC}"
git fetch origin

# Delete Vercel branches
for branch in vercel/vercel-speed-insights-to-nextj-96vd30 vercel/vercel-web-analytics-to-nextjs-4x573o vercel/vercel-web-analytics-to-nextjs-jeiknm; do
    if git ls-remote --heads origin $branch | grep -q $branch; then
        git push origin --delete $branch 2>/dev/null || true
        echo "  Deleted: $branch"
    fi
done
echo "${GREEN}✓ Branches cleaned${NC}"
echo ""

# Step 2: Remove documentation from dev/main
echo "${YELLOW}Step 2: Removing docs from dev/main${NC}"
git checkout dev
git pull origin dev

# Files to remove
rm -f ARCHITECTURE.md 2>/dev/null || true
rm -f CHANGELOG.md 2>/dev/null || true
rm -f CLEAN_MAIN_BRANCH.md 2>/dev/null || true
rm -f DEVELOPMENT.md 2>/dev/null || true
rm -f ENVIRONMENTS.md 2>/dev/null || true
rm -f PRINCIPLES.md 2>/dev/null || true
rm -f PROJECT_CONTEXT.md 2>/dev/null || true
rm -f QUICK_START.md 2>/dev/null || true
rm -f VERCEL_TRIGGER.md 2>/dev/null || true
rm -f cleanup-main.sh 2>/dev/null || true
rm -f .vercel-dev 2>/dev/null || true

echo "${GREEN}✓ Documentation removed from dev${NC}"
echo ""

# Step 3: Create .github folder and AI guide
echo "${YELLOW}Step 3: Creating AI guide${NC}"
mkdir -p .github

# AI guide already exists from previous push
echo "${GREEN}✓ AI guide ready${NC}"
echo ""

# Step 4: Update README
echo "${YELLOW}Step 4: Updating README${NC}"
cat > README.md << 'EOFREADME'
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
EOFREADME

echo "${GREEN}✓ README updated${NC}"
echo ""

# Step 5: Commit and push dev changes
echo "${YELLOW}Step 5: Committing changes${NC}"
git add -A
git commit -m "chore: restructure - remove docs from dev, add AI guide" || echo "Nothing to commit"
git push origin dev
echo "${GREEN}✓ Dev updated${NC}"
echo ""

# Step 6: Update main (cherry-pick or manual)
echo "${YELLOW}Step 6: Updating main${NC}"
echo "${GREEN}✓ Main will be updated via PR (dev → main)${NC}"
echo ""

# Step 7: Show final structure
echo "${YELLOW}Step 7: Final verification${NC}"
echo ""
echo "Branches:"
git branch -a | grep -E '(main|dev|docs)' || echo "  All branches ready"
echo ""
echo "Files in dev:"
ls -la | grep -E '(.md|.sh)' || echo "  All clean!"
echo ""

echo "${GREEN}✅ Restructure complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Check dev branch: git log --oneline -5"
echo "2. Verify docs branch: git checkout docs && ls -la"
echo "3. Create PR: dev → main (Squash merge)"
echo "4. Delete this script: rm restructure.sh"
echo ""
echo "Documentation: git checkout docs"
echo "AI Guide: cat .github/AI_GUIDE.md"
