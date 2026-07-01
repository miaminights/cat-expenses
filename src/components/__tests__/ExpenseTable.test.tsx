import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { Expense } from '../../hooks/useCatExpenseData';
import { ExpenseTable } from '../ExpenseTable';

const makeExpense = (id: string, category: Expense['category'], amount: number): Expense => ({
  id,
  name: `Item ${id}`,
  category,
  amount,
});

describe('ExpenseTable', () => {
  it('renders the empty state when there are no expenses', () => {
    render(
      <ExpenseTable
        expenses={[]}
        selectedIds={[]}
        topCategories={new Set()}
        onSelectionChange={vi.fn()}
        onEdit={vi.fn()}
      />,
    );
    expect(screen.getByText('No expenses yet')).toBeInTheDocument();
  });

  it('renders a row for each expense', () => {
    const expenses = [makeExpense('1', 'Food', 10), makeExpense('2', 'Accessory', 20)];
    render(
      <ExpenseTable
        expenses={expenses}
        selectedIds={[]}
        topCategories={new Set()}
        onSelectionChange={vi.fn()}
        onEdit={vi.fn()}
      />,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('passes isTopCategory=true only to rows in the top category set', () => {
    const expenses = [makeExpense('1', 'Food', 10), makeExpense('2', 'Accessory', 100)];
    render(
      <ExpenseTable
        expenses={expenses}
        selectedIds={[]}
        topCategories={new Set(['Accessory'])}
        onSelectionChange={vi.fn()}
        onEdit={vi.fn()}
      />,
    );
    // The TOP badge only appears on Accessory rows
    expect(screen.getByText('Top')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    // Header row + 2 data rows = 3 total; Item 2 row should have bg-brand-50
    const itemTwoRow = rows.find((r) => r.textContent?.includes('Item 2'));
    expect(itemTwoRow).toHaveClass('bg-brand-50');
    const itemOneRow = rows.find((r) => r.textContent?.includes('Item 1'));
    expect(itemOneRow).not.toHaveClass('bg-brand-50');
  });

  it('calls onSelectionChange with the toggled id when a row checkbox is clicked', async () => {
    const onSelectionChange = vi.fn();
    const expenses = [makeExpense('1', 'Food', 10)];
    render(
      <ExpenseTable
        expenses={expenses}
        selectedIds={[]}
        topCategories={new Set()}
        onSelectionChange={onSelectionChange}
        onEdit={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Item 1' }));
    expect(onSelectionChange).toHaveBeenCalledWith(['1']);
  });

  it('calls onSelectionChange with all ids when select-all is checked', async () => {
    const onSelectionChange = vi.fn();
    const expenses = [makeExpense('1', 'Food', 10), makeExpense('2', 'Accessory', 20)];
    render(
      <ExpenseTable
        expenses={expenses}
        selectedIds={[]}
        topCategories={new Set()}
        onSelectionChange={onSelectionChange}
        onEdit={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all expenses' }));
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('calls onSelectionChange with an empty array when select-all is unchecked', async () => {
    const onSelectionChange = vi.fn();
    const expenses = [makeExpense('1', 'Food', 10), makeExpense('2', 'Accessory', 20)];
    render(
      <ExpenseTable
        expenses={expenses}
        selectedIds={['1', '2']}
        topCategories={new Set()}
        onSelectionChange={onSelectionChange}
        onEdit={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all expenses' }));
    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });
});
