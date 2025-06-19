import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * OrangeHRM Dashboard Page Object
 * 
 * Comprehensive page object for the OrangeHRM dashboard page that appears after successful login.
 * Contains elements and actions for the main dashboard functionality including navigation,
 * user management, and dashboard widgets.
 */
export class OrangeHRMDashboardPage extends BasePage {
  // Header elements
  readonly dashboardHeader: Locator;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;
  readonly profilePicture: Locator;
  readonly userName: Locator;
  readonly aboutButton: Locator;
  readonly changePasswordButton: Locator;
  readonly supportButton: Locator;

  // Navigation elements
  readonly sideMenu: Locator;
  readonly menuToggleButton: Locator;
  readonly searchBox: Locator;
  readonly breadcrumb: Locator;

  // Dashboard content elements
  readonly dashboardWidgets: Locator;
  readonly welcomeMessage: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly quickLaunchWidget: Locator;
  readonly buzzLatestPostsWidget: Locator;
  readonly employeesOnLeaveWidget: Locator;
  readonly employeeDistributionWidget: Locator;

  // Quick launch buttons
  readonly assignLeaveButton: Locator;
  readonly leaveListButton: Locator;
  readonly timesheetsButton: Locator;
  readonly applyLeaveButton: Locator;
  readonly myLeaveButton: Locator;
  readonly myTimesheetButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize header locators
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.locator('text=Logout');
    this.profilePicture = page.locator('.oxd-userdropdown-img');
    this.userName = page.locator('.oxd-userdropdown-name');
    this.aboutButton = page.locator('text=About');
    this.changePasswordButton = page.locator('text=Change Password');
    this.supportButton = page.locator('text=Support');

    // Initialize navigation locators
    this.sideMenu = page.locator('.oxd-sidepanel');
    this.menuToggleButton = page.locator('.oxd-sidepanel-header .oxd-icon-button');
    this.searchBox = page.locator('.oxd-main-menu-search input');
    this.breadcrumb = page.locator('.oxd-topbar-header-breadcrumb');

    // Initialize dashboard content locators
    this.dashboardWidgets = page.locator('.orangehrm-dashboard-widget');
    this.welcomeMessage = page.locator('.oxd-text--h6').first();
    this.timeAtWorkWidget = page.locator('.orangehrm-attendance-card');
    this.myActionsWidget = page.locator('[data-v-f4cd5c0a]').filter({ hasText: 'My Actions' });
    this.quickLaunchWidget = page.locator('.orangehrm-quick-launch');
    this.buzzLatestPostsWidget = page.locator('.orangehrm-buzz-widget');
    this.employeesOnLeaveWidget = page.locator('.orangehrm-leave-card');
    this.employeeDistributionWidget = page.locator('.orangehrm-dashboard-widget').filter({ hasText: 'Employee Distribution' });

