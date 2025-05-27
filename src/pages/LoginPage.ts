import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage encapsulates all interactions with the Sauce Demo login page.
 * This class follows the Page Object Model pattern to provide a clean,
 * maintainable interface for our BDD-style tests.
 */
export class LoginPage extends BasePage {
  // Define locators as public readonly properties
  // This allows direct access in tests while preventing accidental reassignment
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLogo: Locator;
  readonly errorMessageContainer: Locator;
  readonly errorMessageButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators using Playwright's recommended patterns
    // Sauce Demo uses data-test attributes for some elements, which is ideal for test automation
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginLogo = page.locator('.login_logo');
    this.errorMessageContainer = page.locator('.error-message-container');
    this.errorMessageButton = page.locator('.error-button');
  }

  /**
   * Navigate to the login page and ensure it's fully loaded.
   * This method serves as our entry point for all login-related tests.
   */
  async goto(): Promise<void> {
    // Navigate to the specific login page URL
    await this.navigateTo('/index.html');
    
    // Wait for the page to be fully loaded
    await this.waitForPageLoad();
    
    // Additional verification that we're on the correct page
    // This helps catch navigation errors early in the test
    await this.loginLogo.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Enter a username into the username field.
   * This method focuses on a single action, making tests more readable.
   * 
   * @param username - The username to enter
   */
  async enterUsername(username: string): Promise<void> {
    // Clear any existing value first to ensure clean state
    await this.usernameInput.clear();
    // Type the username
    await this.usernameInput.fill(username);
  }

  /**
   * Enter a password into the password field.
   * Maintains consistency with enterUsername for predictable behavior.
   * 
   * @param password - The password to enter
   */
  async enterPassword(password: string): Promise<void> {
    // Clear any existing value first
    await this.passwordInput.clear();
    // Type the password
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button to submit the login form.
   * This method handles just the click action, letting tests control the flow.
   */
  async clickLoginButton(): Promise<void> {
    // Ensure the button is clickable before attempting to click
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  /**
   * Perform a complete login operation.
   * This convenience method combines the individual steps for scenarios
   * where we just need to log in without focusing on the individual actions.
   * 
   * @param username - The username to use for login
   * @param password - The password to use for login
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Process a data table of login credentials.
   * This method is designed to work with our BDD Map-based data tables,
   * making it easy to handle various field types in a extensible way.
   * 
   * @param credentialsTable - A Map containing field names and values
   */
  async fillCredentialsFromTable(credentialsTable: Map<string, string>): Promise<void> {
    for (const [field, value] of credentialsTable) {
      switch (field) {
        case 'Username':
          await this.enterUsername(value);
          break;
        case 'Password':
          await this.enterPassword(value);
          break;
        default:
          // This helps catch typos or unexpected fields in our data tables
          throw new Error(`Unknown field in credentials table: ${field}`);
      }
    }
  }

  /**
   * Get the current error message text.
   * Returns empty string if no error message is present.
   */
  async getErrorMessage(): Promise<string> {
    try {
      // Wait briefly for error message to appear
      await this.errorMessage.waitFor({ state: 'visible', timeout: 2000 });
      return await this.errorMessage.textContent() || '';
    } catch {
      // If error message doesn't appear, return empty string
      return '';
    }
  }

  /**
   * Check if an error message is currently displayed.
   * Useful for assertions in negative test scenarios.
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Close the error message if it has a close button.
   * Some error implementations include dismissible messages.
   */
  async closeErrorMessage(): Promise<void> {
    if (await this.errorMessageButton.isVisible()) {
      await this.errorMessageButton.click();
      // Wait for the error message to disappear
      await this.errorMessage.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Wait for successful login by checking for navigation.
   * This method encapsulates the logic for determining when login is complete.
   */
  async waitForLoginSuccess(): Promise<void> {
    // Wait for URL to change from login page to inventory page
    await this.page.waitForURL('**/inventory.html', { 
      timeout: 10000,
      waitUntil: 'networkidle' 
    });
  }

  /**
   * Verify that all login page elements are present and visible.
   * This is useful for initial page validation in tests.
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    try {
      // Check all critical elements are visible
      const elementsToCheck = [
        this.loginLogo,
        this.usernameInput,
        this.passwordInput,
        this.loginButton
      ];
      
      // Use Promise.all to check all elements in parallel
      const visibilityChecks = await Promise.all(
        elementsToCheck.map(element => element.isVisible())
      );
      
      // Return true only if all elements are visible
      return visibilityChecks.every(isVisible => isVisible);
    } catch {
      return false;
    }
  }

  /**
   * Get the list of accepted usernames displayed on the login page.
   * Sauce Demo helpfully shows valid usernames for testing.
   */
  async getAcceptedUsernames(): Promise<string[]> {
    const credentialsContainer = this.page.locator('#login_credentials');
    
    // Check if the credentials section exists
    if (await credentialsContainer.count() === 0) {
      return [];
    }
    
    const text = await credentialsContainer.textContent() || '';
    
    // Parse the text to extract usernames
    // The format is usually "Accepted usernames are:\n username1\n username2\n ..."
    const lines = text.split('\n');
    return lines
      .slice(1) // Skip the header line
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  /**
   * Get the password hint displayed on the login page.
   * Sauce Demo shows the password for all users.
   */
  async getPasswordHint(): Promise<string> {
    const passwordContainer = this.page.locator('.login_password');
    
    if (await passwordContainer.count() === 0) {
      return '';
    }
    
    const text = await passwordContainer.textContent() || '';
    
    // Extract password from text like "Password for all users:\nsecret_sauce"
    const lines = text.split('\n');
    return lines.length > 1 ? lines[1].trim() : '';
  }

  /**
   * Check if the username field has a specific validation state.
   * Useful for testing field validation behavior.
   */
  async hasUsernameError(): Promise<boolean> {
    // Check if the username input has error styling
    const errorClass = await this.usernameInput.getAttribute('class') || '';
    return errorClass.includes('error');
  }

  /**
   * Check if the password field has a specific validation state.
   * Useful for testing field validation behavior.
   */
  async hasPasswordError(): Promise<boolean> {
    // Check if the password input has error styling
    const errorClass = await this.passwordInput.getAttribute('class') || '';
    return errorClass.includes('error');
  }
}