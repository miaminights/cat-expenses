import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach,describe, expect, it, vi } from 'vitest';

import { CurrencySelector } from '../CurrencySelector';
import { IntlContext } from '../IntlProvider';

vi.mock('../../utils/intlUtils', () => ({
  getCurrencyOptions: () => [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
  ],
}));

const mockSetCurrency = vi.fn();

function renderWithContext(currency = 'USD') {
  return render(
    <IntlContext.Provider
      value={{
        currency,
        setCurrency: mockSetCurrency,
        locale: 'en-US',
        formatCurrency: (n) => `$${n.toFixed(2)}`,
      }}
    >
      <CurrencySelector />
    </IntlContext.Provider>,
  );
}

describe('CurrencySelector', () => {
  beforeEach(() => {
    mockSetCurrency.mockClear();
  });

  it('renders a select with the correct aria-label', () => {
    renderWithContext();
    expect(screen.getByRole('combobox', { name: 'Select currency' })).toBeInTheDocument();
  });

  it('shows the current currency from context as the selected value', () => {
    renderWithContext('EUR');
    expect(screen.getByRole('combobox', { name: 'Select currency' })).toHaveValue('EUR');
  });

  it('renders an option for each entry returned by getCurrencyOptions', () => {
    renderWithContext();
    expect(screen.getByRole('option', { name: 'USD ($)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'EUR (€)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'GBP (£)' })).toBeInTheDocument();
  });

  it('calls setCurrency with the new value when the user changes the selection', async () => {
    renderWithContext();
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Select currency' }),
      'EUR',
    );
    expect(mockSetCurrency).toHaveBeenCalledWith('EUR');
  });

  it('calls setCurrency only once per selection change', async () => {
    renderWithContext();
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Select currency' }),
      'GBP',
    );
    expect(mockSetCurrency).toHaveBeenCalledTimes(1);
  });

  it('renders the chevron icon as aria-hidden', () => {
    const { container } = renderWithContext();
    const chevron = container.querySelector('svg[aria-hidden="true"]');
    expect(chevron).toBeInTheDocument();
  });
});
