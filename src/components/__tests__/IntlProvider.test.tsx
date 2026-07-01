import { act,render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach,describe, expect, it, vi } from 'vitest';

import { IntlContext, IntlProvider } from '../IntlProvider';

const { mockGet, mockSet } = vi.hoisted(() => ({
  mockGet: vi.fn<(name: string) => string | undefined>(),
  mockSet: vi.fn<() => void>(),
}));

vi.mock('js-cookie', () => ({
  default: { get: mockGet, set: mockSet },
}));

function TestConsumer() {
  const { currency, setCurrency, formatCurrency } = useContext(IntlContext);
  return (
    <div>
      <span data-testid="currency">{currency}</span>
      <span data-testid="formatted">{formatCurrency(10)}</span>
      <button onClick={() => setCurrency('EUR')}>Set EUR</button>
      <button onClick={() => setCurrency('GBP')}>Set GBP</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <IntlProvider>
      <TestConsumer />
    </IntlProvider>,
  );
}

describe('IntlProvider — initial currency', () => {
  beforeEach(() => {
    mockGet.mockReturnValue(undefined);
  });

  it('falls back to USD when no cookie is set and locale detection returns no currency', () => {
    renderWithProvider();
    expect(screen.getByTestId('currency').textContent).toBe('USD');
  });

  it('uses the cookie value as the initial currency when a cookie is present', () => {
    mockGet.mockReturnValue('EUR');
    renderWithProvider();
    expect(screen.getByTestId('currency').textContent).toBe('EUR');
  });

  it('reads the cookie with the correct key', () => {
    renderWithProvider();
    expect(mockGet).toHaveBeenCalledWith('preferred_currency');
  });
});

describe('IntlProvider — setCurrency', () => {
  beforeEach(() => {
    mockGet.mockReturnValue(undefined);
    mockSet.mockClear();
  });

  it('updates the currency value in context', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByRole('button', { name: 'Set EUR' }).click();
    });
    expect(screen.getByTestId('currency').textContent).toBe('EUR');
  });

  it('writes the new currency to the cookie with a 365-day expiry', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByRole('button', { name: 'Set EUR' }).click();
    });
    expect(mockSet).toHaveBeenCalledWith('preferred_currency', 'EUR', { expires: 365 });
  });

  it('updates the cookie when the currency is changed a second time', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByRole('button', { name: 'Set EUR' }).click();
    });
    await act(async () => {
      screen.getByRole('button', { name: 'Set GBP' }).click();
    });
    expect(mockSet).toHaveBeenLastCalledWith('preferred_currency', 'GBP', { expires: 365 });
    expect(screen.getByTestId('currency').textContent).toBe('GBP');
  });
});

describe('IntlProvider — detectCurrency', () => {
  const localeProto = Intl.Locale.prototype as Record<string, unknown>;
  let originalGetCurrencies: unknown;
  let originalLanguage: string;

  beforeEach(() => {
    mockGet.mockReturnValue(undefined);
    originalLanguage = navigator.language;
    originalGetCurrencies = localeProto.getCurrencies;
    localeProto.getCurrencies = vi.fn().mockReturnValue(['EUR']);
    Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true, writable: true });
  });

  afterEach(() => {
    localeProto.getCurrencies = originalGetCurrencies;
    Object.defineProperty(navigator, 'language', { value: originalLanguage, configurable: true, writable: true });
  });

  it('uses the first currency returned by getCurrencies() when available', () => {
    renderWithProvider();
    expect(screen.getByTestId('currency').textContent).toBe('EUR');
  });
});

describe('IntlProvider — formatCurrency', () => {
  beforeEach(() => {
    mockGet.mockReturnValue(undefined);
  });

  it('formats amounts using the active currency', async () => {
    renderWithProvider();
    // Default is USD — $10.00
    expect(screen.getByTestId('formatted').textContent).toBe('$10.00');

    await act(async () => {
      screen.getByRole('button', { name: 'Set EUR' }).click();
    });
    // After switching to EUR the symbol and format change
    expect(screen.getByTestId('formatted').textContent).not.toBe('$10.00');
    expect(screen.getByTestId('formatted').textContent).toContain('10');
  });
});
