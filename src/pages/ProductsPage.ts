import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductsPage encapsulates all interactions with the Sauce Demo products inventory page.
 * This page object follows the same BDD-friendly patterns established in LoginPage,
 * providing clear, business-focused methods for interacting with the product catalog.
 */
export class ProductsPage extends BasePage {
  // Core page elements - exposed as readonly for direct access in tests
  readonly pageTitle: Locator;
  readonly productsContainer: Locator;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  
  // Sidebar menu elements
  readonly sidebarMenu: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly resetAppLink: Locator;
  readonly closeSidebarButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators using consistent patterns
    // Note: Sauce Demo uses a mix of classes, IDs, and data-test attributes
    this.pageTitle = page.locator('.product_label');
    this.productsContainer = page.locator('#inventory_container');
    this.productItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('.product_sort_container');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    
    // Menu elements
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.sidebarMenu = page.locator('.bm-menu-wrap');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.resetAppLink = page.locator('#reset_sidebar_link');
    this.closeSidebarButton = page.locator('#react-burger-cross-btn');
  }

  /**
   * Navigate directly to the products page.
   * Note: This assumes the user is already logged in. If not logged in,
   * Sauce Demo will redirect to the login page.
   */
  async goto(): Promise<void> {
    await this.navigateTo('/inventory.html');
    await this.waitForPageLoad();
    
    // Verify we actually reached the products page
    // This helps catch cases where we were redirected to login
    await this.productsContainer.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Get the count of products currently displayed on the page.
   * This method is useful for verifying that all expected products are loaded.
   * 
   * @returns The number of products visible on the page
   */
  async getProductCount(): Promise<number> {
    // Ensure at least one product is visible before counting
    // This prevents counting before the page fully loads
    try {
      await this.productItems.first().waitFor({ state: 'visible', timeout: 5000 });
      return await this.productItems.count();
    } catch {
      // If no products load within timeout, return 0
      return 0;
    }
  }

  /**
   * Get all product names currently displayed.
   * This method extracts the product titles in the order they appear on the page,
   * which is useful for verifying sort operations.
   * 
   * @returns Array of product names in display order
   */
  async getAllProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.getProductCount();
    
    for (let i = 0; i < count; i++) {
      const nameElement = this.productItems.nth(i).locator('.inventory_item_name');
      const name = await nameElement.textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    
    return names;
  }

  /**
   * Get all product prices as numbers.
   * This method extracts prices and converts them from strings (e.g., "$29.99") to numbers.
   * Useful for verifying price-based sorting.
   * 
   * @returns Array of prices as numbers in display order
   */
  async getAllProductPrices(): Promise<number[]> {
    const prices: number[] = [];
    const count = await this.getProductCount();
    
    for (let i = 0; i < count; i++) {
      const priceElement = this.productItems.nth(i).locator('.inventory_item_price');
      const priceText = await priceElement.textContent();
      if (priceText) {
        // Remove dollar sign and convert to number
        const price = parseFloat(priceText.replace('$', ''));
        prices.push(price);
      }
    }
    
    return prices;
  }

  /**
   * Get detailed information about a specific product by name.
   * This method finds a product and extracts all its visible information.
   * 
   * @param productName - The exact name of the product to find
   * @returns Product details or null if not found
   */
  async getProductByName(productName: string): Promise<{
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    hasAddToCartButton: boolean;
    hasRemoveButton: boolean;
  } | null> {
    // Find the product item containing the specified name
    const productItem = this.productItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName })
    });
    
    // Check if product exists
    if (await productItem.count() === 0) {
      return null;
    }
    
    // Extract all product details
    const name = await productItem.locator('.inventory_item_name').textContent() || '';
    const description = await productItem.locator('.inventory_item_desc').textContent() || '';
    const price = await productItem.locator('.inventory_item_price').textContent() || '';
    const imageUrl = await productItem.locator('.inventory_item_img img').getAttribute('src') || '';
    
    // Check which button is present (Add to Cart or Remove)
    const hasAddToCartButton = await productItem.locator('button:has-text("ADD TO CART")').isVisible();
    const hasRemoveButton = await productItem.locator('button:has-text("REMOVE")').isVisible();
    
    return {
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      imageUrl,
      hasAddToCartButton,
      hasRemoveButton
    };
  }

  /**
   * Add a product to the shopping cart by its name.
   * This method finds the product and clicks its "Add to Cart" button.
   * 
   * @param productName - The name of the product to add
   * @throws Error if product not found or already in cart
   */
  async addProductToCart(productName: string): Promise<void> {
    const productItem = this.productItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName })
    });
    
    // Verify product exists
    if (await productItem.count() === 0) {
      throw new Error(`Product "${productName}" not found on the page`);
    }
    
    const addToCartButton = productItem.locator('button:has-text("ADD TO CART")');
    
    // Verify the Add to Cart button is available
    if (!await addToCartButton.isVisible()) {
      throw new Error(`Product "${productName}" may already be in the cart`);
    }
    
    await addToCartButton.click();
    
    // Wait briefly for the button to change to "Remove"
    // This confirms the action completed successfully
    await productItem.locator('button:has-text("REMOVE")').waitFor({ state: 'visible', timeout: 2000 });
  }

  /**
   * Remove a product from the shopping cart by its name.
   * This method finds the product and clicks its "Remove" button.
   * 
   * @param productName - The name of the product to remove
   * @throws Error if product not found or not in cart
   */
  async removeProductFromCart(productName: string): Promise<void> {
    const productItem = this.productItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName })
    });
    
    // Verify product exists
    if (await productItem.count() === 0) {
      throw new Error(`Product "${productName}" not found on the page`);
    }
    
    const removeButton = productItem.locator('button:has-text("REMOVE")');
    
    // Verify the Remove button is available
    if (!await removeButton.isVisible()) {
      throw new Error(`Product "${productName}" is not in the cart`);
    }
    
    await removeButton.click();
    
    // Wait for button to change back to "Add to Cart"
    await productItem.locator('button:has-text("ADD TO CART")').waitFor({ state: 'visible', timeout: 2000 });
  }

  /**
   * Get the current number of items in the shopping cart.
   * This reads the badge on the cart icon, returning 0 if no badge is visible.
   * 
   * @returns Number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    // The badge only appears when there are items in the cart
    if (!await this.shoppingCartBadge.isVisible()) {
      return 0;
    }
    
    const badgeText = await this.shoppingCartBadge.textContent();
    return parseInt(badgeText || '0', 10);
  }

  /**
   * Sort products using the dropdown menu.
   * This method handles all available sort options in Sauce Demo.
   * 
   * @param sortOption - The sort option to select
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    // Map internal values to user-friendly descriptions for logging
    const sortDescriptions = {
      'az': 'Name (A to Z)',
      'za': 'Name (Z to A)',
      'lohi': 'Price (low to high)',
      'hilo': 'Price (high to low)'
    };
    
    console.log(`Sorting products by: ${sortDescriptions[sortOption]}`);
    
    // Select the option from dropdown
    await this.sortDropdown.selectOption(sortOption);
    
    // Wait for products to re-render after sorting
    // Sauce Demo doesn't provide a loading indicator, so we wait briefly
    await this.page.waitForTimeout(500);
  }

  /**
   * Open the sidebar menu.
   * This provides access to navigation and utility options.
   */
  async openMenu(): Promise<void> {
    await this.menuButton.click();
    
    // Wait for menu animation to complete
    await this.sidebarMenu.waitFor({ state: 'visible' });
    
    // Ensure menu is fully open by waiting for a menu item to be clickable
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  /**
   * Close the sidebar menu if it's open.
   */
  async closeMenu(): Promise<void> {
    if (await this.sidebarMenu.isVisible()) {
      await this.closeSidebarButton.click();
      await this.sidebarMenu.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Logout from the application.
   * This opens the menu and clicks the logout option.
   */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
    
    // Wait for redirect to login page
    await this.page.waitForURL('**/index.html');
  }

  /**
   * Navigate to the shopping cart page.
   */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
    
    // Wait for navigation to cart page
    await this.page.waitForURL('**/cart.html');
  }

  /**
   * Reset the app state using the menu option.
   * This clears the cart and returns all buttons to "Add to Cart" state.
   */
  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppLink.click();
    await this.closeMenu();
    
    // Give the app a moment to reset
    await this.page.waitForTimeout(500);
  }

  /**
   * Click on a product name to view its details.
   * 
   * @param productName - The name of the product to click
   */
  async clickProductName(productName: string): Promise<void> {
    const productLink = this.page.locator('.inventory_item_name', { hasText: productName });
    
    if (await productLink.count() === 0) {
      throw new Error(`Product "${productName}" not found`);
    }
    
    await productLink.click();
    
    // Wait for navigation to product detail page
    await this.page.waitForURL('**/inventory-item.html**');
  }

  /**
   * Verify that the products page is properly displayed.
   * This checks for all the key elements that should be present on a valid products page.
   * 
   * @returns true if all expected elements are visible
   */
  async isProductsPageDisplayed(): Promise<boolean> {
    try {
      // Check all critical page elements
      const elementsToVerify = [
        this.pageTitle,
        this.productsContainer,
        this.sortDropdown,
        this.shoppingCartLink,
        this.menuButton
      ];
      
      // Check all elements in parallel for efficiency
      const visibilityResults = await Promise.all(
        elementsToVerify.map(element => element.isVisible())
      );
      
      // Also verify we have at least one product
      const hasProducts = await this.getProductCount() > 0;
      
      // All elements must be visible and we must have products
      return visibilityResults.every(isVisible => isVisible) && hasProducts;
    } catch {
      return false;
    }
  }
}