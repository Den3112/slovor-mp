# План модернизации: Очистка и Фаза 1 (Реструктуризация URL)

Этот план объединяет завершение исправлений после очистки проекта и выполнение первого этапа модернизации архитектуры.

## Предложенные изменения

### 🧹 Завершение очистки (Исправление импортов)

Документ `.agent/CLEANUP_FIX_GUIDE.md` указывает на необходимость исправления импортов после перемещения файлов.

#### [MODIFY] [hooks/index.ts](file:///home/creator/slovor-mp/lib/hooks/index.ts)
- Экспортировать все хуки из папки `lib/hooks` для единой точки входа.

#### [MODIFY] Импорты хуков
- Заменить `@/hooks/` на `@/lib/hooks/` во всем проекте.
- Основные файлы: `components/layout/command-center.tsx`, `components/layout/mobile-search-overlay.tsx`.

#### [MODIFY] Импорты Seller Profile
- Заменить `@/components/profile/` на `@/components/seller-profile/`.
- Основные файлы: `app/[locale]/(main)/seller/[id]/page.tsx`, `components/seller-profile/seller-profile-view.tsx` и др.

---

### ⚡ Фаза 1: Реструктуризация URL

Согласно `.agent/task.md` и `.agent/README.md`, мы переносим личный кабинет на `/dashboard` и выносим сообщения и избранное на верхний уровень.

#### [MOVE] Маршруты (Routes)
- `app/[locale]/(main)/profile/messages` → `app/[locale]/(main)/messages`
- `app/[locale]/(main)/profile/favorites` → `app/[locale]/(main)/favorites`
- `app/[locale]/(main)/profile` → `app/[locale]/(main)/dashboard` (оставшиеся страницы: обзор, объявления, кошелек, заказы, отзывы, настройки)

#### [MODIFY] [next.config.ts](file:///home/creator/slovor-mp/next.config.ts)
- Добавить `async redirects()` для сохранения SEO и удобства пользователей:
    - `/profile/:path*` → `/dashboard/:path*`
    - `/dashboard/messages` → `/messages`
    - `/dashboard/favorites` → `/favorites`
- Поддержка локализованных путей (`/:lang/profile/:path*`).

#### [MODIFY] Обновление ссылок в коде
- Поиск и замена всех ссылок `/profile` на `/dashboard` (или соответствующие новые пути).
- Особое внимание компонентам `Sidebar`, `Header` и `UserMenu`.

---

## План верификации

### Автоматизированные тесты
- **Lint & Type-check**: Запуск `npm run verify` для проверки отсутствия битых импортов и ошибок типов.
- **E2E тесты**: Запуск Playwright тестов, связанных с профилем:
    - `npx playwright test e2e/profile-navigation.spec.ts`
    - `npx playwright test e2e/profile-functionality.spec.ts`
- **Циклические зависимости**: Проверка через `npm run check:circular`.

### Ручная проверка
1. Открыть `/profile` и убедиться, что происходит редирект на `/dashboard`.
2. Проверить навигацию в мобильной и десктопной версиях.
3. Убедиться, что страницы Сообщений и Избранного доступны по новым адресам.
