import { act, renderHook, waitFor } from '@testing-library/react';
import { useState } from 'react';

import { useQuery } from './useQuery';

describe('useQuery', () => {
  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useQuery(() => Promise.resolve('data')));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.isRefetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useQuery(() => Promise.resolve('data')));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBe('data');
    });
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useQuery(() => Promise.reject(new Error('error'))));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(new Error('error'));
    });
  });

  it('should refetch data', async () => {
    const { result } = renderHook(() => useQuery(() => Promise.resolve('data')));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefetching).toBe(false);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe('data');
    });

    act(() => {
      result.current.refetch();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefetching).toBe(true);
    expect(result.current.data).toBe('data');

    await waitFor(() => {
      expect(result.current.isRefetching).toBe(false);
      expect(result.current.data).toBe('data');
    });
  });

  it('should abort request', async () => {
    const fetchWithAbortTest = ({ signal }: { signal: AbortSignal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('Aborted')));
        setTimeout(() => resolve('data'), 100);
      });

    const { result } = renderHook(() => useQuery(({ signal }) => fetchWithAbortTest({ signal })));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.aborted).toBe(false);
    expect(result.current.data).toBeUndefined();

    act(() => {
      result.current.abort();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(new Error('Aborted'));
      // FIXME: always returns false
      // expect(result.current.aborted).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should triggered onSuccess callback', async () => {
    const { result } = renderHook(() =>
      useQuery(() => Promise.resolve('data'), {
        onSuccess(data) {
          expect(data).toBe('data');
        }
      })
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should triggered onError callback', async () => {
    const { result } = renderHook(() =>
      useQuery(() => Promise.reject(new Error('error')), {
        onError(error) {
          expect(error).toEqual(new Error('error'));
        }
      })
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('should refresh data when keys change', async () => {
    const { result } = renderHook(() => {
      const [key, setKey] = useState('initial');

      const query = useQuery(({ keys }) => Promise.resolve(`data-${keys[0]}`), {
        keys: [key]
      });

      return {
        ...query,
        setKey
      };
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBe('data-initial');
    });

    act(() => {
      result.current.setKey('new');
    });

    await waitFor(() => {
      expect(result.current.data).toBe('data-new');
    });
  });
});
