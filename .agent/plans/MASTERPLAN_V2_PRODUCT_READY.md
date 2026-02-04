# 🚀 MASTERPLAN V2: ГОТОВЫЙ ПРОДУКТ ПОД КЛЮЧ

> **CRITICAL**: Это ЕДИНСТВЕННЫЙ источник правды для завершения проекта Slovor MP.
> **Дата создания**: 2026-02-03
> **Цель**: 100% готовый к продакшену маркетплейс без каких-либо компромиссов.

---

## 📊 АНАЛИЗ ТЕКУЩЕГО СОСТОЯНИЯ

### ✅ Что сделано:
1. **Базовый UI редизайн** - "Solid, Clean, Data-Dense" стиль применён
2. **Компоненты UI** - Button, Card, Badge, Input стандартизированы
3. **Layouts** - Header, Sidebar, DashboardShell работают
4. **Dark Mode** - функционирует
5. **Базовые страницы** - Auth, Search, Listings, Dashboard overview

### ❌ Критические пробелы (ЧТО НЕ СДЕЛАНО):

| Проблема | Влияние | Приоритет |
|----------|---------|-----------|
| **Главная страница без меню категорий** | UX катастрофа | 🔴 КРИТИЧЕСКИЙ |
| **Нет мега-меню для навигации** | Пользователь потерян | 🔴 КРИТИЧЕСКИЙ |
| **Dashboard/Admin логика не связаны** | Сайт не функционален | 🔴 КРИТИЧЕСКИЙ |
| **База данных неполная** | Функции не работают | 🔴 КРИТИЧЕСКИЙ |
| **Мобильная версия примитивна** | 60% трафика страдает | 🟡 ВЫСОКИЙ |
| **Нет полного функционала** | Сайт-витрина, не продукт | 🟡 ВЫСОКИЙ |

---

## 🎯 ЧАСТЬ 1: ГЛАВНАЯ СТРАНИЦА (HOMEPAGE)

