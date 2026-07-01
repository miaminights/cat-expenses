import type { Category, Expense } from '../hooks/useCatExpenseData';
import { ExpenseTableHeader } from './ExpenseTableHeader';
import { ExpenseTableRow } from './ExpenseTableRow';

interface ExpenseTableProps {
  expenses: Expense[];
  selectedIds: string[];
  topCategories: Set<Category>;
  onSelectionChange: (selectedIds: string[]) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function ExpenseTable({
  expenses,
  selectedIds,
  topCategories,
  onSelectionChange,
  onEdit,
  onDuplicate,
}: ExpenseTableProps) {
  const selectedSet = new Set(selectedIds);

  function handleToggleRow(id: string) {
    const next = new Set(selectedSet);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange([...next]);
  }

  function handleToggleAll(checked: boolean) {
    onSelectionChange(checked ? expenses.map((e) => e.id) : []);
  }

  if (expenses.length === 0) {
    return (
      <div
        tabIndex={0}
        className="flex flex-col items-center justify-center py-20 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        aria-label="No expenses yet, click Add Expense to get started"
      >
        <div className="mb-4 text-5xl" aria-hidden="true">
          🐱
        </div>
        <p className="text-base font-medium text-gray-700">No expenses yet</p>
        <p className="mt-1 text-sm text-gray-400">
          Click <span className="font-medium text-brand-800">Add Expense</span> to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full border-collapse">
        <ExpenseTableHeader
          totalCount={expenses.length}
          selectedCount={selectedIds.length}
          onToggleAll={handleToggleAll}
        />
        <tbody>
          {expenses.map((expense) => (
            <ExpenseTableRow
              key={expense.id}
              expense={expense}
              isSelected={selectedSet.has(expense.id)}
              isTopCategory={topCategories.has(expense.category)}
              onToggle={handleToggleRow}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
