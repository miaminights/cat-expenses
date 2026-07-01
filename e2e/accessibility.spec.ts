import { expect, type Page, test } from '@playwright/test';

const MOCK_CAT_FACT = 'Cats sleep 16 hours a day.';

test.beforeEach(async ({ page }) => {
  await page.route('https://catfact.ninja/fact', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fact: MOCK_CAT_FACT, length: MOCK_CAT_FACT.length }),
    }),
  );
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function addExpense(page: Page, name: string, category: string, amount: string) {
  await page.getByRole('button', { name: 'Add Expense' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('#expense-name').fill(name);
  await page.locator('#expense-category').selectOption(category);
  await page.locator('#expense-amount').fill(amount);
  await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
}

// ─── Keyboard navigation ──────────────────────────────────────────────────────

test.describe('Keyboard navigation', () => {
  test('"Expense Tracker" summary is focusable', async ({ page }) => {
    const summary = page.locator('[aria-label^="Expense Tracker"]');
    await summary.focus();
    await expect(summary).toBeFocused();
  });

  test('empty state is focusable', async ({ page }) => {
    const emptyState = page.locator('[aria-label="No expenses yet, click Add Expense to get started"]');
    await emptyState.focus();
    await expect(emptyState).toBeFocused();
  });

  test('pressing Enter toggles a row checkbox', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    const checkbox = page.getByRole('checkbox', { name: /Select Cat Food/ });
    await checkbox.focus();
    await expect(checkbox).not.toBeChecked();
    await page.keyboard.press('Enter');
    await expect(checkbox).toBeChecked();
    await page.keyboard.press('Enter');
    await expect(checkbox).not.toBeChecked();
  });

  test('pressing Enter toggles the select-all checkbox', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    const selectAll = page.getByRole('checkbox', { name: 'Select all expenses' });
    await selectAll.focus();
    await page.keyboard.press('Enter');
    await expect(selectAll).toBeChecked();
    await page.keyboard.press('Enter');
    await expect(selectAll).not.toBeChecked();
  });

  test('pressing Space still toggles a row checkbox', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    const checkbox = page.getByRole('checkbox', { name: /Select Cat Food/ });
    await checkbox.focus();
    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();
  });
});

// ─── Modal focus management ───────────────────────────────────────────────────

test.describe('Modal focus management', () => {
  test('focus moves to the dialog panel when the modal opens', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const focusedRole = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(focusedRole).toBe('dialog');
  });

  test('dialog is labelled by its visible heading', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Expense' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-labelledby', 'expense-modal-title');
    await expect(page.locator('#expense-modal-title')).toHaveText('Add Expense');
  });

  test('Edit Expense dialog carries the correct label', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    await page.getByRole('button', { name: 'Edit Cat Food' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#expense-modal-title')).toHaveText('Edit Expense');
  });

  test('cat fact section is focusable within the modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const catFact = page.locator('[aria-label*="cat fact" i]');
    await catFact.focus();
    await expect(catFact).toBeFocused();
  });
});

// ─── ARIA attributes ──────────────────────────────────────────────────────────

test.describe('ARIA attributes', () => {
  test('header checkbox reports aria-checked=mixed when only some expenses are selected', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    await addExpense(page, 'Cat Collar', 'Accessory', '20.00');
    await page.getByRole('checkbox', { name: /Select Cat Food/ }).check();
    await expect(page.getByRole('checkbox', { name: 'Select all expenses' })).toHaveAttribute('aria-checked', 'mixed');
  });

  test('row checkbox reflects aria-checked state correctly', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    const checkbox = page.getByRole('checkbox', { name: /Select Cat Food/ });
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
    await checkbox.check();
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });
});
