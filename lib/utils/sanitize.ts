/**
 * Lightweight HTML sanitizer for admin-originated CMS content.
 * No external dependencies — works in both Server and Client components.
 *
 * Strips dangerous tags (script, iframe, object, embed, form)
 * and event handler attributes (onclick, onerror, etc.)
 */

const DANGEROUS_TAGS =
  /<\s*\/?\s*(script|iframe|object|embed|form|applet|base|link(?=\s))[^>]*>/gi

const EVENT_HANDLERS = /\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi

const JAVASCRIPT_URLS = /\s+(href|src|action)\s*=\s*["']?\s*javascript\s*:/gi

export function sanitizeHtml(html: string): string {
  if (!html) return ''

  return html
    .replace(DANGEROUS_TAGS, '')
    .replace(EVENT_HANDLERS, '')
    .replace(JAVASCRIPT_URLS, '')
}
