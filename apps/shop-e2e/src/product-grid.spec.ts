import { test, expect } from '@playwright/test';

test.describe('Product Grid', () => {
  test('should display products in the grid', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load and product grid to be visible
    await page.waitForLoadState('networkidle');

    // Alternative waiting strategy - wait for the selector to exist first
    await page.waitForSelector('[data-testid="product-grid"]', {
      state: 'visible',
      timeout: 10000,
    });

    // Now verify it's visible
    await expect(page.getByTestId('product-grid')).toBeVisible();

    // Get all product cards
    const productGrid = page.getByTestId('product-grid');
    const productCards = productGrid.locator('> *');

    // Verify at least one product is displayed
    await expect(productCards).toHaveCount(8); // Based on the mock data, we have 8 products
  });

  test('should display product information in each card', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="product-grid"]', {
      state: 'visible',
    });

    // Wait for product grid to be visible
    await expect(page.getByTestId('product-grid')).toBeVisible();

    // Check the first product card has all required elements
    const firstProduct = page
      .getByTestId('product-grid')
      .locator('> *')
      .first();

    // Verify product image is present
    await expect(firstProduct.locator('img')).toBeVisible();

    // Verify product name is present
    await expect(firstProduct.locator('h3')).toBeVisible();

    // Verify price is present (contains $ symbol)
    const priceElement = firstProduct.locator('text=/\\$/');
    await expect(priceElement.first()).toBeVisible();

    // Verify category is present
    await expect(firstProduct.locator('.text-gray-500').first()).toBeVisible();
  });

  test('should show SALE badge on discounted products', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="product-grid"]', {
      state: 'visible',
    });

    // Wait for product grid to be visible
    await expect(page.getByTestId('product-grid')).toBeVisible();

    // Check that at least one product has a SALE badge
    const saleBadges = page.locator('text=SALE');
    await expect(saleBadges.first()).toBeVisible();
  });

  test('should have clickable product links', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="product-grid"]', {
      state: 'visible',
    });

    // Wait for product grid to be visible
    await expect(page.getByTestId('product-grid')).toBeVisible();

    // Verify all products have links to detail pages
    const productLinks = page.locator('a[href^="/product/"]');
    const linkCount = await productLinks.count();

    // Each product should have at least one link (image or title)
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should display product grid title and filter buttons', async ({
    page,
  }) => {
    await page.goto('/');

    // Verify the section title
    await expect(page.locator('h2:has-text("Legit Products")')).toBeVisible();

    // Verify filter buttons are present
    await expect(page.locator('button:has-text("Latest")')).toBeVisible();
    await expect(page.locator('button:has-text("Popular")')).toBeVisible();
    await expect(page.locator('button:has-text("Sale")')).toBeVisible();
  });
});
