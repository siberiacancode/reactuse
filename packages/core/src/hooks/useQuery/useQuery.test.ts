import { act, renderHook, waitFor } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useQuery } from './useQuery';

it('Should use query', () => {
  const { result } = renderHook(() => useQuery(() => Promise.resolve('data')));

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.refetch).toBeTypeOf('function');
  expect(result.current.fetch).toBeTypeOf('function');
  expect(result.current.abort).toBeTypeOf('function');
  expect(result.current.error).toBeUndefined();
  expect(result.current.data).toBeUndefined();
});

it('Should use query on server side', () => {
  const { result } = renderHookServer(() => useQuery(() => Promise.resolve('data')));

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeFalsy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.refetch).toBeTypeOf('function');
  expect(result.current.fetch).toBeTypeOf('function');
  expect(result.current.abort).toBeTypeOf('function');
  expect(result.current.error).toBeUndefined();
  expect(result.current.data).toBeUndefined();
});

it('Should fetch data successfully', async () => {
  const { result } = renderHook(() => useQuery(() => Promise.resolve('data')));

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.data).toBeUndefined();

  await waitFor(() => {
    expect(result.current.isFetching).toBeFalsy();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBe('data');
  });
});

it('Should handle errors', async () => {
  const { result } = renderHook(() => useQuery(() => Promise.reject(new Error('error'))));

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.error).toBeUndefined();

  await waitFor(() => {
    expect(result.current.isFetching).toBeFalsy();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeTruthy();
    expect(result.current.error).toEqual(new Error('error'));
    expect(result.current.data).toBeUndefined();
  });
});

it('Should refetch data', async () => {
  const { result } = renderHook(() => useQuery(() => Promise.resolve('data')));

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.data).toBeUndefined();

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isFetching).toBeFalsy();
    expect(result.current.isRefetching).toBeFalsy();
    expect(result.current.data).toBe('data');
  });

  act(() => result.current.refetch());

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.isRefetching).toBeTruthy();
  expect(result.current.data).toBe('data');

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isFetching).toBeFalsy();
    expect(result.current.isRefetching).toBeFalsy();
    expect(result.current.data).toBe('data');
  });
});

it('Should fetch data manually', async () => {
  const { result } = renderHook(() => useQuery(() => Promise.resolve('data')));

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isFetching).toBeFalsy();
    expect(result.current.isRefetching).toBeFalsy();
    expect(result.current.data).toBe('data');
  });

  await act(async () => await result.current.fetch());

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeFalsy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.data).toBe('data');
});

it('Should abort request', async () => {
  const fetchWithAbort = ({ signal }: { signal: AbortSignal }) =>
    new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')));
      setTimeout(resolve, 0, 'data');
    });

  const { result } = renderHook(() => useQuery(({ signal }) => fetchWithAbort({ signal })));

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.data).toBeUndefined();

  act(() => result.current.abort());

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeTruthy();
    expect(result.current.error).toEqual(new Error('aborted'));
    expect(result.current.data).toBeUndefined();
  });

  act(() => result.current.refetch());

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBe('data');
  });
});

it('Should triggered onSuccess callback', async () => {
  const { result } = renderHook(() =>
    useQuery(() => Promise.resolve('data'), {
      onSuccess: (data) => expect(data).toBe('data')
    })
  );

  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
});

it('Should triggered onError callback', async () => {
  const { result } = renderHook(() =>
    useQuery(() => Promise.reject(new Error('error')), {
      onError: (error) => expect(error).toEqual(new Error('error'))
    })
  );

  await waitFor(() => expect(result.current.isError).toBeTruthy());
});

it('Should select data', async () => {
  const { result } = renderHook(() =>
    useQuery(() => Promise.resolve('data'), {
      select: (data) => `selected-${data}`
    })
  );

  await waitFor(() => expect(result.current.data).toBe('selected-data'));
});

it('Should set placeholder data', async () => {
  const { result } = renderHook(() =>
    useQuery(() => Promise.resolve('data'), {
      placeholderData: 'placeholder'
    })
  );

  expect(result.current.data).toBe('placeholder');

  await waitFor(() => expect(result.current.data).toBe('data'));
});

