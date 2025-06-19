import { FullConfig, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Environment } from './environment';

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('🚀 Running global setup for OrangeHRM tests...');
  
  // Create necessary directories
  const directories = [
    'test-results',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces',
    'playwright-report',
    'auth-state',
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  // Set environment variables
  const testRunId = `orangehrm_${Date.now()}`;
  process.env.TEST_RUN_ID = testRunId;
  console.log(`🏷️  Test Run ID: ${testRunId}`);
  
  // Get environment configuration
  const envConfig = Environment.getConfig();
  console.log(`🌍 Environment: ${process.env.ENV || 'dev'}`);
  console.log(`🔗 Base URL: ${envConfig.baseUrl}`);
  console.log(`👤 Default User: ${envConfig.username}`);
  
  // Verify OrangeHRM site accessibility
  console.log('🔍 Verifying OrangeHRM site accessibility...');
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Set a reasonable timeout for the health check
    page.setDefaultTimeout(15000);
    
    await page.goto(envConfig.baseUrl);
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });
    
    console.log('✅ OrangeHRM site is accessible');
    
    await browser.close();
  } catch (error) {
    console.warn('⚠️  Warning: Could not verify OrangeHRM site accessibility');
    console.warn(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    console.warn('   Tests may fail if the site is not available');
  }
  
  // Pre-authenticate and save auth state (optional - useful for faster test execution)
  if (process.env.PREAUTH === 'true') {
    console.log('🔐 Pre-authenticating admin user...');
    try {
      await createAuthState();
      console.log('✅ Admin authentication state saved');
    } catch (error) {
      console.warn('⚠️  Warning: Could not pre-authenticate admin user');
      console.warn(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  console.log('✨ Global setup completed successfully');
}

/**
 * Create and save authentication state for admin user
 * This can be used to speed up tests that require authentication
 */
async function createAuthState(): Promise<void> {
  const envConfig = Environment.getConfig();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to login page
    await page.goto(envConfig.baseUrl);
    
    // Fill login form
    await page.fill('input[name="username"]', envConfig.username);
    await page.fill('input[name="password"]', envConfig.password);
    await page.click('button[type="submit"]');
    
    // Wait for successful login (dashboard page)
    await page.waitForSelector('.oxd-topbar-header-breadcrumb h6', { timeout: 10000 });
    
    // Save authentication state
    await context.storageState({ path: 'auth-state/admin-auth.json' });
    
  } finally {
    await browser.close();
  }
}

export default globalSetup;