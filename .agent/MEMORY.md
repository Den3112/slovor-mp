# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES (DO NOT IGNORE)
1. **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2. **Zero-Error**: NEVER finish with broken code. Run `npm run verify`.
3. **Design**: "Customer CRM" style. Solid, Clean, Data-Dense. NO Glassmorphism.
4. **Process**: Read Memory → Work → Verify → Update Memory.
5. **Unsure?**: ASK the user. Do not guess.
6. **URGENT**: If user uses CAPS, pay SPECIAL ATTENTION.

> **Last Updated**: 2026-02-04
> **Status**: 🚀 Реализована Фаза 2 Masterplan V2 (Дашборд, Кошелек, Верификация). Внедрена система логирования HISTORY.md.

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
- ✅ **Admin Analytics Dashboard** (Метрики роста, трафик, региональные данные).
- ✅ **Platform Settings Integration** (Миграция настроек на Supabase API).
- ✅ Полное соответствие "Solid CRM" эстетике (Phase 4 завершена).

### Текущий фокус
- **Фаза 5: Mobile Optimization** (Адаптивность, Touch-friendly элементы, PWA).

---

## ✅ Completed (Premium Redesign)

1. ✅ Core components (Button, Badge, Input, Card) - Standardized `rounded-xl`.
2. ✅ Layout components (Header, Sidebar, DashboardShell) - Integrated & Solid.
3. ✅ Auth, Search, Listing pages - Removed glassmorphism.
4. ✅ User Dashboard (Overview, Listings, Wallet, Orders, Reviews) - Clean & Data-Dense.
5. ✅ Admin Dashboard (Full Suite: Overview, Users, Listings, Moderation, Reports, Categories, Support).
6. ✅ Messaging & Favorites - Systemic fixes.
7. ✅ I18n fix: Proxied `useTranslation` + Hydration sync fix.
8. ✅ [Masterplan V2] Phases:
    - [x] Phases 1-4 fully completed.
    - [x] Фаза 5.1: PWA Integration (Manifest, Icons, Metadata).
    - [x] Фаза 5.2: Responsive Dialogs (Modal to Bottom Sheet switching).
    - [ ] Фаза 5.3: Mobile Navigation & Pull-to-refresh.
9. ✅ SEO: `StructuredData` component.

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
5. **Sync State**: All feature branches have been merged into `dev`. PR #30 and #27 were closed.

[Masterplan V2]: plans/MASTERPLAN_V2_PRODUCT_READY.md
