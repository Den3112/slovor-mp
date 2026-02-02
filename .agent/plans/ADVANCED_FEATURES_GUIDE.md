# 🛡️ ADVANCED FEATURES GUIDE
## Trust, Safety, Analytics, Monetization, Onboarding

> **Дополнение к основным документам**
> То, что отличает успешный маркетплейс от посредственного

---

## 🔒 TRUST & SAFETY

### Seller Verification Levels
```
LEVEL 1 - BASIC (auto)
├── Email verified ✓
└── Phone verified ✓

LEVEL 2 - TRUSTED
├── ID document uploaded
├── Manual review passed
└── 5+ successful transactions

LEVEL 3 - VERIFIED SELLER
├── Business registration
├── Address verified
└── Bank account linked
├── Badge: ✅ Verified Seller
```

**UI элементы:**
```
┌─────────────────────────────────────────────────────────────────┐
│ SELLER CARD (на странице объявления)                            │
│                                                                 │
│ ┌────┐  John Doe                    ✅ Verified Seller          │
│ │ 👤 │  ⭐ 4.8 (23 reviews)                                     │
│ └────┘  📍 Bratislava | Member since Jan 2024                   │
│                                                                 │
│ Trust indicators:                                               │
│ [✓ ID Verified] [✓ Phone] [✓ Email] [✓ 50+ Sales]              │
│                                                                 │
│ Response time: Usually within 1 hour                            │
│                                                                 │
│ [💬 Message]  [View Profile]  [⚠️ Report]                       │
└─────────────────────────────────────────────────────────────────┘
```

### Fraud Prevention
- [ ] Duplicate listing detection (image hash)
- [ ] Suspicious pricing alerts (too low/high)
- [ ] Account velocity limits (new accounts)
- [ ] IP/device fingerprinting
- [ ] Link detection in messages (scam prevention)
- [ ] Report system with categories:
  - Scam/Fraud
  - Inappropriate content
  - Wrong category
  - Duplicate listing
  - Other

### Safety Features
- [ ] "Meet in safe place" suggestions
- [ ] In-app payment (escrow) - optional
- [ ] Don't share personal info warning
- [ ] Block user functionality
- [ ] Report conversation
- [ ] Safety tips page

---

## 📊 ANALYTICS & INSIGHTS

### For Users (Dashboard)
```
MY INSIGHTS PAGE (/dashboard/insights)
┌─────────────────────────────────────────────────────────────────┐
│ Performance Overview                           Last 30 days    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │                    VIEWS CHART                            │  │
│ │     📈 +34% vs last month                                 │  │
│ │                                                           │  │
│ │   /\    /\                                                │  │
│ │  /  \  /  \    /\                                         │  │
│ │ /    \/    \  /  \  /\                                    │  │
│ │              \/    \/                                     │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ TOP PERFORMING LISTINGS                                         │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 1. iPhone 15 Pro - 234 views, 12 messages, 45 saves       ││
│ │ 2. MacBook Pro   - 156 views, 8 messages, 23 saves        ││
│ │ 3. AirPods Pro   - 89 views, 5 messages, 15 saves         ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ SUGGESTIONS                                                     │
│ 💡 "iPhone 15 Pro" is getting lots of attention!               │
│    Consider promoting it for more visibility.                   │
│    [Promote Now]                                                │
└─────────────────────────────────────────────────────────────────┘
```

### For Admin
```
ADMIN ANALYTICS (/admin/analytics)
├── Daily/Weekly/Monthly Active Users
├── New registrations
├── Listings created/sold
├── Revenue from promotions
├── Moderation queue stats
├── Geographic heatmap
├── Category performance
├── Search query analytics
└── Conversion funnel
```

---

## 💰 MONETIZATION

