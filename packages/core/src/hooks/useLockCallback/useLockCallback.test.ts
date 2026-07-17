import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useLockCallback } from './useLockCallback';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('Should lock callback', () => {
  const { result } = renderHook(() => useLockCallback(vi.fn()));
  expect(result.current).toBeTypeOf('function');
});

it('Should lock callback on server side', () => {
  const { result } = renderHookServer(() => useLockCallback(vi.fn()));
  expect(result.current).toBeTypeOf('function');
});

it('Should execute the callback', async () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useLockCallback(callback));

  await act(async () => result.current());

  expect(callback).toHaveBeenCalledTimes(1);
});

it('Should prevent multiple simultaneous executions', async () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useLockCallback(callback));

  await act(async () => {
    await Promise.all([result.current(), result.current(), result.current()]);
  });

  expect(callback).toHaveBeenCalledTimes(1);
});
