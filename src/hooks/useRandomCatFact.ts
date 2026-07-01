import { useCallback,useState } from 'react';

interface CatFactState {
  fact: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useRandomCatFact() {
  const [state, setState] = useState<CatFactState>({
    fact: null,
    isLoading: false,
    error: null,
  });

  const fetchFact = useCallback(async () => {
    setState({ fact: null, isLoading: true, error: null });
    try {
      const response = await fetch('https://catfact.ninja/fact');
      if (!response.ok) throw new Error('Failed to fetch cat fact');
      const data = (await response.json()) as { fact: string };
      setState({ fact: data.fact, isLoading: false, error: null });
    } catch {
      setState({
        fact: null,
        isLoading: false,
        error: 'Could not load a cat fact right now.',
      });
    }
  }, []);

  return { ...state, fetchFact };
}
