import { test, expect, type Page } from '@playwright/test';

// All tests run in both 'desktop' and 'mobile' Playwright projects
// (defined in playwright.config.ts) without any code changes needed here.

const MOCK_CAT_FACT = 'Cats sleep 16 hours a day.';

// ─── Shared setup ────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  // Intercept the cat fact API so tests are deterministic and offline-safe
  await page.route('https://catfact.ninja/fact', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fact: MOCK_CAT_FACT, length: MOCK_CAT_FACT.length }),
    }),
  );

  await page.goto('/');
  // Start each test with a clean slate
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function openModal(page: Page) {
  // Before the dialog opens there is exactly one "Add Expense" button on the page
  await page.getByRole('button', { name: 'Add Expense' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

async function submitForm(page: Page, name: string, category: string, amount: string) {
  await page.locator('#expense-name').fill(name);
  await page.locator('#expense-category').selectOption(category);
  await page.locator('#expense-amount').fill(amount);
  // Scope the submit click to the dialog so it never accidentally hits the action-bar button
  await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();
}

async function addExpense(page: Page, name: string, category: string, amount: string) {
  await openModal(page);
  await submitForm(page, name, category, amount);
  await expect(page.getByRole('dialog')).not.toBeVisible();
}

// ─── Modal open / close ───────────────────────────────────────────────────────

test.describe('Modal open/close', () => {
  test('opens when the Add Expense button is clicked', async ({ page }) => {
    await openModal(page);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'Add Expense' })).toBeVisible();
  });

  test('closes when the X button is clicked', async ({ page }) => {
    await openModal(page);
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes when clicking the backdrop', async ({ page }) => {
    await openModal(page);
    // Target the backdrop by its unique class — '[aria-hidden="true"]' matches
    // multiple elements and coordinate-based clicks are blocked by aria-modal enforcement
    await page.locator('.backdrop-blur-sm').dispatchEvent('click');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes when pressing Escape', async ({ page }) => {
    await openModal(page);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

// ─── Cat fact ─────────────────────────────────────────────────────────────────

test.describe('Cat fact', () => {
  test('displays the random cat fact inside the modal', async ({ page }) => {
    await openModal(page);
    await expect(page.getByText(MOCK_CAT_FACT)).toBeVisible();
  });

  test('fetches a new cat fact each time the modal is opened', async ({ page }) => {
    let callCount = 0;
    await page.route('https://catfact.ninja/fact', (route) => {
      callCount++;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ fact: `Fact #${callCount}`, length: 10 }),
      });
    });

    // Open, close, open again
    await openModal(page);
    await page.getByRole('button', { name: 'Close modal' }).click();
    await openModal(page);

    expect(callCount).toBe(2);
  });
});

// ─── Adding an expense ────────────────────────────────────────────────────────

test.describe('Adding an expense', () => {
  test('adds a new expense and shows it in the table', async ({ page }) => {
    await addExpense(page, 'Whiskers Cat Food', 'Food', '25.50');

    const row = page.getByRole('row').filter({ hasText: 'Whiskers Cat Food' });
    await expect(row).toBeVisible();
    await expect(row.getByText(/^Food$/)).toBeVisible();
    await expect(row.getByText('$25.50')).toBeVisible();
  });

  test('resets the form after a successful submission', async ({ page }) => {
    await addExpense(page, 'Cat Toy', 'Accessory', '9.99');

    // Open the modal again — fields should be blank
    await openModal(page);
    await expect(page.locator('#expense-name')).toHaveValue('');
    await expect(page.locator('#expense-category')).toHaveValue('');
    await expect(page.locator('#expense-amount')).toHaveValue('');
  });
});

// ─── Deleting expenses ────────────────────────────────────────────────────────

