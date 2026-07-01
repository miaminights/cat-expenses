export interface CurrencyOption {
  value: string;
  label: string;
}

type IntlWithSupportedValuesOf = typeof Intl & { supportedValuesOf: (key: string) => string[] };

export function getCurrencySymbol(currency: string): string {
  const symbol =
    new Intl.NumberFormat('en', { style: 'currency', currency, currencyDisplay: 'narrowSymbol' })
      .formatToParts(1)
      .find((p) => p.type === 'currency')?.value ?? '$';

  return symbol;
}

export function getCurrencyOptions(): CurrencyOption[] {
  return (Intl as IntlWithSupportedValuesOf).supportedValuesOf('currency').map((currency) => {
    const symbol = getCurrencySymbol(currency);

    return { value: currency, label: `${currency} (${symbol})` };
  });
}
