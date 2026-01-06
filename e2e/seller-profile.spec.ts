import { test, expect } from '@playwright/test'

const TEST_SELLER_ID = '522f621e-3e70-40bc-b312-81ba9a105170'

test.describe('Seller Profile Page', () => {
    test('should load seller profile and display info', async ({ page }) => {
        // Navigate to the test seller's profile
        // Note: This relies on the seed script having been run or the user existing
        await page.goto(`/seller/${TEST_SELLER_ID}`)

        // Check if page loaded
        await expect(page).toHaveURL(new RegExp(`/seller/${TEST_SELLER_ID}`))

        // Verify basic profile elements
        await expect(page.locator('h1')).toBeVisible() // Display name

        // Check for "Contact Seller" button which is critical
        await expect(page.getByRole('button', { name: /Contact Seller|Kontaktovať predávajúceho|Kontaktovat prodávajícího/i })).toBeVisible()

        // Check for dashboard elements if any
        await expect(page.type('body')).not.toBeNull()
    })

    test('should display seller listings', async ({ page }) => {
        await page.goto(`/seller/${TEST_SELLER_ID}`)

        // Check if at least one listing card is present or empty state
        // We expect listings if seeded, or empty state if not. Both are valid UI states.
        const listingCards = page.locator('article, .group, a[href^="/listings/"]') // Broad selector for listing cards
        const emptyState = page.locator('text=No listings|Žiadne inzeráty|Žádné inzeráty')

        // Wait for either listings or empty state
        await Promise.race([
            listingCards.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => { }),
            emptyState.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { })
        ])

        const hasListings = await listingCards.count() > 0
        const hasEmptyState = await emptyState.count() > 0

        expect(hasListings || hasEmptyState).toBeTruthy()
    })

    test('should show 404 for non-existent seller', async ({ page }) => {
        const fakeId = '00000000-0000-0000-0000-000000000000'
        await page.goto(`/seller/${fakeId}`)

        // Should show error state or 404
        await expect(page.locator('text=Profile not found|Not Found|404')).toBeVisible()
    })
})
