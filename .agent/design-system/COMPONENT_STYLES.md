# 🧩 Component Styles - Customer Support CRM (1:1 Copy)

> **SOURCE**: https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/customer-support-crm
> **REQUIREMENT**: Все стили должны быть 1:1 с исходником
> **LAST UPDATED**: 2026-02-05

---

## 🔘 Buttons

### Primary Button
```tsx
<Button className="
  bg-[#6366F1]                      /* Primary Indigo-500 */
  hover:bg-[#4F46E5]                /* Hover Indigo-600 */
  text-white
  font-semibold                     /* font-weight: 600 */
  text-[15px]
  tracking-[0.02em]
  px-6                              /* padding: 12px 24px */
  py-3
  rounded-xl                        /* 12px border-radius */
  shadow-primary
  transition-all duration-200
  active:scale-[0.98]
  disabled:opacity-50
  disabled:cursor-not-allowed
">
  Button Text
</Button>
```

### Secondary Button
```tsx
<Button variant="secondary" className="
  bg-transparent
  hover:bg-[#F1F5F9]                /* Slate-100 */
  text-[#1E293B]                    /* Slate-800 */
  font-semibold
  text-[15px]
  px-6 py-3
  rounded-xl                        /* 12px */
  border border-[#E2E8F0]           /* Slate-200 */
  transition-colors duration-200
">
  Secondary
</Button>
```

### Ghost Button
```tsx
<Button variant="ghost" className="
  bg-transparent
  hover:bg-[#F1F5F9]
  text-[#64748B]                    /* Slate-500 */
  hover:text-[#1E293B]
  font-medium
  px-4 py-2
  rounded-lg
  transition-colors duration-200
">
  Ghost
</Button>
```

### Icon Button
```tsx
<button className="
  w-10 h-10                         /* 40x40px */
  flex items-center justify-center
  rounded-[10px]
  bg-transparent
  hover:bg-[#F1F5F9]
  text-[#64748B]
  hover:text-[#1E293B]
  transition-colors duration-200
">
  <Icon className="h-5 w-5" />
</button>
```

### Destructive Button
```tsx
<Button variant="destructive" className="
  bg-[#EF4444]                      /* Red-500 */
  hover:bg-[#DC2626]                /* Red-600 */
  text-white
  font-semibold
  px-6 py-3
  rounded-xl
  transition-colors duration-200
">
  Delete
</Button>
```

---

## 🃏 Cards

### Standard Card
```tsx
<div className="
  bg-white dark:bg-[#1E293B]
  border border-[#E2E8F0] dark:border-[#334155]
  rounded-2xl                       /* 20px radius */
  shadow-card
  p-6                               /* 24px padding */
">
  Card content
</div>
```

### Large/Hero Card
```tsx
<div className="
  bg-white dark:bg-[#1E293B]
  border border-[#E2E8F0] dark:border-[#334155]
  rounded-3xl                       /* 24px radius */
  shadow-card
  p-8                               /* 32px padding */
">
  Hero content
</div>
```

### Highlighted Card (Primary tint)
```tsx
<div className="
  bg-[rgba(99,102,241,0.04)]        /* Primary light bg */
  border border-[rgba(99,102,241,0.2)]
  rounded-2xl
  p-6
">
  Highlighted content
</div>
```

### Stat Card
```tsx
<div className="
  bg-white dark:bg-[#1E293B]
  border border-[#E2E8F0] dark:border-[#334155]
  rounded-2xl
  p-6
  flex flex-col gap-3
">
  <div className="flex items-center justify-between">
    <span className="text-[#64748B] text-sm font-medium">Label</span>
    <div className="w-10 h-10 rounded-xl bg-[rgba(99,102,241,0.08)] flex items-center justify-center">
      <Icon className="h-5 w-5 text-[#6366F1]" />
    </div>
  </div>
  <div className="text-[28px] font-bold text-[#1E293B] dark:text-white">1,234</div>
  <div className="text-sm text-[#10B981]">+12% from last month</div>
</div>
```

---

## 🏷️ Badges

### Default Badge
```tsx
<span className="
  inline-flex items-center
  px-2 py-1                         /* 8px 4px */
  rounded                           /* 4px */
  bg-[#F1F5F9] dark:bg-[#334155]
  text-[#1E293B] dark:text-[#F8FAFC]
  text-xs                           /* 12px */
  font-medium                       /* 500 */
">
  Default
</span>
```

### Primary Badge
```tsx
<span className="
  inline-flex items-center
  px-2 py-1
  rounded
  bg-[rgba(99,102,241,0.1)]
  text-[#6366F1]
  text-xs font-medium
">
  Primary
</span>
```

### Success Badge
```tsx
<span className="
  inline-flex items-center
  px-2 py-1
  rounded
  bg-[rgba(16,185,129,0.1)]
  text-[#10B981]
  text-xs font-medium
">
  Success
</span>
```

### Warning Badge
```tsx
<span className="
  inline-flex items-center
  px-2 py-1
  rounded
  bg-[rgba(245,158,11,0.1)]
  text-[#F59E0B]
  text-xs font-medium
">
  Warning
</span>
```

