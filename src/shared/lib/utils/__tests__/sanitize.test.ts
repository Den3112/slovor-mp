import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '../sanitize'

describe('sanitizeHtml', () => {
  it('returns an empty string if input is empty', () => {
    expect(sanitizeHtml('')).toBe('')
  })

  it('allows safe HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<p>Hello <strong>World</strong></p>')
  })

  it('strips <script> tags and their contents', () => {
    const input = '<p>Hello<script>alert("xss")</script></p>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<p>Hello</p>')
  })

  it('strips unsafe attributes', () => {
    const input = '<p onclick="alert(1)">Click me</p>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<p>Click me</p>')
  })

  it('allows safe attributes on <a> tags', () => {
    const input =
      '<a href="https://example.com" title="Example" target="_blank">Link</a>'
    const result = sanitizeHtml(input)
    expect(result).toContain('href="https://example.com"')
    expect(result).toContain('target="_blank"')
  })

  it('strips <iframe> tags', () => {
    const input = '<div><iframe src="https://evil.com"></iframe></div>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<div></div>')
  })

  it('allows safe styles/classes on span/div', () => {
    const input =
      '<span class="text-red-500" style="color: red">Styled Text</span>'
    const result = sanitizeHtml(input)
    expect(result).toContain('class="text-red-500"')
    expect(result).toContain('style="color:red;"')
  })
})
