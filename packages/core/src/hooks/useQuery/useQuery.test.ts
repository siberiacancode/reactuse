import { act, renderHook, waitFor } from '@testing-library/react';

import { useQuery } from './useQuery';

it('Should use query', () => {
  const { result } = renderHook(() => useQuery(() => Promise.resolve('data')));

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.refetch).toBeTypeOf('function');
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

it('Should abort request', async () => {
  const fetchWithAbort = ({ signal }: { signal: AbortSignal }) =>
    new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')));
      setTimeout(() => resolve('data'), 0);
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

it('Should retry on error once', async () => {
  let retries = 0;

  const { result } = renderHook(() =>
    useQuery(
      () =>
        new Promise((resolve, reject) => {
          if (retries === 1) resolve('data');
          retries++;
          reject(new Error('error'));
        }),
      {
        retry: true
      }
    )
  );

  expect(result.current.data).toBeUndefined();

  await waitFor(() => expect(result.current.data).toBe('data'));
});

it('Should retry on error multiple times', async () => {
  let retries = 0;

  const { result } = renderHook(() =>
    useQuery(
      () =>
        new Promise((resolve, reject) => {
          if (retries === 2) resolve('data');
          retries++;
          reject(new Error('error'));
        }),
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
    ({ enabled }) => useQuery(() => Promise.resolve('data'), { enabled }),
    {
      initialProps: { enabled: false }
    }
  );

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeFalsy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.data).toBeUndefined();

  rerender({ enabled: true });

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

  rerender({ enabled: false });

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeFalsy();
  expect(result.current.isRefetching).toBeFalsy();
  expect(result.current.data).toBe('data');

  rerender({ enabled: true });

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
    ({ keys }) =>
      useQuery(({ keys }) => Promise.resolve(`data-${keys[0]}`), {
        keys
      }),
    {
      initialProps: { keys: ['initial'] }
    }
  );

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBe('data-initial');
  });

  rerender({ keys: ['new'] });

  await waitFor(() => expect(result.current.data).toBe('data-new'));
});
