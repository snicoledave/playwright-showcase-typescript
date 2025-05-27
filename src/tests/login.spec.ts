import { test, expect } from '@fixtures/test';
import { Environment } from '@config/environment';

const config = Environment.getConfig();

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ loginPage, page }) => {
    // Arrange
    const username = config.username;
    const password = config.password;

    // Act
    await loginPage.login(username, password);

    // Assert
    await loginPage.waitForLoginToComplete();
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page).toHaveTitle(/Dashboard/);
  });

  test('should show error message with invalid credentials', async ({ loginPage }) => {
    // Arrange
    const invalidUsername = 'invalid@example.com';
    const invalidPassword = 'wrongpassword';

    // Act
    await loginPage.login(invalidUsername, invalidPassword);

    // Assert
    await expect(loginPage.isErrorMessageVisible()).resolves.toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('should navigate to forgot password page', async ({ loginPage, page }) => {
    // Act
    await loginPage.clickForgotPassword();

    // Assert
    await expect(page).toHaveURL(/.*forgot-password/);
    await expect(page).toHaveTitle(/Reset Password/);
  });

  test('should remember user when checkbox is checked', async ({ loginPage, page }) => {
    // Arrange
    const username = config.username;
    const password = config.password;

    // Act
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.checkRememberMe();
    await loginPage.clickLoginButton();

    // Assert
    await loginPage.waitForLoginToComplete();
    const cookies = await page.context().cookies();
    const rememberMeCookie = cookies.find(cookie => cookie.name === 'remember_me');
    expect(rememberMeCookie).toBeDefined();
  });

  test('login button should be disabled with empty fields', async ({ loginPage }) => {
    // Assert
    const isEnabled = await loginPage.isLoginButtonEnabled();
    expect(isEnabled).toBe(false);
  });
});