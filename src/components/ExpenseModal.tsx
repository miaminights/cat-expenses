import { useEffect } from 'react';

import type { Expense } from '../hooks/useCatExpenseData';
import { useRandomCatFact } from '../hooks/useRandomCatFact';
import { ExpenseForm } from './ExpenseForm';
import { Modal } from './Modal';

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
    if (isOpen) fetchFact();
  }, [isOpen, fetchFact]);

  function handleSubmit(values: Omit<Expense, 'id'>) {
    onSubmit(values);
    onClose();
  }

  const modalTitle = isEditing ? 'Edit Expense' : 'Add Expense';
  const modalSubtitle = isEditing ? 'Update this expense' : 'Track a new cat-related purchase';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} subtitle={modalSubtitle} titleId="expense-modal-title">
      <div className="border-b border-brand-100 bg-brand-50 px-6 py-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-800">Random Cat Fact</p>
        <div
          tabIndex={0}
          className="min-h-10 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          aria-label={isLoading ? 'Loading a cat fact' : fact ? `Random Cat Fact: ${fact}` : 'No cat fact available'}
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
    </Modal>
  );
}
