import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Define selectors
  private readonly userMenuButton = '[data-testid="user-menu"]';
  private readonly logoutButton = '[data-testid="logout"]';
  private readonly searchInput = '[data-testid="search-input"]';
  private readonly searchButton = '[data-testid="search-button"]';
  private readonly welcomeMessage = '.welcome-message';

  constructor(page: Page) {
    super(page);
  }

  // Navigation
  async goto(): Promise<void> {
    await this.navigateTo('/home');
    await this.waitForPageLoad();
  }

  // Actions
  async search(searchTerm: string): Promise<void> {
    await this.fill(this.searchInput, searchTerm);
    await this.click(this.searchButton);
  }

  async logout(): Promise<void> {
    await this.click(this.userMenuButton);
    await this.click(this.logoutButton);
  }

  // Getters
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeMessage);
  }

  async isUserMenuVisible(): Promise<boolean> {
    return await this.isVisible(this.userMenuButton);
  }

  // Wait methods
  async waitForSearchResults(): Promise<void> {
    await this.page.waitForSelector('.search-results', { timeout: 10000 });
  }
}