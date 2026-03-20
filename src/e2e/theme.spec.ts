import { test, expect } from '@playwright/test'

test.describe('Theme Switching (Dark/Light Mode)', () => {
  const locales = ['en'] // Test on English for simplicity, theme should be global or per persistent state

  for (const locale of locales) {
    test(`Dark Mode Toggle works on ${locale} Homepage`, async ({ page }) => {
      await page.goto(`/${locale}`)

      // 1. Initial State: Should likely be Light (or system default).
      // We assume default is light or we force it.
      // Let's check the HTML class.
      const html = page.locator('html')

      // If we are in light mode, 'dark' class should NOT be present
      // Note: This depends on system preference in headless browser.
      // We will force toggle to ensure change.

      // Update locator to ensure we pick the VISIBLE toggle (e.g. desktop vs mobile)
      const themeToggle = page
        .getByRole('button', { name: /switch to/i })
        .filter({ visible: true })
        .first()

      // Ensure it exists
      await expect(themeToggle).toBeVisible()
      // Let's try to click it.
      await themeToggle.click()

      // Wait for possible transition
      await page.waitForTimeout(500)

      // Check if class changed.
      // Scenario A: It was Light, now Dark.
      // Scenario B: It was Dark, now Light.
      // We explicitly check for state change.

      const isDark = await html.evaluate((node) =>
        node.classList.contains('dark')
      )

      // Click again to toggle back
      await themeToggle.first().click()
      await page.waitForTimeout(500)

      const isDarkAfterSecondClick = await html.evaluate((node) =>
        node.classList.contains('dark')
      )

      // Assert they are different
      expect(isDark).not.toBe(isDarkAfterSecondClick)
    })

    test(`Dark Mode persists CSS variables on ${locale} Login Page`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/auth/login`)

      // Force Dark Mode
      const html = page.locator('html')
      // If not dark, make it dark
      const isDarkInitially = await html.evaluate((node) =>
        node.classList.contains('dark')
      )
      if (!isDarkInitially) {
        const themeToggle = page
          .getByRole('button', { name: /switch to/i })
          .filter({ visible: true })
          .first()
        await themeToggle.click()
        await page.waitForTimeout(500)
      }

      await expect(html).toHaveClass(/dark/)

      // Verify Background Color Variable
      // In dark mode, --background usually is dark (e.g., #020817 or similar)
      const bgColor = await page.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })

      // Standard dark mode background is usually not white (rgb(255, 255, 255))
      expect(bgColor).not.toBe('rgb(255, 255, 255)')
    })
  }

  test('Theme persists across navigation', async ({ page }) => {
    // 1. Go to Home, set Dark
    await page.goto('/en')
    const themeToggle = page
      .getByRole('button', { name: /switch to/i })
      .filter({ visible: true })
      .first()

    const html = page.locator('html')
    const startDark = await html.evaluate((node) =>
      node.classList.contains('dark')
    )

    if (!startDark) {
      await themeToggle.click()
      await page.waitForTimeout(200)
    }

    await expect(html).toHaveClass(/dark/)

    // 2. Navigate to detailed page
    await page.goto('/en/listings')
    await page.waitForLoadState('domcontentloaded')

    // 3. Should still be dark
    await expect(html).toHaveClass(/dark/)
  })
})
