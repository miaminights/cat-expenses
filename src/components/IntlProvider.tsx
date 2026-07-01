import Cookies from 'js-cookie';
import type { ReactNode } from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';

const CURRENCY_COOKIE = 'preferred_currency';

type LocaleWithCurrencies = Intl.Locale & { getCurrencies?: () => string[] };

function detectCurrency(locale: string): string {
  try {
    const localeObj = new Intl.Locale(locale) as LocaleWithCurrencies;
    const currencies = localeObj.getCurrencies?.();
    if (currencies?.[0]) return currencies[0];
  } catch {
    // fall through to default
  }
  return 'USD';
}

interface IntlContextValue {
  formatCurrency: (amount: number) => string;
  currency: string;
  locale: string;
  setCurrency: (currency: string) => void;
}

const defaultFormatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

export const IntlContext = createContext<IntlContextValue>({
  formatCurrency: defaultFormatCurrency,
  currency: 'USD',
  locale: 'en-US',
  setCurrency: () => {},
});

export function IntlProvider({ children }: { children: ReactNode }) {
  const locale = navigator.language ?? 'en-US';
  const [currency, setCurrencyState] = useState(() => Cookies.get(CURRENCY_COOKIE) ?? detectCurrency(locale));

  const setCurrency = useCallback((newCurrency: string) => {
    Cookies.set(CURRENCY_COOKIE, newCurrency, { expires: 365 });
    setCurrencyState(newCurrency);
  }, []);

  const value = useMemo(() => {
    const currencyFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });
    return {
      locale,
      currency,
      formatCurrency: (amount: number) => currencyFormatter.format(amount),
      setCurrency,
    };
  }, [locale, currency, setCurrency]);

  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
}
