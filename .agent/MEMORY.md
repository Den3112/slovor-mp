# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES (DO NOT IGNORE)
1. **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2. **Zero-Error**: NEVER finish with broken code. Run `npm run verify`.
3. **Design**: "Customer CRM" style. Solid, Clean, Data-Dense. NO Glassmorphism.
4. **Process**: Read Memory → Work → Verify → Update Memory.
5. **Unsure?**: ASK the user. Do not guess.
6. **URGENT**: If user uses CAPS, pay SPECIAL ATTENTION.

> **Last Updated**: 2026-02-07
> **Status**: ✅ DEEP UI AUDIT & BUG HUNTING COMPLETED. Phase 8.3 concluded. Standardized border-radius (12px/20px) enforced. Search suggestions overlap bug fixed. PR #35 updated.

## ⚡ Active RAM
- **Status**: Redesign project concluded. All phases (1-8) are implemented, localized, and verified.
- **Next Step**: Proceed to **Phase 9: Theme Switching** (Custom Color Schemes).

---

## ⚡️ Framework Invariants (Next.js 16+)
- **Next.js 16+ Build Optimization**: Use `next/dynamic` for heavy dashboard view components to keep initial bundles small.
- **Middleware is Deprecated**: Use `proxy.ts` (root) instead of `middleware.ts`.
- **Proxy Function**: The entry point in `proxy.ts` must be `export async function proxy(request: NextRequest)`.
- **Middleware Convention**: `middleware.ts` is now `proxy.ts` for routing, redirects, and header manipulation.

---

## 📌 Current State
### Current Status
- **Phase 10 (Deep UI Audit)**: ✅ COMPLETED. Fixed all rounding inconsistencies and layout bugs in Search/Dashboard.
- **Phase 7 (Monetization)**: ✅ COMPLETED. Promotion plans with RUB prices, Transaction table, and full localization.
- [x] Phase 21: Deep UX Polish & Zero-Error Stability (Verified)
- [x] Phase 22: Ultrathink Deep UI/UX Audit & Advanced Polish (Verified)

### Global Normalization Status
- **Border Radius**: Normalized to 12px (elements) and 20px (containers) via `globals.css` tokens.
- **Iconography**: 100% SVG-based (Lucide). Emojis removed from UI.
- **Contrast**: WCAG AAA compliant for core metadata and admin views.
- **Zero Error**: `npm run verify` mandatory pass.
- Исправлены все ошибки гидратации (PriceDisplay, Ratings, StructuredData).
- Улучшена доступность: повышен контраст вторичного текста и ID.

### Глобальная нормализация (Февраль 2026)
- Все интерфейсные баги из отчета SquirrelScan и ручного аудита устранены.
- Достигнута "Золотая" стабильность (Zero Errors в консоли, 100% Mobile UX).

---

## ✅ Completed (Premium Redesign)

1. ✅ Core components (Button, Badge, Input, Card) - Standardized `rounded-lg` (12px) and `rounded-2xl` (20px).
2. ✅ Layout components (Header, Sidebar, DashboardShell) - Integrated & Solid.
3. ✅ Auth, Search, Listing pages - Removed glassmorphism.
4. ✅ User Dashboard (Overview, Listings, Wallet, Settings, Favorites, Saved Searches, Subscription) - Normalized.
5. ✅ Admin Dashboard (Full Suite: Overview, Users, Listings, Moderation, Reports, Categories, Support).
6. ✅ Messaging & Favorites - Systemic fixes.
7. ✅ I18n fix: Proxied `useTranslation` + Hydration sync fix.
8. ✅ [Masterplan V2] Phases (1-8) fully completed.
9. ✅ SEO: `StructuredData` component + verified About/Contact/Privacy pages.

---

## 🎨 Design System

```css
/* CRM Palette */
--primary: #6366F1;       /* Indigo-500 */
--primary-hover: #4F46E5; /* Indigo-600 */
--background: 210 40% 98%; /* Light: bg-slate-50 */
--background: 222 47% 11%; /* Dark: slate-950/slate-900 hybrid */
--card: 0 0% 100%;        /* White */
--card: 222 33% 17%;        /* Slate-800 (Pro Dark) */
--radius-lg: 12px;        /* MANDATORY for buttons/inputs */
--radius-2xl: 20px;       /* MANDATORY for cards/containers */
--shadow-card: 0 4px 20px 0 rgba(0, 0, 0, 0.04);
--shadow-primary: 0 4px 14px 0 rgba(99, 102, 241, 0.3);
```

**Fonts**: DM Sans, Space Grotesk, JetBrains Mono

---

## 🚫 Forbidden Styles (STRICT)

- NO `backdrop-blur-*` (STRICTLY removed from Header, Performance Cards, etc.).
- NO `bg-gradient-*` (Except where strictly functional).
- NO `shadow-2xl`.
- NO `rounded-xl` or higher for buttons/inputs. Standard is `rounded-lg` (12px).
- NO `rounded-3xl` or higher for cards. Standard is `rounded-2xl` (20px).
- NO emojis as icons.

---

## 📝 For Next AI Agent

1. **READ** this file first.
2. The UI is now strictly normalized to the 12px/20px rounding rule. Do not use `rounded-xl` (16px).
3. Always check Search CommandCenter suggestions if you modify categories — ensured no text local overlaps.
4. Run `npm run verify` religiously.

[Masterplan V2]: plans/MASTERPLAN_V2_PRODUCT_READY.md
