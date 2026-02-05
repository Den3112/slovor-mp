# 🚀 MASTERPLAN V2: ГОТОВЫЙ ПРОДУКТ ПОД КЛЮЧ

> **CRITICAL**: Это ЕДИНСТВЕННЫЙ источник правды для завершения проекта Slovor MP.
> **ДАТА**: 2026-02-05
> **ЦЕЛЬ**: 100% готовый к продакшену маркетплейс с дизайном 1:1 как на исходнике.

---

## 🎯 ИСХОДНЫЙ ДИЗАЙН (ОБЯЗАТЕЛЬНЫЙ РЕФЕРЕНС)

**URL**: https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/customer-support-crm

### ⚠️ CRITICAL REQUIREMENTS:

1. **ВСЕ СТИЛИ ДОЛЖНЫ БЫТЬ 1:1 КАК НА ИСХОДНИКЕ**
2. **Используй файлы в `.agent/design-system/`**:
   - `DESIGN_TOKENS.md` - точные цвета, шрифты, тени
   - `COMPONENT_STYLES.md` - готовый код компонентов

---

## 🎨 ДИЗАЙН-СИСТЕМА (EXACT VALUES FROM SOURCE)

### Цветовая палитра - Light Theme

| Роль | Цвет | Hex |
|------|------|-----|
| **Primary** | Indigo-500 | `#6366F1` |
| **Primary Hover** | Indigo-600 | `#4F46E5` |
| **Background** | Slate-50 | `#F8FAFC` |
| **Card** | White | `#FFFFFF` |
| **Text** | Slate-800 | `#1E293B` |
| **Text Muted** | Slate-500 | `#64748B` |
| **Text Subtle** | Slate-400 | `#94A3B8` |
| **Border** | Slate-200 | `#E2E8F0` |
| **Success** | Emerald-500 | `#10B981` |
| **Warning** | Amber-500 | `#F59E0B` |
| **Error** | Red-500 | `#EF4444` |
| **Info** | Cyan-500 | `#06B6D4` |

### Цветовая палитра - Dark Theme

| Роль | Цвет | Hex |
|------|------|-----|
| **Background** | Slate-900 | `#0F172A` |
| **Card** | Slate-800 | `#1E293B` |
| **Border** | Slate-700 | `#334155` |
| **Text** | Slate-50 | `#F8FAFC` |
| **Text Muted** | Slate-400 | `#94A3B8` |

### Типографика

| Элемент | Font | Size | Weight |
|---------|------|------|--------|
| **Heading** | Plus Jakarta Sans | 24-60px | 600-700 |
| **Body** | Plus Jakarta Sans / DM Sans | 15-16px | 400-500 |
| **Button** | Plus Jakarta Sans | 15px | 600 |
| **Badge** | Plus Jakarta Sans | 12px | 500 |
| **Mono** | JetBrains Mono | - | - |

### Border Radius

| Элемент | Radius |
|---------|--------|
| **Кнопки** | 12px (`rounded-xl`) |
| **Карточки** | 20px (`rounded-[20px]`) |
| **Hero Cards** | 24px (`rounded-[24px]`) |
| **Inputs** | 12px (`rounded-xl`) |
| **Badges** | 4px (`rounded`) |
| **Pills** | 9999px (`rounded-full`) |
| **Аватары** | 16px (`rounded-[16px]`) |

### Тени

```css
/* Card Shadow */
shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]

/* Primary Button Shadow */
shadow-[0_4px_14px_0_rgba(99,102,241,0.3)]

/* Dropdown Shadow */
shadow-[0_8px_40px_0_rgba(99,102,241,0.15)]
```

### Layout Dimensions

| Элемент | Размер |
|---------|--------|
| **Header Height** | 80px |
| **Sidebar Width** | 280px |
| **Container Max** | 1280px |
| **Card Padding** | 24px |
| **Button Padding** | 12px 24px |

