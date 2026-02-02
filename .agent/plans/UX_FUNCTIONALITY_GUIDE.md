# 🧠 UX PATTERNS & FUNCTIONALITY GUIDE

> **Дополнение к ARCHITECTURE_BLUEPRINT.md**
> Все паттерны интуитивного UX и полного функционала

---

## 🎯 ПРИНЦИПЫ UX

### 1. Закон Фиттса
- Кнопки действий = минимум 44x44px на мобильных
- Важные действия = ближе к краям экрана (легче достать)
- Primary actions = крупнее, заметнее

### 2. Закон Хика
- Максимум 7±2 пунктов в меню
- Прогрессивное раскрытие (show more on demand)
- Дефолтные значения везде где возможно

### 3. Закон Миллера
- Группировка элементов по 3-4
- Визуальные разделители между группами
- Chunking контента

---

## 📋 ПОЛНЫЙ ФУНКЦИОНАЛ ПО СТРАНИЦАМ

### HOMEPAGE (`/`)

**Функционал:**
- [ ] Поиск с автокомплитом (debounce 300ms)
- [ ] Популярные запросы (показать при фокусе)
- [ ] Геолокация (предложить использовать)
- [ ] Категории с иконками и count
- [ ] Featured listings (автоматическая ротация)
- [ ] Недавно просмотренные (localStorage)
- [ ] Персонализированные рекомендации (если авторизован)

**UX паттерны:**
```
┌─────────────────────────────────────────────────────────────────┐
│ SEARCH AUTOCOMPLETE                                             │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 🔍 iphone                                              [X]  ││
│ └─────────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 📱 iPhone 15 Pro                           in Electronics   ││
│ │ 📱 iPhone 14                               in Electronics   ││
│ │ 📱 iPhone cases                            in Accessories   ││
│ │ ─────────────────────────────────────────────────────────── ││
│ │ 🕐 Recent: macbook, airpods                                 ││
│ │ 🔥 Popular: car, apartment, bike                            ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

### SEARCH (`/search`)

**Функционал:**
- [ ] Фильтры: категория, цена, локация, состояние
- [ ] Сортировка: новые, цена↑, цена↓, популярные
- [ ] Сохранение поиска (кнопка "Save search")
- [ ] Уведомления о новых объявлениях
- [ ] Переключение вида: grid/list
- [ ] Бесконечная прокрутка ИЛИ пагинация
- [ ] Количество результатов
- [ ] "No results" с предложениями
- [ ] Сброс всех фильтров

**UX паттерны:**
```
/* URL STRUCTURE */
/search?q=iphone&category=electronics&price_min=100&price_max=500&location=bratislava&sort=newest

/* SKELETON LOADING */
- Показывать 8 skeleton cards при загрузке
- Плавный fade-in результатов
- Disable кнопок во время загрузки

/* EMPTY STATE */
┌─────────────────────────────────────────────────────────────────┐
│                        ┌───────────┐                            │
│                        │  🔍 ❌    │                            │
│                        └───────────┘                            │
│              No results for "asdfasdf"                          │
│                                                                 │
│              Try:                                               │
│              • Check your spelling                              │
│              • Use more general terms                           │
│              • Clear some filters                               │
│                                                                 │
│              [Clear Filters]  [Browse All]                      │
└─────────────────────────────────────────────────────────────────┘
```

---

### LISTING DETAIL (`/listings/[id]`)

**Функционал:**
- [ ] Галерея изображений (swipe + zoom)
- [ ] Fullscreen gallery на клик
- [ ] Цена + валюта
- [ ] Кнопка "Message Seller" (→ чат)
- [ ] Кнопка "Save" (избранное)
- [ ] Кнопка "Share" (native share API / копировать ссылку)
- [ ] Кнопка "Report" (модалка)
- [ ] Информация о продавце (аватар, рейтинг, дата регистрации)
- [ ] Ссылка на профиль продавца
- [ ] Похожие товары (по категории)
- [ ] "Recently viewed" секция
- [ ] Breadcrumbs навигация
- [ ] Статус объявления (если owner)
- [ ] Edit/Delete (если owner)
- [ ] Promote button (если owner)

**UX паттерны:**
```
/* IMAGE GALLERY - Desktop */
- Thumbnail strip под main image
- Click = показать large
- Arrow keys навигация
- Zoom on hover

