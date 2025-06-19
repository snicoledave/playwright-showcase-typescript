import { Page, BrowserContext, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Environment } from '@config/environment';

/**
 * Comprehensive Test Helpers for OrangeHRM Testing
 * 
 * Provides utility functions for data generation, browser management,
 * file operations, and OrangeHRM-specific testing scenarios.
 */
export class TestHelpers {
  
  // ===== RANDOM DATA GENERATION =====
  
  /**
   * Generate random email address
   */
  static generateRandomEmail(domain: string = 'example.com'): string {
    const timestamp = Date.now();
    const randomStr = this.generateRandomString(5);
    return `test_${randomStr}_${timestamp}@${domain}`;
  }

  /**
   * Generate random string with specified length
   */
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random number within range
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random phone number
   */
  static generateRandomPhoneNumber(): string {
    const areaCode = this.generateRandomNumber(200, 999);
    const exchange = this.generateRandomNumber(200, 999);
    const number = this.generateRandomNumber(1000, 9999);
    return `${areaCode}-${exchange}-${number}`;
  }

  /**
   * Generate random employee ID
   */
  static generateRandomEmployeeId(): string {
    return `EMP${this.generateRandomNumber(1000, 9999)}`;
  }

  // ===== ORANGEHRM-SPECIFIC DATA GENERATION =====

