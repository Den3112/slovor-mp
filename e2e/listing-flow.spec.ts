import { test, expect } from '@playwright/test'

test.describe('Marketplace Core Flows', () => {
  test('navigation and search flow', async ({ page }) => {
    // Go to homepage
    await page.goto('/')

    // Check main sections
    await expect(
      page.locator('section').filter({ hasText: /Kategórie|Categories/i })
    ).toBeVisible()

    // Try search
    const searchInput = page.getByPlaceholder(/Hľadať|Search/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill('iphone')
      await searchInput.press('Enter')

      // Should navigate to listings with query
      await expect(page).toHaveURL(/.*q=iphone.*/)
    }
  })

  test('listing detail view essentials', async ({ page }) => {
    // Navigate directly to a listing if possible (we might need a real or fixed mock ID)
    // For now, let's find one from homepage
    await page.goto('/')

    // Find the first listing card and click
    const listingCard = page.locator('article, [class*="ListingCard"]').first()
    if (await listingCard.isVisible()) {
      await listingCard.click()

      // Verify detail page elements
      await expect(page.locator('[data-testid="image-gallery"]')).toBeVisible()
      await expect(page.locator('h1')).toBeVisible()

      // Check for related products section
      const relatedTitle = page.getByText(
        /Mohlo бы вас заинтересовать|Discovery|Related/i
      )
      await expect(relatedTitle).toBeVisible()
    }
  })
})
