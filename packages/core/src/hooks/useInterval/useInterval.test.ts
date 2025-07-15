import { act, renderHook } from '@testing-library/react';

import { useInterval } from './useInterval';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
});

it('Should use interval', () => {
  const { result } = renderHook(() => useInterval(vi.fn, 1000));
  expect(result.current.active).toBeTruthy();
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
});

it('Should pause and resume properly', () => {
  const { result } = renderHook(() => useInterval(vi.fn, 1000));
  const { pause, resume } = result.current;

  expect(result.current.active).toBeTruthy();
  act(pause);
  expect(result.current.active).toBeFalsy();
  act(resume);
  expect(result.current.active).toBeTruthy();
});

it('Should not be active when not immediately', () => {
  const { result } = renderHook(() => useInterval(vi.fn, 1000, { immediately: false }));

  expect(result.current.active).toBeFalsy();
});

it('Should handle interval changes', () => {
  const callback = vi.fn();
  const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

  const { result, rerender } = renderHook((interval) => useInterval(callback, interval), {
    initialProps: 1000
  });

  expect(result.current.active).toBeTruthy();
  act(() => vi.advanceTimersByTime(1000));
  expect(callback).toHaveBeenCalledTimes(1);

  rerender(500);

  expect(clearIntervalSpy).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(500));
  expect(callback).toHaveBeenCalledTimes(2);
});

it('Should call callback on interval', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useInterval(callback, 1000));

  expect(result.current.active).toBeTruthy();
  act(() => vi.advanceTimersByTime(1000));

  expect(callback).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(1000));
  expect(callback).toBeCalledTimes(2);
});

it('Should clean up on unmount', () => {
  const callback = vi.fn();
  const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

  const { unmount } = renderHook(() => useInterval(callback, 1000));

  unmount();

  expect(clearIntervalSpy).toHaveBeenCalledOnce();
});
