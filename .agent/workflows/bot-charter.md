---
description: Mandatory Core Instructions for all AI Bots working on Slovor MP
---

# 🤖 AI Bot Charter & Global Instructions

This document contains the **MANDATORY** rules for any AI agent, bot, or assistant interacting with this codebase. **Ignoring these rules will result in task rejection.**

## 1. Interaction & Decision Making

- **Mental Rule Check**: Before generating ANY code or response, you **MUST** pause and verify: "Am I following the Language Rule? The Design Rule? The Zero-Error Rule?"
- **Ask Before Acting**: If a requirement is silent or ambiguous — **ASK the USER**. Never assume.
- **Confirmation on Global Changes**: Before any high-impact operation (e.g. massive refactoring, repository rename, deleting large directories), you **MUST** obtain explicit confirmation.
- **Persistent Alignment**: You **MUST** read `.agent/workflows/memory-protocol.md` and `.agent/MEMORY.md` at the start of **EVERY** session.
- **Adaptive Reasoning**: Use `ULTRATHINK` for complex tasks. For simple tasks, use "Mental Rule Check". **Escalate** to Ultrathink if a "simple" fix fails verification.
- **Live Memory (RAM)**: Treat `.agent/MEMORY.md` as your working memory. Update the "Active RAM" section **DURING** your work.
- **Correction Protocol**: If the user corrects you for missing a rule (e.g. "You forgot Russian", "You broke the build"), you **MUST** log this failure in `.agent/MEMORY.md` under `📚 Knowledge Base`. This ensures you learn from mistakes.
- **Memory Maintenance**: You **MUST** update `.agent/MEMORY.md` at the end of every task/session.

## 2. Technical Quality (Zero User Burden)

- **STRICT Zero-Error Policy**: You **CANNOT** consider a task finished unless the project is completely error-free. You **MUST** run `npm run verify` (or equivalent lint/build checks) and resolve **ALL** issues. If you cannot fix an error, you must explicitly explain why and ask the user for direction.
- **Complexity Protocol (Ask First)**: If a task is confusing, creating a loop of errors, or requires a dangerous architectural change — **STOP**. Do not guess. Ask the user for clarification or a decision.
- **Silent Bug Fixes**: If you find minor lint errors or typos while working on a feature, fix them immediately.
- **Premium Implementation**: Follow the "Avant-Garde" design principles. UI must be premium, responsive, and animated. Avoid generic components.

## 3. Communication Standards

- **Language**: All chat/reports/plans in **Russian**. All code/comments/commits in **English**.
- **User-Friendly Reporting**: Every completion must end with a structured, visual report using icons (🚀, ⚠️, 💡, 📅, 📊) as defined in `coding-rules.md`.
- **Human-Centric Tone**: Be polite, empathetic, and tactful. Avoid robotic or defensive responses. Acknowledge user frustration validly.
- **NO Rhetorical Questions**: Treat **EVERY** question from the user as a direct inquiry that requires a specific answer. Never assume a question is rhetorical. If the user asks "Where did this come from?", you must explain the source.

## 4. Git & PR Protocol

- **Branching**: Always work on `dev` or a dedicated `feature/*` branch.
- **PR Mandatory**: All significant changes must be submitted via a Pull Request (PR) from `dev` to `main`.
- **Atomic Commits**: Commit frequently with descriptive messages following Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).

## 5. Debugging & Tools

- **Temporary Debug Files**: You are **authorized** to create temporary debugging files (e.g., `temp-debug.js`, `repro.test.ts`) to analyze complex issues. You **MUST** ensure these files are completely deleted after the analysis is finished.
- **Server-First Browser Use**: Before launching the browser subagent ("Antigravity Eye") or running automated visual tests, you **MUST** verify that the local development server (e.g., `npm run dev`) is running and actually responding (e.g., via `curl` or checking terminal output).

---

### bot-checklist

- [ ] Read all workflows in `.agent/workflows/`?
- [ ] Communication in Russian, Code in English?
- [ ] All Lint/Type errors fixed (Zero-Error Policy)?
- [ ] PR created for merge to `main`?
- [ ] `.agent/MEMORY.md` updated with latest status?
- [ ] Final report is visually rich and informative?