### 1.1 Структура главной страницы

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER (sticky, h-16)                                                        │
│ ┌──────┐ ┌────────────────────────────────────┐ ┌───────────────────────────┐│
│ │ Logo │ │  🔍 Искать по всем категориям...   │ │[❤️][💬][➕Подать][👤User]││
│ └──────┘ └────────────────────────────────────┘ └───────────────────────────┘│
├─────────────────────────────────────────────────────────────────────────────┤
│ MEGA MENU (Dropdown при hover на "Категории")                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🚗 Транспорт    │ 🏠 Недвижимость  │ 📱 Электроника │ 👔 Мода       │ │
│ │ ├─ Легковые     │ ├─ Квартиры      │ ├─ Телефоны    │ ├─ Мужская    │ │
│ │ ├─ Мотоциклы    │ ├─ Дома          │ ├─ Ноутбуки    │ ├─ Женская    │ │
│ │ ├─ Запчасти     │ ├─ Аренда        │ ├─ ТВ/Аудио    │ └─ Аксессуары │ │
│ │ └─ Услуги       │ └─ Коммерческая  │ └─ Игры        │               │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │              Найди всё, что нужно, рядом с тобой 🇸🇰                     │ │
│ │                                                                         │ │
│ │   ┌───────────────────────────────────────────┐  ┌────────────────┐    │ │
│ │   │ 🔍 Что ищете?                             │  │    Найти       │    │ │
│ │   └───────────────────────────────────────────┘  └────────────────┘    │ │
│ │                                                                         │ │
│ │   Популярное: iPhone • BMW • Квартира • PS5 • MacBook                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ КАТЕГОРИИ (Большие иконки с счётчиком)                                       │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │    🚗      │ │    🏠      │ │    📱      │ │    👔      │ │    🛠️      │ │
│ │ Транспорт  │ │ Недвиж.    │ │ Электрон.  │ │   Мода     │ │  Услуги    │ │
│ │  (12,345)  │ │  (5,678)   │ │  (8,901)   │ │  (4,567)   │ │  (2,345)   │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │    🏡      │ │    👶      │ │    🎮      │ │    📚      │ │    •••     │ │
│ │ Дом и сад  │ │   Дети     │ │ Хобби      │ │   Работа   │ │   Ещё     │ │
│ │  (3,456)   │ │  (1,234)   │ │  (2,567)   │ │   (890)    │ │   (+20)    │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ FEATURED / VIP ОБЪЯВЛЕНИЯ                                    [Все VIP →]     │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│ │ ⭐ VIP         │ │ ⭐ VIP         │ │ ⭐ VIP         │ │ ⭐ VIP         │    │
│ │ [Image]        │ │ [Image]        │ │ [Image]        │ │ [Image]        │    │
│ │ iPhone 15 Pro  │ │ BMW X5 2024    │ │ 3-комн. кв.    │ │ MacBook Pro    │    │
│ │ €899           │ │ €45,000        │ │ €750/мес       │ │ €1,299         │    │
│ │ 📍 Bratislava  │ │ 📍 Košice      │ │ 📍 Bratislava  │ │ 📍 Žilina      │    │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ПОСЛЕДНИЕ ОБЪЯВЛЕНИЯ                                   [Все объявления →]    │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│ │ [Image]        │ │ [Image]        │ │ [Image]        │ │ [Image]        │    │
│ │ Title          │ │ Title          │ │ Title          │ │ Title          │    │
│ │ €Price         │ │ €Price         │ │ €Price         │ │ €Price         │    │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘    │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│ │ [Image]        │ │ [Image]        │ │ [Image]        │ │ [Image]        │    │
│ │ Title          │ │ Title          │ │ Title          │ │ Title          │    │
│ │ €Price         │ │ €Price         │ │ €Price         │ │ €Price         │    │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ПОПУЛЯРНЫЕ ПО РЕГИОНАМ                                                       │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                 │
│ │ 📍 Bratislava   │ │ 📍 Košice        │ │ 📍 Žilina        │                 │
│ │ 12,345 объявл.  │ │ 5,678 объявл.    │ │ 3,456 объявл.    │                 │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ КАК ЭТО РАБОТАЕТ (3 шага)                                                    │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                 │
│ │ 1️⃣ Создай       │ │ 2️⃣ Опубликуй    │ │ 3️⃣ Продай       │                 │
│ │ объявление      │ │ бесплатно       │ │ быстро          │                 │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ CTA СЕКЦИЯ                                                                   │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  Готов продавать? Создай объявление за 2 минуты!  [Подать объявление]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Mega Menu Component

**Файл**: `/components/layout/mega-menu.tsx` \[НОВЫЙ\]

```tsx
// СТРУКТУРА:
// - Grid с 4-6 главными категориями
// - Каждая категория = иконка + название + подкатегории
// - При hover открывается dropdown со всеми подкатегориями
// - Анимация: fade-in, slide-down
// - Backdrop при открытии (затемнение страницы)
```

### 1.3 Categories Grid Component

**Файл**: `/components/home/categories-grid.tsx` \[НОВЫЙ\]

```tsx
// ФУНКЦИОНАЛ:
// - 10 категорий в сетке (2x5 mobile, 5x2 desktop)
// - Каждая карточка: иконка + название + количество объявлений
// - Hover-эффект: подъём карточки + тень
// - Клик → переход на /categories/[slug]
// - Последняя карточка "Ещё" → /categories
```

---

## 🎯 ЧАСТЬ 2: СТРУКТУРА МЕНЮ И НАВИГАЦИИ

### 2.1 Header - Полная спецификация

