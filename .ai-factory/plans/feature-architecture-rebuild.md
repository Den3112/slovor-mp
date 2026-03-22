# План: Архитектурная Переработка Slovor-mp (Next.js 15)

## Обзор
Полная реструктуризация системы роутинга и i18n для соответствия стандартам Next.js 15 и требованиям премиального маркетплейса. Переход от `[locale]` к `[lang]`, внедрение групп маршрутов и поддержка чешского языка (`cs`).

## Настройки (Settings)
- **Тестирование**: Да (Vitest, Playwright)
- **Логирование**: Verbose (DEBUG логи во всех критических точках)
- **Документация**: Да (Обновление `AGENTS.md` и `ARCHITECTURE.md`)
- **Ветка**: `feature/architecture-rebuild`

## Привязка к Roadmap
- **Милестоун**: "Архитектурный фундамент 2.0"
- **Обоснование**: Необходимо для масштабирования мультиязычности и четкого разделения зон ответственности (Buyer/Seller).

## Группы маршрутов (Route Groups)
- `(marketing)`: Основные страницы для гостей.
- `(auth)`: Вход, регистрация, коллбэки.
- `(listings)`: Поиск и страницы товаров.
- `(dashboard)`: Личный кабинет (база).
- `(seller)`: Функции продавца внутри dashboard.
- `(buyer)`: Функции покупателя внутри dashboard.
- `(admin)`: Панель управления.

---

## Задачи (Tasks)

### Фаза 1: Подготовка
1. **[src/middleware.ts]**: [/] Обновить логику детекции языка. Добавить `cs` в список поддерживаемых языков. Убедиться, что middleware корректно обрабатывает сегмент `[lang]`.
   *Логирование*: DEBUG при детекции каждого языка и редиректе.
2. **[src/packages/i18n/settings.ts]**: Проверить присутствие `cs`. Убедиться, что `fallbackLng` настроен на `sk` или `en`.

### Фаза 2: Реструктуризация Routers
3. **[src/app/[locale] -> src/app/[lang]]**: Переименовать корневой сегмент локализации. Обновить все ссылки в `generateStaticParams`.
4. **[src/app/[lang]/(marketing)]**: Создать группу. Перенести туда: `/`, `/about`, `/contact`, `/faq`, `/blog`, `/privacy`, `/terms`.
   *Логирование*: Логировать монтирование Layout маркетинга.
5. **[src/app/[lang]/(auth)]**: Упорядочить авторизацию. Перенести из `(main)/auth` и `(auth)` в единое место.
6. **[src/app/[lang]/(listings)]**: Создать группу для `/search`, `/categories`, `/item/[id]`.
7. **[src/app/[lang]/(dashboard)]**: Создать базовый кабинет.
   - Внутри создать `(seller)` для `/post` и `/my-ads`.
   - Внутри создать `(buyer)` для `/orders` и `/favorites`.
8. **[src/app/[lang]/(admin)]**: Изолировать админку с отдельным Layout.

### Фаза 3: Обновление Компонентов и Навигации
9. **[src/lib/navigation.ts]**: Создать хелперы для генерации путей с учетом `lang`.
10. **[src/components/layout/Header]**: Обновить переключатель языков и ссылки.
11. **[src/components/layout/Sidebar]**: Обновить меню Dashboard для динамического отображения ролей (Buyer/Seller).

### Фаза 4: Верификация
12. **[Утилиты тестирования]**: Проверить редиректы и доступность новых путей для `en`, `sk`, `cs`.
    - `localhost:3000/sk/search` -> OK
    - `localhost:3000/en/search` -> OK
    - `localhost:3000/cs/search` -> OK

---

## План коммитов (Commit Plan)
- `chore: update middleware and i18n settings for cs support` (Задачи 1-2)
- `feat: rename [locale] to [lang] and reorganize marketing/auth routes` (Задачи 3-5)
- `feat: implement listings and dashboard route groups with seller/buyer split` (Задачи 6-8)
- `refactor: update navigation logic and UI components for new routing` (Задачи 9-11)
- `test: verify architectural changes and multi-language support` (Задача 12)