/* IMAGE GALLERY - Mobile */
- Full-width swipe gallery
- Dots indicator внизу
- Pinch to zoom
- Double tap = zoom
- Swipe down = close fullscreen

/* STICKY ACTIONS - Mobile */
┌─────────────────────────────────────────────────────────────────┐
│ €899                               [❤️] [Message Seller]        │
└─────────────────────────────────────────────────────────────────┘
(Sticky bottom bar при скролле)

/* SHARE OPTIONS */
┌─────────────────────────────────────────────────────────────────┐
│ Share this listing                                              │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ [📋 Copy Link] [📧 Email] [💬 WhatsApp] [📘 Facebook]     │  │
│ └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

### CREATE LISTING (`/post`)

**Функционал:**
- [ ] Multi-step form (4 шага)
- [ ] Валидация на каждом шаге
- [ ] Drag-and-drop images
- [ ] Image reorder (drag)
- [ ] Image crop/rotate
- [ ] Auto-save draft (localStorage)
- [ ] Preview before submit
- [ ] Location picker (map/autocomplete)
- [ ] Category-specific fields
- [ ] Price suggestions (based on similar)
- [ ] Terms acceptance
- [ ] Success confirmation

**UX паттерны:**
```
/* STEP INDICATOR */
┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐
│ ✓  │────│ 2  │─ ─ ─│  3  │─ ─ ─│  4  │
│Done│     │Now │     │     │     │     │
└─────┘     └─────┘     └─────┘     └─────┘

/* IMAGE UPLOAD */
- Показывать progress bar
- Thumbnail preview сразу
- "Set as cover" на первом фото
- Max 10 photos, 5MB each
- Форматы: JPG, PNG, WebP

/* VALIDATION */
- Inline errors под полями
- Red border на ошибках
- Shake animation при submit с ошибками
- Focus на первое поле с ошибкой

/* AUTO-SAVE */
- "Draft saved" toast каждые 30 сек
- "Resume draft?" при повторном входе
- Clear draft после успешного submit

/* SUCCESS */
┌─────────────────────────────────────────────────────────────────┐
│                        ┌───────────┐                            │
│                        │    ✅     │                            │
│                        └───────────┘                            │
│              Your listing is live!                              │
│                                                                 │
│              [View Listing]  [Create Another]                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### MESSAGES (`/messages`)

**Функционал:**
- [ ] Real-time updates (Supabase realtime)
- [ ] Unread indicator (badge)
- [ ] Typing indicator
- [ ] Read receipts (✓✓)
- [ ] Search conversations
- [ ] Block/Report user
- [ ] Delete conversation
- [ ] Attach images
- [ ] Link to listing in chat
- [ ] Quick replies (templates)
- [ ] Push notifications
- [ ] Sound notifications (on/off)

**UX паттерны:**
```
/* CONVERSATION LIST */
- Avatar + name + last message preview
- Unread = bold + dot indicator
- Time: "2m", "1h", "Yesterday", "Jan 15"
- Swipe left = delete (mobile)

/* CHAT VIEW */
- Messages grouped by date
- "Today", "Yesterday", "January 15"
- Bubble tails для направления
- Long press = copy/delete/reply
- Pull to refresh (load older)

/* TYPING INDICATOR */
┌────────────────────┐
│ John is typing...  │
│ • • •              │
└────────────────────┘

