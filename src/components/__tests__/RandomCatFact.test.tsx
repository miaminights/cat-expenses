import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useFetch } from '../../hooks/useFetch';
import { RandomCatFact } from '../RandomCatFact';

vi.mock('../../hooks/useFetch');

const mockFetchData = vi.fn();

beforeEach(() => {
  mockFetchData.mockClear();
  vi.mocked(useFetch).mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
    fetchData: mockFetchData,
  });
});

describe('RandomCatFact', () => {
  it('shows the loading indicator while the cat fact is being fetched', () => {
    vi.mocked(useFetch).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      fetchData: mockFetchData,
    });
    render(<RandomCatFact />);
    expect(screen.getByText('Loading a cat fact…')).toBeInTheDocument();
  });

  it('shows the cat fact once it has loaded', () => {
    vi.mocked(useFetch).mockReturnValue({
      data: { fact: 'Cats sleep 16 hours a day.' },
      isLoading: false,
      error: null,
      fetchData: mockFetchData,
    });
    render(<RandomCatFact />);
    expect(screen.getByText('Cats sleep 16 hours a day.')).toBeInTheDocument();
  });

  it('shows an error message when the cat fact fails to load', () => {
    vi.mocked(useFetch).mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Could not load a cat fact right now.',
      fetchData: mockFetchData,
    });
    render(<RandomCatFact />);
    expect(screen.getByText('Could not load a cat fact right now.')).toBeInTheDocument();
  });

  it('calls fetchData on mount', async () => {
    render(<RandomCatFact />);
    await vi.waitFor(() => expect(mockFetchData).toHaveBeenCalledOnce());
  });
});
