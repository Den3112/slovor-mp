# План реализации: Masterplan V2 - Фаза 1 (Homepage & Navigation)

## 🎯 Цель
Полное обновление главной страницы и системы навигации согласно спецификации `MASTERPLAN_V2_PRODUCT_READY.md`. Переход от базового дизайна к полноценному продуктовому интерфейсу маркетплейса.

## 🏗️ Архитектура и Компоненты

### 1. Навигация (Header & Menu)
- **Mega Menu** (`/components/layout/mega-menu.tsx`):
    - Сетка категорий (Транспорт, Недвижимость, Электроника и т.д.)
    - Подкатегории в каждой колонке.
    - Анимации появления через `framer-motion`.
- **Mobile Drawer** (`/components/layout/mobile-drawer.tsx`):
    - Полноэкранное меню для мобильных устройств.
    - Группировка: Главное, Категории, Аккаунт.
- **Header Update**:
    - Интеграция триггера Mega Menu.
    - Очистка поиска и мобильного вида.

### 2. Главная страница (Homepage)
- **Hero Section**: Обновленный поиск и теги популярных запросов.
- **Categories Grid** (`/components/home/categories-grid.tsx`):
    - 10 ключевых категорий с иконками и счетчиками.
    - Hover-эффекты "Pro Max".
- **Regions Section**: Секция "Популярное по регионам" (Братислава, Кошице и т.д.).
- **How It Works**: Пошаговая инструкция (3 шага).
- **CTA Section**: Улучшенная секция призыва к действию.

## 📝 Список задач

### Шаг 1: Подготовка и i18n
- [ ] Добавить новые ключи перевода в `home.json`, `categories.json` и `common.json`.
- [ ] Подготовить интерфейсы для категорий с весом/порядком.

### Task 1: Navigation & Header Overhaul ✅
- [x] Create `components/layout/mega-menu.tsx` (Desktop).
- [x] Integrate Mega Menu into `Header`.
- [x] Update `MobileDrawer` for logic-based grouping.
- [x] Add necessary transitions and hover effects.

### Task 2: Homepage Sections (Phase A) ✅
- [x] Create `components/home/categories-grid.tsx` (Data-dense).
- [x] Create `components/home/regions-section.tsx`.
- [x] Create `components/home/how-it-works.tsx`.
- [x] Update `HomeView` with the new layout structure.

### Task 3: Homepage Polish (Phase B) ✅
- [x] Refine `Hero` section search and tags.
- [x] Update `HomeCTA` component.
- [x] Add SEO Metadata to `HomePage`.
- [x] Connect actual listing counts to `CategoriesGrid`.

### Task 4: Verification ✅
- [x] Visual audit of mobile vs desktop layouts.
- [x] Run `npm run lint` and `npm run type-check`.

## ⚡ SCRATCHPAD / Hypothesis
- **Категории со счетчиками**: Для первой итерации можно использовать статические данные или расширить запрос в `HomePage`, но лучше всего сделать это через SQL View или RPC в будущем. Пока добавим поле в интерфейс.
- **Mega Menu**: Должно быть доступно по клику или hover. В плане указан hover, но для a11y добавим поддержку клика.

## 📊 Прогресс
- [ ] Фаза 1: 0%
