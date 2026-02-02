# 🧠 Project Memory: Slovor MP

## 🚨 CRITICAL RULES REFRESH (DO NOT IGNORE)
1.  **Language**: Chat = **Russian** 🇷🇺. Code/Comments = **English** 🇬🇧.
2.  **Zero-Error**: NEVER finish a task with broken code. run `npm run verify`.
3.  **Design**: "Customer CRM" (Pro Max). Solid, Clean, Data-Dense. NO Glassmorphism.
4.  **Process**: Read Memory -> Fix -> Verify -> Update Memory.
5.  **Unsure?**: ASK the user. Do not guess.
6.  **URGENT**: If User uses CAPS, pay SPECIAL ATTENTION. It is a critical instruction.
7.  **Thoughts (Рассуждения)**: Всегда пиши Thoughts на РУССКОМ языке.
8.  **Server Check**: ПЕРЕД запуском браузера ПРОВЕРЯЙ, что `npm run dev` работает.

> **Last Updated**: 2026-02-02
> **Status**: 🟢 UI Components refined to "Solid" style.

## ⚡ Active RAM (Operational Context)
> *Update this section FREQUENTLY during the session.*

- **Current User Intent**: Очистка UI от glassmorphism, градиентов и блюров. Унификация border-radius (rounded-xl).
- **Active Errors / Blockers**: Проверка сборки (npm run verify).
- **Scratchpad / Hypothesis**: Все компоненты `ui/*` и основные вью листингов приведены к единому стандарту "Solid, Clean, Data-Dense".

## 📚 Knowledge Base (Lessons Learned)
> *Record solutions to tricky bugs or "Do Not Do This" rules here to prevent recurrence.*
- **i18n Namespace**: При использовании `i18next-resources-to-backend` необходимо явно указывать пространства имен в `getTranslationServer(['common', 'dashboard'])` или `useTranslation(['dashboard'])`, иначе ключи из отдельных JSON файлов не будут загружены.
- **i18n Syntax**: В проекте используется синтаксис `t('namespace:key')`. Использование точки `t('namespace.key')` может привести к ошибке, если `dashboard` не является объектом внутри `common.json`.
- **E2E Auth**: Для стабилизации тестов используйте `ensureAuthenticated` с проверкой URL и паролем `password123`.

### 🛑 Correction Log (Mistakes to Avoid)
- **i18n Oversight**: Не забывайте проверять, загружены ли нужные JSON-файлы локализации на страницах профиля.
- **Mobile Nav**: Всегда добавляйте `data-testid` ссылкам в мобильной навигации для надежных E2E тестов.

## 🏗️ Technical Context & Decisions
- **Stack**: Next.js, Tailwind CSS, Supabase, i18n.
- **Testing**: Playwright for E2E.
- **Mobile**: iPhone 375x812 viewport used for audit.

## 📝 Handover Notes
- **Done**: Все тесты в `e2e/profile-functionality.spec.ts` проходят (включая обновление био и мобильную навигацию).
- **Audit**: Визуальный аудит мобильной версии подтвердил высокое качество интерфейса и отсутствие перекрытий.
- **Verification**: `npm run verify` проходит успешно.
