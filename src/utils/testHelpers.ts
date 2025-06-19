/**
 * Test Helper Utilities for OrangeHRM BDD Tests
 * 
 * This module provides reusable helper functions that support BDD test structure
 * while maintaining test isolation and readability for OrangeHRM testing.
 */

import { Page, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from '@pages/LoginPage';
import { OrangeHRMDashboardPage } from '@pages/DashboardPage';
import type { LoginCredentials } from '@utils/testData';
import { Environment } from '@config/environment';

/**
 * Common test steps that can be reused across different test files
 * These encapsulate common Given/When/Then patterns while keeping tests readable
 */
export class BDDTestSteps {
  
  /**
   * Common "Given" steps for login scenarios
   */
  static async givenUserIsOnLoginPage(page: Page): Promise<OrangeHRMLoginPage> {
    const loginPage = new OrangeHRMLoginPage(page);
    await loginPage.goto();
    
    // Verify we're on the correct page
    await expect(page).toHaveURL(/.*login/);
    await loginPage.verifyLoginPage();
    
    return loginPage;
  }

  /**
   * Common "When" step for successful login
   */
  static async whenUserLogsInWith(loginPage: OrangeHRMLoginPage, credentials: LoginCredentials): Promise<void> {
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.waitForSuccessfulLogin();
  }

  /**
   * Common "When" step for login with environment credentials
   */
  static async whenUserLogsInWithValidCredentials(loginPage: OrangeHRMLoginPage): Promise<void> {
    await loginPage.loginWithValidCredentials();
  }

  /**
   * Common "Then" step for successful login verification
   */
  static async thenUserShouldBeOnDashboardPage(page: Page): Promise<OrangeHRMDashboardPage> {
    const dashboardPage = new OrangeHRMDashboardPage(page);
    
    await expect(page).toHaveURL(/.*dashboard/);
    await dashboardPage.verifyDashboardLoaded();
    
    return dashboardPage;
  }

  /**
   * Common "Then" step for failed login verification
   */
  static async thenUserShouldSeeLoginError(loginPage: OrangeHRMLoginPage, expectedErrorText: string): Promise<void> {
    await loginPage.waitForErrorMessage();
    
    const actualErrorText = await loginPage.getErrorMessage();
    expect(actualErrorText).toContain(expectedErrorText);
    
    // Verify still on login page
    await loginPage.verifyLoginPage();
  }

  /**
   * Verify dashboard page has expected content
   */
  static async thenDashboardPageShouldHaveExpectedContent(
    dashboardPage: OrangeHRMDashboardPage, 
    expectedTitle: string = 'Dashboard'
  ): Promise<void> {
    const actualTitle = await dashboardPage.getDashboardTitle();
    expect(actualTitle).toBe(expectedTitle);
    
    const widgetCount = await dashboardPage.getWidgetCount();
    expect(widgetCount).toBeGreaterThan(0);
    
    const userName = await dashboardPage.getUserName();
    expect(userName).toBeTruthy();
  }

  /**
   * Common logout step
   */
  static async whenUserLogsOut(dashboardPage: OrangeHRMDashboardPage): Promise<void> {
    await dashboardPage.logout();
  }

  /**
   * Verify user is back on login page after logout
   */
  static async thenUserShouldBeBackOnLoginPage(page: Page): Promise<void> {
    const loginPage = new OrangeHRMLoginPage(page);
    await loginPage.verifyLoginPage();
    await expect(page).not.toHaveURL(/.*dashboard/);
  }
}

/**
 * Test context manager for maintaining test state and cleanup
 */
export class TestContext {
  private page: Page;
  private loginPage?: OrangeHRMLoginPage;
  private dashboardPage?: OrangeHRMDashboardPage;
  private testData: Map<string, any> = new Map();

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get or create OrangeHRM LoginPage instance
   */
  getLoginPage(): OrangeHRMLoginPage {
    if (!this.loginPage) {
      this.loginPage = new OrangeHRMLoginPage(this.page);
    }
    return this.loginPage;
  }

  /**
   * Get or create OrangeHRM DashboardPage instance
   */
  getDashboardPage(): OrangeHRMDashboardPage {
    if (!this.dashboardPage) {
      this.dashboardPage = new OrangeHRMDashboardPage(this.page);
    }
    return this.dashboardPage;
  }

  /**
   * Store test-specific data
   */
  setTestData(key: string, value: any): void {
    this.testData.set(key, value);
  }

  /**
   * Retrieve test-specific data
   */
  getTestData<T>(key: string): T | undefined {
    return this.testData.get(key) as T;
  }

  /**
   * Clear all test data (useful for cleanup)
   */
  clearTestData(): void {
    this.testData.clear();
  }

  /**
   * Get current page URL for assertions
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take screenshot with descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Get environment configuration
   */
  getEnvironmentConfig() {
    return Environment.getConfig();
  }

  /**
   * Clear browser data for clean state
   */
  async clearBrowserData(): Promise<void> {
    const context = this.page.context();
    await context.clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

/**
 * Assertion helpers for common BDD verification patterns
 */
export class BDDAssertions {
  
  /**
   * Assert user is on login page
   */
  static async assertOnLoginPage(page: Page): Promise<void> {
    await expect(page).toHaveURL(/.*login/);
    
    const loginPage = new OrangeHRMLoginPage(page);
    await loginPage.verifyLoginPageElements();
  }

  /**
   * Assert user is on dashboard page
   */
  static async assertOnDashboardPage(page: Page): Promise<void> {
    await expect(page).toHaveURL(/.*dashboard/);
    
    const dashboardPage = new OrangeHRMDashboardPage(page);
    await dashboardPage.verifyDashboardLoaded();
  }

  /**
   * Assert error message is displayed with expected content
   */
  static async assertErrorMessage(loginPage: OrangeHRMLoginPage, expectedText: string): Promise<void> {
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBeTruthy();
    
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain(expectedText);
  }

  /**
   * Assert form fields have expected values
   */
  static async assertFormValues(
    loginPage: OrangeHRMLoginPage, 
    expectedUsername: string, 
    expectedPassword: string
  ): Promise<void> {
    const actualUsername = await loginPage.getUsernameValue();
    const actualPassword = await loginPage.getPasswordValue();
    
    expect(actualUsername).toBe(expectedUsername);
    expect(actualPassword).toBe(expectedPassword);
  }

  /**
   * Assert dashboard has expected number of widgets
   */
  static async assertDashboardWidgetCount(dashboardPage: OrangeHRMDashboardPage, expectedCount: number): Promise<void> {
    const actualCount = await dashboardPage.getWidgetCount();
    expect(actualCount).toBe(expectedCount);
  }

  /**
   * Assert dashboard title
   */
  static async assertDashboardTitle(dashboardPage: OrangeHRMDashboardPage, expectedTitle: string): Promise<void> {
    const actualTitle = await dashboardPage.getDashboardTitle();
    expect(actualTitle).toBe(expectedTitle);
  }

  /**
   * Assert user name is displayed
   */
  static async assertUserNameDisplayed(dashboardPage: OrangeHRMDashboardPage): Promise<void> {
    const userName = await dashboardPage.getUserName();
    expect(userName).toBeTruthy();
    expect(userName.length).toBeGreaterThan(0);
  }
}

/**
 * Test data validation helpers
 */
export class TestValidation {
  
  /**
   * Validate that required test data is present
   */
  static validateRequiredData(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Required test data field '${field}' is missing`);
      }
    }
  }

  /**
   * Validate login credentials format
   */
  static validateCredentials(credentials: LoginCredentials): void {
    this.validateRequiredData(credentials, ['username', 'password']);
    
    if (credentials.username.trim() === '') {
      throw new Error('Username cannot be empty');
    }
    
    if (credentials.password.trim() === '') {
      throw new Error('Password cannot be empty');
    }
  }

  /**
   * Validate URL format
   */
  static validateUrl(url: string, expectedPattern: RegExp): boolean {
    return expectedPattern.test(url);
  }
}

/**
 * Test timing and wait utilities
 */
export class TestTiming {
  
  /**
   * Wait for login to complete with appropriate timeout
   */
  static async waitForLogin(page: Page, timeout: number = 15000): Promise<void> {
    await page.waitForURL('**/dashboard**', { 
      timeout,
      waitUntil: 'networkidle' 
    });
  }

  /**
   * Wait for error message to appear
   */
  static async waitForError(page: Page, timeout: number = 10000): Promise<void> {
    await page.waitForSelector('.oxd-alert-content-text', { 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Wait for OrangeHRM page to be fully loaded
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    // Wait for OrangeHRM loading spinner to disappear
    try {
      await page.waitForSelector('.oxd-loading-spinner', { 
        state: 'hidden', 
        timeout: 10000 
      });
    } catch {
      // Loading spinner might not be present
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for dashboard to load completely
   */
  static async waitForDashboard(page: Page, timeout: number = 15000): Promise<void> {
    await page.waitForSelector('.oxd-topbar-header-breadcrumb h6', { 
      state: 'visible', 
      timeout 
    });
    await page.waitForSelector('.oxd-sidepanel', { 
      state: 'visible', 
      timeout 
    });
    await this.waitForPageLoad(page);
  }

  /**
   * Wait for toast message to appear
   */
  static async waitForToastMessage(page: Page, timeout: number = 10000): Promise<string | null> {
    try {
      const toastSelector = '.oxd-toast-content--success, .oxd-toast-content--error, .oxd-toast-content--warn';
      await page.waitForSelector(toastSelector, { timeout });
      return await page.textContent(toastSelector);
    } catch {
      return null;
    }
  }
}

/**
 * Test reporting and logging utilities
 */
export class TestReporting {
  
  /**
   * Log test step with timestamp
   */
  static logStep(stepName: string, details?: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${stepName}${details ? ': ' + details : ''}`);
  }

  /**
   * Log test data being used
   */
  static logTestData(testName: string, data: any): void {
    console.log(`Test: ${testName}`);
    console.log('Test Data:', JSON.stringify(data, null, 2));
  }

  /**
   * Log performance metrics
   */
  static async logPerformanceMetrics(page: Page, testName: string): Promise<void> {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    console.log(`Performance metrics for ${testName}:`, metrics);
  }
}

/**
 * Utility for creating test-specific configurations
 */
export class TestConfiguration {
  
  /**
   * Create test configuration for different environments
   */
  static getEnvironmentConfig(env: string = 'dev') {
    const configs = {
      dev: {
        baseUrl: 'https://opensource-demo.orangehrmlive.com',
        timeout: 30000,
        retries: 1
      },
      staging: {
        baseUrl: 'https://opensource-demo.orangehrmlive.com',
        timeout: 45000,
        retries: 2
      },
      prod: {
        baseUrl: 'https://opensource-demo.orangehrmlive.com',
        timeout: 60000,
        retries: 3
      }
    };
    
    return configs[env as keyof typeof configs] || configs.dev;
  }

  /**
   * Get test tags for filtering
   */
  static getTestTags(testType: 'smoke' | 'regression' | 'critical' | 'negative' | 'security' | 'performance'): string[] {
    const tagMap = {
      smoke: ['smoke', 'critical'],
      regression: ['regression', 'full'],
      critical: ['critical', 'priority-high'],
      negative: ['negative', 'error-handling'],
      security: ['security', 'xss', 'injection'],
      performance: ['performance', 'load', 'timing']
    };
    
    return tagMap[testType] || [];
  }

  /**
   * Get OrangeHRM specific test configuration
   */
  static getOrangeHRMConfig() {
    return {
      defaultCredentials: {
        username: 'Admin',
        password: 'admin123'
      },
      timeouts: {
        login: 15000,
        dashboard: 10000,
        pageLoad: 30000,
        error: 5000
      },
      selectors: {
        loadingSpinner: '.oxd-loading-spinner',
        errorMessage: '.oxd-alert-content-text',
        dashboardHeader: '.oxd-topbar-header-breadcrumb h6',
        sideMenu: '.oxd-sidepanel'
      }
    };
  }

  /**
   * Get test data configuration
   */
  static getTestDataConfig() {
    return {
      maxRetries: 3,
      retryDelay: 1000,
      screenshotOnFailure: true,
      cleanupAfterTest: true,
      logLevel: 'info'
    };
  }
}