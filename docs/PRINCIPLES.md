# 🔥 Code Principles - MANDATORY

**IMPORTANT:** These 8 principles MUST be followed in SLOVOR Marketplace. Read and understand them before writing any code.

These are not fancy patterns. These are simple, proven rules that work.

---

## 1. 📈 Minimize Code

**Keep it small and simple.**

- Small classes
- Small functions (under 20 lines ideally)
- Small libraries and modules

**Why?**
- Less code = fewer bugs
- Easier to understand
- Lower cognitive load
- Easier to test
- Easier to change

**Example (Bad):**
```typescript
// 150 lines function doing everything
function processListings(data: any[], filters: any, config: any) {
  // validation
  // filtering
  // mapping
  // sorting
  // caching
  // error handling
  // logging
}
```

**Example (Good):**
```typescript
// Multiple focused functions
function validateListings(data: any[]): boolean { /* ... */ }
function applyFilters(listings: Listing[], filters: Filter[]): Listing[] { /* ... */ }
function sortListings(listings: Listing[], by: string): Listing[] { /* ... */ }
function cacheResult(key: string, data: any): void { /* ... */ }
```

---

## 2. 🔗 Minimize Coupling

**Objects should know as little as possible about each other.**

- Use interfaces, not concrete implementations
- Use callbacks/hooks instead of direct calls
- Use Dependency Injection
- Avoid reaching into other objects' properties

**Why?**
- Changes in one place don't break everything
- Code is reusable
- Easier to test (mock dependencies)
- Can swap implementations

**Example (Bad):**
```typescript
// ListingCard knows all about database
class ListingCard {
  constructor(private db: Database) {}
  
  async delete() {
    await this.db.listings.delete(this.id);
    await this.db.logs.add(...);
    this.db.cache.invalidate(...);
  }
}
```

**Example (Good):**
```typescript
// ListingCard just accepts callbacks
interface ListingCardProps {
  listing: Listing;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (listing: Listing) => void;
}

function ListingCard({ listing, onDelete, onUpdate }: ListingCardProps) {
  return (
    <button onClick={() => onDelete(listing.id)}>
      Delete
    </button>
  );
}
```

---

## 3. 👤 Single Ownership

**Each piece of logic has ONE owner, ONE place where it lives.**

- Don't spread logic across 10 files
- Don't have 5 places handling the same concern
- One file/component/function = one responsibility

**Why?**
- Prevents conflicts
- Clear who maintains it
- Clear where to find bugs
- Clear where to make changes

**Example (Bad):**
```typescript
// Validation logic scattered everywhere
// components/ListingForm.tsx - validation 1
// lib/api/listings.ts - validation 2  
// middleware.ts - validation 3
// utils/validators.ts - validation 4
```

**Example (Good):**
```typescript
// lib/api/listings.ts - ONE place for all validation
export const validateListing = (data: any): ValidationResult => {
  // All validation logic here
};

// Used everywhere else
import { validateListing } from '@/lib/api/listings';
```

---

## 4. 🎯 Explicit > Magic

**Show the code, don't hide it.**

- No auto-scanning, auto-wiring, magic decorators
- No hidden framework magic
- Visible imports
- Clear function calls
- Explicit configuration

**Why?**
- When something breaks, you know where to look
- You understand what's happening
- Easier to debug
- Easier to onboard new developers

**Example (Bad):**
```typescript
// What's happening here? Magic.
@Route("/listings")
@Authenticate
@Cache(300)
@Logger
export class ListingsController {
  // Where do dependencies come from? Unknown.
  // When does logger run? Unknown.
  // When is caching applied? Unknown.
}
```

**Example (Good):**
```typescript
// Everything is explicit
export async function getListings(req: Request): Response {
  // 1. Authenticate
  const user = await auth(req);
  if (!user) return unauthorized();
  
  // 2. Validate
  const filters = validateFilters(req.query);
  
  // 3. Query (might be cached internally)
  const listings = await listingsApi.getAll(filters);
  
  // 4. Log
  logger.info('Listings fetched', { userId: user.id, count: listings.length });
  
  // 5. Return
  return ok(listings);
}
```

---

## 5. ⚠️ Errors Are Design

**Handle errors from the beginning, not as an afterthought.**

- Every network call needs timeout
- Every external service needs retry logic
- Every user input needs validation
- Every async operation needs error handling
- Errors should be caught early and handled gracefully

**Why?**
- Users don't see cryptic errors
- System degrades gracefully
- Debugging is easier
- Reliability increases

