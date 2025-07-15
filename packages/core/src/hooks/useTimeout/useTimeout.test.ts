import { act, renderHook } from '@testing-library/react';

import { useTimeout } from './useTimeout';

beforeEach(() => {
  vi.useFakeTimers();
});

it('Should use timeout', () => {
  const { result } = renderHook(() => useTimeout(vi.fn(), 5000));

  expect(result.current.ready).toBeFalsy();
  expect(result.current.clear).toBeTypeOf('function');
});

it('Should call callback after the timer expires', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useTimeout(callback, 5000));

  act(() => vi.advanceTimersByTime(2500));
  expect(result.current.ready).toBeFalsy();
  expect(callback).toBeCalledTimes(0);

  act(() => vi.advanceTimersByTime(5000));

  expect(result.current.ready).toBeTruthy();
  expect(callback).toHaveBeenCalledOnce();
});

it('Should clear the timeout', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useTimeout(callback, 5000));

  act(() => {
    result.current.clear();
    vi.clearAllTimers();
  });

  expect(result.current.ready).toBeTruthy();
  expect(callback).not.toBeCalled();
});

it('Should clear up on unmount', () => {
  const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
  const { unmount } = renderHook(() => useTimeout(vi.fn(), 5000));

  unmount();

  expect(clearTimeoutSpy).toHaveBeenCalled();
});
