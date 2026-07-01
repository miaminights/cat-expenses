import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ExpenseForm, validateForm } from '../ExpenseForm';

// ─── validateForm (pure function) ─────────────────────────────────────────────

describe('validateForm', () => {
  it('returns no errors for a fully valid form', () => {
    expect(validateForm({ name: 'Cat Toy', category: 'Accessory', amount: '9.99' })).toEqual({});
  });

  it('requires a non-empty name', () => {
    expect(validateForm({ name: '', category: 'Food', amount: '10' })).toMatchObject({
      name: 'Item name is required.',
    });
  });

  it('trims whitespace before checking name', () => {
    expect(validateForm({ name: '   ', category: 'Food', amount: '10' })).toMatchObject({
      name: 'Item name is required.',
    });
  });

  it('rejects names longer than 100 characters', () => {
    expect(validateForm({ name: 'a'.repeat(101), category: 'Food', amount: '10' })).toMatchObject({
      name: 'Item name must be 100 characters or fewer.',
    });
  });

  it('requires a category to be selected', () => {
    expect(validateForm({ name: 'Cat Toy', category: '', amount: '10' })).toMatchObject({
      category: 'Please select a category.',
    });
  });

  it('requires a non-empty amount', () => {
    expect(validateForm({ name: 'Cat Toy', category: 'Food', amount: '' })).toMatchObject({
      amount: 'Amount is required.',
    });
  });

  it('rejects non-numeric amount input', () => {
    expect(validateForm({ name: 'Cat Toy', category: 'Food', amount: 'abc' })).toMatchObject({
      amount: 'Please enter a valid number.',
    });
  });

  it('rejects a zero amount', () => {
    expect(validateForm({ name: 'Cat Toy', category: 'Food', amount: '0' })).toMatchObject({
      amount: 'Amount must be greater than zero.',
    });
  });

  it('rejects a negative amount', () => {
    expect(validateForm({ name: 'Cat Toy', category: 'Food', amount: '-5' })).toMatchObject({
      amount: 'Amount must be greater than zero.',
    });
  });

  it('returns errors for all invalid fields simultaneously', () => {
    const errors = validateForm({ name: '', category: '', amount: '' });
    expect(errors.name).toBeDefined();
    expect(errors.category).toBeDefined();
    expect(errors.amount).toBeDefined();
  });
});

// ─── ExpenseForm component ─────────────────────────────────────────────────────

describe('ExpenseForm component', () => {
  const user = userEvent.setup();

  it('renders the Item Name, Category, and Amount fields', () => {
    render(<ExpenseForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('Item Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  it('shows all three errors when submitted empty', async () => {
    render(<ExpenseForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Add Expense' }));

    expect(screen.getByText('Item name is required.')).toBeInTheDocument();
    expect(screen.getByText('Please select a category.')).toBeInTheDocument();
    expect(screen.getByText('Amount is required.')).toBeInTheDocument();
  });

  it('clears the error for a field as soon as it is typed into', async () => {
    render(<ExpenseForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Add Expense' }));
    expect(screen.getByText('Item name is required.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Item Name'), 'Cat Bed');
    expect(screen.queryByText('Item name is required.')).not.toBeInTheDocument();
  });

  it('calls onSubmit with the correct parsed values on a valid submission', async () => {
    const onSubmit = vi.fn();
    render(<ExpenseForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Item Name'), 'Whiskers Cat Food');
    await user.selectOptions(screen.getByLabelText('Category'), 'Food');
    await user.type(screen.getByLabelText('Amount'), '25.50');
    await user.click(screen.getByRole('button', { name: 'Add Expense' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Whiskers Cat Food',
      category: 'Food',
      amount: 25.5,
    });
  });

  it('trims leading/trailing whitespace from the name before submitting', async () => {
    const onSubmit = vi.fn();
    render(<ExpenseForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Item Name'), '  Cat Toy  ');
    await user.selectOptions(screen.getByLabelText('Category'), 'Accessory');
    await user.type(screen.getByLabelText('Amount'), '10');
    await user.click(screen.getByRole('button', { name: 'Add Expense' }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Cat Toy' }));
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn();
    render(<ExpenseForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Add Expense' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when the Cancel button is clicked', async () => {
    const onCancel = vi.fn();
    render(<ExpenseForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('resets the form fields after a successful submission', async () => {
    render(<ExpenseForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Item Name'), 'Cat Toy');
    await user.selectOptions(screen.getByLabelText('Category'), 'Accessory');
    await user.type(screen.getByLabelText('Amount'), '10');
    await user.click(screen.getByRole('button', { name: 'Add Expense' }));

    expect(screen.getByLabelText('Item Name')).toHaveValue('');
    expect(screen.getByLabelText('Category')).toHaveValue('');
    expect(screen.getByLabelText('Amount')).toHaveValue('');
  });
});