**Example (Bad):**
```typescript
// Will crash if API is slow or down
const listings = await fetch('/api/listings').then(r => r.json());
```

**Example (Good):**
```typescript
const listings = await withTimeout(
  fetch('/api/listings', { signal: AbortSignal.timeout(5000) })
    .then(r => r.json())
    .catch(err => {
      logger.error('Failed to fetch listings', err);
      // Return fallback data or empty array
      return [];
    }),
  5000 // timeout
);
```

---

## 6. 📄 Code for Humans

**Code is read 10x more than it's written.**

- Clear variable names
- Clear function names
- Logical structure
- Comments explaining WHY, not WHAT
- No clever tricks

**Why?**
- Others understand it
- You understand it 6 months later
- Bugs are found faster
- Changes are made safer

**Example (Bad):**
```typescript
const d = new Date().getTime();
const r = a.filter(x => x.t > d - 86400000).map(x => ({ ...x, u: x.v / x.c }));
```

**Example (Good):**
```typescript
const now = new Date().getTime();
const oneDayMs = 24 * 60 * 60 * 1000;
const recentListings = listings
  .filter(listing => listing.createdAt > now - oneDayMs)
  .map(listing => ({
    ...listing,
    pricePerUnit: listing.price / listing.quantity,
  }));
```

---

## 7. 🌚 Minimize Global State

**Global state = hidden dependencies = chaos.**

- Keep state local
- Pass state as props
- If you need global state, make it explicit and controlled
- Use Context API instead of implicit globals

**Why?**
- Clear data flow
- Easier to test
- Fewer surprises
- Easier to debug

**Example (Bad):**
```typescript
// Global state, modified anywhere
global.currentUser = user;  // Anywhere can change this
global.cache = {};          // Hidden dependency

function getListings() {
  // Who modified currentUser? When? Why?
  console.log(global.currentUser);
}
```

**Example (Good):**
```typescript
// Context - explicit and controlled
export const UserContext = createContext<User | null>(null);

export function UserProvider({ children, user }: Props) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

// Usage - clear dependency
function getListings() {
  const user = useContext(UserContext);
  // Clear where it comes from
}
```

---

## 8. 📈 KISS - Keep It Simple, Stupid

**Simple is almost always better.**

- Choose simple over clever
- Choose simple over optimize
- Choose simple over flexible
- Simple solution that works > complex solution that might work better

**Why?**
- Fewer bugs
- Faster to build
- Cheaper to maintain
- Easier to understand
- More reliable

**Example (Bad - Over-engineered):**
```typescript
// Trying to be too clever and flexible
type Strategy = 'quick' | 'thorough';
type Priority = 'high' | 'medium' | 'low';
type CacheLevel = 'memory' | 'disk' | 'redis' | 'distributed';

class ListingsFetcher {
  constructor(
    private strategy: Strategy,
    private priority: Priority,
    private cache: CacheLevel,
    // 20 more parameters...
  ) {}
  
  async fetch(filters: any, options: any): Promise<any> {
    // 200 lines of conditional logic
  }
}
```

**Example (Good - Simple and clear):**
```typescript
// Just do it the simple way
async function getListings(filters: Filter[]): Promise<Listing[]> {
  // Check memory cache first
  const cached = memoryCache.get('listings');
  if (cached) return cached;
  
  // Fetch from database
  const listings = await db.listings.where(filters);
  
  // Cache it
  memoryCache.set('listings', listings, 5 * 60 * 1000); // 5 min
  
  return listings;
}
```

---

## 💋 Quick Checklist

Before you commit code, ask yourself:

- [ ] **Is this code small?** Can I understand it in 2 minutes?
- [ ] **Is coupling minimal?** Does it depend on too many things?
- [ ] **Is there one owner?** Is this logic in one place?
- [ ] **Is it explicit?** Can someone see what's happening?
- [ ] **Are errors handled?** What happens if something fails?
- [ ] **Is it readable?** Would I understand it in 6 months?
- [ ] **Is state minimal?** Can I reduce global state?
- [ ] **Is it simple?** Is there a simpler way?

If you answer "no" to any of these, refactor before committing.

---

## 📚 References

- **SOLID Principles** - Focus on Single Responsibility
- **DRY** - Don't Repeat Yourself
- **YAGNI** - You Aren't Gonna Need It
- **Clean Code** - Robert C. Martin
- **The Pragmatic Programmer**

---

## 📢 Questions?

If you have questions about these principles, open a Discussion in the repository.

Remember: **Simple code is professional code.**
