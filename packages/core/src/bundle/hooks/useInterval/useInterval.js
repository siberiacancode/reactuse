import { useEffect, useRef, useState } from 'react';
/**
 * @name useInterval
 * @description - Hook that makes and interval and returns controlling functions
 * @category Time
 * @usage high
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
export const useInterval = (...params) => {
  const callback = params[0];
  const interval = (typeof params[1] === 'number' ? params[1] : params[1].interval) ?? 1000;
  const options = typeof params[1] === 'object' ? params[1] : params[2];
  const immediately = options?.immediately ?? true;
  const [active, setActive] = useState(immediately ?? true);
  const intervalIdRef = useRef(undefined);
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
  const toggle = (value = !active) => setActive(value);
  return {
    active,
    pause,
    resume,
    toggle
  };
};
