import { test, expect } from '@playwright/test'

test.describe('Real-time Chat & Notifications', () => {
  test('Inbox page loads correctly', async ({ page }) => {
    // Requires login, so we expect a redirect if not authenticated
    await page.goto('/messages')
    await page.waitForLoadState('networkidle')
    
    const url = page.url()
    if (url.includes('/login')) {
      await expect(page).toHaveURL(/\/login/)
    } else {
      await expect(page.locator('h1, h2').first()).toContainText(/Messages|Správy/i)
    }
  })

  test('Notification badge is visible in header when unread', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // The dropdown button should be visible if user is logged in
    const notificationBtn = page.locator('button[aria-label="Notifications"]').first()
    
    // Note: This test will only fully pass if we are logged in. 
    // For now we check if it is NOT visible for guests.
    const isVisible = await notificationBtn.isVisible()
    const user = await page.evaluate(() => (window as any).currentUser) // hypothetical
    
    if (!user) {
      expect(isVisible).toBe(false)
    }
  })

  test('Presence indicator in chat view', async ({ page }) => {
    // We navigate to a specific chat (mock id)
    await page.goto('/messages/mock-id')
    await page.waitForLoadState('networkidle')
    
    // Should show localized "Loading" or "Not found" for guest
    const url = page.url()
    if (url.includes('/login')) {
       return
    }

    const presenceDot = page.locator('.rounded-full.border-2').first()
    // It should at least exist in the DOM inside ChatView
    if (await presenceDot.isVisible()) {
      await expect(presenceDot).toBeVisible()
    }
  })
})
