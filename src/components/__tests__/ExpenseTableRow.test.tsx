import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { Expense } from '../../hooks/useCatExpenseData';
import { ExpenseTableRow } from '../ExpenseTableRow';

// <tr> must live inside <table><tbody>
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
);

const expense: Expense = { id: '1', name: 'Cat Food', category: 'Food', amount: 25 };

describe('ExpenseTableRow', () => {
  it('renders the expense name, category badge, and formatted amount', () => {
    render(
      <ExpenseTableRow
        expense={expense}
        isSelected={false}
        isTopCategory={false}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.getByText('Cat Food')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  it('shows the TOP badge when isTopCategory is true', () => {
    render(
      <ExpenseTableRow
        expense={expense}
        isSelected={false}
        isTopCategory={true}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.getByText('Top')).toBeInTheDocument();
  });

  it('does not show the TOP badge when isTopCategory is false', () => {
    render(
      <ExpenseTableRow
        expense={expense}
        isSelected={false}
        isTopCategory={false}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.queryByText('Top')).not.toBeInTheDocument();
  });

  it('applies the highlight class when isTopCategory is true', () => {
    const { container } = render(
      <ExpenseTableRow
        expense={expense}
        isSelected={false}
        isTopCategory={true}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
      />,
      { wrapper },
    );
    expect(container.querySelector('tr')).toHaveClass('bg-brand-50');
  });

  it('does not apply the highlight class when isTopCategory is false', () => {
    const { container } = render(
      <ExpenseTableRow
        expense={expense}
        isSelected={false}
        isTopCategory={false}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
      />,
      { wrapper },
    );
    expect(container.querySelector('tr')).not.toHaveClass('bg-brand-50');
  });

  it('renders the checkbox as checked when isSelected is true', () => {
    render(
      <ExpenseTableRow
        expense={expense}
        isSelected={true}
        isTopCategory={false}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders the checkbox as unchecked when isSelected is false', () => {
    render(
      <ExpenseTableRow
        expense={expense}
        isSelected={false}
        isTopCategory={false}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onToggle with the expense id when the checkbox is clicked', async () => {
    const onToggle = vi.fn();
    render(
      <ExpenseTableRow
        expense={expense}
        isSelected={false}
        isTopCategory={false}
        onToggle={onToggle}
        onEdit={vi.fn()}
      />,
      { wrapper },
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledOnce();
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});
