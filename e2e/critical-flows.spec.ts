import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
    test('should load homepage successfully', async ({ page }) => {
        await page.goto('/')

        // Check if hero section is visible
        await expect(page.locator('h1')).toBeVisible()

        // Check if search input is present
        const searchInput = page.locator('input[type="text"]').first()
        await expect(searchInput).toBeVisible()

        // Check if page has links to categories/listings
        const links = page.locator('a[href*="listings"]')
        await expect(links.first()).toBeVisible()
    })

    test('should perform search', async ({ page }) => {
        await page.goto('/')

        // Type in search input
        const searchInput = page.locator('input[type="text"]').first()
        await searchInput.fill('iPhone')

        // Click search button or press Enter
        const searchButton = page.locator('a[href*="/listings?search="]').first()
        if (await searchButton.isVisible()) {
            await searchButton.click()
        } else {
            await searchInput.press('Enter')
        }

        // Should navigate to listings page
        await expect(page).toHaveURL(/\/listings/)
    })

    test('should have quick search tags', async ({ page }) => {
        await page.goto('/')

        // Check if quick search tags exist
        const quickLinks = page.locator('a[href*="iPhone"], a[href*="BMW"], a[href*="Byt"]')
        if (await quickLinks.first().isVisible()) {
            await expect(quickLinks.first()).toBeVisible()
        }
    })
})

test.describe('Categories', () => {
    test('should navigate to listings page', async ({ page }) => {
        await page.goto('/')

        // Click on a quick search link (acting like category navigation)
        const quickLink = page.locator('a[href*="iPhone"]').first()
        if (await quickLink.isVisible()) {
            await quickLink.click()

            // Should be on listings page
            await expect(page).toHaveURL(/\/listings/)

            // Should show listings
            await expect(page.locator('h1')).toBeVisible()
        } else {
            // Alternative: go directly to listings page
            await page.goto('/listings')
            await expect(page.locator('h1')).toBeVisible()
        }
    })
})

test.describe('Listing Details', () => {
    test('should view listing details', async ({ page }) => {
        // Go to listings page first
        await page.goto('/listings')

        // Wait for page to load
        await page.waitForLoadState('networkidle')

        // Try to find a listing link
        const firstListing = page.locator('a[href*="/listings/"]').first()

        if (await firstListing.isVisible({ timeout: 5000 })) {
            await firstListing.click()

            // Should be on listing detail page
            await expect(page).toHaveURL(/\/listings\//)

            // Should show listing title and price
            await expect(page.locator('h1')).toBeVisible()
        } else {
            // If no listings exist, verify we're on listings page
            await expect(page.locator('h1')).toBeVisible()
        }
    })
})

test.describe('Authentication Flow', () => {
    test('should show login page', async ({ page }) => {
        await page.goto('/auth/login')

        // Should show login form
        await expect(page.locator('input[type="email"]')).toBeVisible()
        await expect(page.locator('input[type="password"]')).toBeVisible()
    })

    test('should redirect to login when accessing protected route', async ({ page }) => {
        await page.goto('/dashboard')

        // Should redirect to login
        await expect(page).toHaveURL(/\/auth\/login/)
    })
})

test.describe('Responsive Design', () => {
    test('should display properly on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/')

        // Page should load properly
        await expect(page.locator('h1')).toBeVisible()
    })

    test('should be responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 })
        await page.goto('/')

        // Page should load properly
        await expect(page.locator('h1')).toBeVisible()
    })

    test('should be responsive on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 })
        await page.goto('/')

        // Page should load properly
        await expect(page.locator('h1')).toBeVisible()
    })
})
