# 🎨 Design Tokens Architecture - Slovor Marketplace

> **SOURCE**: https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/customer-support-crm
> **LOGO**: `/public/slovor_logo_v5_clean_icon_only_1770249180559.png`
> **REQUIREMENT**: 1:1 копирование стилей + гармония с логотипом
> **LAST UPDATED**: 2026-02-05

---

## 🎯 LOGO COLOR ANALYSIS

Логотип Slovor использует **фиолетово-синий градиент**:

| Область логотипа | Цвет | Hex | Closest Tailwind |
|------------------|------|-----|------------------|
| **Верх (голова)** | Purple | `#7C3AED` | Violet-600 |
| **Середина** | Indigo | `#6366F1` | Indigo-500 |
| **Низ (хвост)** | Dark Blue | `#4338CA` | Indigo-700 |
| **Accent** | Deep Purple | `#5B21B6` | Violet-800 |

### ✅ PERFECT MATCH!

Цвет **Indigo-500 (`#6366F1`)** из CRM референса **идеально совпадает** с основным цветом логотипа!

Это означает:
- Primary color остаётся `#6366F1` (Indigo-500)
- Hover state: `#4F46E5` (Indigo-600) — ближе к нижней части логотипа
- Гармония обеспечена автоматически

---

## 🔴 EXACT VALUES FROM SOURCE (DO NOT CHANGE!)

### 🎨 Color Palette - LIGHT THEME

```css
:root {
  /* =========================
     BACKGROUND COLORS
     ========================= */
  --background: #F8FAFC;           /* Main page background - Slate-50 */
  --card: #FFFFFF;                  /* Card/Panel background - White */
  --muted: #F1F5F9;                 /* Muted/Secondary bg - Slate-100 */
  --popover: #FFFFFF;               /* Popover/Dropdown bg */

  /* =========================
     TEXT COLORS
     ========================= */
  --foreground: #1E293B;            /* Primary text - Slate-800 */
  --muted-foreground: #64748B;      /* Muted/Secondary text - Slate-500 */
  --subtle-foreground: #94A3B8;     /* Subtle/Placeholder text - Slate-400 */

  /* =========================
     PRIMARY COLOR (INDIGO)
     ========================= */
  --primary: #6366F1;               /* Primary - Indigo-500, rgb(99, 102, 241) */
  --primary-hover: #4F46E5;         /* Primary hover - Indigo-600 */
  --primary-foreground: #FFFFFF;    /* Text on primary */
  --primary-light: rgba(99, 102, 241, 0.08);  /* Primary with opacity for badges */
  --primary-lighter: rgba(99, 102, 241, 0.04); /* Very light primary for hover states */

  /* =========================
     SECONDARY COLOR
     ========================= */
  --secondary: #F1F5F9;             /* Secondary bg - Slate-100 */
  --secondary-foreground: #1E293B;  /* Text on secondary */

  /* =========================
     ACCENT COLOR
     ========================= */
  --accent: #F1F5F9;                /* Accent bg */
  --accent-foreground: #1E293B;     /* Text on accent */

  /* =========================
     STATUS COLORS
     ========================= */
  --success: #10B981;               /* Emerald-500 */
  --success-foreground: #FFFFFF;
  --success-light: rgba(16, 185, 129, 0.1);

  --warning: #F59E0B;               /* Amber-500 */
  --warning-foreground: #FFFFFF;
  --warning-light: rgba(245, 158, 11, 0.1);

  --destructive: #EF4444;           /* Red-500 */
  --destructive-foreground: #FFFFFF;
  --destructive-light: rgba(239, 68, 68, 0.1);

  --info: #06B6D4;                  /* Cyan-500 */
  --info-foreground: #FFFFFF;
  --info-light: rgba(6, 182, 212, 0.1);

  /* =========================
     BORDER & RING
     ========================= */
  --border: #E2E8F0;                /* Border color - Slate-200 */
  --input: #E2E8F0;                 /* Input border */
  --ring: rgba(99, 102, 241, 0.5);  /* Focus ring - Primary with opacity */

  /* =========================
     SPECIAL COLORS
     ========================= */
  --sidebar-bg: #1E293B;            /* Dark sidebar - Slate-800 */
  --sidebar-text: #F8FAFC;          /* Sidebar text - Slate-50 */
  --sidebar-muted: #94A3B8;         /* Sidebar muted - Slate-400 */
  --sidebar-border: #334155;        /* Sidebar border - Slate-700 */
}
```

### 🌙 Color Palette - DARK THEME

