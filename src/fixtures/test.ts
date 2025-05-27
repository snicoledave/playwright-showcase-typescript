import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';

// Define custom fixtures
type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
};

// Extend base test with custom fixtures
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect } from '@playwright/test';