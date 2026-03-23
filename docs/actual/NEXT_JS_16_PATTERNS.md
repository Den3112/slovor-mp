# Next.js 16 Architecture & Proxy

This document outlines the modern architecture patterns implemented in Slovor-MP for Next.js 16.1.6 compatibility and Edge Runtime optimization.

## 🛡️ Middleware & Proxy (`src/proxy.ts`)
We follow the Next.js 16 convention of using `proxy.ts` (proxied from `middleware.ts` if needed, but here it acts as the primary middleware entry).

### Key Features:
- **Rate Limiting**: Built-in with `@upstash/ratelimit` and `@upstash/redis` (Edge-runtime compatible).
- **CSP & Security**: Injects Base64 nonces for script and style tags.
- **I18n Detection**: Handles locale detection from cookies and headers.
- **Session Management**: Integrates with Supabase Auth session updates.

### Edge Runtime Compatibility:
- **MANDATORY**: Use `import { Redis } from '@upstash/redis'` instead of `@upstash/redis/nodejs`.
- Avoid any Node.js builtin modules (fs, path, etc.) in files running in the Edge Runtime.

## 🚀 Dashboard Routing
To prevent `ENOENT` build errors in the `(dashboard)` group, an explicit `src/app/[lang]/(dashboard)/page.tsx` is provided. It serves as a redirect to `/[lang]/dashboard/`.

## ⚙️ Build Optimization
- **Static Generation**: Marketing and informational pages (`about`, `faq`, etc.) MUST use `export const dynamic = 'force-static'`.
- **Node.js**: Target version is `20.x`.
