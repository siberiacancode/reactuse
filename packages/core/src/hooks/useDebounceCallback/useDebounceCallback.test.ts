import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDebounceCallback } from './useDebounceCallback';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
});

it('Should use debounce callback', () => {
  const { result } = renderHook(() => useDebounceCallback(vi.fn(), 100));

  expect(result.current).toBeTypeOf('function');
  expect(result.current.cancel).toBeTypeOf('function');
});

it('Should use debounce callback on server side', () => {
  const { result } = renderHookServer(() => useDebounceCallback(vi.fn(), 100));

  expect(result.current).toBeTypeOf('function');
  expect(result.current.cancel).toBeTypeOf('function');
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

it('Should cancel the previous callback if a new one occurs before the delay', () => {
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

it('Should cancel callback', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useDebounceCallback(callback, 100));

  result.current();
  result.current.cancel();

  act(() => vi.advanceTimersByTime(100));

  expect(callback).not.toHaveBeenCalled();
});

it('Should do nothing when cancel is called without a pending callback', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useDebounceCallback(callback, 100));

  expect(() => result.current.cancel()).not.toThrow();
  expect(callback).not.toHaveBeenCalled();
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

it('Should use latest callback', () => {
  const initialCallback = vi.fn();
  const callback = vi.fn();

  const { result, rerender } = renderHook((callback) => useDebounceCallback(callback, 100), {
    initialProps: initialCallback
  });
  const debouncedCallback = result.current;

  rerender(callback);
  debouncedCallback('value');

  act(() => vi.advanceTimersByTime(100));

  expect(initialCallback).not.toHaveBeenCalled();
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith('value');
  expect(result.current).toBe(debouncedCallback);
});

it('Should use latest delay', () => {
  const callback = vi.fn();

  const { result, rerender } = renderHook((delay) => useDebounceCallback(callback, delay), {
    initialProps: 100
  });
  const debouncedCallback = result.current;

  rerender(200);
  expect(result.current).toBe(debouncedCallback);

  result.current();

  act(() => vi.advanceTimersByTime(199));
  expect(callback).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(callback).toHaveBeenCalledOnce();
});

it('Should preserve callback context', () => {
  const context = {
    callback: vi.fn(function (this: { value: string }) {
      return this.value;
    }),
    value: 'value'
  };

  const { result } = renderHook(() => useDebounceCallback(context.callback, 100));
  const caller = { callback: result.current, value: context.value };

  caller.callback();

  act(() => vi.advanceTimersByTime(100));

  expect(context.callback).toHaveReturnedWith('value');
});
