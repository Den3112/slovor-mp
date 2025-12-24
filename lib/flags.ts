// Flag emoji helper - direct emoji literals work best
// Avoids issues with Unicode escape sequences and String.fromCodePoint

export const FLAGS = {
  SK: '🇸🇰',
  CZ: '🇨🇿',
  GB: '🇬🇧',
} as const

export const PARTY = '🎉'

export type FlagCode = keyof typeof FLAGS
