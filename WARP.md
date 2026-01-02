# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 1. Repository & documentation overview

- **Project:** Slovor Marketplace — premium Slovak classifieds marketplace.
- **Stack:** Next.js App Router (15+), React, TypeScript (strict), Tailwind CSS, Supabase (Postgres, Auth, Storage), Radix UI, Framer Motion.
- **Primary docs:**
  - Canonical long-form docs live in the **`docs` branch** (architecture, principles, development guides).
  - `.github/AI_GUIDE.md` — mandatory AI behavior, branching rules, and coding principles.
  - `.github/PROJECT_STATUS.md` — current functional status and prioritized roadmap.
  - Local docs snapshot under `docs/` (e.g. `documentation-summary.md`, `TESTING.md`, `TESTING_CHECKLIST.md`) summarizes the above and testing strategy.

When in doubt about architecture, constraints, or priorities, first check `.github/AI_GUIDE.md` and `.github/PROJECT_STATUS.md`, then the `docs` branch or `docs/` folder for details.

## 2. Branching, docs, and workflow rules

These rules come from `.github/AI_GUIDE.md` and repository docs and should be treated as project policy for AI assistants:

- **Branches:**
  - **`main`** — production, clean history.
  - **`dev`** — active development.
  - **`docs`** — documentation only (read-only reference for AI; do not modify from Warp).
- **Branch usage:**
  - Work on `dev` by default: pull latest changes before edits.
  - Do **not** create additional long-lived branches from Warp (align with AI guide; humans may still use feature branches if the maintainer chooses).
  - Releases flow `dev → main` via squash merge; Vercel deploys from `main`.
- **Documentation placement:**
  - Canonical docs (PRINCIPLES, ARCHITECTURE, DEVELOPMENT, ROADMAP, etc.) live in the `docs` branch.
  - In `main`/`dev`, only short docs plus AI metadata are expected: `README.md`, `.github/AI_GUIDE.md`, `.github/PROJECT_STATUS.md`, and this `WARP.md`.

## 3. Core commands

### 3.1 Setup & environment

From `README.md` and docs:

- Clone and switch to development branch:
  - `git clone https://github.com/Den3112/slovor-mp.git`
  - `cd slovor-mp`
  - `git checkout dev`
- Install dependencies:
  - `npm install`
- Configure environment:
  - Copy template: `cp .env.example .env.local` (or create `.env.local` manually using `.env.example`).
  - Fill in Supabase credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.).
- Initialize local database data (optional but recommended for realistic data):
  - **Inspect scripts in `scripts/` before running in case project state changed.**
  - `npm run db:info` — print database connection info / sanity checks.
  - `npm run db:clear` — clear existing listings data.
  - `npm run db:seed` — seed categories/listings with realistic data.
  - `npm run db:reset` — clear + seed (see script for exact behavior).
  - `npm run db:full-reset` — full reset flow (currently runs category fixes + seed).

Supabase schema migrations are stored under `supabase/migrations/`. Any schema changes should be reflected there.

### 3.2 Local development

- Start dev server (Next.js App Router):
  - `npm run dev`
  - Default port is `3000` → http://localhost:3000

### 3.3 Build & production run

- Type-safe production build (must pass before merging to `main`):
  - `npm run build`
- Run the built app locally:
  - `npm start` (alias for `next start` after a successful build).

### 3.4 Linting, formatting, and types

From `package.json` and `.github/AI_GUIDE.md`:

- ESLint:
  - `npm run lint` — run Next/ESLint rules.
  - `npm run lint:fix` — attempt auto-fix.
- TypeScript:
  - `npm run type-check` — `tsc --noEmit` with strict settings.
- Prettier:
  - `npm run format` — format the repo.
  - `npm run format:check` — check formatting only.

### 3.5 Unit & component tests (Vitest)

Configured via `vitest.config.ts` with alias `@` → repo root and `jsdom` environment.

- Run all tests in watch/dev mode:
  - `npm test`
- Run the full suite once (as in CI):
  - `npm run test:run`
- Run tests with coverage report:
  - `npm run test:coverage`

