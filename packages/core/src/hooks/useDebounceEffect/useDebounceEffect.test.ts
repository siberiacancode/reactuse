import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useDebounceEffect } from './useDebounceEffect';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should run the effect after the delay', () => {
  const effect = vi.fn();

  renderHook(() => useDebounceEffect(effect, [], 100));

  act(() => vi.advanceTimersByTime(99));
  expect(effect).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(effect).toHaveBeenCalledOnce();
});

it('Should re-run effect when dependencies change (debounced)', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(({ dep }) => useDebounceEffect(effect, [dep], 100), {
    initialProps: { dep: 1 }
  });

  act(() => vi.advanceTimersByTime(100));
  expect(effect).toHaveBeenCalledTimes(1);

  rerender({ dep: 2 });

  act(() => vi.advanceTimersByTime(99));
  expect(effect).toHaveBeenCalledTimes(1);

  act(() => vi.advanceTimersByTime(1));
  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should cancel the previous call if dependency changes before delay', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(({ dep }) => useDebounceEffect(effect, [dep], 100), {
    initialProps: { dep: 1 }
  });

  act(() => vi.advanceTimersByTime(50));
  rerender({ dep: 2 });

  act(() => vi.advanceTimersByTime(100));

  expect(effect).toHaveBeenCalledTimes(1);
});

it('Should support async effect', async () => {
  const effect = vi.fn().mockResolvedValue(undefined);

  renderHook(() => useDebounceEffect(effect, [], 100));

  act(() => vi.advanceTimersByTime(100));

  expect(effect).toHaveBeenCalledOnce();
});