```css
.dark {
  /* =========================
     BACKGROUND COLORS
     ========================= */
  --background: #0F172A;            /* Main background - Slate-900 */
  --card: #1E293B;                  /* Card background - Slate-800 */
  --muted: #334155;                 /* Muted bg - Slate-700 */
  --popover: #1E293B;               /* Popover bg */

  /* =========================
     TEXT COLORS
     ========================= */
  --foreground: #F8FAFC;            /* Primary text - Slate-50 */
  --muted-foreground: #94A3B8;      /* Muted text - Slate-400 */
  --subtle-foreground: #64748B;     /* Subtle text - Slate-500 */

  /* =========================
     PRIMARY (same)
     ========================= */
  --primary: #6366F1;
  --primary-hover: #818CF8;         /* Indigo-400 on dark */
  --primary-foreground: #FFFFFF;
  --primary-light: rgba(99, 102, 241, 0.15);
  --primary-lighter: rgba(99, 102, 241, 0.08);

  /* =========================
     SECONDARY
     ========================= */
  --secondary: #334155;             /* Slate-700 */
  --secondary-foreground: #F8FAFC;

  /* =========================
     ACCENT
     ========================= */
  --accent: #334155;
  --accent-foreground: #F8FAFC;

  /* =========================
     STATUS COLORS (same hues, adjusted opacity)
     ========================= */
  --success: #10B981;
  --success-foreground: #FFFFFF;
  --success-light: rgba(16, 185, 129, 0.15);

  --warning: #F59E0B;
  --warning-foreground: #1E293B;
  --warning-light: rgba(245, 158, 11, 0.15);

  --destructive: #F87171;           /* Red-400 on dark */
  --destructive-foreground: #FFFFFF;
  --destructive-light: rgba(248, 113, 113, 0.15);

  --info: #22D3EE;                  /* Cyan-400 on dark */
  --info-foreground: #1E293B;
  --info-light: rgba(34, 211, 238, 0.15);

  /* =========================
     BORDER & RING
     ========================= */
  --border: #334155;                /* Slate-700 */
  --input: #475569;                 /* Slate-600 */
  --ring: rgba(99, 102, 241, 0.5);

  /* =========================
     SIDEBAR (same as background in dark)
     ========================= */
  --sidebar-bg: #0F172A;
  --sidebar-text: #F8FAFC;
  --sidebar-muted: #94A3B8;
  --sidebar-border: #334155;
}
```

---

## 📝 Typography - EXACT VALUES

