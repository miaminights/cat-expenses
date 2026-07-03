import { act,renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useRandomCatFact } from '../useRandomCatFact';

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useRandomCatFact', () => {
  it('starts with no fact, not loading, and no error', () => {
    const { result } = renderHook(() => useRandomCatFact());
    expect(result.current.fact).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets isLoading to true immediately when fetchFact is called', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
    const { result } = renderHook(() => useRandomCatFact());

    act(() => {
      void result.current.fetchFact();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.fact).toBeNull();
  });

  it('sets the fact and clears loading on a successful response', async () => {
    mockFetch({
      ok: true,
      json: async () => ({ fact: 'Cats have 9 lives.', length: 18 }),
    });

    const { result } = renderHook(() => useRandomCatFact());

    await act(async () => {
      await result.current.fetchFact();
    });

    expect(result.current.fact).toBe('Cats have 9 lives.');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets an error message when the network request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const { result } = renderHook(() => useRandomCatFact());

    await act(async () => {
      await result.current.fetchFact();
    });

    expect(result.current.fact).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Could not load a cat fact right now.');
  });

  it('sets an error message when the API returns a non-ok status', async () => {
    mockFetch({ ok: false, status: 500 });

    const { result } = renderHook(() => useRandomCatFact());

    await act(async () => {
      await result.current.fetchFact();
    });

    expect(result.current.fact).toBeNull();
    expect(result.current.error).toBe('Could not load a cat fact right now.');
  });

  it('resets fact and error before each new fetch', async () => {
    mockFetch({ ok: false, status: 500 });
    const { result } = renderHook(() => useRandomCatFact());

    // First fetch fails
    await act(async () => {
      await result.current.fetchFact();
    });
    expect(result.current.error).not.toBeNull();

    // Second fetch succeeds — error should clear
    mockFetch({
      ok: true,
      json: async () => ({ fact: 'Cats purr.', length: 10 }),
    });

    await act(async () => {
      await result.current.fetchFact();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.fact).toBe('Cats purr.');
  });

  it('aborts the previous request when fetchFact is called again before it resolves', () => {
    const signals: AbortSignal[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, init?: { signal: AbortSignal }) => {
        signals.push(init!.signal);
        return new Promise(() => {});
      }),
    );

    const { result } = renderHook(() => useRandomCatFact());

    act(() => {
      void result.current.fetchFact();
    });
    act(() => {
      void result.current.fetchFact();
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

    const { result, unmount } = renderHook(() => useRandomCatFact());

    act(() => {
      void result.current.fetchFact();
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

    const { result, unmount } = renderHook(() => useRandomCatFact());

    let fetchPromise: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchFact();
    });
    unmount();

    await act(async () => {
      await fetchPromise;
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
