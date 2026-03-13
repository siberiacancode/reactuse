import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useThrottleState } from './useThrottleState';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should use throttle state', () => {
  const { result } = renderHook(() => useThrottleState('value', 200));

  expect(result.current[0]).toBe('value');
  expect(result.current[1]).toBeTypeOf('function');
});

it('Should update value after delay', () => {
  const { result } = renderHook(() => useThrottleState('first', 100));

  const [_, setThrottledValue] = result.current;

  setThrottledValue('first');
  expect(result.current[0]).toBe('first');

  setThrottledValue('second');
  expect(result.current[0]).not.toBe('second');

  act(() => vi.advanceTimersByTime(100));
  expect(result.current[0]).toBe('second');
});

it('Should apply new delay when delay changes', () => {
  const { result, rerender } = renderHook((delay) => useThrottleState('first', delay), {
    initialProps: 100
  });

  const [_, setThrottledValue] = result.current;

  setThrottledValue('first');
  expect(result.current[0]).toBe('first');

  setThrottledValue('second');
  expect(result.current[0]).not.toBe('second');

  rerender(200);
  setThrottledValue('third');
  expect(result.current[0]).not.toBe('third');

  act(() => vi.advanceTimersByTime(200));
  expect(result.current[0]).toBe('third');
});
