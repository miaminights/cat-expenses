import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import type { Expense } from '../../hooks/useCatExpenseData';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

const catFood: Expense = { id: '1', name: 'Cat Food', category: 'Food', amount: 10 };
const catToy: Expense = { id: '2', name: 'Cat Toy', category: 'Accessory', amount: 9.99 };
const catBed: Expense = { id: '3', name: 'Cat Bed', category: 'Furniture', amount: 80 };

describe('DeleteConfirmModal visibility', () => {
  it('renders nothing when isOpen is false', () => {
    render(<DeleteConfirmModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood]} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog when isOpen is true', () => {
    render(<DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood]} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows the "Delete expenses" heading', () => {
    render(<DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood]} />);
    expect(screen.getByRole('heading', { name: 'Delete expenses' })).toBeInTheDocument();
  });
});

describe('DeleteConfirmModal description', () => {
  it('uses singular "expense" when one expense is selected', () => {
    render(<DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood]} />);
    expect(screen.getByText('The following expense will be permanently deleted.')).toBeInTheDocument();
  });

  it('uses plural "expenses" when multiple expenses are selected', () => {
    render(<DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood, catToy]} />);
    expect(screen.getByText('The following expenses will be permanently deleted.')).toBeInTheDocument();
  });
});

describe('DeleteConfirmModal expense list', () => {
  it('renders a row for each selected expense', () => {
    render(
      <DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood, catToy, catBed]} />,
    );
    expect(screen.getByText('Cat Food')).toBeInTheDocument();
    expect(screen.getByText('Cat Toy')).toBeInTheDocument();
    expect(screen.getByText('Cat Bed')).toBeInTheDocument();
  });

  it('displays the category badge for each expense', () => {
    render(
      <DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood, catToy, catBed]} />,
    );
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Accessory')).toBeInTheDocument();
    expect(screen.getByText('Furniture')).toBeInTheDocument();
  });

  it('displays the formatted amount for each expense', () => {
    render(
      <DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood, catToy, catBed]} />,
    );
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('$80.00')).toBeInTheDocument();
  });

  it('each list item is keyboard-focusable', () => {
    render(<DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood, catToy]} />);
    const items = screen.getAllByRole('listitem');
    items.forEach((item) => expect(item).toHaveAttribute('tabindex', '0'));
  });

  it('each list item has an aria-label of "name, category, amount"', () => {
    render(
      <DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} expenses={[catFood, catToy, catBed]} />,
    );
    expect(screen.getByRole('listitem', { name: 'Cat Food, Food, $10.00' })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: 'Cat Toy, Accessory, $9.99' })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: 'Cat Bed, Furniture, $80.00' })).toBeInTheDocument();
  });
});

describe('DeleteConfirmModal callbacks', () => {
  it('calls onClose when the Cancel button is clicked', async () => {
    const onClose = vi.fn();
    render(<DeleteConfirmModal isOpen={true} onClose={onClose} onConfirm={vi.fn()} expenses={[catFood]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onConfirm when the Delete button is clicked', async () => {
    const onConfirm = vi.fn();
    render(<DeleteConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={onConfirm} expenses={[catFood]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onClose when the X close button is clicked', async () => {
    const onClose = vi.fn();
    render(<DeleteConfirmModal isOpen={true} onClose={onClose} onConfirm={vi.fn()} expenses={[catFood]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
