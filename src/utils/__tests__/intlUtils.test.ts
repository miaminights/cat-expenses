import { describe, it, expect } from 'vitest';
import { getCurrencyOptions } from '../intlUtils';

describe('getCurrencyOptions', () => {
  it('returns an array of options', () => {
    const options = getCurrencyOptions();
    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBeGreaterThan(0);
  });

  it('includes a USD option', () => {
    const options = getCurrencyOptions();
    const usd = options.find((o) => o.value === 'USD');
    expect(usd).toBeDefined();
  });

  it('formats each option as "CODE (symbol)"', () => {
    const options = getCurrencyOptions();
    const usd = options.find((o) => o.value === 'USD');
    expect(usd?.label).toBe('USD ($)');
  });

  it('returns options with non-empty value and label', () => {
    const options = getCurrencyOptions();
    options.forEach((opt) => {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
    });
  });

  it('returns each currency code only once', () => {
    const options = getCurrencyOptions();
    const values = options.map((o) => o.value);
    expect(values.length).toBe(new Set(values).size);
  });
});
