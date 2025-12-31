import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useThrottleCallback } from './useThrottleCallback';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should use throttle callback', () => {
  const { result } = renderHook(() => useThrottleCallback(vi.fn(), 100));
  expect(result.current).toBeTypeOf('function');
});

it('Should use throttle callback on server side', () => {
  const { result } = renderHookServer(() => useThrottleCallback(vi.fn(), 100));
  expect(result.current).toBeTypeOf('function');
});

it('Should execute the callback throttle', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useThrottleCallback(callback, 100));

  result.current();
  expect(callback).toHaveBeenCalledTimes(1);

  result.current();
  expect(callback).toHaveBeenCalledTimes(1);

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledTimes(2);
});

it('Should pass parameters into callback', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useThrottleCallback(callback, 100));

  result.current('first');
  expect(callback).toHaveBeenCalledWith('first');

  result.current('second');
  expect(callback).not.toHaveBeenCalledWith('second');

  act(() => vi.advanceTimersByTime(100));
  result.current('third');
  expect(callback).toHaveBeenCalledWith('third');
});

it('Should use latest arguments for delayed call', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useThrottleCallback(callback, 100));

  result.current('first');
  expect(callback).toHaveBeenCalledWith('first');

  result.current('second');
  expect(callback).not.toHaveBeenCalledWith('second');

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledWith('second');
});

it('Should return new function when delay changes', () => {
  const callback = vi.fn();

  const { result, rerender } = renderHook((delay) => useThrottleCallback(callback, delay), {
    initialProps: 100
  });

  result.current('first');
  expect(callback).toHaveBeenCalledWith('first');

  result.current('second');
  expect(callback).not.toHaveBeenCalledWith('second');

  rerender(200);

  result.current('third');
  expect(callback).toHaveBeenCalledWith('third');

  result.current('fourth');
  expect(callback).not.toHaveBeenCalledWith('fourth');

  act(() => vi.advanceTimersByTime(200));
  expect(callback).toHaveBeenCalledWith('fourth');
  expect(callback).toHaveBeenCalledTimes(3);
});