test.describe('Deleting expenses', () => {
  test('Delete button is disabled when nothing is selected', async ({ page }) => {
    await addExpense(page, 'Cat Toy', 'Accessory', '10.00');
    await expect(page.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  test('deletes the selected expense', async ({ page }) => {
    await addExpense(page, 'Cat Toy', 'Accessory', '10.00');

    await page.getByRole('checkbox', { name: 'Select Cat Toy' }).check();
    await page.getByRole('button', { name: /delete/i }).click();

    await expect(page.getByText('Cat Toy')).not.toBeVisible();
    // Empty state returns
    await expect(page.getByText('No expenses yet')).toBeVisible();
  });

  test('deletes multiple selected expenses at once', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    await addExpense(page, 'Cat Collar', 'Accessory', '20.00');
    await addExpense(page, 'Cat Bed', 'Furniture', '80.00');

    await page.getByRole('checkbox', { name: 'Select Cat Food' }).check();
    await page.getByRole('checkbox', { name: 'Select Cat Collar' }).check();
    await page.getByRole('button', { name: /delete/i }).click();

    await expect(page.getByText('Cat Food')).not.toBeVisible();
    await expect(page.getByText('Cat Collar')).not.toBeVisible();
    await expect(page.getByText('Cat Bed')).toBeVisible();
  });
});

// ─── Checkbox selection ───────────────────────────────────────────────────────

test.describe('Checkbox selection', () => {
  test('can check and uncheck an individual expense', async ({ page }) => {
    await addExpense(page, 'Cat Bed', 'Furniture', '50.00');

    const checkbox = page.getByRole('checkbox', { name: 'Select Cat Bed' });
    await expect(checkbox).not.toBeChecked();

    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('select-all checks every expense', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    await addExpense(page, 'Cat Collar', 'Accessory', '20.00');

    await page.getByRole('checkbox', { name: 'Select all expenses' }).check();

    await expect(page.getByRole('checkbox', { name: 'Select Cat Food' })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Select Cat Collar' })).toBeChecked();
  });

  test('unchecking select-all deselects every expense', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    await addExpense(page, 'Cat Collar', 'Accessory', '20.00');

    const selectAll = page.getByRole('checkbox', { name: 'Select all expenses' });
    await selectAll.check();
    await selectAll.uncheck();

    await expect(page.getByRole('checkbox', { name: 'Select Cat Food' })).not.toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Select Cat Collar' })).not.toBeChecked();
  });

});

// ─── Form validation ──────────────────────────────────────────────────────────

test.describe('Form validation', () => {
  test('shows errors for all three fields when form is submitted empty', async ({ page }) => {
    await openModal(page);
    await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();

    await expect(page.getByText('Item name is required.')).toBeVisible();
    await expect(page.getByText('Please select a category.')).toBeVisible();
    await expect(page.getByText('Amount is required.')).toBeVisible();

    // Modal must stay open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('shows a specific error when a non-numeric amount is entered', async ({ page }) => {
    await openModal(page);
    await page.locator('#expense-amount').fill('abc');
    await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();

    await expect(page.getByText('Please enter a valid number.')).toBeVisible();
    await expect(page.getByText('Amount is required.')).not.toBeVisible();
  });

  test('shows a specific error when amount is zero or negative', async ({ page }) => {
    await openModal(page);

    await page.locator('#expense-amount').fill('-5');
    await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByText('Amount must be greater than zero.')).toBeVisible();

    await page.locator('#expense-amount').fill('0');
    await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByText('Amount must be greater than zero.')).toBeVisible();
  });

  test('clears a field error once that field is corrected', async ({ page }) => {
    await openModal(page);
    await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByText('Item name is required.')).toBeVisible();

    await page.locator('#expense-name').fill('Cat Bed');

    await expect(page.getByText('Item name is required.')).not.toBeVisible();
    // Other errors remain until fixed
    await expect(page.getByText('Please select a category.')).toBeVisible();
  });

  test('only shows errors for the fields that are still invalid', async ({ page }) => {
    await openModal(page);
    await page.locator('#expense-name').fill('Cat Bed');
    await page.getByRole('dialog').getByRole('button', { name: 'Add Expense' }).click();

    await expect(page.getByText('Item name is required.')).not.toBeVisible();
    await expect(page.getByText('Please select a category.')).toBeVisible();
    await expect(page.getByText('Amount is required.')).toBeVisible();
  });
});

