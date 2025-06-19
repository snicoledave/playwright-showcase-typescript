import { test as base, BrowserContext, Page } from '@playwright/test';
import { OrangeHRMLoginPage } from '@pages/LoginPage';
import { OrangeHRMDashboardPage } from '@pages/DashboardPage';
import { Environment } from '@config/environment';
import * as fs from 'fs';

// Define custom fixtures for OrangeHRM testing
type OrangeHRMFixtures = {
  loginPage: OrangeHRMLoginPage;
  dashboardPage: OrangeHRMDashboardPage;
  authenticatedPage: Page;
  authenticatedContext: BrowserContext;
  environment: ReturnType<typeof Environment.getConfig>;
};

// Extend base test with custom fixtures
export const test = base.extend<OrangeHRMFixtures>({
  // Environment configuration fixture
  environment: async ({}, use) => {
    const config = Environment.getConfig();
    await use(config);
  },

  // OrangeHRM Login Page fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new OrangeHRMLoginPage(page);
    await use(loginPage);
  },

  // OrangeHRM Dashboard Page fixture
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new OrangeHRMDashboardPage(page);
    await use(dashboardPage);
  },

  // Pre-authenticated page fixture - useful for tests that don't need to test login
  authenticatedPage: async ({ browser, environment }, use) => {
    let context: BrowserContext;
    let page: Page;

    // Try to use saved authentication state if it exists
    const authStatePath = 'auth-state/admin-auth.json';
    if (fs.existsSync(authStatePath)) {
      // Use saved authentication state
      context = await browser.newContext({ storageState: authStatePath });
      page = await context.newPage();
      
      // Navigate to dashboard to verify auth state is still valid
      await page.goto(environment.baseUrl + '/web/index.php/dashboard/index');
      
      // Check if we're still logged in by looking for dashboard elements
      try {
        await page.waitForSelector('.oxd-topbar-header-breadcrumb h6', { timeout: 5000 });
      } catch {
        // Auth state is invalid, need to login manually
        await page.goto(environment.baseUrl);
        await page.fill('input[name="username"]', environment.username);
        await page.fill('input[name="password"]', environment.password);
        await page.click('button[type="submit"]');
        await page.waitForSelector('.oxd-topbar-header-breadcrumb h6');
      }
    } else {
      // No saved auth state, login manually
      context = await browser.newContext();
      page = await context.newPage();
      
      await page.goto(environment.baseUrl);
      await page.fill('input[name="username"]', environment.username);
      await page.fill('input[name="password"]', environment.password);
      await page.click('button[type="submit"]');
      await page.waitForSelector('.oxd-topbar-header-breadcrumb h6');
    }

    await use(page);
    await context.close();
  },

  // Pre-authenticated context fixture - useful for tests that need multiple pages
  authenticatedContext: async ({ browser, environment }, use) => {
    let context: BrowserContext;

    // Try to use saved authentication state if it exists
    const authStatePath = 'auth-state/admin-auth.json';
    if (fs.existsSync(authStatePath)) {
      context = await browser.newContext({ storageState: authStatePath });
      
      // Verify auth state is still valid
      const page = await context.newPage();
      await page.goto(environment.baseUrl + '/web/index.php/dashboard/index');
      
      try {
        await page.waitForSelector('.oxd-topbar-header-breadcrumb h6', { timeout: 5000 });
        await page.close();
      } catch {
        // Auth state is invalid, need to login manually
        await page.goto(environment.baseUrl);
        await page.fill('input[name="username"]', environment.username);
        await page.fill('input[name="password"]', environment.password);
        await page.click('button[type="submit"]');
        await page.waitForSelector('.oxd-topbar-header-breadcrumb h6');
        
        // Save the new auth state
        await context.storageState({ path: authStatePath });
        await page.close();
      }
    } else {
      // No saved auth state, login manually and save it
      context = await browser.newContext();
      const page = await context.newPage();
      
      await page.goto(environment.baseUrl);
      await page.fill('input[name="username"]', environment.username);
      await page.fill('input[name="password"]', environment.password);
      await page.click('button[type="submit"]');
      await page.waitForSelector('.oxd-topbar-header-breadcrumb h6');
      
      // Save auth state for future use
      await context.storageState({ path: authStatePath });
      await page.close();
    }

    await use(context);
    await context.close();
  },
});

export { expect } from '@playwright/test';