import { test, expect } from '@playwright/test';

// Use the auth state from global setup
test.use({ storageState: 'e2e/.auth/user.json' });

async function ensureAuthenticated(page) {
    await page.goto('/en/dashboard');
    await page.waitForLoadState('domcontentloaded');

    let currentUrl = page.url();
    console.log(`Ensuring auth at: ${currentUrl}`);

    if (currentUrl.includes('/auth/login')) {
        console.warn('Session invalid, attempting manual login fallback with password123...');

        await page.getByTestId('auth-email-input').fill('test.seller@slovor.sk');
        await page.getByTestId('auth-password-input').fill('password123');
        await page.getByTestId('auth-submit-btn').click();

        await page.waitForURL('**/dashboard', { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded');
        console.log('Login fallback successful.');
    }
}

test.describe('Profile Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await ensureAuthenticated(page);
    });

    test('Dashboard Overview renders correctly', async ({ page }) => {
        // Page content should be visible
        await expect(page.getByTestId('profile-overview-content')).toBeVisible();

        // Sidebar should be visible on desktop
        await expect(page.getByTestId('profile-desktop-sidebar')).toBeVisible();

        await expect(page.locator('h1')).toContainText(/Dashboard|Prehľad/i);
    });

    test('Logout functionality', async ({ page }) => {
        const logoutBtn = page.getByRole('button').filter({ hasText: /Sign Out|Logout|Odhlásiť/i }).first();
        await logoutBtn.click();
        await page.waitForURL('**/auth/login', { timeout: 15000 });
        expect(page.url()).toContain('/auth/login');
    });

    test('Update profile bio', async ({ page }) => {
        await page.goto('/en/dashboard/settings');
        await page.waitForLoadState('domcontentloaded');

        const newBio = `Test bio updated at ${new Date().toISOString()}`;

        const bioTextarea = page.getByTestId('profile-settings-bio');
        await bioTextarea.fill(newBio);

        const saveBtn = page.getByTestId('profile-settings-save');
        await saveBtn.click();

        // Wait for success toast
        await expect(page.getByText(/Profile updated successfully|Profil bol úspešne aktualizovaný/i)).toBeVisible();

        // Check if value persists after a reload
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        await expect(page.getByTestId('profile-settings-bio')).toHaveValue(newBio);
    });
});

test.describe('Mobile Profile View', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test.beforeEach(async ({ page }) => {
        await ensureAuthenticated(page);
    });

    test('Mobile Navigation bar is visible', async ({ page }) => {
        // Content should be visible
        await expect(page.getByTestId('profile-overview-content')).toBeVisible();

        // Profile mobile nav should be visible
        await expect(page.getByTestId('profile-mobile-nav')).toBeVisible({ timeout: 15000 });
    });

    test('Mobile Navigation interactions', async ({ page }) => {
        // Click on Listings
        await page.getByTestId('profile-mobile-nav-listings').click();
        await page.waitForURL('**/dashboard/listings', { timeout: 15000 });
        expect(page.url()).toContain('/dashboard/listings');

        // Click on Messages
        await page.getByTestId('profile-mobile-nav-messages').click();
        await page.waitForURL('**/messages', { timeout: 15000 });
        expect(page.url()).toContain('/messages');

        // Click back to Home
        await page.getByTestId('profile-mobile-nav-home').click();
        await page.waitForURL('**/dashboard', { timeout: 15000 });
        expect(page.url()).toContain('/dashboard');
    });
});
