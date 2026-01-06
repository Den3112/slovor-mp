---
description: 8 coding principles - mandatory for all code changes
---

# 8 Mandatory Coding Principles

> **WARNING:** These rules are MANDATORY for every code change.

## Principles

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

---

## Pre-Commit Checklist

- [ ] Functions less than 50 lines?
- [ ] Components less than 200 lines?
- [ ] No unnecessary global state?
- [ ] Errors handled?
- [ ] Code reads like prose?
- [ ] Is there a simpler solution?
