import { test, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from '../pages/LoginPage';
import { OrangeHRMDashboardPage } from '../pages/DashboardPage';
import { 
  getValidCredentials, 
  getInvalidCredentials,
  getEmptyUsernameScenario,
  getEmptyPasswordScenario,
  getBothFieldsEmptyScenario
} from '../utils/testData';

/**
 * Feature: OrangeHRM User Login
 * 
 * As a user of the OrangeHRM system
 * I want to be able to log into the application
 * So that I can access the HR management features
 */

test.describe('Feature: OrangeHRM User Login', () => {
  let loginPage: OrangeHRMLoginPage;
  let dashboardPage: OrangeHRMDashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new OrangeHRMLoginPage(page);
    dashboardPage = new OrangeHRMDashboardPage(page);
  });

  test('Scenario: Successful login with valid credentials', async ({ page }) => {
    const credentials = getValidCredentials();

    await test.step('Given I am on the OrangeHRM login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPage();
    });

    await test.step('When I enter valid username and password', async () => {
      await loginPage.enterUsername(credentials.username);
      await loginPage.enterPassword(credentials.password);
    });

    await test.step('And I click the login button', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Then I should be redirected to the dashboard', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.verifyDashboardPage();
      
      const dashboardTitle = await dashboardPage.getDashboardTitle();
      expect(dashboardTitle).toBe('Dashboard');
      expect(page.url()).toContain('/dashboard');
    });
  });

  test('Scenario: Login fails with invalid credentials', async ({ page }) => {
    const credentials = getInvalidCredentials();

    await test.step('Given I am on the OrangeHRM login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPage();
    });

    await test.step('When I enter invalid username and password', async () => {
      await loginPage.enterUsername(credentials.username);
      await loginPage.enterPassword(credentials.password);
    });

    await test.step('And I click the login button', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Then I should see an error message', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain('Invalid credentials');
    });

    await test.step('And I should remain on the login page', async () => {
      await loginPage.verifyLoginPage();
      expect(page.url()).not.toContain('/dashboard');
    });
  });

  test('Scenario: Login validation when username field is empty', async ({ page }) => {
    const credentials = getEmptyUsernameScenario();

    await test.step('Given I am on the OrangeHRM login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPage();
    });

    await test.step('When I leave the username field empty', async () => {
      await loginPage.enterUsername(credentials.username); // empty string
      await loginPage.enterPassword(credentials.password);
    });

    await test.step('And I click the login button', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Then the system should prevent login', async () => {
      const isErrorVisible = await loginPage.isErrorVisible();
      const usernameValue = await loginPage.getUsernameValue();
      
      if (isErrorVisible) {
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toBeTruthy();
      } else {
        expect(usernameValue).toBe('');
        await loginPage.verifyLoginPage();
      }
      
      expect(page.url()).not.toContain('/dashboard');
    });
  });

  test('Scenario: Login validation when password field is empty', async ({ page }) => {
    const credentials = getEmptyPasswordScenario();

    await test.step('Given I am on the OrangeHRM login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPage();
    });

    await test.step('When I leave the password field empty', async () => {
      await loginPage.enterUsername(credentials.username);
      await loginPage.enterPassword(credentials.password); // empty string
    });

    await test.step('And I click the login button', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Then the system should prevent login', async () => {
      const isErrorVisible = await loginPage.isErrorVisible();
      const passwordValue = await loginPage.getPasswordValue();
      
      if (isErrorVisible) {
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toBeTruthy();
      } else {
        expect(passwordValue).toBe('');
        await loginPage.verifyLoginPage();
      }
      
      expect(page.url()).not.toContain('/dashboard');
    });
  });

  test('Scenario: Login validation when both fields are empty', async ({ page }) => {
    const credentials = getBothFieldsEmptyScenario();

    await test.step('Given I am on the OrangeHRM login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPage();
    });

    await test.step('When I leave both username and password fields empty', async () => {
      await loginPage.enterUsername(credentials.username); // empty string
      await loginPage.enterPassword(credentials.password); // empty string
    });

    await test.step('And I click the login button', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Then the system should prevent login', async () => {
      const isErrorVisible = await loginPage.isErrorVisible();
      const usernameValue = await loginPage.getUsernameValue();
      const passwordValue = await loginPage.getPasswordValue();
      
      if (isErrorVisible) {
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toBeTruthy();
      } else {
        expect(usernameValue).toBe('');
        expect(passwordValue).toBe('');
        await loginPage.verifyLoginPage();
      }
      
      expect(page.url()).not.toContain('/dashboard');
    });
  });

  test('Scenario: User can clear form and retry login', async ({ page }) => {
    const invalidCredentials = getInvalidCredentials();
    const validCredentials = getValidCredentials();

    await test.step('Given I am on the OrangeHRM login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginPage();
    });

    await test.step('When I enter invalid credentials first', async () => {
      await loginPage.login(invalidCredentials.username, invalidCredentials.password);
    });

    await test.step('And I clear the login form', async () => {
      await loginPage.clearForm();
      
      expect(await loginPage.getUsernameValue()).toBe('');
      expect(await loginPage.getPasswordValue()).toBe('');
    });

    await test.step('And I enter valid credentials', async () => {
      await loginPage.enterUsername(validCredentials.username);
      await loginPage.enterPassword(validCredentials.password);
      await loginPage.clickLogin();
    });

    await test.step('Then I should successfully login to the dashboard', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.verifyDashboardPage();
    });
  });

  test('Scenario: User can logout after successful login', async ({ page }) => {
    const credentials = getValidCredentials();

    await test.step('Given I am logged into the OrangeHRM system', async () => {
      await loginPage.goto();
      await loginPage.login(credentials.username, credentials.password);
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.verifyDashboardPage();
    });

    await test.step('When I click the logout option', async () => {
      await dashboardPage.logout();
    });

    await test.step('Then I should be redirected back to the login page', async () => {
      await loginPage.verifyLoginPage();
      expect(page.url()).not.toContain('/dashboard');
    });
  });
});