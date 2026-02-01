# 🤖 AI Agent Instructions: Premium CRM Redesign

> **CRITICAL**: Read this ENTIRE document before starting. Follow EXACTLY as written.
> **Branch**: `feature/premium-redesign` (already created, checkout it)
> **Reference Design**: https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/customer-support-crm

---

## 📋 Pre-Flight Checklist

Before ANY work:

```bash
# 1. Checkout the correct branch
cd /home/creator/slovor-mp
git checkout feature/premium-redesign
git pull origin feature/premium-redesign

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Verify current state passes
npm run verify
```

**If `npm run verify` fails — FIX IT FIRST before proceeding!**

---

## 🎨 PART 1: Design System (EXACT VALUES)

### Task 1.1: Update `app/globals.css`

**File**: `/home/creator/slovor-mp/app/globals.css`

Replace the `:root` and `.dark` CSS variable blocks with these EXACT values:

```css
@layer base {
  :root {
    /* Background & Surface */
    --background: 210 40% 98%;      /* #F8FAFC - Page background */
    --foreground: 222 47% 11%;      /* #0F172A - Primary text */

    /* Card/Surface */
    --card: 0 0% 100%;              /* #FFFFFF - Cards, modals */
    --card-foreground: 222 47% 11%;

    /* Primary Action Color */
    --primary: 217 91% 60%;         /* #3B82F6 - Buttons, links, active */
    --primary-foreground: 0 0% 100%;

    /* Secondary/Muted */
    --secondary: 214 32% 91%;       /* #E2E8F0 - Secondary buttons */
    --secondary-foreground: 222 47% 11%;

    /* Muted Text & Backgrounds */
    --muted: 210 40% 96%;           /* #F1F5F9 - Muted backgrounds */
    --muted-foreground: 215 16% 47%; /* #64748B - Muted text */

    /* Accent (for hover states) */
    --accent: 214 95% 93%;          /* #EFF6FF - Hover bg, table headers */
    --accent-foreground: 222 47% 11%;

    /* Borders */
    --border: 214 32% 91%;          /* #E2E8F0 - All borders */
    --input: 214 32% 91%;           /* Same as border */
    --ring: 217 91% 60%;            /* Primary for focus rings */

    /* Semantic Colors */
    --destructive: 0 84% 60%;       /* #EF4444 - Errors, delete */
    --destructive-foreground: 0 0% 100%;
    --success: 142 76% 36%;         /* #22C55E - Success states */
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;          /* #F59E0B - Warnings */
    --warning-foreground: 0 0% 100%;

    /* Layout */
    --radius: 0.75rem;              /* 12px - Default border-radius */
    --sidebar-width: 256px;
    --header-height: 64px;
  }

  .dark {
    /* Background & Surface - DARK */
    --background: 222 47% 3%;       /* #020617 - Deep navy */
    --foreground: 210 40% 98%;      /* #F8FAFC - Light text */

    /* Card/Surface - DARK */
    --card: 222 47% 6%;             /* #0F172A - Slate-900 */
    --card-foreground: 210 40% 98%;

    /* Primary stays same */
    --primary: 217 91% 60%;         /* #3B82F6 */
    --primary-foreground: 0 0% 100%;

    /* Secondary - DARK */
    --secondary: 217 33% 17%;       /* #1E293B - Slate-800 */
    --secondary-foreground: 210 40% 98%;

    /* Muted - DARK */
    --muted: 217 33% 17%;           /* #1E293B */
    --muted-foreground: 215 20% 65%; /* #94A3B8 */

    /* Accent - DARK */
    --accent: 217 33% 17%;          /* #1E293B */
    --accent-foreground: 210 40% 98%;

    /* Borders - DARK */
    --border: 217 33% 17%;          /* #1E293B */
    --input: 217 33% 17%;
    --ring: 217 91% 60%;

    /* Semantic stay same */
    --destructive: 0 84% 60%;
    --success: 142 76% 36%;
    --warning: 38 92% 50%;
  }
}
```

### Task 1.2: Update `tailwind.config.ts`

**File**: `/home/creator/slovor-mp/tailwind.config.ts`

Ensure these values exist in the `theme.extend` section:

