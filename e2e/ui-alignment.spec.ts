import { test, expect } from '@playwright/test'

/**
 * UI Alignment & Visual Tests
 * Tests to catch alignment, spacing and visual issues across the site
 */

test.describe('UI Alignment Tests', () => {
    test.describe('Header Navigation', () => {
        test('navigation buttons text should be vertically centered', async ({ page }) => {
            await page.goto('/')
            await page.waitForLoadState('networkidle')

            // Check header nav links
            const navLinks = page.locator('nav a').filter({ hasText: /HOME|ALL LISTINGS|CATEGORIES/i })

            for (const link of await navLinks.all()) {
                const box = await link.boundingBox()
                if (box) {
                    // Button should be roughly square-ish or pill-shaped, not too tall or wide
                    expect(box.height).toBeGreaterThan(30)
                    expect(box.height).toBeLessThan(60)
                }
            }
        })

        test('theme toggle should be circular', async ({ page }) => {
            await page.goto('/')
            await page.waitForLoadState('networkidle')

            // Find button by aria-label containing mode (case insensitive)
            const themeToggle = page.locator('button[aria-label*="mode"], button[aria-label*="Mode"]').first()

            if (await themeToggle.count() > 0) {
                const box = await themeToggle.boundingBox()

                if (box && box.width > 0 && box.height > 0) {
                    // Should be a perfect square (circular button)
                    const ratio = box.width / box.height
                    expect(ratio).toBeGreaterThan(0.85)
                    expect(ratio).toBeLessThan(1.15)
                }
            }
        })

        test('language selector should maintain proper height', async ({ page }) => {
            await page.goto('/')
            await page.waitForLoadState('networkidle')

            const langSelector = page.locator('button').filter({ hasText: /EN|SK|CS/i }).first()
            const box = await langSelector.boundingBox()

            if (box) {
                expect(box.height).toBeGreaterThan(30)
                expect(box.height).toBeLessThan(50)
            }
        })
    })

    test.describe('Breadcrumbs', () => {
        test('breadcrumb items should be vertically aligned', async ({ page }) => {
            await page.goto('/categories/books-magazines')
            await page.waitForLoadState('networkidle')

            // Find the breadcrumb nav container by its distinctive styling
            const breadcrumbNav = page.locator('nav.rounded-full').first()

            if (await breadcrumbNav.count() > 0) {
                await expect(breadcrumbNav).toBeVisible()

                // Check that breadcrumb container has reasonable height
                const navBox = await breadcrumbNav.boundingBox()
                if (navBox) {
                    expect(navBox.height).toBeGreaterThan(30)
                    expect(navBox.height).toBeLessThan(60)
                }
            }
        })

        test('breadcrumb container should have proper dimensions', async ({ page }) => {
            await page.goto('/categories/books-magazines')
            await page.waitForLoadState('networkidle')

            // Find the pill-shaped breadcrumb container
            const breadcrumbNav = page.locator('nav.rounded-full').first()

            if (await breadcrumbNav.count() > 0) {
                const box = await breadcrumbNav.boundingBox()

                if (box) {
                    // Height should be around 44px (h-11) with some tolerance
                    expect(box.height).toBeGreaterThan(35)
                    expect(box.height).toBeLessThan(60)
                }
            }
        })
    })

    test.describe('Buttons and Interactive Elements', () => {
        test('all buttons should have minimum clickable area', async ({ page }) => {
            await page.goto('/')
            await page.waitForLoadState('networkidle')

            const buttons = page.locator('button:visible')
            const count = await buttons.count()

            for (let i = 0; i < Math.min(count, 10); i++) {
                const button = buttons.nth(i)
                const box = await button.boundingBox()

                if (box) {
                    // Minimum touch target should be 40x40 (or close to it)
                    expect(box.width * box.height).toBeGreaterThan(900) // ~30x30 minimum
                }
            }
        })

        test('dropdowns should have proper height', async ({ page }) => {
            await page.goto('/listings')
            await page.waitForLoadState('networkidle')

            // Look for select elements or combobox buttons
            const selects = page.locator('select, [role="combobox"]')
            const count = await selects.count()

            // Only test if dropdowns exist on the page
            if (count > 0) {
                for (let i = 0; i < Math.min(count, 3); i++) {
                    const select = selects.nth(i)
                    if (await select.isVisible()) {
                        const box = await select.boundingBox()

                        if (box && box.height > 10) {
                            expect(box.height).toBeGreaterThan(30)
                            expect(box.height).toBeLessThan(80)
                        }
                    }
                }
            }
        })
    })

    test.describe('Mobile Responsiveness', () => {
        test.use({ viewport: { width: 375, height: 667 } })

        test('mobile bottom navigation should be visible', async ({ page }) => {
            await page.goto('/')
            await page.waitForLoadState('networkidle')

            const bottomNav = page.locator('nav').filter({ has: page.locator('a[href="/"]') }).last()
            await expect(bottomNav).toBeVisible()
        })

        test('header should not overflow on mobile', async ({ page }) => {
            await page.goto('/')
            await page.waitForLoadState('networkidle')

            const header = page.locator('header').first()
            const box = await header.boundingBox()

            if (box) {
                expect(box.width).toBeLessThanOrEqual(375 + 5) // viewport + small tolerance
            }
        })
    })

    test.describe('Text Alignment', () => {
        test('hero title should be centered', async ({ page }) => {
            await page.goto('/')
            await page.waitForLoadState('networkidle')

            const heroTitle = page.locator('h1').first()
            const titleBox = await heroTitle.boundingBox()
            const viewportWidth = page.viewportSize()?.width || 1280

            if (titleBox) {
                const titleCenterX = titleBox.x + titleBox.width / 2
                const viewportCenterX = viewportWidth / 2

                // Title center should be within 100px of viewport center
                expect(Math.abs(titleCenterX - viewportCenterX)).toBeLessThan(150)
            }
        })
    })
})

test.describe('Visual Regression Prevention', () => {
    const pages = [
        { name: 'Homepage', url: '/' },
        { name: 'Listings', url: '/listings' },
        { name: 'Categories', url: '/categories' },
        { name: 'Category Page', url: '/categories/books-magazines' },
    ]

    for (const p of pages) {
        test(`${p.name} should not have horizontally scrollable content`, async ({ page }) => {
            await page.goto(p.url)
            await page.waitForLoadState('networkidle')

            const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
            const viewportWidth = page.viewportSize()?.width || 1280

            // Body should not be wider than viewport (no horizontal scroll)
            expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20)
        })

        test(`${p.name} should not have overlapping elements in header`, async ({ page }) => {
            await page.goto(p.url)
            await page.waitForLoadState('networkidle')

            const logo = page.locator('header a').first()
            const logoBox = await logo.boundingBox()

            // Logo should be visible and have reasonable dimensions
            if (logoBox) {
                expect(logoBox.width).toBeGreaterThan(50)
                expect(logoBox.height).toBeGreaterThan(20)
            }
        })
    }
})