**Run a single unit test file** (pattern from `docs/TESTING.md`):

- Using the npm script:
  - `npm run test -- __tests__/components/header.test.tsx`
- Or directly via Vitest (if installed globally or via `npx`):
  - `npx vitest __tests__/components/header.test.tsx`

Test locations (non-exhaustive):

- `__tests__/components/*` — component tests (e.g. header, listing card, create listing form).
- `__tests__/lib/*` — utilities and env/i18n tests.
- `lib/api/__tests__/api.test.ts` — API layer tests.

### 3.6 E2E tests (Playwright)

From `docs/TESTING.md` and `e2e/` directory:

- One-time Playwright browser setup (if needed):
  - `npx playwright install`
- Run all E2E tests:
  - `npx playwright test`
- Run in UI mode:
  - `npx playwright test --ui`
- Run a single spec file:
  - `npx playwright test e2e/critical-flows.spec.ts`
- Run headed (visible browser):
  - `npx playwright test --headed`

E2E specs live under `e2e/` (e.g. `critical-flows.spec.ts`, `dashboard.spec.ts`). They assume the dev server is running and `.env.local` is configured.

## 4. High-level architecture

### 4.1 Routing & pages (`app/`)

The project uses Next.js App Router with server components by default and selective client components for interactive parts.

Key routes (not exhaustive):

- `app/layout.tsx` — root layout: wraps pages with global `<html>`, `<body>`, header/footer, theming, and providers (auth, i18n, etc.).
- `app/globals.css` — global Tailwind/CSS styles.
- `app/page.tsx` — home page server component.
  - Fetches categories via `categoriesApi.getAll()` (through `lib/supabase/queries` → `lib/api/categories`).
  - Renders `<HomeView>` (client) with `<FeaturedListings>` as children.
- `app/listings/page.tsx` — all listings page.
  - Accepts `searchParams` (Next 15 style: awaited Promise).
  - Calls `listingsApi.getAll()` with filters (search, category, price range, condition, location, sort) and revalidates via ISR.
- `app/listings/[id]/page.tsx` — listing detail view (uses `listingsApi.getById`).
- `app/categories/page.tsx` and `app/categories/[slug]/page.tsx` — category browsing.
- `app/post/page.tsx` — create-listing flow (multi-step form and image uploads). Uses listing + storage APIs and auth context.
- `app/auth/login/page.tsx`, `app/auth/register/page.tsx` — Supabase auth UI.
- `app/profile/page.tsx` — user profile.
- `app/dashboard/...` — dashboard area:
  - `app/dashboard/page.tsx` — main dashboard overview.
  - `app/dashboard/listings/page.tsx` — manage user listings (CRUD, filters, search).
  - `app/dashboard/favorites/page.tsx` — saved listings.
  - `app/dashboard/settings/page.tsx` — account/settings.
- Informational/static routes: `app/about/page.tsx`, `app/contact/page.tsx`, `app/faq/page.tsx`, `app/terms/page.tsx`, `app/privacy/page.tsx`.
- `app/api/detect-locale/route.ts` — API route for locale detection.
- `app/not-found.tsx` — custom 404.

Most data-heavy routes remain **server components** that fetch from the API layer and pass plain data into client components for rendering.

### 4.2 Components (`components/`)

The component tree is organized by domain and by role:

- `components/home/*` — homepage sections:
  - `Hero`, `Features`, `HomeCategories`, `HomeView`, `HomeCTA`, `category-showcase` etc.
  - Implements the "avant-garde" landing page with animated hero, search entry points, and category discovery.
- `components/listing/*` — listing-centric UI:
  - `card.tsx`, `grid.tsx` — listing card & grid components.
  - `ListingDetailView.tsx` — detail view composition.
  - `create-listing-form.tsx` — multi-step listing creation form.
  - `filters.tsx`, `image-gallery.tsx`, `featured.tsx`, `ListingsView.tsx`, `view.tsx` — filtering, galleries, featured listings and full-page views.
