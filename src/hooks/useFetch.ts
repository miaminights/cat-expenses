import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseFetchOptions {
  errorMessage?: string;
}

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

function isAbortError(err: unknown): boolean {
  return (err as { name?: string })?.name === 'AbortError';
}

export function useFetch<T>(url: string, options?: UseFetchOptions) {
  const errorMessage = options?.errorMessage ?? DEFAULT_ERROR_MESSAGE;
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({ data: null, isLoading: true, error: null });
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(errorMessage);
      const data = (await response.json()) as T;
      setState({ data, isLoading: false, error: null });
    } catch (err) {
      if (isAbortError(err)) return;
      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [url, errorMessage]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { ...state, fetchData };
}
