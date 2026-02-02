# 🏛️ COMPLETE ARCHITECTURE BLUEPRINT: Slovor Marketplace

> **CRITICAL**: Это ПОЛНЫЙ план. Другой ИИ должен следовать КАЖДОМУ пункту.
> **Дата**: 2026-02-01
> **Версия**: 2.0 (полная переработка)

---

## 📊 Project Overview

**41 страница** | **69 UI компонентов** | **11 feature модулей**

### Структура страниц:
```
PUBLIC PAGES (12):
├── /                      # Homepage
├── /search               # Search results
├── /listings             # All listings
├── /listings/[id]        # Listing detail
├── /listings/[id]/promote # Promote listing
├── /categories           # Categories list
├── /categories/[slug]    # Category page
├── /seller/[id]          # Seller profile
├── /about                # About us
├── /contact              # Contact form
├── /faq                  # FAQ
├── /blog                 # Blog
├── /blog/[slug]          # Blog post
├── /privacy              # Privacy policy
└── /terms                # Terms of service

AUTH PAGES (2):
├── /auth/login           # Login
└── /auth/register        # Register

USER DASHBOARD (13):
├── /dashboard            # Overview (rename from /profile/overview)
├── /dashboard/listings   # My listings
├── /dashboard/orders     # Orders (merge purchases)
├── /dashboard/wallet     # Wallet
├── /dashboard/reviews    # Reviews
├── /dashboard/settings   # Settings (include verification)
├── /messages             # Messages (TOP-LEVEL)
├── /messages/[id]        # Chat
├── /favorites            # Favorites (TOP-LEVEL)
└── /post                 # Create listing

ADMIN PAGES (6):
├── /admin                # Dashboard
├── /admin/users          # Users
├── /admin/listings       # Listings
├── /admin/verifications  # Verifications
├── /admin/reports        # Reports
└── /admin/content        # Content management
```

---

## 🎨 PART 1: DESIGN SYSTEM

### 1.1 Color Palette
```css
/* LIGHT MODE */
--background: #F8FAFC;     /* Page background */
--card: #FFFFFF;           /* Cards, modals */
--foreground: #0F172A;     /* Primary text */
--muted: #64748B;          /* Secondary text */
--border: #E2E8F0;         /* Borders */
--primary: #3B82F6;        /* Actions, links */
--success: #22C55E;        /* Success states */
--warning: #F59E0B;        /* Warning */
--destructive: #EF4444;    /* Error, delete */

/* DARK MODE */
--background: #020617;     /* Page background */
--card: #0F172A;           /* Cards, modals */
--foreground: #F8FAFC;     /* Primary text */
--muted: #94A3B8;          /* Secondary text */
--border: #1E293B;         /* Borders */
```

### 1.2 Typography
```css
--font-sans: "DM Sans", system-ui;      /* Body text */
--font-heading: "Space Grotesk";        /* Headings */
--font-mono: "JetBrains Mono";          /* Code */

/* Sizes */
--text-xs: 11px;    /* Labels, badges */
--text-sm: 14px;    /* Body small */
--text-base: 16px;  /* Body */
--text-lg: 18px;    /* Subheadings */
--text-xl: 20px;    /* H4 */
--text-2xl: 24px;   /* H3 */
--text-3xl: 30px;   /* H2 */
--text-4xl: 36px;   /* H1 */
--text-5xl: 48px;   /* Hero */
```

### 1.3 Spacing
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### 1.4 Border Radius
```css
--radius-sm: 6px;    /* Badges, small elements */
--radius-md: 8px;    /* Buttons, inputs */
--radius-lg: 12px;   /* Cards */
--radius-xl: 16px;   /* Modals, large cards */
```

---

## 📱 PART 2: LAYOUTS

