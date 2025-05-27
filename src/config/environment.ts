export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  username: string;
  password: string;
  timeout: number;
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
    
    const configs: Record<string, EnvironmentConfig> = {
      dev: {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        apiUrl: process.env.API_URL || 'http://localhost:3001/api',
        username: process.env.TEST_USERNAME || 'testuser@example.com',
        password: process.env.TEST_PASSWORD || 'TestPassword123!',
        timeout: 30000,
      },
      staging: {
        baseUrl: process.env.BASE_URL || 'https://staging.example.com',
        apiUrl: process.env.API_URL || 'https://staging-api.example.com/api',
        username: process.env.TEST_USERNAME || 'stageuser@example.com',
        password: process.env.TEST_PASSWORD || 'StagePassword123!',
        timeout: 45000,
      },
      production: {
        baseUrl: process.env.BASE_URL || 'https://www.example.com',
        apiUrl: process.env.API_URL || 'https://api.example.com/api',
        username: process.env.TEST_USERNAME || 'produser@example.com',
        password: process.env.TEST_PASSWORD || 'ProdPassword123!',
        timeout: 60000,
      },
    };

    return configs[env] || configs.dev;
  }
}