```
DESKTOP (≥1024px):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐  ┌───────────┐  ┌─────────────────────────────┐  ┌────────────┐│
│ │  Logo   │  │[Категории▾]  │ 🔍 Поиск по всем объявлениям│  │ Icons+User ││
│ └─────────┘  └───────────┘  └─────────────────────────────┘  └────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘

MOBILE (≤768px):
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌────┐  ┌─────────────────────────────────────────────┐  ┌────┐  ┌────┐   │
│ │ ☰  │  │ 🔍 Поиск...                                 │  │ ❤️ │  │ 👤 │   │
│ └────┘  └─────────────────────────────────────────────┘  └────┘  └────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Mobile Drawer Menu

**Файл**: `/components/layout/mobile-drawer.tsx` \[НОВЫЙ\]

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │  Logo                                                            [✕]  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ГЛАВНОЕ                                                                     │
│ ├─ 🏠 Главная                                                              │
│ ├─ 🔍 Поиск                                                                │
│ ├─ ➕ Подать объявление                                                    │
│ └─ ❤️ Избранное                                                            │
│                                                                             │
│ КАТЕГОРИИ                                                                   │
│ ├─ 🚗 Транспорт                                                   [→]     │
│ ├─ 🏠 Недвижимость                                                [→]     │
│ ├─ 📱 Электроника                                                 [→]     │
│ ├─ 👔 Мода                                                        [→]     │
│ └─ ••• Все категории                                                       │
│                                                                             │
│ АККАУНТ (если авторизован)                                                  │
│ ├─ 📊 Мой кабинет                                                          │
│ ├─ 📦 Мои объявления                                                       │
│ ├─ 💬 Сообщения (3)                                                        │
│ ├─ ⚙️ Настройки                                                            │
│ └─ 🚪 Выйти                                                                │
│                                                                             │
│ ───────────────────────────────────────────────────────────────────────── │
│ 🌙 Тёмная тема [Toggle]                                                    │
│ 🌐 Язык: [SK] [EN]                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Bottom Tab Bar (Mobile - уже есть, нужно доработать)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌──────┐  ┌──────┐  ┌──────────┐  ┌──────┐  ┌──────┐                       │
│ │ 🏠   │  │ 🔍   │  │    ➕    │  │ ❤️   │  │ 👤   │                       │
│ │ Home │  │Search│  │   Sell   │  │Saved │  │ Menu │                       │
│ └──────┘  └──────┘  └──────────┘  └──────┘  └──────┘                       │
│                      (Elevated)                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 ЧАСТЬ 3: DASHBOARD (Личный Кабинет Пользователя)

### 3.1 Полная структура Dashboard

```
URL: /dashboard
     /dashboard/listings      - Мои объявления
     /dashboard/orders        - Заказы (покупки + продажи)
     /dashboard/wallet        - Кошелёк
     /dashboard/reviews       - Отзывы
     /dashboard/settings      - Настройки
     /dashboard/verification  - Верификация
     /dashboard/saved-searches - Сохранённые поиски
     /dashboard/promote       - Продвижение
     /dashboard/subscription  - Подписка PRO
