// Flag emoji helper using proper Unicode code points
// This avoids issues with JSX escape sequences

export const FLAGS = {
  SK: '\uD83C\uDDF8\uD83C\uDDF0', // 🇸🇰
  CZ: '\uD83C\uDDE8\uD83C\uDDFF', // 🇨🇿
  GB: '\uD83C\uDDEC\uD83C\uDDE7', // 🇬🇧
} as const

export type FlagCode = keyof typeof FLAGS
