import { useEffect, useState } from 'react';

declare global {
  interface ScreenOrientation {
    lock: (orientation: OrientationLockType) => Promise<void>;
  }
}

/* The use device orientation value type */
export interface UseScreenOrientationValue {
  /** The current angle */
  angle: number;
  /** The current orientation type */
  orientationType: OrientationType;
}

/* The screen lock orientation type */
export type OrientationLockType =
  | 'any'
  | 'landscape-primary'
  | 'landscape-secondary'
  | 'landscape'
  | 'natural'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'portrait';

/* The use device orientation return type */
export interface useScreenOrientationReturn {
  /** Whether the screen orientation is supported */
  supported: boolean;
  /** The current screen orientation value */
  value: UseScreenOrientationValue;
  /** Lock the screen orientation */
  lock: (orientation: OrientationLockType) => void;
  /** Unlock the screen orientation */
  unlock: () => void;
}

/**
 * @name useScreenOrientation
 * @description - Hook that provides the current screen orientation
 * @category Sensors
 *
 * @browserapi screen.orientation https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 *
 * @returns {useScreenOrientationReturn} The current screen orientation
 *
 * @example
 * const { supported, value, lock, unlock } = useScreenOrientation();
 */
export const useScreenOrientation = (): useScreenOrientationReturn => {
  const supported =
    typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen;
  const screenOrientation = (supported ? window.screen.orientation : {}) as ScreenOrientation;

  const [value, setValue] = useState<UseScreenOrientationValue>(() => {
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

  const lock = (type: OrientationLockType) => {
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
