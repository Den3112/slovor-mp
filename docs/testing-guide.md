# Testing Documentation

## Environment Configuration

### Geo API Mocking
To prevent external API rate limits and failures during automated testing, the Geolocation service (`lib/geo.ts`) is mocked when running in the `test` environment.

**Behavior:**
- When `process.env.NODE_ENV === 'test'`, `getGeoByIp()` immediately returns a static fallback object (Slovakia defaults) without making network requests.
- This ensures tests run faster and are deterministic.

**Usage:**
Run tests with the test environment variable (automatically set by Vitest/Playwright):
```bash
npm run test
# or
npm run test:e2e
```

### Authentication Bypass
E2E tests use `e2e/global-setup.ts` to automatically authenticate a test user (`test.seller@slovor.sk`).
To bypass Supabase Auth Rate Limits (crucial for CI/Testing), the setup uses the **Supabase Admin API** (Service Role) to generate a magic link.

**Requirements:**
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is present in `.env.local`.
- Ensure `NEXT_PUBLIC_SUPABASE_URL` is correct.

If the Service Role Key is missing, the setup falls back to manual form login, which may fail due to rate limits.

## Storybook
Storybook is used for isolated component development and visual regression testing of themes (Dark/Light).

**Running Storybook:**
```bash
npm run storybook
```

**Dark Mode:**
Storybook is configured with `next-themes` support. Use the toolbar background/theme switcher to toggle between Light and Dark modes.
