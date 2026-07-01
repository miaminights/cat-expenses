import clsx from 'clsx';
import { useContext } from 'react';

import type { Expense } from '../hooks/useCatExpenseData';
import { IntlContext } from './IntlProvider';

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
  onDuplicate: (id: string) => void;
}

export function ExpenseTableRow({
  expense,
  isSelected,
  isTopCategory,
  onToggle,
  onEdit,
  onDuplicate,
}: ExpenseTableRowProps) {
  const { formatCurrency } = useContext(IntlContext);
  return (
    <tr
      className={clsx('border-b border-gray-100 transition-colors', {
        'bg-brand-50 hover:bg-brand-100': isTopCategory,
        'bg-gray-50 hover:bg-gray-100': isSelected && !isTopCategory,
        'bg-white hover:bg-gray-50': !isSelected && !isTopCategory,
      })}
    >
      <td className="w-12 px-4 py-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={isSelected}
          aria-label={`Select ${expense.name}. Category ${expense.category}. Expense amount ${formatCurrency(expense.amount)}`}
          onClick={() => onToggle(expense.id)}
          className={clsx(
            'flex h-4 w-4 items-center justify-center rounded border transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1',
            {
              'border-brand-700 bg-brand-700': isSelected,
              'border-gray-300 bg-white hover:border-brand-400': !isSelected,
            },
          )}
        >
          {isSelected && (
            <svg
              className="h-2.5 w-2.5 text-white"
              viewBox="0 0 10 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 4L3.5 7 9 1" />
            </svg>
          )}
        </button>
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
        <span className="text-sm font-semibold tabular-nums text-gray-900">{formatCurrency(expense.amount)}</span>
      </td>
      <td className="w-20 px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(expense.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
            aria-label={`Edit ${expense.name}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
            </svg>
          </button>
          <button
            onClick={() => onDuplicate(expense.id)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-700"
            aria-label={`Duplicate ${expense.name}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
              <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
