export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  username: string;
  password: string;
  timeout: number;
  headless: boolean;
  slowMo: number;
  screenshot: 'on' | 'only-on-failure' | 'off';
  video: 'on' | 'retain-on-failure' | 'off';
  trace: 'on' | 'retain-on-failure' | 'off';
}

export class Environment {
  private static config: EnvironmentConfig;

  static getConfig(): EnvironmentConfig {
    if (!this.config) {
      this.config = this.loadConfig();
    }
    return this.config;
  }

  private static loadConfig(): EnvironmentConfig {
    const env = process.env.ENV || 'dev';
    
    // Define configurations for different environments
    // This structure allows easy switching between environments
    const configs: Record<string, EnvironmentConfig> = {
      dev: {
        baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/v1',
        apiUrl: process.env.API_URL || 'https://api.saucedemo.com/api', // Placeholder for future API testing
        username: process.env.TEST_USERNAME || 'standard_user',
        password: process.env.TEST_PASSWORD || 'secret_sauce',
        timeout: parseInt(process.env.TIMEOUT || '30000'),
        headless: process.env.HEADLESS !== 'false',
        slowMo: parseInt(process.env.SLOW_MO || '0'),
        screenshot: (process.env.SCREENSHOT || 'only-on-failure') as 'on' | 'only-on-failure' | 'off',
        video: (process.env.VIDEO || 'retain-on-failure') as 'on' | 'retain-on-failure' | 'off',
        trace: (process.env.TRACE || 'retain-on-failure') as 'on' | 'retain-on-failure' | 'off',
      },
      staging: {
        // For Sauce Demo, staging might be the same as dev
        // In real projects, this would point to your staging environment
        baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/v1',
        apiUrl: process.env.API_URL || 'https://api.saucedemo.com/api',
        username: process.env.TEST_USERNAME || 'standard_user',
        password: process.env.TEST_PASSWORD || 'secret_sauce',
        timeout: parseInt(process.env.TIMEOUT || '45000'),
        headless: process.env.HEADLESS !== 'false',
        slowMo: parseInt(process.env.SLOW_MO || '0'),
        screenshot: (process.env.SCREENSHOT || 'on') as 'on' | 'only-on-failure' | 'off',
        video: (process.env.VIDEO || 'on') as 'on' | 'retain-on-failure' | 'off',
        trace: (process.env.TRACE || 'on') as 'on' | 'retain-on-failure' | 'off',
      },
      production: {
        // Production configuration with more conservative settings
        baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/v1',
        apiUrl: process.env.API_URL || 'https://api.saucedemo.com/api',
        username: process.env.TEST_USERNAME || 'standard_user',
        password: process.env.TEST_PASSWORD || 'secret_sauce',
        timeout: parseInt(process.env.TIMEOUT || '60000'),
        headless: process.env.HEADLESS !== 'false',
        slowMo: parseInt(process.env.SLOW_MO || '0'),
        screenshot: 'only-on-failure' as const,
        video: 'off' as const,
        trace: 'off' as const,
      },
      ci: {
        // Special configuration for CI/CD environments
        baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/v1',
        apiUrl: process.env.API_URL || 'https://api.saucedemo.com/api',
        username: process.env.TEST_USERNAME || 'standard_user',
        password: process.env.TEST_PASSWORD || 'secret_sauce',
        timeout: parseInt(process.env.TIMEOUT || '60000'),
        headless: true, // Always headless in CI
        slowMo: 0, // No slow motion in CI
        screenshot: 'only-on-failure' as const,
        video: 'retain-on-failure' as const,
        trace: 'retain-on-failure' as const,
      }
    };

    const selectedConfig = configs[env] || configs.dev;
    
    // Log the configuration being used (helpful for debugging)
    console.log(`Using ${env} environment configuration`);
    console.log(`Base URL: ${selectedConfig.baseUrl}`);
    console.log(`Headless: ${selectedConfig.headless}`);
    
    return selectedConfig;
  }

  /**
   * Get all available test users for the Sauce Demo application.
   * This centralizes user data and makes it easy to access in tests.
   */
  static getTestUsers() {
    return {
      standard: {
        username: 'standard_user',
        password: 'secret_sauce',
        description: 'Standard user with full access'
      },
      locked: {
        username: 'locked_out_user',
        password: 'secret_sauce',
        description: 'User that has been locked out'
      },
      problem: {
        username: 'problem_user',
        password: 'secret_sauce',
        description: 'User that experiences UI problems'
      },
      performance: {
        username: 'performance_glitch_user',
        password: 'secret_sauce',
        description: 'User that experiences performance delays'
      }
    };
  }

  /**
   * Get specific user credentials by type.
   * This is useful when you need just one user's credentials in a test.
   */
  static getUserCredentials(userType: 'standard' | 'locked' | 'problem' | 'performance') {
    const users = this.getTestUsers();
    return users[userType];
  }
}