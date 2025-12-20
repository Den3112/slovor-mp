# Database Seeds

Test data for local development.

## Usage

### Via Supabase Dashboard

1. Go to SQL Editor
2. Paste contents of `001_seed_categories_listings.sql`
3. Run

### Via psql (if you have direct access)

```bash
psql $DATABASE_URL -f database/seeds/001_seed_categories_listings.sql
```

## ⚠️ Warning

**NEVER run seeds in production!** Seeds use `TRUNCATE` which deletes all data.

Use seeds ONLY for:
- Local development
- Testing
- Preview environments

## Contents

### 001_seed_categories_listings.sql

- 10 Slovak marketplace categories
- ~25 realistic test listings
- Covers all categories
- Realistic Slovak locations and prices

## After Running Seeds

Your database will have:

- **Categories**: Elektronika, Vozidlá, Nehnuteľnosti, etc.
- **Listings**: iPhone, Škoda Octavia, 2-izbový byt, etc.
- **Status**: All active
- **Featured**: Some marked as featured for homepage

## Customization

To add more listings:

1. Copy existing INSERT statement
2. Change title, description, price
3. Adjust category_id variable
4. Keep same format

## Notes

- Listings require `user_id` - currently uses NULL (will fail if FK constraint exists)
- In production setup, you need real user accounts first
- Prices in EUR (Slovak standard)
- Locations are real Slovak cities
