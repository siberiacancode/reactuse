import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useLockCallback } from './useLockCallback';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should lock callback', () => {
  const { result } = renderHook(() => useLockCallback(vi.fn()));
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