```typescript
theme: {
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      success: {
        DEFAULT: "hsl(var(--success))",
        foreground: "hsl(var(--success-foreground))",
      },
      warning: {
        DEFAULT: "hsl(var(--warning))",
        foreground: "hsl(var(--warning-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    fontFamily: {
      sans: ["DM Sans", "system-ui", "sans-serif"],
      heading: ["Space Grotesk", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
      xl: "calc(var(--radius) + 4px)",
    },
    boxShadow: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
  },
},
```

### Task 1.3: Add Google Fonts

**File**: `/home/creator/slovor-mp/app/[locale]/layout.tsx`

Add these font imports at the top:

```typescript
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
```

Add to body className:

```tsx
<body className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
```

---

## 🏗️ PART 2: Component Updates

### Task 2.1: Update Card Component

**File**: `/home/creator/slovor-mp/components/ui/card.tsx`

The Card should have these EXACT styles:

```tsx
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
```

### Task 2.2: Update Button Component

**File**: `/home/creator/slovor-mp/components/ui/button.tsx`

The buttonVariants should be:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Task 2.3: Update Badge Component

**File**: `/home/creator/slovor-mp/components/ui/badge.tsx`

```tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        success: "border-transparent bg-success/10 text-success",
        warning: "border-transparent bg-warning/10 text-warning",
        outline: "text-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
```

### Task 2.4: Update Input Component

**File**: `/home/creator/slovor-mp/components/ui/input.tsx`

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

---

## 📐 PART 3: Layout Components

### Task 3.1: Update Sidebar

**File**: `/home/creator/slovor-mp/components/features/dashboard/shared/sidebar.tsx`

**CRITICAL STYLES**:
- Width: `w-64` (256px)
- Background: `bg-card` (white in light, slate-900 in dark)
- Border: `border-r border-border`
- Menu items: `py-2 px-3 rounded-lg text-sm font-medium`
- Active state: `bg-primary/10 text-primary`
- Hover state: `hover:bg-accent`
- Icons: `h-5 w-5 mr-3`

**Menu Structure** (simplify to this):
```tsx
const menuItems = [
  { icon: LayoutDashboard, label: t('dashboard'), href: '/profile/overview' },
  { icon: Package, label: t('listings'), href: '/profile/listings' },
  { icon: MessageCircle, label: t('messages'), href: '/messages' },
  { icon: Heart, label: t('favorites'), href: '/profile/favorites' },
  { icon: ShoppingCart, label: t('orders'), href: '/profile/orders' },
  { icon: Settings, label: t('settings'), href: '/profile/settings' },
]
```

**Remove all nested menu sections!** Single flat list only.

### Task 3.2: Update Header

**File**: `/home/creator/slovor-mp/components/layout/header.tsx`

**Requirements**:
- Height: `h-16` (64px)
- Background: `bg-background` (solid, NO blur)
- Border: `border-b border-border`
- Logo on left, search center (optional), user menu right
- NO animations, NO scroll effects
- Dashboard pages: return `null` (sidebar has own header)

### Task 3.3: Update DashboardShell

**File**: `/home/creator/slovor-mp/components/features/dashboard/layouts/dashboard-shell.tsx`

**Structure**:
```tsx
<div className="flex h-screen overflow-hidden bg-background">
  {/* Sidebar - Desktop */}
  <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-card">
    <UnifiedSidebar config={config} />
  </aside>

  {/* Main Content */}
  <main className="flex-1 overflow-y-auto">
    {/* Optional Top Bar */}
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Mobile menu button + Title + Actions */}
    </div>

    {/* Content */}
    <div className="p-6">
      {children}
    </div>
  </main>
</div>
```

---

## 📄 PART 4: Page-by-Page Updates

### Task 4.1: Dashboard Overview

**File**: `/home/creator/slovor-mp/components/features/dashboard/user/overview-view.tsx`

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ Header: "Dashboard" + Create Button                 │
├─────────────────────────────────────────────────────┤
│ Stats Row: 4 cards in grid (2x2 mobile, 4x1 desktop)│
├────────────────────────────┬────────────────────────┤
│ Chart Card (2/3)           │ Activity Feed (1/3)    │
├────────────────────────────┴────────────────────────┤
│ Recent Listings Table                               │
└─────────────────────────────────────────────────────┘
```

**Stats Card Style**:
```tsx
<Card className="p-4">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
    <div className="rounded-lg bg-primary/10 p-2 text-primary">
      <Icon className="h-5 w-5" />
    </div>
  </div>
