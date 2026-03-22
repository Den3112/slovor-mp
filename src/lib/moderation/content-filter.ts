import { isValidSlovakLocation } from '@/lib/constants/slovak-cities'

// Banned words dictionary (obfuscated patterns to avoid false positives)
// These are common profanity roots that will match variations
const BANNED_PATTERNS: RegExp[] = [
  // English profanity
  /\bf+u+c+k+/gi,
  /\bs+h+i+t+/gi,
  /\ba+s+s+h+o+l+e+/gi,
  /\bb+i+t+c+h+/gi,
  /\bc+u+n+t+/gi,
  /\bd+i+c+k+/gi,
  /\bp+u+s+s+y+/gi,
  /\bn+i+g+g+/gi,
  /\bf+a+g+g?o?t?/gi,
  /\bwh+o+r+e+/gi,
  /\bs+l+u+t+/gi,
  /\bd+a+m+n+/gi,
  /\bba+st+a+rd+/gi,

  // Slovak profanity
  /\bjeb+a+[ntť]+/gi,
  /\bkurv+a+/gi,
  /\bpič+a+/gi,
  /\bkokot+/gi,
  /\bchuj+/gi,
  /\bhov+n+o+/gi,
  /\bdeb+i+l+/gi,
  /\bsrať+/gi,
  /\bprd+e+l+/gi,
  // Exact junk patterns from analysis
  /\bFu\.\.ng\b/gi,
]

// Spam patterns
const SPAM_PATTERNS: RegExp[] = [
  // Repeated characters (5+ same char)
  /(.)\1{4,}/gi,
  // All caps words (10+ chars)
  /\b[A-Z]{10,}\b/g,
  // Excessive punctuation
  /[!?]{5,}/g,
  // Known spam phrases
  /\b(buy now|click here|free money|make money fast|casino|lottery|bitcoin doubler)\b/gi,
  // Telegram/WhatsApp spam
  /\b(telegram|whatsapp|viber)\s*:?\s*\+?[\d\s-]{8,}/gi,
  // Junk repeated patterns (e.g. "sssssss", "saaaaaaaaa")
  /\b(s|a){5,}\b/gi,
]

export interface ContentFilterResult {
  isClean: boolean
  hasProfanity: boolean
  hasSpam: boolean
  flaggedWords: string[]
  flaggedPatterns: string[]
}

/**
 * Filters content for profanity and spam
 * @param text - Text to check (title or description)
 * @returns ContentFilterResult with details about found issues
 */
export function filterContent(text: string): ContentFilterResult {
  const result: ContentFilterResult = {
    isClean: true,
    hasProfanity: false,
    hasSpam: false,
    flaggedWords: [],
    flaggedPatterns: [],
  }

  if (!text || typeof text !== 'string') {
    return result
  }

  // Check profanity
  for (const pattern of BANNED_PATTERNS) {
    const matches = text.match(pattern)
    if (matches) {
      result.hasProfanity = true
      result.isClean = false
      result.flaggedWords.push(...matches.map((m) => m.toLowerCase()))
    }
  }

  // Check spam
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      result.hasSpam = true
      result.isClean = false
      result.flaggedPatterns.push(pattern.source)
    }
  }

  // Deduplicate flagged words
  result.flaggedWords = [...new Set(result.flaggedWords)]

  return result
}

/**
 * Checks if listing content is acceptable for publishing
 * @param title - Listing title
 * @param description - Listing description
 * @param location - Listing location
 * @returns Object with validation result and error message if any
 */
export function validateListingContent(
  title: string,
  description: string,
  location?: string
): { isValid: boolean; error: string | null; details: ContentFilterResult } {
  const titleResult = filterContent(title)
  const descriptionResult = filterContent(description)

  // Check location if provided
  let locationValid = true
  if (location && !isValidSlovakLocation(location)) {
    locationValid = false
  }

  const combinedResult: ContentFilterResult = {
    isClean: titleResult.isClean && descriptionResult.isClean && locationValid,
    hasProfanity: titleResult.hasProfanity || descriptionResult.hasProfanity,
    hasSpam: titleResult.hasSpam || descriptionResult.hasSpam || !locationValid,
    flaggedWords: [
      ...titleResult.flaggedWords,
      ...descriptionResult.flaggedWords,
    ],
    flaggedPatterns: [
      ...titleResult.flaggedPatterns,
      ...descriptionResult.flaggedPatterns,
    ],
  }

  if (!combinedResult.isClean) {
    let error = 'Obsah obsahuje nevhodné výrazy. '

    if (combinedResult.hasProfanity) {
      error += 'Prosím, odstráňte vulgárne slová. '
    }

    if (combinedResult.hasSpam) {
      if (!locationValid) {
        error += 'Neplatná lokalita. Prosím, vyberte mesto na Slovensku. '
      } else {
        error += 'Text obsahuje spam alebo podozrivý obsah. '
      }
    }

    return {
      isValid: false,
      error: error.trim(),
      details: combinedResult,
    }
  }

  return {
    isValid: true,
    error: null,
    details: combinedResult,
  }
}

/**
 * Sanitizes text by replacing profanity with asterisks
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeContent(text: string): string {
  if (!text || typeof text !== 'string') {
    return text
  }

  let sanitized = text

  for (const pattern of BANNED_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match) => '*'.repeat(match.length))
  }

  return sanitized
}
