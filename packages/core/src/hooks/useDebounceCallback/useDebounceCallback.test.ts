import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useDebounceCallback } from './useDebounceCallback';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should use debounce callback', () => {
  const { result } = renderHook(() => useDebounceCallback(vi.fn(), 300));
  expect(result.current).toBeTypeOf('function');
});

it('Should execute the callback only after delay', () => {
  const callback = vi.fn();
  const delay = 300;

  const { result } = renderHook(() => useDebounceCallback(callback, delay));
  const debouncedFn = result.current;

  act(() => {
    debouncedFn();
    vi.advanceTimersByTime(delay - 1);
  });
  expect(callback).not.toBeCalled();

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(callback).toBeCalledTimes(1);
});

it('Should сancel the previous callback if a new one occurs before the delay', () => {
  const callback = vi.fn();
  const delay = 300;

  const { result } = renderHook(() => useDebounceCallback(callback, delay));
  const debouncedFn = result.current;

  act(() => {
    debouncedFn();
    vi.advanceTimersByTime(delay - 50);
    debouncedFn();
    vi.advanceTimersByTime(delay - 50);
  });
  expect(callback).not.toBeCalled();

  act(() => {
    vi.advanceTimersByTime(50);
  });
  expect(callback).toBeCalledTimes(1);
});

it('Should pass single argument into callback', () => {
  const callback = vi.fn();
  const delay = 100;

  const { result } = renderHook(() => useDebounceCallback(callback, delay));
  const debouncedFn = result.current;

  act(() => {
    debouncedFn('argument');
    vi.advanceTimersByTime(delay);
  });

  expect(callback).toBeCalledWith('argument');
});

it('Should pass multiple arguments into callback', () => {
  const callback = vi.fn();
  const delay = 100;

  const { result } = renderHook(() => useDebounceCallback(callback, delay));
  const debouncedFn = result.current;

  act(() => {
    debouncedFn(1, 2, 3);
    vi.advanceTimersByTime(delay);
  });

  expect(callback).toBeCalledWith(1, 2, 3);
});

it('Should pass argument and cancel callbacks that called before delay', () => {
  const callback = vi.fn();
  const delay = 300;

  const { result } = renderHook(() => useDebounceCallback(callback, delay));
  const debouncedFn = result.current;

  act(() => {
    debouncedFn('first');
    vi.advanceTimersByTime(delay - 100);
    debouncedFn('second');
    vi.advanceTimersByTime(delay - 100);
    debouncedFn('third');
    vi.advanceTimersByTime(delay);
  });

  expect(callback).toBeCalledTimes(1);
  expect(callback).toBeCalledWith('third');
});

it('Should keep the same function between renders if delay is unchanged', () => {
  const callback = vi.fn();
  const delay = 200;

  const { result, rerender } = renderHook(({ cb, d }) => useDebounceCallback(cb, d), {
    initialProps: { cb: callback, d: delay }
  });
  const first = result.current;

  rerender({ cb: callback, d: delay });
  const second = result.current;

  expect(first).toBe(second);
});