### 2.1 Main Layout (Public Pages)
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (h-16, sticky)                                           │
│ ┌──────┐ ┌─────────────────────────────┐ ┌───┐┌───┐┌───┐┌─────┐│
│ │ Logo │ │ 🔍 Search marketplace...    │ │ ❤️││ 💬││ ➕ ││ User││
│ └──────┘ └─────────────────────────────┘ └───┘└───┘└───┘└─────┘│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      PAGE CONTENT                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER                                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │ About    │ │ Support  │ │ Legal    │ │ Social   │            │
│ │ - About  │ │ - FAQ    │ │ - Terms  │ │ - FB     │            │
│ │ - Contact│ │ - Contact│ │ - Privacy│ │ - IG     │            │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│                    © 2026 Slovor Marketplace                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Dashboard Layout (User/Admin)
```
Desktop:
┌────────────────┬────────────────────────────────────────────────┐
│ SIDEBAR (w-64) │ TOP BAR (h-16)                                 │
│ ┌────────────┐ │ ┌─────────────────────────────────────────────┐│
│ │   Logo     │ │ │ Breadcrumbs: Dashboard > Listings          ││
│ └────────────┘ │ │                              [🌙] [👤 User] ││
│                │ └─────────────────────────────────────────────┘│
│ MAIN           │                                                │
│ ├ Dashboard    │              CONTENT AREA                      │
│ ├ My Listings  │                                                │
│ └ Wallet       │              (padding: 24px)                   │
│                │                                                │
│ ACTIVITY       │                                                │
│ ├ Orders       │                                                │
│ └ Reviews      │                                                │
│                │                                                │
│ QUICK ACCESS   │                                                │
│ ├ Messages (3) │                                                │
│ └ Favorites    │                                                │
│                │                                                │
│ ────────────── │                                                │
│ ⚙️ Settings    │                                                │
│ 🚪 Sign Out    │                                                │
└────────────────┴────────────────────────────────────────────────┘

Mobile:
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (h-14)                                                   │
│ ┌────┐  ┌─────────────────────────────────────────────┐  ┌────┐│
│ │ ☰  │  │ Dashboard                                   │  │ 👤 ││
│ └────┘  └─────────────────────────────────────────────┘  └────┘│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      CONTENT AREA                               │
│                      (padding: 16px)                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ BOTTOM TAB BAR (h-16, fixed, safe-area-inset)                  │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐              │
│ │ 🏠   │  │ 🔍   │  │ ➕   │  │ ❤️   │  │ 👤   │              │
│ │ Home │  │Search│  │ Sell │  │Saved │  │ Menu │              │
│ └──────┘  └──────┘  └──────┘  └──────┘  └──────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 PART 3: COMPONENTS SPECIFICATION

### 3.1 Header Component
**File**: `/components/layout/header.tsx`

```tsx
/* STRUCTURE */
<header className="sticky top-0 z-50 h-16 border-b border-border bg-background">
  <Container className="flex h-full items-center justify-between gap-4">
    {/* Logo */}
    <Link href="/" className="shrink-0">
      <Logo />
    </Link>

    {/* Search Bar - Desktop */}
    <div className="hidden md:flex flex-1 max-w-xl mx-8">
      <SearchBar />
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2">
      {/* Mobile Search Toggle */}
      <Button variant="ghost" size="icon" className="md:hidden">
        <Search className="h-5 w-5" />
      </Button>

      {/* Post Button */}
      <Button asChild className="hidden sm:flex">
        <Link href="/post">
          <Plus className="mr-2 h-4 w-4" />
          Post Ad
        </Link>
      </Button>

      {/* Favorites */}
      <Button variant="ghost" size="icon" asChild>
        <Link href="/favorites">
          <Heart className="h-5 w-5" />
        </Link>
      </Button>

      {/* Messages */}
      <Button variant="ghost" size="icon" asChild className="relative">
        <Link href="/messages">
          <MessageCircle className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
      </Button>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* User Menu */}
      <UserMenu />
    </div>
  </Container>
</header>
```

### 3.2 Bottom Tab Bar (Mobile)
**File**: `/components/layout/bottom-tab-bar.tsx` [NEW]

```tsx
/* STRUCTURE */
<nav className="fixed bottom-0 inset-x-0 z-50 h-16 border-t border-border bg-background pb-safe md:hidden">
  <div className="flex h-full items-center justify-around px-2">
    {tabs.map((tab) => (
      <Link
        key={tab.href}
        href={tab.href}
        className={cn(
          "flex flex-col items-center justify-center flex-1 py-2 gap-1",
          "text-muted-foreground hover:text-foreground transition-colors",
          isActive(tab.href) && "text-primary"
        )}
      >
        {tab.primary ? (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white shadow-lg -mt-4">
            <tab.icon className="h-5 w-5" />
          </div>
        ) : (
          <tab.icon className="h-5 w-5" />
        )}
        <span className="text-[10px] font-medium">{tab.label}</span>
      </Link>
    ))}
  </div>
