import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useDebounceEffect } from './useDebounceEffect';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should use debounce effect', () => {
  const effect = vi.fn();
  renderHook(() => useDebounceEffect(effect, 100, []));

  act(() => vi.advanceTimersByTime(100));

  expect(effect).not.toHaveBeenCalled();
});

it('Should use debounce effect on server side', () => {
  const effect = vi.fn();
  renderHookServer(() => useDebounceEffect(effect, 100, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should debounce effect execution', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(({ value }) => useDebounceEffect(effect, 100, [value]), {
    initialProps: { value: 'initial value' }
  });

  expect(effect).not.toHaveBeenCalled();

  rerender({ value: 'new value' });

  act(() => vi.advanceTimersByTime(100));

  expect(effect).toHaveBeenCalledOnce();
});

it('Should cleanup on unmount', () => {
  const cleanup = vi.fn();
  const effect = vi.fn(() => cleanup);

  const { unmount, rerender } = renderHook((value) => useDebounceEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  expect(effect).not.toHaveBeenCalled();

  rerender('new value');

  act(() => vi.advanceTimersByTime(100));

  unmount();

  expect(cleanup).toHaveBeenCalledOnce();
});
