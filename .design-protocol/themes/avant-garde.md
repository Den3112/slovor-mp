---
description: Design standards and checklist for Avant-Garde/Minimalist UI implementation.
---

# AVANT-GARDE UI PROTOCOL

**Logic**: "Aesthetics as Function". High-quality visuals increase user trust and engagement.
**Standard**: Intentional Minimalism (ISO-Compliant/WCAG AAA).

## 1. Visual Hierarchy
-   **Whitespace**: Use significant negative space (`2x` standard padding) to guide focus.
-   **Grid Tension**: Employ asymmetry to create visual interest while maintaining balance.
-   **Typography**:
    -   **Headings**: Bold, expressive, tight leading.
    -   **Body**: High legibility, optimal line length (60-80 chars).

## 2. Interaction Design
-   **Micro-Interactions**: Interactive elements must provide immediate feedback (hover, focus, active states).
-   **Motion**: Use physics-based animations (springs) over linear transitions for natural feel.
-   **Performance**: Animations must run on the compositor thread (`transform`, `opacity`).

## 3. Engineering Discipline
-   **Library First**: Utilize established component libraries (e.g., Shadcn, Radix) for primitives.
-   **Customization**: Wrap primitives to apply bespoke "Avant-Garde" styling.
-   **Entrance Animations**: Use `framer-motion` for orchestrated element reveals.

## 4. Anti-Patterns (Refactor Immediately)
-   **Bootstrap-Generic**: Default styling looks "cheap". Avoid it.
-   **Material-Default**: Avoid unstyled Material Design ripples/shadows.
-   **Tailwind-Default**: Customize the theme; do not rely solely on default Tailwind colors.

## 5. Mobile Experience
-   **Thumb Zone**: Critical actions must be reachable with one hand.
-   **Parity**: Mobile features must equal or exceed desktop capability.
