import { useState } from 'react';
import type { Category, Expense } from '../hooks/useCatExpenseData';
import { Button } from './Button';
import { FormField } from './FormField';
import { Input } from './Input';
import { Select } from './Select';

export interface ExpenseFormValues {
  name: string;
  category: Category | '';
  amount: string;
}

export interface ExpenseFormErrors {
  name?: string;
  category?: string;
  amount?: string;
}

const CATEGORIES: Category[] = ['Food', 'Furniture', 'Accessory'];

interface ExpenseFormProps {
  onSubmit: (values: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Omit<Expense, 'id'>;
}

export function validateForm(values: ExpenseFormValues): ExpenseFormErrors {
  const errors: ExpenseFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Item name is required.';
  } else if (values.name.trim().length > 100) {
    errors.name = 'Item name must be 100 characters or fewer.';
  }

  if (!values.category) {
    errors.category = 'Please select a category.';
  }

  if (!values.amount.trim()) {
    errors.amount = 'Amount is required.';
  } else {
    const parsed = parseFloat(values.amount);

    if (isNaN(parsed)) {
      errors.amount = 'Please enter a valid number.';
    } else if (parsed <= 0) {
      errors.amount = 'Amount must be greater than zero.';
    }
  }

  return errors;
}

export function ExpenseForm({ onSubmit, onCancel, initialValues }: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>({
    name: initialValues?.name ?? '',
    category: initialValues?.category ?? '',
    amount: initialValues?.amount !== null ? String(initialValues?.amount ?? '') : '',
  });

  const [errors, setErrors] = useState<ExpenseFormErrors>({});

  function handleChange(field: keyof ExpenseFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      name: values.name.trim(),
      category: values.category as Category,
      amount: parseFloat(values.amount),
    });

    setValues({ name: '', category: '', amount: '' });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField label="Item Name" error={errors.name} htmlFor="expense-name">
        <Input
          id="expense-name"
          type="text"
          placeholder="e.g. Whiskers Cat Food"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          hasError={!!errors.name}
          autoFocus
        />
      </FormField>

      <FormField label="Category" error={errors.category} htmlFor="expense-category">
        <div className="relative">
          <Select
            id="expense-category"
            value={values.category}
            onChange={(e) => handleChange('category', e.target.value)}
            hasError={!!errors.category}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </FormField>

      <FormField label="Amount" error={errors.amount} htmlFor="expense-amount">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">$</span>
          <Input
            id="expense-amount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={values.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            hasError={!!errors.amount}
            className="pl-7"
          />
        </div>
      </FormField>

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {initialValues ? 'Save Changes' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}