  /**
   * Generate random employee data for OrangeHRM
   */
  static generateEmployeeData(): {
    firstName: string;
    lastName: string;
    middleName: string;
    employeeId: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  } {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Ashley'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const middleNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
      firstName,
      lastName,
      middleName: middleNames[Math.floor(Math.random() * middleNames.length)],
      employeeId: this.generateRandomEmployeeId(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      phone: this.generateRandomPhoneNumber(),
      address: `${this.generateRandomNumber(100, 9999)} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr'][Math.floor(Math.random() * 4)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipCode: String(this.generateRandomNumber(10000, 99999))
    };
  }

  /**
   * Generate random leave request data
   */
  static generateLeaveData(): {
    leaveType: string;
    fromDate: string;
    toDate: string;
    comment: string;
  } {
    const leaveTypes = ['Annual', 'Casual', 'Medical', 'Maternity', 'Personal'];
    const today = new Date();
    const fromDate = new Date(today.getTime() + (Math.random() * 30 + 1) * 24 * 60 * 60 * 1000);
    const toDate = new Date(fromDate.getTime() + (Math.random() * 5 + 1) * 24 * 60 * 60 * 1000);

    return {
      leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
      fromDate: this.formatDate(fromDate),
      toDate: this.formatDate(toDate),
      comment: `Leave request for ${leaveTypes[Math.floor(Math.random() * leaveTypes.length)].toLowerCase()} purposes`
    };
  }

  // ===== DATE AND TIME HELPERS =====

  /**
   * Get current date in YYYY-MM-DD format
   */
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format date with various formats
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Get date relative to today
   */
  static getRelativeDate(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return this.formatDate(date);
  }

  /**
   * Get first day of current month
   */
  static getFirstDayOfMonth(): string {
    const date = new Date();
    date.setDate(1);
    return this.formatDate(date);
  }

  /**
   * Get last day of current month
   */
  static getLastDayOfMonth(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1, 0);
    return this.formatDate(date);
  }

  // ===== WAIT AND TIMING HELPERS =====

  /**
   * Wait for specified milliseconds
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wait with random delay (useful for avoiding detection)
   */
  static async waitRandom(minMs: number, maxMs: number): Promise<void> {
    const delay = this.generateRandomNumber(minMs, maxMs);
    return this.wait(delay);
  }

  // ===== FILE OPERATIONS =====

  /**
   * Read JSON file with type safety
   */
  static readJsonFile<T>(filePath: string): T {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  }

  /**
   * Write JSON file with formatting
   */
  static writeJsonFile(filePath: string, data: any): void {
    const absolutePath = path.resolve(filePath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
  }

  /**
   * Append to log file
   */
  static appendToLogFile(filePath: string, message: string): void {
    const timestamp = this.getCurrentTimestamp();
    const logMessage = `[${timestamp}] ${message}\n`;
    const absolutePath = path.resolve(filePath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(absolutePath, logMessage);
  }

  /**
   * Check if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(path.resolve(filePath));
  }

  /**
   * Create directory if it doesn't exist
   */
  static ensureDirectoryExists(dirPath: string): void {
    const absolutePath = path.resolve(dirPath);
    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }
  }

  // ===== BROWSER AND PAGE HELPERS =====

  /**
   * Clear all browser data
   */
  static async clearAllBrowserData(page: Page): Promise<void> {
    const context = page.context();
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Clear cookies only
   */
  static async clearCookies(page: Page): Promise<void> {
    const context = page.context();
    await context.clearCookies();
  }

  /**
   * Clear local storage only
   */
  static async clearLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => localStorage.clear());
  }

  /**
   * Clear session storage only
   */
  static async clearSessionStorage(page: Page): Promise<void> {
    await page.evaluate(() => sessionStorage.clear());
  }

  /**
   * Get browser info
   */
  static async getBrowserInfo(page: Page): Promise<{
    userAgent: string;
    viewport: { width: number; height: number } | null;
    url: string;
    title: string;
  }> {
    const userAgent = await page.evaluate(() => navigator.userAgent);
    const viewport = page.viewportSize();
    const url = page.url();
    const title = await page.title();

    return { userAgent, viewport, url, title };
  }

  /**
   * Take full page screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = this.formatDate(new Date(), 'YYYY-MM-DD_HH-mm-ss');
    const filename = `${name}_${timestamp}.png`;
    const screenshotPath = `test-results/screenshots/${filename}`;
    
    this.ensureDirectoryExists('test-results/screenshots');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    return screenshotPath;
  }

  // ===== ORANGEHRM-SPECIFIC HELPERS =====

  /**
   * Wait for OrangeHRM page to load completely
   */
  static async waitForOrangeHRMPageLoad(page: Page): Promise<void> {
    // Wait for loading spinner to disappear
    try {
      await page.waitForSelector('.oxd-loading-spinner', { state: 'hidden', timeout: 10000 });
    } catch {
      // Loading spinner might not be present
    }
    
    // Wait for network to be idle
    await page.waitForLoadState('networkidle');
  }

  /**
   * Handle OrangeHRM toast messages
   */
  static async getOrangeHRMToastMessage(page: Page): Promise<string | null> {
    try {
      const toastSelector = '.oxd-toast-content--success, .oxd-toast-content--error, .oxd-toast-content--warn';
      await page.waitForSelector(toastSelector, { timeout: 5000 });
      return await page.textContent(toastSelector);
    } catch {
      return null;
    }
  }

  /**
   * Click OrangeHRM button by text
   */
  static async clickOrangeHRMButton(page: Page, buttonText: string): Promise<void> {
    const buttonSelector = `button:has-text("${buttonText}"), .oxd-button:has-text("${buttonText}")`;
    await page.click(buttonSelector);
  }

  /**
   * Fill OrangeHRM input by label
   */
  static async fillOrangeHRMInputByLabel(page: Page, labelText: string, value: string): Promise<void> {
    const inputSelector = `label:has-text("${labelText}") + * input, label:has-text("${labelText}") ~ * input`;
    await page.fill(inputSelector, value);
  }

  // ===== RETRY AND ERROR HANDLING =====

  /**
   * Retry function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000,
    backoff: number = 2
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }
      await this.wait(delay);
      return this.retry(fn, retries - 1, delay * backoff, backoff);
    }
  }

  /**
   * Retry with custom error handling
   */
  static async retryWithErrorHandling<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000,
    errorHandler?: (error: any, attempt: number) => void
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (errorHandler) {
          errorHandler(error, attempt);
        }
        
        if (attempt <= retries) {
          await this.wait(delay);
        }
      }
    }
    
    throw lastError;
  }

  // ===== VALIDATION HELPERS =====

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  static isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  }

  // ===== LOGGING AND DEBUGGING =====

  /**
   * Log test step with timestamp
   */
  static logTestStep(step: string, details?: any): void {
    const timestamp = this.getCurrentTimestamp();
    console.log(`[${timestamp}] TEST STEP: ${step}`);
    if (details) {
      console.log('Details:', details);
    }
  }

  /**
   * Log error with context
   */
  static logError(error: any, context?: string): void {
    const timestamp = this.getCurrentTimestamp();
    console.error(`[${timestamp}] ERROR${context ? ` in ${context}` : ''}:`, error);
  }

  /**
   * Create test report data
   */
  static createTestReport(testName: string, status: 'PASS' | 'FAIL', duration: number, error?: any): any {
    return {
      testName,
      status,
      duration,
      timestamp: this.getCurrentTimestamp(),
      error: error ? String(error) : null,
      environment: Environment.getConfig().baseUrl
    };
  }
}