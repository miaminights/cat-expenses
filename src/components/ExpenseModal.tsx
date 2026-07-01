import { useEffect } from 'react'
import type { Expense } from '../hooks/useCatExpenseData'
import { useRandomCatFact } from '../hooks/useRandomCatFact'
import { ExpenseForm } from './ExpenseForm'

interface ExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: Omit<Expense, 'id'>) => void
}

export function ExpenseModal({ isOpen, onClose, onSubmit }: ExpenseModalProps) {
  const { fact, isLoading, error, fetchFact } = useRandomCatFact()

  useEffect(() => {
    if (isOpen) {
      fetchFact()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, fetchFact])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(values: Omit<Expense, 'id'>) {
    onSubmit(values)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add Expense"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Expense</h2>
            <p className="text-sm text-gray-500 mt-0.5">Track a new cat-related purchase</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Cat fact banner */}
        <div className="px-6 py-4 bg-brand-50 border-b border-brand-100">
          <p className="text-xs font-semibold text-brand-800 uppercase tracking-wider mb-1">
            Random Cat Fact
          </p>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-brand-700">
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Loading a cat fact…
            </div>
          )}
          {error && <p className="text-sm text-red-600 italic">{error}</p>}
          {fact && <p className="text-sm text-brand-900 italic leading-relaxed">{fact}</p>}
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <ExpenseForm onSubmit={handleSubmit} onCancel={onClose} />
        </div>
      </div>
    </div>
  )
}
