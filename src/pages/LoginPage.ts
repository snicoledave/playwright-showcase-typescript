import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Environment } from '@config/environment';

/**
 * OrangeHRM Login Page Object
 * 
 * Comprehensive page object for the OrangeHRM demo login page.
 * Contains all elements and actions needed for login functionality including
 * validation, error handling, and various login scenarios.
 */
export class OrangeHRMLoginPage extends BasePage {
  // Form elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly usernameLabel: Locator;
  readonly passwordLabel: Locator;

  // Error and validation elements
  readonly errorMessage: Locator;
  readonly usernameRequiredError: Locator;
  readonly passwordRequiredError: Locator;
  readonly invalidCredentialsError: Locator;

  // Page elements
  readonly forgotPasswordLink: Locator;
  readonly loginLogo: Locator;
  readonly loginBanner: Locator;
  readonly loginCard: Locator;
  readonly loginTitle: Locator;
  readonly companyBranding: Locator;

  // Social media links (if present)
  readonly socialMediaLinks: Locator;
  readonly linkedInLink: Locator;
  readonly facebookLink: Locator;
  readonly twitterLink: Locator;
  readonly youtubeLink: Locator;

  // Footer elements
  readonly copyrightText: Locator;
  readonly versionInfo: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize form locators
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.usernameLabel = page.locator('label').filter({ hasText: 'Username' });
    this.passwordLabel = page.locator('label').filter({ hasText: 'Password' });

    // Initialize error and validation locators
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.usernameRequiredError = page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('.oxd-text--span');
    this.passwordRequiredError = page.locator('.oxd-input-group').filter({ hasText: 'Password' }).locator('.oxd-text--span');
    this.invalidCredentialsError = page.locator('.oxd-alert--error .oxd-alert-content-text');

    // Initialize page element locators
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.loginLogo = page.locator('img[alt="company-branding"]');
    this.loginBanner = page.locator('.orangehrm-login-branding');
    this.loginCard = page.locator('.orangehrm-login-container');
    this.loginTitle = page.locator('.orangehrm-login-title');
    this.companyBranding = page.locator('.orangehrm-login-branding');

    // Initialize social media locators
    this.socialMediaLinks = page.locator('.orangehrm-login-footer-sm');
    this.linkedInLink = page.locator('a[href*="linkedin"]');
    this.facebookLink = page.locator('a[href*="facebook"]');
    this.twitterLink = page.locator('a[href*="twitter"]');
    this.youtubeLink = page.locator('a[href*="youtube"]');

