# 💙 GIT WORKFLOW GUIDE

> Best practices for Git in Slovor Marketplace project

---

## 🌿 BRANCH STRUCTURE

```
main (production)     ← Always stable, only from dev
  ↓
dev (development)     ← Main development branch
  ↓
feature/* branches    ← Individual features
```

**Important:** Only `main` and `dev` are permanent branches.

---

## 📝 COMMIT MESSAGE FORMAT

### Structure:
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Updating build tasks, etc.

### Examples:

```bash
feat(auth): add login page with email/password

fix(listing): resolve image upload issue on mobile

docs(readme): update quick start guide

refactor(api): simplify listing query logic

chore(deps): upgrade Next.js to 16.1.0
```

---

## 🚀 DAILY WORKFLOW

### 1. Start Work

```bash
# Always start from dev
git checkout dev
git pull origin dev

# Create feature branch (optional for small changes)
git checkout -b feature/auth-login
```

### 2. Make Changes

```bash
# Write code...

# Check what changed
git status
git diff

# Stage changes
git add app/auth/login/
git add components/auth/

# Commit
git commit -m "feat(auth): add login page with email/password"
```

### 3. Push Changes

```bash
# Push to dev (small changes) or feature branch
git push origin dev
# or
git push origin feature/auth-login
```

### 4. Code Review (for feature branches)

```bash
# On GitHub:
# 1. Create Pull Request: feature/auth-login → dev
# 2. Wait for review
# 3. Merge (Squash and merge)
# 4. Delete feature branch
```

---

## 🤝 MERGE TO MAIN

**Only when ready for production:**

```bash
# On GitHub:
# 1. Create PR: dev → main
# 2. Review carefully
# 3. Use "Squash and merge"
# 4. This triggers deployment to production
```

---

## ✅ CHECKLIST BEFORE COMMIT

- [ ] Code compiles: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] Tests pass (if applicable)
- [ ] No console.logs in production code
- [ ] No secrets in code
- [ ] Commit message follows format

---

## 🚨 TROUBLESHOOTING

### Merge Conflicts

```bash
git fetch origin
git rebase origin/dev

# Resolve conflicts in editor
git add <resolved-files>
git rebase --continue
```

### Undo Last Commit (not pushed)

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

### Undo Pushed Commit

```bash
# Create revert commit
git revert <commit-hash>
git push origin dev
```

---

## 📚 REFERENCES

- **AI Guide:** `.github/AI_GUIDE.md`
- **Project Status:** `.github/PROJECT_STATUS.md`
- **8 Principles:** Check `docs` branch

---

*Last Updated: December 22, 2025*
