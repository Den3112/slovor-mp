# Project Description: Slovor Marketplace

## Overview
Slovor Marketplace is a premium Slovakian classifieds marketplace built with modern web technologies. It focuses on a high-end "Customer CRM" UI design (avant-garde aesthetic) and provides a robust platform for listing discovery and user interactions.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI/UX**: React 19, Tailwind CSS 4, shadcn/ui, Framer Motion
- **Backend/Database**: Supabase (Auth, PostgreSQL with RLS, Storage)
- **State Management**: React Hooks, Server Components
- **I18n**: Multi-language support (EN, SK, RU, CS)
- **Rate Limiting**: Upstash Redis (implemented in middleware)
- **Monitoring/Analytics**: Vercel Analytics & Speed Insights
- **Testing**: Vitest, Playwright (E2E & Visual)

## Project Structure
- `app/[locale]/`: localized routes and pages
- `components/features/`: domain-specific UI components (dashboard, listing, search)
- `components/ui/`: base design system components
- `lib/`: shared utilities, types, and hooks
- `supabase/`: database migrations, policies, and seed scripts

## Core Features
1. **Listing Discovery**: Advanced search and category-based filtering.
2. **User Profiles**: Secure authentication and display name management.
3. **Dashboard**: Premium CRM-style interface for users, sellers, and admins.
4. **Localization**: Dynamic routing and content translation across 4 locales.

## Development Status
Current Phase: Beta Development / Investor-Ready Polish.
Key focus areas include the Premium User Dashboard, advanced media management, and smart search interactions.
