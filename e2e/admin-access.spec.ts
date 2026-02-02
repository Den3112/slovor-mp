import { test, expect } from '@playwright/test';

test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Admin Dashboard Access', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/en/admin');
        await page.waitForLoadState('domcontentloaded');

        // If redirected to login or home, test will fail assertion
    });

    test('Admin Sidebar and Navigation', async ({ page }) => {
        // Assert we are on admin
        await expect(page).toHaveURL(/.*\/admin/);

        // Check Sidebar
        await expect(page.getByTestId('dashboard-sidebar')).toBeVisible();

        // Check Links presence (using partial text from translations or icon logic if possible, but regex is safest for multi-lang)
        // Adjusting regex to likely translations

        // Overview / Dashboard
        await expect(page.getByRole('link', { name: /Dashboard|Prehľad|Overview/i })).toBeVisible();

        // Listings / Moderation
        await expect(page.getByRole('link', { name: /Moderation|Moderácia|Listings|Inzeráty/i })).toBeVisible();

        // Users
        await expect(page.getByRole('link', { name: /Users|Používatelia/i })).toBeVisible();

        // Reports
        await expect(page.getByRole('link', { name: /Reports|Sťažnosti|Nahlásenia/i })).toBeVisible();

        // Verifications
        await expect(page.getByRole('link', { name: /Verifications|Verifikácie|Overenia/i })).toBeVisible();

        // Content
        await expect(page.getByRole('link', { name: /Content|Obsah/i })).toBeVisible();
    });

    test('Admin Mobile Navigation', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Sidebar should be hidden
        await expect(page.getByTestId('dashboard-sidebar')).not.toBeVisible();

        // Open Drawer
        await page.getByRole('button', { name: /Toggle Menu/i }).click();

        await page.waitForTimeout(1000);

        // Check link in drawer
        await expect(page.locator('[role="dialog"]').getByRole('link', { name: /Users|Používatelia/i })).toBeVisible();

        // Navigate
        await page.locator('[role="dialog"]').getByRole('link', { name: /Users|Používatelia/i }).click();
        await expect(page).toHaveURL(/.*\/admin\/users/);
    });
    test('Role Switcher Navigation', async ({ page }) => {
        // Expect "Switch to Profile" button
        const switchButton = page.getByRole('button', { name: /Switch to Profile|Profil/i });
        await expect(switchButton).toBeVisible();
        await switchButton.click();

        // Should navigate to /dashboard
        await expect(page).toHaveURL(/.*\/dashboard\/overview/);

        // Go back (user might not see "Switch to Admin" if they are not admin, but our mock user IS admin)
        const adminButton = page.getByRole('button', { name: /Switch to Admin|Admin/i });
        await expect(adminButton).toBeVisible();
        await adminButton.click();
        await expect(page).toHaveURL(/.*\/admin/);
    });

    test('Language Switcher Functionality', async ({ page }) => {
        // Open language dropdown
        await page.getByRole('button', { name: /English/i }).click();

        // Switch to Slovak
        await page.getByRole('menuitem', { name: /Slovenčina/i }).click();

        // URL should change to /sk/admin
        await expect(page).toHaveURL(/.*\/sk\/admin/);

        // Switch back to English
        await page.getByRole('button', { name: /Slovenčina/i }).click();
        await page.getByRole('menuitem', { name: /English/i }).click();
        await expect(page).toHaveURL(/.*\/en\/admin/);
    });
});
