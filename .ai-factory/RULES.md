# Slovor MP Development Rules

## 1. Profiles & Names
> [!IMPORTANT]
> The database table `profiles` uses `display_name` as the primary column for user names.

- **DO NOT** use `full_name` alone in SQL queries; it is missing in the production schema.
- **Always** use `display_name`.
- In UI components, use: `{user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0]}` to ensure maximum reliability during transitions.

## 2. API Runtime
- Lightweight API routes (listings, search) should use `export const runtime = 'edge'` to save costs and avoid cold starts.

## 3. Rate Limiting
- Physical rate limiting is handled via Upstash Redis in `middleware.ts`.
- Limits are set to 10 requests per 10 seconds for `/api/*` routes.
- Monitor Upstash dashboard for quota usage.

## 4. RLS & JWT Claims
- Role-based access control MUST use JWT claims (`auth.jwt() -> 'role'`) instead of `is_staff()` database functions to keep latency low.
