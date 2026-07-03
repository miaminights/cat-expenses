import { useCallback, useEffect, useRef, useState } from 'react';

interface CatFactState {
  fact: string | null;
  isLoading: boolean;
  error: string | null;
}

function isAbortError(err: unknown): boolean {
  return (err as { name?: string })?.name === 'AbortError';
}

export function useRandomCatFact() {
  const [state, setState] = useState<CatFactState>({
    fact: null,
    isLoading: false,
    error: null,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFact = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({ fact: null, isLoading: true, error: null });
    try {
      const response = await fetch('https://catfact.ninja/fact', { signal: controller.signal });
      if (!response.ok) throw new Error('Failed to fetch cat fact');
      const data = (await response.json()) as { fact: string };
      setState({ fact: data.fact, isLoading: false, error: null });
    } catch (err) {
      if (isAbortError(err)) return;
      setState({
        fact: null,
        isLoading: false,
        error: 'Could not load a cat fact right now.',
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { ...state, fetchFact };
}
