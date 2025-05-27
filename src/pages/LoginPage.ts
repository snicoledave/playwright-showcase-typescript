import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Define selectors as private readonly properties
  private readonly usernameInput = '#username';
  private readonly passwordInput = '#password';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = '.error-message';
  private readonly rememberMeCheckbox = '#remember-me';
  private readonly forgotPasswordLink = 'a[href="/forgot-password"]';

  constructor(page: Page) {
    super(page);
  }

  // Navigation
  async goto(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  // Actions
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async fillUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  async checkRememberMe(): Promise<void> {
    await this.click(this.rememberMeCheckbox);
  }

  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  // Assertions
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  // Wait methods
  async waitForLoginToComplete(): Promise<void> {
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }
}