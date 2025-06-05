import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('should navigate to product detail page when clicking on a product', async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto('/');

    // Wait for products to load
    await expect(page.getByTestId('product-grid')).toBeVisible();

    // Click on the first product link (assuming products have links)
    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.click();

    // Verify we're on a product detail page
    await expect(page).toHaveURL(/\/product\/\d+/);

    // Verify product detail is displayed
    await expect(page.getByTestId('product-detail')).toBeVisible();

    // Verify product name is displayed
    await expect(page.getByTestId('product-name')).toBeVisible();
  });

  test('should display product not found message for invalid product ID', async ({
    page,
  }) => {
    // Navigate directly to a non-existent product
    await page.goto('/product/99999');

    // Verify product not found message is displayed
    await expect(page.getByTestId('product-not-found')).toBeVisible();
    await expect(page.locator('text=Product Not Found')).toBeVisible();
    await expect(
      page.locator("text=The product you're looking for doesn't exist.")
    ).toBeVisible();
  });

  test('should display invalid product message for non-numeric product ID', async ({
    page,
  }) => {
    // Navigate with an invalid (non-numeric) product ID
    await page.goto('/product/abc');

    // Verify invalid product message is displayed
    await expect(page.getByTestId('invalid-product')).toBeVisible();
    await expect(page.locator('text=Invalid Product')).toBeVisible();
    await expect(
      page.locator('text=Please provide a valid product ID.')
    ).toBeVisible();
  });

  test('should display correct product information', async ({ page }) => {
    // Navigate to a specific product (ID 1 - Wireless Noise-Cancelling Headphones)
    await page.goto('/product/1');

    // Wait for product detail to load
    await expect(page.getByTestId('product-detail')).toBeVisible();

    // Verify product name is correct
    await expect(page.getByTestId('product-name')).toContainText(
      'Wireless Noise-Cancelling Headphones'
    );

    // Verify price is displayed
    await expect(page.locator('text=$249.99')).toBeVisible();

    // Verify original price is displayed (since this product has a sale price)
    await expect(page.locator('text=$299.99')).toBeVisible();

    // Verify Add to Cart button is present
    await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();

    // Verify Buy Now button is present
    await expect(page.locator('button:has-text("Buy Now")')).toBeVisible();

    // Verify stock status is displayed
    await expect(page.locator('text=In Stock')).toBeVisible();
  });
});
