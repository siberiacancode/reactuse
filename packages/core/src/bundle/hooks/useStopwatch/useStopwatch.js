import { useState } from 'react';
import { useInterval } from '../useInterval/useInterval';
import { useRaf } from '../useRaf/useRaf';
const getStopwatchTime = (count) => {
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
const getMillsDiffOrZero = (millis) => (Date.now() - millis > 0 ? Date.now() - millis : 0);
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
export const useStopwatch = (...params) => {
  const initialTime = (typeof params[0] === 'number' ? params[0] : params[0]?.initialTime) ?? 0;
  const options = typeof params[0] === 'number' ? params[1] : params[0];
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
};
