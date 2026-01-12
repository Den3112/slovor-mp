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

### `npm run precommit`
Runs **quick checks** (lint + type-check) without building. Automatically triggered on every `git commit` via husky.

---

## Pre-Commit Hook (Husky)
Every `git commit` now automatically runs:
```bash
npm run precommit
```

If lint or type-check fails, the commit is **blocked** until you fix the errors.

---

## Tips
- If you need to bypass the hook (not recommended): `git commit --no-verify`
- Always run `npm run verify` before a critical deploy to be 100% sure.
