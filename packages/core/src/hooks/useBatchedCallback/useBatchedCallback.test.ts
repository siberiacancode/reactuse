import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useBatchedCallback } from './useBatchedCallback';

it('Should use batched callback', () => {
  const { result } = renderHook(() => useBatchedCallback(vi.fn(), 3));

  expect(result.current).toBeTypeOf('function');
  expect(result.current.flush).toBeTypeOf('function');
  expect(result.current.cancel).toBeTypeOf('function');
});

it('Should use batched callback on server side', () => {
  const { result } = renderHookServer(() => useBatchedCallback(vi.fn(), 3));

  expect(result.current).toBeTypeOf('function');
  expect(result.current.flush).toBeTypeOf('function');
  expect(result.current.cancel).toBeTypeOf('function');
});

it('Should flush when batch size reached', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, 3));

  result.current('a');
  result.current('b');
  result.current('c');

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith([['a'], ['b'], ['c']]);
});

it('Should flush manually', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, 5));

  result.current('a');

  result.current.flush();

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith([['a']]);
});

it('Should cancel pending batch', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, 5));

  result.current('a');
  result.current.cancel();
  result.current.flush();

  expect(callback).not.toHaveBeenCalled();
});
