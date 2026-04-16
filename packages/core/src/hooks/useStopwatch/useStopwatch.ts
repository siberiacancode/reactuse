import { useEffect, useState } from 'react';

const getStopwatchTime = (time: number) => {
  if (!time)
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      count: 0
    };

  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return { days, hours, minutes, seconds, count: time };
};

/** The use stopwatch return type */
export interface UseStopwatchReturn {
  /** The total count of the stopwatch */
  count: number;
  /** The day count of the stopwatch */
  days: number;
  /** The hour count of the stopwatch */
  hours: number;
  /** The minute count of the stopwatch */
  minutes: number;
  /** The paused state of the stopwatch */
  paused: boolean;
  /** The second count of the stopwatch */
  seconds: number;
  /** The function to pause the stopwatch */
  pause: () => void;
  /** The function to reset the stopwatch */
  reset: () => void;
  /** The function to start the stopwatch */
  start: () => void;
  /** The function to toggle the stopwatch */
  toggle: (active?: boolean) => void;
}

/** The use stopwatch options */
export interface UseStopwatchOptions {
  /** The immediately state of the timer */
  immediately?: boolean;
}

interface UseStopwatch {
  (initialTime?: number, options?: UseStopwatchOptions): UseStopwatchReturn;
  (options?: UseStopwatchOptions & { initialTime?: number }): UseStopwatchReturn;
}
/**
 * @name useStopwatch
 * @description - Hook that creates a stopwatch functionality
 * @category Time
 * @usage high
 *
 * @overload
 * @param {number} [initialTime=0] The initial time of the timer
 * @param {boolean} [options.immediately=false] Start the stopwatch immediately
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch(1000, { immediately: false });
 *
 * @overload
 * @param {number} [options.initialTime=0] The initial time of the timer
 * @param {boolean} [options.immediately=false] Start the stopwatch immediately
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch({ initialTime: 1000, immediately: false });
 */
export const useStopwatch = ((...params: any[]) => {
  const initialTime =
    (typeof params[0] === 'number'
      ? (params[0] as number | undefined)
      : (params[0] as UseStopwatchOptions & { initialTime?: number })?.initialTime) ?? 0;

  const options =
    typeof params[0] === 'number'
      ? (params[1] as UseStopwatchOptions | undefined)
      : (params[0] as (UseStopwatchOptions & { initialTime?: number }) | undefined);

  const immediately = options?.immediately ?? false;

  const [count, setCount] = useState(initialTime);
  const [paused, setPaused] = useState(!immediately);

  useEffect(() => {
    setCount(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (paused) return;
    const onInterval = () => {
      setCount((currentCount) => currentCount + 1);
    };

    const interval = setInterval(onInterval, 1000);
    return () => clearInterval(interval);
  }, [paused]);

  const time = getStopwatchTime(count);

  const pause = () => setPaused(true);
  const start = () => setPaused(false);
  const reset = () => setCount(initialTime);
  const toggle = (active = !paused) => setPaused(active);

  return {
    ...time,
    paused,
    pause,
    start,
    reset,
    toggle
  };
}) as UseStopwatch;
