import { test, expect } from '@playwright/test'
import { runUniversalHealthCheck } from './utils/health-check'

/**
 * Full Audit Script
 * Visits major routes in both Light and Dark modes.
 * Mode switching is handled by Playwright projects (colorScheme).
 */

const publicRoutes = [
  '/',
  '/login',
  '/categories',
  '/listings',
  '/about',
  '/faq',
  '/terms',
  '/privacy',
  '/contact',
  '/blog',
]

const locales = ['en', 'sk', 'ru', 'cs']

test.describe('Global Website Audit', () => {
  for (const locale of locales) {
    test.describe(`${locale.toUpperCase()} Locale`, () => {
      for (const route of publicRoutes) {
        const fullRoute = `/${locale}${route === '/' ? '' : route}`

        test(`Audit [${locale}] ${route}`, async ({ page }) => {
          await page.goto(fullRoute)
          await page.waitForLoadState('networkidle')

          // Core Health Check (Console, Images, Links, Visibility/Contrast)
          await runUniversalHealthCheck(page)

          // Basic layout sanity
          const header = page.locator('header')
          const footer = page.locator('footer')
          await expect(header).toBeVisible()
          await expect(footer).toBeVisible()

          // Take screenshot for visual record of current theme
          const theme = await page.evaluate(() =>
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
          )
          const cleanPath = route.replace(/\//g, '-') || 'home'
          await page.screenshot({
            path: `test-results/audit/${locale}-${theme}-${cleanPath}.png`,
            fullPage: true,
          })
        })
      }
    })
  }
})

// Admin & Dashboard Audit (requires auth - we use a mock approach or direct navigation if possible)
test.describe('Admin & Dashboard Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Minimal bypass if possible, or just attempt navigation
    await page.goto('/en/login')
  })

  test('Admin Dashboard Visibility', async ({ page }) => {
    await page.goto('/en/admin')
    // Even if redirected, we check for issues on the redirect target
    await runUniversalHealthCheck(page)
  })

  test('User Dashboard / Profile Visibility', async ({ page }) => {
    await page.goto('/en/dashboard')
    await runUniversalHealthCheck(page)
  })
})
