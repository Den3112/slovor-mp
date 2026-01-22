import { test, expect } from '@playwright/test';

test.describe('Search and Filter Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/listings');
    });

    test('Search input works', async ({ page }) => {
        const searchInput = page.locator('input[type="text"]').first();
        await expect(searchInput).toBeVisible();

        await searchInput.fill('iPhone');
        await searchInput.press('Enter');

        // Проверяем, что URL обновился
        await expect(page).toHaveURL(/.*search=iPhone.*/);
    });

    test('Filter by category', async ({ page }) => {
        // Проверяем наличие категорий (напр. первая ссылка в сетке категорий или в сайдбаре)
        const categoryLink = page.locator('a[href*="/categories/"]').first();
        if (await categoryLink.isVisible()) {
            await categoryLink.click();
            await expect(page).toHaveURL(/.*categories\/.*/);
        }
    });

    test('Price filter updates URL', async ({ page }) => {
        const minPriceInput = page.locator('input[type="number"]').first();
        const maxPriceInput = page.locator('input[type="number"]').nth(1);

        if (await minPriceInput.isVisible() && await maxPriceInput.isVisible()) {
            await minPriceInput.fill('100');
            await maxPriceInput.fill('500');

            await maxPriceInput.press('Enter');

            await expect(page).toHaveURL(/.*priceMin=100.*priceMax=500/);
        }
    });
});
