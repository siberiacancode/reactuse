import { useState } from 'react';

import { useInterval } from '../useInterval/useInterval';
import { useRaf } from '../useRaf/useRaf';

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
  /** Use RAF instead of setInterval (updateInterval will be ignored)*/
  useRaf?: boolean;
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
 * @param {boolean} [options.useRaf=false] Use RAF instead of setInterval (updateInterval will be ignored)
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch(1000, { enabled: false, updateInterval: 1000 });
 *
 * @overload
 * @param {number} [options.initialTime=0] -The initial time of the timer
 * @param {boolean} [options.enabled=true] The enabled state of the timer
 * @param {number} [options.updateInterval=1000] The update interval of the timer
 * @param {boolean} [options.useRaf=false] Use RAF instead of setInterval (updateInterval will be ignored)
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

  const smooth = options?.useRaf ?? false;
  const enabled = options?.enabled ?? true;
  const updateInterval = options?.updateInterval ?? 1000;

  const [milliseconds, setMilliseconds] = useState(initialTime);
  const [timestamp, setTimestamp] = useState(Date.now() - initialTime);

  const interval = useInterval(
    () => setMilliseconds(getMillsDiffOrZero(timestamp)),
    updateInterval,
    {
      immediately: enabled && !smooth
    }
  );

  const raf = useRaf(() => setMilliseconds(getMillsDiffOrZero(timestamp)), {
    enabled: enabled && smooth
  });

  const isRunning = smooth ? raf.active : interval.active;

  const start = () => {
    if (isRunning) return;

    setTimestamp(new Date().getTime() - milliseconds);

    if (smooth) {
      raf.resume();
    } else {
      interval.resume();
    }
  };

  const pause = () => {
    if (!isRunning) return;

    setMilliseconds(getMillsDiffOrZero(timestamp));

    if (smooth) {
      raf.pause();
    } else {
      interval.pause();
    }
  };

  const reset = () => {
    setMilliseconds(initialTime);
    setTimestamp(Date.now() - initialTime);

    if (smooth) {
      raf.resume();
    } else {
      interval.resume();
    }
  };

  return {
    ...getStopwatchTime(milliseconds),
    paused: !isRunning,
    pause,
    start,
    reset,
    toggle: () => (isRunning ? pause() : start())
  };
}) as UseStopwatch;
