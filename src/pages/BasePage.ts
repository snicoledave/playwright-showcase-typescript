import { Page, Locator, BrowserContext } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected context: BrowserContext;

  constructor(page: Page) {
    this.page = page;
    this.context = page.context();
  }

  // Common navigation methods
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // Common wait methods
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  // Common element interaction methods
  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }

  // Screenshot method
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  // Get locator helper
  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }
}