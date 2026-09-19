import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useBatchedCallback } from './useBatchedCallback';

beforeEach(vi.useFakeTimers);
afterEach(vi.useRealTimers);

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

it('Should flush after default delay', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 3 }));

  result.current('a');

  act(() => vi.advanceTimersByTime(999));
  expect(callback).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['a']]);
});

it('Should disable delayed flushing for zero delay', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 3, delay: 0 }));

  result.current('a');

  act(() => vi.runAllTimers());
  expect(callback).not.toHaveBeenCalled();

  result.current.flush();
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['a']]);
});

it('Should flush when size is below the minimum', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 0, delay: 0 }));

  result.current('a');

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['a']]);
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

it('Should preserve argument tuples in batch', () => {
  const callback = vi.fn();

  const { result } = renderHook(() =>
    useBatchedCallback<[string, number]>(callback, { size: 2, delay: 0 })
  );

  result.current('a', 1);
  result.current('b', 2);

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([
    ['a', 1],
    ['b', 2]
  ]);
});

it('Should keep consecutive batches isolated', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 2, delay: 0 }));

  result.current('a');
  result.current('b');
  result.current('c');
  result.current('d');

  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenNthCalledWith(1, [['a'], ['b']]);
  expect(callback).toHaveBeenNthCalledWith(2, [['c'], ['d']]);
});

it('Should flush manually', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 5, delay: 100 }));

  result.current('a');

  act(() => vi.advanceTimersByTime(50));
  result.current.flush();

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['a']]);

  result.current('b');

  act(() => vi.advanceTimersByTime(50));
  expect(callback).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(50));
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith([['b']]);
});

it('Should cancel pending batch', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 5, delay: 100 }));

  result.current('a');

  act(() => vi.advanceTimersByTime(50));
  result.current.cancel();
  result.current.flush();

  expect(callback).not.toHaveBeenCalled();

  result.current('b');

  act(() => vi.advanceTimersByTime(50));
  expect(callback).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(50));
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['b']]);
});

it('Should flush by delay when batch size not reached', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 3, delay: 100 }));

  result.current('a');
  result.current('b');

  expect(callback).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(99));
  expect(callback).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['a'], ['b']]);
});

it('Should start next batch delay from its first call', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useBatchedCallback(callback, { size: 3, delay: 100 }));

  result.current('a');

  act(() => vi.advanceTimersByTime(50));
  result.current('b');

  act(() => vi.advanceTimersByTime(50));
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['a'], ['b']]);

  result.current('c');

  act(() => vi.advanceTimersByTime(50));
  expect(callback).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(50));
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith([['c']]);
});

it('Should use latest callback', () => {
  const initialCallback = vi.fn();
  const callback = vi.fn();

  const { result, rerender } = renderHook(
    (callback) => useBatchedCallback(callback, { size: 3, delay: 0 }),
    { initialProps: initialCallback }
  );

  result.current('a');

  rerender(callback);
  result.current.flush();

  expect(initialCallback).not.toHaveBeenCalled();
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['a']]);
});

it('Should use latest size', () => {
  const callback = vi.fn();

  const { result, rerender } = renderHook(
    (size) => useBatchedCallback(callback, { size, delay: 0 }),
    { initialProps: 3 }
  );

  result.current('a');

  rerender(2);
  result.current('b');

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith([['a'], ['b']]);
});

it('Should apply updated delay to subsequent batches', () => {
  const callback = vi.fn();

  const { result, rerender } = renderHook(
    (delay) => useBatchedCallback(callback, { size: 3, delay }),
    { initialProps: 100 }
  );

  result.current('a');

  act(() => vi.advanceTimersByTime(100));
  expect(callback).toHaveBeenCalledOnce();

  rerender(200);
  result.current('b');

  act(() => vi.advanceTimersByTime(199));
  expect(callback).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(1));
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith([['b']]);
});

it('Should cleanup on unmount', () => {
  const callback = vi.fn();

  const { result, unmount } = renderHook(() =>
    useBatchedCallback(callback, { size: 3, delay: 100 })
  );

  result.current('a');

  unmount();

  act(() => vi.advanceTimersByTime(100));

  expect(callback).not.toHaveBeenCalled();
});
