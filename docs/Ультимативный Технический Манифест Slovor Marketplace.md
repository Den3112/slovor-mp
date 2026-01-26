# Ультимативный Технический Манифест Slovor Marketplace

**Цель**: Полная переработка структуры, навигации, Личного Кабинета (ЛК) и Админ-панели для достижения статуса премиум-маркетплейса.

**Стек**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL, Realtime, Auth).

**Текущее состояние (Аудит кода)**:
*   Проект использует App Router.
*   Существует базовая структура для `/profile` с разделами `my-listings`, `messages`, `settings` и др.
*   Существует базовая структура для `/admin` с `layout.tsx` и `page.tsx`.
*   Защита маршрутов `/post` и `/profile` реализована через `middleware.ts`, но **отсутствует проверка роли** для `/admin` (необходимо добавить).
*   В `/app/admin/layout.tsx` нет логики защиты, что является критической уязвимостью.

## 1. Архитектурный план и Рефакторинг (Refactoring Plan)

### 1.1. Структура папок (Modifications)

| Путь | Текущее состояние | Предлагаемое изменение | Обоснование |
| :--- | :--- | :--- | :--- |
| `/lib/types/` | Отсутствует | **Создать** | Централизация всех TypeScript-типов (User, Listing, Message, Review, AdminAction). |
| `/lib/auth/` | Отсутствует | **Создать** | Вынести логику проверки ролей и прав доступа из `middleware.ts` и компонентов. |
| `/components/ui/` | Существует | **Расширить** | Добавить премиальные UI-компоненты (MegaMenu, TabBar, AnimatedButton). |
| `/app/profile/` | Существует | **Реструктурировать** | Внедрить единый `ProfileLayout` с боковой навигацией. |
| `/app/admin/` | Существует | **Реструктурировать** | Внедрить `AdminLayout` с обязательной проверкой роли. |
| `/lib/actions/` | Существует | **Расширить** | Добавить Server Actions для всех операций ЛК и Админ-панели (например, `updateListingStatus`, `verifyUser`). |

### 1.2. Критический Рефакторинг Безопасности

**Задача**: Защитить маршруты `/admin` на уровне `middleware`.

**Инструкция для ИИ-бота**:
1.  **Модифицировать `/lib/supabase/middleware.ts`**:
    *   После получения `user` (строка 60), получить его `role` (из таблицы `profiles` или `users`).
    *   Добавить проверку:
        ```typescript
        // lib/supabase/middleware.ts (добавить в логику Protected routes)
        if (request.nextUrl.pathname.startsWith('/admin')) {
          const { data: profile } = await supabase.from('profiles').select('role').single();
          if (!user || profile?.role !== 'admin') {
            const url = request.nextUrl.clone();
            url.pathname = '/'; // Перенаправить на главную или 403
            return NextResponse.redirect(url);
          }
        }
        ```
2.  **Удалить защиту из `/app/admin/layout.tsx`**: Логика защиты должна быть только в `middleware` для предотвращения рендеринга.

## 2. Структура Меню и Навигации (Ультимативная Спецификация)

### 2.1. Desktop Header (`/components/layout/Header.tsx`)

| Элемент | Функционал | Техническая реализация |
| :--- | :--- | :--- |
| **Логотип** | Ссылка на `/`. | `motion.a` с анимацией `whileHover`. |
| **Умный Поиск** | Глобальный поиск с автодополнением и историей. | Компонент `SmartSearch` (см. предыдущее ТЗ). |
| **Мега-меню** | Выпадающая панель с категориями. | Компонент `MegaMenu` (см. предыдущее ТЗ). |
| **Кнопка "Подать"** | Ссылка на `/post`. | `Button` с `variant="default"`, выделенная. |
| **Уведомления** | Иконка `Bell` с `Badge` (Realtime). | Компонент `NotificationCenter` (см. предыдущее ТЗ). |
| **Профиль** | Аватар с выпадающим меню ЛК. | Компонент `UserMenu` с ссылками на `/profile/*`. |

### 2.2. Mobile Tab Bar (`/components/layout/BottomNavBar.tsx`)

**Требование**: Должен быть фиксирован внизу экрана, скрываться при скролле вниз и появляться при скролле вверх.

| Элемент | Иконка | Ссылка | Примечание |
| :--- | :--- | :--- | :--- |
| **Главная** | `Home` | `/` | |
| **Обзор** | `LayoutGrid` | `/listings` | Заменяет Мега-меню на мобильном. |
| **Подать** | `PlusCircle` | `/post` | Центральная, выделенная кнопка. |
| **Сообщения** | `MessageSquare` | `/messages` | С Realtime-индикатором. |
| **Профиль** | `User` | `/profile` | |

## 3. Личный Кабинет (ЛК) - Ультимативная Спецификация

### 3.1. Единый Layout ЛК (`/app/profile/layout.tsx`)

**Задача**: Обеспечить единую структуру и навигацию для всех страниц ЛК.

