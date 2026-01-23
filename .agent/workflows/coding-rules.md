---
description: 8 coding principles - mandatory for all code changes
---

# 10 Mandatory Coding Principles

> **WARNING:** These rules are MANDATORY for every code change.

## Principles

### 0. Autonomous Alignment (PRE-CONDITION)

**You must NOT wait for the USER to remind you of the rules.**
Before starting any task, you **MUST** read all files in `.agent/workflows/` (especially `coding-rules.md`, `git-workflow.md`, and `language-policy.md`) to align with the latest project standards. You are responsible for maintaining project consistency autonomously.

### 00. Zero User Burden & Automated QA (MANDATORY)

**Your goal is to save the USER's time.**

- You **MUST** run all necessary checks (`./scripts/docker.sh verify` or `npm run verify`) **automatically** before declaring a task complete.
- Never ask the user to "check if it builds" — check it yourself.
- If a test fails, fix it. If a lint error occurs, fix it.
- The user should only see a working, verified solution.

### 1. Minimize Code

Small classes, small functions, small libraries. Less code = fewer bugs and lower cognitive load.

**Limits:**

- Function: max 50 lines
- Component: max 200 lines
- File: max 300 lines

If exceeded — split into parts.

### 2. Minimize Coupling

The less objects know about each other — the better. Dependency Injection, interfaces, hooks, callbacks exist to prevent code from becoming a monolith.

**Application:**

- Props over global state
- Composition over inheritance
- Hooks for reusable logic

### 3. Single Responsibility = Single Owner

Logic must have a specific "owner". Don't spread responsibility across a dozen classes.

**Application:**

- One component = one task
- One hook = one functionality
- Clear boundaries between layers

### 4. Explicit Over Magic

Magic frameworks, auto-scans, hidden actions look nice the first month. Then you pay with debugging.

**Application:**

- Explicit imports
- Explicit types (TypeScript strict)
- No hidden side effects

### 5. Errors Are Part of Design, Not Edge Cases

Error handling, timeouts, retries, failures — not "we'll add later".

**Application:**

- try/catch for async operations
- Error boundaries for React
- Fallback UI for loading errors
- Input validation

### 6. Code Is Written for Humans, Not Compilers

Computer will eat anything. Humans won't.

**Application:**

- Clear variable and function names
- Comments for complex logic
- Consistent style

### 7. Minimize Global State

Global state = hidden dependencies = chaos.

**Application:**

- React state and props primarily
- Context only for truly global things (theme, auth)
- URL state for filters and pagination

### 8. KISS — No Compromises

Simple solution is almost always more correct, more stable, and cheaper to maintain.

**Application:**

- Don't overcomplicate prematurely
- Fewer abstractions = fewer bugs
- If it can be simpler — make it simpler

### 9. Language Policy (CRITICAL)

All communication with the owner (USER) — replies in chat, implementation plans, summaries, and explanations — must be in **Russian**.
However, **all code**, including variable names, function names, and comments within the code files, must be in **English**.

### 10. Communication & Confirmation (MANDATORY)

- **If something is unclear or ambiguous — ASK the USER first!** Never guess.
- Before making **global or large-scale changes** (e.g., repository renaming, large refactors, pushing to production), you **MUST ask for confirmation**.

### 11. Aesthetic & User-Friendly Communication (MANDATORY)

All reports, plans, and responses must be **user-friendly**, **informative**, and **visually appealing**:

- Use **icons and emojis** (🚀, ✅, ⚠️, 💡, 📅, 📊, etc.) to make information easy to scan.
- Use **bold text** for key terms and **headers** for sections.
- Use **lists and tables** for structured data.
- The goal is to make reading a pleasure, not a chore.

### 12. Final Report Structure (MANDATORY)

After completing the task, you **MUST** provide a clear, **visually rich** report in **Russian** with the following sections (EXACTLY AS WRITTEN):

1.  **🚀 Что сделано**: List of implemented changes (use checkboxes where appropriate).
2.  **⚠️ Какие есть проблемы**: Any bugs, lint errors, or architectural issues.
3.  **💡 Какие есть рекомендации**: Suggestions for further improvements.
4.  **📅 Что планируется делать дальше**: Next steps.
5.  **📊 Общая информация о проекте, какую именно часть сейчас реализовали от общего объема**: Visual progress summary.

---

## Pre-Commit Checklist

- [ ] Functions less than 50 lines?
- [ ] Components less than 200 lines?
- [ ] No unnecessary global state?
- [ ] Errors handled?
- [ ] Code reads like prose?
- [ ] Is there a simpler solution?
- [ ] **Communication in Russian, code in English?**
- [ ] **Unclear points clarified with the user?**
- [ ] **Global changes confirmed?**
- [ ] **Verified via automated scripts (`./scripts/docker.sh verify`)?**
- [ ] **Zero lint/type errors remaining?**
- [ ] **Report is visually rich (icons, bold, structure)?**
- [ ] **Report follows the EXACT mandatory structure?**
