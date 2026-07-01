import clsx from 'clsx';
import type { Expense } from '../hooks/useCatExpenseData';
import { formatCurrency } from '../utils/categoryUtils';
import { Button } from './Button';
import { Modal } from './Modal';

const CATEGORY_BADGES: Record<Expense['category'], string> = {
  Food: 'bg-orange-100 text-orange-700',
  Furniture: 'bg-blue-100 text-blue-700',
  Accessory: 'bg-purple-100 text-purple-700',
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenses: Expense[];
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, expenses }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete expenses" titleId="delete-modal-title">
      <div className="px-6 pt-4 pb-2">
        <p className="text-sm text-gray-500">
          The following {expenses.length === 1 ? 'expense' : 'expenses'} will be permanently deleted.
        </p>
      </div>
      <ul className="flex max-h-[540px] flex-col gap-2 overflow-y-auto px-6 py-2">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{expense.name}</span>
              <span
                className={clsx(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  CATEGORY_BADGES[expense.category],
                )}
              >
                {expense.category}
              </span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-gray-900">
              {formatCurrency(expense.amount)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex gap-3 border-t border-gray-100 px-6 py-5">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} className="flex-1">
          Delete
        </Button>
      </div>
    </Modal>
  );
}
