# Database Seeds

Test data for local development.

## Usage

### Via Supabase Dashboard (Recommended)

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

**Creates:**
- 1 test user: `test@slovor.sk` (password: `testpassword123`)
- 10 Slovak marketplace categories
- ~25 realistic test listings

**Data includes:**
- Realistic Slovak locations (Bratislava, Košice, Žilina, etc.)
- Realistic prices in EUR
- Slovak language content
- Mix of featured/non-featured listings

## After Running Seeds

Your database will have:

- **Test User**: test@slovor.sk / testpassword123
- **Categories**: Elektronika, Vozidlá, Nehnuteľnosti, etc.
- **Listings**: iPhone, Škoda Octavia, 2-izbový byt, etc.
- **Status**: All active
- **Featured**: Some marked as featured for homepage

## Test User Credentials

```
Email: test@slovor.sk
Password: testpassword123
User ID: 00000000-0000-0000-0000-000000000001
```

Use these credentials to:
- Login to the app
- Create new listings
- Test user features

## Customization

To add more listings:

1. Copy existing INSERT statement
2. Change title, description, price
3. Use `test_user_id` variable for user_id
4. Adjust category_id variable
5. Keep same format

## Notes

- Seeds create user in `auth.users` table
- If you get permissions error on user creation, create user manually via Supabase Dashboard first
- All listings belong to test user
- Prices in EUR (Slovak standard)
- Locations are real Slovak cities

## Troubleshooting

### Error: "null value in column user_id"

**Solution:** Run the full seed script - it creates test user first!

### Error: "permission denied for table auth.users"

**Solution:** Create test user manually via Supabase Dashboard → Authentication → Add user, then comment out the user creation part in seed script.

### Error: "duplicate key value violates unique constraint"

**Solution:** Seeds already ran! Either:
1. Skip running seeds again
2. Or run `TRUNCATE` commands first (warning: deletes data!)