### Revenue Streams
```
1. PROMOTED LISTINGS
   ├── Top of search - €5/day
   ├── Homepage featured - €10/day
   └── Category highlight - €3/day

2. SUBSCRIPTION PLANS (for sellers)
   ├── FREE: 5 active listings
   ├── PRO €9.99/mo: 50 listings, analytics, priority support
   └── BUSINESS €29.99/mo: Unlimited, API access, bulk upload

3. TRANSACTION FEE (optional)
   └── 5% on successful sales (if using in-app payment)

4. PREMIUM FEATURES
   ├── Background check badge - €15 one-time
   ├── Boost visibility - €2/boost
   └── Urgent badge - €3/listing
```

### Promote Listing Page (`/listings/[id]/promote`)
```
┌─────────────────────────────────────────────────────────────────┐
│ Boost Your Listing                                              │
│ "iPhone 15 Pro 256GB"                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Choose a promotion:                                             │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ⭐ FEATURED                                           €10/day││
│ │ Your listing appears on the homepage                        ││
│ │ Expected: 5x more views                                     ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 🔝 TOP OF SEARCH                                      €5/day││
│ │ First position in search results                            ││
│ │ Expected: 3x more views                                     ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 🚀 URGENT BADGE                                       €3/day││
│ │ "URGENT" label on your listing                              ││
│ │ Expected: 2x more messages                                  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Duration: [3 days ▼]                                            │
│ Total: €15.00                                                   │
│                                                                 │
│ [Pay with Card] [Pay with Wallet]                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎓 USER ONBOARDING

### New User Flow
```
STEP 1: Welcome
┌─────────────────────────────────────────────────────────────────┐
│                        Welcome to Slovor! 🎉                    │
│                                                                 │
│         The #1 marketplace in Slovakia                          │
│                                                                 │
│                    [Get Started]                                │
└─────────────────────────────────────────────────────────────────┘

STEP 2: Choose interests
┌─────────────────────────────────────────────────────────────────┐
│              What are you interested in?                        │
│                                                                 │
│  [🚗 Cars]  [🏠 Real Estate]  [📱 Electronics]                  │
│  [👔 Fashion]  [🛠️ Services]  [🎮 Gaming]                       │
│                                                                 │
│  Select categories to personalize your feed                     │
│                                                                 │
│                    [Continue]                                   │
└─────────────────────────────────────────────────────────────────┘

STEP 3: Location
┌─────────────────────────────────────────────────────────────────┐
│              Where are you located?                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📍 Bratislava                                           ▼ ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [ ] Use my current location                                    │
│                                                                 │
│                    [Finish Setup]                               │
└─────────────────────────────────────────────────────────────────┘

STEP 4: Success
┌─────────────────────────────────────────────────────────────────┐
│                     You're all set! ✅                          │
│                                                                 │
│  What would you like to do first?                               │
│                                                                 │
│  [🔍 Browse Listings]  [➕ Post Your First Ad]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### First Listing Tips
```
(Показать при создании первого объявления)

💡 Tips for a great listing:

1. 📷 Add 5+ quality photos
   ↳ Good lighting, multiple angles

2. ✍️ Write detailed description
   ↳ Condition, features, reason for selling

3. 💰 Set fair price
   ↳ Check similar listings for reference

4. ✅ Verify your profile
   ↳ Verified sellers get 3x more responses
```

---

## 📧 RETENTION & RE-ENGAGEMENT

### Email Triggers
```
| Trigger                    | Email                           |
|----------------------------|---------------------------------|
| 24h after registration     | "Complete your profile"         |
| No listing after 7 days    | "Ready to sell? Post your first"|
| Listing expired            | "Your listing expired - renew?" |
| Price drop on favorite     | "Price dropped on saved item!"  |
| New message                | "You have a new message"        |
| New listing in saved search| "New items matching your search"|
| 30 days inactive           | "We miss you! Here's what's new"|
```

### Push Notifications
```
| Event                    | Notification                    |
|--------------------------|----------------------------------|
| New message              | "John: Is this still available?"|
| Listing approved         | "Your listing is now live!"     |
| Someone saved your item  | "5 people saved your listing"   |
| Price suggestion         | "Consider lowering price by 10%"|
```

