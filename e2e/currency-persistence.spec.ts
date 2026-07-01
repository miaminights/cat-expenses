import { expect, test } from '@playwright/test';

const CURRENCY_COOKIE = 'preferred_currency';
const MOCK_CAT_FACT = 'Cats sleep 16 hours a day.';

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
    await context.addCookies([{ name: CURRENCY_COOKIE, value: 'GBP', domain: 'localhost', path: '/' }]);

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

test.describe('Currency selector — formatting effect', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.route('https://catfact.ninja/fact', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ fact: MOCK_CAT_FACT, length: MOCK_CAT_FACT.length }),
      }),
    );
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('changing currency updates the formatted amounts in the expense table', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.locator('#expense-name').fill('Cat Toy');
    await page.locator('#expense-category').selectOption('Accessory');
    await page.locator('#expense-amount').fill('25');
    await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Default USD formatting in the table cell
    await expect(page.locator('td').getByText('$25.00', { exact: true })).toBeVisible();

    // Switch to JPY — symbol change makes the difference unambiguous
    await page.getByLabel('Select currency').selectOption('JPY');

    await expect(page.locator('td').getByText('$25.00', { exact: true })).not.toBeVisible();
    await expect(page.locator('td').getByText(/¥25/)).toBeVisible();
  });

  test('changing currency updates the total amount label', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.locator('#expense-name').fill('Cat Treat');
    await page.locator('#expense-category').selectOption('Food');
    await page.locator('#expense-amount').fill('10');
    await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    await expect(page.getByText(/\$10\.00 spent/)).toBeVisible();

    await page.getByLabel('Select currency').selectOption('JPY');

    await expect(page.getByText(/\$10\.00 spent/)).not.toBeVisible();
    await expect(page.getByText(/¥10\.00 spent/)).toBeVisible();
  });
});
