import type { Category, Expense } from '../hooks/useCatExpenseData';

export function getTopCategories(expenses: Expense[]): Set<Category> {
  if (expenses.length === 0) return new Set();

  const totals = expenses.reduce<Map<Category, number>>((acc, expense) => {
    acc.set(expense.category, (acc.get(expense.category) ?? 0) + expense.amount);

    return acc;
  }, new Map());

  const max = Math.max(...totals.values());

  const top = new Set<Category>();

  totals.forEach((total, category) => {
    if (total === max) top.add(category);
  });

  return top;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}
