# План миграции на Next.js 15 + App Router — Slovor MP

Цель: корректно перевести проект на официально поддерживаемый App Router (Next.js 15) с сохранением поведения, улучшениями по производительности и best practices.

1) Подготовка
  - Забэкапить текущую ветку `dev` и создать ветку `feature/migrate-next15`.
  - Обновить `engines.node` и разработческую среду до Node >=22 (указано в `package.json`).
  - Проверить и регенерировать секреты (не хранить `SUPABASE_SERVICE_ROLE_KEY` в репо).

2) Обновление зависимостей
  - Обновить `next` до `^15.x` в `package.json` и выполнить `npm install`.
  - Обновить сопутствующие пакеты (`@types/react`, `eslint-config-next` и др.) по необходимости.

3) Рефакторинг маршрутов
  - Перенести все страницы/роуты в `app/` (App Router) с использованием server/client components.
  - Проверить `middleware` и адаптировать к новым хук- и edge-правилам.

4) Data fetching и Supabase
  - Вынести серверные вызовы Supabase в `lib/supabase` и серверные handlers (`/app/**/route.ts`), использовать `@supabase/ssr` для server-side rendering.
  - Пересмотреть использование service role: использовать только на server-side и через API routes.

5) State и UI
  - Обновить компоненты, которые полагаются на устаревший механизмы (например, `getServerSideProps`), заменить на `async` server components и client boundaries.

6) Тесты и CI
  - Обновить Playwright конфигурацию для App Router баз URL и маршрутов.
  - Обновить Vitest setup (happy-dom) по необходимости.

7) Валидация
  - Запустить `npm run verify`, `npm run test:run`, `npm run test:e2e` и исправить ошибки.
  - Тестировать storybook и визуальные тесты.

8) Плавный релиз
  - Деплой на staging с feature флагами, переключение трафика постепенно.

9) Документация
  - Обновить `README.md` и `docs/` с инструкциями для разработчиков и CI.

10) Контрольные чекпойнты
  - Lint/Type-check (Zero-Error Policy), интеграционные тесты, e2e, ручной smoke-test.

Примечание: для проекта уже используется App Router (`app/` присутствует) — задача больше про приведение зависимостей, правил и проверку server/client boundaries.
