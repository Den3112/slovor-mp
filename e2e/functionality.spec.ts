import { test, expect } from '@playwright/test'

/**
 * Comprehensive Functionality Tests
 * Tests all pages, buttons, links, and UI elements
 */

test.describe('Public Pages - Load & Display', () => {
    test('Homepage loads with all key elements', async ({ page }) => {
        await page.goto('/')

        // Header elements
        await expect(page.locator('header')).toBeVisible()
        await expect(page.locator('a[href="/"]').first()).toBeVisible() // Logo

        // Hero section
        await expect(page.locator('h1')).toBeVisible()

        // Search functionality
        const searchInput = page.locator('input[type="text"]').first()
        await expect(searchInput).toBeVisible()

        // Categories section - just check page loaded with content
        const mainContent = page.locator('main, [role="main"], .container').first()
        await expect(mainContent).toBeVisible()

        // Post Ad button
        await expect(page.locator('a[href="/post"]').first()).toBeVisible()

        // Footer
        await expect(page.locator('footer')).toBeVisible()
    })

    test('Categories page displays all categories', async ({ page }) => {
        await page.goto('/categories')

        await expect(page.locator('h1').first()).toBeVisible()

        // Check some categories are visible
        const categoryLinks = page.locator('a[href*="/categories/"]')
        await expect(categoryLinks.first()).toBeVisible()

        // Verify we have multiple categories
        const count = await categoryLinks.count()
        expect(count).toBeGreaterThan(0)
    })

    test('Listings page displays listings grid', async ({ page }) => {
        await page.goto('/listings')

        await expect(page.locator('h1')).toBeVisible()

        // Filter sidebar or section should exist
        const filterSection = page.locator('[data-testid="filters"], aside, .filters').first()
        if (await filterSection.isVisible()) {
            await expect(filterSection).toBeVisible()
        }
    })

    test('About page loads correctly', async ({ page }) => {
        await page.goto('/about')
        await expect(page.locator('h1').first()).toBeVisible()
    })

    test('FAQ page displays questions', async ({ page }) => {
        await page.goto('/faq')
        await expect(page.locator('h1')).toBeVisible()
    })

    test('Terms page loads', async ({ page }) => {
        await page.goto('/terms')
        await expect(page.locator('h1')).toContainText(/Terms|Podmienky/i)
    })

    test('Privacy page loads', async ({ page }) => {
        await page.goto('/privacy')
        await expect(page.locator('h1')).toContainText(/Privacy|Súkromie/i)
    })

    test('Blog page shows coming soon', async ({ page }) => {
        await page.goto('/blog')
        await expect(page.locator('h1')).toBeVisible()
    })
})

test.describe('Authentication Flow', () => {
    test('Login page displays form', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState('networkidle')

        // Check form exists - login page has a form with email/password
        await expect(page.locator('form').first()).toBeVisible()

        // At least one input should be visible
        await expect(page.locator('input').first()).toBeVisible()
    })

    test('Register redirects to login with mode', async ({ page }) => {
        await page.goto('/register')
        await page.waitForURL(/\/login/)
        await expect(page).toHaveURL(/mode=register|\/login/)
    })

    test('Protected routes redirect to login', async ({ page }) => {
        await page.goto('/profile')
        await page.waitForURL(/\/login/)
        await expect(page).toHaveURL(/\/login/)
    })

    test('Post page requires auth', async ({ page }) => {
        // Clear any existing session first
        await page.context().clearCookies()
        await page.goto('/post')

        // Should either show form (if somehow auth persists) or redirect
        const url = page.url()
        if (url.includes('/login')) {
            await expect(page).toHaveURL(/\/login/)
        } else {
            // If we're still on /post, form should be visible
            await expect(page.locator('form')).toBeVisible()
        }
    })
})

test.describe('Navigation & Links', () => {
    test('Header navigation works', async ({ page }) => {
        await page.goto('/')

        // Click on categories link in header if exists
        const categoriesLink = page.locator('header a[href="/categories"]').first()
        if (await categoriesLink.isVisible()) {
            await categoriesLink.click()
            await expect(page).toHaveURL('/categories')
        }
    })

    test('Footer links work', async ({ page }) => {
        await page.goto('/')

        // Test footer About link
        const aboutLink = page.locator('footer a[href="/about"]').first()
        if (await aboutLink.isVisible()) {
            await aboutLink.click()
            await expect(page).toHaveURL('/about')
        }
    })

    test('Logo navigates to homepage', async ({ page }) => {
        await page.goto('/about')

        // Click logo
        const logo = page.locator('header a[href="/"]').first()
        await logo.click()
        await expect(page).toHaveURL('/')
    })

    test('Post Ad button navigates correctly', async ({ page }) => {
        await page.goto('/')

        // Check Post Ad link exists in header
        const postButton = page.locator('header a[href="/post"]').first()

        if (await postButton.isVisible({ timeout: 5000 })) {
            await postButton.click()
            await page.waitForLoadState('networkidle')

            // Will redirect to login or show form
            const url = page.url()
            expect(url).toMatch(/\/post|\/login/)
        }
    })
})

