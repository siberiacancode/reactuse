import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useThrottleCallback } from './useThrottleCallback';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
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

  result.current();
  expect(callback).toHaveBeenCalledTimes(3);

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledTimes(3);
});

it('Should pass parameters into callback', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useThrottleCallback(callback, 100));

  result.current('first');
  expect(callback).toHaveBeenCalledWith('first');

  result.current('second');
  expect(callback).not.toHaveBeenCalledWith('second');

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledWith('second');

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

it('Should keep throttling active while processing a trailing call', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useThrottleCallback(callback, 100));

  result.current('a');
  expect(callback).toHaveBeenCalledTimes(1);

  result.current('b');
  expect(callback).toHaveBeenCalledTimes(1);

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith('b');

  result.current('c');
  expect(callback).toHaveBeenCalledTimes(3);

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledTimes(3);
  expect(callback).toHaveBeenLastCalledWith('c');
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
  act(() => vi.advanceTimersByTime(100));
  expect(callback).not.toHaveBeenCalledWith('fourth');

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledWith('fourth');
  expect(callback).toHaveBeenCalledTimes(3);
});

it('Should reset the throttle window when no trailing call is pending', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useThrottleCallback(callback, 100));

  result.current('first');
  expect(callback).toHaveBeenCalledTimes(1);

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledTimes(1);

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledTimes(1);

  result.current('second');
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith('second');
});

it('Should cancel a pending trailing call', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useThrottleCallback(callback, 100));

  result.current('first');
  expect(callback).toHaveBeenCalledTimes(1);

  result.current('second');
  expect(callback).toHaveBeenCalledTimes(1);

  result.current.cancel();

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).not.toHaveBeenCalledWith('second');

  result.current('third');
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith('third');
});

it('Should do nothing when cancel is called without a pending call', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useThrottleCallback(callback, 100));

  expect(() => result.current.cancel()).not.toThrow();
  expect(callback).not.toHaveBeenCalled();

  result.current('value');
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('value');
});
