import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

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

  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.snapshot.interval).toBe(0);
  expect(result.current.snapshot.rotationRate).toEqual({
    alpha: null,
    beta: null,
    gamma: null
  });
  expect(result.current.snapshot.acceleration).toEqual({ x: null, y: null, z: null });
  expect(result.current.snapshot.accelerationIncludingGravity).toEqual({
    x: null,
    y: null,
    z: null
  });
});

it('Should use device motion on server side', () => {
  const { result } = renderHookServer(useDeviceMotion);

  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.snapshot.interval).toBe(0);
  expect(result.current.snapshot.rotationRate).toEqual({
    alpha: null,
    beta: null,
    gamma: null
  });
  expect(result.current.snapshot.acceleration).toEqual({ x: null, y: null, z: null });
  expect(result.current.snapshot.accelerationIncludingGravity).toEqual({
    x: null,
    y: null,
    z: null
  });
});

it('Should return reactive value on watch', () => {
  const { result } = renderHook(useDeviceMotion);

  act(() => result.current.watch());
  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));

  expect(result.current.snapshot).toEqual({
    interval: DEVICE_MOTION_EVENT_INIT.interval,
    rotationRate: DEVICE_MOTION_EVENT_INIT.rotationRate,
    acceleration: DEVICE_MOTION_EVENT_INIT.acceleration,
    accelerationIncludingGravity: DEVICE_MOTION_EVENT_INIT.accelerationIncludingGravity
  });
});

it('Should call callback when motion detected', () => {
  const onChange = vi.fn();
  renderHook(() => useDeviceMotion({ onChange }));
  const event = new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT);

  act(() => window.dispatchEvent(event));

  expect(onChange).toHaveBeenCalledWith(event);
});

it('Should be listen enabled param', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

  const { rerender } = renderHook(({ enabled }) => useDeviceMotion({ enabled }), {
    initialProps: { enabled: false }
  });

  expect(addEventListenerSpy).not.toHaveBeenCalledWith('devicemotion', expect.any(Function));

  rerender({ enabled: true });

  expect(addEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function));
});

it('Should handle events without throttling', () => {
  const onChange = vi.fn();
  renderHook(() => useDeviceMotion({ onChange }));

  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));
  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));

  expect(onChange).toBeCalledTimes(2);
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

it('Should handle callback', () => {
  const callback = vi.fn();
  renderHook(() => useDeviceMotion(callback));

  act(() => window.dispatchEvent(new DeviceMotionEvent('devicemotion', DEVICE_MOTION_EVENT_INIT)));

  expect(callback).toHaveBeenCalledOnce();
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(useDeviceMotion);

  expect(addEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function));
});