---

## 📄 ЧАСТЬ 1: HOMEPAGE

### 1.1 Структура главной страницы

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER (h-[80px], sticky, backdrop-blur)                                     │
│ ┌──────┐  ┌─────────┐  ┌─────────────────────────────┐  ┌─────────────────┐│
│ │ Logo │  │Категории▾│ │ 🔍 Поиск...                 │  │[❤️][💬][+][ 👤 ]││
│ └──────┘  └─────────┘  └─────────────────────────────┘  └─────────────────┘│
├─────────────────────────────────────────────────────────────────────────────┤
│ HERO SECTION (py-24)                                                         │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │              Найди всё, что нужно — рядом с тобой                       │ │
│ │                                                                         │ │
│ │   ┌───────────────────────────────────────┐  ┌────────────────┐        │ │
│ │   │ 🔍 Что ищете?                         │  │    Найти       │        │ │
│ │   └───────────────────────────────────────┘  └────────────────┘        │ │
│ │                                                                         │ │
│ │   Популярное: iPhone • BMW • Квартира • PS5                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ КАТЕГОРИИ (grid 5x2 desktop, 2x5 mobile)                                     │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │    🚗      │ │    🏠      │ │    📱      │ │    👔      │ │    🛠️      │ │
│ │ Транспорт  │ │ Недвиж.    │ │ Электрон.  │ │   Мода     │ │  Услуги    │ │
│ │  (12,345)  │ │  (5,678)   │ │  (8,901)   │ │  (4,567)   │ │  (2,345)   │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ FEATURED / VIP (grid 4 cols)                                    [Все VIP →]  │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│ │ ⭐ VIP         │ │ ⭐ VIP         │ │ ⭐ VIP         │ │ ⭐ VIP         │    │
│ │ [Image]        │ │ [Image]        │ │ [Image]        │ │ [Image]        │    │
│ │ iPhone 15 Pro  │ │ BMW X5 2024    │ │ 3-комн. кв.    │ │ MacBook Pro    │    │
│ │ €899           │ │ €45,000        │ │ €750/мес       │ │ €1,299         │    │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ПОСЛЕДНИЕ ОБЪЯВЛЕНИЯ (grid 4 cols)                         [Все →]           │
├─────────────────────────────────────────────────────────────────────────────┤
│ КАК ЭТО РАБОТАЕТ (3 cards)                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ CTA SECTION                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Компоненты Homepage

| Компонент | Файл | Статус |
|-----------|------|--------|
| Mega Menu | `/components/layout/mega-menu.tsx` | 🆕 NEW |
| Categories Grid | `/components/home/categories-grid.tsx` | 🆕 NEW |
| Featured Listings | `/components/home/featured-listings.tsx` | ♻️ UPDATE |
| Recent Listings | `/components/home/recent-listings.tsx` | 🆕 NEW |
| How It Works | `/components/home/how-it-works.tsx` | 🆕 NEW |
| CTA Section | `/components/home/cta-section.tsx` | ♻️ UPDATE |

---

## 📱 ЧАСТЬ 2: МЕНЮ И НАВИГАЦИЯ

### 2.1 Header - Спецификация

```tsx
<header className="
  fixed top-0 left-0 right-0 z-50
  h-[80px]
  bg-white/90 dark:bg-[#0F172A]/90
  backdrop-blur-sm
  border-b border-[#E2E8F0] dark:border-[#334155]
  shadow-[0_1px_3px_rgba(0,0,0,0.05)]
">
```

### 2.2 Mega Menu (Dropdown)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🚗 ТРАНСПОРТ        │ 🏠 НЕДВИЖИМОСТЬ     │ 📱 ЭЛЕКТРОНИКА    │ 👔 МОДА     │
│ ├─ Легковые авто    │ ├─ Квартиры         │ ├─ Телефоны       │ ├─ Мужская  │
│ ├─ Мотоциклы        │ ├─ Дома             │ ├─ Ноутбуки       │ ├─ Женская  │
│ ├─ Грузовые         │ ├─ Аренда           │ ├─ ТВ/Аудио       │ ├─ Детская  │
│ └─ Запчасти         │ └─ Коммерческая     │ └─ Игры           │ └─ Обувь    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Mobile Drawer

