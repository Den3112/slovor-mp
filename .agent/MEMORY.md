# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES REFRESH (DO NOT IGNORE)
1.  **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2.  **Zero-Error**: NEVER finish a task with broken code. run `npm run verify`.
3.  **Design**: "Customer CRM" style. Solid, Clean, Data-Dense. NO Glassmorphism.
4.  **Process**: Read Memory -> Fix -> Verify -> Update Memory.
5.  **Unsure?**: ASK the user. Do not guess.
6.  **URGENT**: If User uses CAPS, pay SPECIAL ATTENTION. It is a critical instruction.
7.  **Redesign Instructions**: READ `.agent/REDESIGN_INSTRUCTIONS.md` for complete implementation guide!

> **Last Updated**: 2026-02-01 21:40
> **Status**: ✅ Premium Redesign - COMPLETE (Phase 1-4)

## ⚡ Active RAM (Operational Context)

- **Current User Intent**: Переход к следующему этапу дорожной карты (Roadmap Investor).
- **Active Branch**: `feature/premium-redesign` (All redesign PRs ready)
- **Focus**: Advanced Media Management or Smart Search & Discovery.
- **Problem**: Need to decide on the next priority from the Roadmap.

## ✅ Completed
1. ✅ Created PR #27 (snapshot before redesign)
2. ✅ Created branch `feature/premium-redesign`
3. ✅ Created PR #28 (redesign to dev)
4. ✅ Updated core components (Button, Badge, Input, Card)
5. ✅ Updated layout components (Header, Sidebar, DashboardShell)
6. ✅ Completed Full Premium Redesign (Phases 1-4)
7. ✅ Pushed PR #28 with final updates
8. ✅ Optimized CI/CD (GitHub Actions, Tests, Circular checks)
9. ✅ Resolved circular dependency in Listings API

## 📋 REDESIGN_INSTRUCTIONS.md Summary

Файл содержит:
- **Part 1**: Design System (exact CSS values)
- **Part 2**: Component Updates (Button, Card, Badge, Input)
- **Part 3**: Layout Components (Sidebar, Header, DashboardShell)
- **Part 4**: Page-by-Page Updates
- **Part 5**: Dark Theme rules
- **Part 6**: Verification checklist

## 🎯 Решения по архитектуре
1. ✅ Навигация: Упростить до 6 пунктов (без вложенности)
2. ❌ URL: Оставить `/profile/*` (не менять на `/dashboard/*`)
3. ✅ Приоритет: Сначала дизайн, потом архитектура

## 🎨 Design System Reference
```css
/* CRM Palette */
--primary: 217 91% 60%;     /* #3B82F6 Blue */
--background: 210 40% 98%;  /* #F8FAFC Light */
--background: 222 47% 3%;   /* #020617 Dark */
--card: 0 0% 100%;          /* #FFFFFF Light */
--card: 222 47% 6%;         /* #0F172A Dark */
--border: 214 32% 91%;      /* #E2E8F0 Light */
--border: 217 33% 17%;      /* #1E293B Dark */
```

## 🚫 Forbidden Styles
- NO `backdrop-blur-*`
- NO `bg-gradient-*`
- NO `shadow-2xl`
- NO `rounded-3xl`
- NO emojis as icons

## 📝 For Next AI Agent
1. **READ** `.agent/REDESIGN_INSTRUCTIONS.md` FIRST
2. Checkout `feature/premium-redesign` branch
3. Follow instructions step by step
4. Run `npm run verify` after each change
5. Commit frequently with conventional commits