/* EMPTY CONVERSATION */
┌─────────────────────────────────────────────────────────────────┐
│                        ┌───────────┐                            │
│                        │    💬     │                            │
│                        └───────────┘                            │
│              Start the conversation!                            │
│                                                                 │
│ Quick replies:                                                  │
│ [Is this still available?] [What's your best price?]           │
└─────────────────────────────────────────────────────────────────┘
```

---

### DASHBOARD (`/dashboard`)

**Функционал:**
- [ ] Stats overview (listings, views, favorites, messages)
- [ ] Trend indicators (+12% this week)
- [ ] Performance chart (views over time)
- [ ] Quick actions (create, promote, settings)
- [ ] Activity feed (real-time)
- [ ] Recent listings table
- [ ] Unread messages count
- [ ] Pending verifications alert
- [ ] Tips/suggestions cards

**UX паттерны:**
```
/* WELCOME BACK */
┌─────────────────────────────────────────────────────────────────┐
│ Good morning, John! 👋                                          │
│ You have 3 new messages and 2 listings pending review.          │
└─────────────────────────────────────────────────────────────────┘

/* EMPTY DASHBOARD */
(Если нет объявлений)
┌─────────────────────────────────────────────────────────────────┐
│              Get started with your first listing!               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 1. Take great photos 📷                                     ││
│  │ 2. Write a detailed description ✍️                          ││
│  │ 3. Set a fair price 💰                                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                    [Create Your First Listing]                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### MY LISTINGS (`/dashboard/listings`)

**Функционал:**
- [ ] Table view с columns
- [ ] Status filter (all, active, pending, sold, expired)
- [ ] Bulk actions (delete, deactivate)
- [ ] Search listings
- [ ] Sort by date, views, price
- [ ] Quick edit (inline)
- [ ] Duplicate listing
- [ ] Mark as sold
- [ ] Renew/boost listing
- [ ] View stats per listing
- [ ] Delete confirmation

**UX паттерны:**
```
/* TABLE COLUMNS */
| Image | Title | Price | Status | Views | Actions |

/* STATUS BADGES */
[Active] = green
[Pending] = yellow
[Sold] = gray
[Expired] = red

/* ROW ACTIONS */
[Edit] [Promote] [•••]
              └─ View
                 Duplicate
                 Mark as Sold
                 ───────────
                 Delete

/* BULK ACTIONS */
[x] Select all | 3 selected | [Delete] [Deactivate]
```

---

### ORDERS (`/dashboard/orders`)

**Функционал:**
- [ ] Tabs: Purchases / Sales
- [ ] Order status tracking
- [ ] Order details modal
- [ ] Contact buyer/seller
- [ ] Leave review (после завершения)
- [ ] Order history
- [ ] Filter by status
- [ ] Search orders

**UX паттерны:**
```
/* ORDER CARD */
┌─────────────────────────────────────────────────────────────────┐
│ Order #12345                                      Jan 15, 2026  │
│ ┌────┐                                                          │
│ │ 📷 │  iPhone 15 Pro                                          │
│ └────┘  €899                                                    │
│                                                                 │
│ Status: 🟢 Completed                                            │
│ Buyer: John Doe                                                 │
│                                                                 │
│ [View Details]  [Contact Buyer]  [Leave Review]                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### REVIEWS (`/dashboard/reviews`)

**Функционал:**
- [ ] Tabs: Received / Given
- [ ] Overall rating summary
- [ ] Rating breakdown (5,4,3,2,1 stars)
- [ ] Reply to reviews
- [ ] Report review
- [ ] Sort by date, rating

**UX паттерны:**
```
/* RATING SUMMARY */
┌─────────────────────────────────────────────────────────────────┐
│  ⭐ 4.8 out of 5                                                │
│  Based on 23 reviews                                            │
│                                                                 │
│  5 ⭐ ████████████████████ 18                                   │
│  4 ⭐ ████████ 4                                                │
│  3 ⭐ ██ 1                                                      │
│  2 ⭐ 0                                                         │
│  1 ⭐ 0                                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### WALLET (`/dashboard/wallet`)

**Функционал:**
- [ ] Balance display
- [ ] Transaction history
- [ ] Add funds
- [ ] Withdraw
- [ ] Payment methods
- [ ] Invoices/receipts
- [ ] Spending on promotions

---

### FAVORITES (`/favorites`)

**Функционал:**
- [ ] Grid of saved listings
- [ ] Remove from favorites (one click)
- [ ] Sort: date added, price
- [ ] Share collection (optional)
- [ ] "Price dropped" indicator
- [ ] "Sold" indicator (strikethrough)
- [ ] Empty state с CTA

---

### SETTINGS (`/dashboard/settings`)

**Tabs:**
1. **Profile** - name, avatar, bio, contact
2. **Security** - password, 2FA, sessions
3. **Notifications** - email, push preferences
4. **Verification** - ID, phone, email status

**UX паттерны:**
```
/* 2FA SETUP */
┌─────────────────────────────────────────────────────────────────┐
│ Two-Factor Authentication                                       │
│                                                                 │
│ Add an extra layer of security                                  │
│                                                                 │
│ [Enable 2FA]                                                    │
└─────────────────────────────────────────────────────────────────┘

/* VERIFICATION STATUS */
┌─────────────────────────────────────────────────────────────────┐
│ Verification Status                                             │
│                                                                 │
│ ✅ Email verified                                               │
│ ✅ Phone verified                                               │
│ ⏳ ID verification pending                                      │
│                                                                 │
│ [Upload ID Document]                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

### AUTH PAGES (`/auth/*`)

**Login:**
- [ ] Email/password
- [ ] Social login (Google, Facebook)
- [ ] "Remember me" checkbox
- [ ] Forgot password link
- [ ] Register link

**Register:**
- [ ] Name, email, password
- [ ] Password strength meter
- [ ] Terms checkbox
- [ ] Email verification flow
- [ ] Welcome onboarding after

**UX паттерны:**
```
/* PASSWORD STRENGTH */
Weak   [█░░░░░░░░░]
Fair   [████░░░░░░]
Good   [███████░░░]
Strong [██████████]

/* SOCIAL LOGIN */
┌─────────────────────────────────────────────────────────────────┐
│ [🔵 Continue with Google]                                       │
│ [🔵 Continue with Facebook]                                     │
│                                                                 │
│ ─────────────── or ───────────────                              │
│                                                                 │
│ Email                                                           │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ your@email.com                                              ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔔 NOTIFICATIONS & FEEDBACK

### Toast Notifications
```typescript
// Success
toast.success("Listing published successfully!")

// Error
toast.error("Something went wrong. Please try again.")

// Info
toast.info("Your draft has been saved.")

// Warning
toast.warning("This action cannot be undone.")

// Loading
toast.loading("Publishing your listing...")
```

### Loading States
```
| Context             | Type                |
|---------------------|---------------------|
| Page load           | Full page skeleton  |
| List load           | Card skeletons (8)  |
| Button action       | Spinner in button   |
| Form submit         | Disabled + spinner  |
| Image upload        | Progress bar        |
| Infinite scroll     | Bottom spinner      |
```

### Error States
```
| Error Type          | Action                          |
|---------------------|---------------------------------|
| 404 Not Found       | "Go Home" button                |
| 401 Unauthorized    | Redirect to login               |
| 403 Forbidden       | "Contact Support"               |
| 500 Server Error    | "Try Again" + "Report Issue"    |
| Network Error       | "Check connection" + Retry      |
| Validation Error    | Inline field errors             |
```

### Empty States
```
| Page             | Message                    | CTA              |
|------------------|----------------------------|------------------|
| Favorites        | "No saved items yet"       | Browse Listings  |
| Messages         | "No conversations yet"     | Start Browsing   |
| My Listings      | "No listings yet"          | Create Listing   |
| Search Results   | "No results found"         | Clear Filters    |
| Orders           | "No orders yet"            | Start Shopping   |
```

---

## ♿ ACCESSIBILITY

### Keyboard Navigation
- [ ] Tab order логичный
- [ ] Focus visible на всех элементах
- [ ] Escape закрывает modals/drawers
- [ ] Enter = submit forms
- [ ] Arrow keys = gallery navigation

### Screen Readers
- [ ] Alt text на всех images
- [ ] ARIA labels на buttons
- [ ] Role attributes на interactive elements
- [ ] Live regions для динамического контента

### Colors
- [ ] Contrast ratio минимум 4.5:1
- [ ] Не только цветом передавать информацию (+ icons/text)
- [ ] Dark mode протестирован

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

| Element          | Mobile        | Tablet        | Desktop       |
|------------------|---------------|---------------|---------------|
| Grid columns     | 2             | 3             | 4             |
| Sidebar          | Drawer        | Collapsed     | Full width    |
| Search           | Под header    | В header      | В header      |
| Navigation       | Bottom tabs   | Tab bar       | Header nav    |
| Images           | 16:9          | 4:3           | 4:3           |

---

## 🚀 PERFORMANCE

### Loading
- [ ] Lazy load images
- [ ] Skeleton loaders
- [ ] Suspense boundaries
- [ ] Route prefetching
- [ ] Code splitting

### Caching
- [ ] Static pages cached
- [ ] API responses cached
- [ ] Images in CDN
- [ ] Service worker (optional)

---

**END OF UX GUIDE**
