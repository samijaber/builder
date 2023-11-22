import type { ConsoleMessage } from '@playwright/test';
import { expect } from '@playwright/test';
import { test } from './helpers.js';

test.describe('Element Events', () => {
  const filterConsoleMessages = (consoleMessage: ConsoleMessage) => {
    const text = consoleMessage.text();
    return text.startsWith('clicked');
  };
  test('click works on button', async ({ page }) => {
    await page.goto('/element-events');

    // Get the next console log message
    const msgPromise = page.waitForEvent('console', filterConsoleMessages);

    await page.getByText('Click me!').click();

    const msg = await msgPromise;

    expect(msg.text()).toEqual('clicked button');
  });
  test('click works on box', async ({ page }) => {
    await page.goto('/element-events');

    // Get the next console log message
    const msgPromise = page.waitForEvent('console', filterConsoleMessages);

    await page.getByText('clickable BOX').click();
    const msg = await msgPromise;

    expect(msg.text()).toEqual('clicked box');
  });

  test('click works on text', async ({ page }) => {
    await page.goto('/element-events');

    // Get the next console log message
    const msgPromise = page.waitForEvent('console', filterConsoleMessages);

    await page.getByText('clickable text').click();
    const msg = await msgPromise;

    expect(msg.text()).toEqual('clicked text');
  });
});
