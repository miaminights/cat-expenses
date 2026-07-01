import clsx from 'clsx';

interface ExpenseTableHeaderProps {
  totalCount: number;
  selectedCount: number;
  onToggleAll: (checked: boolean) => void;
}

export function ExpenseTableHeader({ totalCount, selectedCount, onToggleAll }: ExpenseTableHeaderProps) {
  const isChecked = totalCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;
  const isFilled = isChecked || isIndeterminate;

  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        <th className="w-12 px-4 py-3.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={isIndeterminate ? 'mixed' : isChecked}
            aria-label="Select all expenses"
            disabled={totalCount === 0}
            onClick={() => onToggleAll(!isChecked)}
            className={clsx(
              'flex h-4 w-4 items-center justify-center rounded border transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isFilled ? 'border-brand-700 bg-brand-700' : 'border-gray-300 bg-white hover:border-brand-400',
            )}
          >
            {isChecked && (
              <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 4L3.5 7 9 1" />
              </svg>
            )}
            {isIndeterminate && (
              <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M1 1H9" />
              </svg>
            )}
          </button>
        </th>
        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Item</th>
        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
        <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
        <th className="w-12 px-4 py-3.5" aria-label="Actions" />
      </tr>
    </thead>
  );
}