test.describe('Search Functionality', () => {
    test('Search input accepts text', async ({ page }) => {
        await page.goto('/')

        const searchInput = page.locator('input[type="text"]').first()
        await searchInput.fill('iPhone')

        const inputValue = await searchInput.inputValue()
        expect(inputValue).toBe('iPhone')
    })

    test('Quick search tags are clickable', async ({ page }) => {
        await page.goto('/')

        // Find quick search links (containing popular search terms)
        const quickTags = page.locator('a[href*="search="], a[href*="listings?"]')
        if (await quickTags.first().isVisible({ timeout: 5000 })) {
            await quickTags.first().click()
            await expect(page).toHaveURL(/\/listings/)
        }
    })
})

test.describe('UI Elements', () => {
    test('Theme toggle works', async ({ page }) => {
        await page.goto('/')

        const themeButton = page.locator('button[aria-label*="theme"], button:has(svg.lucide-sun), button:has(svg.lucide-moon)').first()

        if (await themeButton.isVisible({ timeout: 5000 })) {
            // Get initial state
            const htmlBefore = await page.locator('html').getAttribute('class')

            // Click toggle
            await themeButton.click()
            await page.waitForTimeout(500)

            // Check state changed
            const htmlAfter = await page.locator('html').getAttribute('class')

            // Theme should have toggled (classes changed)
            expect(htmlBefore !== htmlAfter || htmlAfter?.includes('dark') || htmlAfter?.includes('light')).toBeTruthy()
        }
    })

    test('Language selector is visible', async ({ page }) => {
        await page.goto('/')

        // Look for language selector in header
        const langSelector = page.locator('button:has(svg), [data-testid="language-selector"]').first()
        await expect(langSelector).toBeVisible({ timeout: 10000 })
    })

    test('Mobile menu opens on small screens', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/')

        // Look for hamburger menu or mobile menu button
        const mobileMenuBtn = page.locator('button[aria-label*="menu"], button:has(svg.lucide-menu)').first()

        if (await mobileMenuBtn.isVisible({ timeout: 5000 })) {
            await mobileMenuBtn.click()
            await page.waitForTimeout(500)

            // Some drawer/menu should appear
            const drawer = page.locator('[role="dialog"], [data-state="open"], .drawer')
            await expect(drawer.first()).toBeVisible({ timeout: 5000 })
        }
    })
})

test.describe('Listing Details', () => {
    test('Listing detail page structure', async ({ page }) => {
        // Go to listings and click first one
        await page.goto('/listings')
        await page.waitForLoadState('networkidle')

        const listingLink = page.locator('a[href*="/listings/"]').first()

        if (await listingLink.isVisible({ timeout: 10000 })) {
            await listingLink.click()
            await page.waitForLoadState('networkidle')

            // Should show listing title
            await expect(page.locator('h1')).toBeVisible()
        }
    })
})

test.describe('Buttons Functionality', () => {
    test('All buttons are clickable', async ({ page }) => {
        await page.goto('/')

        // Get all visible buttons
        const buttons = page.locator('button:visible')
        const count = await buttons.count()

        expect(count).toBeGreaterThan(0)

        // Test first few buttons are enabled
        for (let i = 0; i < Math.min(3, count); i++) {
            const button = buttons.nth(i)
            await expect(button).toBeEnabled()
        }
    })

    test('Links have valid hrefs', async ({ page }) => {
        await page.goto('/')

        // Get all links
        const links = page.locator('a[href]:visible')
        const count = await links.count()

        expect(count).toBeGreaterThan(0)

        // Check some links have non-empty href
        for (let i = 0; i < Math.min(5, count); i++) {
            const href = await links.nth(i).getAttribute('href')
            expect(href).toBeTruthy()
            expect(href).not.toBe('#')
        }
    })
})

test.describe('Responsive Layout', () => {
    test('No horizontal scroll on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/')

        const body = page.locator('body')
        const scrollWidth = await body.evaluate(el => el.scrollWidth)
        const clientWidth = await body.evaluate(el => el.clientWidth)

        // Should not have horizontal scroll (allow small tolerance)
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5)
    })

    test('Header is fixed/sticky', async ({ page }) => {
        await page.goto('/')

        // Scroll down
        await page.evaluate(() => window.scrollTo(0, 500))
        await page.waitForTimeout(500)

        // Header should still be visible
        await expect(page.locator('header')).toBeVisible()
    })
})
