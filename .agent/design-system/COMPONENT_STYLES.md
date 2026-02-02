# 🧩 Component Styles Guide

> **FOR IMPLEMENTING BOT**: Стили компонентов по дизайн-системе

## 🎯 Основной стиль

**Источник**: Customer Support CRM from ui-ux-pro-max-skill
**Характеристики**: Solid, Clean, Data-Dense

---

## 📦 Component Specifications

### Cards
```css
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);          /* 12px default */
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.05);
  /* NO backdrop-blur! */
}

.card:hover {
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
  border-color: hsl(var(--primary) / 0.2);
}
```

### Buttons
```css
.button-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: 0.5rem;                /* rounded-lg */
  font-weight: 600;
  min-height: 44px;                     /* Touch target */
  padding: 0 1rem;
}

.button-secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
  border: 1px solid hsl(var(--border));
}

.button-ghost {
  background: transparent;
  color: hsl(var(--muted-foreground));
}
.button-ghost:hover {
  background: hsl(var(--muted));
}
```

### Inputs
```css
.input {
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  height: 44px;                          /* Touch target */
  padding: 0 0.75rem;
}

.input:focus {
  border-color: hsl(var(--primary));
  outline: none;
  ring: 2px solid hsl(var(--primary) / 0.2);
}
```

### Badges
```css
.badge {
  font-size: 0.6875rem;                  /* 11px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;                 /* Full round */
}

.badge-success { background: hsl(var(--success)); }
.badge-warning { background: hsl(var(--warning)); }
.badge-destructive { background: hsl(var(--destructive)); }
```

### Labels (Section Headers)
```css
.label {
  font-size: 0.6875rem;                  /* 11px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: hsl(var(--muted-foreground));
}
```

---

## 🏗️ Layout Components

### Header
```
Height: 64px (4rem)
Background: solid (no blur)
Border: 1px bottom
Position: sticky top-0
Z-index: 50
```

### Sidebar
```
Width: 256px (expanded), 80px (collapsed)
Background: hsl(var(--card))
Border: 1px right
Collapsible: yes
Groups: with labels
```

### Bottom Tab Bar (Mobile)
```
Height: 64px + safe-area
Background: solid (no blur)
Border: 1px top
Position: fixed bottom-0
Z-index: 50
Show: md:hidden
Items: 5 (Home, Search, Sell, Favorites, Menu)
Primary action: raised button (Sell)
```

### Container
```css
.container {
  max-width: 1280px;
  padding: 0 1rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

---

## 📱 Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## 🎭 States

### Hover
- Cards: shadow increase, border highlight
- Buttons: slight brightness (-5%)
- Links: color change to primary

### Active/Pressed
- Scale: 0.98
- Brightness: -10%

### Disabled
- Opacity: 0.5
- Cursor: not-allowed

### Focus
- Ring: 2px primary with 20% opacity
- No outline

### Loading
- Skeleton animation
- Pulse effect
- Spinner for buttons

---

## ⚠️ CRITICAL Rules

1. **NO backdrop-blur** - This is a hard constraint
2. **NO inline colors** - Always use CSS variables
3. **NO magic numbers** - Use spacing tokens
4. **Touch targets** - Min 44x44px on mobile
5. **Transitions** - 200ms ease default
