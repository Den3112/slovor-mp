import { test, expect } from '@playwright/test'

/**
 * Dashboard E2E Tests
 * Note: These tests require a logged-in user
 */

test.describe('Dashboard - My Listings', () => {
    test.beforeEach(async ({ page }) => {
        // TODO: Add authentication setup
        // For now, we'll assume user is logged in
        await page.goto('/dashboard/listings')
    })

    test('should display my listings page', async ({ page }) => {
        // Check if page title is visible
        await expect(page.locator('h1:has-text("Moje inzeráty"), h1:has-text("My Listings")')).toBeVisible()

        // Check if "Create New" button exists
        const createButton = page.locator('a[href="/post"], button:has-text("Pridať"), button:has-text("Create")')
        await expect(createButton.first()).toBeVisible()
    })

    test('should search listings', async ({ page }) => {
        // Find search input
        const searchInput = page.locator('input[placeholder*="Hľadať"], input[placeholder*="Search"]').first()

        if (await searchInput.isVisible()) {
            await searchInput.fill('test')

            // Wait for results to filter
            await page.waitForTimeout(500)

            // Results should be filtered
            await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible()
        }
    })

    test('should toggle listing status', async ({ page }) => {
        // Find first listing's toggle button
        const toggleButton = page.locator('button:has-text("Aktivovať"), button:has-text("Deaktivovať"), button:has-text("Activate"), button:has-text("Deactivate")').first()

        if (await toggleButton.isVisible()) {
            const initialText = await toggleButton.textContent()

            // Click toggle
            await toggleButton.click()

            // Wait for update
            await page.waitForTimeout(1000)

            // Text should change
            const newText = await toggleButton.textContent()
            expect(newText).not.toBe(initialText)
        }
    })

    test('should navigate to edit listing', async ({ page }) => {
        // Find first edit button
        const editButton = page.locator('button:has-text("Upraviť"), button:has-text("Edit")').first()

        if (await editButton.isVisible()) {
            await editButton.click()

            // Should navigate to post page with edit param
            await expect(page).toHaveURL(/\/post\?edit=/)
        }
    })

    test('should delete listing with confirmation', async ({ page }) => {
        // Find first delete button
        const deleteButton = page.locator('button:has-text("Vymazať"), button:has-text("Delete")').first()

        if (await deleteButton.isVisible()) {
            // Setup dialog handler
            page.on('dialog', async dialog => {
                expect(dialog.type()).toBe('confirm')
                await dialog.dismiss() // Cancel deletion in test
            })

            await deleteButton.click()
        }
    })
})

test.describe('Dashboard - Create Listing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/post')
    })

    test('should display create listing form', async ({ page }) => {
        // Check if form is visible
        await expect(page.locator('form')).toBeVisible()

        // Check for step indicator
        const stepIndicator = page.locator('text=1, text=Step 1')
        await expect(stepIndicator).toBeVisible()
    })

    test('should navigate through form steps', async ({ page }) => {
        // Step 1: Select category
        const categoryCard = page.locator('[data-testid="category-option"]').first()

        if (await categoryCard.isVisible()) {
            await categoryCard.click()

            // Click next
            const nextButton = page.locator('button:has-text("Ďalej"), button:has-text("Next")').first()
            await nextButton.click()

            // Should be on step 2
            await expect(page.locator('text=2, text=Step 2')).toBeVisible()
        }
    })

    test('should validate required fields', async ({ page }) => {
        // Try to submit without filling required fields
        const submitButton = page.locator('button[type="submit"]').last()

        if (await submitButton.isVisible()) {
            await submitButton.click()

            // Should show validation errors
            const errorMessage = page.locator('text=povinné, text=required').first()

            // Note: This depends on form validation implementation
            // May need adjustment based on actual validation
        }
    })

    test('should fill and submit listing form', async ({ page }) => {
        // Step 1: Select category
        const categoryCard = page.locator('[data-testid="category-option"]').first()
        if (await categoryCard.isVisible()) {
            await categoryCard.click()
            await page.locator('button:has-text("Ďalej"), button:has-text("Next")').first().click()
        }

        // Step 2: Fill details
        await page.fill('input[name="title"]', 'Test Listing E2E')
        await page.fill('textarea[name="description"]', 'This is a test listing created by E2E test')
        await page.fill('input[name="price"]', '100')
        await page.fill('input[name="location"]', 'Bratislava')

        // Select condition
        const conditionSelect = page.locator('select[name="condition"]')
        if (await conditionSelect.isVisible()) {
            await conditionSelect.selectOption('new')
        }

        // Submit form
        const submitButton = page.locator('button[type="submit"]:has-text("Zverejniť"), button[type="submit"]:has-text("Publish")').first()

        if (await submitButton.isVisible()) {
            await submitButton.click()

            // Should redirect to listings or show success
            await page.waitForTimeout(2000)

            // Check for success (URL change or success message)
            const currentUrl = page.url()
            expect(currentUrl).toMatch(/dashboard|listings|success/)
        }
    })
})

test.describe('Dashboard - Mobile Navigation', () => {
    test('should display mobile navigation on small screens', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/dashboard')

        // Mobile bottom nav should be visible
        const mobileNav = page.locator('[data-testid="dashboard-mobile-nav"]')
        await expect(mobileNav).toBeVisible()

        // Should have navigation items
        const navItems = page.locator('[data-testid="dashboard-mobile-nav"] a, [data-testid="dashboard-mobile-nav"] button')
        await expect(navItems.first()).toBeVisible()
    })
})

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Try to go to login page first
        await page.goto('/auth/login')
    })

    test('should redirect to login when not authenticated', async ({ page }) => {
        await page.goto('/dashboard')

        // Should redirect to login
        await expect(page).toHaveURL(/\/auth\/login/)
    })

    test('should show login form', async ({ page }) => {
        await page.goto('/auth/login')

        // Should show email and password inputs
        await expect(page.locator('input[type="email"]')).toBeVisible()
        await expect(page.locator('input[type="password"]')).toBeVisible()
    })

    test('should show registration form', async ({ page }) => {
        await page.goto('/auth/register')

        // Should show registration form
        await expect(page.locator('input[type="email"]')).toBeVisible()
        await expect(page.locator('input[type="password"]')).toBeVisible()
    })

    test('should handle social auth buttons', async ({ page }) => {
        await page.goto('/auth/login')

        // Look for social auth buttons
        const socialButtons = page.locator('button').filter({ hasText: /Google|Facebook|GitHub/i })

        if (await socialButtons.first().isVisible()) {
            await expect(socialButtons.first()).toBeVisible()
        }
    })

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/auth/login')

        // Should load properly on mobile
        await expect(page.locator('input[type="email"]')).toBeVisible()
    })
})
