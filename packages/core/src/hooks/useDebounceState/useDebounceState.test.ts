import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useDebounceState } from './useDebounceState';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should use debounce value', () => {
  const { result } = renderHook(() => useDebounceState('value', 100));

  expect(result.current[0]).toBe('value');
  expect(result.current[1]).toBeTypeOf('function');
});

it('Should update value after delay', () => {
  const { result } = renderHook(() => useDebounceState('first', 100));

  const [_, setDebouncedValue] = result.current;

  setDebouncedValue('second');

  act(() => vi.advanceTimersByTime(99));
  expect(result.current[0]).toBe('first');

  act(() => vi.advanceTimersByTime(1));
  expect(result.current[0]).toBe('second');
});

it('Should apply new delay when delay changes', () => {
  const { result, rerender } = renderHook((delay) => useDebounceState('first', delay), {
    initialProps: 100
  });

  const [_, setDebouncedValue] = result.current;

  setDebouncedValue('second');

  expect(result.current[0]).toBe('first');

  setDebouncedValue('second');
  expect(result.current[0]).not.toBe('second');

  rerender(200);
  setDebouncedValue('third');
  expect(result.current[0]).not.toBe('third');

  act(() => vi.advanceTimersByTime(200));
  expect(result.current[0]).toBe('third');
});
