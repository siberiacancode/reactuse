import { useEffect, useState } from 'react';
/**
 * @name useOrientation
 * @description - Hook that provides the current screen orientation
 * @category Sensors
 * @usage low
 *
 * @browserapi screen.orientation https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 *
 * @returns {useOrientationReturn} The current screen orientation
 *
 * @example
 * const { supported, value, lock, unlock } = useOrientation();
 */
export const useOrientation = () => {
  const supported =
    typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen;
  const orientation = supported ? window.screen.orientation : {};
  const [value, setValue] = useState({
    angle: orientation.angle ?? 0,
    orientationType: orientation.type
  });
  useEffect(() => {
    if (!supported) return;
    const onOrientationChange = () =>
      setValue({
        angle: window.screen.orientation.angle,
        orientationType: window.screen.orientation.type
      });
    window.addEventListener('orientationchange', onOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  }, []);
  const lock = (type) => {
    if (supported && typeof orientation.lock === 'function') return orientation.lock(type);
  };
  const unlock = () => {
    if (supported && typeof orientation.unlock === 'function') orientation.unlock();
  };
  return {
    supported,
    value,
    lock,
    unlock
  };
};
