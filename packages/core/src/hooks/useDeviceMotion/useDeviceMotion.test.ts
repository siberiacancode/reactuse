import { act, renderHook } from '@testing-library/react';

import { useDeviceMotion } from './useDeviceMotion';

const DEVICE_MOTION_EVENT_INIT: DeviceMotionEventInit = {
  interval: 16,
  rotationRate: {
    alpha: 1,
    beta: 2,
    gamma: 3
  },
  acceleration: {
    x: 4,
    y: 5,
    z: 6
  },
  accelerationIncludingGravity: {
    x: 7,
    y: 8,
    z: 9
  }
};

class MockDeviceMotionEvent extends Event {
  readonly acceleration: DeviceMotionEventAccelerationInit | null;
  readonly accelerationIncludingGravity: DeviceMotionEventAccelerationInit | null;
  readonly interval: number;
  readonly rotationRate: DeviceMotionEventRotationRateInit | null;

  constructor(type: string, deviceMotionEventInit?: DeviceMotionEventInit) {
    super(type);
    this.acceleration = deviceMotionEventInit?.acceleration ?? null;
    this.accelerationIncludingGravity = deviceMotionEventInit?.accelerationIncludingGravity ?? null;
    this.interval = deviceMotionEventInit?.interval ?? 0;
    this.rotationRate = deviceMotionEventInit?.rotationRate ?? null;
  }
}

globalThis.DeviceMotionEvent = MockDeviceMotionEvent as any;

it('Should use device motion', () => {
  const { result } = renderHook(useDeviceMotion);

  expect(result.current.interval).toBe(0);
  expect(result.current.rotationRate).toEqual({
    alpha: null,
    beta: null,
    gamma: null
  });
  expect(result.current.acceleration).toEqual({ x: null, y: null, z: null });
  expect(result.current.accelerationIncludingGravity).toEqual({
    x: null,
    y: null,
    z: null
  });
});

it('Should handle device motion event', () => {
  const { result } = renderHook(useDeviceMotion);

  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));

  expect(result.current).toEqual({
    interval: DEVICE_MOTION_EVENT_INIT.interval,
    rotationRate: DEVICE_MOTION_EVENT_INIT.rotationRate,
    acceleration: DEVICE_MOTION_EVENT_INIT.acceleration,
    accelerationIncludingGravity: DEVICE_MOTION_EVENT_INIT.accelerationIncludingGravity
  });
});

it('Should call callback when motion detected', () => {
  const onChange = vi.fn();
  renderHook(() => useDeviceMotion({ onChange }));

  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));

  expect(onChange).toBeCalledWith(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT));
});

it('Should be listen enabled param', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

  const { rerender } = renderHook(({ enabled }) => useDeviceMotion({ enabled }), {
    initialProps: { enabled: false }
  });

  expect(addEventListenerSpy).not.toBeCalledWith('devicemotion', expect.any(Function));

  rerender({ enabled: true });

  expect(addEventListenerSpy).toBeCalledWith('devicemotion', expect.any(Function));
});

it('Should disconnect on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(useDeviceMotion);

  unmount();

  expect(removeEventListenerSpy).toBeCalledWith('devicemotion', expect.any(Function));
});

it('Should throttle events by delay', () => {
  vi.useFakeTimers();
  const onChange = vi.fn();
  renderHook(() => useDeviceMotion({ onChange }));

  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));

  expect(onChange).toHaveBeenCalledOnce();

  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));

  act(() => vi.advanceTimersByTime(1000));

  expect(onChange).toBeCalledTimes(2);

  vi.useRealTimers();
});

it('Should update with new delay', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { rerender } = renderHook((delay: number) => useDeviceMotion({ delay }), {
    initialProps: 1000
  });

  expect(addEventListenerSpy).toHaveBeenCalledOnce();

  rerender(500);

  expect(removeEventListenerSpy).toHaveBeenCalledOnce();
  expect(addEventListenerSpy).toBeCalledTimes(2);
});

it('Should handle enabled changes', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { rerender } = renderHook((enabled) => useDeviceMotion({ enabled }), {
    initialProps: true
  });

  expect(addEventListenerSpy).toHaveBeenCalledOnce();

  rerender(false);

  expect(addEventListenerSpy).toHaveBeenCalledOnce();
  expect(removeEventListenerSpy).toHaveBeenCalledOnce();

  rerender(true);

  expect(addEventListenerSpy).toBeCalledTimes(2);
  expect(removeEventListenerSpy).toHaveBeenCalledOnce();
});

it('Should cleanup throttle on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(useDeviceMotion);

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function));
});

it('Should handle delay and callback', () => {
  const callback = vi.fn();
  renderHook(() => useDeviceMotion(callback, 1000));

  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));

  expect(callback).toHaveBeenCalledOnce();
});
