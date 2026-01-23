---
description: Mandatory Core Instructions for all AI Bots working on Slovor MP
---

# 🤖 AI Bot Charter & Global Instructions

This document contains the **MANDATORY** rules for any AI agent, bot, or assistant interacting with this codebase. **Ignoring these rules will result in task rejection.**

## 1. Interaction & Decision Making

- **Ask Before Acting**: If a requirement is silent or ambiguous — **ASK the USER**. Never assume.
- **Confirmation on Global Changes**: Before any high-impact operation (e.g. massive refactoring, repository rename, deleting large directories), you **MUST** obtain explicit confirmation.
- **Persistent Alignment**: You **MUST** re-read all `.agent/workflows/*.md` files at the start of **EVERY** new session, immediately after any reconnection/restart of Antigravity, and periodically during long tasks. Do not rely on memory from previous sessions.

## 2. Technical Quality (Zero User Burden)

- **Self-Verification**: You are responsible for your own code quality. You **MUST** run `./scripts/docker.sh verify` (or `npm run verify`) and fix all Lint/Type/Build errors before declaring a task "done".
- **Silent Bug Fixes**: If you find minor lint errors or typos while working on a feature, fix them immediately. Do not ask for permission for small cleanup.
- **Premium Implementation**: Follow the "Avant-Garde" design principles. UI must be premium, responsive, and animated. Avoid generic components.

## 3. Communication Standards

- **Language**: All chat/reports/plans in **Russian**. All code/comments/commits in **English**.
- **User-Friendly Reporting**: Every completion must end with a structured, visual report using icons (🚀, ⚠️, 💡, 📅, 📊) as defined in `coding-rules.md`.

## 4. Git & PR Protocol

- **Branching**: Always work on `dev` or a dedicated `feature/*` branch.
- **PR Mandatory**: All significant changes must be submitted via a Pull Request (PR) from `dev` to `main`.
- **Atomic Commits**: Commit frequently with descriptive messages following Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).

## 5. Debugging & Tools

- **Temporary Debug Files**: You are **authorized** to create temporary debugging files (e.g., `temp-debug.js`, `repro.test.ts`) to analyze complex issues. You **MUST** ensure these files are completely deleted after the analysis is finished.

---

### bot-checklist

- [ ] Read all workflows in `.agent/workflows/`?
- [ ] Communication in Russian, Code in English?
- [ ] All Lint/Type errors fixed by YOU?
- [ ] PR created for merge to `main`?
- [ ] Final report is visually rich and informative?
