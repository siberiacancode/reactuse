import { useState } from 'react';

import { useInterval } from '../useInterval/useInterval';

const getStopwatchTime = (count: number) => {
  if (!count)
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      count: 0
    };

  const totalSeconds = Math.floor(count / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = count % 1000;

  return { days, hours, minutes, seconds, milliseconds, count };
};

const getMillsDiffOrZero = (millis: number) => (Date.now() - millis > 0 ? Date.now() - millis : 0);

/** The use stopwatch return type */
export interface UseStopwatchReturn {
  /** The total millisecond count of the stopwatch */
  count: number;
  /** The day count of the stopwatch */
  days: number;
  /** The hour count of the stopwatch */
  hours: number;
  /** The millisecond count of the stopwatch */
  milliseconds: number;
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
  toggle: () => void;
}

/** The use stopwatch options */
export interface UseStopwatchOptions {
  /** The enabled state of the timer */
  enabled?: boolean;
  /** The update interval of the timer */
  updateInterval?: number;
}

interface UseStopwatch {
  (initialTime?: number, options?: UseStopwatchOptions): UseStopwatchReturn;
  (options?: UseStopwatchOptions & { initialTime?: number }): UseStopwatchReturn;
}
/**
 * @name useStopwatch
 * @description - Hook that creates a stopwatch functionality
 * @category Time
 *
 * @overload
 * @param {number} [initialTime=0] The initial time of the timer
 * @param {boolean} [options.enabled=true] The enabled state of the timer
 * @param {number} [options.updateInterval=1000] The update interval of the timer
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch(1000, { enabled: false, updateInterval: 1000 });
 *
 * @overload
 * @param {number} [options.initialTime=0] -The initial time of the timer
 * @param {boolean} [options.enabled=true] The enabled state of the timer
 * @param {number} [options.updateInterval=1000] The update interval of the timer
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch({ initialTime: 1000, enabled: false, updateInterval: 1000 });
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

  const enabled = options?.enabled ?? true;
  const updateInterval = options?.updateInterval ?? 1000;

  const [milliseconds, setMilliseconds] = useState(initialTime);
  const [timestamp, setTimestamp] = useState(Date.now() - initialTime);

  const interval = useInterval(
    () => setMilliseconds(getMillsDiffOrZero(timestamp)),
    updateInterval,
    {
      immediately: enabled
    }
  );

  const start = () => {
    if (interval.active) return;

    setTimestamp(new Date().getTime() - milliseconds);

    interval.resume();
  };

  const pause = () => {
    if (!interval.active) return;

    setMilliseconds(getMillsDiffOrZero(timestamp));

    interval.pause();
  };

  const reset = () => {
    setMilliseconds(initialTime);
    setTimestamp(Date.now() - initialTime);

    interval.resume();
  };

  return {
    ...getStopwatchTime(milliseconds),
    paused: !interval.active,
    pause,
    start,
    reset,
    toggle: () => (interval.active ? pause() : start())
  };
}) as UseStopwatch;
