# 🎯 MARKETPLACE CATEGORIES

> **Note:** This document references a comprehensive 25-category structure.
> Full details (120+ KB) were analyzed from successful European marketplaces.

---
## 📊 CATEGORY OVERVIEW

**Current Implementation:** 10 Slovak categories  
**Planned Expansion:** 25 full categories with subcategories

### Implemented Categories (Phase 1):

1. 📱 **Elektronika** (Electronics)
2. 🚗 **Vozidlá** (Vehicles)
3. 🏠 **Nehnuteľnosti** (Real Estate)
4. 💼 **Práca** (Jobs)
5. 🏡 **Dom a záhrada** (Home & Garden)
6. 👗 **Móda** (Fashion)
7. ⚽ **Šport a hobby** (Sports & Hobbies)
8. 🔧 **Služby** (Services)
9. 🧸 **Pre deti** (For Kids)
10. 🐕 **Zvieratá** (Animals)

---

## 📈 TRAFFIC ANALYSIS

Based on Bazos.cz, OLX.pl, Jofogas.hu:

**Top 5 by Traffic:**
1. Vehicles: 25-30%
2. Real Estate: 20-25%
3. Electronics: 8-12%
4. Fashion: 8-10%
5. Kids & Family: 8-10%

**Total Coverage:** 69-85% of marketplace traffic

---

## 🌐 MULTILINGUAL SUPPORT

**Current:** Slovak (SK) only  
**Planned:** Slovak (SK), Czech (CS), English (EN)

**Example:**
```json
{
  "slug": "vehicles",
  "name": {
    "sk": "Autá a motorky",
    "cs": "Auta a motorky",
    "en": "Vehicles"
  }
}
```

---

## 🛠️ DATABASE STRUCTURE

**Current Schema:**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**See:** `database/migrations/002_categories.sql`

---

## 🚀 EXPANSION PLAN

### Phase 2 Categories (Planned):

11. 🎮 Gaming & Consoles
12. 🎵 Music & Instruments
13. 📚 Books & Education
14. 🎭 Entertainment & Events
15. 🏋️ Fitness & Health

### Phase 3 Categories (Future):

16. 🎨 Art & Collectibles
17. 🛥️ Business Equipment
18. 🌿 Garden Plants & Tools
19. 💄 Beauty & Cosmetics
20. 🎂 Food & Beverages

### Phase 4 Categories (Advanced):

21. 🚀 Travel & Tourism
22. 💳 Financial Services
23. 🏫 Education & Courses
24. 🤝 Community & Events
25. 🏪 Local Services

---

## 📊 SUBCATEGORIES

**Example: Vehicles**

- Cars (sedans, SUVs, hatchbacks)
- Motorcycles (sport, touring, scooters)
- Trucks & Vans
- Car Parts & Accessories
- Tires & Wheels
- Car Electronics
- Trailers & Campers

**Implementation:**
```typescript
interface Category {
  id: string;
  slug: string;
  name: Record<'sk' | 'cs' | 'en', string>;
  icon: string;
  popularity: number;
  subcategories: string[];
}
```

---

## 🔍 SEO OPTIMIZATION

**Category URLs:**
```
/kategoria/elektronika
/category/electronics
/kategorie/elektronika
```

**Meta Tags:**
```html
<title>Elektronika - Kúpiť a predávať | Slovor</title>
<meta name="description" content="Nájdite telefóny, počítače, TV..." />
```

---

## 📄 CONFIGURATION FILES

**JSON Config:** `config/marketplace/categories_config.json`  
**SQL Migration:** `database/migrations/002_categories.sql`  
**TypeScript Types:** `lib/types/categories.ts`

---

## ✅ NEXT STEPS

1. Review current 10 categories
2. Plan Phase 2 expansion (5 more categories)
3. Add subcategories to existing categories
4. Implement multilingual support
5. Optimize for SEO

---

*For detailed 25-category structure with full subcategories, translations, and analytics, refer to the comprehensive category analysis document (120KB).*
