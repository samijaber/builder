import { expect } from '@playwright/test';
import { EXCLUDE_RN, findTextInPage, isRNSDK, test, excludeTestFor } from './helpers.js';

test('Client-side navigation', async ({ page }) => {
  await page.goto('/');

  const links = page.locator('a');

  const columnsLink = await links.filter({
    hasText: 'Columns (with images) ',
  });

  await expect(columnsLink).toHaveCount(1);
  await columnsLink.click();
  await findTextInPage({ page, text: 'Stack at tablet' });
});

test.describe('Features', () => {
  test.describe('Reactive State', () => {
    test('shows default value', async ({ page }) => {
      test.fail(EXCLUDE_RN);
      await page.goto('/reactive-state');

      await expect(page.getByText('0', { exact: true })).toBeVisible();
    });

    test('increments value correctly', async ({ page, packageName }) => {
      test.fail(
        excludeTestFor({
          reactNative: true,
          rsc: true,
        })
      );
      test.fail(packageName === 'next-app-dir');

      await page.goto('/reactive-state');

      const locator = isRNSDK ? page.locator('[data-builder-text]') : page.locator('.builder-text');

      await expect(locator.getByText('0', { exact: true })).toBeVisible();

      await page.getByText('Increment Number').click();

      await expect(locator.getByText('1', { exact: true })).toBeVisible();
    });
  });

  test.describe('Show If & Hide If', () => {
    test('works on static conditions', async ({ page }) => {
      await page.goto('/show-hide-if');

      await findTextInPage({ page, text: 'this always appears' });
      await expect(page.locator('body')).not.toContainText('this never appears');
    });

    test('works on reactive conditions', async ({ page, packageName }) => {
      test.fail(
        excludeTestFor({
          reactNative: true,
          rsc: true,
          solid: true,
        })
      );

      // since these are flaky tests, we have to `.skip()` instead of `.fail()`, seeing as they might sometimes pass.
      test.skip(
        // TO-DO: flaky in remix
        packageName === 'gen1-remix' ||
          // flaky in vue3: takes too long to hydrate, causing button click not to register...
          packageName === 'vue3' ||
          packageName === 'nuxt3'
      );

      await page.goto('/show-hide-if');

      await expect(page.getByText('even clicks')).toBeVisible();
      await expect(page.locator('body')).not.toContainText('odd clicks');

      const button = page.getByRole('button');
      await expect(button).toBeVisible();
      await button.click();

      await expect(page.getByText('odd clicks')).toBeVisible();
      await expect(page.locator('body')).not.toContainText('even clicks');
    });
  });
  test('Dynamic Data Bindings', async ({ page }) => {
    await page.goto('/data-bindings');

    await expect(page.locator(`text="1234"`).first()).toBeVisible();
    await findTextInPage({
      page,
      text: 'The Hot Wheels™ Legends Tour is Back',
    });
    await findTextInPage({
      page,
      text: 'Mattel Certified by Great Place to Work and Named to Fast Company’s List of 100 Best Workplaces for Innovators',
    });
  });

  test.describe('Link URL', () => {
    test('renders with static value', async ({ page }) => {
      await page.goto('/link-url');

      await page.locator(`a[href="/static-url"]`).waitFor();
    });
    test('renders with dynamic value', async ({ page }) => {
      await page.goto('/link-url');

      await page.locator(`a[href="/dynamic-url"]`).waitFor();
    });
  });
});
