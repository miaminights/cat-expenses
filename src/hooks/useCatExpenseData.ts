import { useState, useEffect } from 'react'

export type Category = 'Food' | 'Furniture' | 'Accessory'

export interface Expense {
  id: string
  name: string
  category: Category
  amount: number
}

const STORAGE_KEY = 'cat-expenses'

function loadFromStorage(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Expense[]
  } catch {
    return []
  }
}

export function useCatExpenseData() {
  const [expenses, setExpenses] = useState<Expense[]>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  function addExpense(values: Omit<Expense, 'id'>) {
    const newExpense: Expense = { ...values, id: crypto.randomUUID() }
    setExpenses((prev) => [...prev, newExpense])
  }

  function deleteExpenses(ids: string[]) {
    const idSet = new Set(ids)
    setExpenses((prev) => prev.filter((e) => !idSet.has(e.id)))
  }

  return { expenses, addExpense, deleteExpenses }
}
