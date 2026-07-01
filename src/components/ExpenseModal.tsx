import { useEffect } from 'react';
import type { Expense } from '../hooks/useCatExpenseData';
import { useRandomCatFact } from '../hooks/useRandomCatFact';
import { AutoFocus } from './AutoFocus';
import { ExpenseForm } from './ExpenseForm';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Expense, 'id'>) => void;
  currentExpense?: Expense;
}

export function ExpenseModal({ isOpen, onClose, onSubmit, currentExpense }: ExpenseModalProps) {
  const isEditing = !!currentExpense;
  const { fact, isLoading, error, fetchFact } = useRandomCatFact();

  useEffect(() => {
    if (isOpen) {
      fetchFact();
      document.body.classList.add('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, fetchFact]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    if (isOpen) document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(values: Omit<Expense, 'id'>) {
    onSubmit(values);
    onClose();
  }

  const modalTitle = isEditing ? 'Edit Expense' : 'Add Expense';
  const modalSubtitle = isEditing ? 'Update this expense' : 'Track a new cat-related purchase';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <AutoFocus>
        {(ref) => (
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-modal-title"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl focus:outline-none"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div aria-label={`${modalTitle}, ${modalSubtitle}`}>
                <h2 id="expense-modal-title" className="text-lg font-semibold text-gray-900">
                  {modalTitle}
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">{modalSubtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <div className="border-b border-brand-100 bg-brand-50 px-6 py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-800">Random Cat Fact</p>
              <div
                tabIndex={0}
                className="min-h-10 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                aria-label={
                  isLoading ? 'Loading a cat fact' : fact ? `Random Cat Fact: ${fact}` : 'No cat fact available'
                }
              >
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-brand-700">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Loading a cat fact…
                  </div>
                )}
                {error && <p className="text-sm italic text-red-600">{error}</p>}
                {fact && <p className="animate-fade-in text-sm italic leading-relaxed text-brand-900">{fact}</p>}
              </div>
            </div>
            <div className="px-6 py-6">
              <ExpenseForm
                onSubmit={handleSubmit}
                onCancel={onClose}
                initialValues={
                  currentExpense
                    ? {
                        name: currentExpense.name,
                        category: currentExpense.category,
                        amount: currentExpense.amount,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        )}
      </AutoFocus>
    </div>
  );
}
