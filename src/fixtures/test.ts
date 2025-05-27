import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { ProductsPage } from '@pages/ProductsPage';

// Define custom fixtures
type MyFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
};

// Extend base test with custom fixtures
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },
});

export { expect } from '@playwright/test';