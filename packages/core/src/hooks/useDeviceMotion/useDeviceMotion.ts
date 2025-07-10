import { useEffect, useRef, useState } from 'react';

import { throttle } from '@/utils/helpers';

export interface UseDeviceMotionReturn {
  acceleration: DeviceMotionEventAcceleration;
  accelerationIncludingGravity: DeviceMotionEventAcceleration;
  interval: DeviceMotionEvent['interval'];
  rotationRate: DeviceMotionEventRotationRate;
}

export interface UseDeviceMotionParams {
  /** The delay in milliseconds */
  delay?: number;
  /** Whether to enable the hook */
  enabled?: boolean;
  /** The callback function to be invoked */
  callback?: (event: DeviceMotionEvent) => void;
}

/**
 * @name useDeviceMotion
 * @description - Hook that work with device motion
 * @category Utilities
 *
 * @browserapi DeviceMotionEvent https://developer.mozilla.org/en-US/docs/Web/API/Window/DeviceMotionEvent
 *
 * @param {number} [delay=1000] The delay in milliseconds
 * @param {(event: DeviceMotionEvent) => void} [callback] The callback function to be invoked
 * @param {boolean} [enabled=true] Whether to enable the hook
 * @returns {UseDeviceMotionReturn} The device motion data and interval
 *
 * @example
 * const { interval, rotationRate, acceleration, accelerationIncludingGravity } = useDeviceMotion();
 */
export const useDeviceMotion = (params?: UseDeviceMotionParams) => {
  const enabled = params?.enabled ?? true;
  const delay = params?.delay ?? 1000;
  const [value, setValue] = useState<UseDeviceMotionReturn>({
    interval: 0,
    rotationRate: { alpha: null, beta: null, gamma: null },
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null }
  });
  const internalCallbackRef = useRef(params?.callback);
  internalCallbackRef.current = params?.callback;

  useEffect(() => {
    if (!enabled) return;

    const onDeviceMotion = throttle<[DeviceMotionEvent]>((event) => {
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