```

### 3.2 Dashboard Overview - Детальный дизайн

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ПРИВЕТСТВИЕ                                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 👋 Добро пожаловать, Иван!                                              │ │
│ │ У вас 3 новых сообщения и 2 объявления на модерации.                    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ СТАТИСТИКА                                                                   │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│ │   📦 12        │ │   👁️ 1,234     │ │   ❤️ 45        │ │   💬 8         ││
│ │ Объявлений     │ │ Просмотров     │ │ В избранном    │ │ Сообщений     ││
│ │ +2 за неделю   │ │ +15% за неделю │ │ +5 за неделю   │ │ 3 непрочит.   ││
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘│
├───────────────────────────────────────────┬─────────────────────────────────┤
│ ГРАФИК ПРОСМОТРОВ (70%)                   │ БЫСТРЫЕ ДЕЙСТВИЯ (30%)          │
│ ┌───────────────────────────────────────┐ │ ┌─────────────────────────────┐ │
│ │                                       │ │ │ [➕] Создать объявление     │ │
│ │    📈 Просмотры за 30 дней            │ │ │ [🚀] Продвинуть            │ │
│ │                                       │ │ │ [⚙️] Редактировать профиль │ │
│ │   /\    /\                            │ │ └─────────────────────────────┘ │
│ │  /  \  /  \    /\                     │ │                                 │
│ │ /    \/    \  /  \  /\                │ │ ЛЕНТА СОБЫТИЙ                   │
│ │              \/    \/                 │ │ ┌─────────────────────────────┐ │
│ └───────────────────────────────────────┘ │ │ • John просмотрел "iPhone"  │ │
│                                           │ │ • Новое сообщение от Anna   │ │
│                                           │ │ • "MacBook" одобрен         │ │
│                                           │ └─────────────────────────────┘ │
├───────────────────────────────────────────┴─────────────────────────────────┤
│ ПОСЛЕДНИЕ ОБЪЯВЛЕНИЯ                                           [Все →]      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [📷]  │ iPhone 15 Pro      │ €899   │ ✅ Активно  │ 234 просм. │ [•••] │ │
│ │ [📷]  │ MacBook Pro 14     │ €1,499 │ ✅ Активно  │ 156 просм. │ [•••] │ │
│ │ [📷]  │ AirPods Pro 2      │ €199   │ ⏳ Модерация│ 0 просм.   │ [•••] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 My Listings Page - Таблица с фильтрами

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Мои объявления                                          [➕ Новое объявление]│
├─────────────────────────────────────────────────────────────────────────────┤
│ [Все] [Активные] [На модерации] [Проданные] [Истёкшие]   🔍 Поиск...       │
├─────────────────────────────────────────────────────────────────────────────┤
│ ☐ Выбрать все    │  3 выбрано: [Удалить] [Деактивировать]                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ☐ │ [📷] │ iPhone 15 Pro     │ €899   │ ✅ Активно  │ 234 👁️ │ [Ред][•••]│ │
│ ☐ │ [📷] │ MacBook Pro 14    │ €1,499 │ ✅ Активно  │ 156 👁️ │ [Ред][•••]│ │
│ ☐ │ [📷] │ AirPods Pro 2     │ €199   │ ⏳ Модерация│   0 👁️ │ [Ред][•••]│ │
│ ☐ │ [📷] │ Samsung TV 55"    │ €450   │ ✅ Продано  │  89 👁️ │ [Ред][•••]│ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                 ← 1 2 3 4 5 →                                │
└─────────────────────────────────────────────────────────────────────────────┘

DROPDOWN МЕНЮ [•••]:
├─ 👁️ Просмотреть
├─ ✏️ Редактировать
├─ 📋 Дублировать
├─ 🚀 Продвинуть
├─ ✅ Отметить проданным
├─ ⏸️ Деактивировать
├─ 🔄 Продлить
└─ 🗑️ Удалить
```

### 3.4 Wallet Page - Детальный дизайн

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Кошелёк                                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │  БАЛАНС                                                                 │ │
│ │  €125.00                                         [+ Пополнить] [Вывод]  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ БЫСТРОЕ ПОПОЛНЕНИЕ                                                          │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                     │
│ │  €10   │ │  €25   │ │  €50   │ │  €100  │ │ Другая │                     │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ИСТОРИЯ ТРАНЗАКЦИЙ                                        [Все] [Пополн.] [Спис.]│
├─────────────────────────────────────────────────────────────────────────────┤
│ 📅 Сегодня                                                                   │
│ ├─ 🚀 Продвижение "iPhone 15"              -€10.00           14:32          │
│ ├─ ➕ Пополнение (Visa •••4242)            +€50.00           10:15          │
│                                                                              │
│ 📅 Вчера                                                                     │
│ ├─ 🚀 Продвижение "MacBook"                -€5.00            18:45          │
│ └─ ➕ Пополнение (Visa •••4242)            +€25.00           12:00          │
├─────────────────────────────────────────────────────────────────────────────┤
│ СПОСОБЫ ОПЛАТЫ                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 💳 Visa •••• 4242     Истекает 12/27          [По умолчанию] [Удалить]  │ │
│ │ 💳 MasterCard •••• 8888  Истекает 06/26                       [Удалить] │ │
│ │                                                                         │ │
│ │ [+ Добавить карту]                                                      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 ЧАСТЬ 4: ADMIN ПАНЕЛЬ

