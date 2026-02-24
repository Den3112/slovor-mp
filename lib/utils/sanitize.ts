import filterXSS from 'xss'

/**
 * Robust HTML sanitizer for admin-originated CMS content.
 * Uses 'xss' library to prevent XSS attacks while allowing safe formatting.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  return filterXSS(html, {
    whiteList: {
      a: ['href', 'title', 'target', 'rel'],
      b: [],
      i: [],
      u: [],
      strong: [],
      em: [],
      p: [],
      br: [],
      ul: [],
      ol: [],
      li: [],
      span: ['style', 'class'],
      div: ['style', 'class'],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      img: ['src', 'alt', 'width', 'height', 'style', 'class'],
      blockquote: [],
      code: [],
      pre: [],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
  })
}