    // Initialize footer locators
    this.copyrightText = page.locator('.orangehrm-copyright-wrapper');
    this.versionInfo = page.locator('.orangehrm-version');
  }

  /**
   * Navigate to the OrangeHRM login page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForLoginPageLoad();
  }

  /**
   * Wait for login page to load completely
   */
  async waitForLoginPageLoad(): Promise<void> {
    await this.waitForElement('input[name="username"]');
    await this.waitForElement('input[name="password"]');
    await this.waitForElement('button[type="submit"]');
    await this.waitForOrangeHRMPageLoad();
  }

  /**
   * Enter username in the username field
   */
  async enterUsername(username: string): Promise<void> {
    await this.fill('input[name="username"]', username);
  }

  /**
   * Enter password in the password field
   */
  async enterPassword(password: string): Promise<void> {
    await this.fill('input[name="password"]', password);
  }

  /**
   * Click the login button
   */
  async clickLogin(): Promise<void> {
    await this.click('button[type="submit"]');
  }

  /**
   * Perform complete login action
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Login with valid admin credentials from environment
   */
  async loginWithValidCredentials(): Promise<void> {
    const credentials = Environment.getValidCredentials();
    await this.login(credentials.username, credentials.password);
    await this.waitForSuccessfulLogin();
  }

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials(): Promise<void> {
    const credentials = Environment.getInvalidCredentials();
    await this.login(credentials.username, credentials.password);
    await this.waitForErrorMessage();
  }

  /**
   * Login and wait for successful navigation to dashboard
   */
  async loginAndWaitForDashboard(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.waitForSuccessfulLogin();
  }

  /**
   * Wait for successful login (dashboard page)
   */
  async waitForSuccessfulLogin(): Promise<void> {
    await this.waitForUrl(/dashboard/, 15000);
    await this.waitForElement('.oxd-topbar-header-breadcrumb h6');
  }

  /**
   * Wait for error message to appear
   */
  async waitForErrorMessage(): Promise<void> {
    await this.waitForElement('.oxd-alert-content-text', 10000);
  }

  // Error handling methods
  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement('.oxd-alert-content-text');
    return await this.getText('.oxd-alert-content-text');
  }

  /**
   * Check if error message is visible
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible('.oxd-alert-content-text');
  }

  /**
   * Get username required error message
   */
  async getUsernameRequiredError(): Promise<string> {
    const errorLocator = '.oxd-input-group:has(input[name="username"]) .oxd-text--span';
    return await this.getText(errorLocator);
  }

  /**
   * Get password required error message
   */
  async getPasswordRequiredError(): Promise<string> {
    const errorLocator = '.oxd-input-group:has(input[name="password"]) .oxd-text--span';
    return await this.getText(errorLocator);
  }

  /**
   * Check if username field has error
   */
  async hasUsernameError(): Promise<boolean> {
    const errorLocator = '.oxd-input-group:has(input[name="username"]) .oxd-text--span';
    return await this.isVisible(errorLocator);
  }

  /**
   * Check if password field has error
   */
  async hasPasswordError(): Promise<boolean> {
    const errorLocator = '.oxd-input-group:has(input[name="password"]) .oxd-text--span';
    return await this.isVisible(errorLocator);
  }

  // Form interaction methods
  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.clear('input[name="username"]');
    await this.clear('input[name="password"]');
  }

  /**
   * Get username field value
   */
  async getUsernameValue(): Promise<string> {
    return await this.getValue('input[name="username"]');
  }

  /**
   * Get password field value
   */
  async getPasswordValue(): Promise<string> {
    return await this.getValue('input[name="password"]');
  }

  /**
   * Check if username field is focused
   */
  async isUsernameFieldFocused(): Promise<boolean> {
    return await this.page.locator('input[name="username"]').evaluate(el => el === document.activeElement);
  }

  /**
   * Check if password field is focused
   */
  async isPasswordFieldFocused(): Promise<boolean> {
    return await this.page.locator('input[name="password"]').evaluate(el => el === document.activeElement);
  }

  /**
   * Tab from username to password field
   */
  async tabToPasswordField(): Promise<void> {
    await this.usernameInput.press('Tab');
  }

  /**
   * Press Enter to submit form
   */
  async pressEnterToLogin(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  // Navigation methods
  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click('.orangehrm-login-forgot-header');
    await this.waitForUrl(/requestPasswordResetCode/);
  }

  // Validation methods
  /**
   * Verify we are on the login page
   */
  async verifyLoginPage(): Promise<void> {
    await this.expectElementToBeVisible('input[name="username"]', 'Username field should be visible');
    await this.expectElementToBeVisible('input[name="password"]', 'Password field should be visible');
    await this.expectElementToBeVisible('button[type="submit"]', 'Login button should be visible');
    await this.expectUrlToContain('login', 'Should be on login page');
  }

  /**
   * Verify login page elements are present
   */
  async verifyLoginPageElements(): Promise<void> {
    await this.verifyLoginPage();
    await this.expectElementToBeVisible('.orangehrm-login-container', 'Login container should be visible');
    await this.expectElementToBeVisible('img[alt="company-branding"]', 'Company logo should be visible');
  }

  /**
   * Verify login form is interactive
   */
  async verifyLoginFormInteractive(): Promise<void> {
    // Check if form elements are enabled
    await expect(this.usernameInput).toBeEnabled();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.loginButton).toBeEnabled();
  }

  /**
   * Verify error message for invalid credentials
   */
  async verifyInvalidCredentialsError(): Promise<void> {
    await this.expectElementToBeVisible('.oxd-alert--error', 'Error alert should be visible');
    const errorText = await this.getErrorMessage();
    expect(errorText.toLowerCase()).toContain('invalid');
  }

  /**
   * Verify required field errors
   */
  async verifyRequiredFieldErrors(): Promise<void> {
    await this.clickLogin(); // Try to login with empty fields
    
    // Check for required field errors
    const hasUsernameError = await this.hasUsernameError();
    const hasPasswordError = await this.hasPasswordError();
    
    expect(hasUsernameError || hasPasswordError).toBeTruthy();
  }

  // Utility methods
  /**
   * Get login page title
   */
  async getLoginPageTitle(): Promise<string> {
    return await this.getTitle();
  }

  /**
   * Check if forgot password link is visible
   */
  async isForgotPasswordLinkVisible(): Promise<boolean> {
    return await this.isVisible('.orangehrm-login-forgot-header');
  }

  /**
   * Get company branding text
   */
  async getCompanyBrandingText(): Promise<string> {
    return await this.getText('.orangehrm-login-branding');
  }

  /**
   * Check if social media links are present
   */
  async areSocialMediaLinksVisible(): Promise<boolean> {
    return await this.isVisible('.orangehrm-login-footer-sm');
  }

  /**
   * Get copyright text
   */
  async getCopyrightText(): Promise<string> {
    return await this.getText('.orangehrm-copyright-wrapper');
  }

  /**
   * Take screenshot of login page
   */
  async takeScreenshot(name: string = 'login-page'): Promise<void> {
    await super.takeScreenshot(name);
  }

  /**
   * Get login page summary information
   */
  async getLoginPageSummary(): Promise<{
    title: string;
    hasLogo: boolean;
    hasForgotPassword: boolean;
    hasSocialLinks: boolean;
    copyrightText: string;
  }> {
    return {
      title: await this.getLoginPageTitle(),
      hasLogo: await this.isVisible('img[alt="company-branding"]'),
      hasForgotPassword: await this.isForgotPasswordLinkVisible(),
      hasSocialLinks: await this.areSocialMediaLinksVisible(),
      copyrightText: await this.getCopyrightText()
    };
  }
}