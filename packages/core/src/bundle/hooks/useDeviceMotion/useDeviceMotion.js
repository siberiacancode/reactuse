import { useEffect, useRef } from 'react';
import { useRerender } from '../useRerender/useRerender';
/**
 * @name useDeviceMotion
 * @description - Hook that work with device motion
 * @category Sensors
 * @usage low
 *
 * @browserapi DeviceMotionEvent https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/DeviceMotionEvent
 *
 * @overload
 * @param {(event: DeviceMotionEvent) => void} [callback] The callback function to be invoked
 * @returns {UseDeviceMotionReturn} Device motion controls with snapshot/watch API
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion((event) => console.log(event)).watch();
 *
 * @overload
 * @param {UseDeviceMotionOptions} [options] Configuration options
 * @param {boolean} [options.enabled] Whether to enable the hook
 * @param {(event: DeviceMotionEvent) => void} [options.onChange] The callback function to be invoked
 * @returns {UseDeviceMotionReturn} Device motion controls with snapshot/watch API
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion().watch();
 */
export const useDeviceMotion = (...params) => {
  const callback = typeof params[0] === 'function' ? params[0] : params[0]?.onChange;
  const enabled = typeof params[0] === 'object' ? (params[0]?.enabled ?? true) : true;
  const snapshotRef = useRef({
    interval: 0,
    rotationRate: { alpha: null, beta: null, gamma: null },
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null }
  });
  const internalCallbackRef = useRef(callback);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  internalCallbackRef.current = callback;
  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };
  const updateValue = (value) => {
    snapshotRef.current = value;
    if (watchingRef.current) rerender();
  };
  useEffect(() => {
    if (!enabled) return;
    const onDeviceMotion = (event) => {
      internalCallbackRef.current?.(event);
      updateValue({
        interval: event.interval,
        rotationRate: {
          ...snapshotRef.current.rotationRate,
          ...event.rotationRate
        },
        acceleration: {
          ...snapshotRef.current.acceleration,
          ...event.acceleration
        },
        accelerationIncludingGravity: {
          ...snapshotRef.current.accelerationIncludingGravity,
          ...event.accelerationIncludingGravity
        }
      });
    };
    window.addEventListener('devicemotion', onDeviceMotion);
    return () => {
      window.removeEventListener('devicemotion', onDeviceMotion);
    };
  }, [enabled]);
  return {
    snapshot: snapshotRef.current,
    watch
  };
};
