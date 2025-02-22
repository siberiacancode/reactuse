import { useEffect, useRef, useState } from 'react';

/** The use vibrate pattern type */
export type UseVibratePattern = number | number[];

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
  /** The start function */
  start: (interval: number) => void;
  /** The vibrate function */
  trigger: (pattern?: UseVibratePattern) => void;
}

/**
 * @name useVibrate
 * @description - Hook that provides vibrate api
 * @category Browser
 *
 * @overload
 * @param {UseVibratePattern} options.pattern The pattern for vibration
 * @param {number} [options.interval=0] Time in milliseconds between vibrations
 * @returns {UseVibrateReturn} An object containing support indicator, start vibration and stop vibration functions
 *
 * @example
 * const { supported, active, vibrate, stop, pause, resume } = useVibrate(1000);
 */
export const useVibrate = (pattern: UseVibratePattern, interval: number = 0) => {
  const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();
  const [active, setActive] = useState(false);

  const trigger = (internalPattern: UseVibratePattern = pattern) => {
    if (!supported) return;
    navigator.vibrate(internalPattern);
  };

  const stop = () => {
    if (!supported) return;
    navigator.vibrate(0);
    setActive(false);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const pause = () => {
    if (!supported) return;
    setActive(false);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const resume = (intervalInterval: number = interval) => {
    if (!supported) return;
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    setActive(true);
    intervalIdRef.current = setInterval(trigger, intervalInterval);
  };

  useEffect(() => {
    if (!supported || interval <= 0) return;
    resume(interval);
    return () => {
      stop();
    };
  }, [interval, pattern]);

  return { supported, trigger, stop, active, pause, resume };
};
