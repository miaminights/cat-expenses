import type { Expense } from '../hooks/useCatExpenseData'
import { formatCurrency } from '../utils/categoryUtils'

const CATEGORY_BADGES: Record<Expense['category'], string> = {
  Food: 'bg-orange-100 text-orange-700',
  Furniture: 'bg-blue-100 text-blue-700',
  Accessory: 'bg-purple-100 text-purple-700',
}

interface ExpenseTableRowProps {
  expense: Expense
  isSelected: boolean
  isTopCategory: boolean
  onToggle: (id: string) => void
}

export function ExpenseTableRow({
  expense,
  isSelected,
  isTopCategory,
  onToggle,
}: ExpenseTableRowProps) {
  return (
    <tr
      className={[
        'border-b border-gray-100 transition-colors',
        isTopCategory
          ? 'bg-brand-50 hover:bg-brand-100'
          : isSelected
            ? 'bg-gray-50 hover:bg-gray-100'
            : 'bg-white hover:bg-gray-50',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <td className="w-12 px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(expense.id)}
          className="w-4 h-4 rounded border-gray-300 text-brand-700 focus:ring-brand-600 cursor-pointer"
          aria-label={`Select ${expense.name}`}
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{expense.name}</span>
          {isTopCategory && (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-brand-800 bg-brand-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider"
              title="Top spending category"
            >
              Top
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <span
          className={[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            CATEGORY_BADGES[expense.category],
          ].join(' ')}
        >
          {expense.category}
        </span>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="text-sm font-semibold text-gray-900 tabular-nums">
          {formatCurrency(expense.amount)}
        </span>
      </td>
    </tr>
  )
}
