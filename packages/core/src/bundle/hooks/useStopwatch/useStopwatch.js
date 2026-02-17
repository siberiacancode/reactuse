import { useState } from 'react';
import { useInterval } from '../useInterval/useInterval';
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
 * @usage high
 *
 * @overload
 * @param {number} [initialTime=0] The initial time of the timer
 * @param {boolean} [options.immediately=false] The enabled state of the timer
 * @param {number} [options.updateInterval=1000] The update interval of the timer
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { milliseconds, seconds, minutes, start, pause, reset } = useStopwatch(1000, { immediately: false, updateInterval: 1000 });
 *
 * @overload
 * @param {number} [options.initialTime=0] -The initial time of the timer
 * @param {boolean} [options.immediately=true] The enabled state of the timer
 * @param {number} [options.updateInterval=1000] The update interval of the timer
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { milliseconds, seconds, minutes, start, pause, reset } = useStopwatch({ initialTime: 1000, immediately: false, updateInterval: 1000 });
 */
export const useStopwatch = (...params) => {
  const initialTime = (typeof params[0] === 'number' ? params[0] : params[0]?.initialTime) ?? 0;
  const options = typeof params[0] === 'number' ? params[1] : params[0];
  const immediately = options?.immediately ?? false;
  const updateInterval = options?.updateInterval ?? 1000;
  const [milliseconds, setMilliseconds] = useState(initialTime);
  const [timestamp, setTimestamp] = useState(Date.now() - initialTime);
  const interval = useInterval(
    () => setMilliseconds(getMillsDiffOrZero(timestamp)),
    updateInterval,
    {
      immediately
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
};
