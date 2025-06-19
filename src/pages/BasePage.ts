import { Page, Locator, BrowserContext, expect } from '@playwright/test';
import { Environment } from '@config/environment';

export abstract class BasePage {
  protected page: Page;
  protected context: BrowserContext;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.context = page.context();
    this.baseUrl = Environment.getConfig().baseUrl;
  }

  // Common navigation methods
  async navigateTo(path: string): Promise<void> {
    const fullUrl = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    await this.page.goto(fullUrl);
    await this.waitForPageLoad();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async refreshPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  // Enhanced wait methods
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForElementToBeHidden(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  async waitForUrl(urlPattern: string | RegExp, timeout?: number): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  // OrangeHRM-specific wait methods
  async waitForOrangeHRMPageLoad(): Promise<void> {
    // Wait for OrangeHRM's common loading indicators to disappear
    try {
      await this.page.waitForSelector('.oxd-loading-spinner', { state: 'hidden', timeout: 10000 });
    } catch {
      // Loading spinner might not be present, continue
    }
    await this.waitForPageLoad();
  }

  async waitForToastMessage(): Promise<string> {
    const toastSelector = '.oxd-toast-content--success, .oxd-toast-content--error, .oxd-toast-content--warn';
    await this.page.waitForSelector(toastSelector, { timeout: 10000 });
    const toastText = await this.getText(toastSelector);
    return toastText;
  }

  // Enhanced element interaction methods
  async click(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    await this.page.click(selector, options);
  }

  async doubleClick(selector: string): Promise<void> {
    await this.page.dblclick(selector);
  }

  async rightClick(selector: string): Promise<void> {
    await this.page.click(selector, { button: 'right' });
  }

  async hover(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  async fill(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    await this.page.fill(selector, value, options);
  }

  async type(selector: string, text: string, options?: { delay?: number }): Promise<void> {
    await this.page.type(selector, text, options);
  }

  async clear(selector: string): Promise<void> {
    await this.page.fill(selector, '');
  }

  async selectOption(selector: string, value: string | string[]): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  async check(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  async uncheck(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  // Enhanced text and attribute methods
  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async getInnerText(selector: string): Promise<string> {
    return await this.page.innerText(selector);
  }

  async getValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.getAttribute(selector, attribute);
  }

  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // Enhanced visibility and state methods
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async isHidden(selector: string): Promise<boolean> {
    return await this.page.isHidden(selector);
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }

  async isDisabled(selector: string): Promise<boolean> {
    return await this.page.isDisabled(selector);
  }

  async isChecked(selector: string): Promise<boolean> {
    return await this.page.isChecked(selector);
  }

  // OrangeHRM-specific utility methods
  async clickOrangeHRMButton(buttonText: string): Promise<void> {
    const buttonSelector = `button:has-text("${buttonText}"), .oxd-button:has-text("${buttonText}")`;
    await this.click(buttonSelector);
  }

  async fillOrangeHRMInput(labelText: string, value: string): Promise<void> {
    // OrangeHRM often uses labels with associated inputs
    const inputSelector = `label:has-text("${labelText}") + * input, label:has-text("${labelText}") ~ * input`;
    await this.fill(inputSelector, value);
  }

  async selectFromOrangeHRMDropdown(labelText: string, optionText: string): Promise<void> {
    // Click dropdown
    const dropdownSelector = `label:has-text("${labelText}") + * .oxd-select-text, label:has-text("${labelText}") ~ * .oxd-select-text`;
    await this.click(dropdownSelector);
    
    // Select option
    const optionSelector = `.oxd-select-option:has-text("${optionText}")`;
    await this.click(optionSelector);
  }

  async getOrangeHRMTableData(tableSelector: string = '.oxd-table'): Promise<string[][]> {
    const rows = await this.page.locator(`${tableSelector} .oxd-table-row`).all();
    const tableData: string[][] = [];
    
    for (const row of rows) {
      const cells = await row.locator('.oxd-table-cell').all();
      const rowData: string[] = [];
      
      for (const cell of cells) {
        const cellText = await cell.innerText();
        rowData.push(cellText.trim());
      }
      
      if (rowData.length > 0) {
        tableData.push(rowData);
      }
    }
    
    return tableData;
  }

  // Screenshot and debugging methods
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await this.page.screenshot({ 
      path: `test-results/screenshots/${filename}`,
      fullPage: true 
    });
  }

  async takeElementScreenshot(selector: string, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-element-${timestamp}.png`;
    await this.page.locator(selector).screenshot({ 
      path: `test-results/screenshots/${filename}` 
    });
  }

  async logPageInfo(): Promise<void> {
    console.log(`Current URL: ${await this.getCurrentUrl()}`);
    console.log(`Page Title: ${await this.getTitle()}`);
  }

  // Assertion helpers
  async expectElementToBeVisible(selector: string, message?: string): Promise<void> {
    await expect(this.page.locator(selector), message).toBeVisible();
  }

  async expectElementToBeHidden(selector: string, message?: string): Promise<void> {
    await expect(this.page.locator(selector), message).toBeHidden();
  }

  async expectElementToHaveText(selector: string, expectedText: string, message?: string): Promise<void> {
    await expect(this.page.locator(selector), message).toHaveText(expectedText);
  }

  async expectElementToContainText(selector: string, expectedText: string, message?: string): Promise<void> {
    await expect(this.page.locator(selector), message).toContainText(expectedText);
  }

  async expectUrlToContain(expectedUrlPart: string, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(new RegExp(expectedUrlPart));
  }

  // Get locator helper (enhanced)
  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected getLocatorByText(text: string): Locator {
    return this.page.getByText(text);
  }

  protected getLocatorByRole(role: string, options?: { name?: string }): Locator {
    return this.page.getByRole(role as any, options);
  }

  protected getLocatorByLabel(label: string): Locator {
    return this.page.getByLabel(label);
  }

  protected getLocatorByPlaceholder(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }
}