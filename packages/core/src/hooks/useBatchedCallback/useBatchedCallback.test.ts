import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useBatchedCallback } from './useBatchedCallback';

it('Should use batched callback', () => {
  const { result } = renderHook(() => useBatchedCallback(vi.fn(), { size: 3 }));

  expect(result.current).toBeTypeOf('function');
  expect(result.current.flush).toBeTypeOf('function');
  expect(result.current.cancel).toBeTypeOf('function');
});

it('Should use batched callback on server side', () => {
  const { result } = renderHookServer(() => useBatchedCallback(vi.fn(), { size: 3 }));

  expect(result.current).toBeTypeOf('function');
  expect(result.current.flush).toBeTypeOf('function');
  expect(result.current.cancel).toBeTypeOf('function');
});

it('Should flush when batch size reached', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 3 }));

  result.current('a');
  result.current('b');
  result.current('c');

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith([['a'], ['b'], ['c']]);
});

it('Should flush manually', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 5 }));

  result.current('a');

  result.current.flush();

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith([['a']]);
});

it('Should cancel pending batch', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 5 }));

  result.current('a');
  result.current.cancel();
  result.current.flush();

  expect(callback).not.toHaveBeenCalled();
});

it('Should flush by delay when batch size not reached', () => {
  vi.useFakeTimers();
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 3, delay: 100 }));

  result.current('a');
  result.current('b');

  expect(callback).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(100));

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith([['a'], ['b']]);

  vi.useRealTimers();
});

it('Should cleanup on unmount', () => {
  vi.useFakeTimers();
  const callback = vi.fn();

  const { result, unmount } = renderHook(() =>
    useBatchedCallback(callback, { size: 3, delay: 100 })
  );

  result.current('a');
  result.current.cancel();

  unmount();

  act(() => vi.advanceTimersByTime(100));

  expect(callback).not.toHaveBeenCalled();
});
