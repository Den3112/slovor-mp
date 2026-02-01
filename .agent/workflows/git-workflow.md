---
description: Git workflow - MANDATORY for all code changes
---

# Git Workflow

> **IMPORTANT:** All changes MUST follow this workflow. No exceptions.

## Branch Structure

```
main      <- Production code (deployed to Vercel)
  └── dev <- Integration branch (all bot work is merged here via PR)
       └── feature/* <- Feature branches (MANDATORY: all work starts here)
```

## 🛡️ Mandatory Git Protocol for Bots

Bots MUST follow this sequence for every change.

### Phase 1: Preparation

1. **Sync**: `git checkout dev && git pull origin dev`.
2. **Branch**: **MANDATORY** - Always create a feature branch: `git checkout -b feature/task-name`.
   - _Direct commits to `dev` or `main` are prohibited._

### Phase 2: Implementation & Verification

1. **Work**: Make the code changes.
2. **Local Cleanup**: Fix all lint errors.
3. **Automated Verification**: **MANDATORY** - run `./scripts/docker.sh verify`.
   - If it fails — FIX it.
   - Do NOT proceed if verification is red.

### Phase 3: Committing & Pushing

1. **Atomic Commits**: Stage related changes.
2. **Commit Message**: Use Conventional Commits (`feat:`, `fix:`, `chore:`).
3. **Push**: `git push origin feature/task-name`.

### Phase 4: Integration (to dev)

1. **MANDATORY PR to dev**: Create a Pull Request from your feature branch to **`dev`**.
   - **Command**: `gh pr create --base dev --head feature/task-name --title "feat: description" --body "Summary..."`.
2. **Auto-Report**: Inform the USER that the work is ready in a PR to `dev`.

### Phase 5: Merging to MAIN (Strictly Controlled)

1. **PR to main**: Only create a PR from `dev` to `main` when the USER explicitly requests it (e.g., "Deploy to main").
2. **NEVER** create a PR to `main` without USER approval.

---

## AI Instructions (Specific to Git)

Every bot MUST:

1. **Never push to `main` or `dev` directly**.
2. **Always work on `feature/*` branches**.
3. **Always PR to `dev` first** and wait for user acknowledgment or integration.
4. **Verify BEFORE push**. Pushing broken code to any branch is prohibited.
5. **Autoreport**: Provide the PR link to `dev` in your final report.
6. **Update Memory**: Ensure `.agent/MEMORY.md` is active and updated before you PR. Commit the memory update with your changes.

---

## Quick Reference Commands (for Bots)

| Task        | Command                                                           |
| ----------- | ----------------------------------------------------------------- |
| Full Verify | `./scripts/docker.sh verify`                                      |
| PR to DEV   | `gh pr create --base dev --head [branch] --title "..."`           |
| PR to MAIN  | `gh pr create --base main --head dev --title "Merge dev to main"` |
| Check CI    | `gh run list --limit 1`                                           |

---

## Quick Reference Commands (for Bots)

| Task        | Command                                                                        |
| ----------- | ------------------------------------------------------------------------------ |
| Full Verify | `./scripts/docker.sh verify`                                                   |
| Push to dev | `git push origin dev`                                                          |
| PR to MAIN  | `gh pr create --base main --head dev --title "Merge dev to main" --body "..."` |
| Check CI    | `gh run list --limit 1`                                                        |
