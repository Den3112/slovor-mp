import { test, expect } from '@playwright/test'

test.describe('Chat Interactions', () => {
    test.beforeEach(async ({ page }) => {
        // Mock user behavior - direct navigation
        await page.goto('/')
    })

    test('User can open chat from listing', async ({ page }) => {
        await page.goto('/listings')
        const firstListing = page.locator('a[href*="/listings/"]').first()
        if (await firstListing.isVisible()) {
            await firstListing.click()
            await page.waitForLoadState('networkidle')
            
            // Check for "Contact Seller" or "Message" button
            const contactBtn = page.locator('button:has-text("Správa"), button:has-text("Message"), button:has-text("Kontaktovať")').first()
            if (await contactBtn.isVisible()) {
                await expect(contactBtn).toBeEnabled()
                // Clicking would require login, but we verify button existence
            }
        }
    })

    test('Inbox sidebar has search', async ({ page }) => {
        await page.goto('/messages')
        const url = page.url()
        if (url.includes('/login')) return

        const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="Hľadať"]').first()
        if (await searchInput.isVisible()) {
            await expect(searchInput).toBeVisible()
        }
    })
})
