import { renderHook, waitFor } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useAsync } from './useAsync';

it('Should use async', async () => {
  const { result } = renderHook(() => useAsync(() => Promise.resolve('data')));

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.data).toBeUndefined();
});

it('Should use async on server side', async () => {
  const { result } = renderHookServer(() => useAsync(() => Promise.resolve('data')));

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.data).toBeUndefined();
});

it('Should not re-run callback when dependencies are omitted', async () => {
  const callback = vi.fn(() => Promise.resolve('data'));
  const { result, rerender } = renderHook(() => useAsync(callback));

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());

  rerender();
  expect(callback).toHaveBeenCalledTimes(1);
});

it('Should handle successful promise resolution', async () => {
  const { result } = renderHook(() => useAsync(() => Promise.resolve('data')));

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());

  expect(result.current.isError).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.data).toBe('data');
});

it('Should handle failed promise rejection', async () => {
  const error = new Error('Async error');
  const { result } = renderHook(() => useAsync(() => Promise.reject(error), []));

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());

  expect(result.current.isError).toBeTruthy();
  expect(result.current.error).toBe(error);
  expect(result.current.data).toBeUndefined();
});

it('Should clear previous error after successful retry', async () => {
  const error = new Error('Async error');

  const { result, rerender } = renderHook(
    (error?: Error) =>
      useAsync(() => (error ? Promise.reject(error) : Promise.resolve('data')), [error]),
    { initialProps: error }
  );

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());

  expect(result.current.isError).toBeTruthy();
  expect(result.current.error).toBe(error);

  rerender(undefined);

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());

  expect(result.current.isError).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.data).toBe('data');
});

it('Should not re-run callback if dependencies have not changed', async () => {
  const { result, rerender } = renderHook(() => useAsync(() => Promise.resolve('data'), [1]));

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());

  rerender();
  expect(result.current.isLoading).toBeFalsy();
});

it('Should recreate effect', async () => {
  const callback = vi.fn(() => Promise.resolve('data'));
  const { result, rerender } = renderHook((deps) => useAsync(callback, deps), {
    initialProps: ['key']
  });

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());
  expect(callback).toHaveBeenCalledTimes(1);

  rerender(['new-key']);

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());
  expect(callback).toHaveBeenCalledTimes(2);
});
