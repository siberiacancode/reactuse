import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useDebounceCallback } from './useDebounceCallback';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('Should use debounce callback', () => {
  const { result } = renderHook(() => useDebounceCallback(vi.fn(), 100));
  expect(result.current).toBeTypeOf('function');
});

it('Should execute the callback only after delay', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useDebounceCallback(callback, 100));
  const debouncedCallback = result.current;

  debouncedCallback();

  act(() => vi.advanceTimersByTime(99));

  expect(callback).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(callback).toHaveBeenCalledOnce();
});

it('Should сancel the previous callback if a new one occurs before the delay', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useDebounceCallback(callback, 100));
  const debouncedCallback = result.current;

  debouncedCallback();

  act(() => vi.advanceTimersByTime(50));

  expect(callback).not.toHaveBeenCalled();

  debouncedCallback();

  act(() => vi.advanceTimersByTime(100));

  expect(callback).toHaveBeenCalledOnce();
});

it('Should pass parameters into callback', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useDebounceCallback(callback, 100));
  const debouncedCallback = result.current;

  debouncedCallback(1, 2, 3);

  act(() => vi.advanceTimersByTime(100));

  expect(callback).toHaveBeenCalledWith(1, 2, 3);
});

it('Should pass argument and cancel callbacks that called before delay', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useDebounceCallback(callback, 100));
  const debouncedCallback = result.current;

  debouncedCallback('first');

  act(() => vi.advanceTimersByTime(99));

  debouncedCallback('second');

  act(() => vi.advanceTimersByTime(100));

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith('second');
});

it('Should return new function when delay changes', () => {
  const callback = vi.fn();

  const { result, rerender } = renderHook((delay) => useDebounceCallback(callback, delay), {
    initialProps: 100
  });
  const debouncedCallback = result.current;

  debouncedCallback();

  act(() => vi.advanceTimersByTime(50));
  expect(callback).not.toHaveBeenCalled();

  rerender(200);

  debouncedCallback();

  act(() => vi.advanceTimersByTime(200));
  expect(callback).toHaveBeenCalledOnce();
});
