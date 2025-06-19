import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(config: FullConfig): Promise<void> {
  console.log('🧹 Running global teardown for OrangeHRM tests...');
  
  const testRunId = process.env.TEST_RUN_ID || 'unknown';
  console.log(`🏷️  Cleaning up Test Run: ${testRunId}`);
  
  // Clean up temporary authentication states if they exist
  await cleanupAuthStates();
  
  // Generate test summary
  await generateTestSummary();
  
  // Clean up old test artifacts (optional)
  if (process.env.CLEANUP_OLD_ARTIFACTS === 'true') {
    await cleanupOldArtifacts();
  }
  
  // Archive test results if needed
  if (process.env.ARCHIVE_RESULTS === 'true') {
    await archiveTestResults();
  }
  
  console.log('✨ Global teardown completed successfully');
}

/**
 * Clean up temporary authentication state files
 */
async function cleanupAuthStates(): Promise<void> {
  try {
    const authStateDir = 'auth-state';
    if (fs.existsSync(authStateDir)) {
      const files = fs.readdirSync(authStateDir);
      const tempFiles = files.filter(file => file.includes('temp') || file.includes('tmp'));
      
      if (tempFiles.length > 0) {
        console.log('🔐 Cleaning up temporary auth states...');
        tempFiles.forEach(file => {
          const filePath = path.join(authStateDir, file);
          fs.unlinkSync(filePath);
          console.log(`   Removed: ${file}`);
        });
      }
    }
  } catch (error) {
    console.warn('⚠️  Warning: Could not clean up auth states');
    console.warn(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generate a simple test summary
 */
async function generateTestSummary(): Promise<void> {
  try {
    console.log('📊 Generating test summary...');
    
    const summary = {
      testRunId: process.env.TEST_RUN_ID,
      timestamp: new Date().toISOString(),
      environment: process.env.ENV || 'dev',
      baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
      artifacts: {
        screenshots: checkDirectoryExists('test-results/screenshots'),
        videos: checkDirectoryExists('test-results/videos'),
        traces: checkDirectoryExists('test-results/traces'),
        reports: checkDirectoryExists('playwright-report')
      }
    };
    
    const summaryPath = 'test-results/test-summary.json';
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`   Summary saved to: ${summaryPath}`);
    
  } catch (error) {
    console.warn('⚠️  Warning: Could not generate test summary');
    console.warn(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Clean up old test artifacts (older than 7 days)
 */
async function cleanupOldArtifacts(): Promise<void> {
  try {
    console.log('🗑️  Cleaning up old test artifacts...');
    
    const directories = [
      'test-results/screenshots',
      'test-results/videos',
      'test-results/traces'
    ];
    
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime.getTime() < sevenDaysAgo) {
            fs.unlinkSync(filePath);
            cleanedCount++;
          }
        });
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`   Removed ${cleanedCount} old artifact files`);
    } else {
      console.log('   No old artifacts to clean up');
    }
    
  } catch (error) {
    console.warn('⚠️  Warning: Could not clean up old artifacts');
    console.warn(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Archive test results to a timestamped directory
 */
async function archiveTestResults(): Promise<void> {
  try {
    console.log('📦 Archiving test results...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveDir = `archived-results/${timestamp}`;
    
    if (!fs.existsSync('archived-results')) {
      fs.mkdirSync('archived-results', { recursive: true });
    }
    
    fs.mkdirSync(archiveDir, { recursive: true });
    
    // Copy test results
    const sourceDirs = ['test-results', 'playwright-report'];
    sourceDirs.forEach(sourceDir => {
      if (fs.existsSync(sourceDir)) {
        const targetDir = path.join(archiveDir, sourceDir);
        copyDirectory(sourceDir, targetDir);
      }
    });
    
    console.log(`   Results archived to: ${archiveDir}`);
    
  } catch (error) {
    console.warn('⚠️  Warning: Could not archive test results');
    console.warn(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Helper function to check if directory exists and count files
 */
function checkDirectoryExists(dirPath: string): { exists: boolean; fileCount: number } {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    return { exists: true, fileCount: files.length };
  }
  return { exists: false, fileCount: 0 };
}

/**
 * Helper function to recursively copy directory
 */
function copyDirectory(source: string, target: string): void {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

export default globalTeardown;