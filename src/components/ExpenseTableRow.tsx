import type { Expense } from '../hooks/useCatExpenseData';
import { formatCurrency } from '../utils/categoryUtils';
import clsx from 'clsx';

const CATEGORY_BADGES: Record<Expense['category'], string> = {
  Food: 'bg-orange-100 text-orange-700',
  Furniture: 'bg-blue-100 text-blue-700',
  Accessory: 'bg-purple-100 text-purple-700',
};

interface ExpenseTableRowProps {
  expense: Expense;
  isSelected: boolean;
  isTopCategory: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ExpenseTableRow({
  expense,
  isSelected,
  isTopCategory,
  onToggle,
  onEdit,
}: ExpenseTableRowProps) {
  return (
    <tr
      className={clsx('border-b border-gray-100 transition-colors', {
        'bg-brand-50 hover:bg-brand-100': isTopCategory,
        'bg-gray-50 hover:bg-gray-100': isSelected && !isTopCategory,
        'bg-white hover:bg-gray-50': !isSelected && !isTopCategory,
      })}
    >
      <td className="w-12 px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(expense.id)}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-brand-700 focus:ring-brand-600"
          aria-label={`Select ${expense.name}`}
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{expense.name}</span>
          {isTopCategory && (
            <span
              className="inline-flex items-center gap-0.5 rounded-full bg-brand-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-800"
              title="Top spending category"
            >
              Top
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <span
          className={clsx(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            CATEGORY_BADGES[expense.category],
          )}
        >
          {expense.category}
        </span>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="text-sm font-semibold tabular-nums text-gray-900">
          {formatCurrency(expense.amount)}
        </span>
      </td>
      <td className="w-12 px-4 py-4 text-right">
        <button
          onClick={() => onEdit(expense.id)}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
          aria-label={`Edit ${expense.name}`}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
