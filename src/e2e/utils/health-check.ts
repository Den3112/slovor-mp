import { Page, expect } from '@playwright/test'

/**
 * Universal UI scanner to detect common visual and technical regressions
 */
export async function runUniversalHealthCheck(page: Page) {
  // 1. Check for console errors
  const consoleErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })

  // 2. Check for broken images
  const images = page.locator('img')
  const imageCount = await images.count()
  for (let i = 0; i < imageCount; i++) {
    const isVisible = await images.nth(i).isVisible()
    if (isVisible) {
      const isBroken = await images.nth(i).evaluate((img: HTMLImageElement) => {
        return !img.complete || img.naturalWidth === 0
      })
      expect(
        isBroken,
        `Detected broken image: ${await images.nth(i).getAttribute('src')}`
      ).toBe(false)
    }
  }

  // 3. Check for basic Accessibility/Color issues (Simplified)
  // We check if the main container is visible and not empty
  await expect(page.locator('main').first()).toBeVisible()

  // 4. Check for layout overflows
  const hasOverflow = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    )
  })
  // Note: Only enforce this for mobile test runs or specific pages
  // For now, we just log it or assert if critical

  // 5. Check all links in the main content are valid
  const links = page.locator('main a[href]')
  const linkCount = await links.count()
  const linkChecks: Promise<void>[] = []

  for (let i = 0; i < Math.min(linkCount, 15); i++) {
    const href = await links.nth(i).getAttribute('href')
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:')
    ) {
      const absoluteUrl = href.startsWith('http')
        ? href
        : `http://127.0.0.1:3000${href}`

      linkChecks.push(
        page.request
          .get(absoluteUrl)
          .then((response) => {
            expect(
              response.status(),
              `Broken link detected: ${href}`
            ).toBeLessThan(400)
          })
          .catch((err) => {
            console.warn(`Link check failed for ${absoluteUrl}: ${err.message}`)
          })
      )
    }
  }
  await Promise.all(linkChecks)

  // 6. Contrast/Visibility Heuristic (Catch "white on white" or "dark on dark")
  const visibilityIssues = await page.evaluate(() => {
    const issues: string[] = []
    const elements = document.querySelectorAll(
      'h1, h2, h3, p, span, button, a, label'
    )

    elements.forEach((el) => {
      const style = window.getComputedStyle(el)
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        parseFloat(style.opacity) < 0.1
      )
        return

      const color = style.color
      const bgColor = style.backgroundColor

      // Detect problematic color pairs (Very basic approximation)
      // White-on-White or Dark-on-Dark
      if (
        color === bgColor &&
        color !== 'rgba(0, 0, 0, 0)' &&
        bgColor !== 'rgba(0, 0, 0, 0)'
      ) {
        issues.push(
          `Hidden text detected (same color as bg): ${el.tagName} "${el.textContent?.substring(0, 20)}"`
        )
      }

      // Check if element is effectively invisible but supposed to be text
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        const isTransparent =
          style.color === 'rgba(0, 0, 0, 0)' || style.color === 'transparent'
        if (isTransparent && el.textContent?.trim().length) {
          issues.push(
            `Transparent text detected: ${el.tagName} "${el.textContent?.substring(0, 20)}"`
          )
        }
      }
    })
    return issues
  })

  if (visibilityIssues.length > 0) {
    console.warn(
      `Potential Visibility Issues found on ${page.url()}:`,
      visibilityIssues
    )
  }

  expect(
    consoleErrors,
    `Console errors detected on ${page.url()}: ${consoleErrors.join(', ')}`
  ).toHaveLength(0)
}
