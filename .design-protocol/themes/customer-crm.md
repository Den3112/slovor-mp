---
description: Customer Support CRM Theme - Data Dense & Efficient
---

# Theme: Customer CRM (Data-Dense)

> **Source**: Generated via `ui-ux-pro-max-skill`
> **Base Style**: Data-Dense Dashboard
> **Mood**: Technical, Precise, Trustworthy, NO "Fluff"

## 🎨 Color Palette (Strict Implementation)

| Role | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| **Primary** | `#3B82F6` | `bg-blue-500` | Main Actions, Links, Active Tabs |
| **Secondary** | `#EFF6FF` | `bg-blue-50` | Table headers, active row background |
| **Surface** | `#FFFFFF` | `bg-white` | Cards, Sidebar (Clean white) |
| **Border** | `#E2E8F0` | `border-slate-200` | Crisp dividers (1px) |
| **Text** | `#0F172A` | `text-slate-900` | Heavy contrast headings |
| **Muted** | `#64748B` | `text-slate-500` | Meta data, labels |

## 🚫 forbidden Styles (The "Anti-Glass" Rule)
- **NO** mesh gradients.
- **NO** heavy blurring (`backdrop-blur-2xl`).
- **NO** transparent cards. Cards must be solid white.
- **NO** decorative glows.

## 📐 Layout Rules

1.  **Sidebar**:
    - **Width**: `w-64` (Standard default).
    - **Color**: Dark (`bg-slate-900`) for Admin, Light (`bg-white` border-r) for Dashboard.
    - **Spacing**: Compact items. `py-2` `px-3`.

2.  **Cards**:
    - **Bg**: White (`bg-white`).
    - **Border**: `border border-slate-200`.
    - **Shadow**: `shadow-sm` (Light) -> `shadow-md` (Hover).
    - **Radius**: `rounded-xl`.

3.  **Data Tables**:
    - **Header**: `bg-slate-50` text-xs uppercase font-medium text-slate-500.
    - **Rows**: White bg, border-b border-slate-100. Hover: `bg-blue-50/50`.
