import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useDebounceValue } from './useDebounceValue';

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should return initial value immediately', () => {
  const { result } = renderHook(() => useDebounceValue('initial value', 100));

  expect(result.current).toBe('initial value');
});

it('Should update value only after delay', () => {
  const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
    initialProps: { value: 1, delay: 100 }
  });

  rerender({ value: 2, delay: 100 });

  act(() => vi.advanceTimersByTime(99));
  expect(result.current).toBe(1);

  act(() => vi.advanceTimersByTime(1));
  expect(result.current).toBe(2);
});

it('Should debounce rapid consecutive updates and use only the last value', () => {
  const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
    initialProps: { value: 1, delay: 100 }
  });
  expect(result.current).toBe(1);

  rerender({ value: 2, delay: 100 });

  act(() => vi.advanceTimersByTime(50));
  expect(result.current).toBe(1);

  rerender({ value: 3, delay: 100 });

  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe(3);
});

it('Should not trigger state update if the value remains the same', () => {
  const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
    initialProps: { value: 'same', delay: 100 }
  });
  expect(result.current).toBe('same');

  rerender({ value: 'same', delay: 100 });

  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe('same');
});

it('Should apply multiple updates separately when spaced by delay', () => {
  const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
    initialProps: { value: 1, delay: 100 }
  });
  expect(result.current).toBe(1);

  rerender({ value: 2, delay: 100 });

  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe(2);

  rerender({ value: 3, delay: 100 });

  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe(3);
});

it('Should use new delay when delay changes', () => {
  const { result, rerender } = renderHook(({ value, d }) => useDebounceValue(value, d), {
    initialProps: { value: 'initial', d: 100 }
  });
  expect(result.current).toBe('initial');

  rerender({ value: 'first', d: 100 });

  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe('first');

  rerender({ value: 'second', d: 200 });

  act(() => vi.advanceTimersByTime(199));
  expect(result.current).toBe('first');

  act(() => vi.advanceTimersByTime(1));
  expect(result.current).toBe('second');
});

it('Should not update value after unmount', () => {
  const { result, rerender, unmount } = renderHook(
    ({ value, delay }) => useDebounceValue(value, delay),
    {
      initialProps: { value: 'start', delay: 100 }
    }
  );

  rerender({ value: 'end', delay: 100 });
  unmount();

  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe('start');
});
