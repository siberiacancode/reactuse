import { useEffect, useRef, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';

/** The use interval options */
export interface UseIntervalOptions {
  /** Start the interval immediately */
  enabled?: boolean;
}

/** The use interval return type */
export interface UseIntervalReturn {
  /** Is the interval active */
  isActive: boolean;
  /** Pause the interval */
  pause: () => void;
  /** Resume the interval */
  resume: () => void;
}

type UseInterval = {
  (callback: () => void, interval?: number, options?: UseIntervalOptions): UseIntervalReturn;
  (callback: () => void, options?: UseIntervalOptions & { interval?: number }): UseIntervalReturn;
};

/**
 * @name useInterval
 * @description - Hook that makes and interval and returns controlling functions
 * @category Time
 *
 * @overload
 * @param {() => void} callback Any callback function
 * @param {number} [interval=1000] Time in milliseconds
 * @param {boolean} [options.immediate=true] Start the interval immediately
 * @returns {UseIntervalReturn}
 *
 * @example
 * const { isActive, pause, resume } = useInterval(() => console.log('inside interval'), 2500);
 *
 * @overload
 * @param {() => void} callback Any callback function
 * @param {number} [options.interval=1000] Time in milliseconds
 * @param {boolean} [options.immediate=true] Start the interval immediately
 *
 * @example
 * const { isActive, pause, resume } = useInterval(() => console.log('inside interval'), { interval: 2500 });
 */
export const useInterval = ((...params: any[]): UseIntervalReturn => {
  const callback = params[0] as () => void;
  const interval =
    ((typeof params[1] === 'number'
      ? params[1]
      : (params[1] as UseIntervalOptions & { interval?: number }).interval) as number) ?? 1000;
  const options =
    typeof params[1] === 'object'
      ? (params[1] as (UseIntervalOptions & { interval?: number }) | undefined)
      : (params[2] as UseIntervalOptions | undefined);
  const enabled = options?.enabled ?? true;

  const [isActive, setIsActive] = useState<boolean>(enabled ?? true);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();
  const internalCallback = useEvent(callback);

  useEffect(() => {
    if (!enabled) return;

    intervalIdRef.current = setInterval(internalCallback, interval);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [enabled, interval]);

  const pause = () => {
    setIsActive(false);
    clearInterval(intervalIdRef.current);
  };

  const resume = () => {
    if (interval <= 0) return;
    setIsActive(true);
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(internalCallback, interval);
  };

  return {
    isActive,
    pause,
    resume
  };
}) as UseInterval;
