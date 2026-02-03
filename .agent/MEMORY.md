# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES (DO NOT IGNORE)
1. **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2. **Zero-Error**: NEVER finish with broken code. Run `npm run verify`.
3. **Design**: "Customer CRM" style. Solid, Clean, Data-Dense. NO Glassmorphism.
4. **Process**: Read Memory → Work → Verify → Update Memory.
5. **Unsure?**: ASK the user. Do not guess.
6. **URGENT**: If user uses CAPS, pay SPECIAL ATTENTION.

> **Last Updated**: 2026-02-03
> **Status**: 🚀 Фаза 2 Masterplan V2 — Типы и тесты починены. Actions исправлены.

---

## ⚡️ Framework Invariants (Next.js 16+)
- **Middleware is Deprecated**: Use `proxy.ts` (root) instead of `middleware.ts`.
- **Proxy Function**: The entry point in `proxy.ts` must be `export async function proxy(request: NextRequest)`.
- **Middleware Convention**: `middleware.ts` is now `proxy.ts` for routing, redirects, and header manipulation.

---

## 📌 Current State
- **Current User Intent**: Реализация Фазы 1 Masterplan V2 (Главная страница, Навигация, Mega Menu).
- **Active Errors / Blockers**: Нет.
- **Current Focus**: [Masterplan V2] - Phase 2: Product & Search Experience
- **Current Branch**: `feature/phase2-listing-dashboard-dynamic-filters`
- **Latest Achievement**: Исправлены типы транзакций (добавлены `refill`, `promotion_top/highlight`), починены тесты фильтров и CI Verification (`npm run verify` проходит).
- **Детальный статус**: Фаза 2 активна. См. `.agent/plans/implementation_plan_v2_phase2.md`

---

## ✅ Completed (Premium Redesign)

1. ✅ Core components (Button, Badge, Input, Card) - Standardized `rounded-xl`.
2. ✅ Layout components (Header, Sidebar, DashboardShell) - Integrated & Solid.
3. ✅ Auth, Search, Listing pages - Removed glassmorphism.
4. ✅ User Dashboard (Overview, Listings, Wallet, Orders, Reviews) - Clean & Data-Dense.
5. ✅ Admin Dashboard (Overview, Users, Moderation, Content Management) - Fully fixed rounding.
6. ✅ Messaging & Favorites - Systemic fixes.
7. ✅ I18n fix: Proxied `useTranslation` + Hydration sync fix (removed from render).
8. ✅ [Masterplan V2] Phase 1: Completed Homepage & Nav overhaul (Mega Menu, Categories Grid, Regions, Mobile Drawer).
9. ✅ SEO: `StructuredData` component with breadcrumbs and navigation.

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

## 🚫 Forbidden Styles (STRICT)

- NO `backdrop-blur-*` (Cleaned up in all components).
- NO `bg-gradient-*`.
- NO `shadow-2xl`.
- NO `rounded-3xl` or higher (Except avatars). Standard is `rounded-xl`/`rounded-lg`.
- NO emojis as icons.

---

## 📝 For Next AI Agent

1. **READ** this file first.
2. Check existing PR #30 before pushing new changes.
3. If continuing to Phase 9, ensure and maintain the "Solid" aesthetic.
4. Run `npm run verify` religiously.