### Destructive Badge
```tsx
<span className="
  inline-flex items-center
  px-2 py-1
  rounded
  bg-[rgba(239,68,68,0.1)]
  text-[#EF4444]
  text-xs font-medium
">
  Error
</span>
```

### Pill Badge (rounded)
```tsx
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full                      /* 9999px */
  bg-[#6366F1]
  text-white
  text-xs font-medium
">
  New
</span>
```

---

## 📝 Inputs

### Text Input
```tsx
<input
  type="text"
  className="
    w-full
    bg-white dark:bg-[#1E293B]
    border border-[#E2E8F0] dark:border-[#334155]
    rounded-xl                      /* 12px */
    px-4 py-3                       /* 16px 12px */
    text-[15px]
    text-[#1E293B] dark:text-[#F8FAFC]
    placeholder:text-[#94A3B8]
    focus:outline-none
    focus:border-[#6366F1]
    focus:ring-[3px]
    focus:ring-[rgba(99,102,241,0.2)]
    transition-all duration-200
  "
  placeholder="Enter text..."
/>
```

### Search Input with Icon
```tsx
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
  <input
    type="text"
    className="
      w-full
      bg-white dark:bg-[#1E293B]
      border border-[#E2E8F0] dark:border-[#334155]
      rounded-xl
      pl-12 pr-4 py-3
      text-[15px]
      placeholder:text-[#94A3B8]
      focus:outline-none
      focus:border-[#6366F1]
      focus:ring-[3px]
      focus:ring-[rgba(99,102,241,0.2)]
    "
    placeholder="Search..."
  />
</div>
```

