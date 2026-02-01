import { Page, expect, Locator } from '@playwright/test';

export class AuthPage {
	readonly page: Page;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitBtn: Locator;
	readonly errorAlert: Locator;
	readonly toggleModeBtn: Locator;
	readonly backToHomeLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailInput = page.getByTestId('auth-email-input');
		this.passwordInput = page.getByTestId('auth-password-input');
		this.submitBtn = page.getByTestId('auth-submit-btn');
		this.errorAlert = page.getByTestId('auth-error-alert');
		this.toggleModeBtn = page.getByTestId('auth-toggle-mode-btn');
		this.backToHomeLink = page.locator('a[href$="/"]'); // Flexible href
	}

	async goto(locale: string = 'en') {
		await this.page.goto(`/${locale}/auth/login`);
		await this.page.waitForLoadState('networkidle');
	}

	async login(email: string, pass: string) {
		await this.emailInput.click();
		await this.emailInput.clear();
		await this.emailInput.fill(email);

		await this.passwordInput.click();
		await this.passwordInput.clear();
		await this.passwordInput.fill(pass);

		await this.submitBtn.click();
	}

	async toggleToRegister() {
		await this.toggleModeBtn.click();
	}

	async expectError(timeout = 10000) {
		await expect(this.errorAlert).toBeVisible({ timeout });
	}

	async expectNoForgotLink() {
		const forgotLink = this.page.getByRole('button', { name: /Forgot/i });
		await expect(forgotLink).not.toBeVisible();
	}
}
