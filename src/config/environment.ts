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
        baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
        apiUrl: process.env.API_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2', // OrangeHRM API endpoint
        username: process.env.TEST_USERNAME || 'Admin',
        password: process.env.TEST_PASSWORD || 'admin123',
        timeout: parseInt(process.env.TIMEOUT || '30000'),
        headless: process.env.HEADLESS !== 'false',
        slowMo: parseInt(process.env.SLOW_MO || '0'),
        screenshot: (process.env.SCREENSHOT || 'only-on-failure') as 'on' | 'only-on-failure' | 'off',
        video: (process.env.VIDEO || 'retain-on-failure') as 'on' | 'retain-on-failure' | 'off',
        trace: (process.env.TRACE || 'retain-on-failure') as 'on' | 'retain-on-failure' | 'off',
      },
      staging: {
        // For OrangeHRM, staging might be the same as dev
        // In real projects, this would point to your staging environment
        baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
        apiUrl: process.env.API_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2',
        username: process.env.TEST_USERNAME || 'Admin',
        password: process.env.TEST_PASSWORD || 'admin123',
        timeout: parseInt(process.env.TIMEOUT || '45000'),
        headless: process.env.HEADLESS !== 'false',
        slowMo: parseInt(process.env.SLOW_MO || '0'),
        screenshot: (process.env.SCREENSHOT || 'on') as 'on' | 'only-on-failure' | 'off',
        video: (process.env.VIDEO || 'on') as 'on' | 'retain-on-failure' | 'off',
        trace: (process.env.TRACE || 'on') as 'on' | 'retain-on-failure' | 'off',
      },
      production: {
        // Production configuration with more conservative settings
        baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
        apiUrl: process.env.API_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2',
        username: process.env.TEST_USERNAME || 'Admin',
        password: process.env.TEST_PASSWORD || 'admin123',
        timeout: parseInt(process.env.TIMEOUT || '60000'),
        headless: process.env.HEADLESS !== 'false',
        slowMo: parseInt(process.env.SLOW_MO || '0'),
        screenshot: 'only-on-failure' as const,
        video: 'off' as const,
        trace: 'off' as const,
      },
      ci: {
        // Special configuration for CI/CD environments
        baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
        apiUrl: process.env.API_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2',
        username: process.env.TEST_USERNAME || 'Admin',
        password: process.env.TEST_PASSWORD || 'admin123',
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
   * Get all available test users for the OrangeHRM application.
   * This centralizes user data and makes it easy to access in tests.
   */
  static getTestUsers() {
    return {
      admin: {
        username: 'Admin',
        password: 'admin123',
        description: 'Admin user with full system access'
      },
      invalid: {
        username: 'invalid_user',
        password: 'invalid_pass',
        description: 'Invalid user for negative testing'
      },
      wrongPassword: {
        username: 'Admin',
        password: 'wrong_password',
        description: 'Valid username with wrong password'
      },
      wrongUsername: {
        username: 'wrong_user',
        password: 'admin123',
        description: 'Wrong username with valid password'
      }
    };
  }

  /**
   * Get specific user credentials by type.
   * This is useful when you need just one user's credentials in a test.
   */
  static getUserCredentials(userType: 'admin' | 'invalid' | 'wrongPassword' | 'wrongUsername') {
    const users = this.getTestUsers();
    return users[userType];
  }

  /**
   * Get valid admin credentials for OrangeHRM.
   * This is a convenience method for the most common use case.
   */
  static getValidCredentials() {
    return this.getUserCredentials('admin');
  }

  /**
   * Get invalid credentials for negative testing.
   * This is useful for testing login failure scenarios.
   */
  static getInvalidCredentials() {
    return this.getUserCredentials('invalid');
  }
}