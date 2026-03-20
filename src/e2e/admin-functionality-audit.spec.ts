import { test, expect } from '@playwright/test'

test.use({ storageState: 'e2e/.auth/user.json' })

test.describe('Admin Dashboard Functionality Audit', () => {
  const adminRoutes = [
    { path: '/en/admin', name: 'Overview' },
    { path: '/en/admin/users', name: 'Users' },
    { path: '/en/admin/listings', name: 'Listings' },
    { path: '/en/admin/orders', name: 'Orders' },
    { path: '/en/admin/verifications', name: 'Verifications' },
    { path: '/en/admin/analytics', name: 'Analytics' },
    { path: '/en/admin/reports', name: 'Reports' },
    { path: '/en/admin/content', name: 'Content' },
    { path: '/en/admin/settings', name: 'Settings' },
  ]

  adminRoutes.forEach((route) => {
    test(`Audit ${route.name} Page`, async ({ page }) => {
      const consoleErrors: string[] = []

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      page.on('pageerror', (exception) => {
        consoleErrors.push(exception.message)
      })

      await page.goto(route.path)

      // If the page has a main heading, wait for it
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 })

      // Check for DataGrid or tables if present (should not crash)
      const dataGrid = page.locator('[data-testid^="admin-"]')
      if ((await dataGrid.count()) > 0) {
        await expect(dataGrid.first()).toBeVisible()
      }

      // Output any errors found for the report
      if (consoleErrors.length > 0) {
        console.error(`[AUDIT] ${route.name} Console Errors:`, consoleErrors)
      }

      // Intentionally not failing the test on console errors right away,
      // just logging them so the AI agent can read the output.
      // But we will fail if there are critical React errors usually caught by pageerror
      const reactErrors = consoleErrors.filter(
        (e) =>
          e.includes('Minified React error') ||
          e.includes('Application error') ||
          e.includes('Hydration failed')
      )
      expect(
        reactErrors,
        `Found strict React errors on ${route.name}: ${reactErrors.join(', ')}`
      ).toHaveLength(0)
    })
  })
})
