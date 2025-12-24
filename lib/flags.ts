// Flag emoji helper using proper Unicode code points
// This avoids issues with JSX escape sequences

export const FLAGS = {
  SK: String.fromCodePoint(0x1F1F8, 0x1F1F0), // 🇸🇰
  CZ: String.fromCodePoint(0x1F1E8, 0x1F1FF), // 🇨🇿
  GB: String.fromCodePoint(0x1F1EC, 0x1F1E7), // 🇬🇧
} as const

export type FlagCode = keyof typeof FLAGS