// ─── Top category highlighting ────────────────────────────────────────────────

test.describe('Top category highlighting', () => {
  test('highlights only the rows belonging to the highest spending category', async ({ page }) => {
    // Accessory total = $550, Food total = $10
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    await addExpense(page, 'Diamond Cat Collar', 'Accessory', '500.00');
    await addExpense(page, 'Cat Brush', 'Accessory', '50.00');

    const catFoodRow = page.locator('tr').filter({ hasText: 'Cat Food' });
    const collarRow = page.locator('tr').filter({ hasText: 'Diamond Cat Collar' });
    const brushRow = page.locator('tr').filter({ hasText: 'Cat Brush' });

    await expect(collarRow).toHaveClass(/bg-brand-50/);
    await expect(brushRow).toHaveClass(/bg-brand-50/);
    await expect(catFoodRow).not.toHaveClass(/bg-brand-50/);
  });

  test('highlights rows from all tied categories when two categories share the highest total', async ({ page }) => {
    // Food $100, Accessory $100 — tied; Furniture $50 — not highlighted
    await addExpense(page, 'Cat Food', 'Food', '100.00');
    await addExpense(page, 'Cat Collar', 'Accessory', '100.00');
    await addExpense(page, 'Cat Sofa', 'Furniture', '50.00');

    const catFoodRow = page.locator('tr').filter({ hasText: 'Cat Food' });
    const collarRow = page.locator('tr').filter({ hasText: 'Cat Collar' });
    const sofaRow = page.locator('tr').filter({ hasText: 'Cat Sofa' });

    await expect(catFoodRow).toHaveClass(/bg-brand-50/);
    await expect(collarRow).toHaveClass(/bg-brand-50/);
    await expect(sofaRow).not.toHaveClass(/bg-brand-50/);
  });

  test('shows the top category banner identifying the winning category', async ({ page }) => {
    await addExpense(page, 'Cat Food', 'Food', '10.00');
    await addExpense(page, 'Cat Collar', 'Accessory', '500.00');

    const banner = page.getByText(/highest spending category/i);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Accessory');
  });
});

// ─── Data persistence ─────────────────────────────────────────────────────────

test.describe('Data persistence', () => {
  test('persists expenses across a full page reload', async ({ page }) => {
    await addExpense(page, 'Persistent Cat Toy', 'Accessory', '35.00');

    await page.reload();

    await expect(page.getByText('Persistent Cat Toy')).toBeVisible();
    await expect(
      page.locator('tr').filter({ hasText: 'Persistent Cat Toy' }).getByText('$35.00'),
    ).toBeVisible();
  });

  test('stores the correct data structure in localStorage', async ({ page }) => {
    await addExpense(page, 'Stored Cat Bowl', 'Food', '15.99');

    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('cat-expenses');
      return raw ? (JSON.parse(raw) as { name: string; category: string; amount: number; id: string }[]) : [];
    });

    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Stored Cat Bowl');
    expect(stored[0].category).toBe('Food');
    expect(stored[0].amount).toBe(15.99);
    expect(stored[0].id).toBeDefined();
  });

  test('removing all expenses clears the table and preserves the empty state', async ({ page }) => {
    await addExpense(page, 'Cat Toy', 'Accessory', '10.00');
    await page.getByRole('checkbox', { name: 'Select Cat Toy' }).check();
    await page.getByRole('button', { name: /delete/i }).click();

    await page.reload();

    await expect(page.getByText('No expenses yet')).toBeVisible();

    const stored = await page.evaluate(() => localStorage.getItem('cat-expenses'));
    expect(stored).toBe('[]');
  });
});
