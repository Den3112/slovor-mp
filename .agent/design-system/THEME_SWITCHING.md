# 🎨 Theme Switching Instructions

> **FOR IMPLEMENTING BOT**: Это инструкции по созданию системы тем

## 🎯 Goal

Создать систему переключаемых тем на CSS переменных.

**Источник дизайна**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
**Демо текущего стиля**: https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/customer-support-crm

---

## 📁 File Structure to Create

```
styles/
├── themes/
│   ├── crm.css          # Customer Support CRM (основной)
│   ├── saas.css         # SaaS Dashboard
│   ├── minimal.css      # Minimal Clean
│   └── index.ts         # Theme registry
├── tokens/
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   └── components.css
└── globals.css          # Entry point
```

---

## 🔄 How Theme Switching Should Work

### Method 1: CSS Class (Runtime)
```tsx
// components/theme-provider.tsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('crm'); // crm | saas | minimal

  return (
    <html className={`theme-${theme}`}>
      {children}
    </html>
  );
}
```

### Method 2: Config-based (Build time)
```ts
// lib/config.ts
export const ACTIVE_THEME = 'crm' as const;
```

### Method 3: Per-Section Themes (Recommended for Admin)
```tsx
// Admin section uses different theme
<div className="theme-saas">
  {/* Admin content */}
</div>
```

---

## 🎨 Theme Definitions

### Theme: CRM (Default for Marketplace)
```css
:root, .theme-crm {
  /* Solid, Clean, Data-Dense */
  --background: hsl(220 14% 96%);
  --card: hsl(0 0% 100%);
  --primary: hsl(217 91% 60%);      /* Blue */
  --radius: 0.75rem;                 /* rounded-xl */
  --sidebar-width: 16rem;

  /* Typography: DM Sans + Space Grotesk */
  --font-sans: "DM Sans";
  --font-heading: "Space Grotesk";

  /* No backdrop-blur! Solid backgrounds only */
}
```

### Theme: SaaS (For Admin Panel)
```css
.theme-saas {
  /* Modern, Gradient accents */
  --primary: hsl(262 83% 58%);       /* Violet */
  --radius: 1rem;                     /* More rounded */
  --sidebar-width: 18rem;

  /* Gradient accents allowed */
}
```

### Theme: Minimal
```css
.theme-minimal {
  /* Black & White, Sharp */
  --primary: hsl(0 0% 0%);
  --radius: 0.25rem;                  /* Nearly square */

  /* No shadows, minimal borders */
}
```

---

## 📝 Implementation Steps

### Step 1: Create Token Files
Create CSS files with variables (see DESIGN_TOKENS.md)

### Step 2: Create Theme Files
Theme files ONLY override token values, no new styles

### Step 3: Update globals.css
```css
@import './tokens/colors.css';
@import './tokens/typography.css';
@import './tokens/spacing.css';
@import './tokens/components.css';

/* Active theme */
@import './themes/crm.css';
```

### Step 4: Update tailwind.config.ts
```ts
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      // ...use CSS variables
    },
    borderRadius: {
      DEFAULT: 'var(--radius)',
    },
  },
}
```

### Step 5: Create ThemeSwitcher component (optional)
For admin to preview/switch themes

---

## ⚠️ Constraints

1. **NO backdrop-blur** anywhere (performance)
2. **Solid backgrounds** only
3. All colors via CSS variables
4. All radii via CSS variables
5. Fonts: DM Sans, Space Grotesk, JetBrains Mono

---

## ✅ Verification

After implementation:
- [ ] Theme switches by changing class on `<html>`
- [ ] Dark mode works with all themes
- [ ] No hardcoded colors in components
- [ ] No hardcoded border-radius values
- [ ] Admin can use different theme than public
