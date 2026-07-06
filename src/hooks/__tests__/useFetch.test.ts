import { act,renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useFetch } from '../useFetch';

interface TestData {
  value: string;
}

const TEST_URL = 'https://example.com/data';

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useFetch', () => {
  it('starts with no data, not loading, and no error', () => {
    const { result } = renderHook(() => useFetch<TestData>(TEST_URL));
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets isLoading to true immediately when fetchData is called', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
    const { result } = renderHook(() => useFetch<TestData>(TEST_URL));

    act(() => {
      void result.current.fetchData();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('sets the data and clears loading on a successful response', async () => {
    mockFetch({
      ok: true,
      json: async () => ({ value: 'hello' }),
    });

    const { result } = renderHook(() => useFetch<TestData>(TEST_URL));

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toEqual({ value: 'hello' });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets the default error message when the network request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const { result } = renderHook(() => useFetch<TestData>(TEST_URL));

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Something went wrong. Please try again.');
  });

  it('sets the default error message when the API returns a non-ok status', async () => {
    mockFetch({ ok: false, status: 500 });

    const { result } = renderHook(() => useFetch<TestData>(TEST_URL));

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Something went wrong. Please try again.');
  });

  it('uses a custom error message when provided', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const { result } = renderHook(() => useFetch<TestData>(TEST_URL, { errorMessage: 'Custom failure message' }));

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.error).toBe('Custom failure message');
  });

  it('resets data and error before each new fetch', async () => {
    mockFetch({ ok: false, status: 500 });
    const { result } = renderHook(() => useFetch<TestData>(TEST_URL));

    // First fetch fails
    await act(async () => {
      await result.current.fetchData();
    });
    expect(result.current.error).not.toBeNull();

    // Second fetch succeeds — error should clear
    mockFetch({
      ok: true,
      json: async () => ({ value: 'world' }),
    });

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({ value: 'world' });
  });

  it('aborts the previous request when fetchData is called again before it resolves', () => {
    const signals: AbortSignal[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, init?: { signal: AbortSignal }) => {
        signals.push(init!.signal);
        return new Promise(() => {});
      }),
    );

    const { result } = renderHook(() => useFetch<TestData>(TEST_URL));

    act(() => {
      void result.current.fetchData();
    });
    act(() => {
      void result.current.fetchData();
    });

    expect(signals).toHaveLength(2);
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });

  it('aborts the in-flight request when the component unmounts', () => {
    const signals: AbortSignal[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, init?: { signal: AbortSignal }) => {
        signals.push(init!.signal);
        return new Promise(() => {});
      }),
    );

    const { result, unmount } = renderHook(() => useFetch<TestData>(TEST_URL));

    act(() => {
      void result.current.fetchData();
    });
    expect(signals[0].aborted).toBe(false);

    unmount();

    expect(signals[0].aborted).toBe(true);
  });

  it('does not update state or warn after unmounting mid-request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, init?: { signal: AbortSignal }) => {
        return new Promise((_resolve, reject) => {
          init!.signal.addEventListener('abort', () => {
            reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
          });
        });
      }),
    );
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result, unmount } = renderHook(() => useFetch<TestData>(TEST_URL));

    let fetchPromise: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchData();
    });
    unmount();

    await act(async () => {
      await fetchPromise;
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
