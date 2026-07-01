import { test, expect } from '@playwright/test';

const CURRENCY_COOKIE = 'preferred_currency';

test.describe('Currency selector persistence', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
  });

  test('defaults to the browser-detected currency on first load', async ({ page }) => {
    const selector = page.getByLabel('Select currency');
    await expect(selector).toBeVisible();
    // jsdom and Chromium both default to en-US → USD
    await expect(selector).toHaveValue('USD');
  });

  test('persists the selected currency across a page reload', async ({ page }) => {
    await page.getByLabel('Select currency').selectOption('EUR');
    await expect(page.getByLabel('Select currency')).toHaveValue('EUR');

    await page.reload();

    await expect(page.getByLabel('Select currency')).toHaveValue('EUR');
  });

  test('sets the preferred_currency cookie when a currency is selected', async ({ page, context }) => {
    await page.getByLabel('Select currency').selectOption('JPY');

    const cookies = await context.cookies();
    const cookie = cookies.find((c) => c.name === CURRENCY_COOKIE);
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('JPY');
  });

  test('loads the currency from a pre-existing cookie on first visit', async ({ page, context }) => {
    await context.addCookies([
      { name: CURRENCY_COOKIE, value: 'GBP', domain: 'localhost', path: '/' },
    ]);

    await page.reload();

    await expect(page.getByLabel('Select currency')).toHaveValue('GBP');
  });

  test('updates the cookie when the currency is changed a second time', async ({ page, context }) => {
    await page.getByLabel('Select currency').selectOption('EUR');
    await page.getByLabel('Select currency').selectOption('CAD');

    const cookies = await context.cookies();
    const cookie = cookies.find((c) => c.name === CURRENCY_COOKIE);
    expect(cookie?.value).toBe('CAD');
  });
});
