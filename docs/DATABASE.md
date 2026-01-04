# Database Schema

## Overview

Slovor Marketplace uses Supabase (PostgreSQL) as its database backend.

## Tables

### `users` / `profiles`
User profile information linked to Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (matches auth.users.id) |
| `email` | TEXT | User email |
| `display_name` | TEXT | Display name |
| `username` | TEXT | Unique username |
| `avatar_url` | TEXT | Profile picture URL |
| `bio` | TEXT | User bio |
| `phone` | TEXT | Phone number |
| `location` | TEXT | Location |
| `verified` | BOOLEAN | Whether user is verified |
| `created_at` | TIMESTAMPTZ | Account creation date |
| `updated_at` | TIMESTAMPTZ | Last update date |

### `categories`
Product categories for listings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Category name (English key) |
| `name_sk` | TEXT | Slovak translation |
| `name_cs` | TEXT | Czech translation |
| `slug` | TEXT | URL-friendly identifier |
| `icon` | TEXT | Icon identifier |
| `description` | TEXT | Category description |
| `parent_id` | UUID | Parent category (for subcategories) |
| `created_at` | TIMESTAMPTZ | Creation date |

### `listings`
Product listings posted by users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to users |
| `category_id` | UUID | Foreign key to categories |
| `title` | TEXT | Listing title |
| `title_sk` | TEXT | Slovak title |
| `title_cs` | TEXT | Czech title |
| `description` | TEXT | Listing description |
| `description_sk` | TEXT | Slovak description |
| `description_cs` | TEXT | Czech description |
| `price` | DECIMAL | Price |
| `currency` | TEXT | Currency code (EUR, etc.) |
| `location` | TEXT | Item location |
| `condition` | TEXT | Item condition (new, used, etc.) |
| `images` | TEXT[] | Array of image URLs |
| `status` | TEXT | Listing status (active, sold, etc.) |
| `views` | INTEGER | View count |
| `featured` | BOOLEAN | Whether listing is featured |
| `created_at` | TIMESTAMPTZ | Creation date |
| `updated_at` | TIMESTAMPTZ | Last update |

### `favorites`
User favorites/bookmarks.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to users |
| `listing_id` | UUID | Foreign key to listings |
| `created_at` | TIMESTAMPTZ | When favorited |

**Constraints:**
- UNIQUE(`user_id`, `listing_id`) - Prevents duplicate favorites

## Row Level Security (RLS)

All tables have RLS enabled:

### profiles
- Users can view all profiles (public)
- Users can only update their own profile

### listings
- Everyone can view active listings
- Users can only edit/delete their own listings

### favorites
- Users can only view/add/delete their own favorites

## Foreign Key Relationships

```
users
  ↳ listings (user_id)
  ↳ favorites (user_id)
  ↳ profiles (id)

categories
  ↳ listings (category_id)
  ↳ categories (parent_id) - self-referential

listings
  ↳ favorites (listing_id)
```

## Migrations

Located in `supabase/migrations/`:

1. `20250102_create_profiles.sql` - User profiles table
2. `20250101_add_listing_localization.sql` - Localized listing fields
3. `20250104_create_favorites.sql` - Favorites table
4. `20260104_fix_profiles_schema.sql` - Profiles schema fixes
