import sanitize from 'sanitize-html'

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Uses sanitize-html which works in both Server and Client components
 * without native dependencies (unlike isomorphic-dompurify/jsdom).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'span',
      'figure',
      'figcaption',
      'iframe',
    ]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['href', 'target', 'rel'],
      span: ['class', 'style'],
      div: ['class', 'style'],
      p: ['class', 'style'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  })
}