```css
:root {
  /* =========================
     FONT FAMILIES
     ========================= */
  --font-sans: "Plus Jakarta Sans", "DM Sans", system-ui, -apple-system, sans-serif;
  --font-heading: "Plus Jakarta Sans", "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  /* =========================
     FONT SIZES
     ========================= */
  --text-xs: 0.75rem;       /* 12px */
  --text-sm: 0.875rem;      /* 14px */
  --text-base: 1rem;        /* 16px */
  --text-lg: 1.125rem;      /* 18px */
  --text-xl: 1.25rem;       /* 20px */
  --text-2xl: 1.5rem;       /* 24px */
  --text-3xl: 1.875rem;     /* 30px */
  --text-4xl: 2.25rem;      /* 36px */
  --text-5xl: 3rem;         /* 48px */
  --text-6xl: 3.75rem;      /* 60px - H1 on hero */

  /* =========================
     FONT WEIGHTS
     ========================= */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* =========================
     LINE HEIGHTS
     ========================= */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* =========================
     LETTER SPACING
     ========================= */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

---

## 📐 Spacing & Layout - EXACT VALUES

```css
:root {
  /* =========================
     SPACING SCALE
     ========================= */
  --space-0: 0;
  --space-0.5: 0.125rem;    /* 2px */
  --space-1: 0.25rem;       /* 4px */
  --space-1.5: 0.375rem;    /* 6px */
  --space-2: 0.5rem;        /* 8px */
  --space-2.5: 0.625rem;    /* 10px */
  --space-3: 0.75rem;       /* 12px */
  --space-3.5: 0.875rem;    /* 14px */
  --space-4: 1rem;          /* 16px */
  --space-5: 1.25rem;       /* 20px */
  --space-6: 1.5rem;        /* 24px */
  --space-7: 1.75rem;       /* 28px */
  --space-8: 2rem;          /* 32px */
  --space-9: 2.25rem;       /* 36px */
  --space-10: 2.5rem;       /* 40px */
  --space-12: 3rem;         /* 48px */
  --space-14: 3.5rem;       /* 56px */
  --space-16: 4rem;         /* 64px */
  --space-20: 5rem;         /* 80px */
  --space-24: 6rem;         /* 96px */

  /* =========================
     LAYOUT DIMENSIONS
     ========================= */
  --header-height: 80px;           /* Fixed header height */
  --sidebar-width: 280px;          /* Desktop sidebar width */
  --sidebar-collapsed: 72px;       /* Collapsed sidebar */
  --container-max: 1280px;         /* Max container width */
  --content-max: 1140px;           /* Max content width */
}
```

---

## 🔘 Border Radius - EXACT VALUES

```css
:root {
  /* =========================
     BORDER RADIUS
     ========================= */
  --radius-none: 0;
  --radius-sm: 4px;                 /* Small badges, tags */
  --radius-md: 8px;                 /* Inputs, small buttons */
  --radius-lg: 12px;                /* Buttons, small cards */
  --radius-xl: 16px;                /* Large avatars */
  --radius-2xl: 20px;               /* Standard cards */
  --radius-3xl: 24px;               /* Hero cards, large panels */
  --radius-full: 9999px;            /* Pills, circular avatars */
}
```

---

## 🌫️ Shadows - EXACT VALUES

```css
:root {
  /* =========================
     BOX SHADOWS
     ========================= */
  --shadow-none: none;

  /* Standard card shadow */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Card shadow (default) */
  --shadow-card: 0 4px 20px 0 rgba(0, 0, 0, 0.04);

  /* Elevated shadow */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -1px rgba(0, 0, 0, 0.06);

  /* Large shadow */
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* Extra large shadow */
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
               0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Primary button shadow */
  --shadow-primary: 0 4px 14px 0 rgba(99, 102, 241, 0.3);

  /* Dropdown/Modal shadow */
  --shadow-dropdown: 0 8px 40px 0 rgba(99, 102, 241, 0.15);

  /* Inset shadow */
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

/* Dark theme shadows */
.dark {
  --shadow-card: 0 4px 20px 0 rgba(0, 0, 0, 0.2);
  --shadow-primary: 0 4px 14px 0 rgba(99, 102, 241, 0.4);
  --shadow-dropdown: 0 8px 40px 0 rgba(0, 0, 0, 0.4);
}
```

---

## ⏳ Transitions - EXACT VALUES

```css
:root {
  /* =========================
     TRANSITIONS
     ========================= */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-colors: color 200ms ease,
                       background-color 200ms ease,
                       border-color 200ms ease;
  --transition-transform: transform 200ms ease;
  --transition-all: all 200ms ease;
}
```

---

## 🧩 Component-Specific Tokens

### Buttons

```css
:root {
  /* Primary Button */
  --button-primary-bg: var(--primary);
  --button-primary-bg-hover: var(--primary-hover);
  --button-primary-text: var(--primary-foreground);
  --button-primary-shadow: var(--shadow-primary);
  --button-primary-radius: 12px;
  --button-primary-padding: 12px 24px;
  --button-primary-font-size: 15px;
  --button-primary-font-weight: 600;
  --button-primary-letter-spacing: 0.02em;

  /* Secondary Button */
  --button-secondary-bg: transparent;
  --button-secondary-bg-hover: var(--secondary);
  --button-secondary-text: var(--foreground);
  --button-secondary-border: 1px solid var(--border);
  --button-secondary-radius: 12px;

  /* Icon Button */
  --button-icon-size: 40px;
  --button-icon-radius: 10px;
}
```

### Cards

```css
:root {
  --card-bg: var(--card);
  --card-border: 1px solid var(--border);
  --card-shadow: var(--shadow-card);
  --card-radius: 20px;              /* Standard card */
  --card-radius-lg: 24px;           /* Large/Hero card */
  --card-padding: 24px;
  --card-gap: 16px;
}
```

### Inputs

```css
:root {
  --input-bg: var(--card);
  --input-border: 1px solid var(--border);
  --input-border-focus: 1px solid var(--primary);
  --input-radius: 12px;
  --input-padding: 12px 16px;
  --input-font-size: 15px;
  --input-placeholder: var(--subtle-foreground);
  --input-ring-focus: 0 0 0 3px var(--ring);
}
```

### Badges

```css
:root {
  --badge-radius: 4px;              /* Square badges */
  --badge-radius-pill: 9999px;      /* Pill badges */
  --badge-padding: 4px 8px;
  --badge-font-size: 12px;
  --badge-font-weight: 500;

  /* Badge variants */
  --badge-default-bg: var(--secondary);
  --badge-default-text: var(--foreground);

  --badge-primary-bg: var(--primary-light);
  --badge-primary-text: var(--primary);

  --badge-success-bg: var(--success-light);
  --badge-success-text: var(--success);

  --badge-warning-bg: var(--warning-light);
  --badge-warning-text: var(--warning);

  --badge-destructive-bg: var(--destructive-light);
  --badge-destructive-text: var(--destructive);
}
```

### Header

```css
:root {
  --header-height: 80px;
  --header-bg: rgba(255, 255, 255, 0.9);
  --header-backdrop: blur(8px);
  --header-border: 1px solid var(--border);
  --header-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dark {
  --header-bg: rgba(15, 23, 42, 0.9);
}
```

---

## 🔧 Tailwind Config Extension

```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... etc
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'button': '12px',
        'input': '12px',
        'badge': '4px',
      },
      boxShadow: {
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.04)',
        'primary': '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
        'dropdown': '0 8px 40px 0 rgba(99, 102, 241, 0.15)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'DM Sans', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
}
```

---

## ✅ Verification Checklist

Before committing any UI changes, verify:

- [ ] All colors use CSS variables (no hardcoded hex)
- [ ] Border radius matches spec (12px buttons, 20px cards)
- [ ] Shadows match spec (shadow-card for cards, shadow-primary for buttons)
- [ ] Typography uses Plus Jakarta Sans / DM Sans
- [ ] Font weights: 400 (body), 500 (labels), 600 (headings/buttons), 700 (hero)
- [ ] Spacing uses Tailwind classes that match the scale
- [ ] Dark mode properly inverts all colors
- [ ] Focus states have proper ring effect

---

**END OF DESIGN TOKENS**
