# 🤝 Contributing to SLOVOR Marketplace

Thank you for interest in contributing! Here's how to get started.

---

## 🔭 Code of Conduct

- Be respectful and constructive
- Help others learn
- Assume good intentions
- Report issues privately if needed

---

## 🔄 Getting Started

1. **Fork the repository**
   ```bash
   # Or just clone it directly if you have access
   git clone https://github.com/Den3112/slovor-mp.git
   cd slovor-mp
   ```

2. **Read the docs**
   - [QUICK_START.md](./QUICK_START.md) - Setup
   - [PRINCIPLES.md](./PRINCIPLES.md) - Coding standards (MANDATORY!)
   - [DEVELOPMENT.md](./DEVELOPMENT.md) - Workflow

3. **Setup locally**
   ```bash
   git checkout dev
   npm install
   cp .env.example .env.local
   # Add your Supabase credentials
   npm run dev
   ```

---

## 📢 Before You Start

**MANDATORY:** Read [PRINCIPLES.md](./PRINCIPLES.md)

These 8 principles are not optional:

1. Minimize code
2. Minimize coupling
3. Single ownership
4. Explicit > Magic
5. Errors are design
6. Code for humans
7. Minimize global state
8. KISS - Keep It Simple, Stupid

---

## 🚀 Workflow

### 1. Create Feature Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
```

### 2. Make Changes

```bash
# Edit files
# Test locally: npm run dev
# Check code quality
```

### 3. Quality Checks

**Before committing, run:**

```bash
npm run lint       # Check code issues
npm run type-check # Check TypeScript
npm run format     # Format code
npm run build      # Test build
```

**All must pass!**

### 4. Commit

```bash
git add .
git commit -m "feat: add my awesome feature"
```

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code improvement
- `perf:` - Performance improvement
- `docs:` - Documentation
- `test:` - Test additions

### 5. Push

```bash
git push origin feature/my-feature
```

### 6. Create Pull Request

1. Go to [GitHub](https://github.com/Den3112/slovor-mp)
2. Create PR from your branch to `dev`
3. Fill in the PR template
4. Wait for review
5. Address feedback
6. Merge when approved

---

## 📄 Pull Request Template

```markdown
## Description
What does this PR do? Why?

## Changes
- Change 1
- Change 2
- Change 3

## Related Issues
Closes #123

## Testing
How to test this?

## Screenshots (if UI change)
[Add screenshots or GIFs]

## Checklist
- [ ] Read PRINCIPLES.md
- [ ] Code follows project standards
- [ ] npm run lint passes
- [ ] npm run type-check passes
- [ ] npm run build passes
- [ ] Tested locally
- [ ] Documentation updated (if needed)
```

---

## 🧐 Types of Contributions

### Code
- New features
- Bug fixes
- Performance improvements
- Refactoring

### Documentation
- README improvements
- Tutorial additions
- Architecture documentation
- Code examples

### Issues
- Bug reports
- Feature requests
- Questions in discussions

### Testing
- Test writing
- Test coverage
- E2E tests

---

## 🌐 Development Tips

### Local Testing

```bash
# Start dev server
npm run dev
# Visit http://localhost:3000

# Test build
npm run build
npm run start

# Check for issues
npm run lint
npm run type-check
```

### Database

```bash
# Seed with test data
npm run db:seed

# Reset database
npm run db:reset

# View database info
npm run db:info
```

### Debugging

1. **Browser DevTools** - F12 in browser
2. **Server logs** - Output in terminal
3. **TypeScript errors** - `npm run type-check`
4. **Linting errors** - `npm run lint`

---

## ✅ Code Review Checklist

When reviewing code, check:

- [ ] Follows PRINCIPLES.md
- [ ] No unused variables
- [ ] No console.log() or TODO comments
- [ ] Proper error handling
- [ ] TypeScript types are correct
- [ ] Tests pass (npm run build)
- [ ] Documentation updated
- [ ] Commit messages are clear

---

## 📚 Documentation

If adding a feature, update docs:

- **ARCHITECTURE.md** - If changing system design
- **DEVELOPMENT.md** - If changing workflow
- **README.md** - If user-facing change
- **Code comments** - If adding complex logic

---

## 🎍 Common Issues

### Build fails
```bash
npm run build
npm run lint:fix
npm run type-check
```

### Git conflicts
```bash
git fetch origin
git merge origin/dev
# Resolve conflicts in editor
git add .
git commit -m "fix: resolve conflicts"
```

### Changes not showing
```bash
# Hard refresh
Ctrl+Shift+R

# Or clear cache
rm -rf .next
```

---

## 📄 Commit Message Examples

**Good:**
```
feat: add user authentication with Supabase
fix: resolve category filter bug
refactor: simplify listing API queries
docs: update PRINCIPLES.md with examples
```

**Bad:**
```
update stuff
fix
wip
add things
```

---

## 👥 Code Ownership

If you add significant features, you might become a maintainer:
- You maintain the code you write
- You help others understand it
- You're involved in design decisions

---

## 🐧 Questions?

1. Check [PRINCIPLES.md](./PRINCIPLES.md)
2. Check [DEVELOPMENT.md](./DEVELOPMENT.md)
3. Open a [Discussion](https://github.com/Den3112/slovor-mp/discussions)
4. Create an [Issue](https://github.com/Den3112/slovor-mp/issues)

---

## 👏 Thank You!

Contributions make SLOVOR better for everyone. Thank you for helping! 🚀

---

**Last Updated:** December 26, 2025  
**Status:** Active development, all contributions welcome!