```tsx
<Sheet>
  <SheetContent side="left" className="
    w-[320px]
    bg-white dark:bg-[#1E293B]
    border-r border-[#E2E8F0] dark:border-[#334155]
    p-0
  ">
    {/* Logo + Close */}
    {/* Navigation Links */}
    {/* Categories Accordion */}
    {/* User Section */}
    {/* Theme Toggle */}
  </SheetContent>
</Sheet>
```

### 2.4 Bottom Tab Bar (Mobile)

```tsx
<nav className="
  fixed bottom-0 left-0 right-0
  h-[72px]
  bg-white dark:bg-[#1E293B]
  border-t border-[#E2E8F0] dark:border-[#334155]
  lg:hidden
  z-40
">
  {/* 5 tabs: Home, Search, Post (elevated), Favorites, Profile */}
</nav>
```

---

## 📊 ЧАСТЬ 3: DASHBOARD (Личный Кабинет)

### 3.1 Структура URL

```
/dashboard              - Overview
/dashboard/listings     - Мои объявления
/dashboard/orders       - Заказы
/dashboard/wallet       - Кошелёк
/dashboard/reviews      - Отзывы
/dashboard/settings     - Настройки
/dashboard/verification - Верификация
```

### 3.2 Sidebar Navigation

```tsx
<aside className="
  w-[280px] h-screen
  bg-[#1E293B]
  border-r border-[#334155]
  flex flex-col
">
  {/* Logo (h-[80px]) */}
  {/* Nav Items */}
  {/* User Profile Section */}
</aside>
```

### 3.3 Dashboard Overview Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GREETING + NOTIFICATION BAR                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ STATS (4 cards grid)                                                         │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│ │   📦 12        │ │   👁️ 1,234     │ │   ❤️ 45        │ │   💬 8         ││
│ │ Объявлений     │ │ Просмотров     │ │ В избранном    │ │ Сообщений     ││
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘│
├─────────────────────────────────────────────────────────────────────────────┤
│ CHART (70%)                           │ QUICK ACTIONS + ACTIVITY (30%)       │
├─────────────────────────────────────────────────────────────────────────────┤
│ RECENT LISTINGS TABLE                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 ЧАСТЬ 4: ADMIN PANEL

### 4.1 Структура URL

```
/admin                  - Overview
/admin/users            - Пользователи
/admin/listings         - Объявления
/admin/moderation       - Модерация
/admin/reports          - Жалобы
/admin/analytics        - Аналитика
/admin/settings         - Настройки
```

### 4.2 Moderation Queue

| Колонка | Описание |
|---------|----------|
| Preview | Миниатюра + Заголовок |
| Seller | Аватар + Имя + Rating |
| Price | Цена + Подозрительность |
| Status | Badge (New/Suspicious/Repeated) |
| Actions | Approve / Reject / Request Edit / Ban |

---

## 🗃️ ЧАСТЬ 5: БАЗА ДАННЫХ (Supabase)

### 5.1 Новые таблицы

| Таблица | Назначение |
|---------|------------|
| `wallets` | Кошельки пользователей |
| `transactions` | История транзакций |
| `promotions` | Продвижение объявлений |
| `reviews` | Отзывы о продавцах |
| `reports` | Жалобы на объявления/пользователей |
| `verifications` | Верификация пользователей |
| `subscriptions` | Подписки PRO |
| `saved_searches` | Сохранённые поиски |
| `orders` | Сделки через платформу |
| `notifications` | Уведомления |
| `activity_log` | Лог активности |

### 5.2 SQL Миграция