### 4.1 Полная структура Admin

```
URL: /admin
     /admin/users           - Пользователи
     /admin/listings        - Объявления
     /admin/verifications   - Верификации
     /admin/reports         - Жалобы
     /admin/content         - Контент (категории, страницы)
     /admin/analytics       - Аналитика
     /admin/settings        - Настройки платформы
     /admin/promotions      - Промо-кампании
```

### 4.2 Admin Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Панель администратора                                          [🔔 5] [👤 Admin]│
├─────────────────────────────────────────────────────────────────────────────┤
│ КЛЮЧЕВЫЕ МЕТРИКИ                                                             │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│ │   👥 12,345    │ │   📦 45,678    │ │   ⚠️ 23        │ │   💰 €15,432   ││
│ │ Пользователей  │ │ Объявлений     │ │ На модерации   │ │ Выручка мес.   ││
│ │ +156 сегодня   │ │ +234 сегодня   │ │ Срочно!        │ │ +12% к пр.мес. ││
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘│
├───────────────────────────────────────────┬─────────────────────────────────┤
│ ОЧЕРЕДЬ МОДЕРАЦИИ                         │ ЗДОРОВЬЕ СИСТЕМЫ                │
│ ┌───────────────────────────────────────┐ │ ┌─────────────────────────────┐ │
│ │ ⚠️ 15 объявлений ожидают             │ │ │ ✅ Сервер: Online           │ │
│ │ ⚠️ 5 верификаций ожидают             │ │ │ ✅ База данных: Healthy     │ │
│ │ ⚠️ 3 жалобы на рассмотрении          │ │ │ 📊 Хранилище: 67% занято    │ │
│ │                                       │ │ │ ⏱️ Uptime: 99.9%           │ │
│ │       [Перейти к модерации]           │ │ └─────────────────────────────┘ │
│ └───────────────────────────────────────┘ │                                 │
├───────────────────────────────────────────┴─────────────────────────────────┤
│ АКТИВНОСТЬ ЗА СЕГОДНЯ                                                        │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 14:32 │ 👤 user@email.com зарегистрировался                             │ │
│ │ 14:28 │ 📦 Новое объявление "iPhone 15" требует модерации               │ │
│ │ 14:15 │ ⚠️ Жалоба на объявление #12345                                  │ │
│ │ 14:00 │ ✅ Верификация пользователя john@email.com одобрена             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ ГРАФИКИ                                                                      │
│ ┌───────────────────────────────────┐ ┌───────────────────────────────────┐ │
│ │  Регистрации за 30 дней           │ │  Выручка за 30 дней              │ │
│ │  [Line Chart]                     │ │  [Bar Chart]                     │ │
│ └───────────────────────────────────┘ └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Moderation Queue - Детальный дизайн

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Модерация объявлений                          15 ожидают │ 234 одобрено сегодня│
├─────────────────────────────────────────────────────────────────────────────┤
│ Фильтр: [Все] [Новые] [Подозрительные] [Повторные]   Сортировка: [Новые ▾] │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ ПОДОЗРИТЕЛЬНАЯ ЦЕНА                                                  │ │
│ │ ┌────────┐  iPhone 15 Pro 256GB                                         │ │
│ │ │ [📷📷] │  Цена: €50 (среднее: €899)                                   │ │
│ │ │ [📷📷] │  Продавец: new_user_123 (аккаунт 1 день)                     │ │
│ │ └────────┘                                                               │ │
│ │                                                                          │ │
│ │ Описание: Selling my iPhone...                                          │ │
│ │                                                                          │ │
│ │ [✅ Одобрить] [❌ Отклонить] [📝 Запросить правки] [🚫 Забанить]        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🆕 НОВОЕ ОБЪЯВЛЕНИЕ                                                      │ │
│ │ ┌────────┐  BMW X5 2024                                                  │ │
│ │ │ [📷📷] │  Цена: €45,000                                               │ │
│ │ │ [📷📷] │  Продавец: verified_dealer (⭐ 4.8, 50 продаж)               │ │
│ │ └────────┘                                                               │ │
│ │                                                                          │ │
│ │ [✅ Одобрить] [❌ Отклонить] [📝 Запросить правки]                       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 ЧАСТЬ 5: БАЗА ДАННЫХ (Supabase)

