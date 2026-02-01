# Design Protocol Manifest

> **STATUS**: ACTIVE
> **THEME**: Customer CRM (Data-Dense / Pro Max)

This directory contains the **Single Source of Truth** for all design decisions in Slovor MP.

## 📂 Structure

- **`core/`**: Immutable rules that apply to all themes.
  - [`global-constraints.md`](./core/global-constraints.md): "Do's and Don'ts" (e.g., No Emojis).
  - [`ui-ux-pro-max.md`](./core/ui-ux-pro-max.md): The intelligence engine (palettes, psychology, physics).

- **`themes/`**: Visual personalities.
  - [`avant-garde.md`](./themes/avant-garde.md): **CURRENT ACTIVE THEME**. Intentional minimalism, grid tension, high aesthetics.

## 🤖 Bot Instructions

When asked to implement or modify UI:

1.  **Check Constraints**: Read `core/global-constraints.md` first. Violating these is a critical failure.
2.  **Apply Theme**: Read `themes/avant-garde.md` for styling logic (spacing, typography, border-radius).
3.  **Consult Intelligence**: Use `core/ui-ux-pro-max.md` for deep reasoning on colors or component patterns if the theme doesn't specify them.

## 🎨 Theme Switching

To switch themes, update the "THEME" status above and point agents to a different file in `themes/`.