```sql
-- Полный SQL находится в MASTERPLAN_V2_PRODUCT_READY.md
-- Часть 5: БАЗА ДАННЫХ (Supabase)
```

---

## 📱 ЧАСТЬ 6: MOBILE OPTIMIZATION

### 6.1 Breakpoints

```css
/* Mobile First */
375px  → xs (minimum)
640px  → sm
768px  → md
1024px → lg
1280px → xl
```

### 6.2 Component Differences

| Компонент | Desktop | Mobile |
|-----------|---------|--------|
| Navigation | Mega Menu | Drawer + Bottom Tab |
| Categories | 5x2 grid | 2-col scroll |
| Listings | 4 cols | 2 cols |
| Filters | Sidebar | Bottom Sheet |
| Messages | Split View | List → Chat |

### 6.3 PWA

- `manifest.json` ✓
- Service Worker ✓
- App Icons ✓
- Splash Screen ✓

---

## ⏱️ ЧАСТЬ 7: ПЛАН РЕАЛИЗАЦИИ

### 7.1 Фазы

| Фаза | Задачи | Время |
|------|--------|-------|
| **1. Design System** | globals.css, tailwind.config, шрифты | 2ч |
| **2. Header & Menu** | Mega Menu, Mobile Drawer, Bottom Tab | 3ч |
| **3. Homepage** | Hero, Categories, Featured, Recent, CTA | 4ч |
| **4. Dashboard** | Overview, Listings, Wallet, Reviews, Settings | 6ч |
| **5. Admin** | Overview, Moderation, Users, Analytics | 6ч |
| **6. Database** | Миграции, RLS, Seed Data | 3ч |
| **7. Mobile** | Responsive audit, Touch UX, PWA | 3ч |
| **8. Polish** | Animations, Loading, Empty States, E2E | 3ч |

### 7.2 Порядок выполнения

```
1️⃣ Design System (globals.css + tailwind.config)
   ↓
2️⃣ Header + Navigation (все виды)
   ↓
3️⃣ Homepage Complete
   ↓
4️⃣ Dashboard + Admin
   ↓
5️⃣ Database Migration
   ↓
6️⃣ Mobile Polish
   ↓
7️⃣ Final Verification
```

---

## ✅ КРИТЕРИИ ГОТОВНОСТИ (Definition of Done)

### Визуальные требования:
- [ ] Все компоненты используют цвета из `DESIGN_TOKENS.md`
- [ ] Border radius: 12px (buttons), 20px (cards), 24px (hero)
- [ ] Shadows соответствуют спецификации
- [ ] Шрифты: Plus Jakarta Sans / DM Sans / JetBrains Mono
- [ ] Dark mode работает корректно
- [ ] Mobile responsive (375px minimum)

### Функциональные требования:
- [ ] Homepage полностью работает
- [ ] Dashboard CRUD операции
- [ ] Admin модерация
- [ ] Все формы валидируются
- [ ] i18n переводы

### Технические требования:
- [ ] `npm run verify` passes
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build succeeds
- [ ] E2E tests pass

---

## 📎 ССЫЛКИ НА ДОКУМЕНТАЦИЮ

| Документ | Путь |
|----------|------|
| Design Tokens | `.agent/design-system/DESIGN_TOKENS.md` |
| Component Styles | `.agent/design-system/COMPONENT_STYLES.md` |
| UX Guide | `.agent/plans/UX_FUNCTIONALITY_GUIDE.md` |
| Advanced Features | `.agent/plans/ADVANCED_FEATURES_GUIDE.md` |
| Architecture | `.agent/plans/ARCHITECTURE_BLUEPRINT.md` |

---

**END OF MASTERPLAN**

> **ДЛЯ AI**: Следуй этому плану последовательно. Используй точные значения из DESIGN_TOKENS.md и COMPONENT_STYLES.md. После каждой фазы - `npm run verify`.