it('Should retry on error', async () => {
  let callCount = 0;
  const { result } = renderHook(() =>
    useQuery(
      () => {
        callCount++;
        if (callCount < 2) {
          return Promise.reject(new Error('error'));
        }
        return Promise.resolve('data');
      },
      {
        retry: 1
      }
    )
  );

  expect(result.current.isLoading).toBeTruthy();

  await waitFor(() => expect(result.current.data).toBe('data'));
});

it('Should retry on error multiple times', async () => {
  let callCount = 0;

  const { result } = renderHook(() =>
    useQuery(
      () => {
        callCount++;
        if (callCount < 2) {
          return Promise.reject(new Error('error'));
        }
        return Promise.resolve('data');
      },
      {
        retry: 2
      }
    )
  );

  expect(result.current.data).toBeUndefined();

  await waitFor(() => expect(result.current.data).toBe('data'));
});

it('Should be listen enabled param', async () => {
  const { result, rerender } = renderHook(
    (enabled) => useQuery(() => Promise.resolve('data'), { enabled }),
    {
      initialProps: false
    }
  );

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeFalsy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.data).toBeUndefined();

  rerender(true);

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.data).toBeUndefined();

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isFetching).toBeFalsy();
    expect(result.current.isRefetching).toBeFalsy();
    expect(result.current.data).toBe('data');
  });

  rerender(false);

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeFalsy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.data).toBe('data');

  rerender(true);

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.isRefetching).toBeTruthy();
  expect(result.current.data).toBe('data');

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isFetching).toBeFalsy();
    expect(result.current.isRefetching).toBeFalsy();
    expect(result.current.data).toBe('data');
  });
});

it('Should refresh data when keys change', async () => {
  const { result, rerender } = renderHook(
    (keys) => useQuery(({ keys }) => Promise.resolve(`data-${keys[0]}`), { keys }),
    {
      initialProps: ['initial']
    }
  );

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBe('data-initial');
  });

  rerender(['new']);

  await waitFor(() => expect(result.current.data).toBe('data-new'));
});

it('Should refetch with interval', async () => {
  let callCount = 0;
  const { result } = renderHook(() =>
    useQuery(() => Promise.resolve(`data-${++callCount}`), {
      refetchInterval: 100
    })
  );

  await waitFor(() => expect(result.current.data).toBe('data-1'));

  await waitFor(() => expect(result.current.data).toBe('data-2'), {
    timeout: 200
  });
});

it('Should refetch with interval as function', async () => {
  let callCount = 0;
  const { result } = renderHook(() =>
    useQuery(() => Promise.resolve(`data-${++callCount}`), {
      refetchInterval: () => 100
    })
  );

  await waitFor(() => expect(result.current.data).toBe('data-1'));
  await waitFor(() => expect(result.current.data).toBe('data-2'), {
    timeout: 200
  });
});

it('Should stop refetch when interval function returns false', async () => {
  let callCount = 0;
  const { result } = renderHook(() =>
    useQuery(() => Promise.resolve(`data-${++callCount}`), {
      refetchInterval: () => (callCount >= 2 ? false : 100)
    })
  );

  await waitFor(() => expect(result.current.data).toBe('data-1'));
  await waitFor(() => expect(result.current.data).toBe('data-2'), {
    timeout: 200
  });

  await new Promise((resolve) => setTimeout(resolve, 200));
  expect(result.current.data).toBe('data-2');
});

it('Should retry with delay', async () => {
  vi.useFakeTimers();
  const callback = vi.fn(() => Promise.reject(new Error('error')));

  renderHook(() => useQuery(callback, { retry: 1, retryDelay: 1000 }));

  await vi.advanceTimersByTimeAsync(0);
  expect(callback).toHaveBeenCalledOnce();

  await vi.advanceTimersByTimeAsync(999);
  expect(callback).toHaveBeenCalledOnce();

  await vi.advanceTimersByTimeAsync(1);
  expect(callback).toHaveBeenCalledTimes(2);

  vi.useRealTimers();
});

