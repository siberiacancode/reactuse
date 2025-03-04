import { useEffect, useRef, useState } from 'react';

/** The use interval options */
export interface UseIntervalOptions {
  /** Start the interval immediately */
  immediately?: boolean;
}

/** The use interval return type */
export interface UseIntervalReturn {
  /** Is the interval active */
  active: boolean;
  /** Pause the interval */
  pause: () => void;
  /** Resume the interval */
  resume: () => void;
  /** Toggle the interval */
  toggle: () => void;
}

interface UseInterval {
  (callback: () => void, interval?: number, options?: UseIntervalOptions): UseIntervalReturn;

  (callback: () => void, options?: UseIntervalOptions & { interval?: number }): UseIntervalReturn;
}

/**
 * @name useInterval
 * @description - Hook that makes and interval and returns controlling functions
 * @category Time
 *
 * @overload
 * @param {() => void} callback Any callback function
 * @param {number} [interval=1000] Time in milliseconds
 * @param {boolean} [options.immediately=true] Start the interval immediately
 * @returns {UseIntervalReturn}
 *
 * @example
 * const { active, pause, resume, toggle } = useInterval(() => console.log('inside interval'), 2500);
 *
 * @overload
 * @param {() => void} callback Any callback function
 * @param {number} [options.interval=1000] Time in milliseconds
 * @param {boolean} [options.immediately=true] Start the interval immediately
 *
 * @example
 * const { active, pause, resume, toggle } = useInterval(() => console.log('inside interval'), { interval: 2500 });
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
  const immediately = options?.immediately ?? true;

  const [active, setActive] = useState<boolean>(immediately ?? true);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    intervalIdRef.current = setInterval(() => internalCallbackRef.current(), interval);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [active, interval]);

  const pause = () => setActive(false);

  const resume = () => {
    if (interval <= 0) return;
    setActive(true);
  };

  const toggle = () => setActive(!active);

  return {
    active,
    pause,
    resume,
    toggle
  };
}) as UseInterval;
