# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES REFRESH (DO NOT IGNORE)
1.  **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2.  **Zero-Error**: NEVER finish a task with broken code. run `npm run verify`.
3.  **Design**: "Customer CRM" style. Solid, Clean, Data-Dense. NO Glassmorphism.
4.  **Process**: Read Memory -> Fix -> Verify -> Update Memory.
5.  **Unsure?**: ASK the user. Do not guess.
6.  **URGENT**: If User uses CAPS, pay SPECIAL ATTENTION. It is a critical instruction.
7.  **Thoughts (Рассуждения)**: Всегда пиши Thoughts на РУССКОМ языке.
8.  **Server Check**: ПЕРЕД запуском браузера ПРОВЕРЯЙ, что `npm run dev` работает.

> **Last Updated**: 2026-02-01 20:15
> **Status**: 🟡 Premium Redesign In Progress

## ⚡ Active RAM (Operational Context)
> *Update this section FREQUENTLY during the session.*

- **Current User Intent**: Полная переработка дизайна и архитектуры под референс Customer CRM.
- **Active Branch**: `feature/premium-redesign`
- **PR to main**: #27 (Snapshot before redesign)
- **Active Errors / Blockers**: Нет.
- **Scratchpad / Hypothesis**: Дизайн-система обновлена. globals.css и tailwind.config.ts переписаны с CRM палитрой.

## ✅ Completed in This Session
1. Created PR #27 for snapshot before redesign
2. Created branch `feature/premium-redesign`
3. Rewrote `globals.css` with Customer CRM color palette:
   - Primary: #3B82F6 (vivid blue)
   - Surface: white/dark slate
   - NO glassmorphism, NO mesh gradients
4. Updated `tailwind.config.ts` with professional shadows
5. Refactored `UnifiedSidebar` - clean, compact CRM style
6. Simplified `DashboardShell` - proper mobile drawer
7. Updated `Header` - now hides on dashboard routes
8. Updated `BottomNavBar` - compact, professional
9. Updated `Card` component - crisp borders, shadow-sm
10. `npm run verify` passes ✅

## 🎯 Next Steps
1. [ ] Preview site in browser (when quota resets)
2. [ ] Update remaining pages for CRM style
3. [ ] Ensure dark mode works correctly
4. [ ] Test mobile responsiveness
5. [ ] Create PR to dev

## 📚 Knowledge Base (Lessons Learned)
> *Record solutions to tricky bugs or "Do Not Do This" rules here to prevent recurrence.*
- **i18n Namespace**: При использовании `i18next-resources-to-backend` необходимо явно указывать пространства имен в `getTranslationServer(['common', 'dashboard'])` или `useTranslation(['dashboard'])`, иначе ключи из отдельных JSON файлов не будут загружены.
- **i18n Syntax**: В проекте используется синтаксис `t('namespace:key')`. Использование точки `t('namespace.key')` может привести к ошибке, если `dashboard` не является объектом внутри `common.json`.
- **E2E Auth**: Для стабилизации тестов используйте `ensureAuthenticated` с проверкой URL и паролем `password123`.
- **CRM Design**: Avoid mesh gradients, heavy blur, transparent cards. Use solid backgrounds, crisp 1px borders.

### 🛑 Correction Log (Mistakes to Avoid)
- **i18n Oversight**: Не забывайте проверять, загружены ли нужные JSON-файлы локализации на страницах профиля.
- **Mobile Nav**: Всегда добавляйте `data-testid` ссылкам в мобильной навигации для надежных E2E тестов.
- **Dashboard Header**: Dashboard routes should NOT show the public Header - they use DashboardShell header.

## 🏗️ Technical Context & Decisions
- **Stack**: Next.js 16.1.4, Tailwind CSS v4, Supabase, i18n.
- **Design System**: Customer CRM (data-dense, professional)
- **Testing**: Playwright for E2E.
- **Mobile**: iPhone 375x812 viewport used for audit.

## 🎨 Design System Reference
```css
/* Primary Colors */
--primary: 217 91% 60%;     /* #3B82F6 - Vivid Blue */
--background: 210 20% 98%;  /* Light: soft gray-blue */
--background: 222 47% 6%;   /* Dark: deep slate */
--border: 214 32% 91%;      /* Light crisp border */
```

## 📝 Handover Notes
- **Current State**: Core design system rewritten with CRM style
- **Next Session**: Preview site, adjust specific pages, test animations
- **Verification**: `npm run verify` passes successfully
