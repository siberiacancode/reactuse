import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useDebounceValue } from './useDebounceValue';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should use debounce value', () => {
  const { result } = renderHook(() => useDebounceValue('value', 100));
  expect(result.current).toBe('value');
});

it('Should update value after delay', () => {
  const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
    initialProps: { value: 'value', delay: 100 }
  });

  rerender({ value: 'new value', delay: 100 });

  act(() => vi.advanceTimersByTime(99));
  expect(result.current).toBe('value');

  act(() => vi.advanceTimersByTime(1));
  expect(result.current).toBe('new value');
});

it('Should apply new delay when delay changes', () => {
  const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
    initialProps: { value: 'value', delay: 100 }
  });

  rerender({ value: 'new value', delay: 200 });

  expect(result.current).toBe('value');

  act(() => vi.advanceTimersByTime(199));
  expect(result.current).toBe('value');

  act(() => vi.advanceTimersByTime(1));
  expect(result.current).toBe('new value');
});
