import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useVibrate } from './useVibrate';

const mockNavigatorVibrate = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();

  Object.defineProperty(globalThis, 'navigator', {
    value: {
      ...globalThis.navigator,
      vibrate: mockNavigatorVibrate
    },
    writable: true
  });
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

it('Should use vibrate', () => {
  const { result } = renderHook(() => useVibrate(100));

  expect(result.current.supported).toBeTruthy();
  expect(result.current.active).toBeFalsy();
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
});

it('Should use vibrate on server side', () => {
  const { result } = renderHookServer(() => useVibrate(100));

  expect(result.current.supported).toBeFalsy();
  expect(result.current.active).toBeFalsy();
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
});

it('Should use vibrate for unsupported', () => {
  Object.defineProperty(globalThis.navigator, 'vibrate', {
    value: undefined,
    writable: true
  });

  const { result } = renderHook(() => useVibrate(100));

  expect(result.current.supported).toBeFalsy();
  expect(result.current.active).toBeFalsy();
});

it('Should trigger vibration with default pattern', () => {
  const { result } = renderHook(() => useVibrate(500));

  act(result.current.trigger);

  expect(mockNavigatorVibrate).toHaveBeenCalledWith(500);
  expect(mockNavigatorVibrate).toHaveBeenCalledOnce();
});

it('Should trigger vibration with custom pattern', () => {
  const { result } = renderHook(() => useVibrate(200));

  act(() => result.current.trigger(1000));

  expect(mockNavigatorVibrate).toHaveBeenCalledWith(1000);
  expect(mockNavigatorVibrate).toHaveBeenCalledOnce();
});

it('Should trigger vibration with array pattern', () => {
  const { result } = renderHook(() => useVibrate([100, 200, 300]));

  act(result.current.trigger);

  expect(mockNavigatorVibrate).toHaveBeenCalledWith([100, 200, 300]);
  expect(mockNavigatorVibrate).toHaveBeenCalledOnce();
});

it('Should stop vibration', () => {
  const { result } = renderHook(() => useVibrate(200, 1000));

  expect(result.current.active).toBeTruthy();

  act(result.current.stop);

  expect(mockNavigatorVibrate).toHaveBeenCalledTimes(1);
  expect(result.current.active).toBeFalsy();
});

it('Should start interval vibration automatically when interval exists', () => {
  const { result } = renderHook(() => useVibrate(100, 1000));

  expect(result.current.active).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(mockNavigatorVibrate).toHaveBeenCalledTimes(1);
  expect(mockNavigatorVibrate).toHaveBeenLastCalledWith(100);
});

it('Should not start interval vibration when interval do not exist', () => {
  const { result } = renderHook(() => useVibrate(200));

  expect(result.current.active).toBeFalsy();
  expect(mockNavigatorVibrate).not.toHaveBeenCalled();
});

it('Should pause interval vibration', () => {
  const { result } = renderHook(() => useVibrate(200, 1000));

  expect(result.current.active).toBeTruthy();

  act(result.current.pause);

  expect(result.current.active).toBeFalsy();

  act(() => vi.advanceTimersByTime(1000));

  expect(mockNavigatorVibrate).toHaveBeenCalledTimes(0);
});

it('Should resume interval vibration', () => {
  const { result } = renderHook(() => useVibrate(200, 1000));

  expect(result.current.active).toBeTruthy();

  act(result.current.pause);

  expect(result.current.active).toBeFalsy();

  act(() => vi.advanceTimersByTime(1000));

  act(result.current.resume);

  expect(result.current.active).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(mockNavigatorVibrate).toHaveBeenCalledTimes(1);
});

it('Should resume with custom interval', () => {
  const { result } = renderHook(() => useVibrate(200, 1000));

  act(result.current.pause);

  act(() => result.current.resume(500));

  expect(result.current.active).toBeTruthy();

  act(() => vi.advanceTimersByTime(500));

  expect(mockNavigatorVibrate).toHaveBeenCalledTimes(1);
});

it('Should handle interval changes', () => {
  const { result, rerender } = renderHook((interval) => useVibrate(200, interval), {
    initialProps: 1000
  });

  act(() => vi.advanceTimersByTime(500));
  expect(mockNavigatorVibrate).toHaveBeenCalledTimes(0);

  expect(result.current.active).toBeTruthy();

  rerender(500);

  expect(result.current.active).toBeTruthy();

  act(() => vi.advanceTimersByTime(500));

  expect(mockNavigatorVibrate).toHaveBeenCalledTimes(2);
});

it('Should cleanup interval on unmount', () => {
  const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
  const { result, unmount } = renderHook(() => useVibrate(200, 1000));

  expect(result.current.active).toBeTruthy();

  unmount();

  expect(clearIntervalSpy).toHaveBeenCalled();
  expect(mockNavigatorVibrate).toHaveBeenLastCalledWith(0);
});