- `components/category/*` — category browsing UI:
  - `CategoryView`, `CategoryIcon`, `Filters`, `Pagination`, `card.tsx`, `grid.tsx`, `selector.tsx`.
  - Handles category chips, grids, pagination, and filter controls.
- `components/layout/*` — global layout pieces:
  - `header.tsx` — top navigation with logo, main nav links, language switcher, auth actions.
  - `footer.tsx` — global footer.
  - `LanguageSwitcher.tsx` — SK/EN control.
- `components/ui/*` — design-system primitives built on Radix and Tailwind:
  - `button.tsx`, `card.tsx`, `badge.tsx`, `breadcrumbs.tsx`, `container.tsx`, `dialog.tsx`, `empty-state.tsx`, `error-boundary.tsx`, `error-state.tsx`, `pagination.tsx`, `search-bar.tsx`, `skeleton-loader.tsx`, etc.
  - `components/ui/button.tsx` uses `@radix-ui/react-slot` and `class-variance-authority` for variants.
  - **New UI should be composed from these primitives whenever possible**, rather than introducing competing patterns.
- `components/locale/*` — locale-specific components:
  - `LocaleDetector`, `LocaleWelcomeModal` — initial locale detection/welcome flows.
- `components/providers/auth-provider.tsx` — `useAuth` hook and auth context provider used across dashboard, header, and auth-guarded routes.
- `components/dashboard/*` — dashboard layout elements:
  - `sidebar.tsx`, `mobile-nav.tsx` for dashboard navigation shell.

**Design intent:** Per `.github/AI_GUIDE.md`, the UI should follow "intentional minimalism" and "avant-garde" layout principles, with strong visual hierarchy and minimal but purposeful ornamentation. Reuse and extend existing components instead of creating ad-hoc UI.

### 4.3 Domain & utility layer (`lib/`)

Key modules:

- `lib/api/` — central, typed API layer on top of Supabase:
  - `index.ts` — exports `categoriesApi`, `listingsApi`, `dashboardApi`, `storageApi` and associated types.
  - `categories.ts` — category queries (fetch all with listing counts; fetch by slug with aggregated count).
  - `listings.ts` — listings queries and mutations:
    - `getAll` with filters for category, search, price range, condition, location, featured flag, sorting, and pagination.
    - `getCount` for paginated counts.
    - `getById` reading a single listing and incrementing views.
    - `getFeatured`, `getByUser`, `create`, `update`, `delete` helpers.
  - `dashboard.ts` — dashboard statistics and recent-activity aggregation for a user.
  - `storage.ts` — storage-related helpers (e.g. for listing images; consult file for exact behavior when integrating uploads).
- `lib/supabase/` — low-level Supabase client + compatibility re-exports:
  - `client.ts` — creates a singleton Supabase client using `env.SUPABASE_URL` & `env.SUPABASE_ANON_KEY` with safe auth options.
  - `categories.ts`, `queries.ts` — legacy query wrappers; `queries.ts` now re-exports from `lib/api` to keep imports working.
  - **New code should depend on `lib/api` rather than using the raw client directly, unless specifically extending the data layer.**
- `lib/env.ts` — runtime environment variable loader/validator.
  - All env access in new code should go through this module (do not call `process.env` ad hoc in business logic).
- `lib/types/` and `lib/types.ts` — shared TypeScript types, including the typed Supabase schema and `ApiResponse` shape.
- `lib/utils.ts` and `lib/utils/*` — generic utilities and domain helpers:
  - Category helpers (`category-helpers.ts`, `category-i18n.ts`).
  - Listing localization utilities (`listing-i18n.ts`).
- `lib/constants/category-icons.ts` — mapping from category identifiers to icon components.
- `lib/config.ts`, `lib/flags.ts` — configuration flags and feature toggles.
- `lib/i18n.ts` and `lib/i18n/*` — internationalization system:
  - `server.ts`, `index.tsx`, `translations.ts` — SK/EN dictionaries and helpers; UI should use this instead of hard-coded strings when appropriate.

### 4.4 Data, migrations, and scripts

