import { useEffect, useRef } from 'react'

interface ExpenseTableHeaderProps {
  totalCount: number
  selectedCount: number
  onToggleAll: (checked: boolean) => void
}

export function ExpenseTableHeader({
  totalCount,
  selectedCount,
  onToggleAll,
}: ExpenseTableHeaderProps) {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const isChecked = totalCount > 0 && selectedCount === totalCount
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  return (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        <th className="w-12 px-4 py-3.5">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={isChecked}
            disabled={totalCount === 0}
            onChange={(e) => onToggleAll(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-brand-700 focus:ring-brand-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Select all expenses"
          />
        </th>
        <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Item
        </th>
        <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Category
        </th>
        <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Amount
        </th>
        <th className="w-12 px-4 py-3.5" aria-label="Actions" />
      </tr>
    </thead>
  )
}
