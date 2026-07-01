import { useContext, useMemo } from 'react';
import { IntlContext } from './IntlProvider';
import { getCurrencyOptions } from '../utils/intlUtils';

export function CurrencySelector() {
  const { currency, setCurrency } = useContext(IntlContext);
  const options = useMemo(() => getCurrencyOptions(), []);

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        aria-label="Select currency"
        className="inline-flex cursor-pointer appearance-none items-center rounded-xl border border-brand-800 bg-transparent py-2.5 pl-5 pr-10 text-sm font-semibold text-brand-800 transition-colors duration-150 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 [field-sizing:content]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-800"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