</Card>
```

### Task 4.2: Listings Page

**File**: `/home/creator/slovor-mp/app/[locale]/(main)/profile/listings/page.tsx`

**Table Style**:
```tsx
<table className="w-full">
  <thead>
    <tr className="border-b border-border bg-muted/50">
      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
        {t('title')}
      </th>
      {/* ... more headers */}
    </tr>
  </thead>
  <tbody>
    {listings.map((listing) => (
      <tr key={listing.id} className="border-b border-border hover:bg-accent/50 transition-colors">
        <td className="px-4 py-3">{listing.title}</td>
        {/* ... more cells */}
      </tr>
    ))}
  </tbody>
</table>
```

### Task 4.3: Homepage

**Files to update**:
- `/home/creator/slovor-mp/components/home/hero.tsx`
- `/home/creator/slovor-mp/components/home/home-categories.tsx`
- `/home/creator/slovor-mp/components/home/features.tsx`
- `/home/creator/slovor-mp/components/home/home-cta.tsx`

**Hero Requirements**:
- Clean white/dark background (NO gradients)
- Centered text
- Large heading: `text-5xl md:text-6xl font-heading font-bold`
- Subheading: `text-lg text-muted-foreground`
- Search bar: centered, max-width 600px
- Primary CTA button

**Categories**:
- Grid: `grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4`
- Category cards: simple, icon + label, hover shadow

---

## 🌙 PART 5: Dark Theme

### Important Rules:

1. **NEVER use hardcoded colors** - Always use CSS variables
   - ❌ `bg-white` → ✅ `bg-card`
   - ❌ `text-gray-900` → ✅ `text-foreground`
   - ❌ `border-gray-200` → ✅ `border-border`

2. **Test EVERY component in dark mode**:
   - Toggle theme in browser
   - Check contrast ratios
   - Check hover states

3. **Common mistakes to avoid**:
   - Hardcoded `bg-slate-*` colors
   - Using `text-black` or `text-white` directly
   - Shadows that are too dark in dark mode

---

## ✅ PART 6: Verification

After EVERY major change, run:

```bash
npm run verify
```

This runs:
1. ESLint (code quality)
2. TypeScript check (type errors)
3. Next.js build (compile errors)

**ALL THREE MUST PASS!**

### Visual Verification Checklist:

Open http://localhost:3000 and check:

- [ ] Homepage loads correctly
- [ ] Toggle dark mode - all elements visible
- [ ] Login and check dashboard
- [ ] Sidebar navigation works
- [ ] All buttons have hover states
- [ ] All cards have proper borders
- [ ] Typography is readable
- [ ] Mobile view (resize to 375px) works

---

## 🚫 FORBIDDEN STYLES (Never Use)

| ❌ Don't | ✅ Do Instead |
|----------|--------------|
| `backdrop-blur-*` | Solid `bg-card` |
| `bg-gradient-*` | Solid colors |
| `shadow-2xl` | `shadow-sm` or `shadow-md` max |
| `rounded-3xl` | `rounded-xl` max |
| `border-2` | `border` (1px) |
| `font-black` | `font-bold` max |
| Emojis as icons | Lucide icons |

---

## 📝 Commit Strategy

After each part:

```bash
git add -A
git commit -m "type(scope): description"
```

Examples:
- `feat(design): update CSS variables for CRM palette`
- `feat(ui): update Button, Card, Badge components`
- `feat(layout): simplify sidebar navigation`
- `feat(dashboard): redesign overview page`
- `style(dark): fix dark mode consistency`

Push regularly:
```bash
git push origin feature/premium-redesign
```

---

## 🎯 Success Criteria

The redesign is COMPLETE when:

1. ✅ `npm run verify` passes
2. ✅ All pages match CRM reference style
3. ✅ Dark mode works on all pages
4. ✅ Mobile responsive (375px works)
5. ✅ No hardcoded colors remain
6. ✅ Navigation is simplified (flat menu)
7. ✅ All interactive states work (hover, focus, active)

---

## 📞 If You Get Stuck

1. Check the reference: https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/customer-support-crm
2. Read `.design-protocol/themes/customer-crm.md`
3. Read `.design-protocol/core/global-constraints.md`
4. Run `npm run verify` to find errors
5. Check browser console for errors

**Remember**: Simple, clean, data-dense. NO fancy effects!