    // Initialize quick launch button locators
    this.assignLeaveButton = page.locator('.orangehrm-quick-launch-icon', { hasText: 'Assign Leave' });
    this.leaveListButton = page.locator('.orangehrm-quick-launch-icon', { hasText: 'Leave List' });
    this.timesheetsButton = page.locator('.orangehrm-quick-launch-icon', { hasText: 'Timesheets' });
    this.applyLeaveButton = page.locator('.orangehrm-quick-launch-icon', { hasText: 'Apply Leave' });
    this.myLeaveButton = page.locator('.orangehrm-quick-launch-icon', { hasText: 'My Leave' });
    this.myTimesheetButton = page.locator('.orangehrm-quick-launch-icon', { hasText: 'My Timesheet' });
  }

  /**
   * Navigate to the dashboard page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/dashboard/index');
    await this.waitForDashboardLoad();
  }

  /**
   * Verify we are on the dashboard page
   */
  async verifyDashboardPage(): Promise<void> {
    await this.expectElementToBeVisible('.oxd-topbar-header-breadcrumb h6', 'Dashboard header should be visible');
    await this.expectElementToContainText('.oxd-topbar-header-breadcrumb h6', 'Dashboard', 'Should be on Dashboard page');
    await this.expectElementToBeVisible('.oxd-sidepanel', 'Side menu should be visible');
    await this.expectElementToBeVisible('.oxd-userdropdown-tab', 'User dropdown should be visible');
  }

  /**
   * Verify dashboard loaded successfully with all key elements
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.verifyDashboardPage();
    await this.expectElementToBeVisible('.orangehrm-dashboard-widget', 'Dashboard widgets should be visible');
    await this.expectUrlToContain('/dashboard', 'URL should contain dashboard');
  }

  /**
   * Get the dashboard title
   */
  async getDashboardTitle(): Promise<string> {
    return await this.getText('.oxd-topbar-header-breadcrumb h6');
  }

  /**
   * Get the logged-in user name
   */
  async getUserName(): Promise<string> {
    return await this.getText('.oxd-userdropdown-name');
  }

  /**
   * Click on user dropdown to reveal menu options
   */
  async clickUserDropdown(): Promise<void> {
    await this.click('.oxd-userdropdown-tab');
    await this.waitForElement('.oxd-dropdown-menu');
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.clickUserDropdown();
    await this.click('text=Logout');
    await this.waitForUrl(/login/, 10000);
  }

  /**
   * Change password through user dropdown
   */
  async changePassword(): Promise<void> {
    await this.clickUserDropdown();
    await this.click('text=Change Password');
    await this.waitForUrl(/changePassword/);
  }

  /**
   * Access About dialog
   */
  async openAboutDialog(): Promise<void> {
    await this.clickUserDropdown();
    await this.click('text=About');
    await this.waitForElement('.oxd-dialog-container');
  }

  /**
   * Access Support page
   */
  async openSupport(): Promise<void> {
    await this.clickUserDropdown();
    await this.click('text=Support');
  }

  // Navigation methods
  /**
   * Navigate to a main menu item
   */
  async navigateToMenuItem(menuItem: string): Promise<void> {
    const menuLocator = `.oxd-main-menu-item-wrapper:has-text("${menuItem}")`;
    await this.click(menuLocator);
    await this.waitForOrangeHRMPageLoad();
  }

  /**
   * Search for a menu item using the search box
   */
  async searchMenuItem(searchTerm: string): Promise<void> {
    await this.fill('.oxd-main-menu-search input', searchTerm);
    await this.waitForElement('.oxd-main-menu-item--name');
  }

  /**
   * Toggle the side menu (collapse/expand)
   */
  async toggleSideMenu(): Promise<void> {
    await this.click('.oxd-sidepanel-header .oxd-icon-button');
  }

  /**
   * Get all available menu items
   */
  async getMenuItems(): Promise<string[]> {
    const menuItems = await this.page.locator('.oxd-main-menu-item--name').allTextContents();
    return menuItems.map(item => item.trim());
  }

  // Dashboard widget methods
  /**
   * Get the number of dashboard widgets
   */
  async getWidgetCount(): Promise<number> {
    return await this.getElementCount('.orangehrm-dashboard-widget');
  }

  /**
   * Get all widget titles
   */
  async getWidgetTitles(): Promise<string[]> {
    const widgets = await this.page.locator('.orangehrm-dashboard-widget .oxd-text--h6').allTextContents();
    return widgets.map(title => title.trim());
  }

  /**
   * Check if a specific widget is visible
   */
  async isWidgetVisible(widgetTitle: string): Promise<boolean> {
    const widgetSelector = `.orangehrm-dashboard-widget:has-text("${widgetTitle}")`;
    return await this.isVisible(widgetSelector);
  }

  /**
   * Get time at work information
   */
  async getTimeAtWork(): Promise<{ punchIn: string; punchOut: string }> {
    const punchInTime = await this.getText('.orangehrm-attendance-card .oxd-text--h6').catch(() => 'Not punched in');
    const punchOutTime = await this.getText('.orangehrm-attendance-card .oxd-text--span').catch(() => 'Not punched out');
    
    return {
      punchIn: punchInTime,
      punchOut: punchOutTime
    };
  }

  // Quick Launch methods
  /**
   * Click on a quick launch button
   */
  async clickQuickLaunchButton(buttonName: string): Promise<void> {
    const buttonSelector = `.orangehrm-quick-launch-icon:has-text("${buttonName}")`;
    await this.click(buttonSelector);
    await this.waitForOrangeHRMPageLoad();
  }

  /**
   * Get all available quick launch buttons
   */
  async getQuickLaunchButtons(): Promise<string[]> {
    const buttons = await this.page.locator('.orangehrm-quick-launch-icon .oxd-text').allTextContents();
    return buttons.map(button => button.trim());
  }

  /**
   * Verify quick launch widget is functional
   */
  async verifyQuickLaunchWidget(): Promise<void> {
    await this.expectElementToBeVisible('.orangehrm-quick-launch', 'Quick Launch widget should be visible');
    const buttonCount = await this.getElementCount('.orangehrm-quick-launch-icon');
    expect(buttonCount).toBeGreaterThan(0);
  }

  // Utility methods
  /**
   * Check if side menu is visible
   */
  async isSideMenuVisible(): Promise<boolean> {
    return await this.isVisible('.oxd-sidepanel');
  }

  /**
   * Check if side menu is collapsed
   */
  async isSideMenuCollapsed(): Promise<boolean> {
    const sidePanel = this.page.locator('.oxd-sidepanel');
    const classList = await sidePanel.getAttribute('class');
    return classList?.includes('--collapsed') || false;
  }

  /**
   * Wait for dashboard to load completely
   */
  async waitForDashboardLoad(): Promise<void> {
    await this.waitForElement('.oxd-topbar-header-breadcrumb h6');
    await this.waitForElement('.oxd-sidepanel');
    await this.waitForElement('.oxd-userdropdown-tab');
    await this.waitForOrangeHRMPageLoad();
  }

  /**
   * Get dashboard summary information
   */
  async getDashboardSummary(): Promise<{
    title: string;
    userName: string;
    widgetCount: number;
    menuItems: string[];
    quickLaunchButtons: string[];
  }> {
    return {
      title: await this.getDashboardTitle(),
      userName: await this.getUserName(),
      widgetCount: await this.getWidgetCount(),
      menuItems: await this.getMenuItems(),
      quickLaunchButtons: await this.getQuickLaunchButtons()
    };
  }

  /**
   * Take a screenshot of the dashboard
   */
  async takeScreenshot(name: string = 'dashboard'): Promise<void> {
    await super.takeScreenshot(name);
  }
}