</nav>

/* TABS CONFIG */
const tabs = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Plus, label: 'Sell', href: '/post', primary: true },
  { icon: Heart, label: 'Saved', href: '/favorites' },
  { icon: User, label: 'Menu', href: '/dashboard' },
]
```

### 3.3 Sidebar Component
**File**: `/components/layout/sidebar.tsx`

```tsx
/* STRUCTURE */
<aside className={cn(
  "flex flex-col h-full bg-card border-r border-border transition-all",
  isCollapsed ? "w-20" : "w-64"
)}>
  {/* Logo */}
  <div className="flex items-center h-16 px-4 border-b border-border">
    <Logo showText={!isCollapsed} />
    <Button variant="ghost" size="icon" onClick={toggleCollapse}>
      {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
    </Button>
  </div>

  {/* Navigation */}
  <ScrollArea className="flex-1 py-4">
    {navGroups.map((group) => (
      <div key={group.title} className="mb-6">
        {/* Group Title */}
        {!isCollapsed && (
          <h3 className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {group.title}
          </h3>
        )}

        {/* Group Items */}
        <nav className="space-y-1 px-2">
          {group.items.map((item) => (
            <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
    ))}
  </ScrollArea>

  {/* Footer */}
  <div className="p-2 border-t border-border">
    <NavItem item={settingsItem} isCollapsed={isCollapsed} />
    <SignOutButton isCollapsed={isCollapsed} />
  </div>
</aside>

/* NAV GROUPS CONFIG */
const userNavGroups = [
  {
    title: 'MAIN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Package, label: 'My Listings', href: '/dashboard/listings' },
      { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
    ]
  },
  {
    title: 'ACTIVITY',
    items: [
      { icon: ShoppingBag, label: 'Orders', href: '/dashboard/orders' },
      { icon: Star, label: 'Reviews', href: '/dashboard/reviews' },
    ]
  },
  {
    title: 'QUICK ACCESS',
    items: [
      { icon: MessageCircle, label: 'Messages', href: '/messages', badge: true },
      { icon: Heart, label: 'Favorites', href: '/favorites' },
    ]
  }
]

const adminNavGroups = [
  {
    title: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { icon: Users, label: 'Users', href: '/admin/users' },
      { icon: Package, label: 'Listings', href: '/admin/listings' },
      { icon: Shield, label: 'Verifications', href: '/admin/verifications' },
    ]
  },
  {
    title: 'REPORTS',
    items: [
      { icon: Flag, label: 'Reports', href: '/admin/reports' },
      { icon: FileText, label: 'Content', href: '/admin/content' },
    ]
  }
]
```

### 3.4 Breadcrumbs Component
**File**: `/components/ui/breadcrumbs.tsx`

```tsx
/* USAGE */
<Breadcrumbs items={[
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Listings', href: '/dashboard/listings' },
  { label: 'Edit Listing' }, // No href = current page
]} />

/* STYLES */
<nav className="flex items-center gap-1.5 text-sm">
  {items.map((item, i) => (
    <Fragment key={item.label}>
      {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      {item.href ? (
        <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
          {item.label}
        </Link>
      ) : (
        <span className="font-medium text-foreground">{item.label}</span>
      )}
    </Fragment>
  ))}
</nav>
```

### 3.5 Listing Card Component
**File**: `/components/listing/card.tsx`

```tsx
/* STRUCTURE */
<article className={cn(
  "group relative overflow-hidden rounded-xl border border-border bg-card transition-all",
  "hover:shadow-lg hover:border-primary/20"
)}>
  {/* Image Container */}
  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
    <Image
      src={listing.images[0]}
      alt={listing.title}
      fill
      className="object-cover transition-transform group-hover:scale-105"
    />

    {/* Featured Badge */}
    {listing.featured && (
      <Badge className="absolute top-2 left-2 bg-amber-500">
        <Sparkles className="mr-1 h-3 w-3" />
        Featured
      </Badge>
    )}

    {/* Favorite Button */}
    <FavoriteButton
      listingId={listing.id}
      className="absolute top-2 right-2"
    />
  </div>

  {/* Content */}
  <div className="p-4">
    {/* Category */}
    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      {listing.category}
    </span>

    {/* Title */}
    <h3 className="mt-1 font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
      <Link href={`/listings/${listing.id}`}>
        {listing.title}
      </Link>
    </h3>

    {/* Location */}
    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
      <MapPin className="h-3.5 w-3.5" />
      <span className="truncate">{listing.location}</span>
    </div>

    {/* Footer */}
    <div className="mt-3 flex items-center justify-between">
      {/* Price */}
      <PriceDisplay
        price={listing.price}
        currency={listing.currency}
        className="text-lg font-bold text-foreground"
      />

      {/* Views */}
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Eye className="h-3.5 w-3.5" />
        {listing.views}
      </span>
    </div>
  </div>
</article>
```

### 3.6 Stats Card Component
**File**: `/components/dashboard/stats-card.tsx`

```tsx
/* STRUCTURE */
<Card className="relative overflow-hidden">
  <CardContent className="p-5">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-3xl font-black tracking-tight">
          {value.toLocaleString()}
        </p>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold",
            trend.direction === 'up' && "text-success",
            trend.direction === 'down' && "text-destructive"
          )}>
            {trend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{trend.value}%</span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-primary/10 p-3 text-primary">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </CardContent>

  {/* Background Decoration */}
  <div className="absolute -right-4 -bottom-4 opacity-5">
    <Icon className="h-24 w-24" />
  </div>
</Card>
```

---

## 📄 PART 4: PAGE SPECIFICATIONS

### 4.1 Homepage (`/`)
```
┌─────────────────────────────────────────────────────────────────┐
│ HERO SECTION                                                    │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │           Find anything in Slovakia                         ││
│ │           Thousands of local deals near you                 ││
│ │                                                             ││
│ │   ┌─────────────────────────────────────┐  ┌──────────┐    ││
│ │   │ 🔍 Search for anything...           │  │  Search  │    ││
│ │   └─────────────────────────────────────┘  └──────────┘    ││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ CATEGORIES (grid 2x3 mobile, 6x1 desktop)                      │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                     │
│ │ 🚗 │ │ 🏠 │ │ 📱 │ │ 👔 │ │ 🛠️ │ │ •••│                     │
│ │Cars│ │Real│ │Elec│ │Fash│ │Serv│ │More│                     │
│ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                     │
├─────────────────────────────────────────────────────────────────┤
│ FEATURED LISTINGS                                   [View All →]│
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │ Card 1  │ │ Card 2  │ │ Card 3  │ │ Card 4  │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
├─────────────────────────────────────────────────────────────────┤
│ CTA SECTION                                                     │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │  Ready to sell?  Start listing your items today!            ││
│ │                                          [Post Free Ad]     ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Search Page (`/search`)
```
Desktop:
┌────────────────────┬────────────────────────────────────────────┐
│ FILTERS (w-72)     │ RESULTS                                    │
│ ┌────────────────┐ │ ┌────────────────────────────────────────┐ │
│ │ Category       │ │ │ Showing 156 results for "iphone"       │ │
│ │ [Dropdown]     │ │ │ Sort: [Newest ▼]                       │ │
│ └────────────────┘ │ └────────────────────────────────────────┘ │
│ ┌────────────────┐ │                                            │
│ │ Price Range    │ │ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│ │ [Min] - [Max]  │ │ │ Card 1 │ │ Card 2 │ │ Card 3 │ │Card 4│ │
│ └────────────────┘ │ └────────┘ └────────┘ └────────┘ └──────┘ │
│ ┌────────────────┐ │ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│ │ Location       │ │ │ Card 5 │ │ Card 6 │ │ Card 7 │ │Card 8│ │
│ │ [Combobox]     │ │ └────────┘ └────────┘ └────────┘ └──────┘ │
│ └────────────────┘ │                                            │
│ ┌────────────────┐ │ ┌────────────────────────────────────────┐ │
│ │ Condition      │ │ │ ← 1 2 3 ... 13 →   (Pagination)        │ │
│ │ [x] New        │ │ └────────────────────────────────────────┘ │
│ │ [ ] Used       │ │                                            │
│ └────────────────┘ │                                            │
│                    │                                            │
│ [Apply Filters]    │                                            │
│ [Clear All]        │                                            │
└────────────────────┴────────────────────────────────────────────┘

Mobile:
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search...                              ] [Filters 🎛️]       │
├─────────────────────────────────────────────────────────────────┤
│ Showing 156 results                        Sort: [Newest ▼]     │
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────────────┐ ┌───────────────────┐                    │
│ │      Card 1       │ │      Card 2       │                    │
│ └───────────────────┘ └───────────────────┘                    │
│ ┌───────────────────┐ ┌───────────────────┐                    │
│ │      Card 3       │ │      Card 4       │                    │
│ └───────────────────┘ └───────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘

/* FILTER DRAWER (Mobile) */
┌─────────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────────┐      │
│ │  Filters                                        [✕]   │      │
│ └───────────────────────────────────────────────────────┘      │
│                                                                 │
│ Category                                                        │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Electronics                                              ▼ ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Price Range                                                     │
│ ┌──────────────┐  -  ┌──────────────┐                          │
│ │     Min      │     │     Max      │                          │
│ └──────────────┘     └──────────────┘                          │
│                                                                 │
│ Location                                                        │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 📍 Bratislava                                            ▼ ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Condition                                                       │
│ [x] New    [ ] Used    [ ] Any                                 │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │                     Apply Filters                           ││
│ └─────────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────────┐│
│ │                       Clear All                             ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Listing Detail (`/listings/[id]`)
```
Desktop:
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumbs: Home > Electronics > Phones > iPhone 15 Pro       │
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────┐ ┌───────────────────────────┐│
│ │                               │ │  iPhone 15 Pro 256GB      ││
│ │     IMAGE GALLERY             │ │  ─────────────────────────││
│ │     (Swipe/Click nav)         │ │  €899                     ││
│ │                               │ │                           ││
│ │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ │ │  📍 Bratislava, Slovakia  ││
│ │  │ 1  │ │ 2  │ │ 3  │ │ 4  │ │ │  📅 Posted 2 days ago     ││
│ │  └────┘ └────┘ └────┘ └────┘ │ │  👁️ 234 views             ││
│ └───────────────────────────────┘ │                           ││
│                                   │  ┌─────────────────────┐  ││
│                                   │  │   💬 Message Seller │  ││
│                                   │  └─────────────────────┘  ││
│                                   │  ┌─────────────────────┐  ││
│                                   │  │   ❤️ Save           │  ││
│                                   │  └─────────────────────┘  ││
│                                   │  ┌─────────────────────┐  ││
│                                   │  │   📤 Share          │  ││
│                                   │  └─────────────────────┘  ││
│                                   └───────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ DESCRIPTION                                                     │
│ ─────────────────────────────────────────────────────────────── │
│ Selling my iPhone 15 Pro in excellent condition...              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ DETAILS                                                         │
│ ─────────────────────────────────────────────────────────────── │
│ Condition:     New          Brand:        Apple                 │
│ Category:      Phones       Negotiable:   Yes                   │
├─────────────────────────────────────────────────────────────────┤
│ SELLER INFO                                                     │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ┌────┐  John Doe                          ⭐ 4.8 (23 reviews)││
│ │ │ 👤 │  Member since Jan 2024                                ││
│ │ └────┘  [View Profile]    [Report]                           ││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ SIMILAR LISTINGS                                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │ Card 1  │ │ Card 2  │ │ Card 3  │ │ Card 4  │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
└─────────────────────────────────────────────────────────────────┘

Mobile:
┌─────────────────────────────────────────────────────────────────┐
│ [←]  iPhone 15 Pro 256GB                        [❤️] [📤]       │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐│
│ │                                                             ││
│ │                    IMAGE GALLERY                            ││
│ │                    (Full width swipe)                       ││
│ │                                                             ││
│ │                    • • • ○ ○                                ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ €899                                              📍 Bratislava │
│ iPhone 15 Pro 256GB Natural Titanium                           │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│ Description                                                     │
│ Selling my iPhone 15 Pro in excellent condition...              │
│ [Show More]                                                     │
│ ─────────────────────────────────────────────────────────────── │
│ Details                                                         │
│ Condition: New | Brand: Apple | Category: Phones               │
│ ─────────────────────────────────────────────────────────────── │
│ Seller                                                          │
│ ┌────┐  John Doe  ⭐ 4.8                                        │
│ │ 👤 │  Member since Jan 2024                                   │
│ └────┘                                                          │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐│
│ │               💬 Message Seller                             ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Dashboard Overview (`/dashboard`)
```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard                                         [+ New Listing]│
├─────────────────────────────────────────────────────────────────┤
│ STATS ROW (grid 2x2 mobile, 4x1 desktop)                        │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│ │  📦 12    │ │  👁️ 1.2K  │ │  ❤️ 45    │ │  💬 8     │        │
│ │ Listings  │ │ Views     │ │ Favorites │ │ Messages  │        │
│ │ +2 week   │ │ +15% week │ │ +5 week   │ │ 3 unread  │        │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
├────────────────────────────────────┬────────────────────────────┤
│ PERFORMANCE CHART (2/3)            │ QUICK ACTIONS (1/3)        │
│ ┌────────────────────────────────┐ │ ┌────────────────────────┐ │
│ │                                │ │ │ [+] Create Listing     │ │
│ │     📈 Views over time         │ │ │ [↗] Promote Listing    │ │
│ │                                │ │ │ [⚙] Edit Profile       │ │
│ │     (Line chart)               │ │ └────────────────────────┘ │
│ │                                │ │                            │
│ └────────────────────────────────┘ │ ACTIVITY FEED              │
│                                    │ ┌────────────────────────┐ │
│                                    │ │ • John viewed listing  │ │
│                                    │ │ • New message from...  │ │
│                                    │ │ • Listing approved     │ │
│                                    │ └────────────────────────┘ │
├────────────────────────────────────┴────────────────────────────┤
│ RECENT LISTINGS                                     [View All →]│
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Image │ Title             │ Price  │ Status  │ Actions      ││
│ │───────│───────────────────│────────│─────────│──────────────││
│ │ [📷]  │ iPhone 15 Pro     │ €899   │ Active  │ [Edit] [•••] ││
│ │ [📷]  │ MacBook Pro 14    │ €1,499 │ Active  │ [Edit] [•••] ││
│ │ [📷]  │ AirPods Pro 2     │ €199   │ Pending │ [Edit] [•••] ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 4.5 Messages Page (`/messages`)
```
Desktop (Split View):
┌────────────────────┬────────────────────────────────────────────┐
│ CONVERSATIONS      │ CHAT                                       │
│ ┌────────────────┐ │ ┌────────────────────────────────────────┐ │
│ │ 🔍 Search...   │ │ │ [←] John Doe              [•••]        │ │
│ └────────────────┘ │ │ Re: iPhone 15 Pro                      │ │
│ ┌────────────────┐ │ └────────────────────────────────────────┘ │
│ │ ┌──┐ John Doe  │ │                                            │
│ │ │👤│ Is this...│ │                      ┌────────────────────┐│
│ │ └──┘ 2m ago  • │ │                      │ Is this still      ││
│ └────────────────┘ │                      │ available?         ││
│ ┌────────────────┐ │                      │              2:30pm││
│ │ ┌──┐ Jane Smith│ │                      └────────────────────┘│
│ │ │👤│ Thanks!   │ │ ┌────────────────────┐                     │
│ │ └──┘ 1h ago    │ │ │ Yes, it's still    │                     │
│ └────────────────┘ │ │ available! When... │                     │
│ ┌────────────────┐ │ │ 2:32pm             │                     │
│ │ ┌──┐ Mike Brown│ │ └────────────────────┘                     │
│ │ │👤│ Deal?     │ │                                            │
│ │ └──┘ 2d ago    │ │                                            │
│ └────────────────┘ │ ┌────────────────────────────────────────┐ │
│                    │ │ Type a message...              [Send]  │ │
│                    │ └────────────────────────────────────────┘ │
└────────────────────┴────────────────────────────────────────────┘

Mobile:
/* List View */
┌─────────────────────────────────────────────────────────────────┐
│ Messages                                                        │
├─────────────────────────────────────────────────────────────────┤
│ 🔍 Search conversations...                                      │
├─────────────────────────────────────────────────────────────────┤
│ ┌──┐ John Doe                                           2m ago •│
│ │👤│ Is this still available?                                   │
│ └──┘ Re: iPhone 15 Pro                                          │
├─────────────────────────────────────────────────────────────────┤
│ ┌──┐ Jane Smith                                         1h ago  │
│ │👤│ Thanks for the quick response!                             │
│ └──┘ Re: MacBook Pro 14                                         │
├─────────────────────────────────────────────────────────────────┤

/* Chat View (after tap) */
┌─────────────────────────────────────────────────────────────────┐
│ [←] John Doe                                            [•••]   │
│ Re: iPhone 15 Pro                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      ┌────────────────────┐                     │
│                      │ Is this still      │                     │
│                      │ available?  2:30pm │                     │
│                      └────────────────────┘                     │
│ ┌────────────────────┐                                          │
│ │ Yes, it's still    │                                          │
│ │ available! 2:32pm  │                                          │
│ └────────────────────┘                                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐  ┌──────┐ │
│ │ Type a message...                                │  │ Send │ │
│ └──────────────────────────────────────────────────┘  └──────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.6 Favorites Page (`/favorites`)
```
┌─────────────────────────────────────────────────────────────────┐
│ My Favorites                                    45 saved items  │
├─────────────────────────────────────────────────────────────────┤
│ Sort: [Recently Added ▼]                                        │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │ Card    │ │ Card    │ │ Card    │ │ Card    │               │
│ │ [❤️ X]  │ │ [❤️ X]  │ │ [❤️ X]  │ │ [❤️ X]  │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │ Card    │ │ Card    │ │ Card    │ │ Card    │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
├─────────────────────────────────────────────────────────────────┤
│ ← 1 2 3 4 5 →                                                   │
└─────────────────────────────────────────────────────────────────┘

/* EMPTY STATE */
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       ┌─────────┐                               │
│                       │   ❤️    │                               │
│                       └─────────┘                               │
│                                                                 │
│              No favorites yet                                   │
│              Save items you like to find them later             │
│                                                                 │
│                   [Browse Listings]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.7 Create Listing (`/post`)
```
┌─────────────────────────────────────────────────────────────────┐
│ Create New Listing                                              │
├─────────────────────────────────────────────────────────────────┤
│ STEP INDICATOR                                                  │
│ ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐                    │
│ │  1  │─────│  2  │─────│  3  │─────│  4  │                    │
│ │Basic│     │Media│     │Details    │Review│                    │
│ └─────┘     └─────┘     └─────┘     └─────┘                    │
├─────────────────────────────────────────────────────────────────┤
│ STEP 1: BASIC INFO                                              │
│                                                                 │
│ Title *                                                         │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ What are you selling?                                       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Category *                                                      │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Select category...                                       ▼  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Price *                                                         │
│ ┌───────────────────┐  ┌─────────┐                             │
│ │ 0.00              │  │ EUR  ▼  │   [ ] Negotiable            │
│ └───────────────────┘  └─────────┘                             │
│                                                                 │
│ Description *                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Describe your item in detail...                             ││
│ │                                                             ││
│ │                                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                    [Cancel]  [Next: Add Photos] │
└─────────────────────────────────────────────────────────────────┘

STEP 2: MEDIA
┌─────────────────────────────────────────────────────────────────┐
│ Add Photos                                                      │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │                                                             ││
│ │     📷 Drag and drop photos here, or click to browse        ││
│ │                                                             ││
│ │               Maximum 10 photos, 5MB each                   ││
│ │                                                             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Uploaded (3/10)                                                 │
│ ┌────┐ ┌────┐ ┌────┐                                           │
│ │ ⭐ │ │    │ │    │  (First = Cover photo)                    │
│ │ 📷 │ │ 📷 │ │ 📷 │                                           │
│ │ [X]│ │ [X]│ │ [X]│                                           │
│ └────┘ └────┘ └────┘                                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                             [Back]  [Next: Location & Details]  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.8 Settings Page (`/dashboard/settings`)
```
┌─────────────────────────────────────────────────────────────────┐
│ Settings                                                        │
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────────────┐                                           │
│ │ TABS:             │                                           │
│ │ [Profile] [Security] [Notifications] [Verification]          │
│ └───────────────────┘                                           │
├─────────────────────────────────────────────────────────────────┤
│ PROFILE TAB                                                     │
│                                                                 │
│ Profile Photo                                                   │
│ ┌────┐  [Change Photo]                                         │
│ │ 👤 │                                                         │
│ └────┘                                                         │
│                                                                 │
│ Full Name                                                       │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ John Doe                                                    ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Email                                                           │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ john@example.com                                 ✓ Verified ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Phone                                                           │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ +421 123 456 789                                            ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Bio                                                             │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Write something about yourself...                           ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                                              [Save Changes]     │
└─────────────────────────────────────────────────────────────────┘
```

### 4.9 Admin Dashboard (`/admin`)
```
┌─────────────────────────────────────────────────────────────────┐
│ Admin Dashboard                                                 │
├─────────────────────────────────────────────────────────────────┤
│ STATS ROW                                                       │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│ │  👥 1,234 │ │  📦 5,678 │ │  ⚠️ 23     │ │  📊 €45K  │        │
│ │ Users     │ │ Listings  │ │ Pending   │ │ Revenue   │        │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
├────────────────────────────────────┬────────────────────────────┤
│ SYSTEM HEALTH                      │ MODERATION QUEUE           │
│ ┌────────────────────────────────┐ │ ┌────────────────────────┐ │
│ │ Server: ✅ Online              │ │ │ [!] 5 listings pending │ │
│ │ Database: ✅ Healthy           │ │ │ [!] 3 reports to review│ │
│ │ Storage: 67% used              │ │ │ [!] 2 verifications    │ │
│ │ Uptime: 99.9%                  │ │ └────────────────────────┘ │
│ └────────────────────────────────┘ │                            │
├────────────────────────────────────┴────────────────────────────┤
│ RECENT ACTIVITY                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ • User john@email.com registered                  2 mins ago││
│ │ • New listing "iPhone 15" created                 5 mins ago││
│ │ • Report submitted on listing #1234              10 mins ago││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 PART 5: IMPLEMENTATION STEPS

### Phase 1: URL & Routing (CRITICAL)
```bash
# 1. Rename directories
mv app/[locale]/(main)/profile app/[locale]/(main)/dashboard

# 2. Move top-level features
mv app/[locale]/(main)/dashboard/messages app/[locale]/(main)/messages
mv app/[locale]/(main)/dashboard/favorites app/[locale]/(main)/favorites

# 3. Delete duplicates
rm -rf app/[locale]/(main)/dashboard/profile
rm -rf app/[locale]/(main)/dashboard/purchases  # merge into orders

# 4. Update next.config.ts
```

**File: `next.config.ts`**
```typescript
async redirects() {
  return [
    // Old to new
    { source: '/profile', destination: '/dashboard', permanent: true },
    { source: '/profile/:path*', destination: '/dashboard/:path*', permanent: true },
    // Cleanup
    { source: '/dashboard/purchases', destination: '/dashboard/orders', permanent: true },
  ]
}
```

### Phase 2: Create Bottom Tab Bar
**File: `/components/layout/bottom-tab-bar.tsx`** [NEW FILE]

Create component as specified in section 3.2.

### Phase 3: Update Sidebar
**File: `/components/layout/sidebar.tsx`**

Add group structure as specified in section 3.3.

### Phase 4: Update Header
**File: `/components/layout/header.tsx`**

Integrate search and quick actions as specified in section 3.1.

### Phase 5: Update All Layouts
1. Update main layout to include BottomTabBar
2. Update dashboard layout with new sidebar
3. Add Breadcrumbs to all pages

### Phase 6: Update All Pages
Follow page specifications in Part 4.

---

## ✅ VERIFICATION CHECKLIST

After ALL changes:

```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Build
npm run build

# 4. Test
npm run test:e2e
```

### Visual Checklist:
- [ ] Homepage loads correctly
- [ ] Search with filters works
- [ ] Listing detail page complete
- [ ] Dashboard overview with stats
- [ ] Messages split view (desktop)
- [ ] Messages list (mobile)
- [ ] Bottom tab bar visible on mobile
- [ ] Sidebar groups work
- [ ] All redirects work
- [ ] Dark mode on all pages
- [ ] Mobile responsive (375px)

---

## 🚫 FORBIDDEN

- NO `backdrop-blur` effects
- NO `bg-gradient` backgrounds
- NO `shadow-2xl` shadows
- NO `rounded-3xl` corners
- NO hardcoded colors (use CSS vars)
- NO emojis as icons (use Lucide)
- NO duplicate routes
- NO broken links

---

**END OF BLUEPRINT**
