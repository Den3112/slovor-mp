# Plan: Performance Optimization (Audit Fixes)

**Problem:** Technical audit identified LCP issues (missing priority images) and hydration overhead in price displays.
**Created:** 2026-03-23 18:10

## Settings
- **Testing:** No
- **Logging:** Verbose
- **Docs:** No

## Tasks

### Phase 1: Image Optimization (LCP)
- [ ] **Task 1: Add priority to above-the-fold listings**
  - Modify `src/components/features/listing/ui/grid.tsx`
  - Pass a `priority` prop to the first 4 `ListingCard` components.
  - Update `src/components/features/listing/ui/card.tsx` to handle the `priority` prop in the `Image` component.
  - *Logging:* Log which index gets priority.

### Phase 2: Hydration Optimization
- [ ] **Task 2: Refactor PriceDisplay for better hydration**
  - Modify `src/components/ui/price-display.tsx`
  - Optimize the `mounted` check to minimize layout shift.
  - Use `useMemo` for formatting where possible.
  - *Logging:* Log currency conversion triggers.

### Phase 3: Cleanup
- [x] **Task 3: Final verification**
  - Run `npm run build` to ensure no regressions in standalone output.
  - Check console for hydration warnings.

## Commit Plan
- single commit at the end: `perf: apply audit-recommended optimizations for images and hydration`
