# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES (DO NOT IGNORE)
1. **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2. **Zero-Error**: NEVER finish with broken code. Run `npm run verify`.
3. **Design**: "Customer CRM" style. Solid, Clean, Data-Dense. NO Glassmorphism.
4. **Skills**: **MANDATORY** use of skills in `/home/creator/.agents/skills`.
5. **Process**: Read Memory → Work → Verify → Update Memory.
6. **Unsure?**: ASK the user. Do not guess.
7. **URGENT**: If user uses CAPS, pay SPECIAL ATTENTION.

> **Last Updated**: 2026-02-09
> **Status**: ✅ GIT CLEANUP COMPLETED. All changes committed to dev. 168 files updated, 23 local branches cleaned.

## ⚡ Active RAM
- **Status**: Phase 9 (SEO & UI Polish) COMPLETED.
- **Next Step**: Final project review and merge to main. Apply security migration if not done.


---

## ⚡️ Framework Invariants (Next.js 16+)
- **Next.js 16+ Build Optimization**: Use `next/dynamic` for heavy dashboard view components to keep initial bundles small.
- **Middleware is Deprecated**: Use `proxy.ts` (root) instead of `middleware.ts`.
- **Proxy Function**: The entry point in `proxy.ts` must be `export async function proxy(request: NextRequest)`.
- **Middleware Convention**: `middleware.ts` is now `proxy.ts` for routing, redirects, and header manipulation.

---

## 📌 Текущее состояние (Обновлено 10 февраля 2026)

### Статус аудита и исправлений
- **Admin & Dashboard Bug Fixes**: ✅ **ВЫПОЛНЕНО**.
- Исправлены критические баги в API (Reviews, Wallet 406), i18n (интерполяция {{COUNT}}, {plan}), и UI (Invalid Date).
- Улучшена адаптивность `DashboardShell` (брейкпоинт `lg` для сайдбара).
- Добавлены заглушки "Coming Soon" для Support и Settings в админке.
- **Пути к артефактам**: `/home/creator/.gemini/antigravity/brain/475fab39-4c75-4a46-9ab8-94c0c6ad0bf2/walkthrough.md`

### Текущий статус по фазам
- **Phase 10 (Deep UI Audit)**: ✅ Исправлено. Радиусы и SEO нормализованы.
- **Security Hardening**: ✅ Подготовлена миграция `20260210000000_security_hardening.sql`.

### Глобальная нормализация
- **Border Radius**: ✅ **ВОССТАНОВЛЕНО**. 20px (карточки) и 12px (элементы).
- **SEO**: ✅ `title` и мета-теги восстановлены.
- **i18n**: ✅ Полное покрытие ключами в админке и дашборде.
- **Архитектура**: ✅ Внедрена `maybeSingle` в Wallet API для стабильности при отсутствии записей.

---

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
