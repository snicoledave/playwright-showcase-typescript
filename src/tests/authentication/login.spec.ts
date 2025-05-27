import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { ProductsPage} from '@pages/ProductsPage';

/**
 * This test file demonstrates how to implement a BDD scenario using Playwright
 * without Cucumber. We're focusing on the successful login scenario.
 */

test.describe('Feature: Login functionality for Sauce Demo', () => {
  test('Scenario: Successful login with valid credentials', async ({ page }) => {
    // Initialize our page objects
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    // GIVEN: I am on the Sauce Demo login page
    await test.step('Given I am on the Sauce Demo login page', async () => {
      await loginPage.goto();
      // Verify we're actually on the login page (defensive programming)
      await expect(page).toHaveURL('https://www.saucedemo.com/v1/index.html');
      await expect(loginPage.loginLogo).toBeVisible();
    });
    // WHEN: I enter the following login credentials
    await test.step('When I enter the following login credentials', async () => {
      // Create a data table using Map
      // This structure directly represents the Gherkin table format
      const credentialsTable = new Map([
        ['Username', 'standard_user'],
        ['Password', 'secret_sauce']
      ]);
      // Use the page object method to fill the credentials
      await loginPage.fillCredentialsFromTable(credentialsTable);
      // Verify the values were entered correctly
      // This keeps the verification visible in the test
      await expect(loginPage.usernameInput).toHaveValue(credentialsTable.get('Username')!);
      await expect(loginPage.passwordInput).toHaveValue(credentialsTable.get('Password')!);
    }); 
    // AND: I click the Login button
    await test.step('And I click the Login button', async () => {
      await loginPage.clickLoginButton();
      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
    });
    // THEN: I should be redirected to the products page
    await test.step('Then I should be redirected to the products page', async () => {
      // Check the URL has changed to the inventory page
      await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
      // Additional check: ensure we're not still on the login page
      await expect(page).not.toHaveURL(/.*index\.html/);
    });
    // AND: I should see the products inventory
    await test.step('And I should see the products inventory', async () => {
      // Verify the products page title is visible
      await expect(productsPage.pageTitle).toBeVisible();
      await expect(productsPage.pageTitle).toHaveText('Products');
      
      // Verify the products container is displayed
      await expect(productsPage.productsContainer).toBeVisible();
      
      // Verify we have products in the inventory
      const productCount = await productsPage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
      
      // For Sauce Demo, we know there should be exactly 6 products
      expect(productCount).toBe(6);
    });
  });
});