### 5.1 Текущие таблицы (существуют):
```sql
-- ✅ profiles
-- ✅ categories
-- ✅ listings
-- ✅ favorites
-- ✅ messages
-- ✅ conversations
```

### 5.2 Новые таблицы (НУЖНО СОЗДАТЬ):

```sql
-- 1. WALLET & TRANSACTIONS
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'promotion', 'subscription'
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROMOTIONS
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) NOT NULL,
  type VARCHAR(30) NOT NULL, -- 'featured', 'top_search', 'urgent', 'highlight'
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  reviewed_id UUID REFERENCES profiles(id) NOT NULL,
  listing_id UUID REFERENCES listings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REPORTS
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  reported_user_id UUID REFERENCES profiles(id),
  listing_id UUID REFERENCES listings(id),
  conversation_id UUID REFERENCES conversations(id),
  type VARCHAR(30) NOT NULL, -- 'scam', 'inappropriate', 'spam', 'wrong_category', 'other'
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
  admin_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. USER VERIFICATION
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type VARCHAR(30) NOT NULL, -- 'email', 'phone', 'id_document', 'address', 'business'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  document_url TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  plan VARCHAR(20) NOT NULL, -- 'free', 'pro', 'business'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SAVED SEARCHES
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name VARCHAR(100) NOT NULL,
  query TEXT NOT NULL, -- JSON with search params
  notify_new BOOLEAN DEFAULT true,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ORDERS (для сделок через платформу)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'
  shipping_address JSONB,
  tracking_number VARCHAR(100),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type VARCHAR(30) NOT NULL, -- 'message', 'favorite', 'review', 'order', 'promotion', 'system'
  title VARCHAR(200) NOT NULL,
  body TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. ACTIVITY LOG
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action VARCHAR(50) NOT NULL, -- 'listing_view', 'listing_create', 'message_send', etc.
  entity_type VARCHAR(30), -- 'listing', 'user', 'message'
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.3 Индексы для производительности

```sql
-- Listings
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_featured ON listings(featured) WHERE featured = true;

-- Promotions
CREATE INDEX idx_promotions_listing ON promotions(listing_id);
CREATE INDEX idx_promotions_active ON promotions(listing_id, status) WHERE status = 'active';

-- Reviews
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX idx_reviews_listing ON reviews(listing_id);

-- Notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- Activity
CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);
```

### 5.4 Row Level Security (RLS)

```sql
-- Пример для wallets
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
ON wallets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
ON wallets FOR UPDATE
USING (auth.uid() = user_id);

-- Админы могут всё
CREATE POLICY "Admins have full access"
ON wallets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 🎯 ЧАСТЬ 6: МОБИЛЬНАЯ ВЕРСИЯ

### 6.1 Breakpoints и адаптивность

```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 6.2 Компоненты mobile-specific

| Компонент | Desktop | Mobile |
|-----------|---------|--------|
| Header | Full с mega-menu | Simplified + burger |
| Navigation | Sidebar | Bottom Tab Bar |
| Categories | Grid 5x2 | Grid 2x5 + horizontal scroll |
| Listings | Grid 4 columns | Grid 2 columns |
| Filters | Левая панель | Bottom Sheet |
| Search | В header | Отдельный экран |
| Messages | Split view | List → Chat |
| Actions | Dropdown | Bottom Sheet |

### 6.3 Touch-friendly elements

```css
/* Минимальные размеры для touch-элементов */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Увеличенные отступы на мобильных */
.mobile-spacing {
  padding: 16px; /* вместо 8px на desktop */
}

