# 🚀 Slovor Marketplace — Roadmap

## 📊 Project Status Overview

| Stage | Status | Description |
|-------|--------|-------------|
| Stage 1 | ✅ Complete | Core MVP (Listings, Categories, Auth) |
| Stage 2 | ✅ Complete | Trust & Communication (Reviews, Reports, Messages) |
| Stage 3 | ✅ Complete | Analytics & Quality Signals |
| Stage 4 | ✅ Complete | Search & Discovery |
| Stage 5 | ⏳ Next | User Dashboard & Buying Logic |
| Stage 6 | 📋 Planned | Advanced Media Management |
| Stage 7 | 📋 Planned | Monetization & Promotions |

---

## ✅ Stage 1: Core MVP (COMPLETE)
- [x] Next.js 15 + TypeScript setup
- [x] Supabase integration (Auth, Database, RLS)
- [x] Listings CRUD with categories
- [x] User authentication (Email, OAuth)
- [x] Responsive UI with Tailwind CSS
- [x] i18n support (EN/UK/RU)
- [x] Homepage with featured listings

---

## ✅ Stage 2: Trust & Communication (COMPLETE)
- [x] **Reviews System**: Seller ratings with 5-star reviews
- [x] **Reports API**: User reporting for listings
- [x] **Messaging**: Real-time buyer-seller chat
- [x] **Seller Profiles**: `/seller/[id]` with active listings

---

## ✅ Stage 3: Analytics & Quality Signals (COMPLETE)
- [x] Centralized analytics (`lib/utils/analytics.ts`)
- [x] Contact click tracking (`contact_clicks` column)
- [x] Listing view tracking
- [x] Quality signals for ranking

---

## ✅ Stage 4: Search & Discovery (COMPLETE)
- [x] Dedicated `/search` page with responsive layout
- [x] **Price Range Filter**: Slider + manual input
- [x] **Condition Filter**: New / Used checkboxes
- [x] **Location Filter**: Text search
- [x] **Sorting**: Newest, Price (Low→High, High→Low), Popular
- [x] **Pagination**: Full pagination with page numbers
- [x] **Mobile Drawer**: Filter sheet for mobile devices
- [x] **URL State**: Shareable/bookmarkable search URLs

---

## ⏳ Stage 5: User Dashboard & Buying Logic (NEXT)
> **Goal**: Complete user control center for managing listings and favorites

### 5.1 My Listings Dashboard
- [ ] `/dashboard` page with listing management
- [ ] Active / Draft / Sold / Archived tabs
- [ ] View counters per listing
- [ ] Quick edit (inline price/description)
- [ ] Delete with confirmation

### 5.2 Favorites System
- [ ] Heart button on listing cards
- [ ] `/favorites` page with saved listings
- [ ] Persist favorites in Supabase (user_favorites table)

### 5.3 Profile Settings
- [ ] `/settings` page
- [ ] Update display name, avatar, phone
- [ ] Notification preferences

---

## 📋 Stage 6: Advanced Media Management (PLANNED)
> **Goal**: Production-grade image uploads with Supabase Storage

- [ ] Drag-and-drop uploader with `framer-motion`
- [ ] Live image previews with progress bars
- [ ] Supabase Storage integration (upload/resize/delete)
- [ ] Responsive images with blur-up placeholders
- [ ] Multi-image support per listing (3+ images)

---

## 📋 Stage 7: Monetization & Promotions (PLANNED)
> **Goal**: Revenue generation features

- [ ] "Boost" listing feature (paid promotion)
- [ ] Featured listings rotation
- [ ] Premium seller badges
- [ ] Payment integration (Stripe/LiqPay)

---

## 🛠️ Developer Experience Improvements (Ongoing)
- [x] Pre-commit hooks (Husky)
- [x] `npm run verify` — Full Vercel build check locally
- [x] Automated lint + type-check on every commit
- [ ] GitHub Actions CI/CD pipeline
- [ ] E2E tests with Playwright

---

## 📅 Execution Priority

```
Current Focus: Stage 5 — User Dashboard
├── 5.1 My Listings Dashboard
├── 5.2 Favorites System
└── 5.3 Profile Settings
```

---

*Last Updated: 2026-01-04*
