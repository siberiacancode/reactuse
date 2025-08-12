import { useEffect, useState } from 'react';

declare global {
  interface ScreenOrientation {
    lock: (orientation: OrientationLockType) => Promise<void>;
  }
}

/* The use device orientation value type */
export interface UseOrientationValue {
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
export interface useOrientationReturn {
  /** Whether the screen orientation is supported */
  supported: boolean;
  /** The current screen orientation value */
  value: UseOrientationValue;
  /** Lock the screen orientation */
  lock: (orientation: OrientationLockType) => void;
  /** Unlock the screen orientation */
  unlock: () => void;
}

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
export const useOrientation = (): useOrientationReturn => {
  const supported =
    typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen;
  const orientation = (supported ? window.screen.orientation : {}) as ScreenOrientation;

  const [value, setValue] = useState<UseOrientationValue>(() => {
    return {
      angle: orientation?.angle ?? 0,
      orientationType: orientation?.type
    };
  });

  useEffect(() => {
    if (!supported) return;

    const onOrientationChange = () =>
      setValue({
        angle: orientation.angle,
        orientationType: orientation.type
      });

    window.addEventListener('orientationchange', onOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  });

  const lock = (type: OrientationLockType) => {
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
