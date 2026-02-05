# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES (DO NOT IGNORE)
1. **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2. **Zero-Error**: NEVER finish with broken code. Run `npm run verify`.
3. **Design**: "Customer CRM" style. Solid, Clean, Data-Dense. NO Glassmorphism.
4. **Process**: Read Memory → Work → Verify → Update Memory.
5. **Unsure?**: ASK the user. Do not guess.
6. **URGENT**: If user uses CAPS, pay SPECIAL ATTENTION.

> **Last Updated**: 2026-02-05
> **Status**: 🚀 REDESIGN PHASE 5: Mobile Optimization in progress. Normalized layout typography, updated manifest, and implemented Pull-to-refresh.

---

## ⚡️ Framework Invariants (Next.js 16+)
- **Middleware is Deprecated**: Use `proxy.ts` (root) instead of `middleware.ts`.
- **Proxy Function**: The entry point in `proxy.ts` must be `export async function proxy(request: NextRequest)`.
- **Middleware Convention**: `middleware.ts` is now `proxy.ts` for routing, redirects, and header manipulation.

---

## 📌 Current State
### Последние достижения
- ✅ Реализован Центр поддержки администратора (тикеты, чат, уведомления).
- ✅ Управление категориями (Bulk actions, Drag-n-drop симуляция).
- ✅ **Admin & User Dashboard Refinement** (Unified Sidebar, Stats-cards, Data-grids alignment).
- ✅ **Component-wide Design Alignment** (Buttons, Badges, Inputs, Avatars, Cards) - 1:1 CRM Copy.
- ✅ **Normalize Typography & Radii** (font-black -> font-bold, rounded-xl/sm across all dashboard views).
- ✅ **Verification (Lint, Type-check, Build) - PASSED.**

### Текущий фокус
- **Фаза 5: Mobile Optimization** (Адаптивность, Touch-friendly элементы, PWA).

---

## ✅ Completed (Premium Redesign)

1. ✅ Core components (Button, Badge, Input, Card) - Standardized `rounded-xl`.
2. ✅ Layout components (Header, Sidebar, DashboardShell) - Integrated & Solid.
3. ✅ Auth, Search, Listing pages - Removed glassmorphism.
4. ✅ User Dashboard (Overview, Listings, Wallet, Settings, Favorites, Saved Searches, Subscription) - Normalized.
5. ✅ Admin Dashboard (Full Suite: Overview, Users, Listings, Moderation, Reports, Categories, Support).
6. ✅ Messaging & Favorites - Systemic fixes.
7. ✅ I18n fix: Proxied `useTranslation` + Hydration sync fix.
8. ✅ [Masterplan V2] Phases:
    - [x] Phases 1-4 fully completed (Premium Redesign & Alignment).
    - [x] Phase 4.1: Unified Dashboard UI (Sidebar, Stats).
    - [x] Phase 4.2: Input/Badge/Avatar standardization.
    - [x] Phase 5.1: PWA Integration (Manifest, Icons, Metadata).
    - [x] Phase 5.2: Responsive Dialogs (Modal to Bottom Sheet switching).
    - [x] Phase 5.3: Mobile Optimization & Typography Normalization (Solid, Clean, Data-Dense).
    - [ ] Phase 5.4: Production Build Optimization.
9. ✅ SEO: `StructuredData` component.

---

## 🎨 Design System

```css
/* CRM Palette */
--primary: #6366F1;       /* Indigo-500 */
--primary-hover: #4F46E5; /* Indigo-600 */
--background: 0 0% 100%;  /* Light: bg-white */
--background: 222 47% 3%; /* Dark: slate-950 */
--card: 0 0% 100%;        /* White */
--card: 222 47% 6%;        /* Slate-900 */
--radius: 12px;           /* Base radius */
--shadow-card: 0 4px 20px 0 rgba(0, 0, 0, 0.04);
--shadow-primary: 0 4px 14px 0 rgba(99, 102, 241, 0.3);
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
2. Redesign Phase 4 is complete. All core UI components have been modernized and aligned with the "Solid" design system.
3. The next major focus is Phase 5: Mobile Optimization. Ensure that all new components are tested for responsiveness and touch interactions.
4. Run `npm run verify` religiously.

[Masterplan V2]: plans/MASTERPLAN_V2_PRODUCT_READY.md
