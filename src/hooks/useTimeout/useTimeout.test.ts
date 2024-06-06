import { act, renderHook } from '@testing-library/react';

import { useTimeout } from './useTimeout';

beforeEach(() => {
  vi.useFakeTimers();
});

it('Should not call callback at the start', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useTimeout(callback, 5000));

  expect(result.current.ready).toBeFalsy();
  expect(callback).not.toBeCalled();
});

it('Shoul not call callback unless the timer has expired', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useTimeout(callback, 5000));

  act(() => vi.advanceTimersByTime(4999));

  expect(result.current.ready).toBeFalsy();
  expect(callback).not.toBeCalled();
});

it('Should call callback after the timer expires', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useTimeout(callback, 5000));

  act(() => vi.runAllTimers());

  expect(result.current.ready).toBeTruthy();
  expect(callback).toBeCalledTimes(1);
});

it('Should not call callback after calling the cleaning function', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useTimeout(callback, 5000));

  act(() => {
    result.current.clear();
    vi.runAllTimers();
  });

  expect(callback).not.toBeCalled();
});

it('Should be ready after calling the cleaning function', () => {
  const { result } = renderHook(() => useTimeout(() => {}, 5000));

  act(() => result.current.clear());

  expect(result.current.ready).toBeTruthy();
});
