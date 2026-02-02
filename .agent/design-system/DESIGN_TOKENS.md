# 🎨 Design Tokens Architecture

## What are Design Tokens?

Design tokens are the **atomic values** of your design system:
- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Transitions

All stored as CSS variables for easy theming.

---

## 📐 Token Hierarchy

```
THEME TOKENS (theme-specific)
       │
       ▼
SEMANTIC TOKENS (purpose-based)
       │
       ▼
COMPONENT TOKENS (component-specific)
```

### Example:
```css
/* Level 1: Theme Tokens */
--color-blue-500: #3B82F6;

/* Level 2: Semantic Tokens */
--color-primary: var(--color-blue-500);

/* Level 3: Component Tokens */
--button-bg: var(--color-primary);
```

---

## 🎨 Token Categories

### 1. Colors

```css
/* Background */
--background: ...;
--card: ...;
--muted: ...;

/* Foreground (text) */
--foreground: ...;
--muted-foreground: ...;

/* Semantic */
--primary: ...;
--primary-foreground: ...;
--secondary: ...;
--accent: ...;

/* Status */
--success: ...;
--warning: ...;
--destructive: ...;

/* Borders */
--border: ...;
--ring: ...;
```

### 2. Typography

```css
/* Font Families */
--font-sans: "DM Sans", system-ui;
--font-heading: "Space Grotesk", sans-serif;
--font-mono: "JetBrains Mono", monospace;

/* Font Sizes */
--text-xs: 0.6875rem;    /* 11px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Letter Spacing */
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-widest: 0.1em;
```

### 3. Spacing

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 4. Border Radius

```css
--radius-none: 0;
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

### 5. Shadows

```css
--shadow-none: none;
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### 6. Transitions

```css
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

---

## 🔧 Implementation

### In globals.css:

```css
@layer base {
  :root {
    /* Theme: Customer Support CRM */
    @import './themes/crm.css';
  }

  .dark {
    /* Dark mode overrides */
    @import './themes/crm-dark.css';
  }
}
```

### Using Tokens:

```tsx
// In Tailwind classes
<button className="bg-primary text-primary-foreground rounded-lg">

// In CSS
.my-component {
  background: var(--primary);
  border-radius: var(--radius-lg);
}
```
