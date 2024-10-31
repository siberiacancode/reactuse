import { useEffect, useState } from 'react';

/* The use device orientation value type */
export interface UseDeviceOrientationValue {
  /** A number representing the motion of the device around the z axis, express in degrees with values ranging from 0 to 360 */
  alpha: number | null;
  /** A number representing the motion of the device around the x axis, express in degrees with values ranging from -180 to 180 */
  beta: number | null;
  /** A number representing the motion of the device around the y axis, express in degrees with values ranging from -90 to 90 */
  gamma: number | null;
  /** The current absolute value */
  absolute: boolean;
}

/* The use device orientation return type */
export interface UseDeviceOrientationReturn {
  /** Whether the device orientation is supported */
  supported: boolean;
  /** The current device orientation value */
  value: UseDeviceOrientationValue;
}

/**
 * @name useDeviceOrientation
 * @description - Hook that provides the current device orientation
 * @category Sensors
 *
 * @returns {UseDeviceOrientationReturn} The current device orientation
 *
 * @example
 * const { supported, value } = useDeviceOrientation();
 */
export const useDeviceOrientation = (): UseDeviceOrientationReturn => {
  const supported = window && 'DeviceOrientationEvent' in window;

  const [value, setValue] = useState<UseDeviceOrientationValue>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false
  });

  useEffect(() => {
    if (!supported) return;

    const onDeviceOrientation = (event: DeviceOrientationEvent) =>
      setValue({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute
      });

    window.addEventListener('deviceorientation', onDeviceOrientation);
    return () => {
      window.removeEventListener('deviceorientation', onDeviceOrientation);
    };
  }, []);

  return {
    supported,
    value
  };
};
