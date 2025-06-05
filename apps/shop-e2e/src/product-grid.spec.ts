import { test, expect } from '@playwright/test';

test('has products listed', async ({ page }) => {
  await page.goto('/');

  const productGrid = page.getByTestId('productgrid');
  const children = await productGrid.locator('> *').all();
  expect(children.length).toBeGreaterThan(0);
});
