# Implementation Plan — Interface & CI Fix

The goal is to fix the "interface" (the application's UI) by resolving a critical data fetching error and missing assets, while also cleaning up all linting/CI warnings.

## Proposed Changes

### [APP INTERFACE (UI)]
Resolving issues that prevent the UI from displaying correctly.

#### [MODIFY] [use-listings-search.ts](file:///home/creator/PROJECTS/slovor-mp/src/entities/listing/hooks/use-listings-search.ts)
- Update the Supabase `select` query to match the actual database schema:
    - Change `listings_images(*)` to `images` (which is a column in the `listings` table).
    - Change `profiles(first_name, last_name, ...)` to `profiles(display_name, ...)` as `first_name`/`last_name` do not exist.

#### [NEW] [Icons]
- Ensure `/public/icons/icon-192x192.png` and other manifest icons exist to resolve 404/broken manifest errors.

### [LINTING & LOGIC]
Cleaning up warnings and potential hydration/render loop issues.

#### [MODIFY] [use-chat.test.tsx](file:///home/creator/PROJECTS/slovor-mp/src/entities/chat/hooks/__tests__/use-chat.test.tsx)
- Add `displayName` or use a named function for the `Wrapper` component.

#### [MODIFY] [UI Providers & Components]
- Fix `react-hooks/set-state-in-effect` warnings in:
    - `src/app/providers/currency-provider.tsx`
    - `src/widgets/header/ui/header.tsx`
    - `src/features/search/ui/filters.tsx`
    - etc. (Using conditional logic to avoid redundant `setState` calls during the render/effect cycle).

## Open Questions
- Should I generate placeholder icons for the broken manifest, or do you have specific assets? (I will generate standard placeholders if not provided).

## Verification Plan
### Manual Verification
- Open `http://localhost:3000` in the browser.
- Verify "Featured Listings" display real data without 400 errors.
- Check browser console for 404s or manifest errors.

### Automated Checks
- `npm run lint`
- `npm run type-check`
- `npm run verify`
