import { test, expect } from '@playwright/test'

const locales = ['en']

test.describe('Design System Verification', () => {
  for (const locale of locales) {
    test(`${locale} - Design System (Kitchen Sink)`, async ({ page }) => {
      // Light Mode Check
      await page.goto(`/${locale}/test`)
      await expect(page).toHaveScreenshot(`${locale}-design-system-light.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      })

      // Dark Mode Check
      // We can use the button in the header if available, or force class
      await page.evaluate(() => document.documentElement.classList.add('dark'))
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot(`${locale}-design-system-dark.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      })
    })
  }
})
