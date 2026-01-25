---
description: Pre-deploy verification workflow (Lint, Type-check, Build)
---

# Pre-Deploy Verification Workflow

## Commands

### `npm run verify`

Runs the **full Vercel build check** locally:

1. `npm run lint` — ESLint check
2. `npm run type-check` — TypeScript type validation
3. `npm run build` — Production build

**Run this before pushing to `dev` or `main` to catch errors before Vercel does.**

```bash
npm run verify
```

### `./scripts/docker.sh verify` (Recommended)

Runs the same verification inside a **clean Docker container**. This is the most accurate way to verify the project will build on Vercel/Production.

```bash
./scripts/docker.sh verify
```

### `npm run precommit`

Runs **quick checks** (lint + type-check) without building. Automatically triggered on every `git commit` via husky.

---

## 🛠️ Automated CI (GitHub Actions)

Every push to `dev` or `main` and every Pull Request triggers the **CI Verification** workflow.

- You can see the status on GitHub in the "Actions" tab or on the PR page.
- **DO NOT** merge if CI fails.

## Pre-Commit Hook (Husky)

Every `git commit` now automatically runs:

```bash
npm run precommit
```

If lint or type-check fails, the commit is **blocked** until you fix the errors.

---

## Tips

- If you need to bypass the hook (not recommended): `git commit --no-verify`
- Always prefer `./scripts/docker.sh verify` for a 100% reliable check.