/* Swipe actions на карточках */
.swipeable-card {
  /* Swipe left → delete */
  /* Swipe right → favorite */
}
```

### 6.4 Progressive Web App (PWA)

```json
// manifest.json
{
  "name": "Slovor Marketplace",
  "short_name": "Slovor",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#F8FAFC",
  "icons": [...]
}
```

---

## 🎯 ЧАСТЬ 7: ПЛАН РЕАЛИЗАЦИИ

### 7.1 Фазы работы

```
ФАЗА 1: HOMEPAGE & МЕНЮ (4-6 часов)
├── 1.1 Mega Menu Component
├── 1.2 Categories Grid Component
├── 1.3 Homepage sections (Hero, Featured, Recent, Regions, How It Works, CTA)
├── 1.4 Mobile Drawer Menu
└── 1.5 Updated Header with Mega Menu trigger

ФАЗА 2: DATABASE SCHEMA (2-3 часа)
├── 2.1 Создать все новые таблицы
├── 2.2 Добавить индексы
├── 2.3 Настроить RLS
├── 2.4 Создать seed data
└── 2.5 Обновить TypeScript types

ФАЗА 3: DASHBOARD ENHANCEMENT (4-6 часов)
├── 3.1 Overview с реальными данными
├── 3.2 My Listings с фильтрами и bulk actions
├── 3.3 Wallet с историей транзакций
├── 3.4 Reviews page
├── 3.5 Settings tabs
├── 3.6 Verification flow
├── 3.7 Saved Searches
└── 3.8 Subscription management

ФАЗА 4: ADMIN PANEL (4-6 часов)
├── 4.1 Admin Dashboard с метриками
├── 4.2 Moderation Queue
├── 4.3 Users Management
├── 4.4 Listings Management
├── 4.5 Reports Queue
├── 4.6 Verifications Queue
├── 4.7 Content Management (Categories)
├── 4.8 Analytics Dashboard
└── 4.9 Platform Settings

ФАЗА 5: MOBILE OPTIMIZATION (3-4 часа)
├── 5.1 Responsive audit всех страниц
├── 5.2 Touch-friendly improvements
├── 5.3 Bottom Sheet components
├── 5.4 Swipe gestures
├── 5.5 PWA configuration
└── 5.6 Mobile-specific UX fixes

ФАЗА 6: INTEGRATIONS (2-3 часа)
├── 6.1 Stripe для Wallet
├── 6.2 Email notifications
├── 6.3 Push notifications
├── 6.4 Image optimization (CDN)
└── 6.5 Analytics tracking

