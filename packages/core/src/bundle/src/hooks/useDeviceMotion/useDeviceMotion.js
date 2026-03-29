import { useEffect, useRef, useState } from 'react';
import { throttle } from '@/utils/helpers';
/**
 * @name useDeviceMotion
 * @description - Hook that work with device motion
 * @category Sensors
 * @usage low
 *
 * @browserapi DeviceMotionEvent https://developer.mozilla.org/en-US/docs/Web/API/Window/DeviceMotionEvent
 *
 * @overload
 * @param {number} [delay=1000] The delay in milliseconds
 * @param {(event: DeviceMotionEvent) => void} [callback] The callback function to be invoked
 * @returns {UseDeviceMotionReturn} The device motion data and interval
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion(500, (event) => console.log(event));
 *
 * @overload
 * @param {(event: DeviceMotionEvent) => void} [callback] The callback function to be invoked
 * @returns {UseDeviceMotionReturn} The device motion data and interval
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion((event) => console.log(event));
 *
 * @overload
 * @param {UseDeviceMotionOptions} [options] Configuration options
 * @param {number} [options.delay] The delay in milliseconds
 * @param {boolean} [options.enabled] Whether to enable the hook
 * @param {(event: DeviceMotionEvent) => void} [options.onChange] The callback function to be invoked
 * @returns {UseDeviceMotionReturn} The device motion data and interval
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion();
 */
export const useDeviceMotion = (...params) => {
  const delay = typeof params[0] === 'number' ? params[0] : (params[0]?.delay ?? 1000);
  const callback = typeof params[0] === 'function' ? params[0] : params[0]?.onChange;
  const enabled = params[0]?.enabled ?? true;
  const [value, setValue] = useState({
    interval: 0,
    rotationRate: { alpha: null, beta: null, gamma: null },
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null }
  });
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  useEffect(() => {
    if (!enabled) return;
    const onDeviceMotion = throttle((event) => {
      internalCallbackRef.current?.(event);
      setValue({
        interval: event.interval,
        rotationRate: {
          ...value.rotationRate,
          ...event.rotationRate
        },
        acceleration: {
          ...value.acceleration,
          ...event.acceleration
        },
        accelerationIncludingGravity: {
          ...value.accelerationIncludingGravity,
          ...event.accelerationIncludingGravity
        }
      });
    }, delay);
    window.addEventListener('devicemotion', onDeviceMotion);
    return () => {
      window.removeEventListener('devicemotion', onDeviceMotion);
    };
  }, [delay, enabled]);
  return value;
};
