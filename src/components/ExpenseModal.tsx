import type { Expense } from '../hooks/useCatExpenseData';
import { ExpenseForm } from './ExpenseForm';
import { Modal } from './Modal';
import { RandomCatFact } from './RandomCatFact';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Expense, 'id'>) => void;
  currentExpense?: Expense;
}

export function ExpenseModal({ isOpen, onClose, onSubmit, currentExpense }: ExpenseModalProps) {
  const isEditing = !!currentExpense;

  function handleSubmit(values: Omit<Expense, 'id'>) {
    onSubmit(values);
    onClose();
  }

  const modalTitle = isEditing ? 'Edit Expense' : 'Add Expense';
  const modalSubtitle = isEditing ? 'Update this expense' : 'Track a new cat-related purchase';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} subtitle={modalSubtitle} titleId="expense-modal-title">
      <RandomCatFact />
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
