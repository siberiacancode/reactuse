import { useEffect, useState } from 'react';

import { isClient } from '@/utils/helpers';

/** The use vibration params */
export interface UseVibrateParams {
  /** Pattern for vibration */
  pattern: number | number[];
  /** Alternate way to enable vibration */
  enabled?: boolean;
  /** Indicates thar vibration will be endless */
  loop?: boolean;
}

/** The use vibration options */
export interface UseVibrateOptions {
  /** Alternate way to enable vibration */
  enabled?: boolean;
  /** Indicates thar vibration will be endless */
  loop?: boolean;
}

/** The use vibration return type */
export interface UseVibrateReturn {
  /** Indicates that the device supports Vibration API */
  isSupported: boolean;
  /** Indicates that the device is vibrating */
  isVibrating: boolean;
  /** Start vibration function */
  vibrate: (pattern?: number | number[]) => void;
  /** Stop vibration function */
  stop: () => void;
}

export type UseVibrate = {
  (pattern: number | number[], options?: UseVibrateOptions): UseVibrateReturn;
  ({ pattern, loop, enabled }: UseVibrateParams, options?: never): UseVibrateReturn;
};

let interval: NodeJS.Timeout;
/**
 * @name useVibrate
 * @description - Hook that provides Vibrate API
 * @category Browser
 *
 * @overload
 * @param {(number|number[])} pattern Pattern for vibration
 * @param {boolean} [options.loop] Indicates thar vibration will be endless
 * @param {boolean} [options.enabled] Alternate way to enable vibration
 * @returns {UseVibrateReturn} An object containing support indicator, start vibration and stop vibration functions
 *
 * @example
 * const { isSupported, isVibrating, vibrate, stop } = useVibrate(1000);
 *
 * @overload
 * @param {(number|number[])} params.pattern Pattern for vibration
 * @param {boolean} [params.loop] Indicates thar vibration will be endless
 * @param {boolean} [params.enabled] Alternate way to enable vibration
 * @returns {UseVibrateReturn} An object containing support indicator, vibrating indicator, start vibration and stop vibration functions
 *
 * @example
 * const { isSupported, isVibrating, vibrate, stop } = useVibrate({pattern: [200, 100, 200], loop: true});
 * */
export const useVibrate: UseVibrate = (...params) => {
  const pattern =
    typeof params[0] === 'number' || Array.isArray(params[0]) ? params[0] : params[0]?.pattern;
  const { loop, enabled } =
    typeof params[0] === 'number' || Array.isArray(params[0]) ? params[1] ?? {} : params[0] ?? {};

  const [isSupported, setIsSupported] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    if (isClient && navigator && 'vibrate' in navigator) {
      setIsSupported(true);
    }
  }, []);

  const vibrate = (curPattern = pattern) => {
    if (!isSupported || isVibrating) return;

    const duration = Array.isArray(curPattern) ? curPattern.reduce((a, b) => a + b) : curPattern;

    setIsVibrating(true);
    navigator.vibrate(curPattern);

    if (loop) {
      interval = setInterval(() => {
        navigator.vibrate(curPattern);
      }, duration);
    } else {
      setTimeout(() => {
        setIsVibrating(false);
      }, duration);
    }
  };

  const stop = () => {
    if (!isSupported) return;

    setIsVibrating(false);
    navigator.vibrate(0);

    if (loop) {
      clearInterval(interval);
    }
  };

  useEffect(() => {
    if (!isSupported || isVibrating) return;

    if (enabled) {
      vibrate();
    }

    return () => {
      if (enabled) {
        setIsVibrating(false);
        navigator.vibrate(0);

        if (loop) {
          clearInterval(interval);
        }
      }
    };
  }, [enabled]);

  return { isSupported, vibrate, stop, isVibrating } as const;
};
