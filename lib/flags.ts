// Flag emoji helper - using real UTF-8 emoji characters
// These are the actual emoji symbols, not escape sequences

export const FLAGS = {
  SK: '🇸🇰',  // Slovakia flag
  CZ: '🇨🇿',  // Czech Republic flag  
  GB: '🇬🇧',  // United Kingdom flag
} as const

export const PARTY = '🎉'  // Party popper

export type FlagCode = keyof typeof FLAGS
