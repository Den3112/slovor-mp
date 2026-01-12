# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-12

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
