import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('Running global setup...');
  
  // Create necessary directories
  const directories = [
    'test-results',
    'test-results/screenshots',
    'test-results/videos',
    'playwright-report',
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Set environment variables
  process.env.TEST_RUN_ID = `run_${Date.now()}`;
  
  // You can add more setup logic here:
  // - Start test database
  // - Seed test data
  // - Start mock servers
  // - Generate auth tokens
  
  console.log('Global setup completed');
}

export default globalSetup;