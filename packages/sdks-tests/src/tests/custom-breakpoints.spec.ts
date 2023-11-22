import { expect } from '@playwright/test';
import {
  EXCLUDE_RN,
  expectStylesForElement,
  findTextInPage,
  getBuilderSessionIdCookie,
  isRNSDK,
  test,
  EXCLUDE_GEN_1,
} from './helpers.js';

test.describe('Tracking', () => {
  test.describe('cookies', () => {
    test('do not appear if canTrack=false', async ({ page, context, packageName }) => {
      // TO-DO: figure out why Remix fails this test
      test.fail(packageName === 'gen1-remix');

      // by waiting for network requests, we guarantee that impression tracking POST was (NOT) made,
      // which guarantees that the cookie was set or not.
      await page.goto('/can-track-false', { waitUntil: 'networkidle' });

      const cookies = await context.cookies();
      const builderSessionCookie = cookies.find(cookie => cookie.name === 'builderSessionId');
      expect(builderSessionCookie).toBeUndefined();
    });
    test('appear by default', async ({ page, context }) => {
      test.fail(EXCLUDE_RN);
      const navigate = page.goto('/');
      const trackingRequestPromise = page.waitForRequest(
        req => req.url().includes('cdn.builder.io/api/v1/track') && req.method() === 'POST'
      );

      await navigate;
      // By waiting for the tracking POST request, we guarantee that the cookie is now set.
      await trackingRequestPromise;

      const builderSessionCookie = await getBuilderSessionIdCookie({ context });

      expect(builderSessionCookie).toBeDefined();
    });
  });
  test.describe('POST data', () => {
    test('POSTs correct impression data', async ({ page }) => {
      const navigate = page.goto('/');
      const trackingRequestPromise = page.waitForRequest(
        request =>
          request.url().includes('cdn.builder.io/api/v1/track') && request.method() === 'POST'
      );

      await navigate;
      const trackingRequest = await trackingRequestPromise;

      const data = trackingRequest.postDataJSON();

      const expected = {
        events: [
          {
            type: 'impression',
            data: {
              metadata: {},
              userAttributes: {
                device: 'desktop',
              },
            },
          },
        ],
      };

      if (isRNSDK) {
        expected.events[0].data.userAttributes.device = 'mobile';
      }

      const ID_REGEX = /^[a-f0-9]{32}$/;

      expect(data).toMatchObject(expected);
      expect(data.events[0].data.sessionId).toMatch(ID_REGEX);
      expect(data.events[0].data.visitorId).toMatch(ID_REGEX);
      expect(data.events[0].data.ownerId).toMatch(/abcd/);

      if (!isRNSDK) {
        expect(data.events[0].data.metadata.url).toMatch(/http:\/\/localhost:\d+\//);
        expect(data.events[0].data.userAttributes.urlPath).toBe('/');
        expect(data.events[0].data.userAttributes.host).toMatch(/localhost:[\d]+/);
      }
    });

    test('POSTs correct click data', async ({ page }) => {
      test.skip(EXCLUDE_GEN_1);
      await page.goto('/', { waitUntil: 'networkidle' });
      const trackingRequestPromise = page.waitForRequest(
        request =>
          request.url().includes('cdn.builder.io/api/v1/track') &&
          request.method() === 'POST' &&
          request.postDataJSON().events[0].type === 'click'
      );

      // click on an element
      await page.click('text=SDK Feature testing project');

      // get click tracking request
      const trackingRequest = await trackingRequestPromise;

      const data = trackingRequest.postDataJSON();

      const expected = {
        events: [
          {
            type: 'click',
            data: {
              metadata: {},
              userAttributes: {
                device: 'desktop',
              },
            },
          },
        ],
      };

      if (isRNSDK) {
        expected.events[0].data.userAttributes.device = 'mobile';
      }

      const ID_REGEX = /^[a-f0-9]{32}$/;

      expect(data).toMatchObject(expected);

      if (!isRNSDK) {
        // check that all the heatmap metadata is present

        expect(!isNaN(parseFloat(data.events[0].data.metadata.builderElementIndex))).toBeTruthy();
        expect(!isNaN(parseFloat(data.events[0].data.metadata.builderTargetOffset.x))).toBeTruthy();
        expect(!isNaN(parseFloat(data.events[0].data.metadata.builderTargetOffset.y))).toBeTruthy();
        expect(!isNaN(parseFloat(data.events[0].data.metadata.targetOffset.x))).toBeTruthy();
        expect(!isNaN(parseFloat(data.events[0].data.metadata.targetOffset.y))).toBeTruthy();
      }

      // baseline tests for impression tracking
      expect(data.events[0].data.sessionId).toMatch(ID_REGEX);
      expect(data.events[0].data.visitorId).toMatch(ID_REGEX);
      expect(data.events[0].data.ownerId).toMatch(/abcd/);

      if (!isRNSDK) {
        expect(data.events[0].data.metadata.url).toMatch(/http:\/\/localhost:\d+\//);
        expect(data.events[0].data.userAttributes.urlPath).toBe('/');
        expect(data.events[0].data.userAttributes.host).toMatch(/localhost:[\d]+/);
      }
    });
  });
});

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

test.describe('Custom Breakpoints', () => {
  /* set breakpoint config in content -
breakpoints: {
  small: 500,
  medium: 800,
},
*/
  test.describe('when applied', () => {
    test('large desktop size', async ({ page }) => {
      await page.setViewportSize({ width: 801, height: 1000 });

      await page.goto('/custom-breakpoints');
      const breakpointsParam = page.locator(`text=BREAKPOINTS 500 - 800`);

      let expectedTextColor = 'rgb(0, 0, 0)'; // black text color
      if (isRNSDK) {
        expectedTextColor = 'rgb(65, 117, 5)'; // greenish text color
      }

      await expect(breakpointsParam).toHaveCSS('color', expectedTextColor);

      const column2 = page.locator(`text=Column 2`);

      let expectedColumnTextColor = 'rgb(0, 0, 0)'; // black text color
      if (isRNSDK) {
        expectedColumnTextColor = 'rgb(126, 211, 33)'; // greenish text color
      }

      await expect(column2).toHaveCSS('color', expectedColumnTextColor);

      // Skipping this image test for react-native.
      // Its difficult to locate the image in react-native as css selectors don't work as expected.
      if (!isRNSDK) {
        const image = page.locator(`.builder-block:has(img.builder-image)`);

        const expectedImageCss: Record<string, string> = {
          display: 'flex',
          width: '785px',
        };

        await expectStylesForElement({
          locator: image,
          expected: expectedImageCss,
        });
      }
    });

    test('medium tablet size', async ({ page }) => {
      await page.setViewportSize({ width: 501, height: 1000 });

      await page.goto('/custom-breakpoints');
      const breakpointsPara = page.locator(`text=BREAKPOINTS 500 - 800`);

      let expectedTextColor = 'rgb(208, 2, 27)'; // reddish text color
      if (isRNSDK) {
        expectedTextColor = 'rgb(65, 117, 5)'; // greenish text color
      }

      await expect(breakpointsPara).toHaveCSS('color', expectedTextColor);

      const column2 = page.locator(`text=Column 2`);

      let expectedColumnTextColor = 'rgb(223, 22, 22)'; // reddish text color
      if (isRNSDK) {
        expectedColumnTextColor = 'rgb(126, 211, 33)'; // greenish text color
      }

      await expect(column2).toHaveCSS('color', expectedColumnTextColor);

      // Skipping this image test for react-native.
      // Its difficult to locate the image in react-native as css selectors don't work as expected.
      if (!isRNSDK) {
        const image = page.locator(`.builder-block:has(img.builder-image)`);

        const expectedImageCss: Record<string, string> = {
          display: 'none',
        };

        await expectStylesForElement({
          locator: image,
          expected: expectedImageCss,
        });
      }
    });

    test('small mobile size', async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 1000 });
      await page.goto('/custom-breakpoints');

      const breakpointsPara = page.locator(`text=BREAKPOINTS 500 - 800`);
      await expect(breakpointsPara).toHaveCSS('color', 'rgb(65, 117, 5)');

      const column2 = page.locator(`text=Column 2`);
      await expect(column2).toHaveCSS('color', 'rgb(126, 211, 33)');

      // Skipping this image test for react-native.
      // Its difficult to locate the image in react-native as css selectors don't work as expected.
      if (!isRNSDK) {
        const image = page.locator(`.builder-block:has(img.builder-image)`);

        const expectedImageCss: Record<string, string> = {
          display: 'flex',
          width: '121px',
          'max-width': '250px',
        };

        await expectStylesForElement({
          locator: image,
          expected: expectedImageCss,
        });
      }
    });
  });

  test.describe('when reset', () => {
    /*
    When no breakpoints are available, defaults are applied as
    breakpoints: {
      small: 640,
      medium: 991,
    }
  */
    test('large desktop size', async ({ page }) => {
      await page.setViewportSize({ width: 992, height: 1000 });
      await page.goto('/custom-breakpoints-reset');

      const breakpointsPara = page.locator(`text=BREAKPOINTS 500 - 800`);

      let expectedTextColor = 'rgb(0, 0, 0)'; // black text color
      if (isRNSDK) {
        expectedTextColor = 'rgb(65, 117, 5)'; // greenish text color
      }

      await expect(breakpointsPara).toHaveCSS('color', expectedTextColor);

      const column2 = page.locator(`text=Column 2`);

      let expectedColumnTextColor = 'rgb(0, 0, 0)'; // black text color
      if (isRNSDK) {
        expectedColumnTextColor = 'rgb(126, 211, 33)'; // greenish text color
      }

      await expect(column2).toHaveCSS('color', expectedColumnTextColor);

      // Skipping this image test for react-native.
      // Its difficult to locate the image in react-native as css selectors don't work as expected.
      if (!isRNSDK) {
        const image = page.locator(`.builder-block:has(img.builder-image)`);

        const expectedImageCss: Record<string, string> = {
          display: 'flex',
          width: '976px',
        };

        await expectStylesForElement({
          locator: image,
          expected: expectedImageCss,
        });
      }
    });

    test('medium tablet size', async ({ page }) => {
      await page.setViewportSize({ width: 641, height: 1000 });

      await page.goto('/custom-breakpoints-reset');
      const breakpointsPara = page.locator(`text=BREAKPOINTS 500 - 800`);

      let expectedTextColor = 'rgb(208, 2, 27)'; // reddish text color
      if (isRNSDK) {
        expectedTextColor = 'rgb(65, 117, 5)'; // greenish text color
      }

      await expect(breakpointsPara).toHaveCSS('color', expectedTextColor);

      const column2 = page.locator(`text=Column 2`);

      let expectedColumnTextColor = 'rgb(223, 22, 22)'; // reddish text color
      if (isRNSDK) {
        expectedColumnTextColor = 'rgb(126, 211, 33)'; // greenish text color
      }

      await expect(column2).toHaveCSS('color', expectedColumnTextColor);

      // Skipping this image test for react-native.
      // Its difficult to locate the image in react-native as css selectors don't work as expected.
      if (!isRNSDK) {
        const image = page.locator(`.builder-block:has(img.builder-image)`);

        const expectedImageCss: Record<string, string> = {
          display: 'none',
        };

        await expectStylesForElement({
          locator: image,
          expected: expectedImageCss,
        });
      }
    });

    test('small mobile size', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 1000 });
      await page.goto('/custom-breakpoints-reset');

      const breakpointsPara = page.locator(`text=BREAKPOINTS 500 - 800`);

      await expect(breakpointsPara).toHaveCSS('color', 'rgb(65, 117, 5)');

      const column2 = page.locator(`text=Column 2`);

      await expect(column2).toHaveCSS('color', 'rgb(126, 211, 33)');

      // Skipping this image test for react-native.
      // Its difficult to locate the image in react-native as css selectors don't work as expected.
      if (!isRNSDK) {
        const image = page.locator(`.builder-block:has(img.builder-image)`);

        const expectedImageCss: Record<string, string> = {
          display: 'flex',
          width: '156px',
          'max-width': '250px',
        };

        await expectStylesForElement({
          locator: image,
          expected: expectedImageCss,
        });
      }
    });
  });
});
