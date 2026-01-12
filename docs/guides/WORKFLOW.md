---
description: Git workflow - MANDATORY for all code changes
---

# Git Workflow

> **IMPORTANT:** All changes MUST follow this workflow. No exceptions.

## Branch Structure

```
main      <- Production code (deployed to Vercel)
  └── dev <- Development branch (all work happens here)
       └── feature/* <- Feature branches (optional for large features)
```

## Workflow Steps

### 1. Before Starting Work
```bash
# Make sure you're on dev branch and it's up to date
git checkout dev
git pull origin dev
```

### 2. Making Changes
// turbo
```bash
# Work on dev branch for small changes
# For large features, create a feature branch:
git checkout -b feature/feature-name
```

### 3. Committing Changes
// turbo
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: add feature description"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `style:` - Formatting, styling
- `chore:` - Maintenance tasks

### 4. Pushing to Remote
// turbo
```bash
git push origin dev
```

### 5. Creating Pull Request (MANDATORY for main)

**NEVER push directly to main!**

```bash
# After pushing to dev, create PR via GitHub:
# dev -> main

# Or via CLI:
gh pr create --base main --head dev --title "Merge dev to main"
```

### 6. Merging to Main

1. Review the PR on GitHub
2. Ensure all checks pass (build, tests)
3. Merge via GitHub UI (Squash and merge recommended)

---

## Rollback Procedure

If something goes wrong after merge to main:

```bash
# Find the commit to revert to
git log --oneline

# Revert to specific commit
git revert <commit-hash>

# Or reset to previous commit (destructive)
git reset --hard <commit-hash>
git push --force origin main
```

---

## Deployment

- **Vercel** automatically deploys from `main` branch
- Each push to `main` triggers a new production deployment
- Preview deployments are created for PRs

---

## Quick Reference

| Action | Command |
|--------|---------|
| Switch to dev | `git checkout dev` |
| Pull latest | `git pull origin dev` |
| Stage changes | `git add .` |
| Commit | `git commit -m "type: message"` |
| Push | `git push origin dev` |
| Create PR | `gh pr create --base main --head dev` |

---

## AI Instructions

When making changes:
1. Always work on `dev` branch
2. Commit frequently with descriptive messages
3. Push to `dev` first
4. Create PR to merge `dev` -> `main`
5. Never push directly to `main`
6. Document significant changes in commit messages
