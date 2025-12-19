#!/bin/bash
# Quick cleanup script for main branch
set -e

echo "🧹 Cleaning main branch..."

# Safety check
if [ "$(git branch --show-current)" != "dev" ]; then
    echo "❌ Error: Must be on dev branch"
    echo "Run: git checkout dev"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️ Warning: You have uncommitted changes"
    read -p "Commit them now? (yes/no): " COMMIT
    if [ "$COMMIT" = "yes" ]; then
        git add .
        git commit -m "save: before cleanup"
        git push origin dev
    else
        echo "❌ Aborted. Commit changes first."
        exit 1
    fi
fi

echo "✅ Creating backup tag..."
git checkout main
git tag "backup/before-cleanup-$(date +%Y%m%d-%H%M%S)"
git push origin --tags

echo "✅ Creating clean main..."
git checkout --orphan main-clean
git add .
git commit -m "chore: production release v1.0.0

Production-ready marketplace application.

Features:
- Next.js 16 + Supabase + TypeScript
- 8 mandatory coding principles
- Full documentation
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

For full development history, see 'dev' branch."

echo "✅ Replacing main..."
git branch -D main
git branch -m main

echo "⚠️ About to force push to main. This will rewrite history!"
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" = "yes" ]; then
    git push origin main --force
    echo "✅ Main branch cleaned!"
else
    echo "❌ Aborted"
    exit 1
fi

git checkout dev

echo ""
echo "✅ Done!"
echo "📊 Main: $(git log main --oneline | wc -l | tr -d ' ') commit(s)"
echo "📊 Dev: $(git log dev --oneline | wc -l | tr -d ' ') commit(s)"
echo ""
echo "Next steps:"
echo "1. Check Vercel: https://slovor-mp.vercel.app"
echo "2. Continue working on dev branch"
echo "3. Use 'Squash and merge' for future releases"
