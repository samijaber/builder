import { expect } from '@playwright/test';
import { isSSRFramework, test } from '../helpers/index.js';

test.describe('JS Code Async', () => {
  test('runs async code', async ({ page }) => {
    await page.goto('/jscode-async/');
    const msgPromise = page.waitForEvent('console', msg => msg.text().includes('hello world'));
    await msgPromise;
  });

  test('runs async code (after client-side navigation)', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a');
    const jsCodeLink = await links.filter({ hasText: 'JS Code' });

    await expect(jsCodeLink).toHaveCount(1);

    const msgPromise = page.waitForEvent('console', msg => msg.text().includes('hello world'));
    await jsCodeLink.click();
    await msgPromise;
  });

  test('runs async code in SSR (JS disabled)', async ({ browser, packageName }) => {
    test.fail(!isSSRFramework(packageName));

    const context = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto('/jscode-async/');
    // No assertions needed since we're just testing that the page loads without JS
  });
});
