import { useEffect, useRef, useState } from 'react';

/** The use vibrate pattern type */
export type UseVibratePattern = number | number[];

/** The use vibrate params type */
export interface UseVibrateParams {
  /** Time in milliseconds between vibrations */
  interval?: number;
  /** Pattern for vibration */
  pattern: UseVibratePattern;
}

/** The use vibrate return type */
export interface UseVibrateReturn {
  /** The support indicator */
  supported: boolean;
  /** The vibrating indicator */
  vibrating: boolean;
  /** The pause function */
  pause: () => void;
  /** The resume function */
  resume: () => void;
  /** The stop function */
  stop: () => void;
  /** The vibrate function */
  vibrate: (pattern?: UseVibratePattern) => void;
}

/**
 * @name useVibrate
 * @description - Hook that provides vibrate api
 * @category Browser
 *
 * @overload
 * @param {UseVibratePattern} options.pattern The pattern for vibration
 * @param {number} [options.interval = 0] Time in milliseconds between vibrations
 * @returns {UseVibrateReturn} An object containing support indicator, start vibration and stop vibration functions
 *
 * @example
 * const { supported, vibrating, vibrate, stop } = useVibrate(1000);
 */
export const useVibrate = (params: UseVibrateParams) => {
  const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const interval = params.interval ?? 0;
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();
  const [vibrating, setVibrating] = useState(false);

  const vibrate = (pattern: UseVibratePattern = params.pattern) => {
    if (!supported) return;
    navigator.vibrate(pattern);
    setVibrating(true);
  };

  const stop = () => {
    if (!supported) return;

    setVibrating(false);
    navigator.vibrate(0);

    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const pause = () => {
    if (!supported) return;
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const resume = () => {
    if (!supported) return;
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(vibrate, interval);
  };

  useEffect(() => {
    if (!supported || typeof params.interval === 'undefined') return;
    intervalIdRef.current = setInterval(vibrate, interval);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [params.interval, params.pattern]);

  return { supported, vibrate, stop, vibrating, pause, resume };
};
