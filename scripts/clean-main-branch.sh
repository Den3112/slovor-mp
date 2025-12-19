#!/bin/bash
# Clean Main Branch Script
# This creates a clean main branch with one commit
# While preserving full history in dev branch

set -e  # Exit on error

echo "🧹 Cleaning main branch..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Safety checks
echo "${YELLOW}Step 1: Safety checks${NC}"

# Check if on dev branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo "${RED}Error: Must be on 'dev' branch${NC}"
    echo "Run: git checkout dev"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "${RED}Error: Uncommitted changes detected${NC}"
    echo "Commit or stash changes first"
    exit 1
fi

echo "${GREEN}✓ Safety checks passed${NC}"
echo ""

# Step 2: Create backup
echo "${YELLOW}Step 2: Creating backup tag${NC}"
BACKUP_TAG="backup/before-cleanup-$(date +%Y%m%d-%H%M%S)"
git checkout main
git tag "$BACKUP_TAG"
git push origin "$BACKUP_TAG"
echo "${GREEN}✓ Backup created: $BACKUP_TAG${NC}"
echo ""

# Step 3: Create clean branch
echo "${YELLOW}Step 3: Creating clean main branch${NC}"
git checkout --orphan main-clean
git add .

# Create commit
git commit -m "chore: production release v1.0.0

Production-ready marketplace application.

Features:
- Next.js 16 + Supabase + TypeScript
- Full documentation (8 coding principles)
- Auto-deploy to Vercel
- Responsive design
- Search and filters

Tech Stack:
- Next.js 16.1.0, React 18.2.0
- TypeScript 5.7.2
- Supabase 2.39.0
- Tailwind CSS 3.2.1

Deployment:
- Production: https://slovor-mp.vercel.app
- Preview: https://slovor-mp-git-dev.vercel.app

Status: ✅ Production Ready

See 'dev' branch for full development history."

echo "${GREEN}✓ Clean commit created${NC}"
echo ""

# Step 4: Replace main
echo "${YELLOW}Step 4: Replacing main branch${NC}"
git branch -D main
git branch -m main
echo "${GREEN}✓ Local main branch replaced${NC}"
echo ""

# Step 5: Push
echo "${YELLOW}Step 5: Pushing to GitHub${NC}"
echo "${RED}This will force push to main!${NC}"
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" = "yes" ]; then
    git push origin main --force
    echo "${GREEN}✓ Main branch pushed${NC}"
else
    echo "${RED}Aborted. To rollback: git checkout $BACKUP_TAG${NC}"
    exit 1
fi

echo ""

# Step 6: Verify
echo "${YELLOW}Step 6: Verifying${NC}"
COMMIT_COUNT=$(git log --oneline main | wc -l | tr -d ' ')
echo "Main branch commits: $COMMIT_COUNT"

if [ "$COMMIT_COUNT" -eq "1" ]; then
    echo "${GREEN}✓ Success! Main branch has 1 clean commit${NC}"
else
    echo "${RED}Warning: Expected 1 commit, got $COMMIT_COUNT${NC}"
fi

# Switch back to dev
git checkout dev
DEV_COMMIT_COUNT=$(git log --oneline dev | wc -l | tr -d ' ')
echo "Dev branch commits: $DEV_COMMIT_COUNT"
echo "${GREEN}✓ All history preserved in dev${NC}"

echo ""
echo "${GREEN}✅ Done!${NC}"
echo ""
echo "Next steps:"
echo "1. Check Vercel deployment: https://slovor-mp.vercel.app"
echo "2. Continue development on 'dev' branch"
echo "3. Use 'Squash and merge' for future releases"
echo ""
echo "Backup tag: $BACKUP_TAG"
echo "To rollback: git reset --hard $BACKUP_TAG && git push origin main --force"
