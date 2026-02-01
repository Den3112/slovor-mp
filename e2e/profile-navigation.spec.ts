import { test, expect, type Page } from '@playwright/test';

test.use({ storageState: 'e2e/.auth/user.json' });

async function ensureAuthenticated(page: Page) {
    await page.goto('/en/profile/overview');
    // Wait for network to be idle or specific element to ensure we are loaded
    await page.waitForLoadState('domcontentloaded');

    if (page.url().includes('/auth/login')) {
        // Fallback login
        await page.getByTestId('auth-email-input').fill('test.seller@slovor.sk');
        await page.getByTestId('auth-password-input').fill('password123');
        await page.getByTestId('auth-submit-btn').click();
        await page.waitForURL('**/profile/overview');
    }
}

test.describe('Profile Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await ensureAuthenticated(page);
    });

    test('Desktop Sidebar is visible', async ({ page }) => {
        // Explicitly override viewport to ensure desktop
        await page.setViewportSize({ width: 1280, height: 720 });

        // Wait for main content to load first
        await expect(page.getByTestId('profile-overview-view')).toBeVisible({ timeout: 15000 });

        await expect(page.getByTestId('dashboard-sidebar')).toBeVisible();
    });

    test('Navigate through main profile sections', async ({ page }) => {
        // 1. Overview
        await page.goto('/en/profile/overview');
        await expect(page.locator('h1')).toContainText(/Dashboard|Prehľad|Overview/i);

        // Wait for main content
        await expect(page.getByTestId('profile-overview-view')).toBeVisible();

        // 2. Listings
        // Click link in sidebar
        // Navigate by HREF if role matching is flaky
        await page.getByTestId('dashboard-sidebar').getByRole('link', { name: /Moje inzeráty|My Listings/i }).click();
        await expect(page).toHaveURL(/.*\/profile\/listings/);

        // 3. Favorites
        await page.getByTestId('dashboard-sidebar').getByRole('link', { name: /Obľúbené|Favorites/i }).click();
        await expect(page).toHaveURL(/.*\/profile\/favorites/);

        // 4. Messages
        await page.getByTestId('dashboard-sidebar').getByRole('link', { name: /Správy|Messages/i }).click();
        await expect(page).toHaveURL(/.*\/profile\/messages/);

        // 5. Settings
        await page.getByTestId('dashboard-sidebar').getByRole('link', { name: /Nastavenia|Settings/i }).click();
        await expect(page).toHaveURL(/.*\/profile\/settings/);
    });

    test('Mobile Navigation Drawer', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Wait for main content
        await expect(page.getByTestId('profile-overview-view')).toBeVisible({ timeout: 15000 });

        // Sidebar should be hidden initially on mobile
        await expect(page.getByTestId('dashboard-sidebar')).not.toBeVisible();

        // Hamburger menu should be visible
        const menuBtn = page.getByRole('button', { name: /Toggle Menu/i });
        await expect(menuBtn).toBeVisible();

        // Open Drawer
        await menuBtn.click();

        // Wait for animation
        await page.waitForTimeout(1000);

        // Sidebar inside drawer should be visible now
        // We look for the sidebar inside the dialog (sheet content)
        const sidebarInDrawer = page.locator('[role="dialog"] [data-testid="dashboard-sidebar"]');
        await expect(sidebarInDrawer).toBeVisible();

        // Navigate
        await sidebarInDrawer.getByRole('link', { name: /Moje inzeráty|My Listings/i }).click();

        // Drawer should close (implicit check if blocking element is gone, but verification of URL is enough)
        await expect(page).toHaveURL(/.*\/profile\/listings/);
    });
});
