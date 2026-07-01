import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ExpenseTableHeader } from '../ExpenseTableHeader'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <table>{children}</table>
)

describe('ExpenseTableHeader', () => {
  it('renders the Item, Category, and Amount column headings', () => {
    render(<ExpenseTableHeader totalCount={0} selectedCount={0} onToggleAll={vi.fn()} />, { wrapper })
    expect(screen.getByText('Item')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
  })

  it('checkbox is unchecked when no expenses are selected', () => {
    render(<ExpenseTableHeader totalCount={3} selectedCount={0} onToggleAll={vi.fn()} />, { wrapper })
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    expect((checkbox as HTMLInputElement).indeterminate).toBe(false)
  })

  it('checkbox is checked when all expenses are selected', () => {
    render(<ExpenseTableHeader totalCount={3} selectedCount={3} onToggleAll={vi.fn()} />, { wrapper })
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('checkbox is indeterminate when some but not all are selected', () => {
    render(<ExpenseTableHeader totalCount={3} selectedCount={1} onToggleAll={vi.fn()} />, { wrapper })
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true)
  })

  it('checkbox is disabled when there are no expenses', () => {
    render(<ExpenseTableHeader totalCount={0} selectedCount={0} onToggleAll={vi.fn()} />, { wrapper })
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('calls onToggleAll(true) when the unchecked checkbox is clicked', async () => {
    const onToggleAll = vi.fn()
    render(<ExpenseTableHeader totalCount={3} selectedCount={0} onToggleAll={onToggleAll} />, { wrapper })
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggleAll).toHaveBeenCalledWith(true)
  })

  it('calls onToggleAll(false) when the checked checkbox is clicked', async () => {
    const onToggleAll = vi.fn()
    render(<ExpenseTableHeader totalCount={3} selectedCount={3} onToggleAll={onToggleAll} />, { wrapper })
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggleAll).toHaveBeenCalledWith(false)
  })
})
