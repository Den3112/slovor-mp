# Modernization & Adaptation Plan (Slovor MP)

## Goal
Transform the existing codebase into a **premium, fast, and stable** marketplace for **Slovakia**, featuring "Avant-Garde" design and missing core features.

## User Review Required
> [!IMPORTANT]
> **Branding Change**: Switching from Ukraine to Slovakia. Currency to EUR.
> **Design Overhaul**: "Avant-Garde" style will replace the current generic look.

## Proposed Changes

### Foundation & Branding
#### [MODIFY] [tailwind.config.js](file:///d:/slovor-mp/tailwind.config.js)
-  Implement "Avant-Garde" palette: Zinc-950 background, Electric Violet/Teal accents.
-  Add `outfit` and `inter` font families.
-  Add custom animations (fade-in-up, shine, glass-effect).

#### [MODIFY] [globals.css](file:///d:/slovor-mp/app/globals.css)
-  Reset CSS for consistent dark mode.
-  Add utility classes for glassmorphism (`.glass`).

#### [MODIFY] [layout.tsx](file:///d:/slovor-mp/app/layout.tsx)
-  Update Metadata (Title, Description).
-  Add Font definitions (Google Fonts).

### UI Components (shadcn/radix compatible)
We will likely need to install or update basics.
-  Buttons: Premium hover effects, slight noise texture?
-  Cards: Glass backgrounds, subtle borders.

### Core Features
#### [NEW] Authentication
-  Setup Supabase Auth (Email/Password + Google).
-  Create `/auth/login` and `/auth/register` pages.
-  Update `middleware.ts` for protected routes.

#### [NEW] Listing Creation
-  Create `/listings/create` page.
-  Multi-step form:
    1. Category Select
    2. Details (Title, Desc, Price)
    3. Image Upload (Supabase Storage)
    4. Review & Submit

## Verification Plan
1.  **Visual Check**: Verify "Avant-Garde" look on Homepage and Listings.
2.  **Flow Check**: Test Login -> Create Listing -> View Listing.
3.  **Performance**: Ensure 90+ Lighthouse score.
