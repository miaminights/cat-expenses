import { useEffect } from 'react';

import { useFetch } from '../hooks/useFetch';

interface CatFact {
  fact: string;
}

const CAT_FACT_URL = 'https://catfact.ninja/fact';
const CAT_FACT_ERROR_MESSAGE = 'Could not load a cat fact right now.';

export function RandomCatFact() {
  const { data, isLoading, error, fetchData } = useFetch<CatFact>(CAT_FACT_URL, {
    errorMessage: CAT_FACT_ERROR_MESSAGE,
  });
  const fact = data?.fact ?? null;

  useEffect(() => {
    // Deferred a microtask so StrictMode's synchronous dev-only mount → cleanup
    // → remount cycle can cancel the throwaway first call before it ever
    // dispatches a real request, instead of firing (and aborting) two of them.
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void fetchData();
    });
    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  return (
    <div className="border-b border-brand-100 bg-brand-50 px-6 py-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-800">Random Cat Fact</p>
      <div
        tabIndex={0}
        className="min-h-10 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        aria-label={isLoading ? 'Loading a cat fact' : fact ? `Random Cat Fact: ${fact}` : 'No cat fact available'}
      >
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-brand-700">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading a cat fact…
          </div>
        )}
        {error && <p className="text-sm italic text-red-600">{error}</p>}
        {fact && <p className="animate-fade-in text-sm italic leading-relaxed text-brand-900">{fact}</p>}
      </div>
    </div>
  );
}
