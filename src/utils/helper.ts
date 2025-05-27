import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class TestHelpers {
  // Generate random data
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    return `test_${timestamp}@example.com`;
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Date helpers
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  // Wait helpers
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // File helpers
  static readJsonFile<T>(filePath: string): T {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  }

  static writeJsonFile(filePath: string, data: any): void {
    const absolutePath = path.resolve(filePath);
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
  }

  // Browser helpers
  static async clearCookies(page: Page): Promise<void> {
    const context = page.context();
    await context.clearCookies();
  }

  static async clearLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => localStorage.clear());
  }

  static async clearSessionStorage(page: Page): Promise<void> {
    await page.evaluate(() => sessionStorage.clear());
  }

  // Retry mechanism
  static async retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }
      await this.wait(delay);
      return this.retry(fn, retries - 1, delay);
    }
  }
}