### Select
```tsx
<select className="
  w-full
  bg-white dark:bg-[#1E293B]
  border border-[#E2E8F0] dark:border-[#334155]
  rounded-xl
  px-4 py-3
  text-[15px]
  text-[#1E293B] dark:text-[#F8FAFC]
  focus:outline-none
  focus:border-[#6366F1]
  focus:ring-[3px]
  focus:ring-[rgba(99,102,241,0.2)]
  appearance-none
  bg-no-repeat bg-right
  cursor-pointer
">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Textarea
```tsx
<textarea className="
  w-full min-h-[120px]
  bg-white dark:bg-[#1E293B]
  border border-[#E2E8F0] dark:border-[#334155]
  rounded-xl
  px-4 py-3
  text-[15px]
  text-[#1E293B] dark:text-[#F8FAFC]
  placeholder:text-[#94A3B8]
  focus:outline-none
  focus:border-[#6366F1]
  focus:ring-[3px]
  focus:ring-[rgba(99,102,241,0.2)]
  resize-y
" />
```

---

## 📊 Tables

### Data Table
```tsx
<div className="
  bg-white dark:bg-[#1E293B]
  border border-[#E2E8F0] dark:border-[#334155]
  rounded-2xl
  overflow-hidden
">
  <table className="w-full">
    <thead>
      <tr className="border-b border-[#E2E8F0] dark:border-[#334155]">
        <th className="
          px-6 py-4
          text-left
          text-xs font-semibold
          text-[#64748B] dark:text-[#94A3B8]
          uppercase tracking-wider
          bg-[#F8FAFC] dark:bg-[#0F172A]
        ">
          Column
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="
        border-b border-[#E2E8F0] dark:border-[#334155]
        hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]
        transition-colors duration-150
      ">
        <td className="px-6 py-4 text-sm text-[#1E293B] dark:text-[#F8FAFC]">
          Cell
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🧭 Header

### Main Header (with blur)
```tsx
<header className="
  fixed top-0 left-0 right-0
  h-[80px]
  bg-white/90 dark:bg-[#0F172A]/90
  backdrop-blur-sm
  border-b border-[#E2E8F0] dark:border-[#334155]
  shadow-[0_1px_3px_rgba(0,0,0,0.05)]
  z-50
">
  <div className="container mx-auto h-full px-6 flex items-center justify-between">
    {/* Logo */}
    <Logo />

    {/* Navigation */}
    <nav className="hidden lg:flex items-center gap-8">
      <a className="text-[15px] font-medium text-[#64748B] hover:text-[#1E293B] transition-colors">
        Link
      </a>
    </nav>

    {/* Actions */}
    <div className="flex items-center gap-4">
      <Button variant="ghost">Sign In</Button>
      <Button>Start Free</Button>
    </div>
  </div>
</header>
```

---

## 📱 Sidebar (Dashboard)

### Dashboard Sidebar
```tsx
<aside className="
  w-[280px]
  h-screen
  bg-[#1E293B]                      /* Dark sidebar */
  border-r border-[#334155]
  flex flex-col
">
  {/* Logo */}
  <div className="h-[80px] flex items-center px-6 border-b border-[#334155]">
    <Logo variant="white" />
  </div>

  {/* Navigation */}
  <nav className="flex-1 py-6 px-4 space-y-1">
    {/* Active link */}
    <a className="
      flex items-center gap-3
      px-4 py-3                     /* 16px 12px */
      rounded-xl                    /* 12px */
      bg-[rgba(99,102,241,0.1)]
      text-white
      font-medium
    ">
      <Icon className="h-5 w-5" />
      <span>Active</span>
    </a>

    {/* Inactive link */}
    <a className="
      flex items-center gap-3
      px-4 py-3
      rounded-xl
      text-[#94A3B8]
      hover:text-white
      hover:bg-[rgba(255,255,255,0.05)]
      transition-colors duration-200
    ">
      <Icon className="h-5 w-5" />
      <span>Inactive</span>
    </a>
  </nav>

  {/* User section */}
  <div className="p-4 border-t border-[#334155]">
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10" />
      <div>
        <p className="text-white text-sm font-medium">Username</p>
        <p className="text-[#94A3B8] text-xs">user@email.com</p>
      </div>
    </div>
  </div>
</aside>
```

---

## 💬 Chat Components

### Chat Bubble (Sent)
```tsx
<div className="
  max-w-[80%] ml-auto
  bg-[#6366F1]                      /* Primary */
  text-white
  px-4 py-3
  rounded-[16px] rounded-br-sm      /* Tail effect */
  text-[15px]
">
  Sent message
</div>
```

### Chat Bubble (Received)
```tsx
<div className="
  max-w-[80%]
  bg-[rgba(99,102,241,0.08)]        /* Primary light */
  text-[#1E293B] dark:text-[#F8FAFC]
  px-4 py-3
  rounded-[16px] rounded-bl-sm
  text-[15px]
">
  Received message
</div>
```

---

## 🔔 Alerts/Notifications

### Info Alert
```tsx
<div className="
  flex items-start gap-3
  p-4
  bg-[rgba(6,182,212,0.1)]          /* Cyan-500 light */
  border border-[rgba(6,182,212,0.2)]
  rounded-xl
">
  <Info className="h-5 w-5 text-[#06B6D4] shrink-0 mt-0.5" />
  <p className="text-sm text-[#1E293B] dark:text-[#F8FAFC]">
    Info message
  </p>
</div>
```

### Warning Alert
```tsx
<div className="
  flex items-start gap-3
  p-4
  bg-[rgba(245,158,11,0.1)]
  border border-[rgba(245,158,11,0.2)]
  rounded-xl
">
  <AlertTriangle className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
  <p className="text-sm text-[#1E293B] dark:text-[#F8FAFC]">
    Warning message
  </p>
</div>
```

---

## 🎭 Avatar

### Avatar with Status
```tsx
<div className="relative">
  <img
    src="/avatar.jpg"
    className="
      w-10 h-10
      rounded-[16px]                /* Large avatar radius */
      object-cover
      border-2 border-white dark:border-[#1E293B]
    "
  />
  {/* Online indicator */}
  <span className="
    absolute bottom-0 right-0
    w-3 h-3
    bg-[#10B981]                    /* Emerald */
    rounded-full
    border-2 border-white dark:border-[#1E293B]
  " />
</div>
```

---

## 📋 Lists

### List Item with Hover
```tsx
<div className="
  flex items-center gap-4
  p-4
  rounded-xl
  hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]
  cursor-pointer
  transition-colors duration-150
">
  <Avatar className="h-10 w-10" />
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-[#1E293B] dark:text-[#F8FAFC] truncate">
      Title
    </p>
    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">
      Subtitle
    </p>
  </div>
  <span className="text-xs text-[#94A3B8]">2m ago</span>
</div>
```

---

## ⚡ Quick Reference

### Color Classes Mapping

| Design Token | Tailwind Class | Hex Value |
|-------------|----------------|-----------|
| Primary | `bg-[#6366F1]` | `#6366F1` |
| Primary Hover | `hover:bg-[#4F46E5]` | `#4F46E5` |
| Background | `bg-[#F8FAFC]` | `#F8FAFC` |
| Card | `bg-white` | `#FFFFFF` |
| Text | `text-[#1E293B]` | `#1E293B` |
| Text Muted | `text-[#64748B]` | `#64748B` |
| Text Subtle | `text-[#94A3B8]` | `#94A3B8` |
| Border | `border-[#E2E8F0]` | `#E2E8F0` |
| Success | `text-[#10B981]` | `#10B981` |
| Warning | `text-[#F59E0B]` | `#F59E0B` |
| Error | `text-[#EF4444]` | `#EF4444` |

### Border Radius Classes

| Element | Radius | Class |
|---------|--------|-------|
| Buttons | 12px | `rounded-xl` |
| Cards | 20px | `rounded-2xl` |
| Hero Cards | 24px | `rounded-[24px]` |
| Inputs | 12px | `rounded-xl` |
| Badges | 4px | `rounded` |
| Pills | 9999px | `rounded-full` |
| Avatars | 16px | `rounded-[16px]` |

### Shadow Classes

| Type | Class |
|------|-------|
| Card | `shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]` |
| Primary Button | `shadow-[0_4px_14px_0_rgba(99,102,241,0.3)]` |
| Dropdown | `shadow-[0_8px_40px_0_rgba(99,102,241,0.15)]` |

---

**END OF COMPONENT STYLES**