| Компонент | Описание | Логика |
| :--- | :--- | :--- |
| **ProfileLayout** | Главный контейнер ЛК. | Проверка авторизации. |
| **ProfileSidebar** | Боковая навигация. | Должен быть адаптивным: на десктопе — Sidebar, на мобильном — Drawer. |
| **Breadcrumbs** | Навигационная цепочка. | Динамически генерируется на основе текущего маршрута. |

### 3.2. Функционал ЛК (Data Flow & Components)

| Раздел ЛК | URL | Ключевые Компоненты | Data Flow (Supabase) |
| :--- | :--- | :--- | :--- |
| **Обзор** | `/profile` | `ProfileStatsCard`, `RecentActivityFeed` | `rpc` для получения агрегированных данных (просмотры, рейтинг). |
| **Мои объявления** | `/profile/listings` | `ListingTable`, `PromoteModal` | `select * from listings where user_id = current_user_id`. Server Action для `updateStatus`. |
| **Верификация** | `/profile/verification` | `VerificationForm`, `StatusBadge` | `select * from user_verifications where user_id = current_user_id`. Server Action для `submitVerification`. |
| **Отзывы** | `/profile/reviews` | `ReviewList`, `RatingSummary` | `select * from reviews where recipient_id = current_user_id`. |
| **Платежи** | `/profile/payments` | `TransactionHistoryTable`, `PaymentMethodForm` | `select * from transactions where user_id = current_user_id`. |

**Инструкция для ИИ-бота (ЛК)**:
*   Все операции CRUD в ЛК должны использовать **Next.js Server Actions** для максимальной безопасности и производительности.
*   Для отображения данных использовать **Server Components** для начальной загрузки и **Client Components** с `useSWR` или `useQuery` для реактивных обновлений (например, после изменения статуса объявления).
*   **Верификация**: Форма должна поддерживать загрузку файлов (S3/Supabase Storage) и отправлять запрос на модерацию.

## 4. Админ-панель - Ультимативная Спецификация

### 4.1. Единый Layout Админ-панели (`/app/admin/layout.tsx`)

**Задача**: Полная изоляция и защита.

| Компонент | Описание | Логика |
| :--- | :--- | :--- |
| **AdminLayout** | Главный контейнер. | **Критично**: Проверка `user.role === 'admin'` в `middleware.ts`. |
| **AdminSidebar** | Навигация по разделам Админ-панели. | Должен быть статичным и всегда видимым. |

### 4.2. Функционал Админ-панели (Data Flow & Components)

| Раздел Админ-панели | URL | Ключевые Компоненты | Data Flow (Supabase) |
| :--- | :--- | :--- | :--- |
| **Модерация** | `/admin/moderation` | `ModerationQueueTable`, `ListingDetailModal` | `select * from listings where status = 'pending'`. Server Action для `approveListing` / `rejectListing`. |
| **Пользователи** | `/admin/users` | `UserManagementTable` | `select * from profiles`. Server Action для `updateUserRole` / `banUser`. |
| **Верификация** | `/admin/verification` | `VerificationRequestTable`, `DocumentViewer` | `select * from user_verifications where status = 'pending'`. Server Action для `processVerification`. |
| **Категории** | `/admin/categories` | `CategoryTree`, `AttributeEditor` | CRUD-операции для таблицы `categories` и `category_attributes`. |

**Инструкция для ИИ-бота (Админ-панель)**:
*   **Модерация**: Таблица должна быть оптимизирована для быстрой работы (пагинация, фильтрация на стороне сервера).
*   **Динамические Атрибуты**: Создать компонент `AttributeEditor`, который позволяет администратору определять JSON-схему для поля `attributes` в таблице `listings` для каждой категории.
*   **Безопасность**: Все Server Actions, вызываемые из Админ-панели, должны иметь дополнительную проверку `if (user.role !== 'admin') throw new Error('Unauthorized')`.

## 5. Ультимативные Инструкции для ИИ-разработчика

**Принцип 1: Модульность и Типизация**
*   Все новые компоненты должны быть строго типизированы с использованием типов из `/lib/types/`.
*   Использовать паттерн **"Container/Presentational"** для разделения логики (Server/Client Components) и UI.

**Принцип 2: Премиальный UX/UI**
*   Строго следовать гайду по микро-взаимодействиям (Framer Motion) для всех интерактивных элементов.
*   Использовать `shadcn/ui` (или аналогичные компоненты) для создания чистых, современных интерфейсов.

**Принцип 3: Data Flow**
*   **Frontend**: Использовать `useSWR` или `react-query` для управления состоянием данных на клиенте.
*   **Backend**: Все мутации (создание, обновление, удаление) должны проходить через **Server Actions**.

**Принцип 4: Миграция**
*   **Шаг 1**: Внедрить защиту `/admin` в `middleware.ts`.
*   **Шаг 2**: Создать `ProfileLayout` и `AdminLayout`.
*   **Шаг 3**: Модифицировать `Header` и `BottomNavBar` согласно спецификации.
*   **Шаг 4**: Постепенно переносить функционал старых страниц ЛК (`/profile/my-listings`, `/profile/settings`) в новые компоненты, используя Server Actions.

Этот манифест является полным техническим заданием для реализации всех ваших требований.
