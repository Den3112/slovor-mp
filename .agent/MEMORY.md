# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES (DO NOT IGNORE)
1. **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2. **Zero-Error**: NEVER finish with broken code. Run `npm run verify`.
3. **Design**: "Customer CRM" style. Solid, Clean, Data-Dense. NO Glassmorphism.
4. **Process**: Read Memory → Work → Verify → Update Memory.
5. **Unsure?**: ASK the user. Do not guess.
6. **URGENT**: If user uses CAPS, pay SPECIAL ATTENTION.

> **Last Updated**: 2026-02-03
> **Status**: ✅ Phase 7 Complete. 🛠 Infrastructure updated (Next.js 16, proxy.ts). UI Primitives (Avatar, Dialog, Dropdown) refactored to Solid.

---

## ⚡️ Framework Invariants (Next.js 16+)
- **Middleware is Deprecated**: Use `proxy.ts` (root) instead of `middleware.ts`.
- **Proxy Function**: The entry point in `proxy.ts` must be `export async function proxy(request: NextRequest)`.
- **Middleware Convention**: `middleware.ts` is now `proxy.ts` for routing, redirects, and header manipulation.

---

## 📌 Current State
- **Current User Intent**: Полная очистка UI завершена. Верификация пройдена. Создание PR в main.
- **Active Errors / Blockers**: Нет.
- **Scratchpad / Hypothesis**: Проект готов к релизу Фазы 7. Все страницы (включая блог и контакты) приведены к Solid стилю.


- **Branch**: `dev`
- **Focus**: Final PR to main
- **Next**: Deployment & Phase 8/9 review
- **Детальный статус**: См. `.agent/IMPLEMENTATION_STATUS.md`

---

## ✅ Completed (Premium Redesign)

1. ✅ Core components (Button, Badge, Input, Card)
2. ✅ Layout components (Header, Sidebar, DashboardShell)
3. ✅ Auth, Search, Listing pages
4. ✅ User Dashboard (Overview, Listings, Wallet, Orders, Reviews)
5. ✅ Admin Dashboard (Overview, Users, Moderation)
6. ✅ Messaging & Favorites
7. ✅ Dark mode verified
8. ✅ Mobile responsiveness verified

---

## 📋 New Architecture Plan

**Documentation**: `.agent/plans/`
- `ARCHITECTURE_BLUEPRINT.md` - All 41 pages, layouts, components
- `UX_FUNCTIONALITY_GUIDE.md` - UX patterns, empty states
- `ADVANCED_FEATURES_GUIDE.md` - Trust, safety, monetization

**8 Main Phases + 1 Optional**:
1. URL Restructure
2. Mobile Navigation
3. Sidebar Restructure
4. Header Redesign
5. All 41 Pages
6. ✅ Trust & Safety
7. ✅ Monetization
8. ✅ Final Verification
9. Theme Switching (Not Urgent)

---

## 🎨 Design System

```css
/* CRM Palette */
--primary: #3B82F6;       /* Blue */
--background: #F8FAFC;    /* Light */
--background: #020617;    /* Dark */
--card: #FFFFFF;          /* Light */
--card: #0F172A;          /* Dark */
```

**Fonts**: DM Sans, Space Grotesk, JetBrains Mono

---

## 🚫 Forbidden Styles

- NO `backdrop-blur-*`
- NO `bg-gradient-*`
- NO `shadow-2xl`
- NO `rounded-3xl`
- NO emojis as icons

---

## 📝 For Next AI Agent

1. **READ** this file first
2. **READ** `.agent/README.md` for execution order
3. **READ** `.agent/plans/ARCHITECTURE_BLUEPRINT.md`
4. Start with Phase 1 (URL restructure)
5. Run `npm run verify` after each change
