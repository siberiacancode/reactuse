import { useEffect, useRef, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';
/**
 * @name useInterval
 * @description - Hook that makes and interval and returns controlling functions
 * @category Time
 *
 * @overload
 * @param {() => void} callback Any callback function
 * @param {number} [interval] Time in milliseconds
 * @param {boolean} [options.enabled] Start the interval immediately
 * @returns {UseIntervalReturn}
 *
 * @example
 * const { active, pause, resume } = useInterval(() => console.log('inside interval'), 2500);
 *
 * @overload
 * @param {() => void} callback Any callback function
 * @param {number} [options.interval] Time in milliseconds
 * @param {boolean} [options.enabled] Start the interval immediately
 *
 * @example
 * const { active, pause, resume } = useInterval(() => console.log('inside interval'), { interval: 2500 });
 */
export const useInterval = (...params) => {
  const callback = params[0];
  const interval = (typeof params[1] === 'number' ? params[1] : params[1].interval) ?? 1000;
  const options = typeof params[1] === 'object' ? params[1] : params[2];
  const enabled = options?.enabled ?? true;
  const [active, setActive] = useState(enabled ?? true);
  const intervalIdRef = useRef();
  const internalCallback = useEvent(callback);
  useEffect(() => {
    if (!enabled) return;
    intervalIdRef.current = setInterval(internalCallback, interval);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [enabled, interval]);
  const pause = () => {
    setActive(false);
    clearInterval(intervalIdRef.current);
  };
  const resume = () => {
    if (interval <= 0) return;
    setActive(true);
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(internalCallback, interval);
  };
  return {
    active,
    pause,
    resume
  };
};