ФАЗА 7: VERIFICATION & POLISH (2-3 часа)
├── 7.1 E2E tests для критических потоков
├── 7.2 Performance optimization
├── 7.3 SEO audit
├── 7.4 Accessibility audit
├── 7.5 Security audit
└── 7.6 Final visual polish
```

### 7.2 Estimated Timeline

| Фаза | Время | Приоритет |
|------|-------|-----------|
| Homepage & Меню | 4-6 часов | 🔴 КРИТИЧЕСКИЙ |
| Database Schema | 2-3 часа | 🔴 КРИТИЧЕСКИЙ |
| Dashboard | 4-6 часов | 🔴 КРИТИЧЕСКИЙ |
| Admin Panel | 4-6 часов | 🟡 ВЫСОКИЙ |
| Mobile | 3-4 часа | 🟡 ВЫСОКИЙ |
| Integrations | 2-3 часа | 🟢 СРЕДНИЙ |
| Verification | 2-3 часа | 🔴 КРИТИЧЕСКИЙ |
| **ИТОГО** | **22-31 час** | |

---

## 🎯 ЧАСТЬ 8: КРИТЕРИИ ГОТОВНОСТИ

### 8.1 Функциональные требования

**Homepage:**
- [ ] Mega Menu работает (desktop + mobile)
- [ ] Категории отображают реальное количество объявлений
- [ ] Featured listings загружаются из БД
- [ ] Поиск работает с autocomplete
- [ ] Все секции responsive

**Dashboard:**
- [ ] Статистика показывает реальные данные
- [ ] CRUD для объявлений полностью работает
- [ ] Wallet показывает баланс и транзакции
- [ ] Reviews отображаются и можно отвечать
- [ ] Settings сохраняются
- [ ] Верификация работает

**Admin:**
- [ ] Модерация объявлений работает
- [ ] Управление пользователями работает
- [ ] Жалобы можно обрабатывать
- [ ] Аналитика отображается

**Mobile:**
- [ ] Все страницы работают на 375px
- [ ] Touch targets ≥ 44px
- [ ] Нет horizontal scroll (кроме галерей)
- [ ] Bottom navigation работает

### 8.2 Нефункциональные требования

- [ ] `npm run verify` проходит без ошибок
- [ ] Build time < 2 минуты
- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 90
- [ ] Нет hardcoded цветов
- [ ] Все тексты через i18n
- [ ] Dark mode работает везде

### 8.3 Definition of Done

Проект считается **ГОТОВЫМ К ПРОДАКШЕНУ** когда:

1. ✅ Все 8 фаз реализации завершены
2. ✅ Все чек-листы пройдены
3. ✅ E2E тесты проходят
4. ✅ Manual testing пройден
5. ✅ PR создан и утверждён
6. ✅ Merge в main выполнен

---

## 📝 ПРИЛОЖЕНИЕ A: ФАЙЛОВАЯ СТРУКТУРА

```
/components
  /home
    hero.tsx              [UPD] - добавить autocomplete
    categories-grid.tsx   [NEW] - сетка категорий
    featured-listings.tsx [UPD] - подключить к БД
    recent-listings.tsx   [NEW] - последние объявления
    regions.tsx           [NEW] - популярные регионы
    how-it-works.tsx      [NEW] - 3 шага
    home-cta.tsx          [UPD] - рестайлинг
  /layout
    header.tsx            [UPD] - добавить mega menu trigger
    mega-menu.tsx         [NEW] - мега меню
    mobile-drawer.tsx     [NEW] - мобильное меню
    bottom-tab-bar.tsx    [UPD] - исправить стили
  /features/dashboard
    /user
      overview-view.tsx   [UPD] - реальные данные
      listings-view.tsx   [UPD] - фильтры, bulk actions
      wallet-view.tsx     [UPD] - транзакции
      reviews-view.tsx    [UPD] - полный функционал
    /admin
      overview-view.tsx   [UPD] - метрики
      moderation-view.tsx [NEW] - очередь модерации
      users-view.tsx      [UPD] - управление
      reports-view.tsx    [NEW] - жалобы
      analytics-view.tsx  [NEW] - аналитика
```

---

## 📝 ПРИЛОЖЕНИЕ B: API ENDPOINTS

```typescript
// Wallet
POST   /api/wallet/deposit
POST   /api/wallet/withdraw
GET    /api/wallet/transactions

// Promotions
POST   /api/promotions
GET    /api/promotions/pricing

// Reviews
POST   /api/reviews
POST   /api/reviews/:id/reply
GET    /api/users/:id/reviews

// Admin
GET    /api/admin/moderation-queue
POST   /api/admin/approve/:id
POST   /api/admin/reject/:id
GET    /api/admin/reports
POST   /api/admin/reports/:id/resolve
GET    /api/admin/analytics
```

---

**END OF MASTERPLAN V2**

---

> **ДЛЯ AI АГЕНТА**: Используй этот план как ЕДИНСТВЕННЫЙ источник правды.
> Выполняй фазы последовательно. После каждой фазы - `npm run verify`.
> При любых неясностях - СПРОСИ пользователя.
