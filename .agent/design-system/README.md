# 🎨 Design System Documentation

## Overview

Switchable theme system for Slovor MP.

**Current**: Customer Support CRM (Solid, Clean, Data-Dense)
**Priority**: Phase 9 (Not Urgent)

## Files

| File | Purpose |
|------|---------|
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | CSS variable architecture |
| [COMPONENT_STYLES.md](./COMPONENT_STYLES.md) | Component specifications |
| [THEME_SWITCHING.md](./THEME_SWITCHING.md) | How to implement themes |

## Goal

Make themes switchable by CSS class:

```html
<html class="theme-crm">     <!-- Current -->
<html class="theme-saas">    <!-- For Admin -->
<html class="theme-minimal"> <!-- Alternative -->
```

## Source

- **Repo**: github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Demo**: ui-ux-pro-max-skill.nextlevelbuilder.io/demo/customer-support-crm
