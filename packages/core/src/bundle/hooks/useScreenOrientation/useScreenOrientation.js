import { useEffect, useState } from 'react';
/**
 * @name useScreenOrientation
 * @description - Hook that provides the current screen orientation
 * @category Sensors
 *
 * @returns {useScreenOrientationReturn} The current screen orientation
 *
 * @example
 * const { supported, value, lock, unlock } = useScreenOrientation();
 */
export const useScreenOrientation = () => {
  const supported =
    typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen;
  const screenOrientation = supported ? window.screen.orientation : {};
  const [value, setValue] = useState(() => {
    return {
      angle: screenOrientation?.angle ?? 0,
      orientationType: screenOrientation?.type
    };
  });
  useEffect(() => {
    if (!supported) return;
    const onOrientationChange = () =>
      setValue({
        angle: screenOrientation.angle,
        orientationType: screenOrientation.type
      });
    window.addEventListener('orientationchange', onOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  });
  const lock = (type) => {
    if (supported && typeof screenOrientation.lock === 'function')
      return screenOrientation.lock(type);
  };
  const unlock = () => {
    if (supported && typeof screenOrientation.unlock === 'function') screenOrientation.unlock();
  };
  return {
    supported,
    value,
    lock,
    unlock
  };
};
