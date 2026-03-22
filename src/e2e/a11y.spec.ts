import { test } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

const locales = ['en']
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/search',
  '/categories',
  '/terms',
  '/privacy',
]

test.describe('Accessibility (A11y) Verification', () => {
  for (const locale of locales) {
    for (const route of publicRoutes) {
      test(`${locale} - ${route} Accessibility Check`, async ({ page }) => {
        const url = `/${locale}${route === '/' ? '' : route}`
        await page.goto(url, { waitUntil: 'networkidle' })
        
        // Inject axe-core
        await injectAxe(page)
        
        // Scan the page for violations
        await checkA11y(page, undefined, {
          detailedReport: true,
          detailedReportOptions: { html: true },
        })
      })
    }
  }
})
