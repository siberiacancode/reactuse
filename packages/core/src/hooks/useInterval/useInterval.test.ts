import { act, renderHook } from '@testing-library/react';

import { useInterval } from './useInterval';

beforeEach(() => {
  vi.useFakeTimers();
});

it('Should use interval', () => {
  const { result } = renderHook(() => useInterval(vi.fn, 1000));
  expect(result.current.active).toBeTruthy();
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
});

it('Should pause and resume properly', () => {
  const { result } = renderHook(() => useInterval(() => {}, 1000));
  const { pause, resume } = result.current;

  expect(result.current.active).toBeTruthy();
  act(pause);
  expect(result.current.active).toBeFalsy();
  act(resume);
  expect(result.current.active).toBeTruthy();
});

it('Should not be active when disabled', () => {
  const { result } = renderHook(() => useInterval(() => {}, 1000, { enabled: false }));

  expect(result.current.active).toBeFalsy();
});

it('Should update active state on rerender', () => {
  const { result, rerender } = renderHook(
    (enabled: boolean) => useInterval(() => {}, 1000, { enabled }),
    { initialProps: false }
  );

  expect(result.current.active).toBeFalsy();

  rerender(true);

  expect(result.current.active).toBeTruthy();
});

it('Should call callback on interval', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useInterval(callback, 1000));

  expect(result.current.active).toBeTruthy();
  act(() => vi.advanceTimersByTime(1000));

  expect(callback).toBeCalledTimes(1);

  act(() => vi.advanceTimersByTime(1000));
  expect(callback).toBeCalledTimes(2);
});
