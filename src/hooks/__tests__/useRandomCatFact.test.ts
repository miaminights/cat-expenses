import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useRandomCatFact } from '../useRandomCatFact'

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useRandomCatFact', () => {
  it('starts with no fact, not loading, and no error', () => {
    const { result } = renderHook(() => useRandomCatFact())
    expect(result.current.fact).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets isLoading to true immediately when fetchFact is called', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
    const { result } = renderHook(() => useRandomCatFact())

    act(() => {
      void result.current.fetchFact()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.fact).toBeNull()
  })

  it('sets the fact and clears loading on a successful response', async () => {
    mockFetch({
      ok: true,
      json: async () => ({ fact: 'Cats have 9 lives.', length: 18 }),
    })

    const { result } = renderHook(() => useRandomCatFact())

    await act(async () => {
      await result.current.fetchFact()
    })

    expect(result.current.fact).toBe('Cats have 9 lives.')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets an error message when the network request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { result } = renderHook(() => useRandomCatFact())

    await act(async () => {
      await result.current.fetchFact()
    })

    expect(result.current.fact).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Could not load a cat fact right now.')
  })

  it('sets an error message when the API returns a non-ok status', async () => {
    mockFetch({ ok: false, status: 500 })

    const { result } = renderHook(() => useRandomCatFact())

    await act(async () => {
      await result.current.fetchFact()
    })

    expect(result.current.fact).toBeNull()
    expect(result.current.error).toBe('Could not load a cat fact right now.')
  })

  it('resets fact and error before each new fetch', async () => {
    mockFetch({ ok: false, status: 500 })
    const { result } = renderHook(() => useRandomCatFact())

    // First fetch fails
    await act(async () => {
      await result.current.fetchFact()
    })
    expect(result.current.error).not.toBeNull()

    // Second fetch succeeds — error should clear
    mockFetch({
      ok: true,
      json: async () => ({ fact: 'Cats purr.', length: 10 }),
    })

    await act(async () => {
      await result.current.fetchFact()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.fact).toBe('Cats purr.')
  })
})
