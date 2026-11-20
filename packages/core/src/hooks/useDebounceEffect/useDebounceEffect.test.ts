import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDebounceEffect } from './useDebounceEffect';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
});

it('Should use debounce effect', () => {
  const effect = vi.fn();
  renderHook(() => useDebounceEffect(effect, 100, []));

  act(() => vi.advanceTimersByTime(100));

  expect(effect).not.toHaveBeenCalled();
});

it('Should use debounce effect on server side', () => {
  const effect = vi.fn();
  renderHookServer(() => useDebounceEffect(effect, 100, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should debounce effect execution', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(({ value }) => useDebounceEffect(effect, 100, [value]), {
    initialProps: { value: 'initial value' }
  });

  expect(effect).not.toHaveBeenCalled();

  rerender({ value: 'new value' });

  act(() => vi.advanceTimersByTime(99));
  expect(effect).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(effect).toHaveBeenCalledOnce();
});

it('Should restart delay when dependencies change', () => {
  const effect = vi.fn();

  const { rerender } = renderHook((value) => useDebounceEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  rerender('second value');

  act(() => vi.advanceTimersByTime(99));
  expect(effect).not.toHaveBeenCalled();

  rerender('third value');

  act(() => vi.advanceTimersByTime(99));
  expect(effect).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(effect).toHaveBeenCalledOnce();
});

it('Should use latest effect', () => {
  const initialEffect = vi.fn();
  const effect = vi.fn();

  const { rerender } = renderHook(({ effect, value }) => useDebounceEffect(effect, 100, [value]), {
    initialProps: { effect: initialEffect, value: 'initial value' }
  });

  rerender({ effect, value: 'new value' });

  act(() => vi.advanceTimersByTime(100));

  expect(initialEffect).not.toHaveBeenCalled();
  expect(effect).toHaveBeenCalledOnce();
});

it('Should use latest delay', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(({ delay, value }) => useDebounceEffect(effect, delay, [value]), {
    initialProps: { delay: 100, value: 'initial value' }
  });

  rerender({ delay: 200, value: 'new value' });

  act(() => vi.advanceTimersByTime(199));
  expect(effect).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(1));
  expect(effect).toHaveBeenCalledOnce();
});

it('Should run effect after every rerender when dependencies are not passed', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(() => useDebounceEffect(effect, 100));

  rerender();

  act(() => vi.advanceTimersByTime(100));
  expect(effect).toHaveBeenCalledOnce();

  rerender();

  act(() => vi.advanceTimersByTime(100));
  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should cancel pending effect on unmount', () => {
  const effect = vi.fn();

  const { rerender, unmount } = renderHook((value) => useDebounceEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  rerender('new value');
  unmount();

  act(() => vi.advanceTimersByTime(100));

  expect(effect).not.toHaveBeenCalled();
});

it('Should cleanup before running the next effect', () => {
  const cleanup = vi.fn();
  const effect = vi.fn(() => cleanup);

  const { rerender, unmount } = renderHook((value) => useDebounceEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  rerender('second value');
  act(() => vi.advanceTimersByTime(100));

  rerender('third value');
  expect(cleanup).toHaveBeenCalledOnce();

  unmount();

  expect(cleanup).toHaveBeenCalledOnce();
});

it('Should cleanup on unmount', () => {
  const cleanup = vi.fn();
  const effect = vi.fn(() => cleanup);

  const { unmount, rerender } = renderHook((value) => useDebounceEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  expect(effect).not.toHaveBeenCalled();

  rerender('new value');

  act(() => vi.advanceTimersByTime(100));

  unmount();

  expect(cleanup).toHaveBeenCalledOnce();
});
