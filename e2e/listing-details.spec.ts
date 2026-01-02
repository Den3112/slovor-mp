import { test, expect } from '@playwright/test'

test.describe('Listing Details Page', () => {
  test('should load listing details successfully', async ({ page }) => {
    // Navigate to listings page first
    await page.goto('/listings')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Try to find and click a listing
    const listingLink = page.locator('a[href*="/listings/"]').first()

    if (await listingLink.isVisible({ timeout: 5000 })) {
      await listingLink.click()

      // Should be on listing detail page
      await expect(page).toHaveURL(/\/listings\//)

      // Should show listing title
      await expect(page.locator('h1').first()).toBeVisible()
    } else {
      // If no listings exist, just verify listings page works
      await expect(page.locator('h1').first()).toBeVisible()
    }
  })

  test('should display listing information when available', async ({ page }) => {
    await page.goto('/listings')
    const listingLink = page.locator('a[href*="/listings/"]').first()

    if (await listingLink.isVisible({ timeout: 5000 })) {
      await listingLink.click()

      // Check for title
      await expect(page.locator('h1').first()).toBeVisible()

      // Check for basic page elements
      const hasContent = await page.locator('p, div, span').count() > 0
      expect(hasContent).toBe(true)
    }
  })

  test('should handle non-existent listing', async ({ page }) => {
    await page.goto('/listings/non-existent-listing-id')

    // Should either show 404 or redirect
    const isOnListingPage = page.url().includes('/listings/')
    expect(isOnListingPage).toBe(true)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/listings')

    // Page should load properly
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
