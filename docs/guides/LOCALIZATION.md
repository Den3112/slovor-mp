# Localization (i18n)

Slovor Marketplace supports 3 core languages in the following specific order:
1. **English (en)**
2. **Slovak (sk)**
3. **Czech (cs)**

> **Note**: We use the standard ISO code `cs` for Czech language.

## Structure

- **Translations**: Located in `lib/i18n/translations.ts`.
- **Context**: `I18nProvider` in `lib/i18n/index.tsx` handles client-side state and persistence.
- **Utils**: `lib/utils/listing-i18n.ts` and `category-i18n.ts` handle localized data access.

## Auto-Translation Feature

One of the unique features of Slovor is **Automatic Listing Translation**.
When a user creates a listing in their preferred language (e.g., English), the system automatically generates translations for the other supported languages (e.g., Slovak and Czech).

### How it works
1. **Input**: User submits listing title and description.
2. **Process**: `generateListingTranslations` service is called.
3. **Provider**: The system uses an external Translation API (e.g., OpenAI/DeepL) to translate text.
4. **Storage**: All 3 language versions (`title_en`, `title_sk`, `title_cz`) are stored in the database.
5. **Display**: Visitors see the listing in their selected language automatically.

## Database Schema

The `listings` and `categories` tables contain explicit columns for each language:
- `title_en`, `title_sk`, `title_cs`
- `description_en`, `description_sk`, `description_cs`

This ensures fast read performance without complex joins or JSON parsing at query time.