- `supabase/migrations/*.sql` — SQL migrations for the Supabase database (schema and localization changes).
- `scripts/*.js` — Node scripts for database operations and setup:
  - `db-info.js`, `clear-listings.js`, `seed-with-real-images.js`, `fix-categories.js`, `setup.js`, plus helpers for demo users.
  - Exposed via `npm run db:*` scripts where appropriate (see `package.json`).

Changes that affect persistence should usually go through a migration in `supabase/migrations/` and, if necessary, updated seeding scripts.

### 4.5 Testing layout

- Unit/component tests (Vitest):
  - `__tests__/components/*` — header, listing card, create listing form, etc.
  - `__tests__/lib/*` — env, translations, utilities.
  - `lib/api/__tests__/api.test.ts` — exercises the API layer.
- E2E (Playwright):
  - `e2e/critical-flows.spec.ts` — core user flows.
  - `e2e/dashboard.spec.ts` — dashboard behavior.
- Manual QA guidance:
  - `docs/TESTING_CHECKLIST.md` — detailed checklist for homepage, categories, listings, dashboard, and auth scenarios.

`docs/TESTING.md` describes the intended testing strategy and CI hooks (Vitest + Playwright) and uses an **80%+ coverage target** as a guideline.

## 5. Design & coding principles for Warp

Summarized from `.github/AI_GUIDE.md` and docs (PRINCIPLES, documentation-summary):

### 5.1 Behavioral expectations for AI assistants

- Act as a **senior frontend architect & avant-garde UI designer**.
- Default mode: minimal fluff, focused, code- and design-first outputs.
- When the user explicitly asks for deeper reasoning (e.g. similar to an "ULTRATHINK" mode), it is acceptable to produce a more thorough analysis — but keep that opt-in.

### 5.2 Core coding principles

The repository defines explicit principles; new code should respect them:

- **Minimize code** — prefer small, focused functions and components.
- **Minimize connections** — low coupling; prefer data passed via props over global state.
- **Single responsibility/owner** — one clear source of truth for each piece of data.
- **Explicit over magic** — avoid hidden side effects or "clever" abstractions.
- **Errors are part of design** — handle errors explicitly in UI and data layer.
- **Code for humans** — clarity and readability over brevity or tricks.
- **Minimal global state** — local state first; use context only where justified.
- **KISS** — prefer the simplest solution that satisfies requirements.

Additional repo-specific standards from docs:

- Strict TypeScript: avoid `any`, keep the codebase type-clean.
- Component architecture follows atomic/sectioned design; use existing domains (`home`, `listing`, `category`, `layout`, `ui`).
- Aim for high test coverage (≈80%+), especially for core flows (auth, listings, dashboard).
- Supabase access goes through the typed API layer.

### 5.3 UI and library usage

- **Library discipline:** If Radix or existing UI primitives cover a need (dialogs, buttons, inputs, etc.), build on top of those rather than rolling custom primitives.
- Favor **intentional minimalism** and bespoke layouts over generic/boilerplate templates.
- Maintain the existing visual language:
  - Tailwind utility patterns, gradients, glassmorphism accents, and balanced whitespace.
  - Motion via Framer Motion where appropriate (e.g., Hero, dashboard interactions), but not gratuitously.

When extending the UI, look for the closest existing component in `components/ui/`, `components/home/`, `components/listing/`, or `components/layout/` and extend it instead of introducing parallel design systems.

## 6. How future Warp sessions should operate here

- On startup:
  - Check `.github/AI_GUIDE.md` for any updated rules.
  - Check `.github/PROJECT_STATUS.md` to understand current feature priorities and what is already implemented.
- Before implementing a change:
  - Identify the relevant route under `app/` and associated components under `components/`.
  - Identify or add the corresponding functions in `lib/api/` instead of embedding data access in components.
  - Confirm whether tests already exist in `__tests__/` or `lib/api/__tests__` and extend/add as needed.
- Before proposing significant structural or design changes:
  - Revisit `docs/documentation-summary.md` and `docs/TESTING_CHECKLIST.md` to ensure you are not regressing key flows or visual principles.

This file should be updated when project conventions, tooling, or architecture change in ways that affect how Warp should operate in this repository.