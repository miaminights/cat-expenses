import { getTopCategories } from '../categoryUtils';
import type { Expense } from '../../hooks/useCatExpenseData';

const expense = (id: string, category: Expense['category'], amount: number): Expense => ({
  id,
  name: `Item ${id}`,
  category,
  amount,
});

describe('getTopCategories', () => {
  it('returns an empty Set when there are no expenses', () => {
    expect(getTopCategories([])).toEqual(new Set());
  });

  it('returns the single category when there is only one expense', () => {
    expect(getTopCategories([expense('1', 'Food', 10)])).toEqual(new Set(['Food']));
  });

  it('returns the category with the highest total spend', () => {
    const expenses = [expense('1', 'Food', 10), expense('2', 'Accessory', 100)];
    expect(getTopCategories(expenses)).toEqual(new Set(['Accessory']));
  });

  it('correctly sums multiple expenses within the same category', () => {
    const expenses = [expense('1', 'Food', 50), expense('2', 'Food', 60), expense('3', 'Accessory', 100)];
    // Food total = 110, Accessory total = 100
    expect(getTopCategories(expenses)).toEqual(new Set(['Food']));
  });

  it('returns all categories that are tied for the highest total', () => {
    const expenses = [expense('1', 'Food', 100), expense('2', 'Accessory', 100), expense('3', 'Furniture', 50)];
    expect(getTopCategories(expenses)).toEqual(new Set(['Food', 'Accessory']));
  });

  it('returns all three categories when all totals are equal', () => {
    const expenses = [expense('1', 'Food', 10), expense('2', 'Accessory', 10), expense('3', 'Furniture', 10)];
    expect(getTopCategories(expenses)).toEqual(new Set(['Food', 'Accessory', 'Furniture']));
  });
});

