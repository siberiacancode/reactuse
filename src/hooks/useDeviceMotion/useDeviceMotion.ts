import { useEffect, useRef, useState } from 'react';

import { throttle } from '@/utils/helpers';

export interface DeviceMotionData {
  interval: DeviceMotionEvent['interval'];
  rotationRate: Exclude<DeviceMotionEvent['rotationRate'], null>;
  acceleration: Exclude<DeviceMotionEvent['acceleration'], null>;
  accelerationIncludingGravity: Exclude<
    DeviceMotionEvent['accelerationIncludingGravity'],
    null
  >;
}

/**
 * @name useDeviceMotion
 * @description Hook that provides DeviceMotionEvent data
 * @category Utilities
 *
 * @param {number} delay The data update delay
 * @param {Function} callback The event listener callback
 * @returns {DeviceMotionData} DeviceMotionEvent data
 */
export const useDeviceMotion = (
  delay: number,
  callback?: (event: DeviceMotionEvent) => void
) => {
  const [deviceMotionData, setDeviceMotionData] = useState<DeviceMotionData>({
    interval: 0,
    rotationRate: { alpha: null, beta: null, gamma: null },
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null }
  });
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    const onDeviceMotion = throttle<[DeviceMotionEvent]>((event) => {
      internalCallbackRef.current?.(event);
      setDeviceMotionData((prevState) => ({
        interval: event.interval,
        rotationRate: {
          ...prevState.rotationRate,
          ...event.rotationRate
        },
        acceleration: {
          ...prevState.acceleration,
          ...event.acceleration
        },
        accelerationIncludingGravity: {
          ...prevState.accelerationIncludingGravity,
          ...event.accelerationIncludingGravity
        }
      }));
    }, delay);

    window.addEventListener('devicemotion', onDeviceMotion);

    return () => {
      window.removeEventListener('devicemotion', onDeviceMotion);
    };
  }, [delay]);

  return deviceMotionData;
};