### Gamification (optional)
```
BADGES
├── 🌟 First Sale - Completed first transaction
├── ⭐ Trusted Seller - 10+ positive reviews
├── 🚀 Power Seller - 50+ sales
├── 💬 Quick Responder - Replies within 1 hour
└── ✅ Verified Pro - All verifications complete
```

---

## 🔍 SEO & METADATA

### Page-Level SEO
```typescript
// Listing page
<title>{listing.title} | Slovor Marketplace</title>
<meta name="description" content={listing.description.slice(0, 160)} />
<meta property="og:image" content={listing.images[0]} />
<meta property="og:type" content="product" />
<meta property="product:price:amount" content={listing.price} />
<meta property="product:price:currency" content={listing.currency} />

// Category page
<title>{category.name} - Buy & Sell in Slovakia | Slovor</title>
<meta name="description" content={`Browse ${category.count}+ ${category.name} listings...`} />

// Search page
<title>Search: {query} | Slovor Marketplace</title>
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "iPhone 15 Pro 256GB",
  "description": "...",
  "image": ["..."],
  "offers": {
    "@type": "Offer",
    "price": "899",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Person",
      "name": "John Doe"
    }
  }
}
```

### Sitemap
```
/sitemap.xml
├── /sitemap-pages.xml (static pages)
├── /sitemap-categories.xml (all categories)
└── /sitemap-listings-{n}.xml (listings, paginated)
```

---

## 🚨 MODERATION WORKFLOW

### Content Moderation
```
NEW LISTING SUBMITTED
        │
        ▼
┌───────────────────┐
│ AUTO-CHECK        │
│ - Banned words    │
│ - Image analysis  │
│ - Price anomaly   │
│ - Duplicate check │
└───────────────────┘
        │
   Pass │ Fail
        │    └───▶ MANUAL QUEUE
        ▼
   ┌──────────┐
   │ APPROVED │ ──▶ LIVE
   └──────────┘

MANUAL QUEUE
├── Approve
├── Reject (with reason)
├── Request changes
└── Ban user
```

### Admin Moderation Page
```
┌─────────────────────────────────────────────────────────────────┐
│ Moderation Queue                                    23 pending  │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ⚠️ FLAGGED: Suspicious pricing                              ││
│ │ ┌────┐  iPhone 15 Pro                                       ││
│ │ │ 📷 │  Price: €50 (avg: €899)                             ││
│ │ └────┘  Seller: new_user_123 (1 day old account)           ││
│ │                                                             ││
│ │ [✅ Approve] [❌ Reject] [📝 Request Edit] [🚫 Ban User]   ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 MOBILE-SPECIFIC FEATURES

### App-like Experience
- [ ] Add to Home Screen prompt (PWA)
- [ ] Offline mode (cached listings)
- [ ] Camera integration for photos
- [ ] Location services
- [ ] Push notifications (Web Push)
- [ ] Share to social apps

### Gestures
- [ ] Swipe right = save to favorites
- [ ] Swipe left = skip/hide
- [ ] Pull to refresh
- [ ] Long press = quick actions
- [ ] Double tap = zoom image

---

## ✅ FULL FEATURE CHECKLIST

### Core (Must Have)
- [x] User registration/login
- [x] Create/edit/delete listings
- [x] Search with filters
- [x] Messages
- [x] Favorites
- [x] User profiles
- [x] Categories

### Trust & Safety (Critical)
- [ ] Email verification
- [ ] Phone verification
- [ ] ID verification
- [ ] Report system
- [ ] Block users
- [ ] Fraud detection

### Monetization
- [ ] Promoted listings
- [ ] Subscription plans
- [ ] Wallet system
- [ ] Payment integration (Stripe)

### Engagement
- [ ] Email notifications
- [ ] Push notifications
- [ ] Saved searches
- [ ] Price alerts
- [ ] Onboarding flow

### Analytics
- [ ] User insights dashboard
- [ ] Admin analytics
- [ ] Conversion tracking

### SEO
- [ ] Meta tags on all pages
- [ ] Structured data
- [ ] Sitemap
- [ ] Clean URLs

---

**END OF ADVANCED FEATURES GUIDE**
