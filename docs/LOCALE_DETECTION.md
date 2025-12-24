# Smart Locale Detection System

## Overview

Slovor Marketplace automatically detects and suggests the best language for each user based on their location and browser preferences.

## Features

### 1. Welcome Modal
- Shows on first visit only
- Displays detected language as "Detected"
- Allows manual language selection
- Can be skipped (defaults to detected language)
- Never shows again after user choice

### 2. Multi-Level Detection

The system uses a fallback chain for optimal accuracy:

```
1. User Preference (localStorage)
   ↓ (if not found)
2. IP-based Country Detection
   ↓ (if fails)
3. Browser Language
   ↓ (if not supported)
4. English (default)
```

### 3. IP-Based Detection

API Endpoint: `/api/detect-locale`

**Supported Headers:**
- `x-vercel-ip-country` (Vercel)
- `cf-ipcountry` (Cloudflare)
- `accept-language` (fallback)

**Country Mappings:**
```typescript
SK (Slovakia)      → sk
CZ (Czech Republic) → cs
US, GB, CA, AU     → en
```

### 4. SEO & Browser Integration

Automatically updates:
- `<html lang="...">` attribute
- `<meta property="og:locale" content="...">`
- `<meta http-equiv="content-language" content="...">`

This ensures:
- ✅ Google indexes correct language versions
- ✅ Browser translators detect page language
- ✅ Social media shows correct locale

## Technical Implementation

### Components

**`LocaleWelcomeModal`** (`components/locale/LocaleWelcomeModal.tsx`)
- Modal dialog for first-time visitors
- Stores choice in `localStorage: slovor-welcome-shown`

**`I18nProvider`** (`lib/i18n/index.tsx`)
- Context provider for translations
- Handles locale detection and persistence
- Updates HTML attributes dynamically

**`/api/detect-locale`** (`app/api/detect-locale/route.ts`)
- Server-side country detection
- Returns suggested locale based on IP

## User Flow

### First Visit
```
User lands on site
  ↓
System detects locale (IP + Browser)
  ↓
Welcome modal appears
  ↓
User selects language OR skips
  ↓
Choice saved to localStorage
  ↓
HTML lang updated
  ↓
Page content rendered in selected language
```

### Return Visit
```
User returns to site
  ↓
System reads localStorage
  ↓
HTML lang updated immediately
  ↓
No modal shown
  ↓
Page content rendered in saved language
```

## Configuration

### Adding New Languages

1. Add to `translations.ts`:
```typescript
export const translations = {
  // ... existing
  de: { /* German translations */ }
}
```

2. Update locale type:
```typescript
export type Locale = 'sk' | 'cs' | 'en' | 'de'
```

3. Add to welcome modal:
```typescript
const localeOptions: LocaleOption[] = [
  // ... existing
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
]
```

4. Add country mapping:
```typescript
const COUNTRY_TO_LOCALE: Record<string, string> = {
  // ... existing
  DE: 'de',
  AT: 'de',
  CH: 'de',
}
```

### Disabling Welcome Modal

Set localStorage manually:
```javascript
localStorage.setItem('slovor-welcome-shown', 'true')
```

### Testing Different Locales

1. Clear localStorage:
```javascript
localStorage.removeItem('slovor-locale')
localStorage.removeItem('slovor-welcome-shown')
```

2. Refresh page to see welcome modal

3. Or manually set locale:
```javascript
localStorage.setItem('slovor-locale', 'sk')
```

## Browser Translator Integration

### How It Works

When a user changes language:
1. `document.documentElement.lang` is updated to `sk`, `cs`, or `en`
2. Browser detects page language from HTML attribute
3. Browser translator (Chrome, Edge, Firefox) reads this attribute
4. If enabled, auto-translation is disabled (we handle i18n)

### Preventing Auto-Translation

```html
<meta name="google" content="notranslate" />
```

This prevents Google Translate from automatically translating the page since we provide native translations.

## Performance

- **First Load**: ~100ms (IP detection)
- **Return Visits**: <10ms (localStorage read)
- **No Network Calls**: After first detection
- **SEO Friendly**: Server-side rendering with correct lang attribute

## Best Practices

1. **Always provide fallback**: Default to English if detection fails
2. **Respect user choice**: Never override manual language selection
3. **Update HTML attributes**: Ensure SEO and accessibility
4. **Cache locale**: Avoid repeated API calls
5. **Show modal once**: Don't annoy returning users

## Troubleshooting

### Modal doesn't appear
- Check `localStorage`: `slovor-welcome-shown` should not exist
- Clear localStorage and refresh

### Wrong language detected
- Check API response: `/api/detect-locale`
- Verify country code mappings
- Check browser `navigator.language`

### Language not persisting
- Check localStorage permissions
- Verify `setLocale()` is called
- Check for JavaScript errors

## Future Enhancements

- [ ] Add more country mappings (PL, HU, RO, etc.)
- [ ] Remember dismissed modal separately from language choice
- [ ] Add language switcher in user profile
- [ ] Support regional variants (en-US vs en-GB)
- [ ] Add RTL language support (Arabic, Hebrew)
