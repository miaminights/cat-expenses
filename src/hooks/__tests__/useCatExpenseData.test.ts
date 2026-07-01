import { act,renderHook } from '@testing-library/react';

import { useCatExpenseData } from '../useCatExpenseData';

const STORAGE_KEY = 'cat-expenses';

beforeEach(() => {
  localStorage.clear();
});

describe('useCatExpenseData', () => {
  it('initializes with an empty list when localStorage has no data', () => {
    const { result } = renderHook(() => useCatExpenseData());
    expect(result.current.expenses).toEqual([]);
  });

  it('loads existing expenses from localStorage on mount', () => {
    const seed = [{ id: 'abc', name: 'Cat Food', category: 'Food', amount: 10 }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));

    const { result } = renderHook(() => useCatExpenseData());
    expect(result.current.expenses).toEqual(seed);
  });

  it('returns an empty list when localStorage contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json');
    const { result } = renderHook(() => useCatExpenseData());
    expect(result.current.expenses).toEqual([]);
  });

  describe('addExpense', () => {
    it('appends the new expense to the list', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'Cat Toy', category: 'Accessory', amount: 9.99 });
      });

      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0]).toMatchObject({
        name: 'Cat Toy',
        category: 'Accessory',
        amount: 9.99,
      });
    });

    it('assigns a unique id to each expense', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'A', category: 'Food', amount: 1 });
        result.current.addExpense({ name: 'B', category: 'Food', amount: 2 });
      });

      const [first, second] = result.current.expenses;
      expect(first.id).toBeDefined();
      expect(second.id).toBeDefined();
      expect(first.id).not.toBe(second.id);
    });

    it('persists the new expense to localStorage', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'Cat Bed', category: 'Furniture', amount: 80 });
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({ name: 'Cat Bed', category: 'Furniture', amount: 80 });
    });
  });

  describe('updateExpense', () => {
    it('replaces the matching expense with the new values', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'Cat Toy', category: 'Accessory', amount: 9.99 });
      });

      const id = result.current.expenses[0].id;
      act(() => {
        result.current.updateExpense(id, { name: 'Fancy Cat Toy', category: 'Accessory', amount: 14.99 });
      });

      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0]).toMatchObject({
        id,
        name: 'Fancy Cat Toy',
        category: 'Accessory',
        amount: 14.99,
      });
    });

    it('preserves the original id after an update', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'Cat Toy', category: 'Accessory', amount: 9.99 });
      });

      const id = result.current.expenses[0].id;
      act(() => {
        result.current.updateExpense(id, { name: 'Updated', category: 'Food', amount: 5 });
      });

      expect(result.current.expenses[0].id).toBe(id);
    });

    it('only updates the matching expense and leaves others unchanged', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'A', category: 'Food', amount: 10 });
        result.current.addExpense({ name: 'B', category: 'Accessory', amount: 20 });
      });

      const idToUpdate = result.current.expenses[0].id;
      act(() => {
        result.current.updateExpense(idToUpdate, { name: 'A Updated', category: 'Food', amount: 15 });
      });

      expect(result.current.expenses[0].name).toBe('A Updated');
      expect(result.current.expenses[1].name).toBe('B');
    });
  });

  describe('duplicateExpense', () => {
    it('inserts a copy immediately after the original', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'Cat Toy', category: 'Accessory', amount: 9.99 });
        result.current.addExpense({ name: 'Cat Bed', category: 'Furniture', amount: 50 });
      });

      const idToDuplicate = result.current.expenses[0].id;
      act(() => {
        result.current.duplicateExpense(idToDuplicate);
      });

      expect(result.current.expenses).toHaveLength(3);
      expect(result.current.expenses[0].name).toBe('Cat Toy');
      expect(result.current.expenses[1].name).toBe('Cat Toy');
      expect(result.current.expenses[2].name).toBe('Cat Bed');
    });

    it('gives the duplicate a different id from the original', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'Cat Toy', category: 'Accessory', amount: 9.99 });
      });

      const originalId = result.current.expenses[0].id;
      act(() => {
        result.current.duplicateExpense(originalId);
      });

      expect(result.current.expenses[1].id).toBeDefined();
      expect(result.current.expenses[1].id).not.toBe(originalId);
    });

    it('copies the name, category, and amount from the original', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'Cat Toy', category: 'Accessory', amount: 9.99 });
      });

      const originalId = result.current.expenses[0].id;
      act(() => {
        result.current.duplicateExpense(originalId);
      });

      expect(result.current.expenses[1]).toMatchObject({
        name: 'Cat Toy',
        category: 'Accessory',
        amount: 9.99,
      });
    });

    it('is a no-op when the given id does not exist', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'Cat Toy', category: 'Accessory', amount: 9.99 });
      });

      act(() => {
        result.current.duplicateExpense('nonexistent-id');
      });

      expect(result.current.expenses).toHaveLength(1);
    });
  });

  describe('deleteExpenses', () => {
    it('removes the expense with the given id', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'A', category: 'Food', amount: 10 });
        result.current.addExpense({ name: 'B', category: 'Accessory', amount: 20 });
      });

      const idToDelete = result.current.expenses[0].id;
      act(() => {
        result.current.deleteExpenses([idToDelete]);
      });

      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0].name).toBe('B');
    });

    it('removes multiple expenses at once', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'A', category: 'Food', amount: 10 });
        result.current.addExpense({ name: 'B', category: 'Accessory', amount: 20 });
        result.current.addExpense({ name: 'C', category: 'Furniture', amount: 30 });
      });

      const idsToDelete = result.current.expenses.slice(0, 2).map((e) => e.id);
      act(() => {
        result.current.deleteExpenses(idsToDelete);
      });

      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0].name).toBe('C');
    });

    it('persists the deletion to localStorage', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'A', category: 'Food', amount: 10 });
      });

      const id = result.current.expenses[0].id;
      act(() => {
        result.current.deleteExpenses([id]);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      expect(stored).toHaveLength(0);
    });

    it('is a no-op when the given id does not exist', () => {
      const { result } = renderHook(() => useCatExpenseData());

      act(() => {
        result.current.addExpense({ name: 'A', category: 'Food', amount: 10 });
      });

      act(() => {
        result.current.deleteExpenses(['nonexistent-id']);
      });

      expect(result.current.expenses).toHaveLength(1);
    });
  });
});
