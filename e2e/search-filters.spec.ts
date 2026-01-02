import { test, expect } from '@playwright/test'

test.describe('Search and Filters Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should perform search from homepage', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[type="text"]').first()
    await expect(searchInput).toBeVisible()

    // Type search query
    await searchInput.fill('iPhone')

    // Click search button or press Enter
    const searchButton = page.locator('a[href*="/listings?search="]').first()
    if (await searchButton.isVisible()) {
      await searchButton.click()
    } else {
      await searchInput.press('Enter')
    }

    // Should navigate to listings page
    await expect(page).toHaveURL(/listings|search/)

    // Search results should be displayed
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should navigate via quick search tags', async ({ page }) => {
    await page.goto('/')

    // Find and click a quick search tag
    const quickTag = page.locator('a[href*="iPhone"], a[href*="BMW"], a[href*="Byt"]').first()

    if (await quickTag.isVisible()) {
      await quickTag.click()

      // Should navigate to listings with search query
      await expect(page).toHaveURL(/\/listings/)
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('should navigate to listings page', async ({ page }) => {
    await page.goto('/listings')

    // Should load listings page
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Search Results', () => {
  test('should display listings page', async ({ page }) => {
    await page.goto('/listings')

    // Should show page header
    await expect(page.locator('h1')).toBeVisible()

    // Should have navigation elements
    const navElements = page.locator('a, button').first()
    await expect(navElements).toBeVisible()
  })

  test('should handle empty search results gracefully', async ({ page }) => {
    await page.goto('/listings?search=nonexistent12345xyz')

    // Should still load the page
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should show mobile-friendly layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/listings')

    // Should load properly on mobile
    await expect(page.locator('h1')).toBeVisible()
  })
})
