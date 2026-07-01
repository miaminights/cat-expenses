import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ExpenseModal } from '../ExpenseModal';
import type { Expense } from '../../hooks/useCatExpenseData';
import { useRandomCatFact } from '../../hooks/useRandomCatFact';

vi.mock('../../hooks/useRandomCatFact');

const mockFetchFact = vi.fn();

beforeEach(() => {
  mockFetchFact.mockClear();
  vi.mocked(useRandomCatFact).mockReturnValue({
    fact: null,
    isLoading: false,
    error: null,
    fetchFact: mockFetchFact,
  });
});

// ─── Visibility ───────────────────────────────────────────────────────────────

describe('ExpenseModal visibility', () => {
  it('renders nothing when isOpen is false', () => {
    render(<ExpenseModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog when isOpen is true', () => {
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

// ─── Title / mode ─────────────────────────────────────────────────────────────

describe('ExpenseModal title', () => {
  it('shows "Add Expense" heading when no currentExpense is provided', () => {
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Add Expense' })).toBeInTheDocument();
  });

  it('shows "Edit Expense" heading when currentExpense is provided', () => {
    const expense: Expense = { id: '1', name: 'Cat Toy', category: 'Accessory', amount: 10 };
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} currentExpense={expense} />);
    expect(screen.getByRole('heading', { name: 'Edit Expense' })).toBeInTheDocument();
  });

  it('pre-fills fields and shows "Save Changes" button in Edit mode', () => {
    const expense: Expense = { id: '1', name: 'Cat Toy', category: 'Accessory', amount: 10 };
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} currentExpense={expense} />);
    expect(screen.getByLabelText('Item Name')).toHaveValue('Cat Toy');
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });
});

// ─── Close behaviour ──────────────────────────────────────────────────────────

describe('ExpenseModal close behaviour', () => {
  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<ExpenseModal isOpen={true} onClose={onClose} onSubmit={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<ExpenseModal isOpen={true} onClose={onClose} onSubmit={vi.fn()} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});

// ─── Cat fact states ──────────────────────────────────────────────────────────

describe('ExpenseModal cat fact', () => {
  it('shows the loading indicator while the cat fact is being fetched', () => {
    vi.mocked(useRandomCatFact).mockReturnValue({
      fact: null,
      isLoading: true,
      error: null,
      fetchFact: mockFetchFact,
    });
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Loading a cat fact…')).toBeInTheDocument();
  });

  it('shows the cat fact once it has loaded', () => {
    vi.mocked(useRandomCatFact).mockReturnValue({
      fact: 'Cats sleep 16 hours a day.',
      isLoading: false,
      error: null,
      fetchFact: mockFetchFact,
    });
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Cats sleep 16 hours a day.')).toBeInTheDocument();
  });

  it('shows an error message when the cat fact fails to load', () => {
    vi.mocked(useRandomCatFact).mockReturnValue({
      fact: null,
      isLoading: false,
      error: 'Could not load a cat fact right now.',
      fetchFact: mockFetchFact,
    });
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Could not load a cat fact right now.')).toBeInTheDocument();
  });

  it('calls fetchFact when the modal opens', () => {
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(mockFetchFact).toHaveBeenCalledOnce();
  });
});

// ─── Form submission ──────────────────────────────────────────────────────────

describe('ExpenseModal form submission', () => {
  it('calls onSubmit and onClose after a valid submission in Add mode', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ExpenseModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Item Name'), 'Cat Food');
    await user.selectOptions(screen.getByLabelText('Category'), 'Food');
    await user.type(screen.getByLabelText('Amount'), '25.00');
    await user.click(screen.getByRole('button', { name: 'Add Expense' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Cat Food', category: 'Food', amount: 25 });
    expect(onClose).toHaveBeenCalledOnce();
  });
});

// ─── Body scroll lock ─────────────────────────────────────────────────────────

describe('ExpenseModal scroll lock', () => {
  it('adds overflow-hidden to body when the modal opens', () => {
    render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(document.body.classList).toContain('overflow-hidden');
  });

  it('removes overflow-hidden from body when the modal closes', () => {
    const { rerender } = render(<ExpenseModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    rerender(<ExpenseModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(document.body.classList).not.toContain('overflow-hidden');
  });
});
