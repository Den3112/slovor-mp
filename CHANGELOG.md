# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-22

### Architecture & Infrastructure Upgrade
- **Node.js**: Upgraded to 22.13.1 LTS.
- **Framework**: Upgraded to Next.js 15.1.5 (App Router).
- **Library**: Upgraded to React 19.0.0.
- **Docker**: Optimized `Dockerfile` and `Dockerfile.dev` for Node 22 and faster builds.
- **Environment**: Added `.nvmrc` and updated project configurations (`tsconfig.json`, `package.json`).

### Refactoring & Code Quality
- **Component Architecture**:
  - Massive reorganization of `components/listing` into modular subfolders (`details`, `card`, `filters`, `form`, `view`).
  - Consolidated shared components and types.
  - Eliminated legacy/duplicated layout components.
- **File Naming**: Standardized all project files to `kebab-case` according to the new convention.
- **Localization**: Consolidated category helpers into a unified `lib/utils/category-i18n.ts` and `getCategoryIcon`.
- **API Consolidation**: Refactored API client modules to be more consistent and grouped by resource.

### Testing
- **Vitest**: Migrated from legacy Jest-based setup to Vitest for faster testing.
- **Coverage**: Significantly increased unit test coverage for components:
  - Auth components (`AuthForm`, `AuthSocial`).
  - Listing components (`Filters`, `ImageGallery`, `PriceDisplay`).
  - Listing creation steps (`Category`, `Details`, `Images`).
- **E2E**: Added Playwright E2E tests for core user journeys (Auth, Listing Lifecycle, Search).

### Fixed
- **SSR Hydration**: Fixed hydration errors in listing detail and profile pages.
- **Category Icons**: Resolved missing icons for several subcategories.
- **TypeScript**: Fixed strict type errors across the entire codebase.

## [1.0.0-beta] - 2026-01-12

### Fixed
- **Tests**: Resolved 4 failing tests in `create-listing-form.test.tsx`:
  - Added mocks for `next/navigation` (`useRouter`, `useSearchParams`, `useParams`).
  - Mocked `SupabaseClient` authentication state.
  - Added missing translation keys (`filters.new`, `filters.used`).
  - Fixed multiple element match errors using `getAllByText`.
- **ESLint**: Fixed all ESLint warnings (0 warnings remaining):
  - Refactored `process.env` access to use safe `env` utility in 15+ files.
  - Fixed `any` type usage in API routes catch blocks.
  - Fixed `async` handlers in `health/route.ts`.
  - Fixed dependencies in `InboxLayout` hooks.
- **Utils**: Fixed encoding issues in `utils.test.ts`.

### Added
- **Verification**: Added `npm run verify` command description to `README.md`.
- **Scripts**: Ensured `type-check` script exists in `package.json`.

### Verified
- **Manual Check**: Verified Home Page, Create Listing Flow (with Auth redirect), and Profile Overview.
- **Build**: Validated production build (`npm run build`) and type check (`npm run type-check`).