it('Should retry with delay multiple times', async () => {
  vi.useFakeTimers();
  const callback = vi.fn(() => Promise.reject(new Error('error')));

  renderHook(() => useQuery(callback, { retry: 2, retryDelay: 1000 }));

  await vi.advanceTimersByTimeAsync(0);
  expect(callback).toHaveBeenCalledOnce();

  await vi.advanceTimersByTimeAsync(1000);
  expect(callback).toHaveBeenCalledTimes(2);

  await vi.advanceTimersByTimeAsync(1000);
  expect(callback).toHaveBeenCalledTimes(3);

  await vi.advanceTimersByTimeAsync(1000);
  expect(callback).toHaveBeenCalledTimes(3);

  vi.useRealTimers();
});

it('Should retry without delay by default', async () => {
  vi.useFakeTimers();
  const callback = vi.fn(() => Promise.reject(new Error('error')));

  renderHook(() => useQuery(callback, { retry: 1 }));

  await vi.advanceTimersByTimeAsync(0);

  expect(callback).toHaveBeenCalledTimes(2);

  vi.useRealTimers();
});

it('Should not retry after delay when aborted', async () => {
  vi.useFakeTimers();
  const callback = vi.fn(() => Promise.reject(new Error('error')));

  const { result } = renderHook(() => useQuery(callback, { retry: 2, retryDelay: 1000 }));

  await vi.advanceTimersByTimeAsync(0);
  expect(callback).toHaveBeenCalledOnce();

  act(() => result.current.abort());
  await vi.advanceTimersByTimeAsync(2000);

  expect(callback).toHaveBeenCalledOnce();

  vi.useRealTimers();
});

it('Should not retry after delay when refetched', async () => {
  vi.useFakeTimers();
  const callback = vi.fn(() => Promise.reject(new Error('error')));

  const { result } = renderHook(() => useQuery(callback, { retry: 2, retryDelay: 1000 }));

  await vi.advanceTimersByTimeAsync(0);
  expect(callback).toHaveBeenCalledOnce();

  act(() => result.current.refetch());
  await vi.advanceTimersByTimeAsync(0);

  expect(callback).toHaveBeenCalledTimes(2);

  vi.useRealTimers();
});

it('Should not retry after delay on unmount', async () => {
  vi.useFakeTimers();
  const callback = vi.fn(() => Promise.reject(new Error('error')));

  const { unmount } = renderHook(() => useQuery(callback, { retry: 2, retryDelay: 1000 }));

  await vi.advanceTimersByTimeAsync(0);
  expect(callback).toHaveBeenCalledOnce();

  unmount();
  await vi.advanceTimersByTimeAsync(2000);

  expect(callback).toHaveBeenCalledOnce();

  vi.useRealTimers();
});

it('Should cleanup retry timeout on unmount', () => {
  const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

  const { unmount } = renderHook(() =>
    useQuery(() => Promise.resolve('data'), { retry: 1, retryDelay: 1000 })
  );

  unmount();

  expect(clearTimeoutSpy).toHaveBeenCalled();
});

it('Should use placeholder data as function', () => {
  const placeholderData = vi.fn(() => 'lazy-placeholder');

  const { result } = renderHook(() =>
    useQuery(() => Promise.resolve('data'), {
      placeholderData
    })
  );

  expect(result.current.data).toBe('lazy-placeholder');
  expect(result.current.isSuccess).toBeTruthy();
  expect(placeholderData).toHaveBeenCalledOnce();
});

it('Should cleanup interval on unmount', () => {
  const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

  const { unmount } = renderHook(() =>
    useQuery(() => Promise.resolve('data'), {
      refetchInterval: 1000
    })
  );

  unmount();

  expect(clearIntervalSpy).toHaveBeenCalled();
});

it('Should abort during retry', async () => {
  const { result } = renderHook(() =>
    useQuery(() => Promise.reject(new Error('error')), {
      retry: 2
    })
  );

  expect(result.current.isLoading).toBeTruthy();

  act(result.current.abort);

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isFetching).toBeFalsy();
  });
});
