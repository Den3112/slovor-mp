# Список задач редизайна Premium CRM - Фаза 2 (Marketplace Core)

> **Цель**: Привести основные страницы маркетплейса (Auth, Search, Listing) к стилю "Solid, Clean, Data-Dense". Убрать градиенты, блюры и `rounded-3xl`.

- [x] **Auth Pages (Вход/Регистрация)**
    - [x] `app/[locale]/(main)/auth/login/page.tsx`
    - [x] `app/[locale]/(main)/auth/register/page.tsx` (если отличается)
    - [x] Убрать `animate-bounce`, `shake`, `rounded-3xl`
    - [x] Сделать строгий, солидный стиль (Card + Border)

- [x] **Search & Categories (Поиск)**
    - [x] `app/[locale]/(main)/search/page.tsx`
    - [x] `components/search/search-layout.tsx` (Сайдбар фильтров)
    - [x] `components/search/search-results-view.tsx` (Сетка товаров)
    - [x] Убрать `bg-gray-50`, использовать `bg-background`
    - [x] Карточки товаров: `rounded-xl`, `border-border`, без лишних теней

- [x] **Listing Details (Страница товара) - ВАЖНО**
    - [x] `components/listing/listing-detail-view.tsx`
    - [x] Убрать градиенты `bg-linear-to-b`
    - [x] Убрать `backdrop-blur`
    - [x] Заменить `rounded-4xl`/`rounded-5xl` на `rounded-xl`
    - [x] `components/listing/image-gallery.tsx` (Стиль галереи)
    - [x] `components/listing/details/listing-sidebar.tsx` (Карточка продавца/цены)

- [x] **Create Listing (Подача объявления)**
    - [x] `app/[locale]/(main)/post/page.tsx` (или `create-ad`)
    - [x] Проверить стиль формы (Input, Select, Steps)

- [x] **Verification (Phase 2)**
    - [x] `npm run verify` поссле каждого этапа
    - [x] Visual Check (Dark Mode)

# Phase 3: User Profile & Dashboard (Private Pages)

- [x] **Sidebar Redesign (Part 3.1)**
    - [x] `components/features/dashboard/shared/sidebar.tsx`: Flatten menu structure (remove sections).
    - [x] Update `components/features/dashboard/user/user-dashboard-layout.tsx`.
    - [x] Update `components/features/dashboard/admin/admin-dashboard-layout.tsx`.

- [x] **Dashboard Overview (Part 4.1)**
    - [x] `components/features/dashboard/user/overview-view.tsx`: Fix StatCards (remove `font-mono`).

- [x] **My Listings Page (Part 4.2)**
    - [x] `components/features/dashboard/user/listings-view.tsx`: Fix Table Headers (uppercase, text-xs).

- [x] **Verification (Phase 3)**
    - [x] `npm run verify`
    - [x] Check Sidebar on Desktop/Mobile

# Phase 4: Dark Theme & Final Cleanup (Part 5 & 6)

- [x] **Global Dark Mode Check (Part 5)**
    - [x] Search & Replace hardcoded colors (`bg-white`, `border-white`, `text-black`).
    - [x] Fix `ListingCard` (remove gradients/blur).
    - [x] Fix `ListingDetailsGrid` (semantic tokens).
    - [x] Fix `StepImages`, `StepDetails`, `StepCategory`.
    - [x] Fix `MobileImageGallery`.

- [x] **Final Verification (Part 6)**
    - [x] `npm run verify` (FINAL)
    - [x] Check console for hydration errors.
    - [x] Verify Mobile Responsiveness (Search, Post Ad).

---

# Phase 5: Advanced Media Management (Investor Wow-Effect)

**Цель**: Внедрить профессиональную систему работы с изображениями, которая вызовет "Wow-эффект" у инвесторов.

- [ ] **Drag-and-Drop Uploader (Sleek UI)**
    - [ ] Реализовать красивую зону загрузки с использованием `framer-motion`.
    - [ ] Добавить визуальные подсказки при наведении файла (Hover states).
- [ ] **Live Previews & Micro-interactions**
    - [ ] Анимированные превью изображений (появление, удаление).
    - [ ] Индикаторы прогресса загрузки для каждого файла отдельно.
- [ ] **Image Optimization & Management**
    - [ ] Проверить/улучшить логику удаления из Supabase Storage при нажатии "X".
    - [ ] Реализовать сортировку (Drag-to-reorder) для выбора главного фото (Cover).
- [ ] **Responsive Media Performance**
    - [ ] Оптимизация загрузки через Next.js Image и blur-up плейсхолдеры.
