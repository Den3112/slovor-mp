# Global Design Constraints

> **CRITICAL**: These rules are INVIOLABLE. They apply to ALL themes and ALL pages.

## 1. Visual Integrity

### 🚫 No Emojis as Icons
- **Rule**: Never use emojis (🎨, 🚀, ⚙️) as UI icons.
- **Solution**: Use SVG icons from `lucide-react` or `heroicons`.
- **Reason**: Emojis look amateur and inconsistent across platforms.

### 🚫 No "Generic" Styles
- **Rule**: Avoid default Bootstrap, Material UI, or unstyled Tailwind colors.
- **Solution**: Use the project's defined `primary`, `secondary`, `accent` HSL variables.
- **Reason**: The app must look "Premium" and "Bespoke", not like a template.

## 2. Interaction & UX

### ✅ Cursor Pointer Mandatory
- **Rule**: All clickable elements (cards, list items, buttons) MUST have `cursor-pointer`.
- **Reason**: Explicit affordance is required for desktop users.

### ✅ Feedback Loop
- **Rule**: Every interaction must provide feedback.
  - Hover: Color shift or scale (smooth).
  - Focus: Visible ring (for a11y).
  - Active: Scale down (e.g., `active:scale-95`).
- **Timing**: Transitions must be 150-300ms. No instant changes.

## 3. Accessibility (A11y)

### ✅ Contrast Ratios
- **Rule**: Text must satisfy WCAG AA (4.5:1) at minimum.
- **Check**: Test light mode specifically, as it's often the weak point for contrast.

### ✅ Semantic HTML
- **Rule**: Use `<button>` for actions, `<a>` for navigation. Don't use `div` with `onClick` without role/tabindex.

## 4. Layout & Responsiveness

### ✅ Mobile Parity
- **Rule**: Mobile experience must be equal to or better than desktop.
- **Check**: No horizontal scrolling. Touch targets min 44px.

### ✅ Spacing
- **Rule**: Respect `safe-area-inset` for mobile navigations.
- **Rule**: Floating elements (toasts, navbars) must have padding from edges.
