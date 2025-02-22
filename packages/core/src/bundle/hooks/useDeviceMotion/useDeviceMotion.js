import { useEffect, useRef, useState } from 'react';

import { throttle } from '@/utils/helpers';
/**
 * @name useDeviceMotion
 * @description - Hook that work with device motion
 * @category Utilities
 *
 * @param {number} [delay] The delay in milliseconds
 * @param {(event: DeviceMotionEvent) => void} [callback] The callback function to be invoked
 * @param {boolean} [enabled] Whether to enable the hook
 * @returns {UseDeviceMotionReturn} The device motion data and interval
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion();
 */
export const useDeviceMotion = (params) => {
  const enabled = params?.enabled ?? true;
  const delay = params?.delay ?? 1000;
  const [value, setValue] = useState({
    interval: 0,
    rotationRate: { alpha: null, beta: null, gamma: null },
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null }
  });
  const internalCallbackRef = useRef(params?.callback);
  internalCallbackRef.current = params?.callback;
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
