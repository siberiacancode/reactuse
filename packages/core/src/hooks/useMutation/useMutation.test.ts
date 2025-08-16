import { act, renderHook, waitFor } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useMutation } from './useMutation';

it('Should use mutation', () => {
  const { result } = renderHook(() => useMutation(() => Promise.resolve('data')));

  expect(result.current.data).toBeNull();
  expect(result.current.error).toBeNull();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.mutate).toBeTypeOf('function');
  expect(result.current.mutateAsync).toBeTypeOf('function');
});

it('Should use mutation on server side', () => {
  const { result } = renderHookServer(() => useMutation(() => Promise.resolve('data')));

  expect(result.current.data).toBeNull();
  expect(result.current.error).toBeNull();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.mutate).toBeTypeOf('function');
  expect(result.current.mutateAsync).toBeTypeOf('function');
});

it('Should mutate data successfully', async () => {
  const { result } = renderHook(() => useMutation(() => Promise.resolve('data')));

  act(result.current.mutate);

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.data).toBeNull();

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toBe('data');
  });
});

it('Should handle errors', async () => {
  const { result } = renderHook(() => useMutation(() => Promise.reject(new Error('error'))));

  act(result.current.mutate);

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.error).toBeNull();

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeTruthy();
    expect(result.current.error).toEqual(new Error('error'));
    expect(result.current.data).toBeNull();
  });
});

it('Should mutate async', async () => {
  const { result } = renderHook(() => useMutation((input) => Promise.resolve(`data-${input}`)));

  await act(async () => {
    const response = await result.current.mutateAsync('test');
    expect(response).toBe('data-test');
  });

  expect(result.current.data).toBe('data-test');
  expect(result.current.isSuccess).toBeTruthy();
});

it('Should triggered onSuccess callback', async () => {
  const { result } = renderHook(() =>
    useMutation(() => Promise.resolve('data'), {
      onSuccess: (data) => expect(data).toBe('data')
    })
  );

  act(result.current.mutate);

  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
});

it('Should triggered onError callback', async () => {
  const { result } = renderHook(() =>
    useMutation(() => Promise.reject(new Error('error')), {
      onError: (error) => expect(error).toEqual(new Error('error'))
    })
  );

  act(() => result.current.mutate());

  await waitFor(() => expect(result.current.isError).toBeTruthy());
});

it('Should retry on error once', async () => {
  let retries = 0;

  const { result } = renderHook(() =>
    useMutation(
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

  act(result.current.mutate);

  expect(result.current.data).toBeNull();

  await waitFor(() => expect(result.current.data).toBe('data'));
});

it('Should retry on error multiple times', async () => {
  let retries = 0;

  const { result } = renderHook(() =>
    useMutation(
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

  act(result.current.mutate);

  expect(result.current.data).toBeNull();

  await waitFor(() => expect(result.current.data).toBe('data'));
});

it('Should override global options with mutate options', async () => {
  const globalOnSuccess = vi.fn();
  const localOnSuccess = vi.fn();

  const { result } = renderHook(() =>
    useMutation(() => Promise.resolve('data'), {
      onSuccess: globalOnSuccess
    })
  );

  act(() => result.current.mutate(undefined, { onSuccess: localOnSuccess }));

  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

  expect(localOnSuccess).toHaveBeenCalledWith('data');
  expect(globalOnSuccess).not.toHaveBeenCalled();
});

it('Should reset error state on successful mutation', async () => {
  let shouldFail = true;

  const { result } = renderHook(() =>
    useMutation(() => {
      if (shouldFail) {
        return Promise.reject(new Error('error'));
      }
      return Promise.resolve('data');
    })
  );

  act(result.current.mutate);

  await waitFor(() => expect(result.current.isError).toBeTruthy());

  shouldFail = false;
  act(result.current.mutate);

  await waitFor(() => {
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBeFalsy();
  });
});

it('Should retry by number delay', async () => {
  let retries = 0;
  const { result } = renderHook(() =>
    useMutation(() => {
      retries++;
      if (retries < 2) {
        return Promise.reject(new Error('error'));
      }
      return Promise.resolve('data');
    })
  );

  act(() => result.current.mutate(undefined, { retry: 1, retryDelay: 100 }));

  expect(result.current.isLoading).toBeTruthy();

  await waitFor(() => expect(result.current.data).toBe('data'));
});

it('Should retry by number global delay', async () => {
  let retries = 0;
  const { result } = renderHook(() =>
    useMutation(
      () => {
        retries++;
        if (retries < 2) {
          return Promise.reject(new Error('error'));
        }
        return Promise.resolve('data');
      },
      { retryDelay: 100, retry: 1 }
    )
  );

  act(result.current.mutate);

  expect(result.current.isLoading).toBeTruthy();

  await waitFor(() => expect(result.current.data).toBe('data'));
});

it('Should retry by function delay', async () => {
  const retryDelay = vi.fn(() => 100);
  let retries = 0;

  const { result } = renderHook(() =>
    useMutation(() => {
      retries++;
      if (retries < 2) {
        return Promise.reject(new Error('error'));
      }
      return Promise.resolve('data');
    })
  );

  act(() => result.current.mutate(undefined, { retry: 1, retryDelay }));

  expect(result.current.isLoading).toBeTruthy();

  await waitFor(() => {
    expect(result.current.data).toBe('data');
    expect(retryDelay).toHaveBeenCalledOnce();
  });
});
