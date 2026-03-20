import { test, expect } from '@playwright/test'

const BASE_URL = 'http://127.0.0.1:3000'

test.describe('Deep Link and Security Audit', () => {
  test('Verify Home interactivity and CSP', async ({ page }) => {
    // Track console errors (especially CSP)
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto(`${BASE_URL}/en`)

    // Wait for hydration
    await page.waitForLoadState('networkidle')

    // Check if Categories button is clickable
    const categoriesBtn = page.getByRole('button', { name: /Categories/i })
    await expect(categoriesBtn).toBeVisible()
    await categoriesBtn.click()

    // If it was blocked by CSP, we would see errors in console
    const cspErrors = consoleErrors.filter((err) =>
      err.includes('Content Security Policy')
    )
    console.log('CSP Errors on Home:', cspErrors)
    expect(cspErrors.length).toBe(0)

    await page.screenshot({ path: 'test-results/audit-home.png' })
  })

  test('Verify Dashboard redirect for guest', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/dashboard`)

    // Should redirect to login
    await expect(page).toHaveURL(/.*\/auth\/login.*/)
    console.log('Dashboard redirect confirmed')

    await page.screenshot({ path: 'test-results/audit-dashboard-redirect.png' })
  })

  test('Verify Admin redirect for guest', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/admin`)

    // According to middleware, guests are redirected to / (home)
    await expect(page).toHaveURL(`${BASE_URL}/en`)
    console.log('Admin redirect to Home confirmed')

    await page.screenshot({ path: 'test-results/audit-admin-redirect.png' })
  })

  test('Audit Header Links', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`)

    // Find links in header
    const links = await page.locator('header a').all()
    console.log(`Found ${links.length} links in header`)

    for (const link of links) {
      const href = await link.getAttribute('href')
      const text = await link.innerText()
      console.log(`Checking link: ${text} (${href})`)

      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        // Check if it's a real link that doesn't 404
        const response = await page.request.get(`${BASE_URL}${href}`)
        expect(response.status()).toBeLessThan(400)
      }
    }
  })
})
