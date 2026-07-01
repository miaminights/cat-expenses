import { useState } from 'react';
import { useCatExpenseData } from './hooks/useCatExpenseData';
import { getTopCategories } from './utils/categoryUtils';
import { Button } from './components/Button';
import { ExpenseTable } from './components/ExpenseTable';
import { ExpenseModal } from './components/ExpenseModal';
import type { Expense } from './hooks/useCatExpenseData';

export default function App() {
  const { expenses, addExpense, updateExpense, duplicateExpense, deleteExpenses } = useCatExpenseData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null)

  const topCategories = getTopCategories(expenses);

  function handleEditExpense(id: string) {
    const found = expenses.find((e) => e.id === id) ?? null;
    setCurrentExpense(found);
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setCurrentExpense(null);
  }

  function handleModalSubmit(values: Omit<Expense, 'id'>) {
    if (currentExpense) {
      updateExpense(currentExpense.id, values);
    } else {
      addExpense(values);
    }
  }

  function handleDeleteSelected() {
    deleteExpenses(selectedIds);
    setSelectedIds([]);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-brand-900 text-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-5">
          <span className="text-2xl" aria-hidden="true">
            🐾
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Cat Expenses</h1>
            <p className="mt-0.5 text-xs text-brand-300">Track every purr-chase</p>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Expense Tracker</h2>
            {expenses.length > 0 && (
              <p className="mt-0.5 text-sm text-gray-500">
                {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} total
                {selectedIds.length > 0 && (
                  <span className="ml-2 font-medium text-brand-700">
                    · {selectedIds.length} selected
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                  clipRule="evenodd"
                />
              </svg>
              Delete{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setCurrentExpense(null);
                setIsModalOpen(true);
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Expense
            </Button>
          </div>
        </div>
        {topCategories.size > 0 && expenses.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
            <span className="text-base" aria-hidden="true">
              🏆
            </span>
            <span>
              Highest spending {topCategories.size === 1 ? 'category' : 'categories'}:{' '}
              <strong>{[...topCategories].join(' & ')}</strong>
            </span>
          </div>
        )}
        <ExpenseTable
          expenses={expenses}
          selectedIds={selectedIds}
          topCategories={topCategories}
          onSelectionChange={setSelectedIds}
          onEdit={handleEditExpense}
          onDuplicate={duplicateExpense}
        />
      </main>
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        currentExpense={currentExpense ?? undefined}
      />
    </div>
  );
}
